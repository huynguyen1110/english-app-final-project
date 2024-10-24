import {
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    View,
    ScrollView,
    Image,
    SectionList,
    ActivityIndicator,
    StatusBar, Dimensions
} from "react-native";
import {SegmentedButtons} from 'react-native-paper';
import {GlobalStyles} from "../../../styles/GlobalStyles";
import Slider from '@react-native-community/slider';
import {Block, Text, Toast as ToastGalio} from "galio-framework";
// @ts-ignore
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
// @ts-ignore
import FontAwesome from 'react-native-vector-icons/FontAwesome';
// @ts-ignore
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from "@react-navigation/native";
import React, {useEffect, useRef, useState} from "react";
import Modal from 'react-native-modal';
import {useSelector} from "react-redux";
import {RootState} from "../../../utils/Store";
import {blackColor, charcoalColor, sandDollarColor, textSandColor, whiteColor} from "../../../utils/constant";
import axios from 'axios';
import {ENGLISH_DIC_API, TRANSLATION_API} from "../../../utils/API";
import {Audio} from 'expo-av';
import {Modalize} from "react-native-modalize";
import {askChatGpt} from "../../../services/GptService";
import {getDefinitionInVietnamesePrompt} from "../../../utils/GptPrompts";
import {decodeJwtToken, getJwtToken} from "../../../services/AuthenticationService";
import {addNewsToFavoriteService} from "../../../services/FavoriteService";
import Toast from 'react-native-toast-message';
import RenderHtml from 'react-native-render-html';

const { width: screenWidth } = Dimensions.get('window');

