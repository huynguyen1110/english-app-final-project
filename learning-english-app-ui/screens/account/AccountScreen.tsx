import {SafeAreaView, StyleSheet, TouchableOpacity, View} from "react-native";
import {GlobalStyles} from "../../styles/GlobalStyles";
import HeaderComponent from "../../components/HeaderComponent";
import FooterComponent from "../../components/FooterComponent";
import {Layout} from "@ui-kitten/components";
// @ts-ignore
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Block, Text} from "galio-framework";
import {useEffect, useState} from "react";
import {decodeJwtToken, getJwtToken, getUserByEmailService} from "../../services/AuthenticationService";

const AccountScreen = () => {

    const [user, setUser] = useState<any>();

    const getUser = async () => {
        const token = await getJwtToken();
        const decodedToken: any = decodeJwtToken(token);

        if (decodedToken) {
            try  {
                const{data}: any = await getUserByEmailService(decodedToken?.sub);
                setUser(data);
            } catch (e) {
                console.log(e);
            }
        }
    }

    useEffect(() => {
        getUser();
    }, [])

    return (
        <SafeAreaView style={GlobalStyles.AndroidSafeArea}>
            <HeaderComponent/>
            <Layout level="2" style={{flex: 1}}>

                <View style={GlobalStyles.main_container}>
                    <Block height={30}></Block>
                    <View style={[styles.profile_container]}>
                        <View
                            style={[GlobalStyles.flex_row, GlobalStyles.align_item_center, GlobalStyles.justify_content_space_between, GlobalStyles.main_container]}>
                            <View style={[{width: "25%"}]}>
                                <FontAwesome size={70} name='user-circle'/>
                            </View>
                            <View style={[{width: "60%"}]}>
                                <Text size={18}>{user?.username}</Text>
                                <Text size={18}>{user?.email}</Text>
                                <Text size={18}>{user?.userId}</Text>
                            </View>
                            <TouchableOpacity>
                                <Text size={18}> <FontAwesome size={30} name='chevron-right'/> </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Block height={20}></Block>

                    <View style={GlobalStyles.main_container}>
                        <View style={GlobalStyles.under_line}></View>
                        <Block height={6}></Block>
                        <TouchableOpacity style={[GlobalStyles.flex_row, GlobalStyles.align_item_center, GlobalStyles.justify_content_space_between]}>
                            <Text size={18}>Favorite news</Text>
                            <Text size={18}> <FontAwesome size={20} name='chevron-right'/> </Text>
                        </TouchableOpacity>
                        <Block height={6}></Block>
                        <View style={GlobalStyles.under_line}></View>
                        <Block height={6}></Block>
                        <TouchableOpacity style={[GlobalStyles.flex_row, GlobalStyles.align_item_center, GlobalStyles.justify_content_space_between]}>
                            <Text size={18}>LOG OUT</Text>
                            <Text size={18}> <FontAwesome size={20} name='chevron-right'/> </Text>
                        </TouchableOpacity>
                        <Block height={6}></Block>
                        <View style={GlobalStyles.under_line}></View>

                    </View>
                </View>

            </Layout>
            <Layout level="1" style={GlobalStyles.footer}>
                <FooterComponent/>
            </Layout>
        </SafeAreaView>
    );
}

export default AccountScreen;

const styles = StyleSheet.create({
    profile_container: {
        borderRadius: 30,
        width: "100%",
        height: 100,
        borderWidth: 1,
        justifyContent: "center",
        marginHorizontal: "auto",
    }
})