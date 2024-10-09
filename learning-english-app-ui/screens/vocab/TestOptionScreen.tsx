import {SafeAreaView, TouchableOpacity, View} from "react-native";
import React from "react";
import {GlobalStyles} from "../../styles/GlobalStyles";
import {useNavigation, useRoute} from "@react-navigation/native";
import {Block} from "galio-framework";
// @ts-ignore
import Feather from "react-native-vector-icons/Feather";

const TestOptionScreen = () => {

    const navigation = useNavigation();

    const router = useRoute();

    const dataParams: any = router.params;

    const goBackBtn = () => {
        navigation.goBack();
    }

    React.useEffect(() => {
    }, [])

    return (
        <SafeAreaView style={GlobalStyles.AndroidSafeArea}>
            <View style={[GlobalStyles.main_container, {flex: 1}]}>
                <View style={[{flexDirection: 'row'}]}>
                    <TouchableOpacity style={[{padding: 6}]} onPress={goBackBtn}>
                        <Feather size={40} name="x"/>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

export default TestOptionScreen;