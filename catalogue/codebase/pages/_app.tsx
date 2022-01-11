import { AppProvider } from "@shopify/polaris";
import { Provider, useAppBridge } from "@shopify/app-bridge-react";
import { authenticatedFetch } from "@shopify/app-bridge-utils";
import { Redirect } from "@shopify/app-bridge/actions";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import App from "next/app";
import { useEffect, useState } from "react";
import { WebSocketLink } from "@apollo/client/link/ws";
import translations from "@shopify/polaris/locales/en.json";
import "@shopify/polaris/build/esm/styles.css";
import "./styles.css";

interface Props {
  host: string;
}

declare var API_KEY: string;
declare var HASURA_INSTANCE: string;

function userLoggedInFetch(app) {
  const fetchFunction = authenticatedFetch(app);

  return async (uri, options?) => {
    const response = await fetchFunction(uri, options);

    if (
      response.headers.get("X-Shopify-API-Request-Failure-Reauthorize") === "1"
    ) {
      const authUrlHeader = response.headers.get(
        "X-Shopify-API-Request-Failure-Reauthorize-Url"
      );

      const redirect = Redirect.create(app);
      redirect.dispatch(Redirect.Action.APP, authUrlHeader || `/auth`);
      return null;
    }

    return response;
  };
}

function MyProvider(props) {
  const app = useAppBridge();
  const [client, setClient] = useState(null);

  useEffect(() => {
    userLoggedInFetch(app)("/jwt").then(async (res) =>
      setClient(
        new ApolloClient({
          link: new WebSocketLink({
            uri: `wss://${HASURA_INSTANCE}/v1/graphql`,
            options: {
              reconnect: true,
              connectionParams: {
                headers: {
                  Authorization: `Bearer ${(await res.json()).token}`,
                },
              },
            },
          }),
          cache: new InMemoryCache(),
        })
      )
    );
  }, []);

  const Component = props.Component;

  if (!client) return <></>;

  return (
    <ApolloProvider client={client}>
      <Component {...props} />
    </ApolloProvider>
  );
}

class MyApp extends App<Props> {
  render() {
    const { Component, pageProps, host } = this.props;
    return (
      <AppProvider i18n={translations}>
        <Provider
          config={{
            apiKey: API_KEY,
            host: host,
            forceRedirect: true,
          }}
        >
          <MyProvider Component={Component} {...pageProps} />
        </Provider>
      </AppProvider>
    );
  }
}

MyApp.getInitialProps = async (context) => {
  return {
    ...(await App.getInitialProps(context)),
    host: context.ctx.query.host,
  };
};

export default MyApp;
