import {LogBox, SafeAreaView, StatusBar, View} from "react-native";
import {Block, Text} from 'galio-framework';
import {GlobalStyles} from "../../styles/GlobalStyles";
import FooterComponent from "../../components/FooterComponent";
import VocabHeaderComponent from "../../components/vocab/VocabHeaderComponent";
import PackageListComponent from "../../components/vocab/PackageListComponent";
import {Layout} from "@ui-kitten/components";

const VocabMainScreen = () => {

    LogBox.ignoreAllLogs();

    return (
        <SafeAreaView style={[GlobalStyles.AndroidSafeArea]}>
            <StatusBar hidden/>
            <VocabHeaderComponent/>

            <Layout level='2'>
                <View style={[GlobalStyles.main_container]}>
                    <Block height={12}></Block>
                    <PackageListComponent/>
                </View>
            </Layout>
            <View style={GlobalStyles.footer}>
                <FooterComponent/>
            </View>
        </SafeAreaView>
    );
}

export default VocabMainScreen;