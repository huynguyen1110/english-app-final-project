import {TouchableOpacity, View} from "react-native";
import {Block, Text} from "galio-framework";
import {useNavigation} from "@react-navigation/native";
// @ts-ignore
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
// @ts-ignore
import Entypo from 'react-native-vector-icons/Entypo';
import {GlobalStyles} from "../../../styles/GlobalStyles";

const ListWordsScreenHeader = () => {

    const navigation = useNavigation();

    const backButton = () => {
        navigation.goBack();
    }

    return (
        <View>
            <Block style={GlobalStyles.main_container} flexDirection="row" justifyContent="space-between">
                <TouchableOpacity onPress={backButton}>
                    <Text size={18}> <SimpleLineIcons name="arrow-left" size={18}/> </Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text size={18}> <Entypo name="dots-three-vertical" size={18}/> </Text>
                </TouchableOpacity>
            </Block>
            <Block height={12}></Block>
            <Block style={GlobalStyles.under_line}></Block>
        </View>
    );
}

export default ListWordsScreenHeader;