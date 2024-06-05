import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Navigation from "./utils/Navigation";
import {
  Provider
} from "react-redux";
import store from "./utils/Store";
import {GestureHandlerRootView} from 'react-native-gesture-handler';

export default function App() {
  return (
      <GestureHandlerRootView>
        <Provider store={store}>
          <Navigation />
        </Provider>
      </GestureHandlerRootView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
