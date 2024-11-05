import {SafeAreaView, ScrollView, TouchableOpacity, View} from "react-native";
import {GlobalStyles} from "../../styles/GlobalStyles";
import {Block, Text} from "galio-framework";
import React, {useState} from "react";
import {useNavigation, useRoute} from "@react-navigation/native";
// @ts-ignore
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

const VocabularyPackScreen = () => {

    const navigation = useNavigation();

    const router = useRoute();

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
                    <Text size={20}> Vocabulary packs </Text>
                </View>
                <View>
                    <Text size={20}> </Text>
                </View>
            </Block>
            <Block height={12}></Block>
            <Block style={GlobalStyles.under_line}></Block>
            <ScrollView>
                <View style={GlobalStyles.main_container}>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default VocabularyPackScreen;