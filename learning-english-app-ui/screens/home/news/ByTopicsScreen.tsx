import {FlatList, Image, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View} from "react-native";
import {GlobalStyles} from "../../../styles/GlobalStyles";
import {Block, Text} from "galio-framework";
// @ts-ignore
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../utils/Store";
import {useEffect, useState} from "react";
import {getNewsFromDb} from "../../../services/NewsService";
import {useNavigation} from "@react-navigation/native";

const ByTopicsScreen = () => {

    const dispatch = useDispatch();

    const navigation = useNavigation();

    const scienceNews = useSelector((state: RootState) => state.newsReducer.ScienceNewsData);

    const educationNews = useSelector((state: RootState) => state.newsReducer.EducationData);

    const technologyNews = useSelector((state: RootState) => state.newsReducer.TechnologyData);

    const businessNews = useSelector((state: RootState) => state.newsReducer.BusinessData);

    const sportNews = useSelector((state: RootState) => state.newsReducer.SportData);

    const travelNews = useSelector((state: RootState) => state.newsReducer.TravelData);

    const [refreshing, setRefreshing] = useState(false);

    const fetchNews = () => {
        const newsParams = [
            { topicId: 2, key: 'scienceNews' },
            { topicId: 1, key: 'educationNews' },
            { topicId: 3, key: 'technologyNews' },
            { topicId: 4, key: 'businessNews' },
            { topicId: 5, key: 'travelNews' },
            { topicId: 6, key: 'sportNews' },
        ];

        newsParams.forEach(param => {
            const params = {
                topicId: param.topicId,
                page: 1,
                size: 100,
                sortField: "",
                sortDirection: true
            };
            // @ts-ignore
            dispatch(getNewsFromDb(params, param.key));
        });
    };

    useEffect(() => {
        fetchNews();
    }, [dispatch]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchNews();
        setRefreshing(false);
    };

    const renderItem = ({item}: { item: any }) => (
        <TouchableOpacity style={styles.itemContainer} onPress={() => {
            // @ts-ignore
            navigation.navigate("NewsDetailScreen", {newsId: item.newsId})
        }} >
            <Image source={{uri: item.imageUrl}} style={styles.image}/>
            <Text style={styles.title}>{item.title}</Text>
            <Text size={14} color="gray">{item.description}</Text>
        </TouchableOpacity>
    );


    return (
        <View style={[GlobalStyles.main_container]}>
            <ScrollView refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
            }>
                <Block>
                    {scienceNews && (
                        <Block>
                            <Block height={12}></Block>
                            <Block flexDirection="row" justifyContent="space-between" alignItems="center">
                                <Text size={18} bold>Science</Text>
                                <TouchableOpacity>
                                    <Block flexDirection="row" justifyContent="center" alignItems="center">
                                        <Text size={18}>See All</Text>
                                        <Text size={18}> <SimpleLineIcons name="arrow-right" size={18}/> </Text>
                                    </Block>
                                </TouchableOpacity>
                            </Block>

                            <Block>
                                <FlatList
                                    data={scienceNews.slice(0, 10)}
                                    renderItem={renderItem}
                                    keyExtractor={(item) => item.newsId.toString()}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                />
                            </Block>
                            <Block height={12} style={GlobalStyles.under_line}></Block>
                        </Block>
                    )}

                    {educationNews && (
                        <Block>
                            <Block height={12}></Block>
                            <Block flexDirection="row" justifyContent="space-between" alignItems="center">
                                <Text size={18} bold>Education</Text>
                                <TouchableOpacity>
                                    <Block flexDirection="row" justifyContent="center" alignItems="center">
                                        <Text size={18}>See All</Text>
                                        <Text size={18}> <SimpleLineIcons name="arrow-right" size={18}/> </Text>
                                    </Block>
                                </TouchableOpacity>
                            </Block>

                            <Block>
                                <FlatList
                                    data={educationNews.slice(0, 10)}
                                    renderItem={renderItem}
                                    keyExtractor={(item) => item.newsId.toString()}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                />
                            </Block>
                            <Block height={12} style={GlobalStyles.under_line}></Block>
                        </Block>
                    )}

                    {technologyNews && (
                        <Block>
                            <Block height={12}></Block>
                            <Block flexDirection="row" justifyContent="space-between" alignItems="center">
                                <Text size={18} bold>Technology</Text>
                                <TouchableOpacity>
                                    <Block flexDirection="row" justifyContent="center" alignItems="center">
                                        <Text size={18}>See All</Text>
                                        <Text size={18}> <SimpleLineIcons name="arrow-right" size={18}/> </Text>
                                    </Block>
                                </TouchableOpacity>
                            </Block>

                            <Block>
                                <FlatList
                                    data={technologyNews.slice(0, 10)}
                                    renderItem={renderItem}
                                    keyExtractor={(item) => item.newsId.toString()}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                />
                            </Block>
                            <Block height={12} style={GlobalStyles.under_line}></Block>
                        </Block>
                    )}

                    {businessNews && (
                        <Block>
                            <Block height={12}></Block>
                            <Block flexDirection="row" justifyContent="space-between" alignItems="center">
                                <Text size={18} bold>Business</Text>
                                <TouchableOpacity>
                                    <Block flexDirection="row" justifyContent="center" alignItems="center">
                                        <Text size={18}>See All</Text>
                                        <Text size={18}> <SimpleLineIcons name="arrow-right" size={18}/> </Text>
                                    </Block>
                                </TouchableOpacity>
                            </Block>

                            <Block>
                                <FlatList
                                    data={businessNews.slice(0, 10)}
                                    renderItem={renderItem}
                                    keyExtractor={(item) => item.newsId.toString()}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                />
                            </Block>
                            <Block height={12} style={GlobalStyles.under_line}></Block>
                        </Block>
                    )}

                    {travelNews && (
                        <Block>
                            <Block height={12}></Block>
                            <Block flexDirection="row" justifyContent="space-between" alignItems="center">
                                <Text size={18} bold>Travel</Text>
                                <TouchableOpacity>
                                    <Block flexDirection="row" justifyContent="center" alignItems="center">
                                        <Text size={18}>See All</Text>
                                        <Text size={18}> <SimpleLineIcons name="arrow-right" size={18}/> </Text>
                                    </Block>
                                </TouchableOpacity>
                            </Block>

                            <Block>
                                <FlatList
                                    data={travelNews.slice(0, 10)}
                                    renderItem={renderItem}
                                    keyExtractor={(item) => item.newsId.toString()}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                />
                            </Block>
                            <Block height={12} style={GlobalStyles.under_line}></Block>
                        </Block>
                    )}

                    {sportNews && (
                        <Block>
                            <Block height={12}></Block>
                            <Block flexDirection="row" justifyContent="space-between" alignItems="center">
                                <Text size={18} bold>Sport</Text>
                                <TouchableOpacity>
                                    <Block flexDirection="row" justifyContent="center" alignItems="center">
                                        <Text size={18}>See All</Text>
                                        <Text size={18}> <SimpleLineIcons name="arrow-right" size={18}/> </Text>
                                    </Block>
                                </TouchableOpacity>
                            </Block>

                            <Block>
                                <FlatList
                                    data={sportNews.slice(0, 10)}
                                    renderItem={renderItem}
                                    keyExtractor={(item) => item.newsId.toString()}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                />
                            </Block>
                            <Block height={12} style={GlobalStyles.under_line}></Block>
                        </Block>
                    )}
                </Block>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    itemContainer: {
        width: 200,
        marginRight: 10,
    },
    image: {
        width: '100%',
        height: 100,
        borderRadius: 5,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 5,
    }
});

export default ByTopicsScreen;
