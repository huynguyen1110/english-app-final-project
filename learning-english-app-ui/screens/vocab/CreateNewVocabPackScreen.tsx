// @ts-ignore
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
// @ts-ignore
import AntDesign from "react-native-vector-icons/AntDesign";
// @ts-ignore
import Ionicons from 'react-native-vector-icons/Ionicons';
// @ts-ignore
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
    ActivityIndicator,
    LogBox,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    View
} from "react-native";
import {GlobalStyles} from "../../styles/GlobalStyles";
import {Block, Text} from "galio-framework";
import {useNavigation, useRoute} from "@react-navigation/native";
import {Input} from "@ui-kitten/components";
import {themeAppColor} from "../../utils/constant";
import {SwipeListView} from 'react-native-swipe-list-view';
import React from 'react';
import Toast from "react-native-toast-message";
import {addWordToPackage, createPackageService, createWord} from "../../services/VocabService";
import {object} from "yup";
import {description} from "@eva-design/eva/package";

const CreateNewVocabPackScreen = () => {

    LogBox.ignoreAllLogs();

    const navigation = useNavigation();

    const router = useRoute();

    const packageDataParam: any = router?.params;

    let packageData: any;

    if (packageDataParam) {
        packageData = Object?.values(packageDataParam)[0];
    }

    const [loading, setLoading] = React.useState(false);

    const [packageName, setPackageName] = React.useState<string>("");

    const [packageDescription, setPackageDescription] = React.useState<string>("");

    const [listNewWords, setListNewWords] = React.useState([
        {key: '1', word: '', meaning: '', wordType: "", example: ''},
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

    // add word data to list
    const addNewWordToListBtn = () => {
        const key = Math.random().toString(36).substring(2, 9);
        const newListData = [...listNewWords];
        newListData.push({
            key: key,
            word: "",
            meaning: "",
            wordType: "",
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

        const handleWordTypeChange = (value: string) => {
            const updatedWords = listNewWords.map((item: any) => {
                if (item.key === rowData.item.key) {
                    return {...item, wordType: value};
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
                    <Block height={6}></Block>
                    <Block>
                        <Text size={14} bold>Meaning:</Text>
                        <Input value={rowData?.item?.meaning} onChangeText={handleMeaningChange}/>
                    </Block>
                    <Block height={6}></Block>
                    <Block>
                        <Text size={14} bold>Word type:</Text>
                        <Input value={rowData?.item?.wordType} onChangeText={handleWordTypeChange}/>
                    </Block>
                    <Block height={6}></Block>
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

    // validate data
    const validatePackageData = (data: any) => {
        let isValid = true;
        const isListValid = data?.listNewWords.every((item: any) => item.word !== '' && item.meaning !== '' && item.example !== '');
        if (data?.packageName === '' || data?.packageName === undefined) {
            isValid = false;
        }
        if (data?.listNewWords?.length == 0 || !isListValid) {
            isValid = false;
        }
        return isValid;
    }

    const handleSavePackageBtn = async () => {
        let packageData = {
            packageName: packageName,
            description: packageDescription,
            listNewWords: listNewWords
        }
        if (validatePackageData(packageData)) {
            try {
                // Bật trạng thái loading
                setLoading(true);
                const packageDto = {
                    name: packageData?.packageName,
                    isPublished: false
                }

                const createPackageResponse: any = await createPackageService(packageDto);
                const {data} = createPackageResponse;
                let packageId = data?.id;
                if (data?.id) {
                    const wordData = packageData?.listNewWords.map((item: any, index: number) => {
                        return {
                            name: item?.word,
                            description: '',
                            meaning: item?.meaning,  // Có thể thêm các thuộc tính khác nếu cần
                            example: item?.example,
                            wordType: item?.wordType,
                            image: '',
                            audio: '',
                            phonetic: ''
                        };
                    });

                    if (wordData.length > 0) {
                        const wordsId = await Promise.all(
                            wordData.map(async (item: any) => {
                                const createWordResponse: any = await createWord(item);
                                const {data} = createWordResponse;
                                return data?.wordId;
                            })
                        );
                        if (wordsId.length > 0 && packageId) {
                            const addWordToPackageResponses = await Promise.all(
                                wordsId.map(async (item: any) => {
                                    const addWordToPackageResponse: any = await addWordToPackage(item, packageId);
                                    const {data} = addWordToPackageResponse;
                                    return data;
                                })
                            );
                            if (addWordToPackageResponses.length > 0) {
                                Toast.show({
                                    type: 'success',
                                    text1: 'Created package successfully',
                                    text1Style: {fontSize: 20, fontWeight: 'bold'},
                                });
                            }
                        }
                    }
                }
            } catch (err) {
                console.log("err while creating package in createNewVocabPackScreen")
            } finally {
                // Tat trạng thái loading
                setLoading(false);
                setTimeout(() => {
                    backButton();
                }, 2000);
            }
        } else {
            Toast.show({
                type: 'error',
                text1: 'Can not create package',
                text2: 'Word data, package name can not be empty!',
                text1Style: {fontSize: 20, fontWeight: 'bold'},
                text2Style: {fontSize: 14},
            });
        }
    }

    return (
        <SafeAreaView style={GlobalStyles.AndroidSafeArea}
        >
            {/* Hiển thị loading indicator nếu loading */}
            {loading && (
                <View style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    zIndex: 10,
                }}>
                    <ActivityIndicator size="large" color="#0000ff"/>
                </View>
            )}
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
                            {/*header section*/}
                            <Block style={GlobalStyles.main_container} flexDirection="row"
                                   justifyContent="space-between"
                                   alignItems="center">
                                <TouchableOpacity onPress={backButton} style={{padding: 4}}>
                                    <Text size={18}> <SimpleLineIcons name="arrow-left" size={18}/> </Text>
                                </TouchableOpacity>
                                {packageData ? (
                                    <Text size={20} bold>Add words package</Text>
                                ) : (
                                    <Text size={20} bold>Create package</Text>
                                )}
                                <TouchableOpacity style={{padding: 4}} onPress={handleSavePackageBtn}>
                                    <Text size={20}> <AntDesign name="check" size={24}/> </Text>
                                </TouchableOpacity>
                            </Block>
                            <Block height={12}></Block>
                            <Block style={[
                                GlobalStyles.under_line
                            ]}></Block>
                            {/*header section*/}

                            <View style={[GlobalStyles.main_container]}>
                                <Block height={12}></Block>
                                <Block flexDirection="collum">
                                    <Text bold size={16}>Package name:</Text>
                                    <Block height={6}></Block>
                                    <Block>
                                        <View pointerEvents={packageData?.name ? 'none' : 'auto'}>
                                            <Input
                                                placeholder='Package name'
                                                value={packageData?.name || packageName}
                                                onChangeText={value => setPackageName(value)}
                                                editable={!packageData?.name}
                                            />
                                        </View>
                                    </Block>
                                </Block>

                                <Block height={14}></Block>

                                <Block flexDirection="collum">
                                    <Text bold size={16}>Description:</Text>
                                    <Block height={6}></Block>
                                    <Block>
                                        <View pointerEvents={packageData?.name ? 'none' : 'auto'}>
                                            <Input
                                                placeholder='Description'
                                                value={packageData?.description || packageDescription}
                                                onChangeText={value => setPackageDescription(value)}
                                                editable={!packageData?.description}
                                            />
                                        </View>
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

            <Toast/>
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