import React, {useState, useContext, useEffect} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TouchableWithoutFeedback, Image, TextInput, StatusBar, ScrollView, FlatList, TouchableNativeFeedback } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { Camera } from 'expo-camera';

import {Context} from "./utils/context";
import {NoteContext} from "./utils/change-note_context";
import {FontSizeContext} from "./utils/font-size_context";

import {StoreData} from "./utils/async-storage";
import GetDate from "./utils/get-date"

import { Ionicons, MaterialIcons } from '@expo/vector-icons'; 

function ImageList({images, showMenu, imageId, showImage, deleteImage}) {
        
    const Item = ({item, index}) => (
        
        <View style={{marginLeft: 10, marginRight: 10}}>
            <TouchableWithoutFeedback onPress={() => showMenu(index)}>
                <Image style={{width: 300, height: 400, borderRadius: 15,  backgroundColor: "black", justifyContent: "center"}} source={{uri: item}}/>
            </TouchableWithoutFeedback>
            {imageId === index && <View style={{position: "absolute", backgroundColor: "red", flexDirection: "row", bottom: "50%", right: "40%", padding: 2, borderRadius: 4}}>
                <TouchableWithoutFeedback onPress={() => deleteImage(index)}>
                    <MaterialIcons style={{marginRight: 5}} name="delete" size={32} color="white" />
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => showImage(item)}>
                    <MaterialIcons style={{marginLeft: 5}} name="image" size={32} color="white" />
                </TouchableWithoutFeedback>
            </View>}
        </View>
    );
    
    const renderItem = ({item, index}) => (
        <Item item={item} index={index}/>
    );
    
    return (
        <FlatList showsHorizontalScrollIndicator={false} data={images} horizontal={true} renderItem={renderItem} keyExtractor={(item, index) => {return index.toString()}} />
    );
}

