import { escapeRegExp } from 'lodash';
import React , {useState , useEffect } from 'react';
import {View, StyleSheet, Text ,  TouchableOpacity} from 'react-native';
import { color } from 'react-native-reanimated';
import helper from '../helpers/helper';
import colors from '../values/colors';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const Alert  = ({message , type ,  callback }) => {
    let typeStyle; 

    useEffect(()=>{
        clearTimeout(closeAlert); 
        const closeAlert = setTimeout(()=>callback(false) , 3000);
    }, []);


    switch (type) {
        case "error":
                typeStyle = styles.error; 
            break;
        case "success":
                typeStyle = styles.success; 
            break;
        case "warning":
                typeStyle = styles.warning; 
            break;
        default: typeStyle = styles.default;
            break;
    }

    return (
        <View style={{...styles.layoutAlert,...typeStyle}}>
            <TouchableOpacity 
            style={styles.button}
            onPress={()=>callback(false)}
            >
                <MaterialCommunityIcons name="close" size={24} color={colors.main} />
            </TouchableOpacity>
            
            <Text style={{...styles.message}}>{message}</Text> 
        </View>
    )
}

const styles =  StyleSheet.create({
    layoutAlert: {
        width: helper.screenWidth-helper.px(30), 
        paddingVertical: helper.px(10),
        paddingHorizontal:helper.px(16), 
        borderWidth: helper.px(3), 
        alignSelf:"center",
        borderRadius: helper.px(20),
        alignItems: "flex-start", 
        justifyContent: "center",
        position: 'absolute', 
        zIndex: 5000, 
        bottom: helper.px(20),   
    }, 
    message:{
        fontFamily: helper.fontFamily("Bold"), 
        fontWeight: "400" ,
        fontSize: helper.px(14) , 
        lineHeight: helper.px(18),
        // color:colors.text , 
        color:colors.main , 
        width: "90%",
    }, 
    default:{
        backgroundColor: colors.main,
        borderColor: colors.text,
    }, 
    error: {
        borderColor: "#FF7165" ,
        backgroundColor: "#E60023", 
    }, 
    success: {
        borderColor: "#48AF7C" ,
        backgroundColor: "#009100",
    }, 
    warning: {
        borderColor: "#FFBA54",
        backgroundColor: "#F56702",
    },
    button: {
        position: "absolute" , 
        right: helper.px(16), 
        top:helper.px(7),
    }
}); 

export default Alert ;