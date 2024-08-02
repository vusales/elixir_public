/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect , useState , useRef } from 'react';
import {View , Text , StyleSheet ,  StatusBar , Image, Pressable } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'mobx-react';
import stores from './stores/index';
import colors from './values/colors';
import SplashScreen from 'react-native-splash-screen';
import helper from './helpers/helper';
import Stack from "./stacks/Stack"; 
import AppIntroSlider from 'react-native-app-intro-slider';
import { enableLatestRenderer } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18next from "i18next";
enableLatestRenderer();


// content of intro sliders
const slides = [
  {
    key: 1,
    logo: require('./assets/images/logo.png'),
    icon: "", 
    title : "introsliderfirsttitle", 
    description : "" , 
  },
  {
    key: 2,
    logo: require('./assets/images/logo.png'),
    icon: require("./assets/images/introSliderImages/truck.png"), 
    title : "introslidersecondtitle", 
    description : "introslidersecond" , 
  },
  {
    key: 3,
    logo: require('./assets/images/logo.png'),
    icon: require("./assets/images/introSliderImages/sale.png"), 
    title : "introsliderthirdtitle", 
    description : "introsliderthird" , 
  },
  {
    key: 4,
    logo: require('./assets/images/logo.png'),
    icon:require("./assets/images/introSliderImages/wallet.png"), 
    title : "introsliderfourthtitle", 
    description : "introsliderfourth" , 
  },
  {
    key: 5,
    logo: require('./assets/images/logo.png'),
    icon: require("./assets/images/introSliderImages/handshake.png"), 
    title : "introsliderfifthtitle", 
    description : "introsliderfifth" ,  
  },
];

const App = () => {
  const [showRealApp , setShowRealApp ] = useState(false) ; 
  const sliderRef =  useRef(); 

  useEffect(() => {
    // if(!helper.isIOS){
      SplashScreen.hide();
    // }
    getFirstLunch();
  }, []);

  const getFirstLunch = async () => {
    try{
      await AsyncStorage.getItem("@userLunched").then(async (data)=>{
        if(data === null){
          setShowRealApp(false); 
          await stores.GetTokenStore.getToken();
          AsyncStorage.setItem("@userLunched" , "true" ); 
        }else {
          setShowRealApp(true);
        }
      })
    }catch(err){console.log(err)}
  }

  const _renderItem = ({ item }) => {
    return (
      <View style={styles.slide}>
        <View>
          <View style={styles.logoContainer}>
           <Image source={item.logo} /> 
          </View>
          <View style={styles.infoContainer}>
            {
              item.icon? 
              <Image source={item.icon} style={styles.iconImage}/> 
              :null
            }
            <Text style={styles.title}>{i18next.t(item.title)}</Text>
            <Text style={styles.description}>{i18next.t(item.description)}</Text>
          </View>
        </View>
        {
          item.key !== slides.length && slides.length!==1 ?
          <Pressable 
          style={styles.buttonNext}
          onPress={()=> sliderRef.current.goToSlide((item.key),  true)}
          >
            <Text style={styles.textButton}>Davam et</Text>
          </Pressable>
          :
          <Pressable 
          style={styles.buttonNext}
          onPress={_onDone}
          >
            <Text style={styles.textButton}>Bağla</Text>
          </Pressable>
        }
      </View>
    );
  }

  const _onDone = () => {
    setShowRealApp(true);
  }

  return (
    showRealApp?
    (
    <Provider stores={stores}>
      <StatusBar backgroundColor={colors.main} translucent={true}/>
      <NavigationContainer>
        <Stack/>
      </NavigationContainer>
    </Provider>
    )
    :
    <AppIntroSlider 
    ref={sliderRef}
    renderItem={_renderItem} 
    data={slides} 
    showDoneButton={false}
    showNextButton={false}
    /> 
  );
};



const styles =  StyleSheet.create({
  slide:{
    flex:1, 
    backgroundColor: colors.text, 
    justifyContent:"space-between" , 
    paddingTop:helper.px(64),
    paddingBottom:helper.px(32),
  }, 
  logoContainer: {
    paddingVertical: helper.px(32) , 
    paddingHorizontal: helper.px(16), 
  },
  infoContainer: {
    paddingHorizontal: helper.px(16), 
  }, 
  title: {
    fontFamily: helper.fontFamily("Bold"), 
    fontWeight: "600" , 
    fontSize:helper.px(36) , 
    lineHeight: helper.px(44),
    color: colors.main , 
    marginVertical: helper.px(16) , 
  }, 
  description: {
    fontFamily: helper.fontFamily(), 
    fontWeight: "400" , 
    fontSize:helper.px(16) , 
    lineHeight: helper.px(20),
    color: colors.main ,
  }, 
  buttonNext:{
    justifyContent: "center" , 
    alignItems:"center" , 
    backgroundColor: colors.main , 
    height: helper.px(44) , 
    borderRadius: helper.px(50),
    marginBottom: helper.ios ? helper.px(100) : helper.px(60),
    marginTop: helper.px(20) ,
    marginHorizontal: helper.px(16),
  },
  textButton: {
    fontFamily: helper.fontFamily("Bold"), 
    fontWeight: "600" , 
    fontSize:helper.px(16) , 
    lineHeight: helper.px(20),
    color: colors.text ,
  },
  sliderIcon:{
    width: helper.px(100),
    height: helper.px(100),
  }, 
  iconImage: {
    marginVertical: helper.px(16),
  }


})
 
export default App;
