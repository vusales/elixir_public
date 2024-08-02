import { makeAutoObservable, runInAction } from 'mobx';
import helper from '../helpers/helper';
import AsyncStorage from '@react-native-async-storage/async-storage';


class LoginStore {
    custumerId = "" ; 
    userAccountDetails = {};
    loggedInToken = ""; 

    constructor(){
        makeAutoObservable(this);
    }
    
    login = async (data) => {
        try{
            let asyncToken = await AsyncStorage.getItem("@device_Token");
            let headerToken = asyncToken != null ? JSON.parse(asyncToken) : false ;

            let response = await helper.api(headerToken).post("account/login" , data); 

            // console.log("response in login store" , response  ) ; 

            
            if(response.data.result){
                let userDetails = response.data.response.customer; 
                let token = response.data.response.customer.token; 
                await AsyncStorage.setItem("@user_Details" , JSON.stringify(userDetails));
                // change token to customer token
                await AsyncStorage.setItem("@logged_In_Token" , JSON.stringify(token));

                runInAction(()=>{
                    this.userAccountDetails = userDetails ; 
                    this.loggedInToken = token ; 
                });
                return true;
            }else{
                // console.log("login ERROR response.data.result" , response.data.result ); 
                await AsyncStorage.removeItem("@errorMessage"); 
                const errorCode = response.data.error;
                const errorMessage =  helper.sendErrorMessage(errorCode);
                await AsyncStorage.setItem("@errorMessage" , errorMessage );
            }
            return false;
        }catch(err){
            console.log("login  error" ,  {err});
            return false ;
        }
    };

    registrate = async (data) => {
        try{
            let asyncToken = await AsyncStorage.getItem("@device_Token");
            let headerToken = asyncToken != null ? JSON.parse(asyncToken) : false ;
            let response =  await helper.api(headerToken).post("account/signup"  , data);
            // console.log("result" ,  response );
            if(response.data.result){
                let signupId = response.data.response.signup_request_id; 
                // console.log("response registration" ,  response); 
                runInAction(()=>{
                    this.custumerId = signupId ? signupId: "" ;
                });
                return true ; 
            }else{
                await AsyncStorage.removeItem("@errorMessage"); 
                const errorCode = response.data.error;
                const errorMessage =  helper.sendErrorMessage(errorCode);
                await AsyncStorage.setItem("@errorMessage" , errorMessage);
            }
            return false; 
        }catch(err){
            console.log("register  error" ,  {err});
            return false ;
        }
    }

    verifyCode = async (data) => {
        try{
            let asyncToken = await AsyncStorage.getItem("@logged_In_Token");
            let headerToken = asyncToken != null ? JSON.parse(asyncToken) : false ;
            let response =  await helper.api(headerToken).post("account/signupverify" , { signup_request_id : this.custumerId , ...data} );
            // console.log("response verify" , response); 
            let newToken =  response?.data?.response?.token;  
            // change device token to user token
            await AsyncStorage.setItem("@logged_In_Token" , JSON.stringify(newToken));
            // for navigate loggedin Account
            // await AsyncStorage.setItem("@user_Details" , JSON.stringify({}));
            runInAction(()=>{});
        }catch(err){
            console.log("verifyCode  error" ,  {err});
            return false ;
        }
    }

    logout = () => {
        runInAction(()=>{
            this.custumerId = "" ; 
            this.userAccountDetails = {} ;
            this.loggedInToken = "" ; 
        });
    }
}

const loginStore = new LoginStore();

export default loginStore;