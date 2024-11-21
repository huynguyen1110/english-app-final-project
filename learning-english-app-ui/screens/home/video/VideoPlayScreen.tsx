import {
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    View,
    Modal,
    StyleSheet,
    ActivityIndicator,
    SectionList
} from "react-native";
import {GlobalStyles} from "../../../styles/GlobalStyles";
import {Block, Button, Text} from "galio-framework";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {useNavigation, useRoute} from "@react-navigation/native";
// @ts-ignore
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
// @ts-ignore
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// @ts-ignore
import AntDesign from "react-native-vector-icons/AntDesign";
// @ts-ignore
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import YoutubePlayer from "react-native-youtube-iframe";
import {getYtbVideoScriptService, translateService} from "../../../services/PythonService";
import {Modalize} from "react-native-modalize";
import {SegmentedButtons} from "react-native-paper";
import {BASE_PYTHON_URL, ENGLISH_DIC_API, PYTHON_ENTPOINT} from "../../../utils/API";
import axios from "axios";
import {getDefinitionInVietnamesePrompt} from "../../../utils/GptPrompts";
import {askChatGpt} from "../../../services/GptService";

const VideoPlayScreen = () => {

    const navigation = useNavigation();

    const router = useRoute();

    const [isLoading, setIsLoading] = useState(false);

    const dataParams: any = router.params;

    // Ref để điều khiển YoutubePlayer
    const playerRef = useRef(null);

    const [playing, setPlaying] = useState(false);

    const [videoScript, setVideoScript] = useState<any[]>([]);

    const [isTranslateModalVisible, setIsTranslateModalVisible] = useState(false);

    const [translatedText, setTranslatedText] = useState("");

    const scrollViewRef = useRef(); // Tạo tham chiếu cho ScrollView

    const [currentTime, setCurrentTime] = useState(0); // Thời gian hiện tại của video

    const [activeScriptIndex, setActiveScriptIndex] = useState(null); // Chỉ số của script đang phát

    const intervalRef = useRef(null);

    const modalRef = useRef<Modalize>(null);

    // word need to translate
    const [translateWord, setTranslateWord] = useState<string>("");

    // error when translated word is not valid
    const [translateErr, setTranslateErr] = useState<any>(null);

    const [segmentButtonValue, setSegmentButtonValue] = useState<string>("VI");

    // this is a field in free dic response
    const [phonetic, setPhonetic] = useState<any>(null);

    // this is a field in free dic response
    const [englishMeaning, setEnglishMeaning] = useState<any []>([]);

    // translation of field meaning in free dic
    const [vietnameseMeaning, setVietnameseMeaning] = useState<any []>([]);

    const [chatGptResponse, setChatGptResponse] = useState<string>("");

    const openModal = () => modalRef?.current?.open();

    // state of dictionary modal
    const [modalVisible, setModalVisible] = useState(false);

    const backButton = () => {
        navigation.goBack();
    }

    const onStateChange = useCallback((state: any) => {
        if (state === "ended") {
            setPlaying(false);
        }
    }, []);


    const getScript = async (videoId: any) => {
        try {
            setIsLoading(true);
            const {data}: any = await getYtbVideoScriptService(videoId);
            setVideoScript(data);
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    }

    // Hàm nhảy đến thời gian cụ thể
    const seekTo = (time: number) => {
        if (playerRef.current) {
            // @ts-ignore
            playerRef.current.seekTo(time, true); // true: nhảy ngay lập tức
        }
        setPlaying(true); // Tự động play sau khi seek
    };

    const translateText = async (text: any) => {
        try {
            const params = {
                source: "en",
                target: "vi"
            }
            setTranslatedText("");
            const {data}: any = await translateService(params, text);
            setTranslatedText(data);
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        // Khi video bắt đầu chơi, bắt đầu kiểm tra thời gian mỗi giây
        if (playing) {
            // @ts-ignore
            intervalRef.current = setInterval(() => {
                // @ts-ignore
                playerRef.current?.getCurrentTime().then((time: any) => {
                    setCurrentTime(time);
                    highlightCurrentScript(time);
                });
            }, 500); // Cập nhật mỗi giây
        } else {
            // @ts-ignore
            clearInterval(intervalRef.current); // Dừng kiểm tra khi video không còn chơi
        }

        // Dọn dẹp khi component bị hủy
        // @ts-ignore
        return () => clearInterval(intervalRef.current);
    }, [playing]);

    // Hàm so sánh và làm sáng đoạn script hiện tại
    const highlightCurrentScript = (currentTime: any) => {
        const activeIndex = videoScript.findIndex(
            (item) => currentTime >= item?.start && currentTime < item?.start + item?.duration
        );
        // @ts-ignore
        setActiveScriptIndex(activeIndex); // Cập nhật chỉ số đoạn script đang phát

        // Nếu có đoạn script đang phát, cuộn đến nó
        if (activeIndex !== -1 && scrollViewRef.current) {
            // @ts-ignore
            scrollViewRef.current.scrollTo({y: activeIndex * 60, animated: true}); // Cuộn đến vị trí của đoạn script
        }
    };

    // handle when press on word
    const handleWordPress = (word: string) => {
        // remove white space or dot, comma from word
        setTranslateWord(word.replace(/[.,;:]+$/, ''));
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

    // call translation api
    const translateFunction = async (text: string, sourceLanguage: string, targetLanguage: string) => {
        try {
            const response = await axios.post(
                `${BASE_PYTHON_URL}${PYTHON_ENTPOINT.TRANSLATE}?source=${sourceLanguage}&target=${targetLanguage}`,  // Sửa URL
                { text: text }  // Gửi dữ liệu text trong body của POST request
            );
            const { data } = response;
            return data;  // Trả về dữ liệu nhận được từ API
        } catch (err) {
            console.log(err);
        }
    }


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

    const fetchChatGptResponse = async () => {
        setChatGptResponse("");
        if (segmentButtonValue === "ChatGPT") {
            const prompt = getDefinitionInVietnamesePrompt(translateWord);
            const response = await askChatGpt(prompt);
            const {data}: any = response;
            setChatGptResponse(data.choices[0].message.content);
        }
    };

    // handle play sound
    const playAudioBtn = async () => {

    }

    // ask chatGpt for definition of the word. call askChatgpt funct
    useEffect(() => {
        fetchChatGptResponse();
    }, [segmentButtonValue]);

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

    useEffect(() => {
        getScript(dataParams?.videoId);
    }, [dataParams]);

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
                <TouchableOpacity>
                    <Text size={20}></Text>
                </TouchableOpacity>
            </Block>
            <Block height={12}></Block>
            <Block style={GlobalStyles.under_line}></Block>

            <View>
                <YoutubePlayer
                    ref={playerRef}
                    height={250}
                    play={playing}
                    videoId={dataParams?.videoId}
                    onChangeState={onStateChange}
                />
                <ScrollView
                    // @ts-ignore
                    ref={scrollViewRef}
                >
                    <View style={GlobalStyles.main_container}>
                        {videoScript.length > 0 ? (
                            videoScript.map((item, index) => {
                                const isActive = activeScriptIndex === index; // Kiểm tra nếu đoạn này đang phát
                                return (
                                    <View key={index}>
                                        <Block height={20}/>
                                        <View
                                            style={[
                                                GlobalStyles.flex_row,
                                                GlobalStyles.justify_content_space_between,
                                                GlobalStyles.align_item_center,
                                            ]}
                                        >
                                            <View style={{width: '75%'}}>
                                                <View style={{flexWrap: 'wrap', flexDirection: 'row'}}>
                                                    {item?.text.replace(/\n/g, ' ').split(' ').map((word: any, index: any) => (
                                                        <TouchableOpacity key={index}
                                                                          onPress={() => handleWordPress(word)}>
                                                            <Text style={{
                                                                fontSize: 18,
                                                                color: isActive ? 'blue' : 'black', // Đổi màu nếu đoạn này đang phát
                                                            }}>{word} </Text>
                                                        </TouchableOpacity>
                                                    ))}
                                                </View>
                                            </View>
                                            <View
                                                style={[
                                                    GlobalStyles.flex_row,
                                                    GlobalStyles.justify_content_space_between,
                                                    GlobalStyles.align_item_center,
                                                    {width: '20%'},
                                                ]}
                                            >
                                                <TouchableOpacity onPress={() => {
                                                    setIsTranslateModalVisible(true);
                                                    translateText(item?.text);
                                                }}>
                                                    <Text>
                                                        <MaterialIcons size={26} name="g-translate"/>
                                                    </Text>
                                                </TouchableOpacity>
                                                <Block width={5}/>
                                                <TouchableOpacity onPress={() => seekTo(item?.start)}>
                                                    <Text>
                                                        <AntDesign size={26} name="play"/>
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        <Block height={20}/>
                                        <View style={GlobalStyles.under_line}/>
                                    </View>
                                );
                            })
                        ) : (
                            <View>
                                <Text>No transcript available</Text>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </View>
            {/* translate sentence modal */}
            <Modal
                visible={isTranslateModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => {
                    setIsTranslateModalVisible(false)
                }} // Đóng modal khi nhấn nút Back
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.translatedText}>{translatedText}</Text>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setIsTranslateModalVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            {/* translate sentence modal */}

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

        </SafeAreaView>
    )
}

export default VideoPlayScreen;

const styles = StyleSheet.create({
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
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Nền tối khi modal mở
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    translatedText: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
    },
    closeButton: {
        backgroundColor: '#007BFF',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});


