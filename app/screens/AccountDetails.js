import React, {
    useReducer , 
    useEffect , 
    useMemo ,
    useState
}from "react"; 
import {
    View ,
    Text ,  
    StyleSheet  ,
    TouchableOpacity , 
    ScrollView ,  
    TextInput , 
} from "react-native"; 
import Authlayout from "../layouts/AuthLayout";
import helper from '../helpers/helper';
import colors from '../values/colors';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserInfoSchema from "../validation/UserInfoUpdateSchema";
import TextInputMask from 'react-native-text-input-mask';
import Alert from "../components/Alert";

const initialValue = {
    name: "" , 
    surName: "" , 
    email: "" , 
    phone: "" , 
    oldPassword:"",
    newPassword : "" , 
    repeateNewPassword: "" , 
}, 

reducer = (state , action) => {
    return { ...state, ...action }
}


const AccounDetails = (props) => {
    const [userData, dispatch] = useReducer(reducer, initialValue);
    const [asyncData, setAsyncData] = useState({});
    // const userdetails = useMemo(()=> props.stores.LoginStore.userAccountDetails,[]);
    const [error, setError] = useState({
        errorDescription : "" , 
        errorName: "" , 
        showAlert: false ,
    });

    useEffect(()=>{
        getAsyncData();
        // if(Object.keys(asyncData).length){
        //     dispatch({
        //         name: asyncData.firstname , 
        //         surName: asyncData.lastname , 
        //         email: asyncData.email , 
        //         phone: asyncData.telephone  , 
        //         oldPassword: "",
        //         newPassword : "" , 
        //         repeateNewPassword: "" , 
        //     }); 
        // }else {
        //     dispatch({
        //         name: userdetails.firstname , 
        //         surName: userdetails.lastname , 
        //         email: userdetails.email  , 
        //         phone: userdetails.telephone  , 
        //         oldPassword:"",
        //         newPassword : "" , 
        //         repeateNewPassword: "" , 
        //     }); 
        // }

        dispatch({
            name: asyncData.firstname , 
            surName: asyncData.lastname , 
            email: asyncData.email , 
            phone: asyncData.telephone  , 
            oldPassword: "",
            newPassword : "" , 
            repeateNewPassword: "" , 
        });

    },[asyncData]);


    const getAsyncData = async () => {
        try{
            await props.stores.UserDetailsStore.getUserInfo();
            await AsyncStorage.getItem("@user_Details").then((data)=>{
                if(data !== null){
                    let details = JSON.parse(data);
                    setAsyncData(details);
                }
            });
        }catch(error){
            console.log("error" , error );
        }
    }

    const changeUserData = async ()=> {
        try{
            const valid = await UserInfoSchema.validate(userData); 
            if(valid) {
                let userInfo = {
                   "name": userData.name, 
                    "surname":userData.surName,
                    "phone": "994" + userData.phone,
                    "email": userData.email,
                }
                await props.stores.UserDetailsStore.updateUserInfo(userInfo);
            }

            let passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[a-zA-Z0-9]).{8,}$/gm ; 

            if(
                userData.oldPassword.match(passwordPattern) 
                || userData.newPassword.match(passwordPattern) 
                || userData.repeateNewPassword.match(passwordPattern)
            ){

                if(userData.newPassword === userData.repeateNewPassword){

                    let result ={
                        "oldpassword": userData.oldPassword , 
                        "newpassword": userData.newPassword , 
                    }
                    await props.stores.UserDetailsStore.updateUserPassword(userInfo);
                }else {
                    alert("password is not correct");
                }
            }else {
                alert("password is not correct");
            }
        }catch(error){
            // console.log("key" ,  error.errors[0].key);
            // console.log("path" ,  error.path);
        }
        finally{
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
            })}
            />
            :null
            }
            <Authlayout
            showHeader= {true}
            title={helper.translate("mydetails")}
            >
                <KeyboardAwareScrollView
                    keyboardShouldPersistTaps="always"
                >
                    <ScrollView 
                    style={styles.layout}
                    keyboardShouldPersistTaps="always"
                    >
                        <Text style={styles.title}>{helper.translate("userData")}</Text>
                        <View style={styles.fullName}>
                            <TextInput
                            style={{...styles.input ,  ...styles.fullNameInput}}
                            onChangeText={(value)=> dispatch({name:value})}
                            value={userData.name }
                            placeholder={helper.translate("name")}
                            placeholderTextColor={colors.secondary}
                            userInterfaceStyle="light"
                            />
                            <TextInput
                            style={{...styles.input ,  ...styles.fullNameInput}}
                            onChangeText={(value)=> dispatch({surName:value})}
                            value={userData.surName}
                            placeholder={helper.translate("surname")}
                            placeholderTextColor={colors.secondary}
                            userInterfaceStyle="light"
                            />
                        </View>
                        <TextInput
                        style={styles.input}
                        onChangeText={(value)=> dispatch({email:value})}
                        value={userData.email}
                        placeholder={helper.translate("email")}
                        placeholderTextColor={colors.secondary}
                        userInterfaceStyle="light"
                        />
                        <TextInputMask
                            style={styles.input}
                            onChangeText={(formatted, extracted)=> dispatch({phone:extracted})}
                            value={userData.phone}
                            keyboardType="numeric"
                            placeholder={helper.translate("phone")}
                            placeholderTextColor={colors.secondary}
                            userInterfaceStyle="light"
                            mask={"+994([00])-[000]-[00]-[00]"}
                        />
                        <TextInput
                            style={styles.input}
                            onChangeText={(value)=> dispatch({oldPassword:value})}
                            value={userData.oldPassword}
                            placeholder={helper.translate("oldpassword")}
                            placeholderTextColor={colors.secondary}
                            userInterfaceStyle="light"
                        />
                        <TextInput
                            style={styles.input}
                            onChangeText={(value)=> dispatch({newPassword:value})}
                            value={userData.newPassword}
                            placeholder={helper.translate("newpassword")}
                            placeholderTextColor={colors.secondary}
                            userInterfaceStyle="light"
                        />
                        <TextInput
                            style={styles.input}
                            onChangeText={(value)=> dispatch({repeateNewPassword:value})}
                            value={userData.repeateNewPassword}
                            placeholder={helper.translate("newpasswordagain")}
                            placeholderTextColor={colors.secondary}
                            userInterfaceStyle="light"
                        />
                    </ScrollView>
                </KeyboardAwareScrollView>
            </Authlayout>
            <View style={styles.stickyButtonContainer}>
                <TouchableOpacity
                style={styles.button}
                onPress={()=>changeUserData()}
                >
                    <Text style={styles.buttonText}>{helper.translate("savedata")}</Text>
                </TouchableOpacity>
            </View>
        </> 
    )
}

