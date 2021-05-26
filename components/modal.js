import React, {useState, useContext, useEffect} from 'react';
import { StyleSheet, Text, View, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, SafeAreaView, Image, TextInput, StatusBar} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {Context} from "./utils/context";
import {NoteContext} from "./utils/change-note_context";
import {FontSizeContext} from "./utils/font-size_context";
import {StoreData} from "./utils/async-storage";
import GetDate from "./utils/get-date"

function ModalComp() {
    
    const {changeFontSize, setChangeFontSize} = useContext(FontSizeContext);
    
    const {saveNote, setSaveNote} = useContext(Context);

    const [fontSize, setFontSize] = useState(0);

    const {modifyNote, setModifyNote} = useContext(NoteContext);

    const [note, setNote] = useState("");

    const [color, setColor] = useState("");

    const navigation = useNavigation();

    useEffect(() => {
        if (changeFontSize === 1) {
            setFontSize(16);
        }
        else if(changeFontSize === 2){
            setFontSize(20);
        }
        else if(changeFontSize === 3){
            setFontSize(26);
        }
        StoreData(JSON.stringify(saveNote));
    }, [saveNote]);

    useEffect(() => {
        setColor(modifyNote.color);
    }, []);

    function addeNote() {
        if (note !== "") {
            if (modifyNote.length !== 0) {
                let d = GetDate();
                setSaveNote(prev => {   //https://dev.to/dev_for/best-ways-to-update-state-array-object-using-react-hooks-3m8i
                    let obj = prev.find(o => o.id === modifyNote.id)
                    if (obj !== undefined) {
                        
                        obj.date = `${d}`;
                        obj.value = note;
                        // obj.color = color;
                        console.log(obj.color);
                    }
                    return [...prev];
                });
                
                setModifyNote([]);
            }
            else{
                if (color === "" || color === undefined) {
                    let d = GetDate();
                    const data = {id: (Math.random() * 100000000).toString(), color: "#DCDCDC", value: note, date: `${d}`, isSelected: false};
                    setSaveNote(elm => [...elm, data]);
                }
                else{
                    let d = GetDate();
                    
                    const data = {id: (Math.random() * 100000000).toString(), color: color, value: note, date: `${d}`, isSelected: false};
                    setSaveNote(elm => [...elm, data]);
                }
            }
            navigation.goBack();
        }
    }

    function back() {
        setModifyNote([]);
        navigation.goBack();
    }

    return (
        <SafeAreaView style={styles.main}>
            <StatusBar/>
            <View style={styles.containerArrow}>
                <TouchableWithoutFeedback onPress={() => back()}>
                    <Image style={styles.arrowIcon} source={require("../assets/arrow_back_black.png")}/> 
                </TouchableWithoutFeedback>
                {note ? <Text style={{fontSize: 20}} onPress={() => addeNote()}>Done</Text> : null}
            </View>
            <View style={styles.colors}>
                <TouchableOpacity onPress={() => setColor("#DCDCDC")}><View style={[styles.colorContainer, {backgroundColor: "#DCDCDC"}]}/></TouchableOpacity>
                <TouchableOpacity onPress={() => setColor("#FF9E9E")}><View style={[styles.colorContainer, {backgroundColor: "#FF9E9E"}]}/></TouchableOpacity>
                <TouchableOpacity onPress={() => setColor("#9CFFC1")}><View style={[styles.colorContainer, {backgroundColor: "#9CFFC1"}]}/></TouchableOpacity>
                <TouchableOpacity onPress={() => setColor("#F9E39C")}><View style={[styles.colorContainer, {backgroundColor: "#F9E39C"}]}/></TouchableOpacity>
                <TouchableOpacity onPress={() => setColor("#6DFFE6")}><View style={[styles.colorContainer, {backgroundColor: "#6DFFE6"}]}/></TouchableOpacity>
                <TouchableOpacity onPress={() => setColor("#FF8EFB")}><View style={[styles.colorContainer, {backgroundColor: "#FF8EFB"}]}/></TouchableOpacity>
            </View>
            <TextInput multiline={true} style={[styles.input, {fontSize: fontSize}]} placeholder="write something..." defaultValue={modifyNote.value} onChangeText={note => setNote(note)}/>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: '#f2f2f2',
        marginTop: StatusBar.currentHeight
    },
    containerArrow: {
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: "space-between",
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
        backgroundColor: "#f2f2f2"
    },
    arrowIcon: {
        width: 30,
        height: 30,
    },
    input: {
        backgroundColor: "#f2f2f2",
        flex: 1,
        textAlignVertical: 'top',
        padding: 20
    },
    colors: {
        flexDirection: "row",
        backgroundColor: "#f2f2f2",
        justifyContent: "center",
        padding: 10,
    },
    colorContainer: {
        width: 50,
        height: 50,
        borderRadius: 100,
        margin: 2.5,
    }
});

export default ModalComp;