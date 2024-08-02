import React, { useReducer , useState , useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image ,
} from 'react-native';
import colors from '../values/colors';
import helper from '../helpers/helper';
import GoBackButton from './layoutComponents/GoBackButton';



const DataNotFoundComponent = ({
    title , 
    description , 
    type , 
    buttonText , 
    buttonFunction , 
    showGoBackButton , 
    imageStyle,
    titleStyle
}) => {

    let img ; 

    switch (type) {
        case "error":
            img = require("../assets/images/dataNotFound/error.png");
            break;
        case "success":
            img = require("../assets/images/dataNotFound/success.png");
            break;
        case "noData":
            img = require("../assets/images/dataNotFound/dataNotFound.png");
            break;
        default: img = require("../assets/images/dataNotFound/error.png"); 
            break;
    }

    return (
        <View style={styles.layout}>
            {
                showGoBackButton? 
                <View style={styles.goBackButtonContainer}>
                    <GoBackButton
                    bgColor={colors.border}
                    />
                </View>
                :null
            }
            
            <View style={styles.imageLayout}>
                <Image  source={img} style={imageStyle ? imageStyle : null }/> 
                <Text style={ titleStyle ? {...styles.title, ...titleStyle} : styles.title}>{title}</Text>
                <Text style={styles.text}>{description}</Text>
            </View>

            {
                buttonText ?
                <TouchableOpacity
                style={styles.resultButton}
                onPress={()=>{
                    buttonFunction();
                }}
                >
                    <Text style={styles.buttonText}>{buttonText}</Text>
                </TouchableOpacity>
                :null
            }
        </View>
    )
}

const styles =  StyleSheet.create({
    layout: {
        flex:1 , 
        width: helper.screenWidth -50, 
        paddingVertical: helper.px(16),
        justifyContent: "space-around" , 
    }, 
    imageLayout: {
        width: "100%",
        alignItems: "center",
        padding:helper.px(16),
    },
    title: {
        fontWeight: "600" , 
        fontSize: helper.px(36), 
        lineHeight: helper.px(44), 
        fontFamily: helper.fontFamily("Bold"), 
        color:colors.text , 
    }, 
    text: {
        fontWeight: "400" , 
        fontSize: helper.px(16), 
        lineHeight: helper.px(20), 
        fontFamily: helper.fontFamily(), 
        color:colors.black ,
        textAlign:"center",
    }, 
    goBackButtonContainer:{
        paddingVertical:helper.px(16),
        justifyContent:"space-between",
    },
    resultButton: {
        height: helper.px(44), 
        backgroundColor: colors.text, 
        justifyContent: "center", 
        alignItems: "center", 
        borderRadius: helper.px(50),
    },
    buttonText: {
        color: colors.main, 
        fontFamily:helper.fontFamily("Bold"),
        fontSize: helper.px(16), 
        fontWeight:"600", 
        lineHeight:helper.px(20), 
    },

}); 


export default DataNotFoundComponent; 