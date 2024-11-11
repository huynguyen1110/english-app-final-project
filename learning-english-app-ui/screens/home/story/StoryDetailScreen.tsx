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
                <TouchableOpacity>
                    <Text size={20}> <AntDesign size={26} name="check"/> </Text>
                </TouchableOpacity>
            </Block>
            <Block height={12}></Block>
            <Block style={GlobalStyles.under_line}></Block>
            <ScrollView>
                <View style={GlobalStyles.main_container}>
                    <Block height={16}></Block>
                    <Text size={26} bold>{storyData?.vnTitle}</Text>
                    <Block height={16}></Block>
                    <Text size={26} italic>{storyData?.engTitle}</Text>
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
                                                                          // const saveWordData = {
                                                                          //     // @ts-ignore
                                                                          //     word: translateWord,
                                                                          //     partOfSpeech: partOfSpeech,
                                                                          //     definition: item,
                                                                          //     example: null,
                                                                          //     audio: phonetic?.audio,
                                                                          //     phonetic: phonetic?.text
                                                                          // }
                                                                          // // @ts-ignore
                                                                          // navigation.navigate("SaveNewWordScreen", saveWordData)
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
                                                                          // const saveWordData = {
                                                                          //     // @ts-ignore
                                                                          //     word: translateWord,
                                                                          //     partOfSpeech: partOfSpeech,
                                                                          //     definition: item,
                                                                          //     example: null,
                                                                          //     audio: phonetic?.audio,
                                                                          //     phonetic: phonetic?.text
                                                                          // }
                                                                          // // @ts-ignore
                                                                          // navigation.navigate("SaveNewWordScreen", saveWordData)
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
    );
}

export default StoryDetailScreen;

const styles = StyleSheet.create({
    textContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    }
});

