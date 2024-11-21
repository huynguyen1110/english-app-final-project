import {
    Image,
    ImageBackground,
    LogBox,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from "react-native";
import {GlobalStyles} from "../../../styles/GlobalStyles";
import {Block, Text} from "galio-framework";
import {useNavigation} from "@react-navigation/native";
// @ts-ignore
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
// @ts-ignore
import Feather from 'react-native-vector-icons/Feather';
import React from "react";

const VideoScreen = () => {
    LogBox.ignoreAllLogs();

    const navigation = useNavigation();

    const backButton = () => {
        navigation.goBack();
    }

    return (
        <SafeAreaView style={GlobalStyles.AndroidSafeArea}>
            <Block style={GlobalStyles.main_container} flexDirection="row" justifyContent="space-between"
                   alignItems="center">
                <TouchableOpacity onPress={backButton}>
                    <Text size={18}> <SimpleLineIcons name="arrow-left" size={18}/> </Text>
                </TouchableOpacity>
                <Text size={20} bold>Video</Text>
                <TouchableOpacity>
                    <Text size={20}> </Text>
                </TouchableOpacity>
            </Block>
            <Block height={12}></Block>
            <Block style={GlobalStyles.under_line}></Block>
            <ScrollView>
                <View style={GlobalStyles.main_container}>
                    <Text size={26} bold>Channels</Text>
                    <View style={styles.channel_container}>
                        <TouchableOpacity style={styles.channel_items} onPress={() => {
                            // @ts-ignore
                            navigation.navigate("VideoDetailScreen", {channelName: "TED ed"});
                        }}>
                            <ImageBackground style={styles.background} source={require('../../../assets/image-video/TED_ED_THUB.jpg')}/>
                            <Text style={styles.text}>TED ed</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.channel_items} onPress={() => {
                            // @ts-ignore
                            navigation.navigate("VideoDetailScreen", {channelName: "BBC 6 minute english"});
                        }}>
                            <ImageBackground style={styles.background} source={require('../../../assets/image-video/BBC_6_MIN_ENG_THUB.jpg')}/>
                            <Text style={styles.text}>BBC 6 minutes english</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.channel_items} onPress={() => {
                            // @ts-ignore
                            navigation.navigate("VideoDetailScreen", {channelName: "National geographic"});
                        }}>
                            <ImageBackground style={styles.background} source={require('../../../assets/image-video/NATIONAL_GEOGRAPHIC_THUMB.jpg')}/>
                            <Text style={styles.text}>National geographic</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.channel_items} onPress={() => {
                            // @ts-ignore
                            navigation.navigate("VideoDetailScreen", {channelName: "TED talk"});
                        }}>
                            <ImageBackground style={styles.background} source={require('../../../assets/image-video/TED_THUMB.jpg')}/>
                            <Text style={styles.text}>TED talk</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.channel_items} onPress={() => {
                            // @ts-ignore
                            navigation.navigate("VideoDetailScreen", {channelName: "Vox"});
                        }}>
                            <ImageBackground style={styles.background} source={require('../../../assets/image-video/VOX_THUMB.png')}/>
                            <Text style={styles.text}>Vox</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default VideoScreen;

const styles = StyleSheet.create({
    channel_container: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    channel_items: {
        width: "48%",
        height: 100,
        borderRadius: 10,
        marginVertical: 10,
        backgroundColor: "#fff", // Cần màu nền để thấy hiệu ứng
        // Hiệu ứng đổ bóng cho iOS
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2, // Bóng đổ hướng xuống
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        // Hiệu ứng đổ bóng cho Android
        elevation: 5,
    },
    background: {
        borderRadius: 10,
        flex: 1,
        resizeMode: 'cover', // 'cover', 'contain', 'stretch', 'repeat', 'center'
        justifyContent: 'center', // Dùng để căn giữa nội dung bên trong
        overflow: 'hidden',
    },
    text: {
        position: "absolute",
        top: 10,
        left: 10,
        fontSize: 18,
        color: "white", // Chữ màu trắng
        textShadowColor: "#000",  // Màu bóng đen
        textShadowOffset: { width: 1, height: 1 },  // Độ dịch chuyển của bóng
        textShadowRadius: 5,  // Độ mờ của bóng
    }
})