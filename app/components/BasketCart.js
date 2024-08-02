import React , {useState , useeffect, useEffect ,  useReducer ,  useMemo }  from 'react';
import {View , Text ,  StyleSheet  , TouchableOpacity , ScrollView , ImageBackground    } from "react-native"; 
import helper from '../helpers/helper';
import colors from '../values/colors';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import { cloneDeep } from 'lodash';



const initialValue = {
    cart_id:"" , 
    name:"",
    price:0,
    product_id:0,
    quantity:0,
    stock:false, 
    thumb:"", 
    total:0,
    discountPrice:0,
    cardImage:"",
}

const reducer =(state , action) => {
    return {...state , ...action}
}

const BasketCart = ({
    stores , 
    data ,
    setBasketListData , 
    basketListData , 
}) => {
    // for add or remove one more product
    const [addProduct, setAddProduct] = useState(1);
    const [disabled, setDisabled] = useState(false);
    const [state , dispatch ]=useReducer(reducer , initialValue);

    useEffect(()=> {
        const {
            cart_id , 
            product_id,
            name,
            price,
            quantity,
            stock, 
            thumb , 
            total, 
            discountPrice, 
            cardImage , 
            detailsImage , 
        } = data; 
        dispatch({
            cart_id , 
            name,
            price,
            product_id,
            quantity,
            stock, 
            total,
            discountPrice, 
            cardImage : cardImage || detailsImage || thumb , 
        }); 
        setAddProduct(quantity);
    }, []);

    useEffect(()=>{
        clearTimeout(edit);
        const edit = setTimeout(() => {
            editProduct(state.cart_id , addProduct ); 
        }, 200);
        setAsyncaddProduct();   
    }, [addProduct]); 

    // FUNCTIONS
    const addOne = async () => {
        try{
            // clearTimeout(addOne); 
            // we can make this number smaller or bigger tahn 100
            if(addProduct===100){
                return ;
            }; 
            const quntity = addProduct + 1 ; 
            setAddProduct(quntity);
    
            // api 
            let resultValue = {
                "product_id": state.product_id , 
                "quantity": quntity
            }; 
            setAsyncaddProduct(addProduct);   
        }catch(err){
            console.log(err); 
        }
    }

    const removeOne = async () => {
        try{
            if(addProduct===0){
                setVisibility(false);
                return;
            }; 
            const quntity = addProduct - 1 ; 
            setAddProduct(quntity);
            // asyncStore
            setAsyncaddProduct(addProduct);
        }catch(err){
            console.log(err); 
        }
    }


    const setAsyncaddProduct = async () => {
        try {
            let asyncProductArray  = cloneDeep(basketListData);
            let filterProduct = asyncProductArray.map((item)=>{
                if(item.product_id === state?.product_id){
                    item = {...item , "quantity": addProduct}
                }
                return item ;
            }); 
            setBasketListData([...filterProduct]);
            await stores.BasketStore.setAsyncBasketProducts(filterProduct);
            refreshData();
            setDisabled(true);
            setTimeout(() => {
                setDisabled(false);
            }, 500);
        }catch(err){
            console.log(err);
        }
    }

    // refresh data 
    const refreshData = async () => {
        try{
            await stores.BasketStore.getAsyncBasketProduct();
        }
        catch(err) {
            console.log(err); 
        }
    }


    const editProduct = async (cardId , quantity ) => {
        try {
            //  for api
            let resultValue = {
                "cart_id": cardId , 
                "quantity": quantity , 
            }; 

            // when user loged in this will give true; 
            await stores.BasketStore.editProductFromBasket(resultValue); 
        }catch(err) {
            console.log("err" , {err}); 
        } 
    }


    const deleteProductFromBasket = async () => {
        try{
            // for asyncStorage
            let asyncProductArray  = cloneDeep(basketListData);
            let removedArray = asyncProductArray?.filter((element)=> element.product_id !== state.product_id); 
            setBasketListData([...removedArray]);
            await stores.BasketStore.setAsyncBasketProducts(removedArray);
            // when user loged in this will give true; 
            // send data to api 
            let resultValue = {
                "cart_id": state.cart_id , 
            }; 
            await stores.BasketStore.removeProductFromBasket(resultValue);
        }catch(err){
            console.log("err", err);
        }
    }

    return(
        <View style={styles.container}>
            {
                state?.cardImage ?
                <ImageBackground 
                source={{uri: state?.cardImage }}
                resizeMode="contain"
                style={styles.imageProduct}
                imageStyle={styles.thumb}
                ></ImageBackground> 
                :null
            }
            <View style={styles.infoContainer}>
                <Text style={styles.infoTitle}>{state.name}</Text>
                <View style={styles.descriptionContainer}>
                    <Text style={styles.infodescription}>{data.subTitle} </Text>
                    <Text style={styles.infodescription}>{data.zataj}</Text>
                </View>
                <View style={styles.buttonAndPriceCon}>
                    <View style={styles.increaseDecreaseContainer}>
                        <TouchableOpacity
                        disabled={addProduct<=1?true:disabled} 
                        onPress={()=>removeOne()}
                        style={styles.buttons}
                        >                    
                            <FontAwesome name="minus" size={10} color={addProduct<=1 ? colors.boderSecond : colors.black}/>
                        </TouchableOpacity>
                        <Text style={styles.increaseDecreaseText}>{addProduct}</Text>
                        <TouchableOpacity 
                        disabled={disabled}
                        onPress={()=>addOne()}
                        style={styles.buttons}>
                            <FontAwesome name="plus" size={10} color={colors.black}/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.priceContainer}>
                        {
                            state.discountPrice ?
                            <>
                            <Text style={styles.newPrice}>{addProduct*state.discountPrice}₼</Text>
                            <Text style={styles.oldPrice}>{addProduct*state.price}₼</Text>
                            </>
                            :
                            <Text style={styles.newPrice}>{addProduct*state.price}₼</Text>
                        }
                    </View>
                </View>
            </View>

            <TouchableOpacity 
            style={styles.deleteButton}
            onPress={()=>deleteProductFromBasket()}
            >
                <Ionicons name="ios-trash-outline" size={20} color={colors.black}/>
            </TouchableOpacity>
        </View>
    )
}

