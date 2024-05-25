import { StyleSheet, Platform, StatusBar } from "react-native";
import {theme} from "galio-framework";

export const GlobalStyles = StyleSheet.create({
    AndroidSafeArea: {
        flex: 1,
        backgroundColor: "white",
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    main_container: {
        width: "95%",
        marginLeft: "auto",
        marginRight: "auto",
    },
    under_line: {
        borderBottomWidth: 1,
        width: "100%",
        opacity: 0.1,
        shadowColor: '#171717',
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    gray_background: {
        backgroundColor: theme.COLORS?.NAVBAR,
        // backgroundColor: "red",
    }
});
