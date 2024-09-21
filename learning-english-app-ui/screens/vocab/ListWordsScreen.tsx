import {SafeAreaView} from "react-native";
import React from 'react';
import {GlobalStyles} from "../../styles/GlobalStyles";
import {Text} from "@ui-kitten/components";
import {useRoute} from "@react-navigation/native";
import ListWordsScreenHeader from "../../components/vocab/list-word-screen/ListWordsScreenHeader";

const ListWordsScreen = () => {

    const router = useRoute();

    // @ts-ignore
    const packageData: any = router?.params?.packageData;

    return (
        <SafeAreaView style={[ GlobalStyles.AndroidSafeArea ]}>
            <ListWordsScreenHeader/>
        </SafeAreaView>
    );
}

export default ListWordsScreen;