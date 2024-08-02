import {  makeAutoObservable, runInAction } from 'mobx';
import helper from '../helpers/helper';
import BannersEntity from "../entity/BannersEntity";
import BrandsEntity from "../entity/BrandsEntity";
import DiscountedProductsEntity from "../entity/DiscountedProductsEntity" ; 
import AsyncStorage from '@react-native-async-storage/async-storage';

class HomePageStore {

    banners = [];
    discountedProducts = {}; 
    brands = {}; 
    dataModules = {};
    loader= true ; 

    constructor() {
        makeAutoObservable(this);
    }
    
    getHomePageData = async () => {
        try{
            let asyncToken = await AsyncStorage.getItem("@logged_In_Token");
            let headerToken = asyncToken != null ? JSON.parse(asyncToken) : false ; 
            let response = await helper.api(headerToken).get("api/homepage"); 

            // console.log("response" ,  response.data ); 
            let banners , brands , discountedProducts ;

                    
            for(let i = 0; i<response.data.response?.modules.length; i++){
                switch(response.data.response?.modules[i].module_type){
                    case 'slideshow':
                        banners =  new BannersEntity(response?.data?.response?.modules[i]?.banners);
                        break;
                    case "manufacturers":
                        brands = { 
                            "data": new BrandsEntity(response?.data?.response?.modules[i]?.manufacturers) ,
                            "title": response?.data?.response?.modules[i]?.header_title , 
                        }; 
                        break;
                    case "special_products":
                        discountedProducts = { 
                            "data": new DiscountedProductsEntity(response?.data?.response?.modules[i]?.products),
                            "title": response?.data?.response?.modules[i]?.header_title , 
                        };  
                        break;
                }
            }

            runInAction(()=>{
                this.banners = banners ; 
                this.dataModules={ brands , discountedProducts};
                this.brands = brands ; 
                this.discountedProducts = discountedProducts ; 
                this.loader= false; 

                // this.brands = brands; 
                // this.discountedProducts = discountedProducts ; 
            });
            return true ;
        }catch(err){
            if(err){
                const errorCode = err;
                const errorMessage =  helper.sendErrorMessage(errorCode);
                await AsyncStorage.setItem("@errorMessage" , errorMessage );
            }
            return false ;

        }
    };


    logout = () => {
        try{
            runInAction(()=>{
                this.banners = [];
                this.discountedProducts = {
                    data: [] , 
                    title: ""
                }; 
                this.brands = {
                    data: [] , 
                    title: ""
                }; 
                this.dataModules = {};
                this.loader= true ; 
            });
        }catch(err){
            console.log(err);
        }
    }
}

const homepageStore = new HomePageStore();

export default homepageStore;