import {
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    SectionList,
    TextInput,
    TouchableOpacity,
    View,
    LogBox
} from "react-native";
import {GlobalStyles} from "../../../styles/GlobalStyles";
import {Block, Text} from "galio-framework";
// @ts-ignore
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
// @ts-ignore
import Entypo from 'react-native-vector-icons/Entypo';
import React, {useRef, useState} from "react";
import {Modalize} from "react-native-modalize";

const SaveNewWordScreen = () => {
    // ignore warning
    LogBox.ignoreAllLogs();

    const modalRef = useRef<Modalize>(null);

    const [inputHeight, setInputHeight] = useState(50);

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
                    <Block style={GlobalStyles.rounded_input} justifyContent="center" alignItems="center">
                        <TextInput style={[GlobalStyles.input_container]}></TextInput>
                    </Block>
                </Block>

                <Block height={12}></Block>

                <Block>
                    <Text size={18} bold>Folder</Text>
                    <Block height={8}></Block>
                    <TouchableOpacity onPress={openModal} style={[GlobalStyles.non_rounded_input]}>
                        <Block style={GlobalStyles.input_container} justifyContent="center" alignItems="center">
                            <Block flexDirection="row" height={30} justifyContent="center" alignItems="center">
                                <Text size={16}>Folder Name</Text>
                                <Entypo name="triangle-down" color="gray" size={24}></Entypo>
                            </Block>
                        </Block>
                    </TouchableOpacity>
                </Block>

                <Block height={12}></Block>

                <Block>
                    <Text size={18} bold>Definition</Text>
                    <Block height={8}></Block>
                    <TextInput
                        style={[
                            {
                                width: "100%",
                                borderRadius: 5,
                                borderColor: "gray",
                                borderWidth: 2,
                                padding: 10,
                                fontSize: 16
                            },
                            {height: inputHeight}]}
                        multiline={true}
                        onContentSizeChange={(e) => setInputHeight(e.nativeEvent.contentSize.height)}
                        numberOfLines={5}
                    />
                </Block>
            </ScrollView>
            <Modalize
                ref={modalRef}
                modalHeight={400}
                scrollViewProps={{showsVerticalScrollIndicator: false}}
            >
                <ScrollView>

                </ScrollView>
            </Modalize>
        </SafeAreaView>
    );
}

export default SaveNewWordScreen;
