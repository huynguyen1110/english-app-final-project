import {
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    View,
    ScrollView,
    Image,
    FlatList,
    SectionList,
    ActivityIndicator
} from "react-native";
import {SegmentedButtons} from 'react-native-paper';
import {GlobalStyles} from "../../../styles/GlobalStyles";
import Slider from '@react-native-community/slider';
import {Block, Button, Text, Toast} from "galio-framework";
// @ts-ignore
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
// @ts-ignore
import FontAwesome from 'react-native-vector-icons/FontAwesome';
// @ts-ignore
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from "@react-navigation/native";
import {useEffect, useRef, useState} from "react";
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

    const fetchChatGptResponse = async () => {
        setChatGptResponse("");
        if (segmentButtonValue === "ChatGPT") {
            const prompt = getDefinitionInVietnamesePrompt(translateWord);
            const response = await askChatGpt(prompt);
            const {data}: any = response;
            setChatGptResponse(data.choices[0].message.content)
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
    useEffect( () => {
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

    return (
        <SafeAreaView style={GlobalStyles.AndroidSafeArea}>
            <Toast isShow={isShowToast} positionIndicator="top" color="warning"> No audio found </Toast>
            {/* header area */}
            <Block style={[GlobalStyles.main_container]} flexDirection="row" justifyContent="space-between"
                   alignItems="center">
                <TouchableOpacity onPress={backButton}>
                    <Text size={18}> <SimpleLineIcons name="arrow-left" size={18}/> </Text>
                </TouchableOpacity>

                <Block flexDirection="row" justifyContent="space-between"
                       alignItems="center">
                    <TouchableOpacity>
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
                        {newsContent.map((word: any, index: any) => (
                            <TouchableOpacity key={index} onPress={() => handleWordPress(word)}>
                                <Text style={{fontSize, color: textColor}}>{word} </Text>
                            </TouchableOpacity>
                        ))}
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
                        <Text size={18} bold> {translateWord}</Text>
                        <TouchableOpacity>
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
                                        renderItem={({item}: { item: string }) => (
                                            <View>
                                                <Block row justifyContent="space-between" alignItems="center">
                                                    <Block width={300}><Text size={16}>- {item}</Text></Block>

                                                    <TouchableOpacity style={{padding: 10}}>
                                                        <Text size={18}> <AntDesign size={18} name="addfolder"/> </Text>
                                                    </TouchableOpacity>
                                                </Block>
                                                <Block height={4} style={GlobalStyles.under_line}></Block>
                                            </View>
                                        )}
                                        renderSectionHeader={({section: {partOfSpeech}}) => (
                                            <View>
                                                <Block height={4}></Block>
                                                <Text size={16}><Text bold size={16}>Part of Speech:</Text> {partOfSpeech}
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
                                        renderItem={({item}: { item: string }) => (
                                            <View>
                                                <Block row justifyContent="space-between" alignItems="center">
                                                    <Block width={300}><Text size={16}>- {item}</Text></Block>
                                                    <TouchableOpacity style={{padding: 10}}>
                                                        <Text size={18}> <AntDesign size={18} name="addfolder"/> </Text>
                                                    </TouchableOpacity>
                                                </Block>
                                                <Block height={4} style={GlobalStyles.under_line}></Block>
                                            </View>
                                        )}
                                        renderSectionHeader={({section: {partOfSpeech}}) => (
                                            <View>
                                                <Block height={4}></Block>
                                                <Text size={16}><Text bold size={16}>Part of Speech:</Text> {partOfSpeech}
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
                                    <Text size={16}>{ chatGptResponse }</Text>
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
    },
});

export default NewsDetailScreen;
