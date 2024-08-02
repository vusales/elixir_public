import React, { useReducer , useState , useMemo } from 'react';
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
import Alert from './Alert';
import i18next from 'i18next';


// --------------------------------------------------------------------------------------------
// ----------------------------------------third component-------------------------------------
// --------------------------------------------------------------------------------------------

const ChangePasswordComponent = ({state, dispatch , completeProcess, stores }) => {
    const [error, setError] = useState({
        errorDescription : "" , 
        showAlert: false , 
        type: ""
    });

    const customerRequestId = useMemo(()=> stores.ForgetPasswordStore.customer_forget_request_id ); 
    const customerId = useMemo(()=> stores.ForgetPasswordStore.customer_id ); 

    const changePassword = async () => {
        // ...smthing
        let result = {
            customer_forget_request_id: customerRequestId , 
            customer_id : customerId , 
            code: state.validationCode , 
            password: state.password , 
        }
        try{
            await stores.ForgetPasswordStore.sendPassword(result);
            setError({
                errorDescription : i18next.t("success"), 
                showAlert: true , 
                type: "success"
            });
        }catch(error){
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
            }) }
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
                        <Text style={styles.text}>{helper.translate("fppassword")}</Text>
                        <View>
                            {/* error text goes here */}
                            <TextInput
                            style={styles.input}
                            placeholder="Enter new password"
                            value={state.password}
                            onChangeText={(val)=>dispatch({password:val})}
                            placeholderTextColor={colors.secondary}
                            userInterfaceStyle="light"
                            />
                        </View>
                        <View>
                            {/* error text goes here */}                        
                            <TextInput
                            style={styles.input}
                            placeholder="Repeat new password"
                            value={state.repeatPassword}
                            onChangeText={(val)=>dispatch({repeatPassword:val})}
                            placeholderTextColor={colors.secondary}
                            userInterfaceStyle="light"
                            />
                        </View>
                        <TouchableOpacity
                        onPress={()=> {
                            let passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[a-zA-Z0-9]).{8,}$/gm ; 

                            if(
                                (state.password == state.repeatPassword)
                                &&(state.password.match(passwordPattern))
                            ){
                                // alert("ok");
                                changePassword();
                                completeProcess();
                            }else {
                                setError({
                                    errorDescription :  i18next.t("fppasswordlengthvalidation") , 
                                    showAlert: true , 
                                    type: "error"
                                });
                            }
                        }}
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

export default helper.mobx(ChangePasswordComponent); 
