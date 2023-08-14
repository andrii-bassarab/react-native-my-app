# Doorways App

## Prerequisites

Recomended to read [React native setup environment](https://reactnative.dev/docs/environment-setup)
- [Node.js > 12](https://nodejs.org) (recomended version 14.20.0) and npm (Recommended: Use [nvm](https://github.com/nvm-sh/nvm))
- [Watchman](https://facebook.github.io/watchman)
- [Xcode 14.3](https://developer.apple.com/xcode)
- [Cocoapods 1.12.1](https://cocoapods.org)
- [Ruby 2.7.4](https://www.ruby-lang.org/)
- [JDK > 11](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html)
- [Android Studio and Android SDK](https://developer.android.com/studio) (Recomended Gradle Version - 7.3.3)

## Base dependencies

- [react-native] (https://reactnative.dev/) for building application for IOS and Android
- [react-navigation](https://reactnavigation.org/) navigation library.
- [apollo-client](https://www.apollographql.com/docs/react/) for networking.
- [redux](https://redux.js.org/) for state management.
- [redux-saga](https://redux-saga.js.org/) for side effect managment.
- [redux-persist](https://github.com/rt2zz/redux-persist) as persistance layer.
- [redux-thunk](https://github.com/gaearon/redux-thunk) to dispatch asynchronous actions.

To run project local you should clone project, than:

- Go to your project's root folder and run `npm install`.
- Go to 'ios' folder and run `pod install`.
- Recomended to run project by XCode for IOS and by Android Studio for Android devices!