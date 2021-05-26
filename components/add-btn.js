import React from "react";
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

function AddBtn() {
    const navigation = useNavigation();
    
    return ( 
        <TouchableOpacity style={styles.addBtnStyle} onPress={() => navigation.navigate("add")}>
            <Text style={styles.text}>+</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    addBtnStyle: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        backgroundColor: 'black',
        position: 'absolute',
        right: 20,
        bottom: 40,
    },
    text: {
        color: "white",
        fontSize: 40,
    }
});

export default AddBtn;