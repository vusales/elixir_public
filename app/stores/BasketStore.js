import {  makeAutoObservable, runInAction } from 'mobx';
import helper from '../helpers/helper';
import AsyncStorage from '@react-native-async-storage/async-storage';

class BasketStore {

    basketList = [] ; 
    asyncBasketProductList = [] ;
    asyncBasketProductIdList = [] ; 
     
    constructor() {
        makeAutoObservable(this);
    }

    getAsyncBasketProduct = async() => {
        try{
            let basketProducts =  await AsyncStorage.getItem("@basket_products"); 
            let basketPrIds = await AsyncStorage.getItem("@basket_ids"); 
            let products = basketProducts!==null ?  JSON.parse(basketProducts): [] ; 
            let ids =  basketPrIds!==null ?  JSON.parse(basketProducts) : [] ; 

            // console.log("products in BasketStore" ,  products );
            // console.log("ids in BasketStore" ,  ids );


            runInAction(()=>{
                this.asyncBasketProductList = products ;
                this.asyncBasketProductIdList = ids ; 
            }); 
        }catch(err){
            if(err){
                console.log(err);
            }
        }
    }

    setAsyncBasketProducts = async (basketProducts) => {
        try{
            if(basketProducts.length){
                let products =  JSON.stringify(basketProducts); 
                // console.log("--store setAsyncBasketProducts" , products); 

                await AsyncStorage.setItem("@basket_products" , products);

                // setting value with i send back when user loged in 
                let ids =  basketProducts.map((element)=>{
                    let resultValue = {
                        "product_id": element.product_id ,
                        'quantity': element.quantity , 
                    }

                    return resultValue ; 
                }); 
                await AsyncStorage.setItem("@basket_ids",  JSON.stringify(ids)); 
            }else{
                await AsyncStorage.setItem("@basket_products" , JSON.stringify([]));
                await AsyncStorage.setItem("@basket_ids",  JSON.stringify([])); 
            } 
            this.getAsyncBasketProduct();
        }catch(err){
            if(err){
                console.log(err);
            }
        }
    }

    sendBasketList = async (body) => {
        try{
            // body = [
            //     {
            //     'product_id':1,
            //     'quantity':1
            //     }
            // ]
            // console.log("body in senBasket list " , body);
            let asyncToken = await AsyncStorage.getItem("@logged_In_Token");
            let asyncDeviceToken = await AsyncStorage.getItem("@device_Token");
            let headerToken = asyncToken != null ? JSON.parse(asyncToken) : false ;
            let deviceToken = asyncDeviceToken != null ? JSON.parse(asyncDeviceToken) : false ;  

            if(headerToken !== deviceToken&& headerToken && deviceToken  ) {

                let response = await helper.api(headerToken).post("ncart/addArray" , body ); 

                runInAction(()=>{
                });
                return true ; 
            }
        }catch(err){
            console.log("err",  err) ; 
            return false; 
        }
    };
    
    getBasketList = async () => {
        try{
            let asyncToken = await AsyncStorage.getItem("@logged_In_Token");
            let asyncDeviceToken = await AsyncStorage.getItem("@device_Token");
            let headerToken = asyncToken != null ? JSON.parse(asyncToken) : false ;
            let deviceToken = asyncDeviceToken != null ? JSON.parse(asyncDeviceToken) : false ;  

            // console.log("headerToken" , headerToken );
            // console.log("deviceToken" , deviceToken );

            if(headerToken != deviceToken ){
                let response = await helper.api(headerToken).get("ncart"); 
                let products = response.data.products ; 

                runInAction(()=>{
                    this.basketList = products ; 
                });
                return true ; 
            }else {
                return false;
            }

        }catch(err){
            console.log("err",  err) ; 
            return false; 
        }
    };


    addProductToBasket = async (body ) => {
        try{
            let asyncToken = await AsyncStorage.getItem("@logged_In_Token");
            let asyncDeviceToken = await AsyncStorage.getItem("@device_Token");

            let headerToken = asyncToken != null ? JSON.parse(asyncToken) : false ;
            let deviceToken = asyncDeviceToken != null ? JSON.parse(asyncDeviceToken) : false ;  

            if(headerToken !== deviceToken && headerToken && deviceToken ) {
                let response = await helper.api(headerToken).post("ncart/add" , body ); 
                await this.getBasketList();
                return true; 
            }
            return false; 
        }catch(err){
            console.log("err",  err) ; 
            return false; 
        }
    };

    editProductFromBasket = async ( body ) => {
        try{
            let asyncToken = await AsyncStorage.getItem("@logged_In_Token");
            let asyncDeviceToken = await AsyncStorage.getItem("@device_Token");
            let headerToken = asyncToken != null ? JSON.parse(asyncToken) : false ;
            let deviceToken = asyncDeviceToken != null ? JSON.parse(asyncDeviceToken) : false ;  

            if(headerToken !== deviceToken && headerToken && deviceToken ) {

                let response = await helper.api(headerToken).post("ncart/edit" , body ); 
                // console.log("decreaseProductFromBasket response ", response); 
            
                await this.getBasketList();
                return true
            }
            return false; 
        }catch(err){
            console.log("err",  err) ; 
        }
    };

    removeProductFromBasket = async (body ) => {
        try{
            // body = {‘product_id’: number; }
            let asyncToken = await AsyncStorage.getItem("@logged_In_Token");
            let asyncDeviceToken = await AsyncStorage.getItem("@device_Token");
            let headerToken = asyncToken != null ? JSON.parse(asyncToken) : false ;
            let deviceToken = asyncDeviceToken != null ? JSON.parse(asyncDeviceToken) : false ;  

            if(headerToken !== deviceToken && headerToken && deviceToken ) {
                let response = await helper.api(headerToken).post("ncart/remove" , body ); 
                // console.log("removeProductFromBasket response ", response); 
            
                // runInAction(()=>{
                //     this.basketList = [] ; 
                // })

                await this.getBasketList();
                return true;
            }
            return false;

        }catch(err){
            console.log("err",  err) ; 
            return false;
        }
    };


    cleanBasket =  async () => {
        try{
            // await AsyncStorage.multiRemove([ "basket_products" , "basket_ids" ]).then(()=>{
            //     console.log("succes") ; 
            // }).catch((err)=>console.log("async resetDeliveryPrice" ,  err));

            await AsyncStorage.setItem( "basket_products" , JSON.stringify([]) ); 
            await AsyncStorage.setItem( "basket_ids" , JSON.stringify([]) ); 

            keys = await AsyncStorage.getAllKeys()
            // console.log("keys" , keys);

            runInAction(()=>{
                this.basketList = [] ;
                this.asyncBasketProductList =[] ;
                this.asyncBasketProductIdList =[] ;  
            }); 
        }
        catch(err) {
            console.log("cleanBasket",  err) ; 
        }
    }


    // logout = () => {
    //     try{
    //         runInAction(()=>{});
    //     }catch(err){
    //         console.log(err);
    //     }
    // }
}

const basketStore = new BasketStore();

export default basketStore;