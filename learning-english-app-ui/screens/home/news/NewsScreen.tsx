import NewsTopTabsComponent from "../../../components/news/NewsTopTabsComponent";
import {Block, Text} from "galio-framework";
import {SafeAreaView, TouchableOpacity, View} from "react-native";
import {GlobalStyles} from "../../../styles/GlobalStyles";
// @ts-ignore
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
// @ts-ignore
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from "@react-navigation/native";

const NewsScreen = () => {

    const navigation = useNavigation();

    const backButton = () => {
        navigation.goBack();
    }

    return (
        <SafeAreaView style={GlobalStyles.AndroidSafeArea}>
            <Block style={GlobalStyles.main_container} flexDirection="row" justifyContent="space-between"
                   alignItems="center">
                <TouchableOpacity onPress={backButton}>
                    <Text size={18}> <SimpleLineIcons name="arrow-left" size={18}/> </Text>
                </TouchableOpacity>
                <Text size={20} bold>News</Text>
                <TouchableOpacity>
                    <Text size={20}> <FontAwesome name="search" size={24}/> </Text>
                </TouchableOpacity>
            </Block>
            <NewsTopTabsComponent/>
        </SafeAreaView>
    );
}

export default NewsScreen;
