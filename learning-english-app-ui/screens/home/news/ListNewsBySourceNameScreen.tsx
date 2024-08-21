import {SafeAreaView} from "react-native";
import {GlobalStyles} from "../../../styles/GlobalStyles";
import { Text } from "galio-framework"
import {useRoute} from "@react-navigation/native";
import {useEffect} from "react";

const ListNewsBySourceNameScreen = () => {

    const route = useRoute();

    useEffect(() => {
        // @ts-ignore
        console.log(route.params.sourceName);
    }, []);

    return (
      <SafeAreaView style={GlobalStyles.AndroidSafeArea}>
          <Text>Hello</Text>
      </SafeAreaView>
    );
}

export default ListNewsBySourceNameScreen;
