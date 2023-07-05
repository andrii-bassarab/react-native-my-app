# Doorways App

## Prerequisites

- [Node.js > 12](https://nodejs.org) and npm (Recommended: Use [nvm](https://github.com/nvm-sh/nvm))
- [Watchman](https://facebook.github.io/watchman)
- [Xcode 14.3](https://developer.apple.com/xcode)
- [Cocoapods 1.12.1](https://cocoapods.org)
- [Ruby 2.7.4](https://www.ruby-lang.org/)
- [JDK > 11](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html)
- [Android Studio and Android SDK](https://developer.android.com/studio)

## Base dependencies

- [apollo Client](https://www.apollographql.com/docs/react/) for networking.
- [react-native-config](https://github.com/luggit/react-native-config) to manage envionments.
- [react-navigation](https://reactnavigation.org/) navigation library.
- [redux](https://redux.js.org/) for state management.
- [redux-saga](https://redux-saga.js.org/) for side effect managment.
- [redux-persist](https://github.com/rt2zz/redux-persist) as persistance layer.
- [redux-thunk](https://github.com/gaearon/redux-thunk) to dispatch asynchronous actions.

To run project local you should clone project, than:

- Go to your project's root folder and run `npm install`.
- Go to 'ios' folder and run `pod install`.
- Go to root folder and run `npm run ios` or `npm run android` to start your application!