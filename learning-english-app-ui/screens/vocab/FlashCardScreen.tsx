import {Dimensions, LogBox, Modal, SafeAreaView, StatusBar, StyleSheet, TouchableOpacity, View} from "react-native";
import {GlobalStyles} from "../../styles/GlobalStyles";
import {Block, Text} from "galio-framework";
import React from "react";
import {useNavigation} from "@react-navigation/native";
// @ts-ignore
import FlipCard from 'react-native-flip-card';
// @ts-ignore
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
// @ts-ignore
import AntDesign from "react-native-vector-icons/AntDesign";
// @ts-ignore
import Entypo from "react-native-vector-icons/Entypo";
// @ts-ignore
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {themeAppColor} from "../../utils/constant";

const FlashCardScreen = () => {

    LogBox.ignoreAllLogs();

    const [isPlaying, setIsPlaying] = React.useState(false);

    const [modalVisible, setModalVisible] = React.useState(false);

    const navigation = useNavigation();

    const handlePlayPausePress = () => {
        setIsPlaying(!isPlaying);
    };

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
                    <TouchableOpacity onPress={() => {
                        setModalVisible(true);
                    }}>
                        <Text size={18}> <SimpleLineIcons name="settings" size={18}/> </Text>
                    </TouchableOpacity>
                </Block>
                <Block height={12}></Block>
                <Block style={GlobalStyles.under_line}></Block>
            </View>
            {/* header section*/}

            <View style={{flex: 1}}>
                <Block height={40}></Block>
                <FlipCard
                    style={styles.cardContainer}
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
                    <View>
                        <Text>The Face</Text>
                    </View>
                    {/* Back Side */}
                    <View>
                        <Text>The Back</Text>
                    </View>
                </FlipCard>

                <Block height={40}></Block>

                <Block flexDirection="row" justifyContent="center" alignItems="center">
                    <TouchableOpacity onPress={handlePlayPausePress} style={styles.playButton}>
                        <AntDesign
                            name={isPlaying ? "pausecircleo" : "playcircleo"}
                            size={50}
                            color={themeAppColor}
                        />
                    </TouchableOpacity>
                </Block>

                <Block height={20}></Block>
            </View>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <TouchableOpacity
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)' // Màu nền mờ
                    }}
                    activeOpacity={1}
                    onPressOut={() => setModalVisible(false)}
                >
                    <View style={styles.modalView}>
                        <Block flexDirection="row" width={300} height={120} justifyContent="space-around"
                               alignItems="center">
                            <TouchableOpacity style={styles.iconBtn}>
                                <Entypo size={40} name="shuffle"/>
                                <Text>Shuffle</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconBtn}>
                                <MaterialCommunityIcons size={41} name="credit-card-sync"/>
                                <Text>Flip card</Text>
                            </TouchableOpacity>
                        </Block>
                    </View>
                </TouchableOpacity>
            </Modal>
        </SafeAreaView>
    )
}

export default FlashCardScreen;

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: 'white',
        width: "85%",
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
    },
    playButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
        height: 60,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        height: 200,
        width: 350
    },
    iconBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 6
    }
});