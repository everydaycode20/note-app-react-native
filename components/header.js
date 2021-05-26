import React, {useState, useEffect, useContext, useRef} from 'react';
import { StyleSheet, Text, View, TouchableWithoutFeedback, StatusBar, Image, Animated } from 'react-native';
import {Context} from "./utils/context";
import {StoreData} from "./utils/async-storage";
import { Easing, not } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';

function Header({del, setDel, noteId, setNoteId, setDeleteMode}) {
    
    const {saveNote, setSaveNote} = useContext(Context);

    const [delNote, setDelNote] = useState(false);

    const fadeAnim = useRef(new Animated.Value(0)).current;

    const navigation = useNavigation();

    const fadeIn = () => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
            easing: Easing.in(),
        }).start();
    }

    const fadeOut = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
            easing: Easing.out(Easing.exp),
        }).start();
    }

    useEffect(() => {
        
        if (del === true) {
            fadeIn();
        }
        
    }, [del]);

    function close() {
        fadeOut();
        
        setTimeout(() => {
            setDel(false);
        }, 200);
            
        setDeleteMode(false);
        setNoteId([]);
        setSaveNote(prev => {
            let obj = prev;

            obj.map(o => {
                o.isSelected = false;
            })
            return [...prev];
        });
    }

    function deleteNote() {
        fadeOut();
        setSaveNote(saveNote.filter((note, i) => {
            
            if (!noteId.includes(note.id)) {
                return note;
            }
        }));
        setDelNote(Date.now());
        setDel(false);
        setNoteId([]);
        setDeleteMode(false);
    }

    function openSettings() {
        navigation.navigate("settings");
    }

    useEffect(() => {
        delNote !== false && StoreData(JSON.stringify(saveNote));
    }, [delNote]);

    return (
        <View>
            {del === true ?<Animated.View style={[styles.header, {opacity: fadeAnim}]}>
                <StatusBar style="auto"/>
                <View style={styles.container}>
                    <TouchableWithoutFeedback onPress={() => close()}>
                        <Image style={styles.close} source={require("../assets/close_black.png")}/> 
                    </TouchableWithoutFeedback>
                    <Text style={{fontSize: 20}} onPress={() => deleteNote()}>Delete</Text>
                </View>
            </Animated.View>  : 
            <View style={styles.container}>
                <Animated.View style={[styles.header, {flexDirection: 'row', justifyContent: 'flex-end', width: "100%"}]} >
                    <StatusBar style="auto"/>
                    <TouchableWithoutFeedback onPress={() => openSettings()} >
                        <Image style={styles.settings} source={require("../assets/settings_black.png")}/> 
                    </TouchableWithoutFeedback>
                </Animated.View>
            </View>}
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        marginTop: StatusBar.currentHeight,
    },
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignContent: "center",
        alignItems: "center",
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
    },
    close: {
        width: 30,
        height: 30,
    },
    settings: {
        width: 30,
        height: 30,
    }
});

export default Header;