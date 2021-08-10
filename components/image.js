import React, {useState, useContext, useEffect} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TouchableWithoutFeedback, Image, TextInput, StatusBar, ScrollView, FlatList } from 'react-native';

export default function SelectedImage({route}) {
    

    return (
        <View style={styles.container}>
            <StatusBar style="auto"/>
            <Image style={styles.image} source={{uri: route.params.image}}/>
        </View>
        
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight,
    },
    image: {
        width: "80%",
        height: 400,
    }
});