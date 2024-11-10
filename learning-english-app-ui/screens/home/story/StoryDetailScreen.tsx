import {SafeAreaView, ScrollView, TouchableOpacity, View} from "react-native";
import {GlobalStyles} from "../../../styles/GlobalStyles";
import {Block, Text} from "galio-framework";
import React from "react";
import {useNavigation} from "@react-navigation/native";
// @ts-ignore
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

const StoryDetailScreen = () => {

    const navigation = useNavigation();

    const backButton = () => {
        navigation.goBack();
    }

    return (
      <SafeAreaView style={GlobalStyles.AndroidSafeArea}>
          <Block style={GlobalStyles.main_container} flexDirection="row" justifyContent="space-between"
                 alignItems="center">
              <TouchableOpacity onPress={backButton}>
                  <Text size={18}> <SimpleLineIcons name="arrow-left" size={18}/> </Text>
              </TouchableOpacity>
              <View>
              </View>
              <View>
                  <Text size={20}> </Text>
              </View>
          </Block>
          <Block height={12}></Block>
          <Block style={GlobalStyles.under_line}></Block>
          <ScrollView>
              <View style={GlobalStyles.main_container}>
                  <Text></Text>
              </View>
          </ScrollView>
      </SafeAreaView>
    );
}

export default StoryDetailScreen;

