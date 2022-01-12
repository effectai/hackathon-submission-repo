import "@babel/polyfill";
import dotenv from "dotenv";
import "isomorphic-fetch";
import createShopifyAuth, { verifyRequest } from "@shopify/koa-shopify-auth";
import Shopify, { ApiVersion, DataType } from "@shopify/shopify-api";
import Koa from "koa";
import next from "next";
import Router from "koa-router";
import Redis from "ioredis";
import { client } from "./helpers.js";
import { gql } from "@apollo/client";
import jwt from "jsonwebtoken";
import koaBody from "koa-body";

dotenv.config();
const port = parseInt(process.env.PORT, 10) || 8081;
const dev = process.env.NODE_ENV !== "production";
const app = next({
  dev,
});
const handle = app.getRequestHandler();
const redis = new Redis(process.env.REDIS_HOST);

Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: ["write_products"],
  HOST_NAME: process.env.HOST.replace(/https:\/\/|\/$/g, ""),
  API_VERSION: ApiVersion.October21,
  IS_EMBEDDED_APP: true,
  SESSION_STORAGE: new Shopify.Session.CustomSessionStorage(
    (session) =>
      redis.set(session.id, JSON.stringify(session)).then(() => true),
    (session_id) =>
      redis
        .get(session_id)
        .then((data) => (data ? JSON.parse(data) : undefined)),
    (session_id) => redis.del(session_id).then(() => true)
  ),
});

const uninstallWebhookHandler = (_topic, shop, _body) =>
  client().mutate({
    mutation: gql`
      mutation($shop: String!) {
        delete_shops_by_pk(id: $shop) {
          id
        }
      }
    `,
    variables: {
      shop,
    },
  });

const collectionWebhookHandler = async (_topic, shop, _body) => {
  const session = await Shopify.Utils.loadOfflineSession(shop);
  const shopify_client = new Shopify.Clients.Rest(
    session.shop,
    session.accessToken
  );
  const {
    body: { custom_collections },
  } = await shopify_client.get({
    path: "custom_collections",
    query: {
      published_status: "published",
    },
  });

  await client().mutate({
    mutation: gql`
      mutation($shop: String!, $collections: jsonb) {
        update_shops_by_pk(
          pk_columns: { id: $shop }
          _set: { collections: $collections }
        ) {
          id
        }
      }
    `,
    variables: {
      shop,
      collections: custom_collections.map((collection) => ({
        id: collection.id,
        title: collection.title,
      })),
    },
  });
};

Shopify.Webhooks.Registry.webhookRegistry.push({
  path: "/webhooks",
  topic: "APP_UNINSTALLED",
  webhookHandler: uninstallWebhookHandler,
});

Shopify.Webhooks.Registry.webhookRegistry.push({
  path: "/webhooks",
  topic: "COLLECTIONS_CREATE",
  webhookHandler: collectionWebhookHandler,
});

Shopify.Webhooks.Registry.webhookRegistry.push({
  path: "/webhooks",
  topic: "COLLECTIONS_UPDATE",
  webhookHandler: collectionWebhookHandler,
});

Shopify.Webhooks.Registry.webhookRegistry.push({
  path: "/webhooks",
  topic: "COLLECTIONS_DELETE",
  webhookHandler: collectionWebhookHandler,
});

