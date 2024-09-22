import {StyleSheet, TouchableOpacity, View} from "react-native";
import {Block, Text, theme} from "galio-framework";
import React from "react";
import {IndexPath, Select, SelectItem} from "@ui-kitten/components";
// @ts-ignore
import Entypo from 'react-native-vector-icons/Entypo';
import {GlobalStyles} from "../../../styles/GlobalStyles";

const ListCardsComponent = (wordsData: any) => {

    const [selectedIndex, setSelectedIndex] = React.useState<IndexPath | IndexPath[]>(new IndexPath(0));

    const options = {
        'Newest': 'NEWEST',
        'Oldest': 'OLDEST',
        'Name: A to Z': 'A_TO_Z',
        'Name: Z to A': 'Z_TO_A'
    }; // sort option

    React.useEffect(() => {
        console.log(wordsData);
    }, [])

    return (
        <View>
            <Block flexDirection="row" justifyContent="space-between" alignItems="center">
                <View>
                    <Text bold size={20}>Cards</Text>
                </View>
                <View style={[styles.sellectBox]}>
                    <Select

                        selectedIndex={selectedIndex}
                        onSelect={index => setSelectedIndex(index)}
                        // @ts-ignore
                        value={Object.keys(options)[selectedIndex?.row]}
                    >
                        <SelectItem title='Newest'/>
                        <SelectItem title='Oldest'/>
                        <SelectItem title='Name: A to Z'/>
                        <SelectItem title='Name: Z to A'/>
                    </Select></View>
            </Block>

            <Block height={12}></Block>

            <View>
                <View style={[styles.cardContainer]}>
                    <Block style={GlobalStyles.main_container}>
                        <Block height={8}></Block>
                        <Block flexDirection="row" justifyContent="space-between" alignItems="center">
                            <Text color={theme.COLORS?.FACEBOOK} bold
                                  size={18}>Try</Text>
                            <TouchableOpacity style={{padding: 4}}>
                                <Text size={18}> <Entypo name="dots-three-vertical" size={18}/> </Text>
                            </TouchableOpacity>
                        </Block>
                        <Block height={4}></Block>
                        <Text size={16}>verb</Text>

                    </Block>
                </View>
                <Block height={10}></Block>
            </View>
        </View>
    );
}

export default ListCardsComponent;

const styles = StyleSheet.create({
    sellectBox: {
        width: '45%',
    },
    cardContainer: {
        backgroundColor: 'white',
        width: "95%",
        height: 150,
        marginLeft: "auto",
        marginRight: "auto",
        // Đổ bóng cho Android
        elevation: 5,
        // Có thể thêm marginTop để tạo cảm giác bóng chỉ ở các phía khác
        marginTop: 5,

        // Đổ bóng cho iOS
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 5},  // Chỉ tạo bóng ở phía dưới và hai bên
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        // Bo góc nếu cần
        borderRadius: 10,
    }
});