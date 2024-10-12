import {SafeAreaView, TouchableOpacity, View} from "react-native";
import React from 'react'
import {GlobalStyles} from "../../styles/GlobalStyles";
import {useNavigation, useRoute} from "@react-navigation/native";
// @ts-ignore
import Feather from 'react-native-vector-icons/Feather';

const TestScreen = () => {

    const router = useRoute();

    const navigation = useNavigation();

    const dataParams: any = router?.params;

    const [wordsData, setWordsData] = React.useState<any []>([]);

    const [trueFlaseQuestions, setTrueFlaseQuestions] = React.useState<any []>([]);

    const goBackBtn = () => {
        navigation.goBack();
    }

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
        const wordsDatRandom = dataParams?.wordsData?.sort(() => 0.5 - Math.random()).slice(0, dataParams?.numberOfQuestions);
        setWordsData(wordsDatRandom)
    }, [dataParams])

    React.useEffect(() => {
        const trueFalseQuestions = createTrueFalseQuestion(wordsData);
        setTrueFlaseQuestions(trueFalseQuestions);
    }, [wordsData]);

    React.useEffect(() => {
        console.log(trueFlaseQuestions)
    }, [trueFlaseQuestions]);

    return (
        <SafeAreaView style={GlobalStyles.AndroidSafeArea}>
            <View style={GlobalStyles.main_container}>
                <View style={[{flexDirection: 'row'}]}>
                    <TouchableOpacity style={[{padding: 6}]} onPress={goBackBtn}>
                        <Feather size={35} name="x"/>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

export default TestScreen