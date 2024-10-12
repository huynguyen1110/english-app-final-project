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
import ListNewsBySourceNameScreen from "../screens/home/news/ListNewsBySourceNameScreen";
import VocabMainScreen from "../screens/vocab/VocabMainScreen";
import ListWordsScreen from "../screens/vocab/ListWordsScreen";
import CreateNewVocabPackScreen from "../screens/vocab/CreateNewVocabPackScreen";
import FlashCardScreen from "../screens/vocab/FlashCardScreen";
import TestOptionScreen from "../screens/vocab/TestOptionScreen";
import TestScreen from "../screens/vocab/TestScreen";


const Stack = createNativeStackNavigator();

const Navigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName='VocabMainScreen'
                screenOptions={{
                    headerShown: false,
                    gestureEnabled: true,
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
                <Stack.Screen name="ListNewsBySourceNameScreen" component={ListNewsBySourceNameScreen} />
                {/* vocab screens */}
                <Stack.Screen name="VocabMainScreen" component={VocabMainScreen} />
                <Stack.Screen name="ListWordsScreen" component={ListWordsScreen} />
                <Stack.Screen name="CreateNewVocabPackScreen" component={CreateNewVocabPackScreen} />
                <Stack.Screen name="FlashCardScreen" component={FlashCardScreen} />
                <Stack.Screen name="TestOptionScreen" component={TestOptionScreen} options={{ animation: "slide_from_right" }} />
                <Stack.Screen name="TestScreen" component={TestScreen} options={{ animation: "slide_from_right" }} />
                {/* vocab screens */}

            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default Navigation;
