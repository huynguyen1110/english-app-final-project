import {
    Dimensions,
    ImageBackground,
    KeyboardAvoidingView,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View
} from "react-native";
import {Block, Button, Icon, Text, theme} from "galio-framework";
import {GlobalStyles} from "../../styles/GlobalStyles";
import React, {useEffect, useState} from "react";
// @ts-ignore
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {useNavigation, useRoute} from "@react-navigation/native";
import {Input} from "galio-framework";
import * as Yup from 'yup';
import {useFormik} from "formik";
import {decodeJwtToken, getJwtToken, updateUserService} from "../../services/AuthenticationService";
import Toast from 'react-native-toast-message';


const {width, height} = Dimensions.get("screen");

const UpdateUserInfoScreen = () => {

    const navigation = useNavigation();

    const router = useRoute();

    const dataParams: any = router.params;

    const [userInfo, setUserInfo] = useState<any>();

    const backButton = () => {
        navigation.goBack();
    }

    // validate input
    const updateInfoSchema = Yup.object().shape({
        phoneNumber: Yup.string()
            .matches(
                /^(?:\+84|0)(?:3[2-9]|5[6|8|9]|7[0|6-9]|8[1-6|8|9]|9[0-9])\d{7}$/,
                "Invalid phone number. Please enter a valid Vietnamese phone number."
            )
            .required("Phone number is required."),
        email: Yup.string().email("Invalid email address.").required("Email is required."),
        name: Yup.string().required("Username is required."),
        address: Yup.string().required("Address is required."),
    });

    //form handler using Formik
    const {handleChange, handleBlur, handleSubmit, values, errors} = useFormik({
        initialValues: {
            email: dataParams?.user?.email || '',
            name: dataParams?.user?.username || '',
            phoneNumber: dataParams?.user?.phoneNumber || '',
            address: dataParams?.user?.address || '',
            roles: dataParams?.user?.roles,
            status: "ACTIVE"
        },
        validationSchema: updateInfoSchema,
        onSubmit: async (dataDto: any) => {
            const token = await getJwtToken();
            const decodedToken = decodeJwtToken(token);
            try {
                const response = await updateUserService(dataDto, decodedToken?.sub);
                const {data} = response;
                if (data) {
                    Toast.show({
                        type: 'success',
                        text1: 'Update successfully',
                        position: 'top',
                        visibilityTime: 3000,
                        text1Style: {fontSize: 18},
                    });
                } else {
                    Toast.show({
                        type: 'error',
                        text1: 'Failed to update user info 😞',
                        position: 'top',
                        visibilityTime: 3000,
                        text1Style: {fontSize: 18},
                    });
                }
            } catch (e) {
                Toast.show({
                    type: 'error',
                    text1: 'Failed to update user info😞',
                    position: 'top',
                    visibilityTime: 3000,
                    text1Style: {fontSize: 18},
                });
                console.log(e);
            }
        },
    });

    return (
        <SafeAreaView style={GlobalStyles.AndroidSafeArea}>
            <Block style={GlobalStyles.main_container} flexDirection="row" justifyContent="space-between"
                   alignItems="center">
                <TouchableOpacity onPress={backButton}>
                    <Text size={18}> <SimpleLineIcons name="arrow-left" size={18}/> </Text>
                </TouchableOpacity>
                <Text size={20} bold>Info update</Text>
                <TouchableOpacity>
                    <Text size={20}></Text>
                </TouchableOpacity>
            </Block>
            <Block height={12}></Block>
            <Block style={GlobalStyles.under_line}></Block>
            <Block flex middle>
                <Block safe flex middle>
                    <Block style={styles.registerContainer}>
                        <Block flex>
                            <Block flex={0.17} middle>
                                <Text color="#8898AA" size={12}>
                                    Your information
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
                                            borderless
                                            placeholder="Address"
                                            iconContent={
                                                <Icon
                                                    size={16}
                                                    color={theme.COLORS?.ICON}
                                                    name='home'
                                                    family="AntDesign"
                                                    style={styles.inputIcons}
                                                />
                                            }
                                            value={values.address}
                                            onChangeText={handleChange('address')}
                                        />
                                        {errors.address && <Text size={12} color={'red'}>{errors.address}</Text>}
                                    </Block>
                                    <Block width={width * 0.8}>
                                        <Input
                                            borderless
                                            placeholder="Phone number"
                                            iconContent={
                                                <Icon
                                                    size={16}
                                                    color={theme.COLORS?.ICON}
                                                    name='phone'
                                                    family="AntDesign"
                                                    style={styles.inputIcons}
                                                />
                                            }
                                            value={values.phoneNumber}
                                            onChangeText={handleChange('phoneNumber')}
                                        />
                                        {errors.phoneNumber && <Text size={12} color={'red'}>{errors.phoneNumber}</Text>}
                                    </Block>
                                    <Block middle>
                                        <Button color="primary" style={styles.createButton}
                                                // @ts-ignore
                                                onPress={handleSubmit}
                                        >
                                            <Text bold size={14} color={theme.COLORS?.WHITE}>
                                                Update info
                                            </Text>
                                        </Button>
                                    </Block>
                                </KeyboardAvoidingView>
                            </Block>
                        </Block>
                    </Block>
                </Block>
                <Toast/>
            </Block>
            <Toast/>
        </SafeAreaView>
    );
}

export default UpdateUserInfoScreen;

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

