/**
 * @format
 */
 import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './app/App';
import {name as appName} from './app.json';
import i18n from "./app/languages/i18n";

AppRegistry.registerComponent(appName, () => App);
