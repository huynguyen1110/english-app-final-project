import {
    SafeAreaView,
    ScrollView,
    TextInput,
    TouchableOpacity,
    View,
    LogBox, StyleSheet, Image, Alert, StatusBar
} from "react-native";
import {GlobalStyles} from "../../../styles/GlobalStyles";
import {Block, Text} from "galio-framework";
// @ts-ignore
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
// @ts-ignore
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
// @ts-ignore
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// @ts-ignore
import Entypo from 'react-native-vector-icons/Entypo';
import React, {useEffect, useRef, useState} from "react";
import {Modalize} from "react-native-modalize";
import {
    fileManagerColor,
    lightGrayColor,
    themeAppColor,
} from "../../../utils/constant";
import Modal from "react-native-modal";
import WORD_TYPES from "../../../utils/wordType.constant";
import {useNavigation, useRoute} from "@react-navigation/native";
import {getExamplePrompt} from "../../../utils/GptPrompts";
import {askChatGpt} from "../../../services/GptService";
import {getImageResult} from "../../../services/SerperService";
import * as ImagePicker from 'expo-image-picker';
import {addWordToPackage, createPackageService, createWord, getPackageService} from "../../../services/VocabService";
import {decodeJwtToken} from "../../../services/AuthenticationService";
import Toast from 'react-native-toast-message';

