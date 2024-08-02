import React, {
    useReducer , 
    useMemo , 
    useState, 
    useEffect
}from "react";  
import helper from '../helpers/helper';
import UserAccount from "./UserAccount";
import { Login } from "../pages";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation , useIsFocused } from "@react-navigation/native";



// THIS SCREEN IS NOT USED ,  I CHANGED CONFIGURATION , 
// BUT I DONT DELETE SCREEN BECAUSE I CANT BE SURE SCREEN İS FULLY UNUSED

const AccountNavigationScreen = (props) => {
    const isFocused = useIsFocused();
    const  [loginToken ,  setLoginToken ]= useState("");
    const [ deviceToken ,  setdeviceToken]= useState("");

    useEffect(()=>{
        // console.log("-----AAAA   loginToken" , loginToken ) ;
        // console.log("-----BBBB   deviceToken" , deviceToken ) ;
        if(isFocused) {
            getAsyncToken();
        }
    },[loginToken , deviceToken ]);

    const getAsyncToken = async () => {
        try{
            await AsyncStorage.getItem("@logged_In_Token").then((data)=>{
                if(data !== null){
                    let token = JSON.stringify(data);
                    setLoginToken(token);
                }
            }); 
            await AsyncStorage.getItem("@device_Token").then((data)=>{
                if(data !== null){
                    let token = JSON.stringify(data);
                    setdeviceToken(token);
                }
            });

        }catch(error){
            console.log("error", error);
        }
    }

    // if(loginToken !== deviceToken){
    //     <UserAccount/>
    // }else{
    //     <Login/>
    // }

    return (
        <>
        {
            loginToken !== deviceToken ? 
            <UserAccount/>
            :<Login/>
        }
        </>
    )
}


export default helper.mobx(AccountNavigationScreen); 