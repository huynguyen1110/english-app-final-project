import {
    ActivityIndicator,
    Image,
    LogBox,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from "react-native";
import {GlobalStyles} from "../../../styles/GlobalStyles";
import {Block, Text} from "galio-framework";
import React, {useEffect, useState} from "react";
// @ts-ignore
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import {useNavigation, useRoute} from "@react-navigation/native";
import {getYtbVideosService} from "../../../services/VideoService";

const VideoDetailScreen = () => {

    LogBox.ignoreAllLogs();

    const navigation = useNavigation();

    const router = useRoute();

    const dataParams: any = router.params;

    const [isLoading, setIsLoading] = useState(false);

    const [videos, setVideos] = useState<any []>([]);

    const backButton = () => {
        navigation.goBack();
    }

    const getVideos = async (query: any) => {
        try {
            setIsLoading(true);
            const params = {
                query: query,
                type: "video",
                duration: "medium"
            }
            const response: any = await getYtbVideosService(params);
            const {data} = response;
            setVideos(data.data);
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false); // Ẩn loading spinner
        }
    }

    useEffect(() => {
        getVideos(dataParams?.channelName);
    }, [dataParams])

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
                <Text size={20} bold>{dataParams?.channelName}</Text>
                <TouchableOpacity>
                    <Text size={20}></Text>
                </TouchableOpacity>
            </Block>
            <Block height={12}></Block>
            <Block style={GlobalStyles.under_line}></Block>

            <ScrollView>
                {
                    videos?.length > 0 ? (
                        videos.map((video: any, index: any) => {
                            return (
                                <View key={index} style={GlobalStyles.main_container}>
                                    <View style={{marginTop: 15}}>
                                        <TouchableOpacity style={styles.video_container} onPress={() => {
                                            // @ts-ignore
                                            navigation.navigate("VideoPlayScreen", {videoId: video?.videoId});
                                        }}>
                                            {
                                                video?.thumbnail && Array.isArray(video.thumbnail) && video.thumbnail.length > 0 ? (
                                                    <View style={{ width: "40%" }}>
                                                        <Image style={styles.thumbnail} source={{ uri: video.thumbnail[0]?.url }} />
                                                    </View>
                                                ) : (
                                                    <View style={{ width: "40%" }}></View>
                                                )
                                            }

                                            <View style={[{ width: "60%" , flexDirection: 'column', justifyContent: 'space-between'}]}>
                                                <Text size={16} bold> {video?.title}</Text>
                                                <Text>{video?.publishedTimeText}</Text>
                                            </View>
                                        </TouchableOpacity>
                                        <Block height={12}></Block>
                                        <View style={GlobalStyles.under_line}></View>
                                    </View>
                                </View>
                            )
                        })
                    ) : (
                        <View><Text>empty</Text></View>
                    )
                }

            </ScrollView>
        </SafeAreaView>
    );
}

export default VideoDetailScreen;

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
    video_container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    thumbnail: {
        width: 130,
        height: 90,
        borderRadius: 10,
    }
})