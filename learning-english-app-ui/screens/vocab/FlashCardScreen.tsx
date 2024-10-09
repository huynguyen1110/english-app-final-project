import {
    Dimensions,
    FlatList,
    Image,
    LogBox,
    Modal,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View
} from "react-native";
import {GlobalStyles} from "../../styles/GlobalStyles";
import {Block, Text} from "galio-framework";
import React from "react";
import {useNavigation, useRoute} from "@react-navigation/native";
// @ts-ignore
import FlipCard from 'react-native-flip-card';
// @ts-ignore
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
// @ts-ignore
import AntDesign from "react-native-vector-icons/AntDesign";
// @ts-ignore
import Entypo from "react-native-vector-icons/Entypo";
// @ts-ignore
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
// @ts-ignore
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {themeAppColor} from "../../utils/constant";

const FlashCardScreen = () => {

    LogBox.ignoreAllLogs();

    const {width, height} = Dimensions.get('window');

    const navigation = useNavigation();

    const router = useRoute();

    const wordsDataParams: any = router?.params;

    const [isCardFliped, setIsCardFliped] = React.useState(false);

    const [wordsData, setWordsData] = React.useState<any []>([]);

    const [isPlaying, setIsPlaying] = React.useState(false);

    const [modalVisible, setModalVisible] = React.useState(false);

    const flatListRef = React.useRef<FlatList>(null); // Tham chiếu đến FlatList

    const [currentIndex, setCurrentIndex] = React.useState(0); // Vị trí hiện tại

    const intervalRef = React.useRef<any>(null); // Tham chiếu đến interval

    const backButton = () => {
        navigation.goBack();
    }

    const FlipCardItem = ({item}: { item: any }) => {
        return (
            <FlipCard
                style={styles.cardContainer}
                friction={6}
                perspective={1000}
                flipHorizontal={true}
                flipVertical={false}
                flip={isCardFliped}
                clickable={true}
                onFlipEnd={(isFlipEnd: any) => {
                    console.log('isFlipEnd', isFlipEnd);
                }}
            >
                {/* Face Side */}
                <View style={styles.cardFaceContentContainer}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <TouchableOpacity style={{padding: 4}}>
                            <FontAwesome size={20} name="volume-up" style={{opacity: 0.5}}/>
                        </TouchableOpacity>
                        <View style={{width: 6}}/>
                        <View>
                            <View style={{width: 6}}/>
                            <Text style={{fontSize: 20, fontWeight: 'bold', color: themeAppColor}}>{item.name}</Text>
                        </View>
                    </View>

                    <View style={{padding: 4}}>
                        <Text>{item.wordType}</Text>
                        <Block height={8}></Block>
                        {item.image ? (
                            <Image source={{uri: item.image}} style={styles.image}/>
                        ) : null}
                        <Block height={12}></Block>
                        <Text>{item.example}</Text>
                    </View>
                </View>

                {/* Back Side */}
                <View style={styles.cardBackContentContainer}>
                    <Text style={{fontSize: 20, fontWeight: 'bold', color: 'black'}}>{item.meaning}</Text>
                </View>
            </FlipCard>
        );
    };

    const shuffleAndSetWords = () => {
        const shuffledWords = [...wordsData];
        for (let i = shuffledWords.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledWords[i], shuffledWords[j]] = [shuffledWords[j], shuffledWords[i]];
        }
        setWordsData(shuffledWords);
    };

    const handleScroll = (event: any) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x; // Lấy giá trị cuộn hiện tại
        const index = Math.floor(contentOffsetX / width); // Tính toán chỉ số hiện tại
        setCurrentIndex(index);
    };

    // Hàm tự động cuộn
    const startAutoScroll = () => {
            if (!intervalRef.current) {
                intervalRef.current = setInterval(() => {
                    setCurrentIndex((prevIndex) => {
                            const newIndex = prevIndex + 1;

                            // Kiểm tra xem newIndex có nằm trong phạm vi không
                            if (newIndex < wordsData.length) {

                                if (!isCardFliped) {
                                    setTimeout(() => {
                                        setIsCardFliped(true);
                                    }, 2000)

                                    setTimeout(() => {
                                        setIsCardFliped(false);
                                        flatListRef.current?.scrollToIndex({index: newIndex, animated: true});
                                    }, 3000); // Đợi 2 giây trước khi cuộn
                                } else {
                                    setTimeout(() => {
                                        setIsCardFliped(false);
                                    }, 2000)

                                    setTimeout(() => {
                                        setIsCardFliped(true);
                                        flatListRef.current?.scrollToIndex({index: newIndex, animated: true});
                                    }, 3000); // Đợi 2 giây trước khi cuộn
                                }

                                return newIndex;
                            } else {
                                clearInterval(intervalRef.current);
                                intervalRef.current = null;
                                return prevIndex; // Giữ nguyên index hiện tại
                            }
                        }
                    )
                    ;
                }, 2000); // Tốc độ cuộn (2000ms = 2s)
            }
        }
    ;

    // Hàm dừng cuộn
    const stopAutoScroll = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    // Hàm khi nhấn nút Play/Pause
    const togglePlay = () => {
        if (isPlaying) {
            stopAutoScroll();
        } else {
            startAutoScroll();
        }
        setIsPlaying(!isPlaying);
    };


    React.useEffect(() => {
        if (wordsDataParams && wordsData.length == 0) {
            // @ts-ignore
            setWordsData(Object.values(wordsDataParams)[0]);
        }
    }, [router, wordsData])

    return (
        <SafeAreaView style={GlobalStyles.AndroidSafeArea}>
            <StatusBar hidden={true}/>
            {/* header section*/}
            <View>
                <Block style={GlobalStyles.main_container} flexDirection="row" justifyContent="space-between">
                    <TouchableOpacity onPress={backButton}>
                        <Text size={18}> <SimpleLineIcons name="arrow-left" size={18}/> </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        setModalVisible(true);
                    }}>
                        <Text size={18}> <SimpleLineIcons name="settings" size={18}/> </Text>
                    </TouchableOpacity>
                </Block>
                <Block height={12}></Block>
                <Block style={GlobalStyles.under_line}></Block>
            </View>
            {/* header section*/}

            <View style={{flex: 1}}>
                <Block height={40}></Block>

                <FlatList
                    ref={flatListRef}
                    data={wordsData}
                    renderItem={({item}) => (
                        <View style={{
                            width: width,
                            height: height,
                            backgroundColor: 'white',

                        }}>
                            <Block width={width} height={600}>
                                <FlipCardItem item={item}/>
                            </Block>
                        </View>
                    )}
                    keyExtractor={(item: any) => item?.wordId?.toString()}
                    horizontal={true}
                    pagingEnabled={true}
                    showsHorizontalScrollIndicator={false}
                    onScrollToIndexFailed={() => setCurrentIndex(0)}
                    onScroll={handleScroll} // Lắng nghe sự kiện cuộn
                    scrollEventThrottle={16} // Để lắng nghe sự kiện cuộn thường xuyên
                />

                <Block height={40}></Block>

                <Block flexDirection="row" justifyContent="center" alignItems="center">
                    <TouchableOpacity onPress={togglePlay} style={styles.playButton}>
                        <AntDesign
                            name={isPlaying ? "pausecircleo" : "playcircleo"}
                            size={50}
                            color={themeAppColor}
                        />
                    </TouchableOpacity>
                </Block>

                <Block height={20}></Block>
            </View>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <TouchableOpacity
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)' // Màu nền mờ
                    }}
                    activeOpacity={1}
                    onPressOut={() => setModalVisible(false)}
                >
                    <View style={styles.modalView}>
                        <Block flexDirection="row" width={300} height={120} justifyContent="space-around"
                               alignItems="center">
                            <TouchableOpacity style={styles.iconBtn} onPress={shuffleAndSetWords}>
                                <Entypo size={40} name="shuffle"/>
                                <Text>Shuffle</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconBtn} onPress={() => {
                                setIsCardFliped(!isCardFliped)
                            }}>
                                <MaterialCommunityIcons size={41} name="credit-card-sync"/>
                                <Text>Flip card</Text>
                            </TouchableOpacity>
                        </Block>
                    </View>
                </TouchableOpacity>
            </Modal>
        </SafeAreaView>
    )
}

