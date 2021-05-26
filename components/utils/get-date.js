import { NativeModules } from 'react-native'
import 'intl';
import 'intl/locale-data/jsonp/en';
import 'intl/locale-data/jsonp/es';

function GetDate() {
    let locale = NativeModules.I18nManager.localeIdentifier;
    let newLocale = locale.replace("_", "-");
    
    let date = new Date();

    const options = { year: 'numeric', month: 'long', day: 'numeric' };

    let newDate = new Intl.DateTimeFormat(newLocale, options).format(date);
    
    return newDate;
}

export default GetDate;