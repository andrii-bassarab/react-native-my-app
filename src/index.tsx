import "react-native-gesture-handler";
import React from "react";
import { initialWindowMetrics, SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { persistor, store } from "~/store";
import { App } from "~/view/components/App";

import { AppRegistry } from "react-native";
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { LogBox } from 'react-native';
LogBox.ignoreAllLogs(true);

const httpLink = createHttpLink({
  uri: "https://cloudstack-dev.doorways-services.net/maintenance/graphql",
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      'x-api-key': "GPK7qlm8VeZrxOQ18Gxh9VqnlHCCyUl5PBNjXZ69",
      "x-site-id": "pfdylv",
      "Content-Type": "application/json"
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
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
