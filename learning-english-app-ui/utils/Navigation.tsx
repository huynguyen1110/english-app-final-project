import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {NavigationContainer} from "@react-navigation/native";
import RegisterScreen from "../screens/authentication/RegisterScreen";
import LoginScreen from "../screens/authentication/LoginScreen";
import WellcomeScreen from "../screens/authentication/WellcomeScreen";
import HomeScreen from "../screens/home/HomeScreen";
import NewsScreen from "../screens/home/news/NewsScreen";
import ByTopicsScreen from "../screens/home/news/ByTopicsScreen";
import ByNewsWebSiteScreen from "../screens/home/news/ByNewsWebSiteScreen";
import NewsDetailScreen from "../screens/home/news/NewsDetailScreen";
import SaveNewWordScreen from "../screens/home/news/SaveNewWordScreen";


const Stack = createNativeStackNavigator();

const Navigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName='NewsScreen'
                screenOptions={{
                    headerShown: false,
                    gestureEnabled: true
            }}>
                <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
                <Stack.Screen name="LoginScreen" component={LoginScreen} />
                <Stack.Screen name="WellcomeScreen" component={WellcomeScreen} />
                <Stack.Screen name="HomeScreen" component={HomeScreen} />
                <Stack.Screen name="NewsScreen" component={NewsScreen} />
                <Stack.Screen name="ByTopicsScreen" component={ByTopicsScreen} />
                <Stack.Screen name="ByNewsWebSiteScreen" component={ByNewsWebSiteScreen} />
                <Stack.Screen name="NewsDetailScreen" component={NewsDetailScreen} />
                <Stack.Screen name="SaveNewWordScreen" component={SaveNewWordScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default Navigation;
