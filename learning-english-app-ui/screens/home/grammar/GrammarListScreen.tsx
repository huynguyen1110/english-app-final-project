import {Dimensions, RefreshControl, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View} from "react-native";
import {GlobalStyles} from "../../../styles/GlobalStyles";
import {Block, Text} from "galio-framework";
import React, {useEffect, useState} from "react";
import {useNavigation} from "@react-navigation/native";
// @ts-ignore
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {Layout} from "@ui-kitten/components";
import {getGrammarsService} from "../../../services/GrammarService";

const {height} = Dimensions.get('window'); // Lấy chiều cao màn hình

const GrammarListScreen = () => {

    const navigation = useNavigation();

    const [grammars, setGrammars] = useState<any []>([]);

    const [refreshing, setRefreshing] = useState(false);

    const backButton = () => {
        navigation.goBack();
    }

    const getGrammars = async () => {
        try {
            const params = {
                page: 1,
                size: 1000,
                sortField: "title",
                sortDirection: true
            }
            const {data} = await getGrammarsService(params);
            setGrammars(data?.content || []);
        } catch (e) {
            console.log(e)
        }
    }

    const onRefresh = async () => {
        setRefreshing(true);
        await getGrammars();  // Gọi lại hàm getGrammars để làm mới dữ liệu
        setRefreshing(false);
    };

    const navigateToGrammarDetailScreen = (grammarData: any) => {
        // @ts-ignore
        navigation.navigate("GrammarDetailScreen", {grammarData: grammarData, name: "test"});
    }

    useEffect(() => {
        getGrammars();
    }, []);

    return (
        <SafeAreaView style={GlobalStyles.AndroidSafeArea}>
            <Block style={GlobalStyles.main_container} flexDirection="row" justifyContent="space-between"
                   alignItems="center">
                <TouchableOpacity onPress={backButton}>
                    <Text size={18}> <SimpleLineIcons name="arrow-left" size={18}/> </Text>
                </TouchableOpacity>
                <View>
                    <Text size={20}> Grammar </Text>
                </View>
                <View>
                    <Text size={20}> </Text>
                </View>
            </Block>
            <Block height={12}></Block>
            <Block style={GlobalStyles.under_line}></Block>
            <ScrollView contentContainerStyle={{flexGrow: 1}} style={{height}}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>
                <Layout level='3' style={{flex: 1}}>
                    <View style={[GlobalStyles.main_container, {flex: 1}]}>
                        {Array.isArray(grammars) && grammars.length > 0 ? (
                            grammars
                                .filter((grammar) => grammar.isPublished === true) // Lọc chỉ các grammar có isPublished = true
                                .map((grammar, index) => (
                                    <TouchableOpacity
                                        key={grammar.id}
                                        style={styles.grammarTagContainer}
                                        onPress={() => {
                                            navigateToGrammarDetailScreen(grammar);
                                        }}
                                    >
                                        <View style={{ width: 12 }} />
                                        <Text size={18}>{index + 1}. </Text>
                                        <Text size={18}>{grammar.title}</Text>
                                    </TouchableOpacity>
                                ))
                        ) : (
                            <Text>No grammar items available</Text>
                        )}
                    </View>
                </Layout>
            </ScrollView>
        </SafeAreaView>
    );
}

export default GrammarListScreen;

const styles = StyleSheet.create({
    grammarTagContainer: {
        width: "100%",
        height: 45,
        borderRadius: 30,
        borderWidth: 1,
        alignItems: "center",
        marginTop: 16,
        backgroundColor: 'white',
        flexDirection: 'row'
    }
});