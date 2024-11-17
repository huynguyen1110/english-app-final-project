import {SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View} from "react-native";
import {GlobalStyles} from "../../../styles/GlobalStyles";
import React, {useEffect, useState} from "react";
import {getIsReadStoryService, getStoriesService} from "../../../services/StoryService";
import {decodeJwtToken, getJwtToken} from "../../../services/AuthenticationService";
import {Text} from "galio-framework";
import {useNavigation} from "@react-navigation/native";

const ListIsReadStory = () => {

    const navigation = useNavigation();

    const [isReadStories, setIsReadStories] = useState<any []>([]);

    const fetchGetIsReadStories = async () => {
        try {
            const token = await getJwtToken();
            const decodedToken = decodeJwtToken(token);

            const userEmail: any = decodedToken?.sub;
            const {data}  = await getIsReadStoryService("huy696981@gmail.com");
            setIsReadStories(data);
        } catch (e) {
            console.log(e);
        }
    }

    const navigateToGrammarDetailScreen = (storyData: any) => {
        // @ts-ignore
        navigation.navigate("StoryDetailScreen", {storyData: storyData})
    }

    useEffect(() => {
        fetchGetIsReadStories();
    }, [])

    return (
        <SafeAreaView style={GlobalStyles.AndroidSafeArea}>
            <ScrollView style={GlobalStyles.main_container}>
                <View style={[{flex: 1}]}>
                    {Array.isArray(isReadStories) && isReadStories.length > 0 ? (
                        isReadStories
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

export default ListIsReadStory;

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