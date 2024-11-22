import {Image, SafeAreaView, StyleSheet, TouchableOpacity, View} from "react-native";
import {GlobalStyles} from "../../styles/GlobalStyles";
import {useNavigation} from "@react-navigation/native";
import {Block, Text} from "galio-framework";
// @ts-ignore
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {getFavoriteNewsService} from "../../services/FavoriteService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {decodeJwtToken, getJwtToken} from "../../services/AuthenticationService";
import {useEffect, useState} from "react";
import {getNewsById} from "../../services/NewsService";
import {useDispatch} from "react-redux";

const FavoriteNewsScreen = () => {

    const navigation = useNavigation();

    const [favoriteNews, setFavoriteNews] = useState<any[]>([]);

    const dispatch = useDispatch();

    const backButton = () => {
        navigation.goBack();
    }

    const getFavoriteNews = async () => {
        try {
            const token = await getJwtToken();
            const decodedToken = decodeJwtToken(token);

            const params = {
                page: 1,
                size: 100,
                sortField: "title",
                sortDirection: true,
                userEmail: decodedToken?.sub
            }
            console.log(params);
            const {data} = await getFavoriteNewsService(params);
            setFavoriteNews(data?.content);
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        getFavoriteNews()
    }, []);
    return (
        <SafeAreaView style={GlobalStyles.AndroidSafeArea}>
            <Block style={GlobalStyles.main_container} flexDirection="row" justifyContent="space-between"
                   alignItems="center">
                <TouchableOpacity onPress={backButton}>
                    <Text size={18}> <SimpleLineIcons name="arrow-left" size={18}/> </Text>
                </TouchableOpacity>
                <Text size={20} bold> Favorite news </Text>
                <View style={{paddingRight: 25}}></View>
            </Block>
            <Block height={12}></Block>
            <View style={GlobalStyles.under_line}></View>

            {favoriteNews.length > 0 ?
                (
                    <View>
                        {favoriteNews.map((item, index) => (
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
        </SafeAreaView>
    );
}

export default FavoriteNewsScreen;

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


