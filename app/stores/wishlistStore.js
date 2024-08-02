import {  makeAutoObservable, runInAction } from 'mobx';
import helper from '../helpers/helper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DiscountedProductsEntity from "../entity/DiscountedProductsEntity" ; 


class WishListStore {

    wishList = [];
    wishId= [] ;   
    asyncWishIdList =[]; 
    asyncWishProductList =[]; 

    constructor() {
        makeAutoObservable(this);
    }

    // for getting favorites hich choosen before
    getAsyncWishlist = async () => {
        try{
            let asyncWish = await AsyncStorage.getItem("@wish_list"); 
            let asyncWishProducts = await AsyncStorage.getItem("@wish_list_products"); 
            if(asyncWish !== null){
                let list =  JSON.parse(asyncWish); 
                let product = JSON.parse(asyncWishProducts);
                runInAction(()=>{
                    this.asyncWishIdList = list ; 
                    this.asyncWishProductList = product ; 
                });
                return true ; 
            }
            return false ; 
        }catch(err){
            console.log(err);
            return false ; 
        }
    }

    setAsyncWishlist = async( list , products ) => {
        try {

            let wishIds = JSON.stringify(list); 
            let wishProd = JSON.stringify(products);
            await AsyncStorage.setItem("@wish_list" ,  wishIds );
            await AsyncStorage.setItem("@wish_list_products" ,  wishProd);
            return true ; 
        }
        catch(err){
            console.log(err); 
            return false ; 
        }

    }

    getWishlist = async () => {
        try{
            let asyncToken = await AsyncStorage.getItem("@logged_In_Token");
            let asyncDeviceToken = await AsyncStorage.getItem("@device_Token");
            let headerToken = asyncToken != null ? JSON.parse(asyncToken) : false ;
            let deviceToken = asyncDeviceToken != null ? JSON.parse(asyncDeviceToken) : false ;  

            if(headerToken !== deviceToken &&  headerToken && deviceToken) {
                let response = await helper.api(headerToken).get("wishlist");

                let wish = new DiscountedProductsEntity(response.data.products); 
                let wishIds = wish.map((element)=> element.product_id); 
                runInAction(()=>{
                    this.wishList = wish ; 
                    this.wishId = wishIds ;
                });
                return true; 
            }
            return false ; 
        }
        catch(err){
            return false; 
        }
    }
    
    sendWishList = async (data) => {
        try{
            let asyncToken = await AsyncStorage.getItem("@logged_In_Token");
            let asyncDeviceToken = await AsyncStorage.getItem("@device_Token");
            let headerToken = asyncToken != null ? JSON.parse(asyncToken) : false ;
            let deviceToken = asyncDeviceToken != null ? JSON.parse(asyncDeviceToken) : false ;  

            if(headerToken !== deviceToken ) {
                let wishData = data.map((item)=> Number(item));
                let response = await helper.api(headerToken).post("wishlist/addarray" , {"products": wishData} );
                runInAction(()=>{});
                return true;
            }
            return false;
        }catch(err){
            // const errorCode = err.response.data.error
            // const errorMessage =  helper.sendErrorMessage(errorCode);
            // await AsyncStorage.setItem("@errorMessage" , errorMessage );
            return false;

        }
    };

    removeItemFromWishlist = async (data) => {
        try{
            let asyncToken = await AsyncStorage.getItem("@logged_In_Token");
            let asyncDeviceToken = await AsyncStorage.getItem("@device_Token");
            let headerToken = asyncToken != null ? JSON.parse(asyncToken) : false ;
            let deviceToken = asyncDeviceToken != null ? JSON.parse(asyncDeviceToken) : false ;  

            if(headerToken !== deviceToken ) {
                let removedItem = Number(data) ;
                let response = await helper.api(headerToken).post("wishlist/remove" , {"product_id": removedItem});
                runInAction(()=>{});
                return true ; 
            }
            return false;
        }catch(err){
            console.log("err in removeItemFromWishlist" , err);
            return false ; 

        }
    }

    addSingItemToWishlist = async (data) => {
        try{
            let asyncToken = await AsyncStorage.getItem("@logged_In_Token");
            let asyncDeviceToken = await AsyncStorage.getItem("@device_Token");
            let headerToken = asyncToken != null ? JSON.parse(asyncToken) : false ;
            let deviceToken = asyncDeviceToken != null ? JSON.parse(asyncDeviceToken) : false ;  

            if(headerToken !== deviceToken ) {
                let addedItem = Number(data) ;
                let response = await helper.api(headerToken).post("wishlist/add" , {"product_id": addedItem});
                runInAction(()=>{});
                return true ; 
            }
            return false ;

        }catch(err){
            console.log("err in addSingItemToWishlist" , err);
            return false ; 
        }
    }

    logout = () => {
        try{
            runInAction(()=>{
                this.wishList = [] ;  
            });
        }catch(err){
            console.log(err);
        }
    }

}

const wishListStore = new WishListStore();
export default wishListStore;