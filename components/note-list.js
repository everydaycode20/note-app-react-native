import React, {useState, useEffect, useContext, useRef} from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableWithoutFeedback, StatusBar, FlatList, Animated, Easing } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {Context} from "./utils/context";
import {NoteContext} from "./utils/change-note_context";
import {GetData} from "./utils/async-storage";
import * as Haptics from 'expo-haptics';

function NoteList({setDel, setNoteId, noteId, setDeleteMode, deleteMode}) {
    
    const {saveNote, setSaveNote} = useContext(Context);

    const {modifyNote, setModifyNote} = useContext(NoteContext);

    const navigation = useNavigation();

    const [newId, setNewId] = useState(0);

    const [anim, setAnim] = useState("");

    const animationVariable = useRef(new Animated.Value(0)).current;
    
    const animStarts = () => {
        Animated.timing(animationVariable, {
            toValue: -0.02,
            useNativeDriver: true,
            duration: 200,
            easing: Easing.out(Easing.exp),
        }).start(() => {
            Animated.timing(animationVariable, {
                toValue: 0,
                useNativeDriver: true,
                duration: 200,
                easing: Easing.in(Easing.circle),
            }).start();
        });
    }

    const trans = {
        scaling(){
            return {
                transform: [{scale: animationVariable.interpolate({inputRange: [0, 1], outputRange: [1,2], })}]
            }
        }
    }

    useEffect(() => {
        GetData().then(res => {
            if (res !== false || res !== undefined) {
                return JSON.parse(res);
            }
            else{
                return false;
            }
        }).then(data => {
            if (data !== false) {
                setSaveNote(data);
            }
            else{
                setSaveNote([]);
            }
        });

    }, []);

    useEffect(() => {
        animStarts();
        
        setSaveNote(prev => {
            let obj = prev.find(o => o.id === newId)
            if (obj !== undefined) {
                
                if (obj.isSelected === false) {
                    obj.isSelected = true;

                    setNoteId(elm => [...elm, newId]);
                }
                else{
                    obj.isSelected = false;

                    let newNote = noteId;
                    newNote.forEach(note => {
                        if (note === newId) {
                            let index = newNote.indexOf(note);
                            newNote.splice(index, 1);
                        }
                    });
                    setNoteId(newNote);
                }
            }
            return [...prev];
        });
    }, [anim])

    function notePressed(id) {
        setDel(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        setDeleteMode(true);
        setNewId(id);
        setAnim(Date.now());
    }

    function getNote(index) {
        navigation.navigate("add");
        saveNote.map(note => {
            if (note.id === index) {
                setModifyNote(note);
            }
        });
    }

    function selectNotes(id) {
        setNewId(id);
        setAnim(Date.now());    
    }

    return (
        <SafeAreaView  style={styles.container}>
            {saveNote.length !== 0 ? <FlatList keyExtractor={(item, index) => {return index.toString()}} showsVerticalScrollIndicator={false} style={{width: "80%"}} data={saveNote} renderItem={(renderItem, i) => {
                let sbs = renderItem.item.value.substring(0,50);
                return (
                    <TouchableWithoutFeedback onLongPress={() => notePressed(renderItem.item.id)} key={renderItem.item.id} onPress={deleteMode ? () => selectNotes(renderItem.item.id) : () => getNote(renderItem.item.id)}>
                        <Animated.View style={[styles.noteContainer, {backgroundColor: renderItem.item.color}, (renderItem.item.isSelected === true || renderItem.item.isSelected === false) && newId == renderItem.item.id ? trans.scaling() : null, renderItem.item.isSelected === true ? styles.borderNote : null]}>
                            <View style={{height: "100%", flexDirection: "column", justifyContent: "space-between"}}>
                                <Text style={styles.text}>{sbs} {sbs.length >= 50 && "..."}</Text>
                                <Text style={{padding: 2, justifyContent: "space-between", opacity: 0.6}}>{renderItem.item.date}</Text>
                            </View>
                            
                        </Animated.View>
                    </TouchableWithoutFeedback>
                )
            }}/> : <Text style={{fontSize: 20}}>there aren't notes here yet</Text>}
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight, 
        marginTop: 30,
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
    },
    noteContainer: {
        borderRadius: 5,
        height: 120,
        padding: 10,
        marginBottom: 10,
        justifyContent: "flex-start",
    },
    scaleNote: {
        transform: [{ scale: 20 }],
        transform: [{ scaleX: 20 }],
    },
    text: {
        fontSize: 20,
        flexShrink: 1,
    },
    shadowNote: {
        elevation: 10,
    },
    borderNote: {
        borderWidth: 1.5,
    }
});

export default NoteList;