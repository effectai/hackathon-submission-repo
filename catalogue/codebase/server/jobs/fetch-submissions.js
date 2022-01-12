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
        requests(where: { status: { _eq: "in_progress" } }) {
          id
          leaf_hash
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
    for (const request of requests) {
      const result = await effectClient.force.getTaskResult(
        request.leaf_hash.substring(2)
      );
      if (result?.data) {
        await client().mutate({
          mutation: gql`
            mutation($id: uuid!, $results: jsonb) {
              update_requests_by_pk(
                pk_columns: { id: $id }
                _set: { status: "under_review", results: $results }
              ) {
                id
              }
            }
          `,
          variables: {
            id: request.id,
            results: JSON.parse(result.data).selected.map((id) => ({
              id: parseInt(id),
              title:
                request.shop_details.collections.find(
                  (collection) => collection.id === parseInt(id)
                )?.title || "Deleted collection",
            })),
          },
        });
      }
    }
  }
  process.exit(0);
};

job();