const SaveNewWordScreen = () => {
    // ignore warning
    LogBox.ignoreAllLogs();

    const navigation = useNavigation();

    const route = useRoute();

    // @ts-ignore
    const {word, partOfSpeech, definition, example} = route.params;

    const [wordInput, setWordInput] = useState(word);

    const [partOfSpeechInput, setPartOfSpeechInput] = useState("");

    const [definitionInput, setDefinitionInput] = useState(definition);

    const [exampleInput, setExampleInput] = useState(example);

    const [chatGptResponse, setChatGptResponse] = useState<string>("");

    // image response search by keyword
    const [imageResult, setImageResult] = useState<[]>([]);

    // selected example image
    const [selectedImage, setSelectedImage] = useState<any>("");

    // state of package Name when create new package
    const [packageName, setPackageName] = useState<string>("");

    // state of save button in create package handling
    const [isSaveDisabled, setIsSaveDisabled] = useState(true);

    // state of showing modal
    const [modalVisible, setModalVisible] = useState(false);

    // state of create package modal
    const [createPakageModalVisible, setCreatePakageModalVisible] = useState(false);

    // state storing packages info
    const [listOfPackages, setListOfPackages] = useState<any []>([]);

    const [latestPackage, setLatestPackage] = useState<any>(null);

    // value of selected folder
    const [selectedFoder, setSelectedFolder] = useState<any>(null);

    const modalRef = useRef<Modalize>(null);

    // definition input height
    const [inputHeight, setInputHeight] = useState(50);

    // example input height
    const [inputExampleHeight, setInputExampleHeight] = useState(50);

    // use for opening Modalize (handle scroll view in modal)
    const openModal = () => modalRef?.current?.open();

    // use for closing Modalize (handle scroll view in modal)
    const closeModal = () => modalRef?.current?.close();

    // fetch examples for a word
    const fetchExampleUsingChatGpt = async () => {
        setChatGptResponse("")
        if (partOfSpeech != null && definition != null) {
            const prompt = getExamplePrompt(word, partOfSpeech, definition);
            const response = await askChatGpt(prompt);
            const {data}: any = response;
            setChatGptResponse(data.choices[0].message.content);
        }
    };

    // search word image
    const fetchImageResult = async () => {
        setImageResult([]);
        if (wordInput != null) {
            const response = await getImageResult(wordInput);
            const {data}: any = response;
            let imagesWithAddButton: any = [];
            if (data.images.length >= 1) {
                imagesWithAddButton = [{isAddButton: true}, ...data.images];
            } else {
                imagesWithAddButton = [{isAddButton: true}];
            }
            setImageResult(imagesWithAddButton);
        }

    }

    // fetch create package api
    const fetchCreatePackageApi = async () => {
        const data: any = {
            name: packageName,
            description: "",
            isPublished: false
        }
        try {
            const response = await createPackageService(data);
            if (response) {
                setCreatePakageModalVisible(false);
                fetchGetPackagesApi();
                closeModal();
            }
        } catch (error) {
            Alert.alert(
                "Error",
                "Failed to create the package. Please try again.",
                [{text: "OK"}]
            );
        }
    }

    // fetch create package api
    const fetchGetPackagesApi = async () => {
        const testToken = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJIdXk2OTY4MEBnbWFpbC5jb20iLCJyb2xlIjpbIkFETUlOIiwiVVNFUiJdLCJpYXQiOjE3MjM0NzgyNjAsImV4cCI6MTcyMzUxNDI2MH0.R5jR28VDxncQ5Xi99CH6vK--mMQAO5zBLhhREYOaXBU";
        // const token = getJwtToken();
        const decodedToken = decodeJwtToken(testToken);
        const params: any = {
            page: 1,
            size: 500,
            sortBy: "createdAt",
            direction: false,
            createBy: decodedToken?.sub,
        }
        try {
            const response: any = await getPackageService(params);
            const {data} = response;
            setListOfPackages(data.content);
        } catch (e) {
            setListOfPackages([])
            console.error("err while fetching get package api ", e);
        }
    }

    // handle save word to db
    const handleSaveWordButton = async () => {
        try {
            const wordDto = {
                name: wordInput,
                meaning: definitionInput,
                description: "",
                example: exampleInput,
                image: selectedImage,
                wordType: partOfSpeechInput,
            };

            const {data}: any = await createWord(wordDto);

            if (data?.wordId) {
                const addWordResponse = await addWordToPackage(data.wordId, selectedFoder.id);

                if (addWordResponse) {
                    Toast.show({
                        type: 'success',
                        text1: 'Success',
                        text2: 'Saved word successfully 👌',
                        position: 'bottom',
                        visibilityTime: 3000,
                        text1Style: {fontSize: 20}, // Tăng kích thước chữ của text1
                        text2Style: {fontSize: 16}, // Tăng kích thước chữ của text2
                    });

                } else {
                    // Thông báo khi thêm từ vào package thất bại
                    Toast.show({
                        type: 'error',
                        text1: 'Error',
                        text2: 'Failed to save word 😞',
                        position: 'bottom',
                        visibilityTime: 3000,
                        text1Style: {fontSize: 20}, // Tăng kích thước chữ của text1
                        text2Style: {fontSize: 16}, // Tăng kích thước chữ của text2
                    });
                }
            } else {
                // Thông báo khi tạo từ thất bại
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Failed to save word 😞',
                    position: 'bottom',
                    visibilityTime: 3000,
                    text1Style: {fontSize: 20},
                    text2Style: {fontSize: 16},
                });
            }
        } catch (error) {
            console.error("Error while creating word:", error);
            // Thông báo khi có lỗi xảy ra
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to save word 😞',
                position: 'bottom',
                visibilityTime: 3000,
                text1Style: {fontSize: 20},
                text2Style: {fontSize: 16},
            });
        }
    };

    // handle select folder
    const handleSelectFolder = (folderId: number) => {
        setSelectedFolder(null);
        const selectedFolder = listOfPackages.find((item: any) => item.id === folderId);
        setSelectedFolder(selectedFolder);
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri)
        }
    };

    // render example image
    const renderImage = () => {
        const rows = [];
        for (let i = 0; i < imageResult.length; i += 3) {
            const rowItems = imageResult.slice(i, i + 3);
            rows.push(
                <Block key={i} height={80} row alignItems="center">
                    {rowItems.map((item: any, index: any) => (
                        <TouchableOpacity key={i}
                                          style={[item.isAddButton ? styles.add_image_btn : styles.example_image_container, index === 0 ? {} : {marginLeft: 29.5}]}
                                          onPress={() => {
                                              if (item.isAddButton) {
                                                  pickImage()
                                              } else {
                                                  setSelectedImage(item.imageUrl)
                                              }
                                          }}
                        >
                            {item.isAddButton ? (
                                <Block color="white" collum justifyContent="space-between" alignItems="center">
                                    <FontAwesome5 size={30} name="file-upload"/>
                                    <Text>Your image</Text>
                                </Block>
                            ) : (
                                <Image source={{uri: item.imageUrl}} style={styles.example_image}/>
                            )}
                        </TouchableOpacity>
                    ))}
                </Block>
            );
        }
        return rows;
    };

    useEffect(() => {
        setDefinitionInput("");
        setPartOfSpeechInput("");
        if (partOfSpeech != null && definition != null) {
            setDefinitionInput(definition);
            setPartOfSpeechInput(partOfSpeech);
            fetchExampleUsingChatGpt();
        }
    }, [partOfSpeech, definition]);

    useEffect(() => {
        setExampleInput("");
        setExampleInput(chatGptResponse);
    }, [chatGptResponse]);

    useEffect(() => {
        if (wordInput != null) {
            fetchImageResult();
        }
    }, [word])

    useEffect(() => {
        // update state of save button whenever package name is changed
        setIsSaveDisabled(packageName.trim() === '');
    }, [packageName]);

    useEffect(() => {
        fetchGetPackagesApi();
    }, []);

    useEffect(() => {
        const latestPackage = listOfPackages?.reduce((latest, current) => {
            return new Date(latest.updatedAt) > new Date(current.updatedAt) ? latest : current;
        }, listOfPackages[0]);
        setLatestPackage(latestPackage);
    }, [listOfPackages]);

    return (
        <SafeAreaView style={GlobalStyles.AndroidSafeArea}>
            <StatusBar hidden={true}/>
            <View>
                <Block style={[GlobalStyles.main_container]} flexDirection="row" height={50}
                       justifyContent="space-between"
                       alignItems="center">
                    <TouchableOpacity onPress={() => {
                        navigation.goBack()
                    }}>
                        <Text size={18}> <SimpleLineIcons name="arrow-left" size={18}/> </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        handleSaveWordButton();
                    }}>
                        <Text size={20} color="#1d77f5" bold>SAVE</Text>
                    </TouchableOpacity>
                </Block>
                <Block style={GlobalStyles.under_line}></Block>
            </View>
            <ScrollView style={GlobalStyles.main_container}>
                <Block>
                    <Text size={18} bold>Word</Text>
                    <Block height={8}></Block>
                    <TextInput value={wordInput} onChangeText={text => setWordInput(text)}
                               style={[GlobalStyles.rounded_input]}></TextInput>
                </Block>

                <Block height={12}></Block>

                <Block>
                    <Text size={18} bold>Folder</Text>
                    <Block height={8}></Block>
                    <TouchableOpacity onPress={openModal} style={[GlobalStyles.non_rounded_input]}>
                        <Block flexDirection="row" justifyContent="space-between" alignItems="center">
                            {selectedFoder == null ? (<Text size={16}>{latestPackage?.name}</Text>) : (
                                <Text size={16}>{selectedFoder?.name}</Text>)}
                            <Entypo name="triangle-down" color="gray" size={24}></Entypo>
                        </Block>
                    </TouchableOpacity>
                </Block>

                <Block height={12}></Block>

                <View>
                    <Block row alignItems="center">
                        <Text size={18} bold>Definition</Text>
                        <Block width={8}></Block>
                        <TouchableOpacity style={styles.select_btn} onPress={() => setModalVisible(true)}>
                            {partOfSpeechInput == "" ? (
                                <Text color={themeAppColor}>+ type</Text>
                            ) : (
                                <Text color={themeAppColor}> {partOfSpeechInput} </Text>
                            )}
                        </TouchableOpacity>
                    </Block>
                    <Block height={8}></Block>
                    <TextInput
                        style={[
                            GlobalStyles.non_rounded_input,
                            {height: inputHeight}]}
                        multiline={true}
                        onContentSizeChange={(e) => setInputHeight(e.nativeEvent.contentSize.height)}
                        numberOfLines={5}
                        value={definitionInput}
                        onChangeText={text => setDefinitionInput(text)}
                    />
                </View>

                <Block height={12}></Block>

                <Block>
                    <Text size={18} bold>Example</Text>
                    <Block height={8}></Block>
                    <TextInput
                        style={[
                            GlobalStyles.non_rounded_input,
                            {height: inputExampleHeight}
                        ]}
                        multiline={true}
                        onContentSizeChange={(e) => setInputExampleHeight(e.nativeEvent.contentSize.height)}
                        numberOfLines={5}
                        value={exampleInput}
                        onChangeText={text => setExampleInput(text)}
                    />
                </Block>

                <Block height={12}></Block>

                {/*select example images section*/}
                <Block>
                    <Text size={18} bold>Select Image</Text>

                    <Block height={8}></Block>

                    {selectedImage === "" ? (
                            <Block height={200} style={{backgroundColor: lightGrayColor}} row justifyContent="center"
                                   alignItems="center">
                                <FontAwesome5 name="images" size={50}/>
                            </Block>) :
                        (<Image source={{uri: selectedImage}}
                                style={{width: '100%', height: 200, resizeMode: "cover"}}/>)
                    }

                </Block>

                <Block height={24}></Block>

                {renderImage()}
                {/*select example images section*/}


            </ScrollView>
            <Modalize
                ref={modalRef}
                modalHeight={400}
                scrollViewProps={{showsVerticalScrollIndicator: false}}
            >

                <View style={[{backgroundColor: "#c6cfcd"}]}>
                    <Block style={GlobalStyles.main_container} height={50} row justifyContent="space-between"
                           alignItems="center">
                        <Text size={18}>Folder</Text>
                        <TouchableOpacity style={{padding: 5}} onPress={() => {
                            setCreatePakageModalVisible(true)
                        }}>
                            <FontAwesome5 name="folder-plus" color={themeAppColor}
                                          size={24}></FontAwesome5>
                        </TouchableOpacity>
                    </Block>
                </View>

                <Block style={GlobalStyles.under_line}></Block>

                <ScrollView>
                    {listOfPackages?.length > 0 ? (
                        listOfPackages.map((packageItem, index) => (
                            <TouchableOpacity key={index} style={GlobalStyles.main_container} onPress={() => {
                                handleSelectFolder(packageItem.id)
                            }}>
                                <Block row alignItems="center" height={50}>
                                    <MaterialIcons name="folder" color={fileManagerColor} bold size={30}/>
                                    <Block width={4}></Block>
                                    <Text size={18}>{packageItem.name}</Text>
                                </Block>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <Text>No packages available</Text>
                    )}

                    <Block style={GlobalStyles.under_line}></Block>
                </ScrollView>
            </Modalize>

            {/* select word's type modal */}
            <Modal
                // @ts-ignore
                isVisible={modalVisible}
                onBackdropPress={() => {
                    setModalVisible(false);
                }}
                style={styles.modal}
                swipeDirection="down"
                onSwipeComplete={() => {
                    setModalVisible(false);
                }}
            >
                <View style={[styles.drawer]}>
                    <Block row justifyContent="space-between" alignItems="center">
                        <Text size={18} bold>Select word's type</Text>
                        <TouchableOpacity style={styles.large_select_btn} onPress={() => {
                            setPartOfSpeechInput("");
                        }}>
                            <Text size={18} bold color={themeAppColor}>Delete</Text>
                        </TouchableOpacity>
                    </Block>

                    <Block height={8}></Block>

                    {Object.entries(WORD_TYPES).map(([key, value]) => (
                        <TouchableOpacity style={{height: 50}} key={key} onPress={() => {
                            setPartOfSpeechInput(value);
                        }}>
                            <Block height={50}
                                   style={[GlobalStyles.flex_row, GlobalStyles.align_item_center, GlobalStyles.justify_content_space_between]}>
                                <Text size={16}>{value}</Text>
                                <Block style={styles.select_btn}>
                                    <Text size={16}>Select</Text>
                                </Block>
                            </Block>
                        </TouchableOpacity>
                    ))}
                </View>
            </Modal>
            {/* select word's type modal */}

            {/* create package modal section */}
            <Modal
                // @ts-ignore
                animationType="slide"
                transparent={true}
                visible={createPakageModalVisible}
                onRequestClose={() => {
                    setCreatePakageModalVisible(!createPakageModalVisible);
                }}>
                <View style={GlobalStyles.centered_view}>
                    <View style={styles.package_modal_view}>
                        <Block style={{
                            backgroundColor: lightGrayColor,
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                            height: 50,
                            width: "100%"
                        }}
                               row alignItems="center" justifyContent="space-between">
                            <Block style={GlobalStyles.main_container} row alignItems="center"
                                   justifyContent="space-between">
                                <View></View>
                                <TouchableOpacity style={{padding: 10}} onPress={() => {
                                    setCreatePakageModalVisible(false);
                                }}>
                                    <Text bold size={24}>X</Text>
                                </TouchableOpacity>
                            </Block>
                        </Block>
                        <Block height={18}></Block>
                        <Block collum alignItems="center" justifyContent="space-around">
                            <TextInput onChangeText={text => setPackageName(text)}
                                       style={{width: "90%", borderWidth: 1, height: 35, borderRadius: 10}}
                                       placeholder="Enter pack name"/>
                            <Block height={8}></Block>
                            <TouchableOpacity style={{
                                borderWidth: 1,
                                width: 90,
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: 10,
                                backgroundColor: isSaveDisabled ? "#d3d3d3" : "#9FA5AA",
                                paddingLeft: 5
                            }} onPress={fetchCreatePackageApi} disabled={isSaveDisabled}>
                                <Text size={18} style={{color: isSaveDisabled ? "#a9a9a9" : "#000"}}>SAVE</Text>
                            </TouchableOpacity>
                        </Block>
                    </View>
                </View>
            </Modal>
            {/* create package modal section */}
            <Toast/>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    package_modal_view: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: "90%",
        height: 150
    },
    drawer: {
        backgroundColor: 'white',
        padding: 20,
        height: "90%",
        width: '100%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    select_btn: {
        borderWidth: 1,
        borderRadius: 20,
        backgroundColor: lightGrayColor,
        width: 100,
        height: 25,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: 'center'
    },
    large_select_btn: {
        borderWidth: 1,
        borderRadius: 20,
        backgroundColor: lightGrayColor,
        width: 70,
        height: 30,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: 'center'
    },
    add_image_btn: {
        width: "28%",
        height: 60,
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: themeAppColor,
    },
    example_image_container: {
        width: "28%",
        height: 60,
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5, // for Android
        backgroundColor: "#fff",
    },
    example_image: {
        width: "100%",
        height: 60,
        borderWidth: 1,
        borderRadius: 5,
        resizeMode: "cover"
    }
});

export default SaveNewWordScreen;
