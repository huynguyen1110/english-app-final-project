import {Image, StyleSheet, TouchableOpacity, View} from "react-native";
import {GlobalStyles} from "../../../styles/GlobalStyles";
import {Block, Text} from "galio-framework";
import {LOGO_BACKGROUND_COLOR, SOURCE_NEWS_NAME} from "../../../utils/constant";
import {getNewsBySourceNameService} from "../../../services/NewsService";
import {useNavigation} from "@react-navigation/native";

const ByNewsWebSiteScreen = () => {

    const navigation = useNavigation();

    const handleNaviageToListNewsScreen = (sourceName: string) => {
        // @ts-ignore
        navigation.navigate("ListNewsBySourceNameScreen", {sourceName: sourceName});
    }

    const fetchNewsBySourceName = async (sourceName: string) => {
        try  {
            const params: any = {
                page: 1,
                size: 100,
                sortField: "createdAt",
                sortDirection: false,
                sourceName: sourceName,
            };
            const respone: any = await getNewsBySourceNameService(params);
            const {data} = respone;
            console.log(data);
        } catch(e) {
            console.log("err while fetching news by source name", e);
        }
    }

    return (
        <View style={GlobalStyles.main_container}>
            <Block height={4}></Block>
            <Text bold size={16}>SOURCE</Text>
            <Block height={8}></Block>

            <TouchableOpacity style={[GlobalStyles.flex_row, GlobalStyles.align_item_center]}
            onPress={() => {
                handleNaviageToListNewsScreen(SOURCE_NEWS_NAME.BBC_NEWS);
            } }
            >
                <Block
                    style={[styles.image_logo_container, GlobalStyles.flex_row, GlobalStyles.align_item_center, GlobalStyles.justify_content_center,
                        {backgroundColor: LOGO_BACKGROUND_COLOR.BBC_NEWS_COLOR}
                    ]}>
                    <Image
                        source={require("../../../assets/news-logo/BBC_NEWS_LOGO.png")}
                        style={[styles.image_logo]}
                    />
                </Block>
                <Block width={8}></Block>
                <Text size={16}>BBC news</Text>
            </TouchableOpacity>

            <Block height={8}></Block>

            <TouchableOpacity style={[GlobalStyles.flex_row, GlobalStyles.align_item_center]}
            onPress={() => {
                handleNaviageToListNewsScreen(SOURCE_NEWS_NAME.FOX_NEWS);
            }}
            >
                <Block
                    style={[styles.image_logo_container, GlobalStyles.flex_row, GlobalStyles.align_item_center, GlobalStyles.justify_content_center,
                        {backgroundColor: LOGO_BACKGROUND_COLOR.FOX_NEWS_COLOR}
                    ]}>
                    <Image
                        source={require("../../../assets/news-logo/FOX_NEW_LOGO.png")}
                        style={[styles.image_logo]}
                    />
                </Block>
                <Block width={8}></Block>
                <Text size={16}>Fox news</Text>
            </TouchableOpacity>

            <Block height={8}></Block>

            <TouchableOpacity style={[GlobalStyles.flex_row, GlobalStyles.align_item_center]}
            onPress={() => {
                handleNaviageToListNewsScreen(SOURCE_NEWS_NAME.CNN_COM);
            }}
            >
                <Block
                    style={[styles.image_logo_container, GlobalStyles.flex_row, GlobalStyles.align_item_center, GlobalStyles.justify_content_center,
                        {backgroundColor: LOGO_BACKGROUND_COLOR.CNN_COLOR}
                    ]}>
                    <Image
                        source={require("../../../assets/news-logo/CNN_LOGO.png")}
                        style={[styles.image_logo]}
                    />
                </Block>
                <Block width={8}></Block>
                <Text size={16}>CNN</Text>
            </TouchableOpacity>


            <Block height={8}></Block>

            <TouchableOpacity style={[GlobalStyles.flex_row, GlobalStyles.align_item_center]}
            onPress={() => {
                handleNaviageToListNewsScreen(SOURCE_NEWS_NAME.TECH_CRUNCH);
            }}
            >
                <Block
                    style={[styles.image_logo_container, GlobalStyles.flex_row, GlobalStyles.align_item_center, GlobalStyles.justify_content_center,
                        {backgroundColor: LOGO_BACKGROUND_COLOR.TECH_CRUNCH}
                    ]}>
                    <Image
                        source={require("../../../assets/news-logo/TECHCRUNCH_LOGO.png")}
                        style={[styles.image_logo]}
                    />
                </Block>
                <Block width={8}></Block>
                <Text size={16}>Tech Crunch</Text>
            </TouchableOpacity>

            <Block height={8}></Block>

            <Block height={8}></Block>

            <TouchableOpacity style={[GlobalStyles.flex_row, GlobalStyles.align_item_center]}
            onPress={() => {
                handleNaviageToListNewsScreen(SOURCE_NEWS_NAME.GLOBAL_NEWS);
            }}
            >
                <Block
                    style={[styles.image_logo_container, GlobalStyles.flex_row, GlobalStyles.align_item_center, GlobalStyles.justify_content_center,
                        {backgroundColor: LOGO_BACKGROUND_COLOR.GLOBAL_NEWS}
                    ]}>
                    <Image
                        source={require("../../../assets/news-logo/GLOBAL_NEWS_LOGO.png")}
                        style={[ {width: 40, height: 40, resizeMode: "contain" } ]}
                    />
                </Block>
                <Block width={8}></Block>
                <Text size={16}>Global News</Text>
            </TouchableOpacity>

            <Block height={8}></Block>

        </View>
    );
}
const styles = StyleSheet.create({
    image_logo_container: {
        width: 70,
        height: 70,
        borderRadius: 50,
        borderWidth: 1,
    },
    image_logo: {
        width: 80,
        height: 80,
        borderRadius: 50,
        resizeMode: 'contain',
    }
})

export default ByNewsWebSiteScreen;
