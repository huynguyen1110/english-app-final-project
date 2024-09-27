// @ts-ignore
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
// @ts-ignore
import AntDesign from "react-native-vector-icons/AntDesign";
// @ts-ignore
import Ionicons from 'react-native-vector-icons/Ionicons';
// @ts-ignore
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
    KeyboardAvoidingView,
    LogBox,
    Platform,
    SafeAreaView, ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import {GlobalStyles} from "../../styles/GlobalStyles";
import {Block, Text, theme} from "galio-framework";
import {useNavigation} from "@react-navigation/native";
import {Layout, Input} from "@ui-kitten/components";
import {themeAppColor} from "../../utils/constant";
import {SwipeListView} from 'react-native-swipe-list-view';
import React from 'react';

const CreateNewVocabPackScreen = () => {

    LogBox.ignoreAllLogs();

    const navigation = useNavigation();

    const [wordInput, setWordInput] = React.useState<string>('');

    const [meaningInput, setMeaningInput] = React.useState<string>('');

    const [exampleInput, setExampleInput] = React.useState<string>('');

    const [listNewWords, setListNewWords] = React.useState([
        {key: '1', word: '', meaning: '', example: ''},
    ]);

    const backButton = () => {
        navigation.goBack();
    }

    const closeRow = (rowMap: any, rowKey: any) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    };

    // Function to delete an item from the list
    const deleteItem = (rowMap: any, rowKey: any) => {
        closeRow(rowMap, rowKey);
        const newData = [...listNewWords];
        const prevIndex = listNewWords
            .findIndex(item => item.key === rowKey);
        newData.splice(prevIndex, 1);
        setListNewWords(newData);
    };

    // Function to handle row open event
    const onRowOpen = (rowKey: any) => {
        console.log('Opened row with key:', rowKey);
    };

    const addNewWordToListBtn = () => {
        const key = Math.random().toString(36).substring(2, 9);
        const newListData = [...listNewWords];
        newListData.push({
            key: key,
            word: "",
            meaning: "",
            example: ""
        });
        setListNewWords(newListData);
    }

    // Function to render each list item
    const renderItem = (rowData: any) => {

        const handleWordChange = (value: string) => {
            const updatedWords = listNewWords.map((item: any) => {
                if (item.key === rowData.item.key) {
                    return {...item, word: value};
                }
                return item;
            });
            setListNewWords(updatedWords);
        };

        const handleMeaningChange = (value: string) => {
            const updatedWords = listNewWords.map((item: any) => {
                if (item.key === rowData.item.key) {
                    return {...item, meaning: value};
                }
                return item;
            });
            setListNewWords(updatedWords);
        };

        const handleExampleChange = (value: string) => {
            const updatedWords = listNewWords.map((item: any) => {
                if (item.key === rowData.item.key) {
                    return {...item, example: value};
                }
                return item;
            });
            setListNewWords(updatedWords);
        };

        return (
            <View
                style={styles.itemContainer}
            >
                <Block height={12}></Block>
                <View style={GlobalStyles.main_container}>
                    <Block>
                        <Text size={14} bold>Word:</Text>
                        <Input value={rowData?.item?.word} onChangeText={handleWordChange}/>
                    </Block>
                    <Block>
                        <Text size={14} bold>Meaning:</Text>
                        <Input value={rowData?.item?.meaning} onChangeText={handleMeaningChange}/>
                    </Block>
                    <Block>
                        <Text size={14} bold>Example:</Text>
                        <Input
                            multiline={true}
                            numberOfLines={4}
                            value={rowData?.item?.example}
                            onChangeText={handleExampleChange}
                        />
                    </Block>
                </View>
                <Block height={12}></Block>
            </View>
        );
    }

    // Function to render hidden swipe actions
    const renderHiddenItem = (rowData: any, rowMap: any) => (
        <View style={styles.hiddenContainer}>
            <TouchableOpacity
                style={[styles.hiddenButton, styles.closeButton]}
                onPress={() => closeRow(rowMap, rowData.item.key)}
            >
                <AntDesign style={styles.buttonText} name='close'/>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.hiddenButton, styles.deleteButton]}
                onPress={() => deleteItem(rowMap, rowData.item.key)}
            >
                <FontAwesome name='trash' style={styles.buttonText}/>
            </TouchableOpacity>
        </View>
    );

    React.useEffect(() => {
        console.log(listNewWords)
    }, [listNewWords])

    return (
        <SafeAreaView style={GlobalStyles.AndroidSafeArea}
        >
            {/*list new words section*/}
            <View style={{flex: 1}}>
                <SwipeListView
                    data={listNewWords}
                    renderItem={renderItem}
                    renderHiddenItem={renderHiddenItem}
                    leftOpenValue={75}
                    rightOpenValue={-150}
                    previewRowKey={'0'}
                    previewOpenValue={-40}
                    previewOpenDelay={3000}
                    onRowDidOpen={onRowOpen}
                    keyExtractor={(item) => item.key.toString()}
                    ListHeaderComponent={
                        <View>
                            <Block style={GlobalStyles.main_container} flexDirection="row"
                                   justifyContent="space-between"
                                   alignItems="center">
                                <TouchableOpacity onPress={backButton} style={{padding: 4}}>
                                    <Text size={18}> <SimpleLineIcons name="arrow-left" size={18}/> </Text>
                                </TouchableOpacity>
                                <Text size={20} bold>Create package</Text>
                                <TouchableOpacity style={{padding: 4}}>
                                    <Text size={20}> <AntDesign name="check" size={24}/> </Text>
                                </TouchableOpacity>
                            </Block>
                            <Block height={12}></Block>
                            <Block style={[
                                GlobalStyles.under_line
                            ]}></Block>

                            <View style={[GlobalStyles.main_container]}>
                                <Block height={12}></Block>
                                <Block flexDirection="collum">
                                    <Text bold size={16}>Package name:</Text>
                                    <Block height={6}></Block>
                                    <Block>
                                        <Input placeholder='Package name'/>
                                    </Block>
                                </Block>

                                <Block height={14}></Block>

                                <Block flexDirection="collum">
                                    <Text bold size={16}>Description:</Text>
                                    <Block height={6}></Block>
                                    <Block>
                                        <Input placeholder='Description'/>
                                    </Block>
                                </Block>

                                <Block height={12}></Block>

                                <Text size={16} bold>Your new words:</Text>
                                <Block height={12}></Block>

                            </View>

                        </View>
                    }
                    ListFooterComponent={
                        <View style={[{backgroundColor: 'transparent'}]}>
                            {/*add btn section*/}
                            <Block flexDirection="row" justifyContent="space-between">
                                <View></View>
                                <TouchableOpacity style={styles.addBtn} onPress={addNewWordToListBtn}>
                                    <Ionicons size={40} name="add-sharp"/>
                                </TouchableOpacity>
                            </Block>
                            {/*add btn section*/}
                        </View>
                    }
                />
            </View>
        </SafeAreaView>
    );
}

export default CreateNewVocabPackScreen;

const styles = StyleSheet.create({
    addBtn: {
        height: 50,
        width: 50,
        backgroundColor: themeAppColor,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30
    },
    itemContainer: {
        backgroundColor: '#FFF', // White
        borderBottomColor: '#E0E0E0', // Lighter Gray
        borderBottomWidth: 1,
        minHeight: 80,
        marginBottom: 20,

        elevation: 5,
        // Có thể thêm marginTop để tạo cảm giác bóng chỉ ở các phía khác
        // marginTop: 5,

        // Đổ bóng cho iOS
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 5},  // Chỉ tạo bóng ở phía dưới và hai bên
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        // Bo góc nếu cần
        borderRadius: 10,
    },
    itemText: {
        color: '#333', // Dark Gray
        fontSize: 16,
        fontWeight: 'bold',
    },
    hiddenContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: '#FFF',
        height: 80,
        borderRadius: 20,
    },
    hiddenButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 75,
        height: 80,
    },
    closeButton: {
        backgroundColor: 'green', // Blue
        borderRadius: 20,
    },
    deleteButton: {
        backgroundColor: '#E74C3C', // Red
        borderRadius: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 30,
        fontWeight: 'bold',
    },
});