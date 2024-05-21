import {SafeAreaView, StatusBar} from "react-native";
import {GlobalStyles} from "../../styles/GlobalStyles";
import {
    Block,
    Text,
} from "galio-framework";
import HeaderComponent from "../../components/HeaderComponent";

const HomeScreen = () => {
    return (
        <SafeAreaView style={
            [
                GlobalStyles.AndroidSafeArea
            ]
        }>
            <StatusBar hidden/>
            <HeaderComponent/>
            <Block>
                <Text>Home screen</Text>
            </Block>
        </SafeAreaView>
    );
}

export default HomeScreen;
