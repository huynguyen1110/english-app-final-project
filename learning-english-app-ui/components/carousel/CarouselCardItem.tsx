import React from 'react'
import {View, StyleSheet, Dimensions, Image} from "react-native"
import {Block, Text} from "galio-framework"

export const SLIDER_WIDTH = Dimensions.get('window').width + 80
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7)

const CarouselCardItem = ({item, index}: { item: any, index: any }) => {
    return (
        <View style={styles.container} key={index}>
            <Image
                source={{uri: item.imgUrl}}
                style={styles.image}
            />
            <Block row center>
                <Block></Block>
                <Text p bold italic>{item.title}</Text>
                <Block></Block>
            </Block>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: 8,
        width: ITEM_WIDTH,
        paddingBottom: 40,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
    },
    image: {
        width: ITEM_WIDTH,
        height: 200,
    },
    header: {
        color: "#222",
        fontSize: 20,
        fontWeight: "bold",
        paddingLeft: 20,
        paddingTop: 20
    },
    body: {
        color: "#222",
        fontSize: 18,
        paddingLeft: 20,
        paddingRight: 20
    }
})

export default CarouselCardItem
