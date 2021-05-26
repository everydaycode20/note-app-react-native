import React, {useState, useEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Main from "./components/main";
import ModalComp from "./components/modal";
import Settings from "./components/settings";
import {Context} from "./components/utils/context";
import {NoteContext} from "./components/utils/change-note_context";
import {FontSizeContext} from "./components/utils/font-size_context";
import {GetFontSize} from "./components/utils/async-storage";

export default function App() {

  const Stack = createStackNavigator();
  
  const [saveNote, setSaveNote] = useState([]);

  const [modifyNote, setModifyNote] = useState([]);

  const [changeFontSize, setChangeFontSize] = useState(2);

  useEffect(() => {
    GetFontSize().then(res => {
      if (res !== false || res !== undefined) {
          return JSON.parse(res);
      }
      else{
          return false;
      }
    }).then(data => {
      if (data !== false) {
        setChangeFontSize(data.fontSize);
      }
      else{
        setChangeFontSize(2);
      }
    });

  }, []);

  return (
    <Context.Provider value={{saveNote, setSaveNote}}>
      <NoteContext.Provider value={{modifyNote, setModifyNote}}>
        <FontSizeContext.Provider value={{changeFontSize, setChangeFontSize}}>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{headerShown: false}} >
              <Stack.Screen name="main" component={Main}/>
              <Stack.Screen name="add" component={ModalComp} options={horizontalAnimation}/>
              <Stack.Screen name="settings" component={Settings} options={horizontalAnimation}/>
            </Stack.Navigator>
          </NavigationContainer>
        </FontSizeContext.Provider>
      </NoteContext.Provider>
    </Context.Provider>
  );
}

const horizontalAnimation = {//https://itnext.io/change-react-native-screen-animation-direction-with-react-navigation-8cec0f66f22
  cardStyleInterpolator: ({ current, layouts }) => {
    return {
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0],
            }),
          },
        ],
      },
    };
  },
};
