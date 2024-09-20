import {ScrollView, StyleSheet, View} from "react-native";
import {Avatar, IndexPath, Layout, Select, SelectItem, Text} from "@ui-kitten/components";
import React, {useEffect} from "react";
import {Block} from "galio-framework";
import {GlobalStyles} from "../../styles/GlobalStyles";

const PackageListComponent = () => {

    const [selectedIndex, setSelectedIndex] = React.useState<IndexPath | IndexPath[]>(new IndexPath(0));

    const options = {
        'Newest': 'NEWEST',
        'Oldest': 'OLDEST',
        'Name: A to Z': 'A_TO_Z',
        'Name: Z to A': 'Z_TO_A'
    };

    return (
        <ScrollView style={{height: 670}}>
            <Select
                style={[styles.sellectBox]}
                selectedIndex={selectedIndex}
                onSelect={index => setSelectedIndex(index)}
                // @ts-ignore
                value={Object.keys(options)[selectedIndex?.row]}
            >
                <SelectItem title='Newest'/>
                <SelectItem title='Oldest'/>
                <SelectItem title='Name: A to Z'/>
                <SelectItem title='Name: Z to A'/>
            </Select>

            <Block>
                <Text category='h6'>11-10-2002</Text>

                <Block height={8}></Block>
                <Layout level='1' style={[ styles.packageItemContainer ]}>
                    <Block style={[ GlobalStyles.main_container ]}>
                        <Block height={6}></Block>
                        <Text category='h6'>Package name</Text>
                        <Block height={6}></Block>
                        <Text category='s1' appearance='hint'>2 terms</Text>

                        <Block height={14}></Block>
                        <Block row alignItems='center'>
                            <Avatar size='small' source={require('../../assets/imgs/background-wellcome-image-background.jpeg')} />
                            <Block width={6}></Block>
                            <Text category='s2'>Huy6969</Text>
                        </Block>
                    </Block>
                </Layout>
                <Block height={8}></Block>
            </Block>

            <Block>
                <Text category='h6'>11-10-2002</Text>

                <Block height={8}></Block>
                <Layout level='1' style={[ styles.packageItemContainer ]}>
                    <Block style={[ GlobalStyles.main_container ]}>
                        <Block height={6}></Block>
                        <Text category='h6'>Package name</Text>
                        <Block height={6}></Block>
                        <Text category='s1' appearance='hint'>2 terms</Text>

                        <Block height={14}></Block>
                        <Block row alignItems='center'>
                            <Avatar size='small' source={require('../../assets/imgs/background-wellcome-image-background.jpeg')} />
                            <Block width={6}></Block>
                            <Text category='s2'>Huy6969</Text>
                        </Block>
                    </Block>
                </Layout>
                <Block height={8}></Block>
            </Block>

            <Block>
                <Text category='h6'>11-10-2002</Text>

                <Block height={8}></Block>
                <Layout level='1' style={[ styles.packageItemContainer ]}>
                    <Block style={[ GlobalStyles.main_container ]}>
                        <Block height={6}></Block>
                        <Text category='h6'>Package name</Text>
                        <Block height={6}></Block>
                        <Text category='s1' appearance='hint'>2 terms</Text>

                        <Block height={14}></Block>
                        <Block row alignItems='center'>
                            <Avatar size='small' source={require('../../assets/imgs/background-wellcome-image-background.jpeg')} />
                            <Block width={6}></Block>
                            <Text category='s2'>Huy6969</Text>
                        </Block>
                    </Block>
                </Layout>
                <Block height={8}></Block>
            </Block>

            <Block>
                <Text category='h6'>11-10-2002</Text>

                <Block height={8}></Block>
                <Layout level='1' style={[ styles.packageItemContainer ]}>
                    <Block style={[ GlobalStyles.main_container ]}>
                        <Block height={6}></Block>
                        <Text category='h6'>Package name</Text>
                        <Block height={6}></Block>
                        <Text category='s1' appearance='hint'>2 terms</Text>

                        <Block height={14}></Block>
                        <Block row alignItems='center'>
                            <Avatar size='small' source={require('../../assets/imgs/background-wellcome-image-background.jpeg')} />
                            <Block width={6}></Block>
                            <Text category='s2'>Huy6969</Text>
                        </Block>
                    </Block>
                </Layout>
                <Block height={8}></Block>
            </Block>

            <Block>
                <Text category='h6'>11-10-2002</Text>

                <Block height={8}></Block>
                <Layout level='1' style={[ styles.packageItemContainer ]}>
                    <Block style={[ GlobalStyles.main_container ]}>
                        <Block height={6}></Block>
                        <Text category='h6'>Package name</Text>
                        <Block height={6}></Block>
                        <Text category='s1' appearance='hint'>2 terms</Text>

                        <Block height={14}></Block>
                        <Block row alignItems='center'>
                            <Avatar size='small' source={require('../../assets/imgs/background-wellcome-image-background.jpeg')} />
                            <Block width={6}></Block>
                            <Text category='s2'>Huy6969</Text>
                        </Block>
                    </Block>
                </Layout>
                <Block height={8}></Block>
            </Block>
        </ScrollView>
    );
}

export default PackageListComponent;

const styles = StyleSheet.create({
    container: {
        minHeight: 128,
    },
    sellectBox: {
        width: '45%',
    },
    packageItemContainer: {
        borderWidth: 2,
        borderColor: '#cdb4b4',
        borderRadius: 10,
        width: "95%",
        height: 120,
        marginRight: "auto",
        marginLeft: "auto",
    }
});