function ModalComp({route}) {

    const [hasPermission, setHasPermission] = useState(null);

    const [showCamera, setShowCamera] = useState(null);

    const {changeFontSize, setChangeFontSize} = useContext(FontSizeContext);
    
    const {saveNote, setSaveNote} = useContext(Context);

    const [fontSize, setFontSize] = useState(0);

    const {modifyNote, setModifyNote} = useContext(NoteContext);

    const [note, setNote] = useState("");

    const [color, setColor] = useState("");

    const navigation = useNavigation();

    const [images, setImages] = useState([]);

    const [menu, setMenu] = useState(false);

    const [imageId, setImageId] = useState(null);

    const [imagesSource, setImagesSource] = useState(null);

    const [makeChange, setMakeChange] = useState(null);

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

        if (route.params !== undefined) {
            setImagesSource("route");
            setImages(prev => [...prev, route.params.image.uri]);
        }
        else if(modifyNote.length !== 0){
            setImages( modifyNote.images);
            setImagesSource("modify");
            setMakeChange(true);
        }

    }, [saveNote, route.params, modifyNote]);

    useEffect(() => {
        
        setColor(modifyNote.color);
    }, []);

    function addNote() {
        
        if (makeChange) {
            
            let oldNote;
            if (note === "") oldNote = modifyNote.value;

            let d = GetDate();
            setSaveNote(prev => {   //https://dev.to/dev_for/best-ways-to-update-state-array-object-using-react-hooks-3m8i
                let obj = prev.find(o => o.id === modifyNote.id)
                if (obj !== undefined) {
                    obj.color = color;
                    obj.date = `${d}`;
                    obj.value = note || oldNote;
                    obj.images = images;
                }
                return [...prev];
            });
            
            setModifyNote([]);
            
            navigation.goBack();
        }
        else{
            
            let image;
            if (route.params === undefined) {
                image = "";
            }

            if (color === "" || color === undefined) {
                let d = GetDate();
                
                const data = {id: (Math.random() * 100000000).toString(), color: "#DCDCDC", value: note, date: `${d}`, isSelected: false, images: images};
                setSaveNote(elm => [...elm, data]);
            }
            else{
                console.log("new note");
                let d = GetDate();
                
                const data = {id: (Math.random() * 100000000).toString(), color: color, value: note, date: `${d}`, isSelected: false, images: images};
                setSaveNote(elm => [...elm, data]);
            }
            navigation.goBack();
        }
    }

    function back() {
        setModifyNote([]);
        navigation.goBack();
    }

    async function cameraPermission() {
        const {status} = await Camera.requestPermissionsAsync();
        return status;
    }

    function openCamera() {

        cameraPermission().then(status => {
            
            if (status === "granted") {
                setHasPermission(status === "granted");
                setShowCamera(true);
                navigation.navigate("camera");
            }
            else{
                setHasPermission(false);
                setShowCamera(false);
            }
        });
    }

    function showMenu(index) {
        
        setImageId(index);
        setMenu(true);

        if (menu) {
            setMenu(false);
            setImageId(null);
        }
    }

    function deleteImage(id) {
        
        let imagesArr = images;
        let newArr = imagesArr.filter((image, index) => index !== id);
        setImages(newArr);
        setImageId(null);
        setMakeChange(true);
    }

    function showImage(image) {
        
        navigation.navigate({name: "selected-image", params: {image}, merge: true})
    }

    function writeNote(note) {
        if (modifyNote.value !== undefined) {
            setMakeChange(true);
        }

        setNote(note);
    }

    async function pickImage() {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            // allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5
        });

        if (!result.cancelled) {
            setImages(prev => [...prev, result.uri]);
        }
    }

    function recordAudio() {
        
    }

    return (
        <ScrollView showsVerticalScrollIndicator={false} style={styles.main}>
            <StatusBar/>
            <View style={styles.containerArrow}>
                <View style={{alignSelf: "flex-start", justifyContent: "flex-start", flex: 1,}}>
                    <TouchableWithoutFeedback onPress={() => back()}>
                        <Image style={styles.arrowIcon} source={require("../assets/arrow_back_black.png")}/> 
                    </TouchableWithoutFeedback>
                </View>
                <View style={{flexDirection: "row", flex: 2, justifyContent: "space-between",}}>
                    <TouchableWithoutFeedback onPress={() => openCamera()}><Ionicons name="camera-outline" size={29} color="black" /></TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => pickImage()}><Ionicons name="images-outline" size={26} color="black" /></TouchableWithoutFeedback>
                    <TouchableNativeFeedback><MaterialIcons name="multitrack-audio" size={26} color="black" /></TouchableNativeFeedback>
                </View>
                
                {note || makeChange ? <Text style={{fontSize: 20, flex: 1, textAlign: "right"}} onPress={() => addNote()}>Done</Text> : <View style={{flex: 1}}/>}
            </View>
            <View style={styles.colors}>
                <TouchableOpacity onPress={() => setColor("#DCDCDC")}><View style={[styles.colorContainer, {backgroundColor: "#DCDCDC"}]}/></TouchableOpacity>
                <TouchableOpacity onPress={() => setColor("#FF9E9E")}><View style={[styles.colorContainer, {backgroundColor: "#FF9E9E"}]}/></TouchableOpacity>
                <TouchableOpacity onPress={() => setColor("#9CFFC1")}><View style={[styles.colorContainer, {backgroundColor: "#9CFFC1"}]}/></TouchableOpacity>
                <TouchableOpacity onPress={() => setColor("#F9E39C")}><View style={[styles.colorContainer, {backgroundColor: "#F9E39C"}]}/></TouchableOpacity>
                <TouchableOpacity onPress={() => setColor("#6DFFE6")}><View style={[styles.colorContainer, {backgroundColor: "#6DFFE6"}]}/></TouchableOpacity>
                <TouchableOpacity onPress={() => setColor("#FF8EFB")}><View style={[styles.colorContainer, {backgroundColor: "#FF8EFB"}]}/></TouchableOpacity>
            </View>
            {/* <View style={{}}>
                <Image style={{width: 100, height: 20}} source={require("../assets/audiowave.gif")}/>
            </View> */}
            <View style={{ alignItems: "center"}}>
                {imagesSource === "modify" ? 
                    <ImageList images={images} showImage={showMenu} imageId={imageId} showImage={showImage} deleteImage={deleteImage} showMenu={showMenu}/>
                    : 
                    <ImageList images={images} showImage={showMenu} imageId={imageId} showImage={showImage} deleteImage={deleteImage} showMenu={showMenu}/>
                } 
            </View>
            <TextInput multiline={true} style={[styles.input, {fontSize: fontSize}]} placeholder="write something..." defaultValue={modifyNote.value} onChangeText={note => writeNote(note)}/>
        </ScrollView>
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