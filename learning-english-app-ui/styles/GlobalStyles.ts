import {StyleSheet, Platform, StatusBar} from "react-native";
import {theme} from "galio-framework";

export const GlobalStyles = StyleSheet.create({
    AndroidSafeArea: {
        flex: 1,
        backgroundColor: "white",
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    centered_view: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    container: {
        flex: 1,
        height: "100%",
    },
    main_container: {
        width: "95%",
        marginLeft: "auto",
        marginRight: "auto",
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
    },
    flex_collum: {
        flexDirection: "column",
    },
    flex_row: {
        flexDirection: "row",
    },
    align_item_center: {
        alignItems: "center"
    },
    justify_content_center: {
        justifyContent: "center"
    },
    justify_content_space_between: {
        justifyContent: "space-between"
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
    },
    icon_button: {
        width: 40,
        height: 40,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    sand_dollar_bg: {
        color: "#726d68",
        backgroundColor: "#DFCFBE",
    },
    rounded_input: {
        width: "100%",
        height: 50,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: "gray",
        padding: 12
    },
    non_rounded_input: {
        width: "100%",
        borderRadius: 5,
        borderColor: "gray",
        borderWidth: 2,
        padding: 12,
        fontSize: 16,
    },
    large_btn: {
        width: "100%",
        height: 40,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "gray"
    }
});
