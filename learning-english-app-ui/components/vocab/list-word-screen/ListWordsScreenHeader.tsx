import {Alert, StyleSheet, TouchableOpacity, View} from "react-native";
import {Block, Text} from "galio-framework";
import {useNavigation} from "@react-navigation/native";
// @ts-ignore
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
// @ts-ignore
import Entypo from 'react-native-vector-icons/Entypo';
// @ts-ignore
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {GlobalStyles} from "../../../styles/GlobalStyles";
import Modal from 'react-native-modal';
import React from "react";
import {deletePackageService} from "../../../services/VocabService";
import Toast from "react-native-toast-message";

const ListWordsScreenHeader = (data: any) => {

    let packageData: any = Object.values(data)[0];

    const navigation = useNavigation();

    // state of setting modal
    const [isVisible, setIsVisible] = React.useState<boolean>(false);


    const backButton = () => {
        navigation.goBack();
    }

    // fetch delete package api
    const deletePackage = async (packageId: any) => {
        try {
            const response = await deletePackageService(packageId);
            const {data} : any = response;
            console.log(data)
            if (data) {
                Toast.show({
                    type: 'success',
                    text1: 'Delete package successfully!',
                    position: 'top',
                    visibilityTime: 3000,
                    text1Style: {fontSize: 20}
                });
                backButton();
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Failed to delete package',
                    position: 'top',
                    visibilityTime: 3000,
                    text1Style: {fontSize: 20}
                });
            }
        } catch (e) {
            Toast.show({
                type: 'error',
                text1: 'Failed to delete package',
                position: 'top',
                visibilityTime: 3000,
                text1Style: {fontSize: 20}
            });
            console.log("error while deleting package in ListWordsScreenHeaders", e);
        }
    }

    const handleDeletePackageBtn = () => {
        Alert.alert(
            "Confirm Deletion",
            "Are you sure you want to delete this package?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                },
                {
                    text: "OK",
                    onPress: () => {
                        deletePackage(packageData?.id)
                        console.log("OK Pressed, delete the package");
                    },
                },
            ],
            { cancelable: true }
        );
    }

    const handleAddWordBtn = () => {
        // @ts-ignore
        navigation.navigate("CreateNewVocabPackScreen", {packageData})
    }

    return (
        <View>
            <Block style={GlobalStyles.main_container} flexDirection="row" justifyContent="space-between">
                <TouchableOpacity onPress={backButton}>
                    <Text size={18}> <SimpleLineIcons name="arrow-left" size={18}/> </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    setIsVisible(true)
                }}>
                    <Text size={18}> <Entypo name="dots-three-vertical" size={18}/> </Text>
                </TouchableOpacity>
            </Block>
            <Block height={12}></Block>
            <Block style={GlobalStyles.under_line}></Block>

            {/*modal section*/}
            <Modal
                // @ts-ignore
                isVisible={isVisible}
                onBackdropPress={() => {
                    setIsVisible(false)
                }}
                style={styles.modal}
                swipeDirection="down"
                onSwipeComplete={() => {
                    setIsVisible(false)
                }}
            >
                <View style={[styles.drawer]}>
                    <Block style={GlobalStyles.main_container}>
                        <Text bold size={24}>Settings</Text>

                        <Block height={12}></Block>

                        <TouchableOpacity style={styles.actionBtn} onPress={handleAddWordBtn}>
                            <Text size={18}><Entypo size={18} name='add-to-list'/><Text> </Text> Add word</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionBtn} onPress={handleDeletePackageBtn}>
                            <Text size={18}><FontAwesome size={18} name="trash"/><Text> </Text> Delete</Text>
                        </TouchableOpacity>

                    </Block>
                </View>
            </Modal>
            {/*modal section*/}
        </View>
    );
}

export default ListWordsScreenHeader;

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    drawer: {
        backgroundColor: 'white',
        padding: 20,
        minHeight: "20%",
        width: '100%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    actionBtn: {
        width: "100%",
        height: 60,
        alignItems: "flex-start",
        justifyContent: "center",
        padding: 4
    }
});