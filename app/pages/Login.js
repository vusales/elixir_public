import React, { useReducer , useState , useEffect, useMemo} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  TextInput ,
  TouchableOpacity,
  KeyboardAvoidingView , 
  TouchableWithoutFeedback , 
  Keyboard ,
} from 'react-native';
import colors from '../values/colors';
import helper from '../helpers/helper';
import AuthLayout from "../layouts/AuthLayout";
import { LoginSchema } from '../validation';
import TextInputMask from 'react-native-text-input-mask';
import i18next from 'i18next';
import CryptoJS from "react-native-crypto-js";
import { useNavigation } from '@react-navigation/native';
import { LOGEDINACCOUNT , HOME , ORDER , ACCOUNT , } from '../values/screensList';
import Alert from '../components/Alert';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";


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

// for useReducer 
const initialState = {
  phoneNumber: "" , 
  password: "" , 
  checkboxSelected: false,
  isEmailValue: false ,
}

const reducer = (state , action) => {
  return {...state , ...action}
}


const Login = (props) => {
  // states and consts
  const navigation = useNavigation();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [showPasword , setShowPassword] = useState(false); 
  const fromAccount = props?.route?.params?.fromAccount ; 
  const fromOrder = props?.route?.params?.fromOrder ; 
  const [error, setError] = useState({
    errorDescription : "" , 
    errorName: "" , 
  });
  const [errorAlert, setErrorAlert] = useState({
    errorDescription : "" , 
    showAlert: false , 
    type: ""
  });

  // UseEffect 
  useEffect(() => {
    navigation.addListener("beforeRemove", (e) => {
      if(!fromAccount) {
        return;
      }else{
        e.preventDefault();
        navigation.navigate(HOME);
      }
    });
  }, [navigation]);

  // functions
  const login = async() => {
    try{
      // validation schema 
      const valid =  await LoginSchema.validate({ 
        phoneNumber: state.phoneNumber ,  
        password:state.password 
      }); 

      // Check valdation
      if(valid){
        // making result body of request
        let encryptedPassword; 
        encryptedPassword = encryptData(state.password , key);
        let resultPassword  = encryptedPassword.toString();
        let result = {
          phone: "994" + state.phoneNumber, 
          password : resultPassword,
        }

        // log in 
        const loginRequest =  await props.stores.LoginStore.login(result); 

        // all at below works when user loged in successfully 
        if(loginRequest){

          // for sending wishlist when user loged in 
          let wishlistArray = await AsyncStorage.getItem("@wish_list");          
          if(wishlistArray!==null) {
            let resultValue = JSON.parse(wishlistArray);
            await props.stores.WishListStore.sendWishList(resultValue); 
          }
          // set wishlist from asyncStore
          setBackWishDataToAsync(); 
          // ****************************************

          // send Basket items when user loged in 
          let basketItems = await AsyncStorage.getItem("@basket_ids"); 
          if(basketItems!==null){
            let resultValue = JSON.parse(basketItems);
            await props.stores.BasketStore.sendBasketList(resultValue) ; 
          }
          await props.stores.BasketStore.getBasketList(); 
          // await AsyncStorage.multiRemove(["basket_products" , "basket_ids"]);

          // ********************************

          //navigate after Login
          if(fromOrder) {
            navigation.navigate(ORDER , { fromLoginPage: true });
          }else {
            navigation.navigate( ACCOUNT +"stack" , {
              screen: LOGEDINACCOUNT , 
              params: { fromLoginPage: true }
            });
          }

          // clean states and show error if there is
          dispatch(initialState);
          setErrorAlert({
            errorDescription : i18next.t("success"), 
            showAlert: true , 
            type: "success"
          });
        }else{
          // Error Messages
          let errorMessage = await AsyncStorage.getItem("@errorMessage") ; 
          if(errorMessage && errorMessage != null){
            setErrorAlert({
              errorDescription : i18next.t(errorMessage), 
              showAlert: true , 
              type: "error"
            });          
          }
        }
      }
    }
    catch(error){
      let messages = i18next.t(error.errors[0].key);
      setError({
        errorDescription : messages , 
        errorName: error.path, 
      });
    }
  }

  // set wishlist from asyncStore func
  const setBackWishDataToAsync = async () => {
    try{
      let refreshWishlist = await props.stores.WishListStore.getWishlist();
      // console.log( "setBackWishDataToAsync", refreshWishlist); 
      if(refreshWishlist){
        let wishListFromStorage = props.stores.WishListStore.wishList;
        // console.log("wishListFromStorage in LOGIN" , wishListFromStorage);
        let ids = wishListFromStorage.map((item)=> item.product_id ); 
        // console.log("ids in LOGIN" , ids);
        await AsyncStorage.setItem("@wish_list" , JSON.stringify(ids));
        await AsyncStorage.setItem("@wish_list_products" , JSON.stringify(wishListFromStorage));
      }
   
    }catch(err){console.log({err})}
  } 

  // component
  return(
    <>
    {
      errorAlert.showAlert ? 
      <Alert
      type={errorAlert.type}
      message={errorAlert.errorDescription}
      callback={(val)=> setErrorAlert({
          ...errorAlert ,
          showAlert: val ,
      }) }
      />
      :null
    }
    <AuthLayout
    showHeader={true}
    text={true}
    title={helper.translate("logintitle")}
    >
     <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.layout}>
            {/* net akkaount */}
            <View>
              <Text style={styles.title}>{helper.translate("noaccount")}</Text>
              <Text 
              style={styles.subTitle}
              onPress={()=> navigation.navigate("Registration")}
              >{helper.translate("regitration")}</Text>
            </View>

            {/* login */}
            <View
            style={styles.inputLayout}
            >
              <View>
                {
                  error.errorName === "phoneNumber" ? 
                  <Text style={styles.errorText}>{error.errorDescription}</Text>
                  :null
                }
                <TextInputMask
                  style={styles.input}
                  value={state.phoneNumber}
                  placeholder={helper.translate("phone")}
                  onChangeText={(formatted, extracted) => {
                    dispatch({phoneNumber:extracted.toString()}); 
                  }}
                  mask={"+994([00])-[000]-[00]-[00]"}
                  keyboardType='numeric'
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
                <View style={styles.passwordInputContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    onChangeText={(value)=> dispatch({password:value})}
                    value={state.password}
                    placeholder={helper.translate("password")}
                    placeholderTextColor={colors.secondary}
                    userInterfaceStyle="light"
                    secureTextEntry={showPasword ?  false :true}
                  />
                  <TouchableOpacity
                  onPress={()=>setShowPassword(!showPasword)}
                  >
                    <FontAwesome5  name={ showPasword ? "eye-slash" : "eye" } size={22} color={colors.border}/> 
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View
            style={styles.forgorPassword}
            >
              {/* <Pressable 
              style={styles.checboxContainer}
              onPress={()=>dispatch({checkboxSelected: !state.checkboxSelected})}
              >
                <CheckBox
                  value={state.checkboxSelected}
                  onValueChange={()=>dispatch({checkboxSelected: !state.checkboxSelected})}
                  style={styles.checkbox}
                />
                <Text style={styles.checboxText}>{helper.translate("rememberme")}</Text>
              </Pressable> */}
              <TouchableOpacity
              onPress={()=> navigation.navigate("ForgotPassword")}
              >
                <Text style={styles.forgorPasswordText}>{helper.translate("forgotpass")}</Text>
              </TouchableOpacity>
            </View>

            <View
            style={styles.buttonsContainer}
            >
              <TouchableOpacity
              onPress={()=>login()}
              style={styles.continueButton}
              >
                <Text style={styles.continueButtonText}>{helper.translate("continue")}</Text>
              </TouchableOpacity>

              {/* <View style={styles.smallButtonContainer}>
                <TouchableOpacity style={styles.addingButtons}>
                  <Antdesign name="apple-o" size={22}  color={colors.text} /> 
                  <Text style={styles.addingButtonsText} >Apple ID</Text>
                </TouchableOpacity>
                <TouchableOpacity  style={styles.addingButtons}>
                  <Antdesign name="googleplus" size={22}  color={colors.text} /> 
                  <Text style={styles.addingButtonsText}>Google</Text>
                </TouchableOpacity>
              </View> */}

            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView> 
    </AuthLayout> 
    </>
  );
};

