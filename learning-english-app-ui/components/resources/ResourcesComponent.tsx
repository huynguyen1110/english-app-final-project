import {
    Block,
    Text,
    Icon
} from "galio-framework";
// @ts-ignore
import Icon1 from "react-native-vector-icons/MaterialCommunityIcons";
// @ts-ignore
import Octicons from "react-native-vector-icons/Octicons";
import {TouchableOpacity, View, Image} from "react-native";
import {GlobalStyles} from "../../styles/GlobalStyles";

const ResourcesComponent = () => {
    return (
        <View>
            <Block flexDirection="row" justifyContent="space-around">
                <Block flexDirection="column" justifyContent="center" alignItems="center">
                    <Image style={[GlobalStyles.icon_button]}
                           source={require('../../assets/chatgpt-icon.png')}
                    />
                    <Text bold size={14}>ChatGPT</Text>
                </Block>
                <Block flexDirection="column" justifyContent="center" alignItems="center">
                    <TouchableOpacity style={[GlobalStyles.icon_button, {backgroundColor: "#04b551"}]}>
                        <Icon name="newspaper" family="FontAwesome5" size={30} color="white"/>
                    </TouchableOpacity>
                    <Text bold size={14}>News</Text>
                </Block>
                <Block flexDirection="column" justifyContent="center" alignItems="center">
                    <TouchableOpacity style={[GlobalStyles.icon_button, {backgroundColor: "#8f8b8b"}]}>
                        <Icon1 size={30} color="white" name="bookshelf"></Icon1>
                    </TouchableOpacity>
                    <Text bold size={14}>Truyện chêm</Text>
                </Block>
                <Block flexDirection="column" justifyContent="center" alignItems="center">
                    <TouchableOpacity style={[GlobalStyles.icon_button, {backgroundColor: "#fa3123"}]}>
                        <Octicons name="video" size={30} color="white"/>
                    </TouchableOpacity>
                    <Text bold size={14}>Videos</Text>
                </Block>
                <Block flexDirection="column" justifyContent="center" alignItems="center">
                    <TouchableOpacity style={[GlobalStyles.icon_button, {backgroundColor: "#0aabcf"}]}>
                        <Octicons name="book" size={30} color="white"/>
                    </TouchableOpacity>
                    <Text bold size={14}>Book</Text>
                </Block>
            </Block>
        </View>
    );
}

export default ResourcesComponent;


