import {Image, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, View} from "react-native";
import React from "react";
import {GlobalStyles} from "../../styles/GlobalStyles";
import {useNavigation, useRoute} from "@react-navigation/native";
import {Block, Text, theme} from "galio-framework";
// @ts-ignore
import Feather from "react-native-vector-icons/Feather";
import {themeAppColor} from "../../utils/constant";
import {Toggle} from "@ui-kitten/components";

const TestOptionScreen = () => {

    const navigation = useNavigation();

    const router = useRoute();

    const dataParams: any = router.params;

    const [wordsData, setWordsData] = React.useState<any []>([]);

    const [numberOfQuestions, setNumberOfQuestions] = React.useState('');

    const [isTrueFalseOption, setIsTrueFalseOption] = React.useState(true);

    const [isMultipleChoiceOption, setIsMultipleChoiceOption] = React.useState(false);

    const [isNotValid, setIsNotValid] = React.useState(false);

    const goBackBtn = () => {
        navigation.goBack();
    }

    const onIsTrueFlaseOptionChange = (isChecked: boolean) => {
        setIsTrueFalseOption(isChecked);
        setIsMultipleChoiceOption(!isChecked);
    };

    const onIsMultipleChoiceOptionChange = (isChecked: boolean) => {
        setIsTrueFalseOption(!isChecked);
        setIsMultipleChoiceOption(isChecked);
    };

    // handle limitation number of questions
    const handleNumberChange = (text: string) => {
        // Remove any non-numeric characters
        let numericText: string = text.replace(/[^0-9]/g, '');

        // Ensure the number is between 1 and limit number
        let number: number | '' = parseInt(numericText, 10);

        // Determine the limit based on wordsData length (default to 1 if undefined)
        const limit = wordsData?.length ?? 1;

        if (isNaN(number) || number < 1) {
            number = ''; // Empty input if no valid number is typed or number < 1
        } else if (number > limit) {
            number = limit; // Limit the value to the length of wordsData
        }

        setNumberOfQuestions(number.toString()); // Convert to string to update input value
    };

    const handleStartBtn = () => {
        if (numberOfQuestions === '') {
            setIsNotValid(true);
        } else {
            // @ts-ignore
            navigation.navigate("TestScreen", { numberOfQuestions, wordsData, isMultipleChoiceOption, isTrueFalseOption })
            setIsNotValid(false);
        }
    }

    React.useEffect(() => {
        setWordsData(dataParams?.wordsData);
    }, [dataParams])

    return (
        <SafeAreaView style={GlobalStyles.AndroidSafeArea}>
            <View style={[GlobalStyles.main_container, {flex: 1}]}>
                <View style={[{flexDirection: 'row'}]}>
                    <TouchableOpacity style={[{padding: 6}]} onPress={goBackBtn}>
                        <Feather size={35} name="x"/>
                    </TouchableOpacity>
                </View>

                <View
                    style={[GlobalStyles.justify_content_space_between, GlobalStyles.flex_row, GlobalStyles.align_item_center]}>
                    <Text size={30} bold>Set up your test</Text>
                    <Image style={styles.testIcon} source={require('../../assets/icon-png/checklist.png')}/>
                </View>

                <Block height={50}></Block>

                <View
                    style={[GlobalStyles.flex_row, GlobalStyles.align_item_center, GlobalStyles.justify_content_space_between]}>
                    <Text size={20} bold>Number of question ({wordsData?.length}): </Text>
                    <TextInput keyboardType="numeric" style={styles.textInput}
                               value={numberOfQuestions}
                               onChangeText={handleNumberChange} />
                </View>
                <View style={[GlobalStyles.flex_row, GlobalStyles.align_item_center, GlobalStyles.justify_content_space_between]}>
                    <View></View>
                    {isNotValid ? (
                        <Text bold color="red">Can not be empty</Text>
                    ) : (
                        <Text></Text>
                    )}
                </View>

                <Block height={50}></Block>

                <View style={[GlobalStyles.under_line]}></View>

                <Block height={40}></Block>

                <View
                    style={[GlobalStyles.flex_row, GlobalStyles.align_item_center, GlobalStyles.justify_content_space_between]}>
                    <Text size={20} bold>True/Flase: </Text>
                    <Toggle
                        checked={isTrueFalseOption}
                        onChange={onIsTrueFlaseOptionChange}
                    >
                    </Toggle>
                </View>

                <Block height={40}></Block>

                <View
                    style={[GlobalStyles.flex_row, GlobalStyles.align_item_center, GlobalStyles.justify_content_space_between]}>
                    <Text size={20} bold>Multiple choice: </Text>
                    <Toggle
                        checked={isMultipleChoiceOption}
                        onChange={onIsMultipleChoiceOptionChange}
                    >
                    </Toggle>
                </View>

                <Block height={310}></Block>

                <TouchableOpacity style={[styles.startTestBtn]} onPress={handleStartBtn}>
                    <Text bold size={20}>Start your test</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

export default TestOptionScreen;

const styles = StyleSheet.create({
    testIcon: {
        width: 50,
        height: 50,
        resizeMode: "stretch",
    },
    textInput: {
        borderBottomWidth: 3,
        width: 60,
        height: 40,
        borderBottomColor: themeAppColor
    },
    startTestBtn: {
        width: "100%",
        height: 50,
        backgroundColor: themeAppColor,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4
    }
});