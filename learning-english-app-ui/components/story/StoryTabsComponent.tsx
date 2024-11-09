import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import ByTopicsScreen from "../../screens/home/news/ByTopicsScreen";
import ByNewsWebSiteScreen from "../../screens/home/news/ByNewsWebSiteScreen";
import ListStoryScreen from "../../screens/home/story/ListStoryScreen";
import ListIsReadStory from "../../screens/home/story/ListIsReadStoryScreen";

const Tab = createMaterialTopTabNavigator();

const StoryTabsComponent = () => {
    return (
        <Tab.Navigator
            initialRouteName="Feed"
            screenOptions={{
                tabBarActiveTintColor: '#e91e63',
                tabBarLabelStyle: {fontSize: 14},
                tabBarStyle: {backgroundColor: 'white'},
            }}
        >
            <Tab.Screen
                name="ByTopicsScreen"
                component={ListStoryScreen}
                options={{tabBarLabel: 'Truyện'}}
            />
            <Tab.Screen
                name="ByNewsWebSiteScreen"
                component={ListIsReadStory}
                options={{tabBarLabel: 'Đã đọc'}}
            />
        </Tab.Navigator>
    );
}

export default StoryTabsComponent;