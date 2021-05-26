import AsyncStorage from '@react-native-async-storage/async-storage';

export const StoreData = async (value) => {
    try {
        await AsyncStorage.setItem('@new', value, () => {
            console.log("done");
        });
    } catch (e) {
        console.log(e);
    }
}

export const GetData = async () => {
    try {
        const value = await AsyncStorage.getItem('@new');
        if(value !== null) {
            return value;
        }
        else{
            return false;
        }
    } catch(e) {
        console.log(e);
    }
}

export const SaveFontSize = async (value) => {
    try {
        await AsyncStorage.setItem('@fontsize', value, () => {
            console.log("done");
        });
    } catch (e) {
        console.log(e);
    }
}

export const GetFontSize = async () => {
    try {
        const value = await AsyncStorage.getItem('@fontsize');
        if(value !== null) {
            return value;
        }
        else{
            return false;
        }
    } catch(e) {
        console.log(e);
    }
}