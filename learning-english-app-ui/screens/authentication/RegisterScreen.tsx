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
import * as Yup from 'yup';
import {GlobalStyles} from "../../styles/GlobalStyles";
import {
    Block,
    Text,
    Button,
    Icon,
    theme,
    Input,
    // @ts-ignore
    Checkbox,
    Toast
} from 'galio-framework';
import Images from "../../utils/Images";
import {useFormik} from "formik";
import {
    useDispatch, useSelector
} from 'react-redux';
import {register} from "../../services/AuthenticationService";
import RegisterDto from "../../dto/authdto/registerDto";
import AuthenticationSlice from "../../features/authentication/AuthenticationSlice";
import {RootState} from "../../utils/Store";


const {width, height} = Dimensions.get("screen");

const RegisterScreen = () => {

    const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

    const [isShow, setShow] = useState<boolean>(false);

    const [isShowRegisterErr, setShowRegisterErr] = useState<boolean>(false);

    const [isShowRegistersucess, setShowRegistersucess] = useState<boolean>(false);

    const [isSubmitClicked, setIsSubmitClicked] = useState<boolean>(false);

    const [passwordStrength, setPasswordStrength] = useState('');

    const registerState = useSelector((state: RootState) => state.authentication.registerSuccess);

    const dispatch = useDispatch();

    // validate input
    const signupSchema = Yup.object().shape({
        email: Yup.string()
            .email('Invalid email')
            .required('Email is required'),
        name: Yup.string().required('Name is required'),
        password: Yup.string()
            .required('Password is required')
            .matches(
                /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                'Password must contain at least one uppercase letter, one digit, and one special character'
            ),
    });

    //form handler using Formik
    const {handleChange, handleBlur, handleSubmit, values, errors} = useFormik({
        initialValues: {
            email: '',
            name: '',
            password: '',
            phoneNumber: ''
        },
        validationSchema: signupSchema,
        onSubmit: (data: RegisterDto) => {
            setIsSubmitClicked(true);
            // @ts-ignore
            dispatch(register(data))
        },
    });

    // check password strength
    const checkPasswordStrength = (password: string) => {
        let strength = '';
        if (password.length < 6) {
            strength = 'Weak';
        } else if (password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)) {
            strength = 'Strong';
        } else {
            strength = 'Moderate';
        }
        setPasswordStrength(strength);
    };

    const handlePasswordChange = (password: string) => {
        checkPasswordStrength(password);
        handleChange('password')(password);
    };

    useEffect(() => {
        if (isSubmitClicked) {
            setIsSubmitClicked(false);
            let timer;
            if (registerState) {
                setShowRegistersucess(true);
                setShowRegisterErr(false);
                timer = setTimeout(() => {
                    setShowRegistersucess(false);
                }, 3000);
            } else {
                setShowRegistersucess(false);
                setShowRegisterErr(true);
                timer = setTimeout(() => {
                    setShowRegisterErr(false);
                }, 3000);
            }
            return () => clearTimeout(timer);
        }
    }, [registerState, isSubmitClicked]);

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
                        <Toast isShow={isShowRegisterErr} positionIndicator="top" color="warning">This is a top positioned toast</Toast>
                        <Toast isShow={isShowRegistersucess} positionIndicator="top" color="success">This is a center
                            positioned
                            toast</Toast>

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
                                                value={values.name}
                                                onChangeText={handleChange('name')}
                                            />
                                            {errors.name && <Text size={12} color={'red'}>{errors.name}</Text>}
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
                                                value={values.email}
                                                onChangeText={handleChange('email')}
                                            />
                                            {errors.email && <Text size={12} color={'red'}>{errors.email}</Text>}
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
                                                value={values.password}
                                                onChangeText={handlePasswordChange}
                                            />
                                            {errors.password &&
                                                <Text size={12} color={'red'}>{errors.password}</Text>}
                                            <Block row style={styles.passwordCheck}>
                                                <Text size={12} color={theme.COLORS?.MUTED}>
                                                    password strength:
                                                </Text>
                                                <Text bold size={12}
                                                      color={passwordStrength === 'Strong' ? theme.COLORS?.SUCCESS : theme.COLORS?.WARNING}>
                                                    {` ${passwordStrength}`}
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
                                            <Button color="primary" style={styles.createButton}
                                                    onPress={handleSubmit}>
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
