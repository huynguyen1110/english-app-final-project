import React from 'react';
import {View, TouchableOpacity} from 'react-native';
// @ts-ignore
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Block, Text} from "galio-framework";
import {GlobalStyles} from "../styles/GlobalStyles";


export default function FooterComponent() {
    return (
        <View>
            <Block style={ [GlobalStyles.under_line] }></Block>
            <Block flexDirection="row" justifyContent="space-around" alignItems="center" height={60}>
                <TouchableOpacity>
                    <Block flexDirection="column" justifyContent="center" alignItems="center">
                        <Icon name="home" size={24} color="black"/>
                        <Text size={14}>Home</Text>
                    </Block>
                </TouchableOpacity>
                <TouchableOpacity>
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



