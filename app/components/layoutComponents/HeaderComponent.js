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
import helper from '../../helpers/helper';
import colors from '../../values/colors';
import GoBackButton from "./GoBackButton";
import FilterButton from './FilterButton';
import LanguageButton from './LanguageButton';


const HeaderComponent = (props) =>{

    return (
        <View>
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
            source={require("../../assets/images/subBackgroundImage.jpg")}
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
              
              <Image source={require('../../assets/images/vazol.png')}  style={styles.imageVazol} />
              {
                props.title?
                <Text style={styles.headerTitle}>{props.title}</Text>
                :null
              }
            </ImageBackground>
            :null
          }
        </View>
    )
}

const styles =  StyleSheet.create({
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
      },
      backGround: {
        // height:helper.px(291),
        height:helper.px(247),
        backgroundColor: colors.text , 
        padding:helper.px(16),
      },
      headerTitle: {
        fontWeight: "600", 
        fontSize: helper.px(36),
        fontFamily:helper.fontFamily("Bold"),
        lineHeight:helper.px(44),
        color: colors.main,
        marginTop:helper.px(40),
      },
      bgImg:{
        padding:helper.px(16),
        height:helper.px(364),
        backgroundColor: colors.imageBackground,
      } , 
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
})

export default HeaderComponent ; 