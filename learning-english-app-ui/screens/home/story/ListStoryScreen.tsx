import {RefreshControl, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View} from "react-native";
import {GlobalStyles} from "../../../styles/GlobalStyles";
import {Text} from "galio-framework";
import React, {useEffect} from "react";
import {getStoriesService} from "../../../services/StoryService";
import {useNavigation} from "@react-navigation/native";

const ListStoryScreen = () => {

    const navigation = useNavigation();

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
            setStories(data?.content);
        } catch (e) {
            console.log(e);
        }
    }

    const navigateToGrammarDetailScreen = (storyData: any) => {
        // @ts-ignore
        navigation.navigate("StoryDetailScreen", {storyData: storyData})
    }

    useEffect(() => {
        fetchGetStories();
    }, []);

    return (
        <SafeAreaView style={GlobalStyles.AndroidSafeArea}>
            <ScrollView style={GlobalStyles.main_container}>
                <View style={[{flex: 1}]}>
                    {Array.isArray(stories) && stories.length > 0 ? (
                        stories
                            .map((story, index) => (
                                <TouchableOpacity
                                    key={story.id}
                                    style={styles.storyTagContainer}
                                    onPress={() => {
                                        navigateToGrammarDetailScreen(story);
                                    }}
                                >
                                    <View style={{width: 12}}/>
                                    <Text size={18}>{index + 1}. </Text>
                                    <Text size={18}>{story.vnTitle}</Text>
                                </TouchableOpacity>
                            ))
                    ) : (
                        <Text>No story items available</Text>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default ListStoryScreen;

const styles = StyleSheet.create({
    storyTagContainer: {
        width: "100%",
        height: 45,
        borderRadius: 30,
        borderWidth: 1,
        alignItems: "center",
        marginTop: 16,
        backgroundColor: 'white',
        flexDirection: 'row'
    }
});