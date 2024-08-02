import React , {useReducer ,  useState} from "react"; 
import {
Text,
View,
StyleSheet,
Pressable,
TextInput ,
TouchableOpacity,
KeyboardAvoidingView ,
TouchableWithoutFeedback ,
Keyboard
} from 'react-native';
import colors from '../values/colors';
import helper from '../helpers/helper';
import AuthLayout from "../layouts/AuthLayout";
import CheckBox from 'expo-checkbox';
import {RegisterSchema} from "../validation/index"; 
import { cloneDeep } from "lodash";
import TextInputMask from 'react-native-text-input-mask';
import i18next from 'i18next';
import CryptoJS from "react-native-crypto-js";
import EnterCodeModal from "../modals/EnterCodeModal";
import { useNavigation } from "@react-navigation/native";
import Alert from "../components/Alert";
import AsyncStorage from "@react-native-async-storage/async-storage";


// this token, key and iv gives us back developer 
const token = "8056483646328123";
const key = "2b44e98bd13c3d5e59230921218cafe1";
const iv = "90ecfe48f1ab81386d13c916854571c1";

const encryptData = (text, key) => CryptoJS.AES.encrypt(
  text,
  CryptoJS.enc.Hex.parse(key),
  {
    iv: CryptoJS.enc.Hex.parse(iv),
    keySize: 16,
    mode:CryptoJS.mode.CBC,
    padding:CryptoJS.pad.Pkcs7
  }
);

// usereducer 

const initialState = {
  name:"", 
  surname: "", 
  phone:"", 
  email: "" , 
  password: "" , 
  passwordAgain: "" ,
  checkboxSelected: false,
}
  
const reducer = (state , action) => {
  return {...state , ...action}
}


