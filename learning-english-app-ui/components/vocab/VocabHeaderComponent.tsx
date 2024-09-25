// @ts-ignore
import Feather from 'react-native-vector-icons/Feather';
import React from 'react';
import {TouchableOpacity, View} from "react-native";
import {
    Block,
    Text, theme
} from "galio-framework";
import {GlobalStyles} from "../../styles/GlobalStyles";
import {useNavigation} from "@react-navigation/native";

const VocabHeaderComponent = () => {

    const navigation = useNavigation();

    const navigateToCreateNewVocabPackScreen = () => {
        // @ts-ignore
        navigation.navigate("CreateNewVocabPackScreen");
    }

    return (
        <View>
            <Block flexDirection="row" justifyContent="space-between">
                <View style={{padding: 4}}>
                    <Text h5 italic bold color={theme.COLORS?.FACEBOOK}>E-English</Text>
                </View>
                <TouchableOpacity style={[ {padding: 4} ]} onPress={navigateToCreateNewVocabPackScreen}>
                    <Feather name="plus" size={27}/>
                </TouchableOpacity>
            </Block>
            <Block style={[GlobalStyles.under_line, {with: "100%"} ]}></Block>
        </View>
    );
}

export default VocabHeaderComponent;