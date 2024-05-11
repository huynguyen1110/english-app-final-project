import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Navigation from "./utils/Navigation";
import {
  Provider
} from "react-redux";
import store from "./utils/Store";

export default function App() {
  return (
      <Provider store={store}>
        <Navigation />
      </Provider>
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
