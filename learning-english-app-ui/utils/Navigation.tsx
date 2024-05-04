import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {NavigationContainer} from "@react-navigation/native";
import RegisterScreen from "../screens/authentication/RegisterScreen";
import LoginScreen from "../screens/authentication/LoginScreen";
import WellcomeScreen from "../screens/authentication/WellcomeScreen";


const Stack = createNativeStackNavigator();

const Navigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName='WellcomeScreen'
                screenOptions={{
                    headerShown: false,
                    gestureEnabled: true
            }}>
                <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
                <Stack.Screen name="LoginScreen" component={LoginScreen} />
                <Stack.Screen name="WellcomeScreen" component={WellcomeScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default Navigation;
