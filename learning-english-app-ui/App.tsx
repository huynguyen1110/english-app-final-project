import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Navigation from "./utils/Navigation";
import {
  Provider
} from "react-redux";
import store from "./utils/Store";
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import * as eva from '@eva-design/eva';
import {ApplicationProvider} from "@ui-kitten/components";

export default function App() {
  return (
      <ApplicationProvider {...eva} theme={eva.light}>
          <GestureHandlerRootView>
              <Provider store={store}>
                  <Navigation />
              </Provider>
          </GestureHandlerRootView>
      </ApplicationProvider>
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