const Registration = ({ stores }) => {
  const navigation =  useNavigation();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [error, setError] = useState({
    errorDescription : "" , 
    errorName: "" , 
    showAlert: false ,
  });
  const [visible, setVisible] = useState(false);

  const Registrate = async() => {
    try{
      let statClone =  cloneDeep(state); 
      if(!statClone.checkboxSelected){
        setError({
          errorDescription : i18next.t("registrationcheck"), 
          showAlert: true , 
          type: "error", 
        }); 
        return;
      }
      delete statClone.checkboxSelected;  
      const valid =  await RegisterSchema.validate(statClone);

      if(valid){
        if(statClone.password === statClone.passwordAgain){
          //send request 
          let encryptedPassword; 
          encryptedPassword = encryptData(statClone.password , key);
          let resultPassword = encryptedPassword.toString();
          let result = {
            "name": statClone.name , 
            "surname" :statClone.surname , 
            "phone" : "994" + statClone.phone , 
            "password" : resultPassword , 
            "email" : statClone.email , 
          }
          await stores.LoginStore.registrate(result);
          // for to show back errors
          let errorMessage = await AsyncStorage.getItem("@errorMessage") ; 
          if(errorMessage && errorMessage != null){
            setError({
              errorDescription : i18next.t(errorMessage), 
              showAlert: true , 
              type: "error"
            });  
            setTimeout(async ()=> await AsyncStorage.setItem("@errorMessage" , "") , 3000 ) ; 
          }else {
            setVisible(true);
          }
        }
        else {
          setError({
            errorDescription : helper.translate("p3") , 
            errorName: "error" , 
            showAlert: true ,
          });
        }
      }
    }catch(error){
      let messages;
      switch (error.path) {
        case "email":
          messages = i18next.t("mail");
          break;
        case "name":
            messages = i18next.t("namevalidation");
            break;
        case "surname":
          messages = i18next.t("surnamevalidation");
          break;
        default:
          messages = i18next.t(error.errors[0].key);
          break;
      }
      setError({
        errorDescription : messages , 
        errorName: error.path, 
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
          showHeader={true}
          text={true}
          title={helper.translate("createaccount")}
          >
            <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
            >
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.layout}>
                    {/* net akkaount */}
                    <View>
                        <Text style={styles.title}>{helper.translate("previousaccount")}</Text>
                        <Text 
                        style={styles.subTitle}
                        onPress={()=>navigation.navigate("Login")}
                        >{helper.translate("login")}</Text>
                    </View>

                    {/* login */}
                    <View
                    style={styles.inputLayout}
                    >
                      <View>
                        {
                          error.errorName === "name" ? 
                          <Text style={styles.errorText}>{error.errorDescription}</Text>
                          :null
                        }
                        <TextInput
                        style={styles.input}
                        onChangeText={(value)=> dispatch({name:value})}
                        value={state.name}
                        placeholder={helper.translate("name")}
                        placeholderTextColor={colors.secondary}
                        userInterfaceStyle="light"
                        />
                      </View>

                      <View>
                        {
                          error.errorName === "surname" ? 
                          <Text style={styles.errorText}>{error.errorDescription}</Text>
                          :null
                        }
                        <TextInput
                        style={styles.input}
                        onChangeText={(value)=> dispatch({surname:value})}
                        value={state.surname}
                        placeholder={helper.translate("surname")}
                        placeholderTextColor={colors.secondary}
                        userInterfaceStyle="light"
                        /> 
                      </View>
                      
                      <View>
                        {
                          error.errorName === "phone" ? 
                          <Text style={styles.errorText}>{error.errorDescription}</Text>
                          :null
                        }
                        <TextInputMask
                        style={styles.input}
                        placeholder={helper.translate("phone")}
                        value={state.phone}
                        onChangeText={(formatted, extracted) => {
                          // console.log("formatted" , formatted); // +1 (123) 456-78-90
                          // console.log("extracted" , extracted);// 1234567890
                          dispatch({phone:extracted.toString()});
                        }}
                        mask={"+994([00])-[000]-[00]-[00]"}
                        keyboardType='numeric'
                        placeholderTextColor={colors.secondary}
                        userInterfaceStyle="light"
                        />
                      </View>
                      
                      <View>
                        {
                          error.errorName === "email" ? 
                          <Text style={styles.errorText}>{error.errorDescription}</Text>
                          :null
                        }
                        <TextInput
                        style={styles.input}
                        onChangeText={(value)=> dispatch({email:value})}
                        value={state.email}
                        placeholder={helper.translate("email")}
                        placeholderTextColor={colors.secondary}
                        userInterfaceStyle="light"
                        />
                      </View>
                      
                      <View>
                        {
                          error.errorName === "password" ? 
                          <Text style={styles.errorText}>{error.errorDescription}</Text>
                          :null
                        }
                        <TextInput
                        style={styles.input}
                        onChangeText={(value)=> dispatch({password:value})}
                        value={state.password}
                        placeholder={helper.translate("password")}
                        placeholderTextColor={colors.secondary}
                        userInterfaceStyle="light"
                        /> 
                      </View>

                      <View>
                        {
                          error.errorName === "passwordAgain" ? 
                          <Text style={styles.errorText}>{error.errorDescription}</Text>
                          :null
                        }
                        <TextInput
                        style={styles.input}
                        onChangeText={(value)=> dispatch({passwordAgain:value})}
                        value={state.passwordAgain}
                        placeholder={helper.translate("passwordagain")}
                        placeholderTextColor={colors.secondary}
                        userInterfaceStyle="light"
                        /> 
                      </View>
                    </View>

                    <View
                    style={styles.buttonsContainer}
                    >
                        <Pressable 
                        style={styles.checboxContainer}
                        onPress={()=>dispatch({checkboxSelected: !state.checkboxSelected})}
                        >
                            <CheckBox
                            value={state.checkboxSelected}
                            onValueChange={()=>dispatch({checkboxSelected: !state.checkboxSelected})}
                            style={styles.checkbox}
                            />
                            <Text style={styles.checboxText}>{helper.translate("agreement")}</Text>
                        </Pressable>

                        <TouchableOpacity
                        onPress={()=> Registrate()}
                        style={styles.continueButton}
                        >
                            <Text 
                            style={styles.continueButtonText}
                            >{helper.translate("continue")}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
              </TouchableWithoutFeedback>
            </KeyboardAvoidingView>

            <EnterCodeModal 
            setVisibility={(smth)=>setVisible(smth)}
            visibility={visible}
            />
          </AuthLayout>
      </>
    )
}

const styles= StyleSheet.create({
    layout:{
        paddingVertical: helper.px(32), 
        paddingHorizontal: helper.px(16), 
        // paddingBottom:helper.px(70),
      }, 
      title: {
        fontWeight:"600", 
        fontFamily:helper.fontFamily("Bold"),
        fontSize:helper.px(24), 
        lineHeight:helper.px(30) , 
        color:colors.black,
        marginBottom:helper.px(8),
      }, 
      subTitle: {
        fontWeight:"400", 
        fontFamily:helper.fontFamily(),
        fontSize:helper.px(16), 
        lineHeight:helper.px(20) , 
        color:colors.subTitle,
        width: "50%",
      }, 
      inputLayout:{
        paddingTop:helper.px(30),
      },
      input : {
        height:helper.px(54), 
        borderWidth: 1, 
        borderColor: colors.border , 
        marginBottom: helper.px(16),
        // paddingHorizontal:helper.px(32),
        // paddingVertical:helper.px(16),
        padding: helper.px(16),
      },
      checkbox: {
        borderRadius: helper.px(7), 
        borderWidth: helper.px(1), 
        borderColor: colors.boderSecond , 
        marginRight: helper.px(10), 
      },
      checboxContainer: {
        flexDirection:"row", 
        marginBottom:helper.px(16),
      },
      checboxText:{
        color: colors.text, 
        fontFamily:helper.fontFamily(),
        fontSize: helper.px(14), 
        fontWeight:"400", 
        lineHeight:helper.px(17) , 
      },
      buttonsContainer:{
        marginTop: helper.px(16),
      },
      continueButton:{
        backgroundColor: colors.text,
        borderRadius:helper.px(50),
        height: helper.px(44),
        justifyContent:"center",
        alignItems:"center",
      },
      continueButtonText: {
        fontWeight:"600",
        fontFamily:helper.fontFamily("Bold"),
        fontSize:helper.px(16),
        lineHeight:helper.px(20), 
        color:colors.main,
      },
      errorText : {
        color: colors.error ,
        fontFamily:helper.fontFamily(),
        fontSize: helper.px(14), 
        fontWeight:"400", 
        lineHeight:helper.px(17) , 
        marginBottom: helper.px(5),
      }


});

export default helper.mobx(Registration);