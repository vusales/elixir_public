import React from "react";
import { Alert, Dimensions, PixelRatio, Platform } from 'react-native';
import { inject, observer } from 'mobx-react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import LanguageStore from "../stores/languageStore"; 
import config from './config';
// import AsyncStorage from "@react-native-async-storage/async-storage";

export default helper = {
  token: 'aa4bfc0497bf4b8a2802998a32431bc1', 
  lang: ()=> LanguageStore.language ,
  api: (token , headers = {} ) => {
    headers = helper.token
    ? 
    {
      ...headers,
      Token: token ? token : `${helper.token}` , 
      Lang: LanguageStore.language ? LanguageStore.language : "az" ,
    }
    : headers;
    return axios.create({
      baseURL: config.URL_PREFIX + '/index.php?route=api/',
      headers: {
        Accept: 'application/json',
        ...headers,
      },
    });
  },
  mobx: LOC => inject('stores')(observer(LOC)),
  isIOS: Platform.OS === 'ios',
  fontFamily: type => helper.isIOS ? `AvertaPE-${type || 'Regular'}` : `AvertaPE-${type || 'Regular'}`,
  screenOptions: {
    headerShown: false,
    animation: 'slide_from_right',
    // background: 'black',
  },
  px: pixel => {
    const scale = helper.screenWidth / 375;
    const newSize = pixel * scale;
    let result = Math.round(PixelRatio.roundToNearestPixel(newSize));
    result = helper.isIOS ? result : result - 2;
    return pixel > 0 && result <= 0 ? 1 : result;
  },
  screenWidth: Dimensions.get('window').width,
  screenHeight: Dimensions.get('window').height,
  translate : (sentence) => {
    const {t} = useTranslation();
    if(typeof sentence !== "string" || !sentence ){
      return "";
    }
    let sentenceLower = sentence.toLocaleLowerCase();
    // const sentenceArray = sentenceLower.match(/\b(\w+)\b/g); 
    // const newSentence = sentenceArray.map((item)=>t(item)).join(" ");
    const newSentence = t(sentenceLower);
    return newSentence; 
  },
  sendErrorMessage : (errorType) => {
    let message = "" ; 
    switch (errorType) {
      case "UE":
        message= "ue" ; 
        break;
      case "T1":
        message= "ue" ; 
        break;
      case "T2":
        message= "ue" ; 
        break;
      case "T3":
        message= "ue" ; 
        break;
      case "T4":
        message= "ue" ; 
        break;
      case "P1":
        message= "p1" ; 
        break;
      case "P2":
        message= "p2" ; 
        break;
      case "P3":
        message= "p3" ; 
        break;
      case "P4":
        message= "p4" ; 
        break;
      case "P5":
        message= "p5" ; 
        break;
      case "U1":
        message= "u1" ; 
        break;
      case "N1":
        message= "namevalidation" ; 
        break;
      case "N2":
        message= "n2" ; 
        break;
      case "S1":
        message= "surnamevalidation" ; 
        break;
      case "S2":
        message= "s2" ; 
        break;
      case "E1":
        message= "emailrequiredvalidation" ; 
        break;
      case "E2":
        message= "e2" ; 
        break;
      case "E3":
        message= "emailvalidation" ; 
        break;
      case "E4":
        message= "e4" ; 
        break;
      case "C1":
        message= "c1" ; 
        break;
      case "C2":
        message= "error"; 
        break;
      case "С3":
        message= "c3" ; 
        break;
      case "R1":
        message= "error" ; 
        break;
      case "D1":
        message= "error" ; 
        break;
      default:
        message= "error" ; 
        break;
    }
    return message ; 
  },
  random: items => {
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  },
  uniqid: length => {
    let chars = [
      'a',
      'b',
      'c',
      'd',
      'e',
      'f',
      'g',
      'h',
      'i',
      'j',
      'k',
      'l',
      'm',
      'n',
      'o',
      'p',
      'q',
      'r',
      's',
      't',
      'u',
      'v',
      'w',
      'x',
      'y',
      'z',
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
    ];
    let part1 = chars.sort(() => Math.random() - 0.5).join('');
    let part2 = chars.sort(() => Math.random() - 0.5).join('');
    return (part1 + part2).substring(5, length + 5);
  },
  uniqint: length => {
    let chars = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    let parts = [];
    chars.forEach(() =>
      parts.push(chars.sort(() => Math.random() - 0.5).join('')),
    );
    return parts.join('').substring(5, length + 5);
  },
  arrayUniqueByKey: (array, key) => {
    return [...new Map(array.map(item => [item[key], item])).values()];
  },
  confirm: (options = {}) => {
    Alert.alert(
      options?.title || '',
      options?.text || '',
      [
        {
          text: options?.noButtonText || 'İmtina et',
          style: 'cancel',
          color: 'red',
        },
        {
          text: options?.yesButtonText || 'Bəli',
          onPress: () => options?.onConfirm(),
        },
      ],
      {
        cancelable: options?.cancelable || true,
      },
    );
  },
  flatListHeight: () => (helper.isIOS ? helper.px(270) : helper.px(240)),
  ucWords: str => {
    str = str.toLocaleLowerCase();
    return str.replace(/(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g, function (s) {
      return s.toLocaleUpperCase();
    });
  },
  // checkScreen : (setDimensions) => {
  //   const subscription = Dimensions.addEventListener(
  //     "change",
  //     ({ window, screen }) => {
  //       helper.screenWidth = window.width ;
  //       helper.screenHeight = window.height ;
  //     }
  //   );
  //   return () => subscription?.remove();
  // } , 
};
