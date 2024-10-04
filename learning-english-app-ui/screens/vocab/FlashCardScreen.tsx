import {Dimensions, LogBox, SafeAreaView, StatusBar, StyleSheet, TouchableOpacity, View} from "react-native";
import {GlobalStyles} from "../../styles/GlobalStyles";
import {Block, Text} from "galio-framework";
import React from "react";
import {useNavigation} from "@react-navigation/native";
// @ts-ignore
import FlipCard from 'react-native-flip-card';
// @ts-ignore
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";

const FlashCardScreen = () => {

    LogBox.ignoreAllLogs();

    const navigation = useNavigation();

    const backButton = () => {
        navigation.goBack();
    }

    return (
        <SafeAreaView style={GlobalStyles.AndroidSafeArea}>
            <StatusBar hidden={true}/>
            {/* header section*/}
            <View>
                <Block style={GlobalStyles.main_container} flexDirection="row" justifyContent="space-between">
                    <TouchableOpacity onPress={backButton}>
                        <Text size={18}> <SimpleLineIcons name="arrow-left" size={18}/> </Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text size={18}> <SimpleLineIcons name="settings" size={18}/> </Text>
                    </TouchableOpacity>
                </Block>
                <Block height={12}></Block>
                <Block style={GlobalStyles.under_line}></Block>
            </View>
            {/* header section*/}

            <View style={GlobalStyles.main_container}>
                <Block height={50}></Block>
                <FlipCard
                    style={styles.card}
                    friction={6}
                    perspective={1000}
                    flipHorizontal={true}
                    flipVertical={false}
                    flip={false}
                    clickable={true}
                    onFlipEnd={(isFlipEnd: any) => {
                        console.log('isFlipEnd', isFlipEnd)
                    }}
                >
                    {/* Face Side */}
                    <View style={styles.face}>
                        <Text>The Face</Text>
                    </View>
                    {/* Back Side */}
                    <View style={styles.back}>
                        <Text>The Back</Text>
                    </View>
                </FlipCard>
            </View>
        </SafeAreaView>
    )
}

export default FlashCardScreen;

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        width: "95%",
        minHeight: 580,
        marginLeft: "auto",
        marginRight: "auto",
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
    },
    face: {
        width: "100%",
        height: 150,
        backgroundColor: 'red'
    },
    back: {
        width: "100%",
        height: 150,
        backgroundColor: 'blue'
    }
});