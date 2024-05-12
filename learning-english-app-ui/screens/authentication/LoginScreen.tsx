import {
    Dimensions,
    ImageBackground,
    KeyboardAvoidingView,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    TouchableOpacity
} from "react-native";
import {GlobalStyles} from "../../styles/GlobalStyles";
import {
    Block,
    Button,
    // @ts-ignore
    Checkbox,
    Icon,
    Input,
    Text,
    theme
} from "galio-framework";
import Images from "../../utils/Images";
import React, {useState} from "react";
import {useFormik} from "formik";
import RegisterDto from "../../dto/authdto/registerDto";
import {authReducer} from "../../features/authentication/AuthenticationSlice";
import {register} from "../../services/AuthenticationService";
import * as Yup from "yup";
import LoginDto from "../../dto/authdto/loginDto";

const {width, height} = Dimensions.get("screen");

const LoginScreen = () => {

    // show password state
    const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

    // validate login form
    const signinSchema = Yup.object().shape({
        email: Yup.string()
            .email('Invalid email')
            .required('Email is required'),
        password: Yup.string()
            .required('Password is required')
    });

    // form handler using Formik
    const {handleChange, handleBlur, handleSubmit, values, errors} = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: signinSchema,
        onSubmit: (data: LoginDto) => {
            console.log(data);
        },
    });

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
                        <Block style={styles.loginContainer}>
                            <Block flex={0.25} middle style={styles.socialConnect}>
                                <Text color="#8898AA" size={12}>
                                    Sign in with
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
                                        Or sign in the classic way
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
                                                value={values.email}
                                                onChangeText={handleChange("email")}
                                            />
                                        </Block>
                                        {errors.email && <Text size={12} color={'red'}>{errors.email}</Text>}
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
                                                value={values.password}
                                                onChangeText={handleChange("password")}
                                            />
                                        </Block>
                                        {errors.password && <Text size={12} color={'red'}>{errors.password}</Text>}
                                        <Block right>
                                            <TouchableOpacity>
                                                <Text italic={true} bold={true} size={14}>Fotgot password?</Text>
                                            </TouchableOpacity>
                                        </Block>
                                        <Block>

                                        </Block>
                                        <Block middle>
                                            <Button color="primary" style={styles.createButton} onPress={handleSubmit}>
                                                <Text  size={12} color={theme.COLORS?.WHITE}>
                                                    LOGIN
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
    loginContainer: {
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

export default LoginScreen;
