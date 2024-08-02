import {  makeAutoObservable, runInAction } from 'mobx';
import helper from '../helpers/helper';
import AsyncStorage from '@react-native-async-storage/async-storage';


class Order {

    deliveryPrice = ""; 
    orderHistoryData = [] ; 
    totalPage= "" ; 
    totalHistoryData = "" ; 

    constructor() {
        makeAutoObservable(this);
    }
    
    makeOrder = async (body) => { 
        try{
            let asyncToken = await AsyncStorage.getItem("@logged_In_Token");
            let asyncDeviceToken = await AsyncStorage.getItem("@device_Token");
            let headerToken = asyncToken != null ? JSON.parse(asyncToken) : false ;
            let deviceToken = asyncDeviceToken != null ? JSON.parse(asyncDeviceToken) : false ; 

            if(headerToken !== deviceToken &&  headerToken && deviceToken) { 
                let response = await helper.api(headerToken).post("checkout" , body );   
                runInAction(()=>{
                    
                });
                return true ;
            }
        }catch(err){
            const errorCode = err.response.data.error
            const errorMessage =  helper.sendErrorMessage(errorCode);
            await AsyncStorage.setItem("@errorMessage" , errorMessage );
            return false ;
        }
    };

    calculateDelivery = async (body) => { 
        try{

            let asyncToken = await AsyncStorage.getItem("@logged_In_Token");
            let asyncDeviceToken = await AsyncStorage.getItem("@device_Token");
            let headerToken = asyncToken != null ? JSON.parse(asyncToken) : false ;
            let deviceToken = asyncDeviceToken != null ? JSON.parse(asyncDeviceToken) : false ; 

            if(headerToken !== deviceToken &&  headerToken && deviceToken) { 
                let response = await helper.api(headerToken).post("checkout/deliveryPrice" , body );   
                let price  =  response?.data?.data?.price ;  
                runInAction(()=>{
                    this.deliveryPrice  = price ; 
                });

                return true ;
            }
        }catch(err){
            const errorCode = err.response.data.error
            const errorMessage =  helper.sendErrorMessage(errorCode);
            await AsyncStorage.setItem("@errorMessage" , errorMessage );
            return false ;
        }
    };

    getOrderHistory = async (pageCount) => { 
        try{
            let asyncToken = await AsyncStorage.getItem("@logged_In_Token");
            let asyncDeviceToken = await AsyncStorage.getItem("@device_Token");
            let headerToken = asyncToken != null ? JSON.parse(asyncToken) : false ;
            let deviceToken = asyncDeviceToken != null ? JSON.parse(asyncDeviceToken) : false ; 

            if(headerToken !== deviceToken) { 
                let response = await helper.api(headerToken).post("checkout/history");  
                let orders =  response.data.data.orders ; 
                let totalProduct = response.data.data.total ; 
                limit = 10; 
                let totalPage = totalProduct !==0 ? Math.ceil(totalProduct / limit ) : 1 ; 

                // console.log( "RESPONSE IN ORDER" , response.data.data ) ; 

                runInAction(()=>{
                    this.orderHistoryData = pageCount > 1 ? [...this.orderHistoryData , ...orders ] : orders ; 
                    this.totalPage = totalPage ; 
                    this.totalHistoryData = totalProduct ;
                });

                return true ;
            }
        }catch(err){
            console.log("err" , err);
            const errorCode = err?.response?.data?.error ; 
            const errorMessage =  helper.sendErrorMessage(errorCode);
            await AsyncStorage.setItem("@errorMessage" , errorMessage );
            return false ;
        }
    };

    resetDeliveryPrice = async () => { 
        try{
            runInAction(()=>{
                this.deliveryPrice  = "" ; 
            });
        }catch(err){
            console.log("err" , err ) ; 
        }
    };
}

const order = new Order();

export default order;