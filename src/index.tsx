import "react-native-gesture-handler";
import React from "react";
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
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { API_URL, X_API_KEY, X_SIDE_ID } from "~/constants/env";

const maintenanceHttpLink = createHttpLink({
  uri: `${API_URL}/maintenance/graphql`,
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      "x-api-key": X_API_KEY,
      "x-site-id": X_SIDE_ID,
      "Content-Type": "application/json",
    },
  };
});

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
