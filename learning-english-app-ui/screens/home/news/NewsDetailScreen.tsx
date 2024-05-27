import {SafeAreaView, StyleSheet, TouchableOpacity, View, Button, ScrollView} from "react-native";
import {GlobalStyles} from "../../../styles/GlobalStyles";
import Slider from '@react-native-community/slider';
import {Block, Text, theme} from "galio-framework";
// @ts-ignore
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
// @ts-ignore
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from "@react-navigation/native";
import {useEffect, useState} from "react";
import Modal from 'react-native-modal';
import {useDispatch} from "react-redux";
import {getNewsById} from "../../../services/NewsService";

const NewsDetailScreen = ( {route}: {route: any} ) => {

    const navigation = useNavigation();

    const dispatch = useDispatch();

    const newsId = route.params.newsId;

    const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');

    const [textColor, setTextColor] = useState('#000000');

    const [fontSize, setFontSize] = useState(16);

    const [isVisible, setIsVisible] = useState<boolean>(false);

    const openDrawer = () => {
        setIsVisible(true);
    };

    const closeDrawer = () => {
        setIsVisible(false);
    };

    const backButton = () => {
        navigation.goBack();
    }

    const getNewsData = () => {
        if (newsId) {
            // @ts-ignore
            dispatch(getNewsById(newsId))
        }
    }

    useEffect(() => {
        if (backgroundColor === "#FFFFFF") {
            setTextColor("#000000");
        }
        if (backgroundColor === "#DFCFBE") {
            setTextColor("#726d68")
        }
        if (backgroundColor === "#161748") {
            setTextColor("#FFFFFF");
        }
    }, [backgroundColor]);

    useEffect(() => {
        getNewsData();
    }, [newsId]);

    return (
        <SafeAreaView style={GlobalStyles.AndroidSafeArea}>
            <Block style={[GlobalStyles.main_container]} flexDirection="row" justifyContent="space-between"
                   alignItems="center">
                <TouchableOpacity onPress={backButton}>
                    <Text size={18}> <SimpleLineIcons name="arrow-left" size={18}/> </Text>
                </TouchableOpacity>

                <Block flexDirection="row" justifyContent="space-between"
                       alignItems="center">
                    <TouchableOpacity>
                        <Text size={20}> <FontAwesome name="heart-o" size={24}/> </Text>
                    </TouchableOpacity>
                    <Block width={8}></Block>
                    <TouchableOpacity onPress={openDrawer}>
                        <Text size={20}> <SimpleLineIcons name="settings" size={24}/> </Text>
                    </TouchableOpacity>
                </Block>
            </Block>
            <Block height={12}></Block>
            <Block style={GlobalStyles.under_line}></Block>

            <ScrollView style={[{backgroundColor}]}>
                {/*content view*/}
                <Block style={ GlobalStyles.main_container }>
                    <Block height={4}></Block>
                    <Text size={fontSize} color={textColor}>Hello</Text>
                </Block>
                <Modal
                    // @ts-ignore
                    isVisible={isVisible}
                    onBackdropPress={closeDrawer}
                    style={styles.modal}
                    swipeDirection="down"
                    onSwipeComplete={closeDrawer}
                >
                    <View style={[styles.drawer]}>
                        <Block style={GlobalStyles.main_container}>
                            <Text bold size={24}>Settings</Text>

                            <Block height={12}></Block>

                            <Block>
                                <Text size={16}>Viewing theme</Text>
                                <Block height={12}></Block>
                                <Block flexDirection="row" justifyContent="space-between">
                                    <TouchableOpacity style={[styles.viewing_button, {backgroundColor: "#FFFFFF"}]}
                                                      onPress={() => {
                                                          setBackgroundColor("#FFFFFF");
                                                      }}></TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.viewing_button, {backgroundColor: "#DFCFBE"}]} onPress={() => {
                                        setBackgroundColor("#DFCFBE");
                                    }}></TouchableOpacity>
                                    <TouchableOpacity style={[styles.viewing_button, {backgroundColor: "#161748"}]}
                                                      onPress={() => {
                                                          setBackgroundColor("#161748")
                                                      }}></TouchableOpacity>
                                </Block>

                                <Block height={12}></Block>

                                <Block>
                                    <Text size={16}>Font size: {fontSize}</Text>
                                    <Slider
                                        style={{width: "100%", height: 40}}
                                        minimumValue={10}
                                        maximumValue={40}
                                        step={1}
                                        value={fontSize}
                                        onValueChange={(value) => setFontSize(value)}
                                        minimumTrackTintColor="#1EB1FC"
                                        maximumTrackTintColor="#1EB1FC"
                                        thumbTintColor="#1EB1FC"
                                    />
                                    <Text size={fontSize}>Aa</Text>
                                </Block>
                            </Block>
                        </Block>
                    </View>
                </Modal>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    drawer: {
        backgroundColor: 'white',
        padding: 20,
        height: "60%",
        width: '100%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    viewing_button: {
        width: '32%',
        height: 50,
        borderRadius: 5,
        borderWidth: 1
    }
});


export default NewsDetailScreen;
