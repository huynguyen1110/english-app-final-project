import {SafeAreaView, StyleSheet, TouchableOpacity, View, Button, ScrollView, Image} from "react-native";
import {GlobalStyles} from "../../../styles/GlobalStyles";
import Slider from '@react-native-community/slider';
import {Block, Text} from "galio-framework";
// @ts-ignore
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
// @ts-ignore
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useNavigation, useRoute} from "@react-navigation/native";
import {useEffect, useState} from "react";
import Modal from 'react-native-modal';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../utils/Store";
import {blackColor, charcoalColor, sandDollarColor, textSandColor, whiteColor} from "../../../utils/constant";

const NewsDetailScreen = () => {

    const navigation = useNavigation();

    const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');

    const [textColor, setTextColor] = useState('#000000');

    const [fontSize, setFontSize] = useState(16);

    const [isVisible, setIsVisible] = useState<boolean>(false);

    const [modalVisible, setModalVisible] = useState(false);

    const newsData = useSelector((state: RootState) => state.newsReducer.newsData);

    const [newsTitle, setNewsTitle] = useState<string []>([]);

    const [imageUrl, setImageUrl] = useState<string>("");

    const [newsContent, setNewsContent] = useState<string[]>([]);

    const errImageUrl = "https://www.google.com/url?sa=i&url=https%3A%2F%2Fcommons.wikimedia.org%2Fwiki%2FFile%3ANo-Image-Placeholder.svg&psig=AOvVaw0pPj2xc6josQ23zzQIeG_1&ust=1718120275254000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCOCClfiu0YYDFQAAAAAdAAAAABAJ";

    // open modal handler
    const openDrawer = () => {
        setIsVisible(true);
    };

    // close modal handler
    const closeDrawer = () => {
        setIsVisible(false);
    };

    const backButton = () => {
        navigation.goBack();
    }

    // handle when press on word
    const handleWordPress = (word: string) => {
        setModalVisible(true);
    };

    // set background color and text color
    useEffect(() => {
        if (backgroundColor === whiteColor) {
            setTextColor(blackColor);
        }
        if (backgroundColor === sandDollarColor) {
            setTextColor(textSandColor)
        }
        if (backgroundColor === charcoalColor) {
            setTextColor(whiteColor);
        }
    }, [backgroundColor]);

    // set news data
    useEffect(() => {
        if (newsData) {
            setNewsTitle(newsData.title.split(" "));
            setImageUrl(newsData.imageUrl);
            setNewsContent(newsData.content.split(" "));
        }
    }, [newsData]);

    return (
        <SafeAreaView style={GlobalStyles.AndroidSafeArea}>
            {/* header area */}
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
            {/* header area */}
            <Block height={12}></Block>
            <Block style={GlobalStyles.under_line}></Block>

            <ScrollView style={[{backgroundColor}]}>
                {/*content view*/}
                <Block style={GlobalStyles.main_container}>
                    <Block height={4}></Block>
                    <Block style={styles.textContainer}>
                        {newsTitle.map((word: any, index: any) => (
                            <TouchableOpacity key={index} onPress={() => handleWordPress(word)}>
                                <Text style={{fontSize, color: textColor}}>{word} </Text>
                            </TouchableOpacity>
                        ))}
                    </Block>

                    <Block height={4}></Block>

                    <Image source={{uri: imageUrl || errImageUrl}} style={styles.image}/>

                    <Block style={styles.textContainer}>
                        {newsContent.map((word: any, index: any) => (
                            <TouchableOpacity key={index} onPress={() => handleWordPress(word)}>
                                <Text style={{fontSize, color: textColor}}>{word} </Text>
                            </TouchableOpacity>
                        ))}
                    </Block>

                </Block>
                {/*content view*/}

                {/* setting modal */}
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
                                    <TouchableOpacity style={[styles.viewing_button, {backgroundColor: whiteColor}]}
                                                      onPress={() => {
                                                          setBackgroundColor(whiteColor);
                                                      }}></TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.viewing_button, {backgroundColor: sandDollarColor}]} onPress={() => {
                                        setBackgroundColor(sandDollarColor);
                                    }}></TouchableOpacity>
                                    <TouchableOpacity style={[styles.viewing_button, {backgroundColor: charcoalColor}]}
                                                      onPress={() => {
                                                          setBackgroundColor(charcoalColor)
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
                {/* setting modal*/}

                {/* dictionary modal */}
                <Modal
                    style={styles.modal}
                    swipeDirection="down"
                    // @ts-ignore
                    transparent={true}
                    visible={modalVisible}
                    onSwipeComplete={() => setModalVisible(false)}
                    onBackdropPress={() => setModalVisible(false)}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.drawer_dictionary}>
                        <Text>hello</Text>
                    </View>
                </Modal>
                {/* dictionary modal */}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
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
    drawer_dictionary: {
        backgroundColor: 'gray',
        padding: 20,
        height: "35%",
        width: '100%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    image: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    // style for viewbtn
    viewing_button: {
        width: '32%',
        height: 50,
        borderRadius: 5,
        borderWidth: 1
    },
    textContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
});


export default NewsDetailScreen;
