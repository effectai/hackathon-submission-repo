import { ApolloClient, InMemoryCache } from "@apollo/client";
import { createHttpLink } from "apollo-link-http";

let apollo_client;
export const client = () => {
  if (!apollo_client)
    apollo_client = new ApolloClient({
      link: createHttpLink({
        uri: `https://${process.env.HASURA_INSTANCE}/v1/graphql`,
        headers: {
          "X-Hasura-Admin-Secret": process.env.HASURA_ADMIN_SECRET,
        },
      }),
      cache: new InMemoryCache(),
      defaultOptions: {
        watchQuery: {
          fetchPolicy: "no-cache",
          errorPolicy: "ignore",
        },
        query: {
          fetchPolicy: "no-cache",
          errorPolicy: "all",
        },
      },
    });
  return apollo_client;
};
