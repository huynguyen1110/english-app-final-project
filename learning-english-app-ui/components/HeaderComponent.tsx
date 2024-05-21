import {LogBox, SafeAreaView} from "react-native";
import {
    Block,
    Text,
    Icon,
    theme
} from "galio-framework";
import {GlobalStyles} from "../styles/GlobalStyles";

const HeaderComponent = () => {

    LogBox.ignoreAllLogs();

    return (
        <SafeAreaView>
            <Block style={[
                [
                    GlobalStyles.main_container,
                ]
            ]}>
                <Block flexDirection="row" justifyContent="space-between">
                    <Text h5 italic bold color={theme.COLORS?.FACEBOOK}>E-English</Text>
                    <Text> <Icon name="bell" family="Feather" size={24}/></Text>

                </Block>
            </Block>
            <Block height={12}></Block>
            <Block style={[
                GlobalStyles.under_line
            ]}></Block>
        </SafeAreaView>
    );
}

export default HeaderComponent;
