import {  makeAutoObservable, runInAction } from 'mobx';
import helper from '../helpers/helper';
import AsyncStorage from '@react-native-async-storage/async-storage';


class ForgetPasswordStore {

    customer_forget_request_id="" ; 
    customer_id="" ;


    constructor() {
        makeAutoObservable(this);
    }
    
    sendPhone = async (data) => {
        try{
            let asyncToken = await AsyncStorage.getItem("@logged_In_Token");
            let headerToken = asyncToken != null ? JSON.parse(asyncToken) : false ;
            let response = await helper.api(headerToken).post("forgotPassword" , data);             
            runInAction(()=>{});
        }catch(err){
            const errorCode = err.response.data.error
            const errorMessage =  helper.sendErrorMessage(errorCode);
            await AsyncStorage.setItem("@errorMessage" , errorMessage );
        }
    };


    sendCode = async (data) => {
        try{
            let asyncToken = await AsyncStorage.getItem("@logged_In_Token");
            let headerToken = asyncToken != null ? JSON.parse(asyncToken) : false ;
            let response = await helper.api(headerToken).post("forgotPasswordStep2" , data); 
            let customer_forget_request_id = response.data.response.customer_forget_password_is.customer_forget_request_id ; 
            let customer_id = response.data.response.customer_forget_password_is.customer_id; 
            runInAction(()=>{
                this.customer_forget_request_id = customer_forget_request_id;
                this.customer_id = customer_id ; 
            });
        }catch(err){
            const errorCode = err.response.data.error
            const errorMessage =  helper.sendErrorMessage(errorCode);
            await AsyncStorage.setItem("@errorMessage" , errorMessage );
        }
    }

    sendPassword = async (data) => {
        try{
            let asyncToken = await AsyncStorage.getItem("@logged_In_Token");
            let headerToken = asyncToken != null ? JSON.parse(asyncToken) : false ;
            let response = await helper.api(headerToken).post("forgotPasswordStep3" , data);             
            runInAction(()=>{});
        }catch(err){
            const errorCode = err.response.data.error
            const errorMessage =  helper.sendErrorMessage(errorCode);
            await AsyncStorage.setItem("@errorMessage" , errorMessage );
        }
    }

    logout = () => {
        try{
            runInAction(()=>{
                this.customer_forget_request_id="" ; 
                this.customer_id="" ;
            });
        }catch(err){
            console.log(err);
        }
    }
}

const forgetPasswordStore = new ForgetPasswordStore();

export default forgetPasswordStore;