import React, {useState} from "react";
import {
    Dimensions,
    ImageBackground,
    SafeAreaView, StatusBar
} from "react-native";
import {GlobalStyles} from "../../styles/GlobalStyles";
import Images from "../../utils/Images";
import {
    Block,
    Button,
    Text,
    theme
} from "galio-framework";
import { LogBox } from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from "react-redux";
import {authReducer} from "../../features/authentication/AuthenticationSlice";

const {width, height} = Dimensions.get("screen");

const WellcomeScreen = () => {

    LogBox.ignoreAllLogs();

    const navigation: any = useNavigation();

    const dispatch = useDispatch();

    const handleNavigateToRegister = () => {
        dispatch(authReducer.actions.resetAllInitialState());
        navigation.navigate('RegisterScreen');
    }

    const handleNavigateToLogin = () => {
        navigation.navigate('LoginScreen');
    }


    return (
        <SafeAreaView style={
            [
                GlobalStyles.AndroidSafeArea
            ]
        }>
            <Block flex>
                <StatusBar hidden/>
                <ImageBackground
                    source={Images.WelcomeBackground}
                    style={{width, height, zIndex: 1}}
                >
                    <Block flex middle>
                        <Block style={
                            [
                                {marginTop: height * 0.6,}
                            ]
                        }>
                            <Button size={"large"}
                                    onPress={handleNavigateToRegister}>
                                <Text>REGISTER NOW</Text>
                            </Button>
                            <Button size={"large"}
                                    onPress={handleNavigateToLogin}>
                                <Text>LOGIN NOW</Text>
                            </Button>
                        </Block>
                    </Block>
                </ImageBackground>
            </Block>
        </SafeAreaView>
    );
}

export default WellcomeScreen;
