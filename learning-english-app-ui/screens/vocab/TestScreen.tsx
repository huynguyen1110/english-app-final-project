import {SafeAreaView, StyleSheet, TouchableOpacity, View, ProgressBarAndroid, ScrollView, Image} from "react-native";
import React from 'react'
import {GlobalStyles} from "../../styles/GlobalStyles";
import {useNavigation, useRoute} from "@react-navigation/native";
// @ts-ignore
import Feather from 'react-native-vector-icons/Feather';
import {Text} from "galio-framework";
import {ProgressBar, MD3Colors} from 'react-native-paper';
import * as Progress from 'react-native-progress';

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
            setPercentOftrueQuestions(numberOfCorrectQuestions / trueFalseQuestions?.length);
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
                showCorrectMeaning: showCorrectMeaning
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
                                <Text size={20}>Practice your incorrectly answered terms with the learning mode until
                                    you get them all right.</Text>
                            </View>
                            <Image style={styles.winIcon} source={require('../../assets/icon-png/achievement.png')}/>
                        </View>

                        <View style={{height: 26}}></View>

                        <View>
                            <Text bold size={18}>Your result</Text>
                            <View style={[GlobalStyles.flex_collum, GlobalStyles.align_item_center]}>
                                <Progress.Circle
                                    progress={percentOftrueQuestions}
                                    size={100}
                                    color="green"
                                    unfilledColor={MD3Colors.error50}
                                ></Progress.Circle>
                                <View style={{height: 6}}></View>
                                <Text>{percentOftrueQuestions} %</Text>
                            </View>
                        </View>
                        <Text>You answered {numberOfCorrectQuestions} out of {trueFalseQuestions.length} questions
                            correctly.</Text>

                    </ScrollView>
                )
            }


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
    winIcon: {
        width: "20%",
        height: 100,
        resizeMode: 'stretch'
    }
});