const styles =  StyleSheet.create({
    container: {
        paddingVertical:helper.px(16),
        flexDirection: "row" ,
        justifyContent: "space-between",
    }, 
    imageProduct: {
        width:helper.px(80),
        // height:helper.px(80),
        height: "100%",
        borderWidth:helper.px(1), 
        borderColor:colors.border,
    }, 
    thumb:{
        width: "95%" , 
        position:"absolute" , 
        left: "2.5%",
        height:"100%",
    },
    infoContainer: {
        width: "50%"
    },
    descriptionContainer:{
        flexDirection: "row",
        marginBottom:helper.px(10),
    }, 
    infoTitle:{
        fontFamily:helper.fontFamily("Bold"),
        fontWeight: "600", 
        fontSize: helper.px(16),
        lineHeight: helper.px(20), 
        color:colors.text,
        marginBottom: helper.px(4),
    }, 
    infodescription: {
        fontFamily:helper.fontFamily("Bold"),
        fontWeight: "600", 
        fontSize: helper.px(10),
        lineHeight: helper.px(12), 
        color: colors.subTitle,
    }, 
    increaseDecreaseContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: helper.px(80),
        height: helper.px(36),
        borderWidth: helper.px(1),
        borderColor: colors.border,
    },
    buttons:{
        width: helper.px(30),
        height:"100%",
        alignItems:"center",
        justifyContent:"center",
    },
    increaseDecreaseText: {
        fontFamily:helper.fontFamily("Bold"),
        fontSize: helper.px(16), 
        fontWeight: "600", 
        lineHeight:helper.px(20),
        color: colors.text,
    },
    buttonAndPriceCon:{
        flexDirection: "row" , 
    },
    deleteButton: {
        borderRadius: 100, 
        width:helper.px(40),
        height:helper.px(40),
        backgroundColor: colors.lightButton,
        justifyContent:"center", 
        alignItems:"center",
    }, 
    priceContainer:{
        flexDirection:"row", 
        alignItems:"center",
        marginLeft: helper.px(11),
    },
    newPrice:{
        fontSize: helper.px(16), 
        fontFamily: helper.fontFamily("Bold"),
        fontWeight: '600', 
        lineHeight: helper.px(20), 
        color: colors.text,
        marginRight: helper.px(8),
    },
    oldPrice:{
        fontSize: helper.px(14), 
        fontFamily: helper.fontFamily(),
        fontWeight: '300', 
        lineHeight: helper.px(17), 
        color: colors.subTitle,
        textDecorationLine: "line-through",
    },



}); 

export default helper.mobx(BasketCart); 