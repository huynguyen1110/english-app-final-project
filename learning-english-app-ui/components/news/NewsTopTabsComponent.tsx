import ByTopicsScreen from "../../screens/home/news/ByTopicsScreen";
import ByNewsWebSiteScreen from "../../screens/home/news/ByNewsWebSiteScreen";
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";

const Tab = createMaterialTopTabNavigator();

const NewsTopTabsComponent = () => {
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
                component={ByTopicsScreen}
                options={{tabBarLabel: 'BY TOPICS'}}
            />
            <Tab.Screen
                name="ByNewsWebSiteScreen"
                component={ByNewsWebSiteScreen}
                options={{tabBarLabel: 'BY NEWS WEBSITES'}}
            />
        </Tab.Navigator>
    );
}

export default NewsTopTabsComponent;
