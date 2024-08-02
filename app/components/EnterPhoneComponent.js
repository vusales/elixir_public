import React, { useReducer , useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput ,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import colors from '../values/colors';
import helper from '../helpers/helper';
import AuthLayout from "../layouts/AuthLayout";
import TextInputMask from 'react-native-text-input-mask';
import Alert from '../components/Alert';
import i18next from 'i18next';

// --------------------------------------------------------------------------------------------
// ----------------------------------------first component-------------------------------------
// --------------------------------------------------------------------------------------------

const EnterPhoneComponent = ({state,  stores , dispatch , sectionName ,  setSectionName }) => {
    const [error, setError] = useState({
        errorDescription : "" , 
        showAlert: false , 
        type: ""
    });
        
    const sendPhoneNumber = async () => {
        let phonePattern = /^\d{9}$/;
        if(state.phoneNumber.match(phonePattern)){
            // ...smthing
            let result = {
                phone: "994"+state.phoneNumber 
            }
            try{
                await stores.ForgetPasswordStore.sendPhone(result);
                // for to show back errors
                let errorMessage = await AsyncStorage.getItem("@errorMessage") ; 
                if(errorMessage && errorMessage != null){
                    setError({
                    errorDescription : i18next.t(errorMessage), 
                    showAlert: true , 
                    type: "error"
                    });          
                }
                setTimeout(async ()=> await AsyncStorage.setItem("@errorMessage" , "") , 3000 ) ; 
                
                setSectionName("enterCode");
            }catch(error){
                setError({
                    errorDescription : i18next.t("error"), 
                    showAlert: true , 
                    type: "error"
                });
            }  
        }else {
            setError({
                errorDescription : i18next.t("phonerequiredvalidation"),
                showAlert: true ,  
                type: "error"
            });  
        }
    }

    return (
        <>
            {
                error.showAlert ? 
                <Alert
                type={error.type}
                message={error.errorDescription}
                callback={(val)=> setError({
                    ...error ,
                    showAlert: val ,
                })}
                />
                :null
            }
            <AuthLayout
            title={helper.translate("fp")}
            showHeader={true}
            >
                <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
                >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View
                        style={styles.inputLayout}
                        >
                            <Text style={styles.text}>{helper.translate("fpphone")}</Text>
                            <View>
                                <TextInputMask
                                keyboardType='numeric'
                                style={styles.input}
                                value={state.phoneNumber}
                                placeholder={helper.translate("phone")}
                                onChangeText={(formatted, extracted) => {
                                    dispatch({phoneNumber:extracted.toString()}); 
                                }}
                                mask={"+994([00])-[000]-[00]-[00]"}
                                placeholderTextColor={colors.secondary}
                                userInterfaceStyle="light"
                                />
                            </View>

                            <TouchableOpacity
                            onPress={()=> sendPhoneNumber()}
                            style={styles.continueButton}
                            >
                                <Text style={styles.continueButtonText}>{helper.translate("continue")}</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </AuthLayout> 
        </> 
    )
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

export default helper.mobx(EnterPhoneComponent); 
