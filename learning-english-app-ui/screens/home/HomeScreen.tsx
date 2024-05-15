import {SafeAreaView} from "react-native";
import {GlobalStyles} from "../../styles/GlobalStyles";
import {
    Block,
    Text
} from "galio-framework";

const HomeScreen = () => {
    return (
        <SafeAreaView style={
            [
                GlobalStyles.AndroidSafeArea
            ]
        }>
            <Block>
                <Text>Home screen</Text>
            </Block>
        </SafeAreaView>
    );
}

export default HomeScreen;