const NewsDetailScreen = () => {

    const navigation = useNavigation();

    // background color of reading news screen
    const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');

    // text color of reading news screen
    const [textColor, setTextColor] = useState('#000000');

    // text size of reading news screen
    const [fontSize, setFontSize] = useState(16);

    // state of setting modal
    const [isVisible, setIsVisible] = useState<boolean>(false);

    // state of dictionary modal
    const [modalVisible, setModalVisible] = useState(false);

    const newsData = useSelector((state: RootState) => state.newsReducer.newsData);

    const [newsTitle, setNewsTitle] = useState<string []>([]);

    const [imageUrl, setImageUrl] = useState<string>("");

    const [newsContent, setNewsContent] = useState<string[]>([]);

    // word need to translate
    const [translateWord, setTranslateWord] = useState<string>("");

    // error when translated word is not valid
    const [translateErr, setTranslateErr] = useState<any>(null);

    const [segmentButtonValue, setSegmentButtonValue] = useState<string>("VI");

    const errImageUrl = "https://www.google.com/url?sa=i&url=https%3A%2F%2Fcommons.wikimedia.org%2Fwiki%2FFile%3ANo-Image-Placeholder.svg&psig=AOvVaw0pPj2xc6josQ23zzQIeG_1&ust=1718120275254000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCOCClfiu0YYDFQAAAAAdAAAAABAJ";

    // this is a field in free dic response
    const [phonetic, setPhonetic] = useState<any>(null);

    // this is a field in free dic response
    const [englishMeaning, setEnglishMeaning] = useState<any []>([]);

    // translation of field meaning in free dic
    const [vietnameseMeaning, setVietnameseMeaning] = useState<any []>([])

    // state of showing toast or not
    const [isShowToast, setIsShowToast] = useState<boolean>(false);

    const [chatGptResponse, setChatGptResponse] = useState<string>("");

    // data pass to save word screen
    const [saveWordData, setSaveWordData] = useState(null);

    const [sound, setSound] = useState<any>();

    const modalRef = useRef<Modalize>(null);

    // use for opening Modalize (handle scroll view in modal)
    const openModal = () => modalRef?.current?.open();

    // open modal handler
    const openDrawer = () => {
        setIsVisible(true);
    };

    // close modal handler
    const closeDrawer = () => {
        setIsVisible(false);
    };

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

    // set background color and text color
    useEffect(() => {
        if (backgroundColor === whiteColor) {
            setTextColor(blackColor);
        }
        if (backgroundColor === sandDollarColor) {
            setTextColor(textSandColor)
        }
        if (backgroundColor === charcoalColor) {
            setTextColor(whiteColor);
        }
    }, [backgroundColor]);

    // set news data
    useEffect(() => {
        if (newsData) {
            setNewsTitle(newsData.title.split(" "));
            setImageUrl(newsData.imageUrl);
            setNewsContent(newsData.content.split(" "));
        }
    }, [newsData]);

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

    // function handle add news to favorite
    const handleAddNewsToFavoriteBtn = async () => {
        const testToken = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJIdXk2OTY4MEBnbWFpbC5jb20iLCJyb2xlIjpbIkFETUlOIiwiVVNFUiJdLCJpYXQiOjE3MjM0NzgyNjAsImV4cCI6MTcyMzUxNDI2MH0.R5jR28VDxncQ5Xi99CH6vK--mMQAO5zBLhhREYOaXBU";
        const token = await getJwtToken();
        const decodedToken = decodeJwtToken(token);

        const userEmail = decodedToken?.sub;
        const newsId = newsData.newsId;

        // const testEmail = "huytest23@gmail.com";
        try {
            const response: any = await addNewsToFavoriteService(userEmail, newsId);
            const {data} = response;

            if (data) {
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: 'News added to favorites successfully 👌',
                    position: 'bottom',
                    visibilityTime: 3000,
                    text1Style: {fontSize: 18},
                    text2Style: {fontSize: 16},
                });
            }
        } catch (e: any) {
            console.error("err while adding news to favorite:", e.response.data);
            const messageErr: string = e.response.data;
            Toast.show({
                type: 'error',
                text1: 'Failed to add news to favorites 😞',
                text2: `${messageErr}`,
                position: 'bottom',
                visibilityTime: 3000,
                text1Style: {fontSize: 18},
                text2Style: {fontSize: 16},
            });
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

    // past and display html to word logic
    const parseHtmlToWords = (htmlContent: string) => {
        const trimmedContent = htmlContent.replace(/^"|"$/g, '');
        // Loại bỏ thẻ HTML
        const cleanedContent = trimmedContent.replace(/<\/?[^>]+(>|$)/g, "").trim();
        const cleanedString = cleanedContent.replace(/\\\"/g, ''); // Loại bỏ dấu \\\
        // Tách chuỗi thành từng từ và xử lý ký tự xuống dòng
        const words = cleanedString.split(" ");
        // const filteredWords = words.filter(word => word !== "" && word !=="\\n");
        const filteredWords = words
            .filter(word => word !== "" && word !== "\\n")  // Lọc bỏ các phần tử trống và "\n"
            .map(word => word.replace("\\n", "\n"));        // Thay thế "\n" trong từ


        console.log(filteredWords);

        return filteredWords.flatMap((word, index) => {
            const containsNewline = word.includes("\n");
            // Kiểm tra xem từ có phải là ký tự xuống dòng hay không
            if(word === "'\\\'" || word.includes("'\\\'")) {
                return (
                    <Text></Text>
                )
            } else {
                return (
                    <TouchableOpacity key={index} onPress={() => handleWordPress(word)}>
                        <Text
                            style={[
                                { textColor: textColor , width: containsNewline ? screenWidth : undefined, fontSize: fontSize, marginRight: 5 }
                            ]}
                        >
                            {word}
                        </Text>
                    </TouchableOpacity>
                );
            }
        });
    };


    const [parsedWords, setParsedWords] = useState<any>();

    useEffect(() => {
        setParsedWords(parseHtmlToWords(newsContent.join(" ")));
    }, [newsContent, textColor, fontSize]);
    // past and display html to word logic


    return (
        <SafeAreaView style={GlobalStyles.AndroidSafeArea}>
            <StatusBar hidden={true}/>
            <ToastGalio isShow={isShowToast} positionIndicator="top" color="warning"> No audio found </ToastGalio>
            {/* header area */}
            <Block style={[GlobalStyles.main_container]} flexDirection="row" justifyContent="space-between"
                   alignItems="center">
                <TouchableOpacity onPress={backButton}>
                    <Text size={18}> <SimpleLineIcons name="arrow-left" size={18}/> </Text>
                </TouchableOpacity>

                <Block flexDirection="row" justifyContent="space-between"
                       alignItems="center">
                    <TouchableOpacity onPress={handleAddNewsToFavoriteBtn}>
                        <Text size={20}> <FontAwesome name="heart-o" size={24}/> </Text>
                    </TouchableOpacity>
                    <Block width={8}></Block>
                    <TouchableOpacity onPress={
                        openDrawer}>
                        <Text size={20}> <SimpleLineIcons name="settings" size={24}/> </Text>
                    </TouchableOpacity>
                </Block>
            </Block>
            {/* header area */}
            <Block height={12}></Block>
            <Block style={GlobalStyles.under_line}></Block>

            <ScrollView style={[{backgroundColor}, GlobalStyles.container]}>
                {/*content view*/}
                <Block style={GlobalStyles.main_container}>
                    <Block height={4}></Block>
                    <Block style={styles.textContainer}>
                        {newsTitle.map((word: any, index: any) => (
                            <TouchableOpacity key={index} onPress={() => handleWordPress(word)}>
                                <Text bold style={{fontSize: fontSize + 4, color: textColor}}>{word} </Text>
                            </TouchableOpacity>
                        ))}
                    </Block>

                    <Block height={4}></Block>

                    <Image source={{uri: imageUrl || errImageUrl}} style={styles.image}/>

                    <Block style={styles.textContainer}>
                        {/*{newsContent.map((word: any, index: any) => (*/}
                        {/*    <TouchableOpacity key={index} onPress={() => handleWordPress(word)}>*/}
                        {/*        <Text style={{fontSize, color: textColor}}>{word} </Text>*/}
                        {/*    </TouchableOpacity>*/}
                        {/*))}*/}
                        {parsedWords}
                        {/*<RenderHtml*/}
                        {/*    contentWidth={200}*/}
                        {/*    // @ts-ignore*/}
                        {/*    source={{ html: `${newsContent.join(" ")}` }}*/}
                        {/*/>*/}
                    </Block>
                </Block>
                {/*content view*/}

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

                            <Block>
                                <Text size={16}>Viewing theme</Text>
                                <Block height={12}></Block>
                                <Block flexDirection="row" justifyContent="space-between">
                                    <TouchableOpacity style={[styles.viewing_button, {backgroundColor: whiteColor}]}
                                                      onPress={() => {
                                                          setBackgroundColor(whiteColor);
                                                      }}></TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.viewing_button, {backgroundColor: sandDollarColor}]}
                                        onPress={() => {
                                            setBackgroundColor(sandDollarColor);
                                        }}></TouchableOpacity>
                                    <TouchableOpacity style={[styles.viewing_button, {backgroundColor: charcoalColor}]}
                                                      onPress={() => {
                                                          setBackgroundColor(charcoalColor)
                                                      }}></TouchableOpacity>
                                </Block>

                                <Block height={12}></Block>

                                <Block>
                                    <Text size={16}>Font size: {fontSize}</Text>
                                    <Slider
                                        style={{width: "100%", height: 40}}
                                        minimumValue={10}
                                        maximumValue={40}
                                        step={1}
                                        value={fontSize}
                                        onValueChange={(value) => setFontSize(value)}
                                        minimumTrackTintColor="#1EB1FC"
                                        maximumTrackTintColor="#1EB1FC"
                                        thumbTintColor="#1EB1FC"
                                    />
                                    <Text size={fontSize}>Aa</Text>
                                </Block>
                            </Block>
                        </Block>
                    </View>
                </Modal>
                {/* setting modal*/}
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

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    drawer: {
        backgroundColor: 'white',
        padding: 20,
        height: "60%",
        width: '100%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    drawer_dictionary: {
        backgroundColor: 'white',
        padding: 20,
        width: '100%',
        height: '45%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    image: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    // style for viewbtn
    viewing_button: {
        width: '32%',
        height: 50,
        borderRadius: 5,
        borderWidth: 1
    },
    textContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    }
});

export default NewsDetailScreen;
