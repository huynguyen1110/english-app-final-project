import {Image, TouchableOpacity} from "react-native";
import {Block, Text} from "galio-framework";
import {GlobalStyles} from "../../styles/GlobalStyles";
import {useSelector} from "react-redux";
import {RootState} from "../../utils/Store";

const NewsContentComponent = () => {

    const newsData = useSelector((state: RootState) => state.newsReducer.newsData);

    const renderTextWithClickableWords = (text: string) => {
        return text.split(" ").map((word, index) => (
            <TouchableOpacity key={index} onPress={() => handleWordPress(word)}>
                <Text>{word} </Text>
            </TouchableOpacity>
        ));
    };

    const handleWordPress = (word: string) => {
        // setModalVisible(true);
    };

    console.log(newsData)

    return (
      <view>
          {/*<Block style={GlobalStyles.main_container}>*/}
          {/*    <Block height={4}></Block>*/}
          {/*    <Text >*/}
          {/*        {renderTextWithClickableWords(newsData.title)}*/}
          {/*    </Text>*/}
          {/*    <Block height={4}></Block>*/}

          {/*    {newsData.imageUrl && newsData.imageUrl !== '' && (*/}
          {/*        <Image source={{uri: newsData.imageUrl}}/>*/}
          {/*    )}*/}

          {/*    <Text>*/}
          {/*        {renderTextWithClickableWords(newsData.content)}*/}
          {/*    </Text>*/}
          {/*</Block>*/}
      </view>
    );
}

export default NewsContentComponent;
