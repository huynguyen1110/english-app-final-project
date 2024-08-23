import {Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, TouchableOpacity, View} from "react-native";
import {GlobalStyles} from "../../../styles/GlobalStyles";
import {Text, Block} from "galio-framework"
import {useNavigation, useRoute} from "@react-navigation/native";
import {useEffect, useState} from "react";
// @ts-ignore
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {SOURCE_NEWS_NAME, TOPIC_NAME} from "../../../utils/constant";
import {getNewsById, getNewsBySourceNameService} from "../../../services/NewsService";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../utils/Store";

const ListNewsBySourceNameScreen = () => {

    const dispatch = useDispatch();

    const route = useRoute();

    const navigation = useNavigation();

    const [sourceName, setSourceName] = useState<any>("");

    const [imageBannerPath, setImagebannerPath] = useState<any>("");

    // news data by source name
    const [newsData, setNewsData] = useState<any []>([]);

    // state of thumbnail image
    const [imageError, setImageError] = useState(false);

    // news data by "see all"
    const [data, setData] = useState<any []>([]);

    const scienceNews = useSelector((state: RootState) => state.newsReducer.ScienceNewsData);

    const educationNews = useSelector((state: RootState) => state.newsReducer.EducationData);

    const technologyNews = useSelector((state: RootState) => state.newsReducer.TechnologyData);

    const businessNews = useSelector((state: RootState) => state.newsReducer.BusinessData);

    const sportNews = useSelector((state: RootState) => state.newsReducer.SportData);

    const travelNews = useSelector((state: RootState) => state.newsReducer.TravelData);

    const backButton = () => {
        navigation.goBack();
    }

    // getting news data
    const fetchNewsBySourceName = async (sourceName: string) => {
        try {
            setNewsData([]);
            const params: any = {
                page: 1,
                size: 100,
                sortField: "createdAt",
                sortDirection: false,
                sourceName: sourceName,
            };
            const respone: any = await getNewsBySourceNameService(params);
            const {data} = respone;
            setNewsData(data.content);
        } catch (e) {
            console.log("err while fetching news by source name", e);
        }
    }

    // render news data when click see all btn
    const renderAllNewsList = () => {
        return data != null && data.length > 0 ? (
            data.map((item: any, index: any) => (

                <TouchableOpacity key={index} onPress={() => {
                    // @ts-ignore
                    dispatch(getNewsById(item.newsId))
                    // @ts-ignore
                    navigation.navigate("NewsDetailScreen")
                }}>
                    <Block style={[GlobalStyles.main_container]}
                           flexDirection="row" justifyContent="space-between" alignItems="center">
                        <View style={{width: "70%"}}>
                            <Text size={16} bold>
                                {item.title.length > 60 ? `${item.title.slice(0, 60)}...` : item.title}
                            </Text>
                        </View>
                        <View style={[styles.news_image_container]}>

                            {/* check if can not display image */}
                            {imageError ? (
                                <Text bold color="red">Thumbnail err</Text>
                            ) : (
                                <Image
                                    source={{uri: item.imageUrl}}
                                    style={[styles.news_image]}
                                    onError={() => setImageError(true)}
                                />
                            )}
                        </View>
                    </Block>
                    <Block height={4}></Block>
                    <View style={GlobalStyles.under_line}></View>
                    <Block height={4}></Block>
                </TouchableOpacity>
            ))
        ) : (
            <View>
                <Text>No science news available</Text>
            </View>
        );
    }

    // call "see all news" data
    useEffect(() => {
        setData([]);
        switch (sourceName) {
            case TOPIC_NAME.SCIENCE:
                setData(scienceNews);
                break;
            case TOPIC_NAME.BUSINESS:
                setData(businessNews);
                break;
            case TOPIC_NAME.SPORT:
                setData(sportNews);
                break;
            case TOPIC_NAME.TRAVEL:
                setData(travelNews);
                break;
            case TOPIC_NAME.TECHNOLOGY:
                setData(technologyNews);
                break;
            case TOPIC_NAME.EDUCATION:
                setData(educationNews);
                break;
            default:
                setData([]);
        }
    }, [sourceName]);

    // update banner images
    useEffect(() => {
        // @ts-ignore
        const sourceName = route.params?.sourceName;
        setSourceName(sourceName);

        // set image banner
        if (sourceName) {
            let imagePath;
            switch (sourceName) {
                case SOURCE_NEWS_NAME.GLOBAL_NEWS:
                    imagePath = require('../../../assets/news-banners/GLOBAL_NEWS_BANNER.png');
                    break;
                case SOURCE_NEWS_NAME.FOX_NEWS:
                    imagePath = require('../../../assets/news-banners/FOX_NEWS_BANNER.png');
                    break;
                case SOURCE_NEWS_NAME.BBC_NEWS:
                    imagePath = require('../../../assets/news-banners/BBC_NEWS_BANNER.png');
                    break;
                case SOURCE_NEWS_NAME.CNN_COM:
                    imagePath = require('../../../assets/news-banners/CNN_NEWS_BANNER.png');
                    break;
                case SOURCE_NEWS_NAME.TECH_CRUNCH:
                    imagePath = require('../../../assets/news-banners/TECH_CRUNCH_BANNER.png');
                    break;
                default:
                    imagePath = require('../../../assets/news-banners/SAMPLE_NEWS_BANNER.png');
            }

            fetchNewsBySourceName(sourceName);

            if (imagePath) {
                setImagebannerPath(imagePath);
            }
        }
    }, [route]);

    return (
        <SafeAreaView style={GlobalStyles.AndroidSafeArea}>
            <StatusBar hidden={true}/>
            <Block style={GlobalStyles.main_container} flexDirection="row" justifyContent="space-between"
                   alignItems="center">
                <TouchableOpacity onPress={backButton}>
                    <Text size={18}> <SimpleLineIcons name="arrow-left" size={18}/> </Text>
                </TouchableOpacity>
                <Text size={20} bold> {sourceName} </Text>
                <View style={{paddingRight: 25}}></View>
            </Block>
            <Block height={12}></Block>
            <View style={GlobalStyles.under_line}></View>

            <Block height={4}></Block>

            <ScrollView>
                <View>
                    <Image style={{height: 150, width: "100%", resizeMode: "stretch"}} source={imageBannerPath}/>
                </View>

                {newsData.length > 0 ?
                    (
                        <View>
                            {newsData.map((item, index) => (
                                <TouchableOpacity key={index} onPress={() => {
                                    // @ts-ignore
                                    dispatch(getNewsById(item.newsId))
                                    // @ts-ignore
                                    navigation.navigate("NewsDetailScreen")
                                }}>
                                    <Block style={[GlobalStyles.main_container]}
                                           flexDirection="row" justifyContent="space-between" alignItems="center">
                                        <View style={{width: "70%"}}>
                                            <Text size={16} bold>
                                                {item.title.length > 60 ? `${item.title.slice(0, 60)}...` : item.title}
                                            </Text>
                                        </View>
                                        <View style={[styles.news_image_container]}>
                                            <Image
                                                source={{uri: item.imageUrl}}
                                                style={[styles.news_image]}
                                            />
                                        </View>
                                    </Block>
                                    <Block height={4}></Block>
                                    <View style={GlobalStyles.under_line}></View>
                                    <Block height={4}></Block>
                                </TouchableOpacity>
                            ))}
                        </View>
                    ) :
                    (
                        <View></View>
                    )
                }

                {data.length > 0 ? renderAllNewsList() : (<View></View>)}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    news_image_container: {
        width: 90,
        height: 90,
        borderRadius: 10,
        overflow: 'hidden',
    },
    news_image: {
        width: 90,
        height: 90,
        resizeMode: "stretch",
    }
});

export default ListNewsBySourceNameScreen;
