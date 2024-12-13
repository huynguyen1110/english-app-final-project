import {
    Image,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    View,
    ActivityIndicator,
    ScrollView
} from "react-native";
import {RadioButton} from 'react-native-paper';
import ImageViewing from 'react-native-image-viewing';
import {GlobalStyles} from "../../../styles/GlobalStyles";
import {Block, Text} from "galio-framework";
import React, {useEffect, useState} from "react";
import {useNavigation} from "@react-navigation/native";
// @ts-ignore
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/Ionicons';
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import * as ImagePicker from 'expo-image-picker';
import {updaloadImage} from "../../../services/FileService";
import Toast from "react-native-toast-message";
import {
    extractTextFromImageService,
    preprocessingImageService,
    translateService
} from "../../../services/PythonService";
import {getDefinitionInVietnamesePrompt, summarizeTextPromt} from "../../../utils/GptPrompts";
import {askChatGpt} from "../../../services/GptService";
import Modal from "react-native-modal";
import {charcoalColor, sandDollarColor, whiteColor} from "../../../utils/constant";
import Slider from "@react-native-community/slider";

const UploadImageScreen = () => {

    const [image, setImage] = useState<string | null>(null);

    const [cloudinaryImage, setCloudinaryImage] = useState<any | null>(null);

    const [cloudinaryProcessedImage, setCloudinaryProcessedImage] = useState<string | null>(null);

    const [extractText, setExtractedText] = useState<any | null>(null);

    const navigation = useNavigation();

    const [hasPermission, setHasPermission] = useState(null);

    const [isLoading, setIsLoading] = useState(false);

    const [isTranslatedToEnglish, setIsTranslatedToEnglish] = useState(false);

    const [resultText, setResultText] = useState<string>("");

    const [chatGptResponse, setChatGptResponse] = useState<any>("");

    // state of setting modal
    const [isVisible, setIsVisible] = useState<boolean>(false);

    const [radioBtnValue, setRadioBtnValue] = React.useState("");

    const [isViewImage, setIsViewImage] = useState<boolean>(false);

    const [images, setImages] = useState<any[]>([]);

    useEffect(() => {
        if (radioBtnValue === "") {
            return;
        }
        preprocessImage();
    }, [radioBtnValue]);


    const handleViewImageClick = () => {
        const newImages = []; // Tạo mảng mới để đảm bảo tính bất biến

        if (image) {
            newImages.push({ uri: image }); // Thêm ảnh từ cloudinaryImage
        }

        if (cloudinaryProcessedImage) {
            newImages.push({ uri: cloudinaryProcessedImage }); // Thêm ảnh từ cloudinaryProcessedImage
        }

        setImages(newImages); // Cập nhật state với mảng mới
        setIsViewImage(true); // Hiển thị modal hoặc popup
    };

    const backButton = () => {
        navigation.goBack();
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos'],
            quality: 1,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            setImage(uri);
        }
    };

    // open modal handler
    const openDrawer = () => {
        setIsVisible(true);
    };

    // close modal handler
    const closeDrawer = () => {
        setIsVisible(false);
    };

    const uploadImage = async () => {
        try {
            setIsLoading(true);
            const response: any = await updaloadImage(image, "example-image");
            const {data} = response;
            setCloudinaryImage(data.secure_url)
            return data.secure_url;
        } catch (e) {
            console.log(e)
        } finally {
            setIsLoading(false);
        }
    }

    const translateText = async (text: any, isEnglish: boolean) => {
        try {
            setIsLoading(true);
            setChatGptResponse("");
            let params = null;
            if (isEnglish) {
                params = {
                    source: "en",
                    target: "vi"
                }
            } else {
                params = {
                    source: "vi",
                    target: "en"
                }
            }
            console.log(params)
            setResultText("");
            const {data}: any = await translateService(params, text);
            setResultText(data);
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    }

    const translateToEngBtn = async () => {
        if (!image) {
            showToastNotification(true);
            return;
        }
        if (!cloudinaryImage) {
            setIsTranslatedToEnglish(false);
            const imageUrl = await uploadImage();
            const extractedTextResult = await extractTextFromImage(imageUrl);
            translateText(extractedTextResult, false);
        } else {
            const extractedTextResult = await extractTextFromImage(cloudinaryImage);
            translateText(extractedTextResult, false);
        }
    }


    const translateToViBtn = async () => {
        if (!image) {
            showToastNotification(true);
            return;
        }

        if (!cloudinaryImage) {
            setIsTranslatedToEnglish(false);
            const imageUrl = await uploadImage();
            const extractedTextResult = await extractTextFromImage(imageUrl);
            translateText(extractedTextResult, true);
        } else {
            const extractedTextResult = await extractTextFromImage(cloudinaryImage);
            translateText(extractedTextResult, true);
        }
    }

    const summarizeBtn = async () => {
        if (!image) {
            showToastNotification(true);
            return;
        }

        const imageUrl = cloudinaryImage || await uploadImage();
        const extractedTextResult = await extractTextFromImage(imageUrl);
        const textToProcess = resultText || extractedTextResult;

        fetchChatGptResponse(textToProcess);
    };


    const showToastNotification = (isFaild: boolean) => {
        if (isFaild) {
            Toast.show({
                type: 'error',
                text1: 'Please choose an image',
                position: 'top',
                visibilityTime: 3000,
                text1Style: {fontSize: 18},
            });
        }
    }

    const extractTextFromImage = async (imageUrl: any) => {
        try {
            setIsLoading(true);
            let isProcessed = "no";
            if (radioBtnValue !== "") {
                isProcessed = "true";
            }
            console.log(isProcessed);
            const {data}: any = await extractTextFromImageService(imageUrl, isProcessed);
            setExtractedText(data?.extracted_text);
            return data?.extracted_text;
        } catch (e) {
            console.log(e)
        } finally {
            setIsLoading(false);
        }
    }


    const fetchChatGptResponse = async (text: any) => {
        setChatGptResponse("");
        const prompt = summarizeTextPromt(text);
        const response = await askChatGpt(prompt);
        const {data}: any = response;
        setChatGptResponse(data.choices[0].message.content);
        return data.choices[0].message.content
    };

    const preprocessImage = async () => {
        try {
            const uploadImageResult = await uploadImage();
            if (!uploadImageResult) {
                showToastNotification(true);
                return;
            }
            if (!radioBtnValue) {
                return;
            }
            setIsLoading(true);
            const response: any = await preprocessingImageService(uploadImageResult, radioBtnValue);
            const {data} = response;
            setCloudinaryProcessedImage(data?.data?.secure_url);
            return data?.data?.secure_url;
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <SafeAreaView style={GlobalStyles.AndroidSafeArea}>
            {isLoading && (
                <View style={styles.spinnerContainer}>
                    <ActivityIndicator size="large" color="#0000ff"/>
                    <Text>Loading...</Text>
                </View>
            )}
            <Block style={GlobalStyles.main_container} flexDirection="row" justifyContent="space-between"
                   alignItems="center">
                <TouchableOpacity onPress={backButton}>
                    <Text size={18}> <SimpleLineIcons name="arrow-left" size={18}/> </Text>
                </TouchableOpacity>
                <Text size={20} bold></Text>
                <TouchableOpacity onPress={openDrawer}>
                    <Text size={20}> <SimpleLineIcons name="settings" size={24}/> </Text>
                </TouchableOpacity>
            </Block>
            <Block height={12}></Block>
            <Block style={GlobalStyles.under_line}></Block>
            <View style={{flex: 1}}>
                <View style={GlobalStyles.main_container}>
                    <View style={[GlobalStyles.flex_row, GlobalStyles.justify_content_space_between]}>
                        {cloudinaryProcessedImage ? (
                            <TouchableOpacity onPress={() => {
                                handleViewImageClick()
                            }
                            }>
                                <Image style={styles.image_chose} source={{uri: cloudinaryProcessedImage}}/>
                            </TouchableOpacity>
                        ) : image ? (
                            <TouchableOpacity onPress={() => {
                                handleViewImageClick()
                            }}>
                                <Image style={styles.image_chose} source={{uri: image}}/>
                            </TouchableOpacity>
                        ) : (
                            <View
                                style={[
                                    GlobalStyles.align_item_center,
                                    GlobalStyles.justify_content_space_between,
                                    {width: "50%"},
                                ]}
                            >
                                <MaterialCommunityIcons size={200} name="file-image"/>
                            </View>
                        )}

                        <ImageViewing
                            images={images}
                            imageIndex={0}
                            visible={isViewImage}
                            onRequestClose={() => setIsViewImage(false)}
                        />

                        <View style={[{width: '40%', height: 200}]}>
                            <TouchableOpacity style={styles.action_btn} onPress={translateToEngBtn}><Text>Translate to
                                En</Text></TouchableOpacity>
                            <Block height={12}></Block>
                            <TouchableOpacity style={styles.action_btn} onPress={translateToViBtn}><Text>Translate to
                                Vi</Text></TouchableOpacity>
                            <Block height={12}></Block>
                            <TouchableOpacity style={styles.action_btn}
                                              onPress={summarizeBtn}><Text>Summarize</Text></TouchableOpacity>
                        </View>
                    </View>
                    <Block height={12}></Block>
                    <ScrollView style={{height: 460}}>
                        {
                            chatGptResponse === '' ? (
                                <Text size={20} bold>{resultText}</Text>
                            ) : (
                                <Text size={20} bold>{chatGptResponse}</Text>
                            )
                        }
                    </ScrollView>
                </View>
                <View style={[styles.footer, GlobalStyles.flex_row, GlobalStyles.justify_content_space_between]}>
                    <View></View>
                    <View style={[GlobalStyles.flex_row]}>
                        <TouchableOpacity style={styles.image_btn} onPress={pickImage}>
                            <Ionicons size={30} name="images"/>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            {/* setting modal */}
            <Modal
                // @ts-ignore
                isVisible={isVisible}
                onBackdropPress={closeDrawer}
                style={styles.modal}
                swipeDirection="down"
                onSwipeComplete={closeDrawer}
            >
                <View style={[styles.drawer]}>
                    <Block style={GlobalStyles.main_container}>
                        <Text bold size={24}>Settings</Text>

                        <Block height={12}></Block>

                        <RadioButton.Group onValueChange={newValue => setRadioBtnValue(newValue)} value={radioBtnValue}>
                            <View>
                                <Text>Original image</Text>
                                <RadioButton value=""/>
                            </View>
                            <View style={GlobalStyles.under_line}></View>
                            <View>
                                <Text>Binarize image</Text>
                                <RadioButton value="BINARISIZE"/>
                            </View>
                            <View style={GlobalStyles.under_line}></View>
                            <View>
                                <Text>Thin text in image</Text>
                                <RadioButton value="DILATION"/>
                            </View>
                            <View style={GlobalStyles.under_line}></View>
                            <View>
                                <Text>Bold text in image</Text>
                                <RadioButton value="EROSION"/>
                            </View>
                        </RadioButton.Group>

                    </Block>
                </View>
            </Modal>
            {/* setting modal*/}
            <Toast/>
        </SafeAreaView>
    );
}

export default UploadImageScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 200,
        height: 200,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        padding: 10,
        paddingBottom: 40, // Thêm khoảng cách
    },
    image_btn: {
        borderWidth: 1,
        borderRadius: 60,
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image_chose: {
        width: 200,
        height: 200,
        borderRadius: 10,
        // Hiệu ứng bóng
        elevation: 10, // Android
        shadowColor: '#000', // iOS
        shadowOffset: {width: 0, height: 4}, // iOS
        shadowOpacity: 0.3, // iOS
        shadowRadius: 5, // iOS
        resizeMode: 'stretch'
    },
    action_btn: {
        width: '100%',
        height: 50,
        borderRadius: 10,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    spinnerContainer: {
        position: 'absolute', // Đặt overlay phủ toàn bộ màn hình
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Màu nền đen mờ
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000, //
    },
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    drawer: {
        backgroundColor: 'white',
        padding: 20,
        height: "40%",
        width: '100%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
});