import {LogBox, SafeAreaView, TouchableOpacity} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {GlobalStyles} from "../../../styles/GlobalStyles";
import {Block, Text} from "galio-framework";
import NewsTopTabsComponent from "../../../components/news/NewsTopTabsComponent";
// @ts-ignore
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
// @ts-ignore
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import StoryTabsComponent from "../../../components/story/StoryTabsComponent";

const StoryScreen = () => {

    // ignore warning
    LogBox.ignoreAllLogs();

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
                <Text size={20} bold>Truyện chêm</Text>
                <TouchableOpacity style={{width: 30}}>
                    <Text size={20}></Text>
                </TouchableOpacity>
            </Block>
            <StoryTabsComponent/>
        </SafeAreaView>
    );
}

export default StoryScreen;