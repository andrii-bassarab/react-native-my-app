import "react-native-gesture-handler";
import React, { useEffect } from "react";
import { initialWindowMetrics, SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "~/store";
import { App } from "~/view/components/App";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
  split,
  ApolloLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getMainDefinition } from "@apollo/client/utilities";
import { RetryLink } from "@apollo/client/link/retry";

const maintenanceHttpLink = createHttpLink({
  uri: "https://cloudstack-dev.doorways-services.net/maintenance/graphql",
});

const occupancyHttpLink = createHttpLink({
  uri: "https://cloudstack-dev.doorways-services.net/occupancy/graphql/",
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      "x-api-key": "GPK7qlm8VeZrxOQ18Gxh9VqnlHCCyUl5PBNjXZ69",
      "x-site-id": "pfdylv",
      "Content-Type": "application/json",
    },
  };
});

const directionalLink = new RetryLink().split(
  (operation) => operation.getContext().version === 1,
  createHttpLink({ uri: "https://cloudstack-dev.doorways-services.net/occupancy/graphql/" }),
  createHttpLink({ uri: "https://cloudstack-dev.doorways-services.net/maintenance/graphql" })
);

const httpLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === "OperationDefinition" && definition.operation === "query";
  },
  maintenanceHttpLink,
  occupancyHttpLink,
);

const client = new ApolloClient({
  link: authLink.concat(maintenanceHttpLink), // authLink.concat(directionalLink),  //ApolloLink.from([authLink, directionalLink]), //link: ApolloLink.from([authLink, httpLink]), //authLink.concat(httpLink)
  cache: new InMemoryCache(),
});

const RootApp: React.FC = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ApolloProvider client={client}>
        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
          <App />
        </SafeAreaProvider>
      </ApolloProvider>
    </PersistGate>
  </Provider>
);

export default RootApp;
