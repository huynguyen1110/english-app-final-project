import {
    SafeAreaView,
    StatusBar,
    ScrollView, View
} from "react-native";
import {GlobalStyles} from "../../styles/GlobalStyles";
import {
    Block, Input,
    Text, theme,
} from "galio-framework";
import HeaderComponent from "../../components/HeaderComponent";
import CarouselCards from "../../components/carousel/CarouselCards";
import ResourcesComponent from "../../components/resources/ResourcesComponent";
import FooterComponent from "../../components/FooterComponent";
import {Layout} from "@ui-kitten/components";

const HomeScreen = () => {

    return (
        <SafeAreaView style={
            [
                GlobalStyles.AndroidSafeArea
            ]
        }>
            <StatusBar hidden/>

            <HeaderComponent/>

            <Layout level='2' style={{flex: 1}}>
                <ScrollView>

                    <Block height={12}></Block>

                    <Block style={GlobalStyles.main_container}>
                        <Block>
                            <Block>
                                <Text bold size={20}>Dictionary</Text>
                            </Block>
                            <Block>
                                <Input rounded
                                       icon="search"
                                       family="Feather"
                                       borderless={true}
                                       bgColor={theme.COLORS?.NAVBAR}
                                       placeholder="Search"></Input>
                            </Block>
                            <Block height={12}></Block>
                            <Block row>
                                <Text> <Input placeholder="Hello" rounded editable={false}></Input> </Text>
                                <Text> <Input placeholder="Information" rounded editable={false}></Input> </Text>
                            </Block>
                        </Block>
                    </Block>

                    <Block height={12}></Block>
                    <Block style={[GlobalStyles.gray_background]} height={12}></Block>

                    <Block height={320}>
                        <Block height={4}></Block>
                        <Block style={[GlobalStyles.main_container]}>
                            <Text bold size={20}>Resources</Text>
                        </Block>
                        <Block height={4}></Block>
                        <Block center>
                            <CarouselCards/>
                        </Block>
                    </Block>

                    <Block>
                        <Block style={[GlobalStyles.main_container]}>
                            <ResourcesComponent/>
                        </Block>
                    </Block>
                </ScrollView>
            </Layout>

            <Layout level='1' style={GlobalStyles.footer}>
                <FooterComponent/>
            </Layout>
        </SafeAreaView>
    );
}

export default HomeScreen;
