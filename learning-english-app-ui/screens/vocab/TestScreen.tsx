import {SafeAreaView, StyleSheet, TouchableOpacity, View, ProgressBarAndroid, ScrollView, Image} from "react-native";
import React from 'react'
import {GlobalStyles} from "../../styles/GlobalStyles";
import {useNavigation, useRoute} from "@react-navigation/native";
// @ts-ignore
import Feather from 'react-native-vector-icons/Feather';
// @ts-ignore
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Text} from "galio-framework";
import {ProgressBar, MD3Colors} from 'react-native-paper';
import * as Progress from 'react-native-progress';
import {themeAppColor} from "../../utils/constant";
import {Layout} from "@ui-kitten/components";

const TestScreen = () => {

    const router = useRoute();

    const navigation = useNavigation();

    const dataParams: any = router?.params;

    const [wordsData, setWordsData] = React.useState<any []>([]);

    // true false question data
    const [trueFalseQuestions, setTrueFalseQuestions] = React.useState<any []>([]);

    const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0); // Chỉ số câu hỏi hiện tại

    const [answered, setAnswered] = React.useState(false); // Kiểm soát xem đã trả lời chưa

    const [currentQuestion, setCurrentQuestion] = React.useState<any>(null);

    const [numberOfCorrectQuestions, setNumberOfCorrectQuestions] = React.useState<number>(0);

    const [percentOftrueQuestions, setPercentOftrueQuestions] = React.useState<any>(0);

    const [isGameFinished, setIsGameFinished] = React.useState(false);

    const goBackBtn = () => {
        navigation.goBack();
    }

    const handleTrueFalseAnswer = (isCorrect: boolean) => {
        setAnswered(true);
        if (isCorrect === currentQuestion?.isCorrect) {
            console.log("Correct!");
            setNumberOfCorrectQuestions(numberOfCorrectQuestions + 1);
        } else {
            console.log("Incorrect!");
        }
    };

    const handleNextQuestion = () => {
        setAnswered(false); // Đặt lại trạng thái đã trả lời
        if (currentQuestionIndex < trueFalseQuestions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1); // Chuyển sang câu hỏi tiếp theo
        } else {
            setIsGameFinished(true);
            setPercentOftrueQuestions((numberOfCorrectQuestions / trueFalseQuestions?.length).toFixed(2));
            console.log("You've completed the game!");
        }
    };

    // Function to get a random incorrect meaning (from the same data list)
    const getRandomIncorrectMeaning = (list: any, correctMeaning: any) => {
        const incorrectMeanings = list
            .map((item: any) => item.meaning)
            .filter((meaning: any) => meaning !== correctMeaning); // Exclude the correct meaning

        return incorrectMeanings[Math.floor(Math.random() * incorrectMeanings.length)] || "Unknown"; // Default to "Unknown" if no incorrect meanings are available
    };

    // Create a new list of formatted questions
    const createTrueFalseQuestion = (wordData: any) => {
        return wordData.map((wordObj: any) => {
            // Get the correct meaning
            const correctMeaning = wordObj.meaning;

            // Get a random incorrect meaning
            const incorrectMeaning = getRandomIncorrectMeaning(wordData, correctMeaning);

            // Randomly decide if we show the correct meaning or the incorrect one
            const showCorrectMeaning = Math.random() < 0.5;

            return {
                word: wordObj.name,
                meaning: correctMeaning,
                incorrectMeaning: incorrectMeaning, // Add the incorrect meaning to the structure
                image: wordObj.image,
                isCorrect: showCorrectMeaning, // Indicate if the displayed meaning is correct
                showCorrectMeaning: showCorrectMeaning,
                answered: false
            };
        });
    };


    React.useEffect(() => {
        // take random question
        const wordsDatRandom = dataParams?.wordsData?.sort(() => 0.5 - Math.random()).slice(0, dataParams?.numberOfQuestions);
        setWordsData(wordsDatRandom)
    }, [dataParams])

    React.useEffect(() => {
        if (dataParams?.isTrueFalseOption) {
            if (trueFalseQuestions?.length == 0) {
                // create true false question base on random question above
                const trueFalseQuestions = createTrueFalseQuestion(wordsData);
                setTrueFalseQuestions(trueFalseQuestions);
            }
        }
    }, [wordsData]);

    // Khi trueFalseQuestions thay đổi, set câu hỏi hiện tại
    React.useEffect(() => {
        if (trueFalseQuestions.length > 0) {
            setCurrentQuestion(trueFalseQuestions[currentQuestionIndex]);
        }
    }, [trueFalseQuestions, currentQuestionIndex]);

    // Sử dụng useEffect để chuyển sang câu hỏi tiếp theo
    React.useEffect(() => {
        if (answered) {
            handleNextQuestion();
        }
    }, [answered]);

    return (
        <SafeAreaView style={GlobalStyles.AndroidSafeArea}>
            <Layout level="2" style={{flex: 1}}>
                <View style={GlobalStyles.main_container}>
                    <View
                        style={[GlobalStyles.flex_row, GlobalStyles.align_item_center, GlobalStyles.justify_content_space_between]}>
                        <TouchableOpacity style={[{padding: 6}]} onPress={goBackBtn}>
                            <Feather size={35} name="x"/>
                        </TouchableOpacity>
                        {
                            dataParams?.isTrueFalseOption ? (
                                <View>
                                    <Text size={28}>{currentQuestionIndex + 1}/{trueFalseQuestions?.length}</Text>
                                </View>
                            ) : (
                                <View>
                                </View>
                            )
                        }
                        <View style={{width: 35}}></View>
                    </View>
                </View>
                {
                    dataParams?.isTrueFalseOption ? (
                        <ProgressBar
                            progress={(currentQuestionIndex + 1) / (trueFalseQuestions?.length || 1)}
                            color={MD3Colors.error50}
                        />
                    ) : (
                        <View></View>
                    )
                }
                {
                    !isGameFinished ? (
                        dataParams?.isTrueFalseOption ? (
                            <View style={{padding: 20}}>
                                <View>
                                    <Text bold size={18}>Word:</Text>
                                    <Text size={26}>{currentQuestion?.word}</Text>
                                    <View style={{height: 4}}></View>
                                    {currentQuestion?.showCorrectMeaning === false ? (
                                        <View>
                                            <Text bold size={18}>Meaning:</Text>
                                            <Text size={26}>{currentQuestion?.incorrectMeaning}</Text>
                                        </View>
                                    ) : (
                                        <View>
                                            <Text bold size={18}>Meaning:</Text>
                                            <Text size={26}>{currentQuestion?.meaning}</Text>
                                        </View>
                                    )}
                                </View>
                                {answered ? (
                                    <View>
                                        <Text>Answer: {currentQuestion.isCorrect ? "True" : "False"}</Text>
                                    </View>
                                ) : (
                                    <View>
                                        <View style={{height: 14}}></View>
                                        <Text size={16}>Choose the correct answer:</Text>
                                        <View style={{height: 12}}></View>
                                        <TouchableOpacity style={styles.trueFlaseBtn}
                                                          onPress={() => handleTrueFalseAnswer(true)}>
                                            <Text size={18}>True</Text>
                                        </TouchableOpacity>
                                        <View style={{height: 20}}></View>
                                        <TouchableOpacity style={styles.trueFlaseBtn}
                                                          onPress={() => handleTrueFalseAnswer(false)}>
                                            <Text size={18}>False</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                        ) : (
                            <View></View>
                        )
                    ) : (
                        // Hiển thị kết quả khi trò chơi kết thúc
                        <ScrollView style={GlobalStyles.main_container}>
                            <View style={{height: 36}}></View>
                            <View
                                style={[GlobalStyles.flex_row, GlobalStyles.align_item_center, GlobalStyles.justify_content_space_between]}>
                                <View style={{width: "75%"}}>
                                    <Text bold size={25}>You are learning something!</Text>
                                    <Text size={20}>Practice your incorrectly answered terms with the learning mode
                                        until
                                        you get them all right.</Text>
                                </View>
                                <Image style={styles.winIcon}
                                       source={require('../../assets/icon-png/achievement.png')}/>
                            </View>

                            <View style={{height: 26}}></View>

                            <View>
                                <Text bold size={18}>Your result</Text>
                                <View style={{height: 12}}></View>
                                <View
                                    style={[GlobalStyles.flex_row, GlobalStyles.justify_content_space_between, GlobalStyles.align_item_center]}>
                                    <View
                                        style={[GlobalStyles.flex_collum, GlobalStyles.align_item_center, {width: "40%"}]}>
                                        <Progress.Circle
                                            progress={percentOftrueQuestions}
                                            size={100}
                                            color="#77ed96"
                                            unfilledColor="#eb983b"
                                        ></Progress.Circle>
                                        <View style={{height: 6}}></View>
                                        <Text>{percentOftrueQuestions} %</Text>
                                    </View>
                                    <View
                                        style={[{width: "60%"}, GlobalStyles.flex_row, GlobalStyles.justify_content_space_around, GlobalStyles.align_item_center]}>
                                        <View
                                            style={[GlobalStyles.flex_collum, GlobalStyles.justify_content_space_around, GlobalStyles.align_item_center]}>
                                            <Text size={16} bold color="#77ed96">Correct</Text>
                                            <Text size={16} bold color="#eb983b">False</Text>
                                        </View>
                                        <View style={{height: 20}}></View>
                                        <View
                                            style={[GlobalStyles.flex_collum, GlobalStyles.justify_content_space_around, GlobalStyles.align_item_center]}>
                                            <Text size={16} bold color="#77ed96">{numberOfCorrectQuestions}</Text>
                                            <Text size={16} bold
                                                  color="#eb983b">{trueFalseQuestions.length - numberOfCorrectQuestions}</Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={{height: 25}}></View>

                                <View><Text bold size={18}>Next steps</Text></View>

                                <View style={{height: 12}}></View>

                                <View>
                                    <TouchableOpacity style={[styles.lageBtn, {backgroundColor: themeAppColor}]}
                                                      onPress={goBackBtn}>
                                        <Text size={16} bold>Take the test again</Text>
                                    </TouchableOpacity>
                                    <View style={{height: 12}}></View>
                                    <TouchableOpacity style={[styles.lageBtn, {backgroundColor: "white"}]}
                                                      onPress={() => {
                                                          // @ts-ignore
                                                          navigation.navigate("FlashCardScreen", {wordsData: dataParams?.wordsData})
                                                      }}>
                                        <Text size={16} bold>Learn with flash card</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={{height: 50}}></View>

                            <View>
                                <Text size={18} bold>Your answers</Text>
                                <View style={{height: 20}}></View>
                                <Layout level="1" style={styles.cardContainer}>
                                    <View style={{height: 16}}></View>
                                    <View style={[GlobalStyles.main_container]}>
                                        <Text size={16} bold>Hello</Text>
                                        <View style={{height: 12}}></View>
                                        <View style={[GlobalStyles.under_line]}></View>
                                        <View style={{height: 12}}></View>

                                        <Text size={16} bold>Xin chao</Text>

                                        <View style={{height: 30}}></View>

                                        <View style={[GlobalStyles.flex_row, GlobalStyles.justify_content_space_around, GlobalStyles.align_item_center]}>
                                            <View style={[GlobalStyles.flex_collum, GlobalStyles.align_item_center, GlobalStyles.justify_content_center]}>
                                                <Feather color="green" size={20} name="check"/>
                                                <Text color="green" size={16}>True</Text>
                                            </View>
                                            <View style={[GlobalStyles.flex_collum, GlobalStyles.align_item_center, GlobalStyles.justify_content_center]}>
                                                <Feather color="red" size={20} name="x"/>
                                                <Text color="red" size={16}>False</Text>
                                            </View>
                                        </View>
                                    </View>

                                    <View style={{height: 40}}></View>

                                    <View style={[GlobalStyles.justify_content_center, GlobalStyles.align_item_center, {height: 50, width: "100%", backgroundColor: "red"}]}>
                                        <View style={[GlobalStyles.main_container, GlobalStyles.flex_row]}>
                                            <Feather color="white" size={20} name="x"/>
                                            <View style={{width: 4}}></View>
                                            <Text color="white" size={16}>False</Text>
                                        </View>
                                    </View>
                                </Layout>

                                <View style={{height: 20}}></View>

                                <Layout level="1" style={styles.cardContainer}>
                                    <View style={{height: 16}}></View>
                                    <View style={[GlobalStyles.main_container]}>
                                        <Text size={16} bold>Hello</Text>
                                        <View style={{height: 12}}></View>
                                        <View style={[GlobalStyles.under_line]}></View>
                                        <View style={{height: 12}}></View>

                                        <Text size={16} bold>Xin chao</Text>

                                        <View style={{height: 30}}></View>

                                        <View style={[GlobalStyles.flex_row, GlobalStyles.justify_content_space_around, GlobalStyles.align_item_center]}>
                                            <View style={[GlobalStyles.flex_collum, GlobalStyles.align_item_center, GlobalStyles.justify_content_center]}>
                                                <Feather color="green" size={20} name="check"/>
                                                <Text color="green" size={16}>True</Text>
                                            </View>
                                            <View style={[GlobalStyles.flex_collum, GlobalStyles.align_item_center, GlobalStyles.justify_content_center]}>
                                                <Feather color="red" size={20} name="x"/>
                                                <Text color="red" size={16}>False</Text>
                                            </View>
                                        </View>
                                    </View>

                                    <View style={{height: 40}}></View>

                                    <View style={[GlobalStyles.justify_content_center, GlobalStyles.align_item_center, {height: 50, width: "100%", backgroundColor: "red"}]}>
                                        <View style={[GlobalStyles.main_container, GlobalStyles.flex_row]}>
                                            <Feather color="white" size={20} name="x"/>
                                            <View style={{width: 4}}></View>
                                            <Text color="white" size={16}>False</Text>
                                        </View>
                                    </View>
                                </Layout>

                            </View>
                        </ScrollView>
                    )
                }
            </Layout>
        </SafeAreaView>
    );
}

export default TestScreen

const styles = StyleSheet.create({
    trueFlaseBtn: {
        width: "100%",
        height: 50,
        borderWidth: 2,
        borderColor: "gray",
        borderRadius: 4,
        justifyContent: "center",
        padding: 6
    },
    lageBtn: {
        width: "100%",
        height: 60,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4
    },
    winIcon: {
        width: "20%",
        height: 100,
        resizeMode: 'stretch'
    },
    cardContainer: {
        width: "100%",
        height: 250,
    }
});