import {
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    SectionList,
    StyleSheet,
    TouchableOpacity,
    View
} from "react-native";
import {GlobalStyles} from "../../../styles/GlobalStyles";
import {Block, Text} from "galio-framework";
import React, {useEffect, useRef, useState} from "react";
import {useNavigation, useRoute} from "@react-navigation/native";
// @ts-ignore
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
// @ts-ignore
import AntDesign from "react-native-vector-icons/AntDesign";
// @ts-ignore
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {Modalize} from "react-native-modalize";
import {SegmentedButtons} from "react-native-paper";
import {Audio} from "expo-av";
import {setIsReadStoryService} from "../../../services/StoryService";
import {decodeJwtToken, getJwtToken} from "../../../services/AuthenticationService";
import Toast from 'react-native-toast-message';
import axios from "axios";
import {ENGLISH_DIC_API, TRANSLATION_API} from "../../../utils/API";
import {getDefinitionInVietnamesePrompt} from "../../../utils/GptPrompts";
import {askChatGpt} from "../../../services/GptService";

const StoryDetailScreen = () => {

    const navigation = useNavigation();

    const [storyData, setStoryData] = useState<any>(null);

    // word need to translate
    const [translateWord, setTranslateWord] = useState<string>("");

    // state of dictionary modal
    const [modalVisible, setModalVisible] = useState(false);

    const [segmentButtonValue, setSegmentButtonValue] = useState<string>("VI");

    const [chatGptResponse, setChatGptResponse] = useState<string>("");

    // translation of field meaning in free dic
    const [vietnameseMeaning, setVietnameseMeaning] = useState<any []>([]);

    // this is a field in free dic response
    const [englishMeaning, setEnglishMeaning] = useState<any []>([]);

    // state stores value of words were parsed from html
    const [parsedWords, setParsedWords] = useState<any>();

    // error when translated word is not valid
    const [translateErr, setTranslateErr] = useState<any>(null);

    // this is a field in free dic response
    const [phonetic, setPhonetic] = useState<any>(null);

    // state of showing toast or not
    const [isShowToast, setIsShowToast] = useState<boolean>(false);

    const [sound, setSound] = useState<any>();

    const modalRef = useRef<Modalize>(null);

    // use for opening Modalize (handle scroll view in modal)
    const openModal = () => modalRef?.current?.open();

    const router = useRoute();

    const paramsData: any = router.params;

    const backButton = () => {
        navigation.goBack();
    }

    // handle when press on word
    const handleWordPress = (word: string) => {
        // remove white space or dot, comma from word
        setTranslateWord(word.replace(/[.,]$/, ''));
        setModalVisible(true);
        openModal();
    };

    // get english word meaning
    const fetchEngDicResponse = async (word: string) => {
        try {

            setTranslateErr("")

            setEnglishMeaning([]);

            const response = await axios.get(ENGLISH_DIC_API.concat("/" + word));
            const {data} = response;


            const englishMeaningTransformed = data[0].meanings.map((meaning: any) => ({
                partOfSpeech: meaning.partOfSpeech,
                data: meaning.definitions.map((def: any) => def.definition)
            }))

            setEnglishMeaning(englishMeaningTransformed);

            getPhoneticField(data);
        } catch (error) {
            setTranslateErr("No translation data");
            console.log(translateErr)
            console.log("err while fetching free dic api" + error);
        }
    }

    // get phonetic field in free dic response
    const getPhoneticField = (data: any) => {
        let selectedPhonetic = null;
        setPhonetic(null);
        if (data[0].phonetics && data[0].phonetics.length > 0) {
            for (let item of data[0].phonetics) {
                if (item.text && item.audio) {
                    selectedPhonetic = item;
                    setPhonetic(selectedPhonetic);
                    break;
                } else if (item.text && !selectedPhonetic) {
                    selectedPhonetic = item;
                    setPhonetic(selectedPhonetic);
                }
            }
        }
    }

    const fetchChatGptResponse = async () => {
        setChatGptResponse("");
        if (segmentButtonValue === "ChatGPT") {
            const prompt = getDefinitionInVietnamesePrompt(translateWord);
            const response = await askChatGpt(prompt);
            const {data}: any = response;
            setChatGptResponse(data.choices[0].message.content);
        }
    };

    // past and display html to word logic
    const parseHtmlToWords = (htmlContent: string) => {
        const trimmedContent = htmlContent.replace(/^"|"$/g, '');
        // Loại bỏ thẻ HTML
        const cleanedString = trimmedContent.replace(/<\/?[^>]+(>|$)/g, "").trim();
        // Tách chuỗi thành từng từ và xử lý ký tự xuống dòng
        const words = cleanedString.split(" ");
        const filteredWords = words
            .filter(word => word !== "" && word !== "\n")  // Lọc bỏ các phần tử trống và "\n"
            .map(word => word.replace(/\\?\\n/g, " new_line ")); // Thay thế cả "\n" và "\\n" bằng "new line"

        return filteredWords.flatMap((word, index) => {
            // Kiểm tra xem từ có phải là ký tự xuống dòng hay không
            if (word === "new_line" || word.includes("new_line")) {
                return (
                    <View style={{width: "100%"}}></View>
                )
            } else {
                return (
                    <TouchableOpacity key={index} onPress={() => {
                        // Xóa các ký tự đặc biệt khỏi từ trước khi gọi handleWordPress
                        const cleanedWord = word.replace(/[^\w\s]/g, '');
                        handleWordPress(cleanedWord);
                    }}>
                        <Text size={20} style={{marginRight: 5}}>
                            {word}
                        </Text>
                    </TouchableOpacity>
                );
            }
        });
    };

    // handle play sound
    const playAudioBtn = async () => {
        if (phonetic.audio !== "" && phonetic.audio !== undefined && phonetic.audio != null) {
            setIsShowToast(false);
            const {sound} = await Audio.Sound.createAsync({uri: phonetic.audio});
            setSound(sound);
            await sound.playAsync();
        } else {
            setIsShowToast(true);
        }
    }

    useEffect(() => {
        return sound
            ? () => {
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);
    // handle play sound

    // fetch data whenever click on word
    useEffect(() => {
        setSegmentButtonValue("VI");
        fetchEngDicResponse(translateWord);
    }, [translateWord]);

    // translate dic's response
    useEffect(() => {
        if (englishMeaning) {
            transformAndTranslate(englishMeaning, "en", "vi");
        }
    }, [englishMeaning]);

    // update phonetic state if not null call play sound btn
    useEffect(() => {
        playAudioBtn();
    }, [phonetic]);

    // ask chatGpt for definition of the word. call askChatgpt funct
    useEffect(() => {
        fetchChatGptResponse();
    }, [segmentButtonValue]);

    // hide toast after 2 second
    useEffect(() => {
        let timer: any;
        if (isShowToast) {
            timer = setTimeout(() => {
                setIsShowToast(false);
            }, 2000); // 2000ms = 2 seconds
        }
        return () => clearTimeout(timer);
    }, [isShowToast]);

    // call translation api
    const translateFunction = async (text: string, sourceLanguage: string, targetLanguage: string) => {
        try {
            const response = await axios.post(TRANSLATION_API.concat("?text=" + text, "&sourceLanguage=" + sourceLanguage + "&targetLanguage=" + targetLanguage));
            const {data} = response;
            return data;
        } catch (err) {
            console.log(err);
        }
    }

    // handle data and translate it into Vietnamese
    const transformAndTranslate = async (data: any, sourceLanguage: string, targetLanguage: string) => {
        try {
            setVietnameseMeaning([]);
            const result = await Promise.all(
                data.map(async (item: any) => {
                    const translatedPartOfSpeech = await translateFunction(item.partOfSpeech, sourceLanguage, targetLanguage);

                    const translatedDefinitions = await Promise.all(
                        item.data.map(async (def: any) => {
                            return await translateFunction(def, sourceLanguage, targetLanguage);
                        })
                    );
                    return {
                        partOfSpeech: translatedPartOfSpeech,
                        data: translatedDefinitions
                    };
                })
            );
            if (result) {
                setVietnameseMeaning(result);
            }
            return result;
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    const setIsReadBtn = async (storyId: any) => {
        try {
            const token = await getJwtToken();
            const decodedToken = decodeJwtToken(token);

            const userEmail: any = decodedToken?.sub;
            const {data} = await setIsReadStoryService("huy696981@gmail.com", storyId);
            if (data) {
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: 'added to is read successfully 👌',
                    position: 'bottom',
                    visibilityTime: 3000,
                    text1Style: {fontSize: 18},
                    text2Style: {fontSize: 16},
                });
            }
        } catch (e) {
            Toast.show({
                type: 'error',
                text1: 'Failed',
                text2: 'failed to add story to is read',
                position: 'bottom',
                visibilityTime: 3000,
                text1Style: {fontSize: 18},
                text2Style: {fontSize: 16},
            });
            console.log(e);
        }
    }

    useEffect(() => {
        setStoryData(paramsData?.storyData);
    }, [storyData]);

    useEffect(() => {
        if (storyData) {
            setParsedWords(parseHtmlToWords(storyData?.content));
        }
    }, [storyData]);

    return (
        <SafeAreaView style={GlobalStyles.AndroidSafeArea}>
            <Block style={GlobalStyles.main_container} flexDirection="row" justifyContent="space-between"
                   alignItems="center">
                <TouchableOpacity onPress={backButton}>
                    <Text size={18}> <SimpleLineIcons name="arrow-left" size={18}/> </Text>
                </TouchableOpacity>
                <View>
                </View>
                <TouchableOpacity onPress={() => {
                    setIsReadBtn(storyData?.id);
                }}>
                    <Text size={20}> <AntDesign size={26} name="check"/> </Text>
                </TouchableOpacity>
            </Block>
            <Block height={12}></Block>
            <Block style={GlobalStyles.under_line}></Block>
            <ScrollView>
                <View style={GlobalStyles.main_container}>
                    <Block height={16}></Block>
                    <View style={styles.textContainer}>
                        {storyData?.vnTitle.split(" ").map((word: any, index: any) => (
                            <TouchableOpacity key={index} onPress={() => handleWordPress(word)}>
                                <Text bold size={26}>{word} </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <Block height={16}></Block>
                    <View style={styles.textContainer}>
                        {storyData?.engTitle?.split(" ").map((word: any, index: any) => (
                            <TouchableOpacity key={index} onPress={() => handleWordPress(word)}>
                                <Text italic size={26}>{word} </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <Block height={16}></Block>
                    <View style={styles.textContainer}>
                        {parsedWords}
                    </View>
                </View>
            </ScrollView>

            {/* dictionary modal */}
            <Modalize
                ref={modalRef}
                modalHeight={400}
                scrollViewProps={{showsVerticalScrollIndicator: false}}
            >
                <View style={{padding: 20}}>
                    <Block row justifyContent="space-between">
                        <Text style={{padding: 2}} size={18} bold> {translateWord}</Text>
                        <TouchableOpacity style={{padding: 2}} onPress={() => {
                            // @ts-ignore
                            const saveWordData = {
                                // @ts-ignore
                                word: translateWord,
                                partOfSpeech: null,
                                definition: null,
                                example: null,
                                audio: phonetic?.audio,
                                phonetic: phonetic?.text
                            }
                            // @ts-ignore
                            navigation.navigate("SaveNewWordScreen", saveWordData);
                        }}>
                            <Text size={18} bold color={"#1d77f5"}>Save</Text>
                        </TouchableOpacity>
                    </Block>

                    <Block>
                        <Block height={8}></Block>
                        <Block style={GlobalStyles.under_line}></Block>
                        <Block height={8}></Block>
                        <SegmentedButtons
                            value={segmentButtonValue}
                            onValueChange={setSegmentButtonValue}
                            buttons={[
                                {
                                    value: 'VI',
                                    label: 'VI',
                                },
                                {
                                    value: 'EN',
                                    label: 'EN',
                                },
                                {
                                    value: 'ChatGPT',
                                    label: 'ChatGPT'
                                },
                            ]}
                        />
                    </Block>

                    <Block height={4}></Block>

                    <Block row alignItems="center">
                        <TouchableOpacity onPress={playAudioBtn}>
                            <Text size={18}><FontAwesome size={20} name="volume-up"/></Text>
                        </TouchableOpacity>
                        <Block width={12}></Block>
                        <Text size={18}>
                            {translateErr ? translateErr : phonetic?.text}
                        </Text>
                    </Block>


                    {
                        segmentButtonValue === "EN" ? (
                            <Block>
                                {englishMeaning.length > 0 ? (
                                    <SectionList
                                        sections={englishMeaning}
                                        renderItem={({item, section: {partOfSpeech}}) => (
                                            <View>
                                                <Block row justifyContent="space-between" alignItems="center">
                                                    <Block width={300}><Text size={16}>- {item}</Text></Block>

                                                    <TouchableOpacity style={{padding: 10}}
                                                                      onPress={() => {
                                                                          // @ts-ignore
                                                                          const saveWordData = {
                                                                              // @ts-ignore
                                                                              word: translateWord,
                                                                              partOfSpeech: partOfSpeech,
                                                                              definition: item,
                                                                              example: null,
                                                                              audio: phonetic?.audio,
                                                                              phonetic: phonetic?.text
                                                                          }
                                                                          // @ts-ignore
                                                                          navigation.navigate("SaveNewWordScreen", saveWordData)
                                                                      }}
                                                    >
                                                        <Text size={18}> <AntDesign size={18} name="addfolder"/> </Text>
                                                    </TouchableOpacity>
                                                </Block>
                                                <Block height={4} style={GlobalStyles.under_line}></Block>
                                            </View>
                                        )}
                                        renderSectionHeader={({section: {partOfSpeech}}) => (
                                            <View>
                                                <Block height={4}></Block>
                                                <Text size={16}><Text bold size={16}>Part of
                                                    Speech:</Text> {partOfSpeech}
                                                </Text>
                                                <Block height={4}></Block>

                                                <Text size={16} bold>Definition: </Text>
                                            </View>
                                        )}
                                        keyExtractor={(item, index) => item + index}
                                    />
                                ) : (
                                    <ActivityIndicator size="large" color="#0000ff"/>
                                )}
                            </Block>
                        ) : (
                            <Block>
                            </Block>
                        )
                    }

                    {
                        segmentButtonValue === "VI" ? (
                            <Block>
                                {vietnameseMeaning.length > 0 ? (
                                    <SectionList
                                        sections={vietnameseMeaning}
                                        renderItem={({item, section: {partOfSpeech}}) => (
                                            <View>
                                                <Block row justifyContent="space-between" alignItems="center">
                                                    <Block width={300}><Text size={16}>- {item}</Text></Block>

                                                    <TouchableOpacity style={{padding: 10}}
                                                                      onPress={() => {
                                                                          // // @ts-ignore
                                                                          const saveWordData = {
                                                                              // @ts-ignore
                                                                              word: translateWord,
                                                                              partOfSpeech: partOfSpeech,
                                                                              definition: item,
                                                                              example: null,
                                                                              audio: phonetic?.audio,
                                                                              phonetic: phonetic?.text
                                                                          }
                                                                          // @ts-ignore
                                                                          navigation.navigate("SaveNewWordScreen", saveWordData)
                                                                      }}
                                                    >
                                                        <Text size={18}> <AntDesign size={18} name="addfolder"/> </Text>
                                                    </TouchableOpacity>
                                                </Block>
                                                <Block height={4} style={GlobalStyles.under_line}></Block>
                                            </View>
                                        )}
                                        renderSectionHeader={({section: {partOfSpeech}}) => (
                                            <View>
                                                <Block height={4}></Block>
                                                <Text size={16}><Text bold size={16}>Part of
                                                    Speech:</Text> {partOfSpeech}
                                                </Text>
                                                <Block height={4}></Block>

                                                <Text size={16} bold>Definition: </Text>
                                            </View>
                                        )}
                                        keyExtractor={(item, index) => item + index}
                                    />
                                ) : (
                                    <ActivityIndicator size="large" color="#0000ff"/>
                                )}
                            </Block>
                        ) : (
                            <Block></Block>
                        )
                    }

                    {
                        segmentButtonValue === "ChatGPT" ? (
                            <Block>
                                {chatGptResponse != "" ? (
                                    <Text size={16}>{chatGptResponse}</Text>
                                ) : (
                                    <ActivityIndicator size="large" color="#0000ff"/>
                                )}
                            </Block>
                        ) : (
                            <Block>
                            </Block>
                        )
                    }

                </View>
            </Modalize>
            {/* dictionary modal */}
            <Toast/>
        </SafeAreaView>
    );
}

export default StoryDetailScreen;

const styles = StyleSheet.create({
    textContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    }
});

