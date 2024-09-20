// @ts-ignore
import Feather from 'react-native-vector-icons/Feather';

import {TouchableOpacity, View} from "react-native";
import {
    Block,
    Text
} from "galio-framework";
import {GlobalStyles} from "../../styles/GlobalStyles";

const VocabHeaderComponent = () => {
    return (
        <View>
            <Block flexDirection="row" justifyContent="space-between">
                <View style={{padding: 4}}>
                    <Text size={24} bold>Your vocab</Text>
                </View>
                <TouchableOpacity style={[ {padding: 4} ]}>
                    <Feather name="plus" size={27}/>
                </TouchableOpacity>
            </Block>
            <Block style={[GlobalStyles.under_line, {with: "100%"} ]}></Block>
        </View>
    );
}

export default VocabHeaderComponent;