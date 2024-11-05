import {RefreshControl, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View} from "react-native";
import {GlobalStyles} from "../../../styles/GlobalStyles";
import {Block, Text} from "galio-framework";
import React, {useEffect, useState} from "react";
import {useNavigation, useRoute} from "@react-navigation/native";
// @ts-ignore
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {getPackageService} from "../../../services/VocabService";
import {Avatar, Input, Layout, Text as TextUiKitten} from "@ui-kitten/components";

const VocabularyPackScreen = () => {

    const navigation = useNavigation();

    const router = useRoute();

    const [packages, setPackages] = useState<any[]>([]);

    const [refreshing, setRefreshing] = React.useState(false);

    const [searchTerm, setSearchTerm] = React.useState(''); // state saves key word to search

    const [filteredData, setFilteredData] = React.useState<any>([]); // state saves vocab package data

    const backButton = () => {
        navigation.goBack();
    }

    const fetchGetPackagesApi = async () => {
        try {
            const params = {
                page: 1,
                size: 500,
                sortBy: "createdAt",
                direction: false,
                isPublished: true
            }
            const {data}: any = await getPackageService(params)
            setPackages(data?.content);
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        fetchGetPackagesApi();
    }, []);

    useEffect(() => {
        const filteredData = searchTerm
            ? packages.filter((item: any) =>
                item?.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) // Lọc theo tên package
            )
            : packages;  // Nếu không có từ khóa, trả về toàn bộ data
        setFilteredData(filteredData);
    }, [searchTerm, packages]);

    return (
        <SafeAreaView style={GlobalStyles.AndroidSafeArea}>
            <Block style={GlobalStyles.main_container} flexDirection="row" justifyContent="space-between"
                   alignItems="center">
                <TouchableOpacity onPress={backButton}>
                    <Text size={18}> <SimpleLineIcons name="arrow-left" size={18}/> </Text>
                </TouchableOpacity>
                <View>
                    <Text size={20}> Vocabulary packs </Text>
                </View>
                <View>
                    <Text size={20}> </Text>
                </View>
            </Block>
            <Block height={12}></Block>
            <Block style={GlobalStyles.under_line}></Block>
            <ScrollView refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={fetchGetPackagesApi}/>
            }>
                <View style={GlobalStyles.main_container}>
                    <Block height={12}></Block>

                    <Input
                        placeholder='Search package'
                        value={searchTerm}
                        onChangeText={nextValue => setSearchTerm(nextValue)}
                    />

                    <Block height={12}></Block>

                    {filteredData.map((item: any) => (
                        <TouchableOpacity key={item.id} onPress={() => {
                            // @ts-ignore
                            navigation.navigate("ListWordsScreen", {packageData: item});
                        }}>
                            {/* Ngày tạo */}
                            <TextUiKitten category='h6'>{new Date(item.createdAt).toLocaleDateString()}</TextUiKitten>

                            <Block height={8}/>
                            <Layout level='1' style={styles.packageItemContainer}>
                                <Block style={GlobalStyles.main_container}>
                                    <Block height={6}/>

                                    {/* Tên package */}
                                    <TextUiKitten category='h6'>{item.name}</TextUiKitten>

                                    <Block height={6}/>

                                    {/* Số lượng từ trong package */}
                                    <TextUiKitten category='s1' appearance='hint'>
                                        {item.words.length} terms
                                    </TextUiKitten>

                                    <Block height={14}/>

                                    {/* Thông tin người tạo và ảnh */}
                                    <Block row alignItems='center'>
                                        <Avatar
                                            size='small'
                                            source={require('../../../assets/imgs/background-wellcome-image-background.jpeg')} // You can replace with item.image if you have dynamic images
                                        />
                                        <Block width={6}/>
                                        <TextUiKitten category='s2'>{item.createBy}</TextUiKitten>
                                    </Block>
                                </Block>
                            </Layout>
                            <Block height={16}/>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default VocabularyPackScreen;

const styles = StyleSheet.create({
    packageItemContainer: {
        borderWidth: 2,
        borderColor: '#cdb4b4',
        borderRadius: 10,
        width: "95%",
        height: 120,
        marginRight: "auto",
        marginLeft: "auto",
    }
});