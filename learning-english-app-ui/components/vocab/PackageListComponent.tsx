import {RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View} from "react-native";
import {Avatar, IndexPath, Layout, Select, SelectItem, Text, Input} from "@ui-kitten/components";
import React, {useEffect} from "react";
import {Block} from "galio-framework";
import {GlobalStyles} from "../../styles/GlobalStyles";
import {getPackageService} from "../../services/VocabService";
import {decodeJwtToken} from "../../services/AuthenticationService";
import navigation from "../../utils/Navigation";
import {useNavigation} from "@react-navigation/native";

const PackageListComponent = () => {

    const navigation = useNavigation();

    const [selectedIndex, setSelectedIndex] = React.useState<IndexPath | IndexPath[]>(new IndexPath(0));

    const [refreshing, setRefreshing] = React.useState(false);

    const [getPackagesParams, setGetPackagesParams] = React.useState({});

    const [vocabPackages, setVocabPackages] = React.useState<any>([]); // state saves vocab package data

    const [filteredData, setFilteredData] = React.useState<any>([]); // state saves vocab package data

    const [searchTerm, setSearchTerm] = React.useState(''); // state saves key word to search

    const options = {
        'Newest': 'NEWEST',
        'Oldest': 'OLDEST',
        'Name: A to Z': 'A_TO_Z',
        'Name: Z to A': 'Z_TO_A'
    }; // sort option

    // fetch create package api
    const fetchGetPackagesApi = async () => {
        try {
            const testToken = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJIdXk2OTY4MEBnbWFpbC5jb20iLCJyb2xlIjpbIkFETUlOIiwiVVNFUiJdLCJpYXQiOjE3MjM0NzgyNjAsImV4cCI6MTcyMzUxNDI2MH0.R5jR28VDxncQ5Xi99CH6vK--mMQAO5zBLhhREYOaXBU";
            // const token = getJwtToken();
            const decodedToken = decodeJwtToken(testToken);

            const isObjectEmpty = Object.keys(getPackagesParams).length === 0;

            if (isObjectEmpty) {
                const params = {
                    page: 1,
                    size: 500,
                    sortBy: "createdAt",
                    direction: false,
                    createBy: decodedToken?.sub,
                }
                const response: any = await getPackageService(params);
                const {data} = response;
                setVocabPackages(data.content);
            } else {
                const params = {
                    ...getPackagesParams,
                    createBy: decodedToken?.sub
                }
                const response: any = await getPackageService(params);
                const {data} = response;
                setVocabPackages(data.content);
            }
        } catch (e) {
            setVocabPackages([])
            console.error("err while fetching get package api ", e);
        }
    }

    useEffect(() => {
        fetchGetPackagesApi();
    }, []);

    // filter package
    useEffect(() => {
        const testToken = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJIdXk2OTY4MEBnbWFpbC5jb20iLCJyb2xlIjpbIkFETUlOIiwiVVNFUiJdLCJpYXQiOjE3MjM0NzgyNjAsImV4cCI6MTcyMzUxNDI2MH0.R5jR28VDxncQ5Xi99CH6vK--mMQAO5zBLhhREYOaXBU";
        // const token = getJwtToken();
        const decodedToken = decodeJwtToken(testToken);

        if (selectedIndex instanceof IndexPath) {
            const sortValue = Object.keys(options)[selectedIndex?.row];
            switch (sortValue) {
                case Object.keys(options)[0]:
                    setGetPackagesParams({
                        page: 1,
                        size: 500,
                        sortBy: "createdAt",
                        direction: false
                    })
                    fetchGetPackagesApi();
                    break;
                case Object.keys(options)[1]:
                    setGetPackagesParams({
                        page: 1,
                        size: 500,
                        sortBy: "createdAt",
                        direction: true
                    })
                    fetchGetPackagesApi();
                    break;
                case Object.keys(options)[2]:
                    setGetPackagesParams({
                        page: 1,
                        size: 500,
                        sortBy: "name",
                        direction: true
                    })
                    fetchGetPackagesApi();
                    break;
                case Object.keys(options)[3]:
                    setGetPackagesParams({
                        page: 1,
                        size: 500,
                        sortBy: "name",
                        direction: false
                    })
                    fetchGetPackagesApi();
                    break;
                default:
                    setGetPackagesParams({
                        page: 1,
                        size: 500,
                        sortBy: "createdAt",
                        direction: false
                    })
                    fetchGetPackagesApi();
                    break;
            }
        }
    }, [selectedIndex]); // fetch package api whenever sort value is changed

    useEffect(() => {
        const filteredData = searchTerm
            ? vocabPackages.filter((item: any) =>
                item?.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) // Lọc theo tên package
            )
            : vocabPackages;  // Nếu không có từ khóa, trả về toàn bộ data
        setFilteredData(filteredData);
    }, [searchTerm, vocabPackages]);

    return (
        <ScrollView style={{height: 670}} refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={fetchGetPackagesApi}/>
        }>
            <Select
                style={[styles.sellectBox]}
                selectedIndex={selectedIndex}
                onSelect={index => setSelectedIndex(index)}
                // @ts-ignore
                value={Object.keys(options)[selectedIndex?.row]}
            >
                <SelectItem title='Newest'/>
                <SelectItem title='Oldest'/>
                <SelectItem title='Name: A to Z'/>
                <SelectItem title='Name: Z to A'/>
            </Select>

            <Block height={6}></Block>

            <Input
                placeholder='Search package'
                value={searchTerm}
                onChangeText={nextValue => setSearchTerm(nextValue)}
            />

            <Block height={6}></Block>

            {filteredData.map((item: any) => (
                <TouchableOpacity key={item.id} onPress={() => {
                    // @ts-ignore
                    navigation.navigate("ListWordsScreen", {packageData: item});
                }}>
                    {/* Ngày tạo */}
                    <Text category='h6'>{new Date(item.createdAt).toLocaleDateString()}</Text>

                    <Block height={8}/>
                    <Layout level='1' style={styles.packageItemContainer}>
                        <Block style={GlobalStyles.main_container}>
                            <Block height={6}/>

                            {/* Tên package */}
                            <Text category='h6'>{item.name}</Text>

                            <Block height={6}/>

                            {/* Số lượng từ trong package */}
                            <Text category='s1' appearance='hint'>
                                {item.words.length} terms
                            </Text>

                            <Block height={14}/>

                            {/* Thông tin người tạo và ảnh */}
                            <Block row alignItems='center'>
                                <Avatar
                                    size='small'
                                    source={require('../../assets/imgs/background-wellcome-image-background.jpeg')} // You can replace with item.image if you have dynamic images
                                />
                                <Block width={6}/>
                                <Text category='s2'>{item.createBy}</Text>
                            </Block>
                        </Block>
                    </Layout>
                    <Block height={16}/>
                </TouchableOpacity>
            ))}

        </ScrollView>
    );
}

export default PackageListComponent;

const styles = StyleSheet.create({
    container: {
        minHeight: 128,
    },
    sellectBox: {
        width: '45%',
    },
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