import {  makeAutoObservable, runInAction } from 'mobx';
import helper from '../helpers/helper';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';


class GetTokenStore {
    customToken="" ; 
    constructor() {
        makeAutoObservable(this);
    }
    
    getToken = async () => {
        try{
            console.log("HELl")

            var result = {} ; 
            await DeviceInfo.getUniqueId().then((uniqueId) => {
                // iOS: "FCDBD8EF-62FC-4ECB-B2F5-92C9E79AC7F9"
                // Android: "dd96dec43fb81c97"
                // Windows: "{2cf7cb3c-da7a-d508-0d7f-696bb51185b4}"
                result["uuid"]=uniqueId ; 
            });

            console.log("DEVICE_token" , result);
            let response = await helper.api().post("api/registerdevice" , result); 
            console.log("response" , response.data);

            const custom_token = response.data.token; 
            console.log("customer_token" , custom_token);

            // setting logged_In_Token and device_Token both to received token 
            //  in all pages i compare logged_In_Token and device_Token 
            // when user loged in i change only logged_In_Token
            // if  logged_In_Token === device_Token  this means user doesnt log in, else loged in 
            await AsyncStorage.setItem("@logged_In_Token" , JSON.stringify(custom_token));
            await AsyncStorage.setItem("@device_Token" , JSON.stringify(custom_token));
            runInAction(()=>{
                this.customToken = custom_token ; 
            });

            console.log("GOODBYE")
            return true ;
        }catch(err){
            const errorCode = err.response.data.error
            const errorMessage =  helper.sendErrorMessage(errorCode);
            await AsyncStorage.setItem("@errorMessage" , errorMessage );
            return false ;
        }
    };
}

const getTokenStore = new GetTokenStore();

export default getTokenStore;