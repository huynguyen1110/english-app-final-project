import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
// @ts-ignore
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Block} from "galio-framework";
import {GlobalStyles} from "../styles/GlobalStyles";


export default function FooterComponent() {
    return (
        <View>
            <Block style={ [GlobalStyles.under_line] }></Block>
            <Block flexDirection="row" justifyContent="space-around" alignItems="center" height={60}>
                <TouchableOpacity>
                    <Text>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text>Your vocab</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text>Settings</Text>
                </TouchableOpacity>
            </Block>
        </View>
    );
}