app.prepare().then(async () => {
  const server = new Koa();
  const router = new Router();
  server.keys = [Shopify.Context.API_SECRET_KEY];
  server.use(
    createShopifyAuth({
      accessMode: "offline",
      async afterAuth(ctx) {
        const { shop, accessToken } = ctx.state.shopify;
        const host = ctx.query.host;

        const shopify_client = new Shopify.Clients.Rest(shop, accessToken);
        const {
          body: { custom_collections },
        } = await shopify_client.get({
          path: "custom_collections",
          query: {
            published_status: "published",
          },
        });
        await client().mutate({
          mutation: gql`
            mutation($shop: String, $accessToken: String, $collections: jsonb) {
              insert_shops_one(
                object: {
                  id: $shop
                  accessToken: $accessToken
                  collections: $collections
                }
                on_conflict: {
                  constraint: shops_pkey
                  update_columns: [accessToken, collections]
                }
              ) {
                id
              }
            }
          `,
          variables: {
            shop,
            accessToken,
            collections: custom_collections.map((collection) => ({
              id: collection.id,
              title: collection.title,
            })),
          },
        });

        await Shopify.Webhooks.Registry.register({
          shop,
          accessToken,
          path: "/webhooks",
          topic: "APP_UNINSTALLED",
          webhookHandler: uninstallWebhookHandler,
        });

        await Shopify.Webhooks.Registry.register({
          shop,
          accessToken,
          path: "/webhooks",
          topic: "COLLECTIONS_CREATE",
          webhookHandler: collectionWebhookHandler,
        });

        await Shopify.Webhooks.Registry.register({
          shop,
          accessToken,
          path: "/webhooks",
          topic: "COLLECTIONS_UPDATE",
          webhookHandler: collectionWebhookHandler,
        });

        await Shopify.Webhooks.Registry.register({
          shop,
          accessToken,
          path: "/webhooks",
          topic: "COLLECTIONS_DELETE",
          webhookHandler: collectionWebhookHandler,
        });

        ctx.redirect(`/?shop=${shop}&host=${host}`);
      },
    })
  );

  const handleRequest = async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  };

  router.post("/webhooks", async (ctx) => {
    try {
      await Shopify.Webhooks.Registry.process(ctx.req, ctx.res);
      console.log(`Webhook processed, returned status code 200`);
    } catch (error) {
      console.log(`Failed to process webhook: ${error}`);
    }
  });

  router.get(
    "/jwt",
    verifyRequest({ returnHeader: true, accessMode: "offline" }),
    async (ctx) => {
      const session = await Shopify.Utils.loadCurrentSession(
        ctx.req,
        ctx.res,
        false
      );
      const token = jwt.sign(
        {
          "https://hasura.io/jwt/claims": {
            "x-hasura-allowed-roles": ["merchant"],
            "x-hasura-default-role": "merchant",
            "x-hasura-shop": session.shop,
          },
        },
        process.env.HASURA_JWT_SECRET
      );
      ctx.body = {
        token,
      };
    }
  );

  router.get(
    "/credits/add",
    verifyRequest({ returnHeader: true, accessMode: "offline" }),
    async (ctx) => {
      let quantity = parseInt(ctx.query.quantity);
      if (quantity < 20 || quantity > 1000) quantity = 20;

      const session = await Shopify.Utils.loadCurrentSession(
        ctx.req,
        ctx.res,
        false
      );
      const shopify_client = new Shopify.Clients.Rest(
        session.shop,
        session.accessToken
      );
      await shopify_client
        .post({
          path: "application_charges",
          data: {
            application_charge: {
              name: `Recategorize ${quantity} products`,
              price: quantity / 20,
              return_url: `${process.env.HOST}/credits/confirm?shop=${session.shop}`,
              test: true,
            },
          },
          type: DataType.JSON,
        })
        .then(({ body }) => {
          ctx.body = {
            confirmation_url: body.application_charge.confirmation_url,
          };
        });
    }
  );

  router.get("/credits/confirm", async (ctx) => {
    const charge_id = ctx.query.charge_id;
    const shop = ctx.query.shop;

    const session = await Shopify.Utils.loadOfflineSession(shop);
    const shopify_client = new Shopify.Clients.Rest(
      session.shop,
      session.accessToken
    );
    const charge = await shopify_client
      .get({
        path: `application_charges/${charge_id}`,
      })
      .then(({ body }) => body.application_charge);
    if (charge.status === "active") {
      await client().mutate({
        mutation: gql`
          mutation($shop: String, $charge_id: bigint, $amount: Int) {
            insert_credits_one(
              object: { amount: $amount, charge_id: $charge_id, shop: $shop }
              on_conflict: {
                constraint: credits_charge_id_key
                update_columns: amount
              }
            ) {
              id
            }
          }
        `,
        variables: {
          shop,
          charge_id,
          amount: parseFloat(charge.price) * 20,
        },
      });
      ctx.type = "html";
      ctx.body = `
        <script>
          window.close();
        </script>
        Paid! You can now close this windows.
      `;
    } else {
      ctx.status = 401;
    }
  });

  router.get(
    "/requests/new",
    verifyRequest({ returnHeader: true, accessMode: "offline" }),
    async (ctx) => {
      const session = await Shopify.Utils.loadCurrentSession(
        ctx.req,
        ctx.res,
        false
      );
      const {
        data: {
          credits_aggregate: {
            aggregate: {
              sum: { amount },
            },
          },
        },
      } = await client().query({
        query: gql`
          query($shop: String) {
            credits_aggregate(where: { shop: { _eq: $shop } }) {
              aggregate {
                sum {
                  amount
                }
              }
            }
          }
        `,
        variables: {
          shop: session.shop,
        },
      });
      if (amount < 1) {
        ctx.status = 401;
        return;
      }
      const shopify_client = new Shopify.Clients.Rest(
        session.shop,
        session.accessToken
      );
      const {
        body: { product },
      } = await shopify_client.get({
        path: "products/" + ctx.query.id,
      });
      const {
        body: { custom_collections },
      } = await shopify_client.get({
        path: "custom_collections",
        query: { product_id: ctx.query.id },
      });
      await client().mutate({
        mutation: gql`
          mutation($shop: String, $amount: Int) {
            insert_credits(objects: { shop: $shop, amount: $amount }) {
              returning {
                id
              }
            }
          }
        `,
        variables: {
          shop: session.shop,
          amount: -1,
        },
      });
      await client().mutate({
        mutation: gql`
          mutation(
            $shop: String
            $product_id: bigint
            $product_handle: String
            $product_title: String
            $product_images: jsonb
            $product_collections: jsonb
            $status: String
          ) {
            insert_requests(
              objects: {
                shop: $shop
                product_id: $product_id
                product_handle: $product_handle
                product_title: $product_title
                product_images: $product_images
                product_collections: $product_collections
                status: $status
              }
            ) {
              returning {
                id
              }
            }
          }
        `,
        variables: {
          shop: session.shop,
          product_id: product.id,
          product_handle: product.handle,
          product_title: product.title,
          product_images: product.images.map((image) => image.src),
          product_collections: custom_collections.map((collection) => ({
            id: collection.id,
            title: collection.title,
          })),
          status: "pending",
        },
      });
      ctx.status = 201;
    }
  );

  router.post(
    "/requests/apply",
    verifyRequest({ returnHeader: true, accessMode: "offline" }),
    koaBody(),
    async (ctx) => {
      const session = await Shopify.Utils.loadCurrentSession(
        ctx.req,
        ctx.res,
        false
      );
      const shopify_client = new Shopify.Clients.Rest(
        session.shop,
        session.accessToken
      );
      const requests = ctx.request.body.requests;
      for (const request of requests) {
        const {
          body: { collects },
        } = await shopify_client.get({
          path: "collects",
          query: { product_id: request.product_id },
        });
        for (const collect of collects) {
          await shopify_client.delete({
            path: "collects/" + collect.id,
          });
        }
        for (const collection of request.results) {
          await shopify_client.post({
            path: "collects",
            data: {
              collect: {
                product_id: request.product_id,
                collection_id: collection.id,
              },
            },
            type: DataType.JSON,
          });
        }
      }
      await client().mutate({
        mutation: gql`
          mutation($ids: [uuid!]) {
            update_requests(
              where: { id: { _in: $ids } }
              _set: { status: "done" }
            ) {
              affected_rows
            }
          }
        `,
        variables: {
          ids: requests.map((req) => req.id),
        },
      });
      ctx.status = 201;
    }
  );

  router.get("(/_next/static/.*)", handleRequest);
  router.get("(/assets/.*)", handleRequest);
  router.get("/_next/webpack-hmr", handleRequest);
  router.get("(.*)", async (ctx) => {
    const shop = ctx.query.shop;
    const host = ctx.query.host;

    if (!shop || !host) ctx.status = 401;
    else if (
      await client()
        .query({
          query: gql`
            query($shop: String!) {
              shops_by_pk(id: $shop) {
                id
              }
            }
          `,
          variables: {
            shop,
          },
        })
        .then(({ data: { shops_by_pk } }) => !shops_by_pk)
    )
      ctx.redirect(`/auth?shop=${shop}`);
    else await handleRequest(ctx);
  });

  server.use(router.allowedMethods());
  server.use(router.routes());
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
