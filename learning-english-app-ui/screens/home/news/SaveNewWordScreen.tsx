import {
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    SectionList,
    TextInput,
    TouchableOpacity,
    View,
    LogBox, StyleSheet, Image
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
    charcoalColor,
    fileManagerColor,
    lightGrayColor,
    themeAppColor,
} from "../../../utils/constant";
import Modal from "react-native-modal";
import WORD_TYPES from "../../../utils/wordType.constant";
import {useNavigation, useRoute} from "@react-navigation/native";
import {getDefinitionInVietnamesePrompt, getExamplePrompt} from "../../../utils/GptPrompts";
import {askChatGpt} from "../../../services/GptService";
import {getImageResult} from "../../../services/SerperService";

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

    // image responst search by keyword
    const [imageResult, setImageResult] = useState<[]>([]);

    // state of showing modal
    const [modalVisible, setModalVisible] = useState(false);

    const modalRef = useRef<Modalize>(null);

    const [inputHeight, setInputHeight] = useState(50);

    const [inputExampleHeight, setInputExampleHeight] = useState(50);

    // use for opening Modalize (handle scroll view in modal)
    const openModal = () => modalRef?.current?.open();

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

    const renderImage = () => {
        const rows = [];
        for (let i = 0; i < imageResult.length; i += 3) {
            const rowItems = imageResult.slice(i, i + 3);
            rows.push(
                <Block key={1} height={80} row alignItems="center">
                    {rowItems.map((item: any, index: any) => (
                        <TouchableOpacity key={i}
                                          style={[item.isAddButton ? styles.add_image_btn : styles.example_image_container, index === 0 ? {} : {marginLeft: 29.5}]}>
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


    return (
        <SafeAreaView style={GlobalStyles.AndroidSafeArea}>
            <View>
                <Block style={[GlobalStyles.main_container]} flexDirection="row" height={50}
                       justifyContent="space-between"
                       alignItems="center">
                    <TouchableOpacity onPress={() => {
                        navigation.goBack()
                    }}>
                        <Text size={18}> <SimpleLineIcons name="arrow-left" size={18}/> </Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
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
                            <Text size={16}>Folder Name</Text>
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

                <Block>
                    <Text size={18} bold>Select Image</Text>

                    <Block height={8}></Block>

                    <Block height={200} style={{backgroundColor: lightGrayColor}} row justifyContent="center"
                           alignItems="center">
                        <FontAwesome5 name="images" size={50}/>
                    </Block>
                </Block>

                <Block height={24}></Block>

                {renderImage()}

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
                        <TouchableOpacity style={{padding: 5}}>
                            <FontAwesome5 name="folder-plus" color={themeAppColor}
                                          size={24}></FontAwesome5>
                        </TouchableOpacity>
                    </Block>
                </View>

                <Block style={GlobalStyles.under_line}></Block>

                <ScrollView>
                    <TouchableOpacity style={GlobalStyles.main_container}>
                        <Block row alignItems="center" height={50}>
                            <MaterialIcons name="folder" color={fileManagerColor} bold
                                           size={30}></MaterialIcons>
                            <Block width={4}></Block>
                            <Text size={18}>Test folder</Text>
                        </Block>
                    </TouchableOpacity>
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

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
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
