import React from "react";
import {Image, StyleSheet, TouchableOpacity, View} from "react-native";
import {Block} from "galio-framework";
import {Layout, Text} from "@ui-kitten/components";
import {GlobalStyles} from "../../../styles/GlobalStyles";
import {useNavigation} from "@react-navigation/native";

const LearningActionComponent = ({wordsData}: { wordsData: any }) => {

    const navigation = useNavigation();

    const navigateToFlashCardScreen = () => {
        // @ts-ignore
        navigation.navigate("FlashCardScreen");
    }

    return (
        <Layout level='2'>
            <TouchableOpacity style={[styles.container]} onPress={navigateToFlashCardScreen}>
                <View style={GlobalStyles.main_container}>
                    <Block height={60} row alignItems='center'>
                        <Image style={styles.icon} source={require('../../../assets/icon-png/flash-cards.png')}/>
                        <Block width={12}></Block>
                        <Text category='label' style={{fontSize: 16}}>Flash card</Text>
                    </Block>
                </View>
            </TouchableOpacity>

            <Block height={6}></Block>

            <TouchableOpacity style={[styles.container]}>
                <View style={GlobalStyles.main_container}>
                    <Block height={60} row alignItems='center'>
                        <Image style={styles.icon} source={require('../../../assets/icon-png/document.png')}/>
                        <Block width={12}></Block>
                        <Text category='label' style={{fontSize: 16}}>Test</Text>
                    </Block>
                </View>
            </TouchableOpacity>

            <Block height={8}></Block>
        </Layout>
    );
}

export default LearningActionComponent;

const styles = StyleSheet.create({
    container: {
        width: "95%",
        height: 60,
        backgroundColor: "white",

        // Đổ bóng cho Android
        elevation: 5,
        // Có thể thêm marginTop để tạo cảm giác bóng chỉ ở các phía khác
        marginTop: 5,

        // Đổ bóng cho iOS
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 5},  // Chỉ tạo bóng ở phía dưới và hai bên
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        // Bo góc nếu cần
        borderRadius: 10,
        marginLeft: "auto",
        marginRight: "auto",
    },
    icon: {
        width: 40,
        height: 40,
    }
});