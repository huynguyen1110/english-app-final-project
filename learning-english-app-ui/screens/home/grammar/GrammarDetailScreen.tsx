import {SafeAreaView, TouchableOpacity, View} from "react-native";
import {GlobalStyles} from "../../../styles/GlobalStyles";
import {Block, Text} from "galio-framework";
// @ts-ignore
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import React, {useEffect, useState} from "react";
import {useNavigation, useRoute} from "@react-navigation/native";
import RenderHtml from "react-native-render-html";

const GrammarDetailScreen = () => {

    const navigation = useNavigation();

    const router = useRoute();

    const paramsData: any = router.params;

    const [grammarData, setGrammarData] = useState<any>();

    const backButton = () => {
        navigation.goBack();
    }

    useEffect(() => {
        setGrammarData(paramsData?.grammarData)
    }, [paramsData]);

    return (
        <SafeAreaView style={GlobalStyles.AndroidSafeArea}>
            <Block style={GlobalStyles.main_container} flexDirection="row" justifyContent="space-between"
                   alignItems="center">
                <TouchableOpacity onPress={backButton}>
                    <Text size={18}> <SimpleLineIcons name="arrow-left" size={18}/> </Text>
                </TouchableOpacity>
                <View>
                    <Text size={20}> Grammar </Text>
                </View>
                <View>
                    <Text size={20}> </Text>
                </View>
            </Block>
            <Block height={12}></Block>
            <Block style={GlobalStyles.under_line}></Block>
            <View style={GlobalStyles.main_container}>
                <RenderHtml
                    contentWidth={200}
                    source={{ html: grammarData?.content || '' }} // Cần đảm bảo grammarData.content là một chuỗi HTML hợp lệ
                />
            </View>
        </SafeAreaView>
    );
}

export default GrammarDetailScreen;