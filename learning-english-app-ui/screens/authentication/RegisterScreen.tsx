import {
    SafeAreaView,
    StyleSheet,
    ImageBackground,
    Dimensions,
    StatusBar,
    KeyboardAvoidingView
} from 'react-native';
import React, {
    useEffect,
    useState
} from 'react';
import {GlobalStyles} from "../../styles/GlobalStyles";

import {
    Block,
    Text,
    Button,
    Icon,
    theme,
    Input,
    // @ts-ignore
    Checkbox
} from 'galio-framework';
import Images from "../../utils/Images";

const {width, height} = Dimensions.get("screen");

const RegisterScreen = () => {

    const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

    return (

        <SafeAreaView style={
            [
                GlobalStyles.AndroidSafeArea
            ]
        }>

            <Block flex middle>
                <StatusBar hidden/>
                <ImageBackground
                    source={Images.RegisterBackground}
                    style={{width, height, zIndex: 1}}
                >
                    <Block safe flex middle>
                        <Block style={styles.registerContainer}>
                            <Block flex={0.25} middle style={styles.socialConnect}>
                                <Text color="#8898AA" size={12}>
                                    Sign up with
                                </Text>
                                <Block row style={{marginTop: theme.SIZES?.BASE}}>
                                    <Button style={{...styles.socialButtons, marginRight: 30}}>
                                        <Block row>
                                            <Icon
                                                name="facebook-square"
                                                family="AntDesign"
                                                size={16}
                                                color={"black"}
                                                style={{marginTop: 2, marginRight: 5}}
                                            />
                                            <Text style={styles.socialTextButtons}>FACEBOOK</Text>
                                        </Block>
                                    </Button>
                                    <Button style={styles.socialButtons}>
                                        <Block row>
                                            <Icon
                                                name="google"
                                                family="AntDesign"
                                                size={16}
                                                color={"black"}
                                                style={{marginTop: 2, marginRight: 5}}
                                            />
                                            <Text style={styles.socialTextButtons}>GOOGLE</Text>
                                        </Block>
                                    </Button>
                                </Block>
                            </Block>
                            <Block flex>
                                <Block flex={0.17} middle>
                                    <Text color="#8898AA" size={12}>
                                        Or sign up the classic way
                                    </Text>
                                </Block>
                                <Block flex center>
                                    <KeyboardAvoidingView
                                        style={{flex: 1}}
                                        behavior="padding"
                                        enabled
                                    >
                                        <Block width={width * 0.8} style={{marginBottom: 15}}>
                                            <Input
                                                borderless
                                                placeholder="Name"
                                                iconContent={
                                                    <Icon
                                                        size={16}
                                                        color={theme.COLORS?.ICON}
                                                        name="graduation-cap"
                                                        family="Entypo"
                                                        style={styles.inputIcons}
                                                    />
                                                }
                                            />
                                        </Block>
                                        <Block width={width * 0.8} style={{marginBottom: 15}}>
                                            <Input
                                                borderless
                                                placeholder="Email"
                                                iconContent={
                                                    <Icon
                                                        size={16}
                                                        color={theme.COLORS?.ICON}
                                                        name="email"
                                                        family="MaterialIcons"
                                                        style={styles.inputIcons}
                                                    />
                                                }
                                            />
                                        </Block>
                                        <Block width={width * 0.8}>
                                            <Input
                                                password
                                                viewPass={!passwordVisible}
                                                borderless
                                                placeholder="Password"
                                                iconContent={
                                                    <Icon
                                                        size={16}
                                                        color={theme.COLORS?.ICON}
                                                        name='lock'
                                                        family="AntDesign"
                                                        style={styles.inputIcons}
                                                        onPress={() => setPasswordVisible(!passwordVisible)}
                                                    />
                                                }
                                            />
                                            <Block row style={styles.passwordCheck}>
                                                <Text size={12} color={theme.COLORS?.MUTED}>
                                                    password strength:
                                                </Text>
                                                <Text bold size={12} color={theme.COLORS?.SUCCESS}>
                                                    {" "}
                                                    strong
                                                </Text>
                                            </Block>
                                        </Block>
                                        <Block row width={width * 0.75}>
                                            <Checkbox
                                                checkboxStyle={{
                                                    borderWidth: 3
                                                }}
                                                color={theme.COLORS?.PRIMARY}
                                                label="I agree with the"
                                            />
                                            <Button
                                                style={{width: 100}}
                                                color="transparent"
                                                textStyle={{
                                                    color: theme.COLORS?.PRIMARY,
                                                    fontSize: 14
                                                }}
                                            >
                                                Privacy Policy
                                            </Button>
                                        </Block>
                                        <Block middle>
                                            <Button color="primary" style={styles.createButton}>
                                                <Text bold size={14} color={theme.COLORS?.WHITE}>
                                                    CREATE ACCOUNT
                                                </Text>
                                            </Button>
                                        </Block>
                                    </KeyboardAvoidingView>
                                </Block>
                            </Block>
                        </Block>
                    </Block>
                </ImageBackground>
            </Block>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    registerContainer: {
        width: width * 0.9,
        height: height * 0.875,
        backgroundColor: "#F4F5F7",
        borderRadius: 4,
        shadowColor: theme.COLORS?.BLACK,
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowRadius: 8,
        shadowOpacity: 0.1,
        elevation: 1,
        overflow: "hidden"
    },
    socialConnect: {
        backgroundColor: theme.COLORS?.WHITE,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: "#8898AA"
    },
    socialButtons: {
        width: 120,
        height: 40,
        backgroundColor: "#fff",
        shadowColor: theme.COLORS?.BLACK,
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowRadius: 8,
        shadowOpacity: 0.1,
        elevation: 1
    },
    socialTextButtons: {
        color: theme.COLORS?.PRIMARY,
        fontWeight: "800",
        fontSize: 14
    },
    inputIcons: {
        marginRight: 12
    },
    passwordCheck: {
        paddingLeft: 15,
        paddingTop: 13,
        paddingBottom: 30
    },
    createButton: {
        width: width * 0.5,
        marginTop: 25
    }
});


export default RegisterScreen;
