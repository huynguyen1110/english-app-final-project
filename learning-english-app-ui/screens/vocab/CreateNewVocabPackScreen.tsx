// @ts-ignore
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
// @ts-ignore
import AntDesign from "react-native-vector-icons/AntDesign";
// @ts-ignore
import Ionicons from 'react-native-vector-icons/Ionicons';
// @ts-ignore
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {LogBox, SafeAreaView, StyleSheet, TouchableOpacity, View} from "react-native";
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

    const [listNewWords, setListNewWords] = React.useState([
        {key: '1', description: 'Item 1'},
        {key: '2', description: 'Item 2'},
        {key: '3', description: 'Item 3'},
        {key: '4', description: 'Item 4'},
        {key: '5', description: 'Item 5'},
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

    // Function to render each list item
    const renderItem = (rowData: any) => {
        return (
            <View
                style={styles.itemContainer}
            >
                <Text style={styles.itemText}>
                    {rowData.item.description}
                </Text>
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

    return (
        <SafeAreaView style={GlobalStyles.AndroidSafeArea}>
            {/*Header section*/}
            <Block style={GlobalStyles.main_container} flexDirection="row" justifyContent="space-between"
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
            {/*Header section*/}
            <Layout level='2' style={{flex: 1}}>
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
                    <Block height={4}></Block>
                    {/*list new words section*/}
                    <Block height={500}>
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
                        />
                    </Block>
                    {/*list new words section*/}
                </View>

                {/*add btn section*/}
                <Block flexDirection="row" justifyContent="space-between"
                       style={[GlobalStyles.footer, {backgroundColor: 'transparent'}]}>
                    <View></View>
                    <TouchableOpacity style={styles.addBtn}>
                        <Ionicons size={40} name="add-sharp"/>
                    </TouchableOpacity>
                </Block>
                {/*add btn section*/}
            </Layout>
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
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF', // White
        borderBottomColor: '#E0E0E0', // Lighter Gray
        borderBottomWidth: 1,
        height: 80,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
        marginBottom: 10,
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