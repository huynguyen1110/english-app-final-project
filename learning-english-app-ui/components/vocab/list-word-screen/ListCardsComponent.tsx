import {Image, StyleSheet, TouchableOpacity, View, Modal, StatusBar} from "react-native";
import {Block, Text, theme} from "galio-framework";
import React from "react";
import {IndexPath, Select, SelectItem} from "@ui-kitten/components";
// @ts-ignore
import Entypo from 'react-native-vector-icons/Entypo';
// @ts-ignore
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import {GlobalStyles} from "../../../styles/GlobalStyles";
import {Audio} from "expo-av";
import Toast from "react-native-toast-message";
import {useNavigation} from "@react-navigation/native";
import {removeWordFromPackageService} from "../../../services/VocabService";

const ListCardsComponent = (wordsData: any) => {

    const navigation = useNavigation();

    const [selectedIndex, setSelectedIndex] = React.useState<IndexPath | IndexPath[]>(new IndexPath(0));

    const [sound, setSound] = React.useState<any>();

    const [sortedWords, setSortedWords] = React.useState<any>([]);

    const [modalVisible, setModalVisible] = React.useState(false);

    const [wordToEdit, setWordToEdit] = React.useState<any>({})

    const options = {
        'Newest': 'NEWEST',
        'Oldest': 'OLDEST',
        'Name: A to Z': 'A_TO_Z',
        'Name: Z to A': 'Z_TO_A'
    }; // sort option

    // handle play sound //
    const playAudioBtn = async (audio: any) => {
        if (audio !== undefined && audio !== null && audio !== '') {
            const {sound} = await Audio.Sound.createAsync({uri: audio});
            setSound(sound);
            await sound.playAsync();
        } else {
            Toast.show({
                type: 'info',
                text1: 'No audio is found',
                position: 'top',
                visibilityTime: 3000,
                text1Style: {fontSize: 20}, // Tăng kích thước chữ của text1
                text2Style: {fontSize: 16}, // Tăng kích thước chữ của text2
            });
        }

    }

    const handelRemoveWordFromPackageBtn = async () => {
        const wordId = wordToEdit?.wordId;
        const packageId = wordToEdit?.packageId;

        try {
            const response = await removeWordFromPackageService(wordId, packageId);
            const {data}: any = response;
            if (data) {
                const updatedWords = sortedWords.filter((item: any) => item.wordId !== wordId);
                setSortedWords(updatedWords);
                Toast.show({
                    type: 'success',
                    text1: 'Removed word successfully!',
                    position: 'top',
                    visibilityTime: 3000,
                    text1Style: {fontSize: 20}
                });
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Can not remove word!',
                    position: 'top',
                    visibilityTime: 3000,
                    text1Style: {fontSize: 20}
                });
            }
        } catch (e) {
            console.log("err while removing word from package in ListCardComponent", e);
        }
    }

    React.useEffect(() => {
        return sound
            ? () => {
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);
    // handle play sound //


    // filter package
    React.useEffect(() => {
        const data: any = Object.values(wordsData)[0];
        if (selectedIndex instanceof IndexPath) {
            const sortValue = Object.keys(options)[selectedIndex?.row];
            let sortedWords = [];

            // Tạo bản sao của data để sắp xếp
            const dataCopy = [...data]; // Hoặc dùng data.slice()

            switch (sortValue) {
                case Object.keys(options)[0]:
                    sortedWords = dataCopy.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                    break;
                case Object.keys(options)[1]:
                    sortedWords = dataCopy.sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
                    break;
                case Object.keys(options)[2]:
                    sortedWords = dataCopy.sort((a: any, b: any) => a.name.localeCompare(b.name));
                    break;
                case Object.keys(options)[3]:
                    sortedWords = dataCopy.sort((a: any, b: any) => b.name.localeCompare(a.name));
                    break;
                default:
                    sortedWords = dataCopy.sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
                    break;
            }

            setSortedWords(sortedWords); // Cập nhật state với mảng đã sắp xếp
        }
    }, [selectedIndex, wordsData]);

    return (
        <View>
            <Block flexDirection="row" justifyContent="space-between" alignItems="center">
                <View>
                    <Text bold size={20}>Cards</Text>
                </View>
                <View style={[styles.sellectBox]}>
                    <Select

                        selectedIndex={selectedIndex}
                        onSelect={index => setSelectedIndex(index)}
                        // @ts-ignore
                        value={Object.keys(options)[selectedIndex?.row]}
                    >
                        <SelectItem title='Newest'/>
                        <SelectItem title='Oldest'/>
                        <SelectItem title='Name: A to Z'/>
                        <SelectItem title='Name: Z to A'/>
                    </Select></View>
            </Block>

            <Block height={12}></Block>

            {/* card section */}
            {
                // @ts-ignore
                sortedWords.map((word: any, index: any) => {
                    return (
                        <View key={index}>
                            <View style={[styles.cardContainer]}>
                                <Block style={GlobalStyles.main_container}>
                                    <Block height={8}></Block>
                                    <Block flexDirection="row" justifyContent="space-between" alignItems="center">
                                        <Text color={theme.COLORS?.FACEBOOK} bold size={18}>
                                            {word?.name || "Unknown Word"}
                                        </Text>
                                        <TouchableOpacity style={{padding: 4}} onPress={() => {
                                            setModalVisible(true);
                                            // @ts-ignore
                                            setWordToEdit({
                                                wordId: word?.wordId,
                                                word: word?.name,
                                                partOfSpeech: word?.wordType,
                                                definition: word?.definition,
                                                exampleFromEdit: word?.example,
                                                audio: word?.audio,
                                                phonetic: word?.phonetic,
                                                packageId: wordsData?.packageId
                                            })
                                        }}>
                                            <Text size={18}>
                                                <Entypo name="dots-three-vertical" size={18}/>
                                            </Text>
                                        </TouchableOpacity>
                                    </Block>
                                    <Block height={4}></Block>
                                    <Text size={16}>{word?.wordType || "Unknown Type"}</Text>
                                    <Block height={4}></Block>

                                    <Block height={30} row alignItems="center">
                                        <TouchableOpacity style={{padding: 4}} onPress={() => {
                                            playAudioBtn(word?.audio)
                                        }}>
                                            <Text size={18} style={{opacity: 0.5}}>
                                                <FontAwesome size={20} name="volume-up"/>
                                            </Text>
                                        </TouchableOpacity>
                                        <Block width={12}></Block>
                                        <Block height={30}>
                                            <Text style={{opacity: 0.5}} size={18}>
                                                {word?.phonetic || "No phonetic"}
                                            </Text>
                                        </Block>
                                    </Block>

                                    <Block height={6}></Block>

                                    {word?.image ? ( // Đổi từ `wordsData?.image` thành `word?.image`
                                        <Image style={styles.exampleImg} source={{uri: word?.image}}/>
                                    ) : (
                                        <View></View>
                                    )}

                                    <Block height={8}></Block>

                                    <Text size={16}>{word?.meaning || "No meaning available."}</Text>

                                    <Block height={12}></Block>
                                </Block>
                            </View>
                            <Block height={10}></Block>
                        </View>
                    );
                })
            }
            {/* card section */}

            {/* modal section */}
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
                        <Block flexDirection="collum" width={300} height={120} justifyContent="space-around"
                               alignItems="center">
                            <TouchableOpacity style={styles.actionBtn} onPress={() => {
                                // @ts-ignore
                                navigation.navigate("SaveNewWordScreen", wordToEdit);
                            }}>
                                <Text size={16}><FontAwesome size={16} name='pencil'/><Text> </Text> Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionBtn} onPress={handelRemoveWordFromPackageBtn}>
                                <Text size={16}><FontAwesome size={16} name="trash"/><Text> </Text> Delete</Text>
                            </TouchableOpacity>
                        </Block>
                    </View>
                </TouchableOpacity>
            </Modal>
            {/* modal section */}
        </View>
    );
}

export default ListCardsComponent;

const styles = StyleSheet.create({
    sellectBox: {
        width: '45%',
    },
    cardContainer: {
        backgroundColor: 'white',
        width: "95%",
        minHeight: 150,
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
    exampleImg: {
        width: 250,
        height: 150,
        resizeMode: "stretch",
        borderRadius: 10
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
    actionBtn: {
        padding: 10,
        width: "100%",
        height: 50,
        alignItems: "flex-start",
        justifyContent: "center",
        borderWidth: 1,
        borderRadius: 6
    }
});