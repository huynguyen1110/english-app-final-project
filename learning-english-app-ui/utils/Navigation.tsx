import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {NavigationContainer} from "@react-navigation/native";
import RegisterScreen from "../screens/authentication/RegisterScreen";


const Stack = createNativeStackNavigator();

const Navigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName='RegisterScreen'
                screenOptions={{
                    headerShown: false,
                    gestureEnabled: true
            }}>
                <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default Navigation;
