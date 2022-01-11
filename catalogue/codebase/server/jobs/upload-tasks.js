import process from "node:process";
import "isomorphic-fetch";
import { client } from "../helpers";
import { gql } from "@apollo/client";
import { EffectClient, createAccount, createWallet } from "@effectai/effect-js";

const job = async () => {
  const {
    data: { requests },
  } = await client().query({
    query: gql`
      query {
        requests(where: { status: { _eq: "pending" } }, limit: 20) {
          id
          shop
          product_images
          product_title
          product_handle
          shop_details {
            collections
          }
        }
      }
    `,
  });
  if (requests.length > 0) {
    const effectClient = new EffectClient("jungle");
    const account = createAccount(process.env.EFFECT_PRIVATE_KEY);
    const web3 = createWallet(account);
    await effectClient.connectAccount(web3);
    const tasks = requests.map((request) => ({
      id: request.id,
      images: request.product_images,
      title: request.product_title,
      link: `https://${request.shop}/products/${request.product_handle}`,
      search: `https://www.google.com/search?q=${encodeURIComponent(
        request.product_title
      )}`,
      collections: request.shop_details.collections,
    }));
    const batch = await effectClient.force.createBatch(
      parseInt(process.env.EFFECT_CAMPAIGN_ID),
      {
        tasks,
      },
      1
    );
    for (const index in tasks) {
      await client().mutate({
        mutation: gql`
          mutation($id: uuid!, $leaf_hash: String, $batch_id: bigint) {
            update_requests_by_pk(
              pk_columns: { id: $id }
              _set: {
                status: "in_progress"
                leaf_hash: $leaf_hash
                batch_id: $batch_id
              }
            ) {
              id
            }
          }
        `,
        variables: {
          id: tasks[index].id,
          batch_id: batch.id,
          leaf_hash: batch.leaves[index],
        },
      });
    }
  }
  process.exit(0);
};

job();