const styles = StyleSheet.create({
  layout:{
    paddingVertical: helper.px(32), 
    paddingHorizontal: helper.px(16), 
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
    padding: helper.px(16),
  },
  forgorPassword:{
    flexDirection:"row", 
    justifyContent: "flex-end" ,
    alignContent:"center",
    marginTop: helper.px(16),
  },
  checkbox: {
    borderRadius: helper.px(7), 
    borderWidth: helper.px(1), 
    borderColor: colors.boderSecond , 
    marginRight: helper.px(10), 
  },
  checboxContainer: {
    flexDirection:"row", 
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
    fontFamily:helper.fontFamily("Bold"),
    fontWeight:"600",
    fontSize:helper.px(16),
    lineHeight:helper.px(20), 
    color:colors.main,
  },
  smallButtonContainer: {
    flexDirection:"row",
    marginTop:helper.px(10),
    justifyContent:"space-between",
  },
  addingButtons:{
    backgroundColor: colors.gray, 
    padding:helper.px(16),
    flexDirection:"row",
    justifyContent:"center",
    alignItems:"center",
    width:"49%",
    borderRadius: helper.px(50), 
  }, 
  addingButtonsText:{
    color:colors.text, 
    fontSize: helper.px(14), 
    fontFamily:helper.fontFamily(),
    fontWeight:"400", 
    lineHeight:helper.px(17) , 
    marginLeft:helper.px(7), 
  },
  errorText : {
    color: colors.error ,
    fontFamily:helper.fontFamily(),
    fontSize: helper.px(14), 
    fontWeight:"400", 
    lineHeight:helper.px(17) , 
    marginBottom: helper.px(5),
  }, 
  passwordInputContainer: {
    height:helper.px(54), 
    borderWidth: 1, 
    borderColor: colors.border , 
    marginBottom: helper.px(16),
    flexDirection:"row" ,
    justifyContent: "space-between" , 
    alignItems: "center",
    paddingRight: helper.px(16)
  }, 
  passwordInput: {
    height: "100%", 
    width: "85%",
    padding: helper.px(16),
  }

});

export default helper.mobx(Login);
