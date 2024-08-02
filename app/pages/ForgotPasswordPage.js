import React, { useReducer , useState} from 'react';
import {
  StyleSheet,
} from 'react-native';
import colors from '../values/colors';
import helper from '../helpers/helper';
import EnterCodeComponent from '../components/EnterCodeComponent';
import EnterPhoneComponent from '../components/EnterPhoneComponent';
import ChangePasswordComponent from '../components/ChangePasswordComponent';
import { useNavigation } from '@react-navigation/native';



// ********************************************************************************************
// *******************************************MAIN PAGE****************************************
// ********************************************************************************************

const initialState = {
    phoneNumber: "" , 
    validationCode: "",
    password: "" , 
    repeatPassword: "" ,
}

const reducer = (state , action) => {
    return {...state , ...action}
}

const ForgotPassword = () => {
    // hooks
    const [state, dispatch] = useReducer(reducer, initialState);
    const [sectionName ,  setSectionName]=useState("enterPhone");

    const navigation = useNavigation(); 
    

    const completeProcess = () => {
        dispatch(initialState);
        navigation.navigate("Login"); 
    }

    if(sectionName === "enterPhone"){
        return (
            <EnterPhoneComponent
            state={state}
            dispatch={dispatch} 
            sectionName={sectionName}  
            setSectionName={setSectionName} 
            />
        )
    }else if(sectionName === "enterCode"){
        return (
            <EnterCodeComponent
            state={state}
            dispatch={dispatch} 
            sectionName={sectionName}  
            setSectionName={setSectionName} 
            />
        )
    }else if(sectionName === "enterPassword") {
        return (
            <ChangePasswordComponent
            state={state}
            dispatch={dispatch} 
            sectionName={sectionName}  
            setSectionName={setSectionName} 
            completeProcess={completeProcess}
            />
        )
    }

    return null;
}

const styles =  StyleSheet.create({
    container: {
        flex: 1, 
    },
    inputLayout:{
        flex:1,
        paddingTop:helper.px(30),
        paddingHorizontal: helper.px(16) ,
        justifyContent: "flex-end",
    },
    input : {
        height:helper.px(54), 
        borderWidth: 1, 
        borderColor: colors.border , 
        marginBottom: helper.px(16),
        padding: helper.px(16),
    },
    text: {
        fontFamily: helper.fontFamily(), 
        fontSize: helper.px(16), 
        fontWeight: "400" , 
        lineHeight:helper.px(20), 
        color: colors.text,
        marginBottom: helper.px(32),
    },
    continueButton:{
        backgroundColor: colors.text,
        borderRadius:helper.px(50),
        height: helper.px(44),
        justifyContent:"center",
        alignItems:"center",
    },
    continueButtonText: {
        fontFamily:helper.fontFamily("Bold"),
        fontWeight:"600",
        fontSize:helper.px(16),
        lineHeight:helper.px(20), 
        color:colors.main,
    },


}); 

export default helper.mobx(ForgotPassword); 