const styles =  StyleSheet.create({
    layout: {
        flex: 1 , 
        paddingHorizontal: helper.px(16), 
        paddingVertical: helper.px(16), 
    }, 
    input : {
        height:helper.px(54), 
        borderWidth: 1, 
        borderColor: colors.border , 
        marginBottom: helper.px(16),
        padding: helper.px(16),
    },
    title: {
        fontWeight:"600", 
        fontFamily:helper.fontFamily("Bold"),
        fontSize:helper.px(24), 
        lineHeight:helper.px(30) , 
        color:colors.black,
        marginBottom:helper.px(32),
    }, 
    fullName: {
        flexDirection: "row", 
        justifyContent:"space-between", 
        width: "100%",
    }, 
    fullNameInput  : {
        width: "48%",
    },
    stickyButtonContainer:{
        padding:helper.px(16),
        borderTopWidth:helper.px(1), 
        borderTopColor: colors.border,
        backgroundColor:colors.main,
    },
    button:{
        // height:helper.px(44),
        padding:helper.px(16),
        backgroundColor: colors.text,
        borderRadius: helper.px(50),
        justifyContent:"center",
        alignItems: "center",
    }, 
    buttonText: {
        fontWeight: "600", 
        fontFamily:helper.fontFamily("Bold"),
        fontSize: helper.px(16), 
        lineHeight: helper.px(20),
        color:colors.main, 
    },
}); 

export default helper.mobx(AccounDetails) ;