import {SafeAreaView, ScrollView, TouchableOpacity, View} from "react-native";
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
import {getYtbVideoScriptService} from "../../../services/PythonService";

const VideoPlayScreen = () => {

    const navigation = useNavigation();

    const router = useRoute();

    const dataParams: any = router.params;

    // Ref để điều khiển YoutubePlayer
    const playerRef = useRef(null);

    const [playing, setPlaying] = useState(false);

    const [videoScript, setVideoScript] = useState<any[]>([]);

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
            const {data}: any = await getYtbVideoScriptService(videoId);
            setVideoScript(data);
        } catch (e) {
            console.log(e);
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

    useEffect(() => {
        getScript(dataParams?.videoId);
    }, [dataParams]);

    useEffect(() => {
        console.log(videoScript);
    }, [videoScript]);

    return (
        <SafeAreaView style={GlobalStyles.AndroidSafeArea}>
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
            </View>
            <ScrollView>
                <View style={GlobalStyles.main_container}>

                    {
                        videoScript.length > 0 && videoScript ? (
                            videoScript.map((item: any, index: any) => {

                               return (
                                   <View key={index}>
                                       <Block height={20}></Block>
                                       <View style={[GlobalStyles.flex_row, GlobalStyles.justify_content_space_between, GlobalStyles.align_item_center]}>
                                           <View style={{width: "75%"}}>
                                               <Text size={18}>{item?.text}</Text>
                                           </View>
                                           <View style={[GlobalStyles.flex_row, GlobalStyles.justify_content_space_between, GlobalStyles.align_item_center, {width: "20%"}]}>
                                               <TouchableOpacity>
                                                   <Text><MaterialIcons size={26} name='g-translate'/></Text>
                                               </TouchableOpacity>
                                               <Block width={5}></Block>
                                               <TouchableOpacity onPress={() => {
                                                   seekTo(item?.start)
                                               }}>
                                                   <Text><AntDesign size={26} name="play"/></Text>
                                               </TouchableOpacity>
                                           </View>
                                       </View>
                                       <Block height={20}></Block>
                                       <View style={GlobalStyles.under_line}></View>
                                   </View>
                               )
                            })
                        ) : (
                            <View>
                                <Text>No transcript available</Text>
                            </View>
                        )
                    }

                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default VideoPlayScreen;

