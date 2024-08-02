import {  makeAutoObservable, runInAction } from 'mobx';
import helper from '../helpers/helper';
import AsyncStorage from '@react-native-async-storage/async-storage';


class UserDetailsStore {

    userAccountDetails = {} ;

    constructor() {
        makeAutoObservable(this);
    }
    
    getUserInfo = async () => {
        try{
            let asyncToken = await AsyncStorage.getItem("@logged_In_Token");
            let asyncDeviceToken = await AsyncStorage.getItem("@device_Token");
            let headerToken = asyncToken != null ? JSON.parse(asyncToken) : false ;
            let deviceToken = asyncDeviceToken != null ? JSON.parse(asyncDeviceToken) : false ;  

            if(headerToken !== deviceToken ) { 
                let response = await helper.api(headerToken).get("getUserInfo"); 
                let userDetails = response.data.data.customer ; 
                AsyncStorage.setItem("@user_Details" , JSON.stringify(userDetails));
                runInAction(()=>{
                    this.userAccountDetails = userDetails ; 
                });
                return true;
            }

        }catch(err){
            const errorCode = err.response.data.error
            const errorMessage =  helper.sendErrorMessage(errorCode);
            await AsyncStorage.setItem("@errorMessage" , errorMessage );
            return false ;
        }
    };

    updateUserInfo = async (userInfo) => {
        try {
            let asyncToken = await AsyncStorage.getItem("@logged_In_Token");
            let asyncDeviceToken = await AsyncStorage.getItem("@device_Token");
            let headerToken = asyncToken != null ? JSON.parse(asyncToken) : false ;
            let deviceToken = asyncDeviceToken != null ? JSON.parse(asyncDeviceToken) : false ;  

            if(headerToken !== deviceToken ) { 
                let response = await helper.api(headerToken).post("updateUserInfo" , userInfo ); 
            }
        }catch(err){
            const errorCode = err.response.data.error
            const errorMessage =  helper.sendErrorMessage(errorCode);
            await AsyncStorage.setItem("@errorMessage" , errorMessage );
        }
    }

    updateUserPassword = async (updatePassword) => {
        try {
            let asyncToken = await AsyncStorage.getItem("@logged_In_Token");
            let asyncDeviceToken = await AsyncStorage.getItem("@device_Token");
            let headerToken = asyncToken != null ? JSON.parse(asyncToken) : false ;
            let deviceToken = asyncDeviceToken != null ? JSON.parse(asyncDeviceToken) : false ;  

            if(headerToken !== deviceToken ) { 
                let response = await helper.api(headerToken).post("updatePassword" , updatePassword ); 
            }
        }catch(err){
            const errorCode = err.response.data.error
            const errorMessage =  helper.sendErrorMessage(errorCode);
            await AsyncStorage.setItem("@errorMessage" , errorMessage );
        }
    }


    logout = () => {
        try{
            runInAction(()=>{
                this.userAccountDetails = {} ;
            });
        }catch(err){
            console.log(err);
        }
    }
}

const userDetailsStore = new UserDetailsStore();

export default userDetailsStore;