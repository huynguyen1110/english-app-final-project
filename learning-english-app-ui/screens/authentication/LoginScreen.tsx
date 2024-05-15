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
    theme, Toast
} from "galio-framework";
import Images from "../../utils/Images";
import React, {useEffect, useState} from "react";
import {useFormik} from "formik";
import RegisterDto from "../../dto/authdto/registerDto";
import {authReducer} from "../../features/authentication/AuthenticationSlice";
import {addToken, login, register} from "../../services/AuthenticationService";
import * as Yup from "yup";
import LoginDto from "../../dto/authdto/loginDto";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../utils/Store";
import {useNavigation} from "@react-navigation/native";
import Spinner from "react-native-loading-spinner-overlay";

const {width, height} = Dimensions.get("screen");

const LoginScreen = () => {

    // show password state
    const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

    const [isShowLoginErr, setShowLoginErr] = useState<boolean>(false);

    const [isShowLoginsucess, setShowLoginsucess] = useState<boolean>(false);

    const [loading, setLoading] = useState<boolean>(false);

    const navigation: any = useNavigation();

    const loginState = useSelector((state: RootState) => state.authentication.isAuthenticated);

    const isSubmitClickedState = useSelector((state: RootState) => state.authentication.isSubmitting);

    const dispatch = useDispatch();

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
            dispatch(authReducer.actions.resetAllInitialState());
            dispatch(authReducer.actions.setStateIsSubmiting(true));
            // @ts-ignore
            dispatch(login(data)).then((response) => {
                try {
                    if (response.payload) {
                        if (response.payload.accessToken) {
                            dispatch(authReducer.actions.setIsAuthenticatedState(true));
                            // @ts-ignore
                            dispatch(addToken(response.payload.accessToken));
                        } else {
                            dispatch(authReducer.actions.setIsAuthenticatedState(false));
                        }
                    } else {
                        dispatch(authReducer.actions.setIsAuthenticatedState(false));
                    }
                } catch (err) {
                    console.log(err);
                }
            })
        },
    });

    // set displaying alert for 3 seconds
    // useEffect(() => {
    //     if (isSubmitClickedState) {
    //         let timer: any;
    //         if (loginState) {
    //             setShowLoginErr(false);
    //             setShowLoginsucess(true);
    //             setLoading(true);
    //             timer = setTimeout(() => {
    //                 setShowLoginsucess(false);
    //                 navigation.navigate('HomeScreen');
    //                 setLoading(false);
    //             }, 3000);
    //         } else {
    //             setShowLoginsucess(false);
    //             setShowLoginErr(true);
    //             setLoading(true);
    //             timer = setTimeout(() => {
    //                 setShowLoginErr(false);
    //                 setLoading(false);
    //             }, 3000);
    //         }
    //         return () => clearTimeout(timer);
    //     }
    // }, [loginState]);

    useEffect(() => {
        if (isSubmitClickedState) {
            let timer1: any, timer2: any;
            if (loginState !== null) {
                if (loginState) {
                    setShowLoginErr(false);
                    setLoading(true);
                    timer1 = setTimeout(() => {
                        setLoading(false);
                        setShowLoginsucess(true);

                        timer2 = setTimeout(() => {
                            setShowLoginsucess(false);
                            navigation.navigate('HomeScreen');
                        }, 1000);
                    }, 2000);
                } else {
                    setShowLoginsucess(false);

                    setLoading(true);
                    timer1 = setTimeout(() => {
                        setLoading(false);
                        setShowLoginErr(true);

                        timer2 = setTimeout(() => {
                            setShowLoginErr(false);
                        }, 1000);
                    }, 2000);
                }

                return () => {
                    clearTimeout(timer1);
                    clearTimeout(timer2);
                };
            }
        }
    }, [loginState]);

    return (
        <SafeAreaView style={
            [
                GlobalStyles.AndroidSafeArea
            ]
        }>
            <Spinner visible={loading} textContent={'Loading...'} textStyle={{color: '#FFF'}}/>
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
                                    <Toast isShow={isShowLoginErr} positionIndicator="top" round={true}
                                           color="warning"> Login failed, this account is not existed </Toast>
                                    <Toast isShow={isShowLoginsucess} round={true} positionIndicator="top"
                                           color="success"> Login successfully </Toast>
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
                                                <Text size={12} color={theme.COLORS?.WHITE}>
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
