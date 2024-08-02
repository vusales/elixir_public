import {  makeAutoObservable, runInAction } from 'mobx';
import helper from '../helpers/helper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../helpers/config';


class MapStore {   
    
    predictions = [] ; 

    constructor() {
        makeAutoObservable(this);
    }

    sendParams = async (params) => {
        try{
            let predictionsResult ; 
            let result =  await axios.create({
                headers: {
                    Accept: 'application/json',
                },
            })
            .get(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${params.input}&language=az&types=establishment|geocode&components=country:az&key=${config.MAP_API}`);
            
            if(result.data.predictions.length){
                predictionsResult  =   result.data.predictions ; 
                // console.log("predictionsResult"  , predictionsResult ) ; 
            }

            runInAction(()=>{
                this.predictions = predictionsResult ;
            });
            return true ;
        }catch(err){
            console.log(err);
            const errorCode = err.response.data.error
            const errorMessage =  helper.sendErrorMessage(errorCode);
            await AsyncStorage.setItem("@errorMessage" , errorMessage );
            return false ;
        }
    };

    resetPredictions = async() => {
        try{
            runInAction(()=>{
                this.predictions = [] ;
            });
        }catch(error) {
            console.log("error" , error ); 
        }
    }
}

const mapStore = new MapStore();

export default mapStore;