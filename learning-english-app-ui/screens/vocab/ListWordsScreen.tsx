import {SafeAreaView, ScrollView, StyleSheet, View} from "react-native";
import React from 'react';
import {GlobalStyles} from "../../styles/GlobalStyles";
import {Avatar, Layout, Text} from "@ui-kitten/components";
import {useRoute} from "@react-navigation/native";
import ListWordsScreenHeader from "../../components/vocab/list-word-screen/ListWordsScreenHeader";
import LearningActionComponent from "../../components/vocab/list-word-screen/LearningActionComponent";
import {Block} from "galio-framework";
import ListCardsComponent from "../../components/vocab/list-word-screen/ListCardsComponent";

const ListWordsScreen = () => {

    const router = useRoute();

    // @ts-ignore
    const packageData: any = router?.params?.packageData;

    return (
        <SafeAreaView style={[GlobalStyles.AndroidSafeArea]}>
            <ListWordsScreenHeader/>
            <Layout level='2' style={{flex: 1}}>
                <ScrollView style={[GlobalStyles.main_container]}>
                    <View>
                        <Text category='h4'>{packageData?.name}</Text>
                        <Block height={6}></Block>
                        <Block row alignItems='center'>
                            <Avatar
                                size='small'
                                source={require('../../assets/imgs/background-wellcome-image-background.jpeg')} // You can replace with item.image if you have dynamic images
                            />
                            <Block width={6}/>
                            <Text category='s2'>{packageData?.createBy}</Text>
                            <Block width={12}>
                                <Text category='s2'> | </Text>
                            </Block>
                            <Text category='label'>{packageData?.words?.length} terms</Text>
                        </Block>
                    </View>

                    <Block height={20}></Block>

                    <LearningActionComponent wordsData={packageData?.words} />

                    <Block height={20}></Block>

                    <ListCardsComponent wordsData={packageData?.words} />

                </ScrollView>
            </Layout>

        </SafeAreaView>
    );
}

export default ListWordsScreen;

