import {RefreshControl, SafeAreaView, ScrollView, TouchableOpacity, View} from "react-native";
import {GlobalStyles} from "../../../styles/GlobalStyles";
import {Block, Text} from "galio-framework";
import {Layout} from "@ui-kitten/components";
import React, {useEffect} from "react";
import {getStoriesService} from "../../../services/StoryService";

const ListStoryScreen = () => {

    const [stories, setStories] = React.useState<any []>([]);

    const fetchGetStories = async () => {
        try {
            const params = {
                page: 1,
                size: 1000,
                sortBy: "vnTitle",
                direction: false
            };
            const {data} = await getStoriesService(params);
            console.log(data?.content);
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        fetchGetStories();
    }, []);

    return (
        <SafeAreaView style={GlobalStyles.AndroidSafeArea}>
            <ScrollView style={GlobalStyles.main_container}>
                {/*<Layout level='3' style={{flex: 1}}>*/}
                {/*    <View style={[GlobalStyles.main_container, {flex: 1}]}>*/}
                {/*        {Array.isArray(grammars) && grammars.length > 0 ? (*/}
                {/*            grammars*/}
                {/*                .filter((grammar) => grammar.isPublished === true) // Lọc chỉ các grammar có isPublished = true*/}
                {/*                .map((grammar, index) => (*/}
                {/*                    <TouchableOpacity*/}
                {/*                        key={grammar.id}*/}
                {/*                        style={styles.grammarTagContainer}*/}
                {/*                        onPress={() => {*/}
                {/*                            navigateToGrammarDetailScreen(grammar);*/}
                {/*                        }}*/}
                {/*                    >*/}
                {/*                        <View style={{width: 12}}/>*/}
                {/*                        <Text size={18}>{index + 1}. </Text>*/}
                {/*                        <Text size={18}>{grammar.title}</Text>*/}
                {/*                    </TouchableOpacity>*/}
                {/*                ))*/}
                {/*        ) : (*/}
                {/*            <Text>No grammar items available</Text>*/}
                {/*        )}*/}
                {/*    </View>*/}
                {/*</Layout>*/}
            </ScrollView>
        </SafeAreaView>
    )
}

export default ListStoryScreen;