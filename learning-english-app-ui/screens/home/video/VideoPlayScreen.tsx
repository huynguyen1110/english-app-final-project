import {SafeAreaView, ScrollView, TouchableOpacity, View, Modal, StyleSheet, ActivityIndicator} from "react-native";
import {GlobalStyles} from "../../../styles/GlobalStyles";
import {Block, Button, Text} from "galio-framework";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {useNavigation, useRoute} from "@react-navigation/native";
// @ts-ignore
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
// @ts-ignore
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// @ts-ignore
import AntDesign from "react-native-vector-icons/AntDesign";
import YoutubePlayer from "react-native-youtube-iframe";
import {getYtbVideoScriptService, translateService} from "../../../services/PythonService";

const VideoPlayScreen = () => {

    const navigation = useNavigation();

    const router = useRoute();

    const [isLoading, setIsLoading] = useState(false);

    const dataParams: any = router.params;

    // Ref để điều khiển YoutubePlayer
    const playerRef = useRef(null);

    const [playing, setPlaying] = useState(false);

    const [videoScript, setVideoScript] = useState<any[]>([]);

    const [isTranslateModalVisible, setIsTranslateModalVisible] = useState(false);

    const [translatedText, setTranslatedText] = useState("");

    const scrollViewRef = useRef(); // Tạo tham chiếu cho ScrollView

    const [currentTime, setCurrentTime] = useState(0); // Thời gian hiện tại của video

    const [activeScriptIndex, setActiveScriptIndex] = useState(null); // Chỉ số của script đang phát

    const intervalRef = useRef(null);

    const backButton = () => {
        navigation.goBack();
    }

    const onStateChange = useCallback((state: any) => {
        if (state === "ended") {
            setPlaying(false);
        }
    }, []);


    const getScript = async (videoId: any) => {
        try {
            setIsLoading(true);
            const {data}: any = await getYtbVideoScriptService(videoId);
            setVideoScript(data);
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    }

    // Hàm nhảy đến thời gian cụ thể
    const seekTo = (time: number) => {
        if (playerRef.current) {
            // @ts-ignore
            playerRef.current.seekTo(time, true); // true: nhảy ngay lập tức
        }
        setPlaying(true); // Tự động play sau khi seek
    };

    const translateText = async (text: any) => {
        try {
            const params = {
                source: "en",
                target: "vi"
            }
            setTranslatedText("");
            const {data} : any = await translateService(params, text);
            setTranslatedText(data);
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        // Khi video bắt đầu chơi, bắt đầu kiểm tra thời gian mỗi giây
        if (playing) {
            // @ts-ignore
            intervalRef.current = setInterval(() => {
                // @ts-ignore
                playerRef.current?.getCurrentTime().then((time: any) => {
                    setCurrentTime(time);
                    highlightCurrentScript(time);
                });
            }, 1000); // Cập nhật mỗi giây
        } else {
            // @ts-ignore
            clearInterval(intervalRef.current); // Dừng kiểm tra khi video không còn chơi
        }

        // Dọn dẹp khi component bị hủy
        // @ts-ignore
        return () => clearInterval(intervalRef.current);
    }, [playing]);

    // Hàm so sánh và làm sáng đoạn script hiện tại
    const highlightCurrentScript = (currentTime: any) => {
        const activeIndex = videoScript.findIndex(
            (item) => currentTime >= item?.start && currentTime < item?.start + item?.duration
        );
        // @ts-ignore
        setActiveScriptIndex(activeIndex); // Cập nhật chỉ số đoạn script đang phát

        // Nếu có đoạn script đang phát, cuộn đến nó
        if (activeIndex !== -1 && scrollViewRef.current) {
            // @ts-ignore
            scrollViewRef.current.scrollTo({ y: activeIndex * 60, animated: true }); // Cuộn đến vị trí của đoạn script
        }
    };

    useEffect(() => {
        getScript(dataParams?.videoId);
    }, [dataParams]);

    return (
        <SafeAreaView style={GlobalStyles.AndroidSafeArea}>
            {isLoading && (
                <View style={styles.spinnerContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text>Loading...</Text>
                </View>
            )}
            <Block style={GlobalStyles.main_container} flexDirection="row" justifyContent="space-between"
                   alignItems="center">
                <TouchableOpacity onPress={backButton}>
                    <Text size={18}> <SimpleLineIcons name="arrow-left" size={18}/> </Text>
                </TouchableOpacity>
                <Text size={20} bold></Text>
                <TouchableOpacity>
                    <Text size={20}></Text>
                </TouchableOpacity>
            </Block>
            <Block height={12}></Block>
            <Block style={GlobalStyles.under_line}></Block>

            <View>
                <YoutubePlayer
                    ref={playerRef}
                    height={250}
                    play={playing}
                    videoId={dataParams?.videoId}
                    onChangeState={onStateChange}
                />
                <ScrollView
                    // @ts-ignore
                    ref={scrollViewRef}
                >
                    <View style={GlobalStyles.main_container}>
                        {videoScript.length > 0 ? (
                            videoScript.map((item, index) => {
                                const isActive = activeScriptIndex === index; // Kiểm tra nếu đoạn này đang phát
                                return (
                                    <View key={index}>
                                        <Block height={20} />
                                        <View
                                            style={[
                                                GlobalStyles.flex_row,
                                                GlobalStyles.justify_content_space_between,
                                                GlobalStyles.align_item_center,
                                            ]}
                                        >
                                            <View style={{ width: '75%' }}>
                                                <Text
                                                    style={{
                                                        fontSize: 18,
                                                        color: isActive ? 'blue' : 'black', // Đổi màu nếu đoạn này đang phát
                                                    }}
                                                >
                                                    {item?.text}
                                                </Text>
                                            </View>
                                            <View
                                                style={[
                                                    GlobalStyles.flex_row,
                                                    GlobalStyles.justify_content_space_between,
                                                    GlobalStyles.align_item_center,
                                                    { width: '20%' },
                                                ]}
                                            >
                                                <TouchableOpacity onPress={() => {
                                                    setIsTranslateModalVisible(true);
                                                    translateText(item?.text);
                                                }}>
                                                    <Text>
                                                        <MaterialIcons size={26} name="g-translate" />
                                                    </Text>
                                                </TouchableOpacity>
                                                <Block width={5} />
                                                <TouchableOpacity onPress={() => seekTo(item?.start)}>
                                                    <Text>
                                                        <AntDesign size={26} name="play" />
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        <Block height={20} />
                                        <View style={GlobalStyles.under_line} />
                                    </View>
                                );
                            })
                        ) : (
                            <View>
                                <Text>No transcript available</Text>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </View>
            {/* translate sentence modal */}
            <Modal
                visible={isTranslateModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsTranslateModalVisible(false)} // Đóng modal khi nhấn nút Back
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.translatedText}>{translatedText}</Text>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setIsTranslateModalVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            {/* translate sentence modal */}

        </SafeAreaView>
    )
}

export default VideoPlayScreen;

const styles = StyleSheet.create({
    spinnerContainer: {
        position: 'absolute', // Đặt overlay phủ toàn bộ màn hình
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Màu nền đen mờ
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000, //
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Nền tối khi modal mở
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    translatedText: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
    },
    closeButton: {
        backgroundColor: '#007BFF',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});


