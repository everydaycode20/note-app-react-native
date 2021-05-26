import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import AddBtn from "./add-btn";
import { StyleSheet, SafeAreaView } from 'react-native';
import NoteList from "./note-list";
import Header from "./header";

function Main() {

    const [del, setDel] = useState(false);

    const [noteId, setNoteId] = useState([]);

    const [deleteMode, setDeleteMode] = useState(false);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="auto"/>
            <Header del={del} setDel={setDel} noteId={noteId}  setNoteId={setNoteId} setDeleteMode={setDeleteMode}/>
            <NoteList setDel={setDel} setNoteId={setNoteId} noteId={noteId} deleteMode={deleteMode} setDeleteMode={setDeleteMode}/>
            <AddBtn/>
        </SafeAreaView  >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
});

export default Main;