import React from 'react';
import {View, TouchableOpacity} from 'react-native';
// @ts-ignore
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Block, Text} from "galio-framework";
import {GlobalStyles} from "../styles/GlobalStyles";
import {useNavigation} from "@react-navigation/native";


export default function FooterComponent() {

    const navigation = useNavigation();

    const navigateToHomeScreen = () =>{
        // @ts-ignore
        navigation.navigate("HomeScreen");
    }

    const navigateToVocabScreen = () => {
        // @ts-ignore
        navigation.navigate("VocabMainScreen")
    }
    return (
        <View>
            <Block flexDirection="row" justifyContent="space-around" alignItems="center" height={60}>
                <TouchableOpacity onPress={navigateToHomeScreen} >
                    <Block flexDirection="column" justifyContent="center" alignItems="center">
                        <Icon name="home" size={24} color="black"/>
                        <Text size={14}>Home</Text>
                    </Block>
                </TouchableOpacity>
                <TouchableOpacity onPress={navigateToVocabScreen} >
                    <Block flexDirection="column" justifyContent="center" alignItems="center">
                        <Icon name="book" size={24} color="black"/>
                        <Text size={14}>Your vocab</Text>
                    </Block>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Block flexDirection="column" justifyContent="center" alignItems="center">
                        <Icon name="account-settings" size={24} color="black"/>
                        <Text size={14}>Account</Text>
                    </Block>
                </TouchableOpacity>
            </Block>
        </View>
    );
}



