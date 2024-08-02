import React,  {useEffect, useState ,  } from "react";
import {
    View , 
    Text , 
    StyleSheet  ,
    TouchableOpacity , 
    Keyboard , 
    KeyboardAvoidingView ,
    TouchableWithoutFeedback
} from "react-native"; 
import Modal from "react-native-modal";
import helper from "../helpers/helper";
import colors from "../values/colors";
import TextInputMask from 'react-native-text-input-mask';
import Alert from '../components/Alert';
import { useNavigation } from "@react-navigation/native";
import { ACCOUNT } from "../values/screensList";



const EnterCodeModal = ({visibility ,setVisibility , stores}) => {
    const navigation = useNavigation(); 
    const [validationCode , setValidationCode ] = useState("");
    const [error, setError] = useState({
        errorDescription : "" , 
        errorName: "" , 
        showAlert: false ,
    });

    const sendCode = async () => {
        let codePattern = /^\d{6}$/;
        if(validationCode.match(codePattern)){
            // ...smthing
            const resultData =  {
                code: validationCode
            }
            try{
                await stores.LoginStore.verifyCode(resultData);
                setVisibility(false);
                setValidationCode("");
                navigation.navigate(ACCOUNT + "stack");
            }catch(error){
                console.log("err",  {error});
            }
        }else {
            setError({
                errorDescription :  i18next.t("codevalidation") , 
                type: "error",
                showAlert: true ,
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

                    <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.container}
                    >
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <View
                            style={styles.inputLayout}
                            >
                                <Text style={styles.title}>{helper.translate("sencodetitle")}</Text>
                                <View>
                                    <TextInputMask
                                    style={styles.input}
                                    placeholder={helper.translate("codeplaceholder")}
                                    defaultValue={validationCode}
                                    onChangeText={(formatted, extracted) => {
                                        setValidationCode(extracted);
                                    }}
                                    keyboardType="numeric"
                                    mask={"[000]-[000]"}
                                    placeholderTextColor={colors.secondary}
                                    userInterfaceStyle="light"
                                    />
                                </View>

                                <TouchableOpacity
                                onPress={()=> sendCode()}
                                style={styles.continueButton}
                                >
                                    <Text style={styles.continueButtonText}>{helper.translate("continue")}</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </KeyboardAvoidingView>
                </View>
            </Modal>
        </>  
    )
}

const styles = StyleSheet.create({
    layoutModal: {
        backgroundColor: colors.main , 
        padding: helper.px(16),
        borderRadius: helper.px(10),
        alignItems: "center" ,
        width: helper.px(300),
        height: helper.px(280),
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
    container: {
        flex: 1, 
    },
    inputLayout:{
        paddingTop:helper.px(30),
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

export default helper.mobx(EnterCodeModal); 