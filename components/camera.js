import React, {useState, useRef, useEffect} from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Image, StatusBar, Animated, Easing } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Camera } from 'expo-camera';
import { AntDesign } from '@expo/vector-icons';

export default function Cam() {
    
    const navigation = useNavigation();
    
    const [type, setType] = useState(Camera.Constants.Type.back);

    const [image, setImage] = useState(null);

    const [anim, setAnim] = useState("");

    let camera = Camera;

    async function takePhoto() {
        setAnim(Date.now());
        let photo = await camera.takePictureAsync({quality: 0.5});
        
        setImage(photo);

    }

    const animationVariable = useRef(new Animated.Value(0)).current;

    const animStarts = () => {
        Animated.timing(animationVariable, {
            toValue: -0.08,
            useNativeDriver: true,
            duration: 100,
            easing: Easing.out(Easing.exp),
        }).start(() => {
            Animated.timing(animationVariable, {
                toValue: 0,
                useNativeDriver: true,
                duration: 300,
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
        animStarts();
    }, [anim]);

    return (
        <View style={styles.container}>
            <StatusBar/>
            <View style={styles.containerArrow}>
                <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
                    <Image style={styles.arrowIcon} source={require("../assets/arrow_back_black.png")}/> 
                </TouchableWithoutFeedback>
            </View>
            {!image ? <Camera style={styles.camera} type={type} ref={r => camera = r}>
                {/* <TouchableOpacity
                style={styles.button} onPress={() => {setType(
                type === Camera.Constants.Type.back? Camera.Constants.Type.front: Camera.Constants.Type.back); 
                }}>
                <Text style={styles.text}> Flip </Text>
                </TouchableOpacity> */}
            </Camera> : 
            <View style={{height: 500, marginTop: 20}}>
                <Image style={{width: "100%", height: "100%"}} source={{uri: image.uri}}/>
            </View>}
            <View style={{flex: 1, justifyContent: "center", alignContent: "center", alignItems: "center"}}>
                {!image ? <TouchableWithoutFeedback onPress={() => takePhoto()}>
                    <Animated.View style={[{borderColor: "black", width: 50, height: 50, borderRadius: 50, borderWidth: 4, }, anim !== "" && trans.scaling()]} />
                </TouchableWithoutFeedback> : 
                <View style={{flexDirection: "row", justifyContent: "space-around", width: "100%"}}>
                    <TouchableWithoutFeedback onPress={() => setImage(null)}>
                        <AntDesign name="close" size={28} color="black" />
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => navigation.navigate({name: "add", params: {image}, merge: true})}>
                        <AntDesign name="check" size={28} color="black" />
                    </TouchableWithoutFeedback>
                </View>
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        marginTop: StatusBar.currentHeight
    },
    camera: {
        // flex: 1,
        marginTop: 20,
        height: 500,
    },
    buttonContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        margin: 20,
    },
    button: {
        flex: 0.1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    arrowIcon: {
        width: 30,
        height: 30,
    },
    containerArrow: {
        flexDirection: "row",
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
    },
});