import React , {
  useMemo
}from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ImageBackground, 
  Image,
} from 'react-native';
import helper from '../helpers/helper';
import colors from '../values/colors';
import GoBackButton from "../components/layoutComponents/GoBackButton";
import FilterButton from '../components/layoutComponents/FilterButton';
import ImageSlider from '../components/layoutComponents/ImageSlider';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LanguageButton from '../components/layoutComponents/LanguageButton';
import i18next from 'i18next';

const AuthLayout = props => {

  const banners =  useMemo(()=> props.stores.HomepageStore.banners); 
  
  return (
    <>
      <SafeAreaView
        style={{
          flex: 0,
          backgroundColor: colors[props?.showHeaderBg ? 'imageBg' : (props?.showHeader ||  props?.introHeader ? 'text' : (props.loader? "text" : "main"))] ,
        }}
      />
      <StatusBar
        translucent={false}
        backgroundColor={ colors[props?.showHeaderBg ? 'imageBg' : (props?.showHeader ||  props?.introHeader ? 'text' : (props.loader? "text" : "main"))]}
      />

      <SafeAreaView style={styles.layout}>
        <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        keyboardShouldPersistTaps='always'
        >
          {/* black bg header */}
          {
            props?.showHeader && (
            <View style={styles.backGround}>
              <View style={styles.header}>
                <GoBackButton/>
                {
                  props.filter ? 
                  <FilterButton/>
                  :null
                }
                {
                  props.languageButton ? 
                  <LanguageButton/>
                  :null
                }
              </View>
              {
                props.title?
                <Text style={styles.headerTitle}>{props.title}</Text>
                :null
              }
            </View>
          )}

          {/* header whith background image */}
          {
            props?.showHeaderBg ? 
            <ImageBackground 
            source={require("../assets/images/subBackgroundImage.jpg")}
            style={styles.bgImg}
            resizeMode="cover"
            >
              <View style={styles.header}>
                <GoBackButton/>
                {
                  props.filter ? 
                  <FilterButton/>
                  :null
                }
              </View>
              
              <Image source={require('../assets/images/vazol.png')}  style={styles.imageVazol} />
              {
                props.title?
                <Text style={styles.headerTitle}>{props.title}</Text>
                :null
              }
            </ImageBackground>
            :null
          }

          {/* Intro homePage Header */}
          {
            props?.introHeader?
            <View style={styles.introbackGround}>
              <View style={styles.introheader}>
                <Image source={require("../assets/images/logo.png")}/>
                {/* <Text style={styles.introHeaderText}>С легким паром,{"\n"} Намик!</Text> */}
                <Text style={styles.introHeaderText}>{i18next.t("slogan")}</Text>
              </View>
              <View style={styles.sliderLayout}>
                <ImageSlider data={banners}/>
              </View>
            </View>
            :null
          }

          <View style={[styles.content, {...props?.contentStyle}]}>
            {/* children */}
            {props.children}
          </View>

        </KeyboardAwareScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  content: {
    // dont remove
    // paddingBottom: helper.px(50),
    flex:1,
  },
  layout: {
    backgroundColor: colors.main,
    height: helper.screenHeight,
    flex: 1,
  },
  header: {
    height: helper.px(60),
    justifyContent: 'center',
    alignItems: 'space-between',
    marginTop:helper.px(20),
    position: 'relative',
    zIndex: 100000,
  },
  backGround: {
    minHeight:helper.px(247),
    backgroundColor: colors.text, 
    padding:helper.px(16),
  },
  headerTitle: {
    fontWeight: "600", 
    fontSize: helper.px(36),
    fontFamily:helper.fontFamily("Bold"),
    lineHeight:helper.px(44),
    color: colors.main,
    marginTop:helper.px(40),
    marginBottom:helper.px(24),
  },
  bgImg:{
    padding:helper.px(16),
    height:helper.px(364),
    backgroundColor: colors.imageBackground,
  }, 
  imageVazol: {
    marginTop: helper.px(45),
  },
  introheader :{
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center",
    width:"100%",
  },
  introHeaderText: {
    color: colors.main,
    fontWeight:"700",
    fontFamily:helper.fontFamily("Black"),
    fontSize:helper.px(16),
    lineHeight:helper.px(20),
    textAlign:"right",
  },
  introbackGround: {
    backgroundColor: colors.text , 
    padding:helper.px(16),
    justifyContent: "center", 
    alignItems: "center" ,
  }, 
  sliderLayout: {
    width : helper.px(360),
  }, 
});

export default helper.mobx(AuthLayout);
