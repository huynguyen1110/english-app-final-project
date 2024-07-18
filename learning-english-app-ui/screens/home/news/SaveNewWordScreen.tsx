import {
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    SectionList,
    TextInput,
    TouchableOpacity,
    View,
    LogBox, StyleSheet
} from "react-native";
import {GlobalStyles} from "../../../styles/GlobalStyles";
import {Block, Text} from "galio-framework";
// @ts-ignore
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
// @ts-ignore
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
// @ts-ignore
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// @ts-ignore
import Entypo from 'react-native-vector-icons/Entypo';
import React, {useRef, useState} from "react";
import {Modalize} from "react-native-modalize";
import {
    charcoalColor,
    fileManagerColor,
    lightGrayColor,
    sandDollarColor,
    themeAppColor,
    whiteColor
} from "../../../utils/constant";
import Modal from "react-native-modal";
import WORD_TYPES from "../../../utils/wordType.constant";

const SaveNewWordScreen = () => {
    // ignore warning
    LogBox.ignoreAllLogs();

    // state of showing modal
    const [modalVisible, setModalVisible] = useState(false);

    const modalRef = useRef<Modalize>(null);

    const [inputHeight, setInputHeight] = useState(50);

    const [inputExampleHeight, setInputExampleHeight] = useState(50);

    // use for opening Modalize (handle scroll view in modal)
    const openModal = () => modalRef?.current?.open();

    return (
        <SafeAreaView style={GlobalStyles.AndroidSafeArea}>
            <View>
                <Block style={[GlobalStyles.main_container]} flexDirection="row" height={50}
                       justifyContent="space-between"
                       alignItems="center">
                    <TouchableOpacity>
                        <Text size={18}> <SimpleLineIcons name="arrow-left" size={18}/> </Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text size={20} color="#1d77f5" bold>SAVE</Text>
                    </TouchableOpacity>
                </Block>
                <Block style={GlobalStyles.under_line}></Block>
            </View>
            <ScrollView style={GlobalStyles.main_container}>
                <Block>
                    <Text size={18} bold>Word</Text>
                    <Block height={8}></Block>
                    <TextInput style={[GlobalStyles.rounded_input]}></TextInput>
                </Block>

                <Block height={12}></Block>

                <Block>
                    <Text size={18} bold>Folder</Text>
                    <Block height={8}></Block>
                    <TouchableOpacity onPress={openModal} style={[GlobalStyles.non_rounded_input]}>
                        <Block flexDirection="row" justifyContent="space-between" alignItems="center">
                            <Text size={16}>Folder Name</Text>
                            <Entypo name="triangle-down" color="gray" size={24}></Entypo>
                        </Block>
                    </TouchableOpacity>
                </Block>

                <Block height={12}></Block>

                <View>
                    <Block row alignItems="center">
                        <Text size={18} bold>Definition</Text>
                        <Block width={8}></Block>
                        <TouchableOpacity style={styles.select_btn} onPress={() => setModalVisible(true)}>
                            <Text color={themeAppColor}>+ type</Text>
                        </TouchableOpacity>
                    </Block>
                    <Block height={8}></Block>
                    <TextInput
                        style={[
                            GlobalStyles.non_rounded_input,
                            {height: inputHeight}]}
                        multiline={true}
                        onContentSizeChange={(e) => setInputHeight(e.nativeEvent.contentSize.height)}
                        numberOfLines={5}
                    />
                </View>

                <Block height={12}></Block>

                <Block>
                    <Text size={18} bold>Example</Text>
                    <Block height={8}></Block>
                    <TextInput
                        style={[
                            GlobalStyles.non_rounded_input,
                            {height: inputExampleHeight}
                        ]}
                        multiline={true}
                        onContentSizeChange={(e) => setInputExampleHeight(e.nativeEvent.contentSize.height)}
                        numberOfLines={5}
                    />
                </Block>
            </ScrollView>
            <Modalize
                ref={modalRef}
                modalHeight={400}
                scrollViewProps={{showsVerticalScrollIndicator: false}}
            >

                <View style={[{backgroundColor: "#c6cfcd"}]}>
                    <Block style={GlobalStyles.main_container} height={50} row justifyContent="space-between"
                           alignItems="center">
                        <Text size={18}>Folder</Text>
                        <TouchableOpacity style={{padding: 5}}>
                            <FontAwesome5 name="folder-plus" color={themeAppColor}
                                          size={24}></FontAwesome5>
                        </TouchableOpacity>
                    </Block>
                </View>

                <Block style={GlobalStyles.under_line}></Block>

                <ScrollView>
                    <TouchableOpacity style={GlobalStyles.main_container}>
                        <Block row alignItems="center" height={50}>
                            <MaterialIcons name="folder" color={fileManagerColor} bold
                                           size={30}></MaterialIcons>
                            <Block width={4}></Block>
                            <Text size={18}>Test folder</Text>
                        </Block>
                    </TouchableOpacity>
                    <Block style={GlobalStyles.under_line}></Block>
                </ScrollView>
            </Modalize>

            {/* select word's type modal */}
            <Modal
                // @ts-ignore
                isVisible={modalVisible}
                onBackdropPress={() => {
                    setModalVisible(false);
                }}
                style={styles.modal}
                swipeDirection="down"
                onSwipeComplete={() => {
                    setModalVisible(false);
                }}
            >
                <View style={[styles.drawer]}>
                    <Block row justifyContent="space-between" alignItems="center">
                        <Text size={18} bold>Select word's type</Text>
                        <TouchableOpacity style={styles.large_select_btn}>
                            <Text size={18} bold color={themeAppColor}>Delete</Text>
                        </TouchableOpacity>
                    </Block>

                    {Object.entries(WORD_TYPES).map(([key, value]) => (
                        <TouchableOpacity style={[ GlobalStyles.flex_row, GlobalStyles.justify_content_center, GlobalStyles.align_item_center ]} key={key}>
                            <Text>{value}</Text>
                            <TouchableOpacity>
                                <Text>Select</Text>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    ))}
                </View>
            </Modal>
            {/* select word's type modal */}

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
        height: "70%",
        width: '100%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    select_btn: {
        borderWidth: 1,
        borderRadius: 20,
        backgroundColor: lightGrayColor,
        width: 60,
        height: 25,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: 'center'
    },
    large_select_btn: {
        borderWidth: 1,
        borderRadius: 20,
        backgroundColor: lightGrayColor,
        width: 70,
        height: 30,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: 'center'
    }
});

export default SaveNewWordScreen;
