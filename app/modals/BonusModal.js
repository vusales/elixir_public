import React,  {useEffect, useState ,  } from "react";
import {View , Text ,  StyleSheet  , TouchableOpacity , ScrollView , ImageBackground ,  FlatList   } from "react-native"; 
import Modal from "react-native-modal";
import helper from "../helpers/helper";
import colors from "../values/colors";
import BasketCart from "../components/BasketCart";
import HorizontalSlider from '../components/HorizontalSlider';
import SimilarProductCard from '../components/SimilarProductCard';
import CheckBox from 'expo-checkbox';
import { color } from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { ORDER } from "../values/screensList";

const BonusModal = ({visibility ,setVisibility}) => {


    return (
        <Modal
        style={{
            margin: 0, 
            bottom: 0 , 
            justifyContent: "center" ,  
            alignItems: "center" ,
        }}
        animationIn={"slideInUp"}
        isVisible={visibility}
        onBackdropPress={()=>setVisibility(false)}
        onBackButtonPress={()=>setVisibility(false)}
        onSwipeComplete={()=>setVisibility(false)}
        deviceWidth={helper.screenWidth}
        swipeDirection={['down']}
        panResponderThreshold={50}
        >
            <View style={styles.layoutModal}>
                <View  style={styles.lineContainer}>
                    <View style={styles.line}></View>
                </View>

                <Text style={styles.title} >{helper.translate("bonus")} : 50₼ </Text>


            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    layoutModal: {
        backgroundColor: colors.main , 
        padding: helper.px(16),
        borderRadius: helper.px(10),
        alignItems: "center" ,
        width: helper.px(300),
    },
    lineContainer: {
        width: "100%", 
        justifyContent:"center" ,
        alignItems: "center" , 
        marginBottom: helper.px(20) ,
    },
    line:{
        width: helper.px(134), 
        height: helper.px(5),
        backgroundColor: colors.border, 
    },
    title: {
        fontSize: helper.px(24), 
        fontWeight: "700", 
        fontFamily:helper.fontFamily(),
        lineHeight:helper.px(30),
        color: colors.text,
        marginBottom: helper.px(20) ,
    },
}); 

export default BonusModal ; 