export default FlashCardScreen;

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: 'white',
        width: "90%",
        marginLeft: "auto",
        marginRight: "auto",
        // Đổ bóng cho Android
        elevation: 5,
        // Có thể thêm marginTop để tạo cảm giác bóng chỉ ở các phía khác
        margin: 5,

        // Đổ bóng cho iOS
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 5},  // Chỉ tạo bóng ở phía dưới và hai bên
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        // Bo góc nếu cần
        borderRadius: 10,
    },
    cardFaceContentContainer: {
        width: "80%",
        height: 150,
        backgroundColor: 'white',
        margin: "auto",
        justifyContent: "center",
    },
    cardBackContentContainer: {
        height: "95%",
        width: "95%",
        justifyContent: "center",
        alignItems: 'center',
        margin: "auto"
    },
    playButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
        height: 60,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        height: 200,
        width: 350
    },
    iconBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 6
    },
    image: {
        width: "100%",
        height: 150,
        resizeMode: "stretch",
        borderRadius: 10, // Đặt borderRadius = nửa chiều rộng hoặc chiều cao để bo tròn
        shadowColor: "#000", // Màu bóng đổ (iOS)
        shadowOffset: {width: 0, height: 2}, // Đổ bóng ngang và dọc (iOS)
        shadowOpacity: 0.2, // Độ mờ của bóng (iOS)
        shadowRadius: 2.62, // Bán kính của bóng đổ (iOS)
        elevation: 4, // Đổ bóng (Android)
    },
});