import React, {useState, useEffect, useContext} from 'react';
import { StyleSheet, Text, View, TouchableWithoutFeedback, Modal, BackHandler, StatusBar, Image, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {FontSizeContext} from "./utils/font-size_context";
import {SaveFontSize} from "./utils/async-storage";

function Settings() {
    
    const {changeFontSize, setChangeFontSize} = useContext(FontSizeContext);

    const fontSizeObj = [{id: 1, type: "Small"}, {id: 2, type: "Medium"}, {id: 3, type: "Large"}];

    const navigation = useNavigation();

    function back() {
        
        navigation.goBack();
    }

    function changeFontSizeFn(id) {
        setChangeFontSize(id);
        SaveFontSize(JSON.stringify({fontSize: id}));
    }

    return (
        <View style={styles.container}>
            <StatusBar/>
            <View style={styles.containerArrow}>
                <TouchableWithoutFeedback onPress={() => back()}>
                    <Image style={styles.arrowIcon} source={require("../assets/arrow_back_black.png")}/> 
                </TouchableWithoutFeedback>
            </View>
            <View style={{width: "80%", alignItems: "center"}}>
                <Text style={{fontSize: 30, alignSelf: "flex-start", marginBottom: 10,}}>settings</Text>
                <View style={styles.fontSizeMain}>
                    <Text style={{fontSize: 22, marginBottom: 10}}>font size</Text>
                    <View style={styles.fontSizeContainer}>
                        <FlatList keyExtractor={(item, index) => {return index.toString()}} horizontal={true} data={fontSizeObj} renderItem={(renderItem, i) => {
                        return (
                            <TouchableWithoutFeedback key={i} onPress={() => changeFontSizeFn(renderItem.item.id)}>
                                <Text style={[styles.fontSizeBox, {backgroundColor: changeFontSize === renderItem.item.id ? "#cfcfcf" : "transparent"}]}>{renderItem.item.type}</Text>
                            </TouchableWithoutFeedback>
                        )
                        }}/>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: StatusBar.currentHeight,
        flex: 1,
        alignItems: "center",
    },
    containerArrow: {
        flexDirection: "row",
        alignSelf: "flex-start",
        justifyContent: "space-between",
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
    },
    arrowIcon: {
        width: 30,
        height: 30,
    },
    fontSizeMain: {
        width: "100%",
    },
    fontSizeContainer: {
        alignItems: "center",
        width: "100%"
    },
    fontSizeBox: {
        padding: 8,
        fontSize: 18,
        borderRadius: 5,
    }
});

export default Settings;