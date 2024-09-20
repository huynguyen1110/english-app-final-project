import {LogBox, SafeAreaView, StatusBar, View} from "react-native";
import {Block, Text} from 'galio-framework';
import {GlobalStyles} from "../../styles/GlobalStyles";
import FooterComponent from "../../components/FooterComponent";
import VocabHeaderComponent from "../../components/vocab/VocabHeaderComponent";

const VocabMainScreen = () => {

    LogBox.ignoreAllLogs();

    return (
        <SafeAreaView style={[GlobalStyles.AndroidSafeArea]}>
            <StatusBar hidden/>
            <VocabHeaderComponent/>

            <View style={[GlobalStyles.main_container]}>
            </View>
            <View style={GlobalStyles.footer}>
                <FooterComponent/>
            </View>
        </SafeAreaView>
    );
}

export default VocabMainScreen;