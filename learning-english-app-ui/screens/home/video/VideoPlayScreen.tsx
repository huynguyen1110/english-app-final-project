import {SafeAreaView, ScrollView, TouchableOpacity, View} from "react-native";
import {GlobalStyles} from "../../../styles/GlobalStyles";
import {Block, Button, Text} from "galio-framework";
import React, {useCallback, useEffect, useState} from "react";
import {useNavigation, useRoute} from "@react-navigation/native";
// @ts-ignore
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import YoutubePlayer from "react-native-youtube-iframe";

const VideoPlayScreen = () => {

    const navigation = useNavigation();

    const router = useRoute();

    const dataParams: any = router.params;

    const [playing, setPlaying] = useState(false);

    const backButton = () => {
        navigation.goBack();
    }

    const onStateChange = useCallback((state: any) => {
        if (state === "ended") {
            setPlaying(false);
        }
    }, []);

    const togglePlaying = useCallback(() => {
        setPlaying((prev) => !prev);
    }, []);

    useEffect(() => {
        console.log(dataParams?.videoId)
    }, [])

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
                    height={300}
                    play={playing}
                    videoId={dataParams?.videoId}
                    onChangeState={onStateChange}
                />
            </View>
        </SafeAreaView>
    )
}

export default VideoPlayScreen;

