import {  makeAutoObservable, runInAction } from 'mobx';
import helper from '../helpers/helper';
import DiscountedProductsEntity from "../entity/DiscountedProductsEntity" ; 
import AsyncStorage from '@react-native-async-storage/async-storage';

class FilterDetailsStore {

    filteredProducts = [];
    priceSliderValue = {};
    puffs=[];
    vapeTaste=[];
    vapeCountry=[];
    mah=[];
    totalPage=""; 
    loader= true; 
    resultData={};
    totalProduct="" ; 
    mahAndTestArray  = []; 
    subCategories = [] ; 

    constructor() {
        makeAutoObservable(this);
    }
    
    getFilteredProducts = async (manufacturer_data) => {
        try{
            let asyncToken = await AsyncStorage.getItem("@logged_In_Token");
            let headerToken = asyncToken != null ? JSON.parse(asyncToken) : false ; 
            let response = await helper.api(headerToken).post("product/getproducts", manufacturer_data ); 

            let filteredProducts = new DiscountedProductsEntity(response?.data?.data?.products); 
            let totalPage = response?.data?.data?.pages_count ; 
            let totalProduct =   response?.data?.data.products_total; 

            console.log("filteredProducts" ,  filteredProducts ) ; 

            runInAction(()=>{
                this.filteredProducts = manufacturer_data.page>1 ? [...this.filteredProducts , ...filteredProducts ]: filteredProducts ; 
                this.totalPage = totalPage ; 
                this.totalProduct = totalProduct ; 
            });
        }catch(err){
            const errorCode = err?.response?.data?.error ; 
            const errorMessage =  helper.sendErrorMessage(errorCode);
            await AsyncStorage.setItem("@errorMessage" , errorMessage );
        }
    };

    getFilterChoices = async() => {
        try{
            let asyncToken = await AsyncStorage.getItem("@logged_In_Token");
            let headerToken = asyncToken != null ? JSON.parse(asyncToken) : false ;
            let response =  await helper.api(headerToken).get("product/getfilters"); 

            let priceSliderValue = response.data.data.filter.prices; 
            let customFilters = response.data.data.filter.custom_filters ; 
            // let puffs = [] ; 
            let mahAndTasteArray=[] ;

            customFilters.map((item ,  index)=>{
                switch (item.type) {
                    // case "1":
                    //     puffs.push(item); 
                    //     break;
                    case "0":
                        mahAndTasteArray.push(item) ; 
                        break;
                    default:
                        break;
                }
            }); 

            runInAction(()=>{
                this.priceSliderValue = priceSliderValue ; 
                // this.puffs = puffs; 
                this.mahAndTestArray =  mahAndTasteArray ; 
            });
        }
        catch(err){
            console.log("error" , err);
            const errorCode = err.response.data.error
            const errorMessage =  helper.sendErrorMessage(errorCode);
            await AsyncStorage.setItem("@errorMessage" , errorMessage );
        }
    }

    getFilteredSubCategory = async (body) => {
        try {
            let asyncToken = await AsyncStorage.getItem("@logged_In_Token");
            let headerToken = asyncToken != null ? JSON.parse(asyncToken) : false ;
            // console.log("headerToken" , headerToken );
            let response =  await helper.api(headerToken).post("api/categories" , body ); 

            runInAction(()=>{
                this.subCategories = response?.data?.response ; 
            })
        }catch(error) {
            console.log("Error in getFilteredSubCategory " ,  error );
        }
    }

    setResultData = (data)=>{
        runInAction(()=>{
            this.resultData = { ...this.resultData , ...data }  
        });
    }

    clearResultData = () => {
        runInAction(()=>{
            // this.resultData = { ...this.resultData , filter : {} }  
            this.resultData = { }  
        });
    }

    logout = () => {
        try{
            runInAction(()=>{
                this.filteredProducts = [];
                this.priceSliderValue = {};
                this.puffs=[];
                this.vapeTaste=[];
                this.vapeCountry=[];
                this.mah=[];
                this.totalPage=""; 
                this.loader= true; 
                this.resultData={};
                this.totalProduct="" ; 
            });
        }catch(err){
            console.log(err);
        }
    }
}

const filterDetailsStore = new FilterDetailsStore();

export default filterDetailsStore;