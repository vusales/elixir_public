import React,  {useEffect, useState ,  useMemo , useRef } from "react";
import {View , Text ,  StyleSheet  , TouchableOpacity , ScrollView , ImageBackground    } from "react-native"; 
import Modal from "react-native-modal";
import helper from "../helpers/helper";
import colors from "../values/colors";
// import DropDownPicker from 'react-native-dropdown-picker';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { useNavigation } from "@react-navigation/native";
import { cloneDeep } from "lodash";

export function useIsMounted() {
    const isMounted = useRef(false);
  
    useEffect(() => {
      isMounted.current = true;
      return () => isMounted.current = false;
    }, []);
  
    return isMounted;
  }


const CartModal = ({
    stores , 
    visibility ,
    setVisibility , 
    data  , 
    setWishList , 
    wishList , 
    setwishListItems , 
    wishListItems,
}) => {

    const navigation = useNavigation(); 

    // dropdown picker required states
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([]);

    // item which we choose or click
    const [product, setProduct] = useState();
    // for add or remove one more product
    const [addProduct, setAddProduct] = useState(1);
    // wishList
    const [favorites, setFavorites] = useState(false);
    // disable wishList button 
    const [favDisabled ,  setFavDisabled] = useState(false);
    // for basket
    const asyncBasketProducts  =  useMemo(()=> stores.BasketStore.asyncBasketProductList , [stores.BasketStore.asyncBasketProductList] ); 

    // product details data 
    const {
        description , 
        discountPrice , 
        name , 
        price , 
        product_id , 
        options ,  
        detailsImage, 
    } = data ; 

    useEffect(()=>{
        setProduct(data);
        getAsyncBasketProducts();
        let ProductDetailropDownConstant = ghetDropdownItems();
        setItems(ProductDetailropDownConstant);
    }, []); 

    useEffect(()=>{
        isWishItem();
    }, [favorites, wishListItems]);


    // *********WISHLIST FUNCTIONS*******
    // check wishlist 
    const isWishItem = () => {
        let list = wishList ; 
        let inWishlist = list.includes(product_id);
        if(inWishlist){
            setFavorites(true); 
        }else {
            setFavorites(false); 
        }
    }

    const addRemoveFavorites =async(prd_id) => {
        if(favDisabled) return ;
        if(favorites){
            await removeItemFromWishlist(prd_id); 
            setFavorites(false);
        }else {
            await addItemToWishlist(prd_id);
            setFavorites(true);
        };
    }

    const addItemToWishlist = async (prd_id) => {
        try{
            setFavDisabled(true); 
            let list = wishList ; 
            let listOfItems = wishListItems ; 
            if(!list.includes(prd_id)){
                list.push(prd_id);
                listOfItems.push(product) ; 
            } 
            
            // state change 
            setwishListItems(listOfItems);
            setWishList(list) ;      
            // api request 
            let addSingItemToWishlist = await stores.WishListStore.addSingItemToWishlist(prd_id);
            // async store change 
            if(!addSingItemToWishlist){
                await stores.WishListStore.setAsyncWishlist(list , listOfItems) ; 
                 setTimeout(() => {
                    setFavDisabled(false); 
                }, 500);
            }
        }catch(err){
            console.log("addItemToWishlist ERROR" , {err} );
        }
    }

    const removeItemFromWishlist = async(prd_id) => {
        try{
            setFavDisabled(true); 
            let list =wishList ; 
            let listOfItems = wishListItems ; 
            let removedArray =  list.filter((element)=> element!==prd_id) ; 
            let removedProduct = listOfItems.filter((element)=> element.product_id!==prd_id ); 
            setwishListItems(removedProduct);
            setWishList(removedArray) ;              
            let removeItemFromWishlist = await stores.WishListStore.removeItemFromWishlist(prd_id); 
            if(!removeItemFromWishlist){
                await stores.WishListStore.setAsyncWishlist(removedArray , removedProduct) ; 
                setTimeout(() => {
                    setFavDisabled(false); 
                }, 500);
            }
        }catch(err){
            console.log("removeItemFromWishlist ERROR" , {err} );
        }
    }
    // *********THE END*******


    // *********DROPDOWN REQUIRED FUNCTIONS*******
    const ghetDropdownItems = () => {
        const ProductDetailDropDown = [];
        options?.map((item)=>{
           item.product_option_value.map((subItem)=>{
            let data = {
                label: subItem.name ,
                // maybe i send this value incorrect and it will be changed for back 
                value: subItem.product_option_value_id 
            };
            ProductDetailDropDown.push(data)
            })
        });
        return ProductDetailDropDown; 
    }
    // *********THE END*******


    // *********BASKET FUNCTIONS*******

    const getAsyncBasketProducts = async() => {
        try{
            await stores.BasketStore.getAsyncBasketProduct(); 
        }catch(err){
            console.log(err); 
        }
    }

    const addOne = () => {
        // we can make this number smaller or bigger tahn 100
        if(addProduct===100){
            return ;
        }; 
        setAddProduct(addProduct+1);
    }

    const removeOne = () => {
        if(addProduct===0){
            setVisibility(false);
            return ;
        }; 
        setAddProduct(addProduct-1);
    }


    const addCart = async (id) => {
        try{
            clearTimeout(addPr); 
            //api (if user loged in) 
            let resultValue = {
                "product_id": id , 
                "quantity" : addProduct ,
            }
            const addPr =  setTimeout(async() => {
                await  stores.BasketStore.addProductToBasket(resultValue); 
            }, 500);

            // asynstore 
            let asyncArray = cloneDeep(asyncBasketProducts)  ; 
            let asyncItem ; 
            if(asyncArray.length){
                if(!asyncArray.find((item)=>item.product_id===product_id)){
                    asyncItem = [...asyncArray , {...data , "quantity": addProduct }] ; 

                }else {
                    asyncItem = asyncArray?.map((element)=>{
                        if(element.product_id === product_id){
                            let newElement = { ...element ,  "quantity": addProduct }
                            element = newElement ; 
                        }
                        return element; 
                    }); 
                }
            }else {
                asyncItem = [{...data,  "quantity": addProduct}] ;
            }
            await  stores.BasketStore.setAsyncBasketProducts(asyncItem); 
            
            setVisibility(false);
        }catch(err){
            console.log("add cart function error" ,  err); 
        }
    }
    // *********THE END*******



    // component
    return(
       <Modal
       style={{margin: 0, bottom: 0 , ...styles.layoutModal}}
       animationIn={"slideInUp"}
       isVisible={visibility}
       onBackdropPress={()=>setVisibility(false)}
       onBackButtonPress={()=>setVisibility(false)}
       onSwipeComplete={()=>setVisibility(false)}
       deviceWidth={helper.screenWidth}
       swipeDirection={['down']}
       panResponderThreshold={50}
       >
        <View  style={styles.lineContainer}>
            <View style={styles.line}></View>
        </View>
        <ScrollView
        horizontal={false}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={"always"}
        >
            <ImageBackground
            source={{uri: detailsImage }} 
            style={styles.imageBg}
            imageStyle={styles.bgImage}
            resizeMode="contain"
            ></ImageBackground>

            <View style={styles.infoContainer}>
                <Text style={styles.title} >{name}</Text>
                <Text style={styles.description}>{description}</Text>
            </View>

            {/* <View>
                <DropDownPicker
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                listMode={"SCROLLVIEW"}
                style={styles.dropDown}
                placeholder="SECİN"
                placeholderStyle={{
                    color: colors.text,
                }}
                labelStyle={{
                    // inside dropdown input
                }}
                dropDownContainerStyle={{
                    // container
                    borderWidth: 1,
                    borderColor: colors.border,
                    position: "absolute" ,
                    bottom:0,
                    zIndex: 7000,
                    minHeight : helper.px(80),
                }}
                listItemLabelStyle={{
                    // all items for choose 
                    color: colors.text
                }}
                zIndex={6000}
                />
            </View> */}

            {/* <Text style={styles.subTitle}>{helper.translate("freedelivery")}</Text> */}
            <View style={styles.buttonsContainer} >
                <View style={styles.increaseDecreaseContainer}>
                    <TouchableOpacity 
                    onPress={()=>removeOne()}
                    style={styles.buttons}
                    // disabled={addProduct<=0}
                    >                    
                        <FontAwesome name="minus" size={10} color={addProduct<=0? colors.border :colors.black}/>
                    </TouchableOpacity>
                    <Text style={styles.increaseDecreaseText}>{addProduct}</Text>
                    <TouchableOpacity 
                    onPress={()=>addOne()}
                    style={styles.buttons}>
                        <FontAwesome name="plus" size={10} color={colors.black}/>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity 
                style={styles.addCart}
                onPress={()=>addCart(product_id)}
                >
                    <SimpleLineIcons name="bag" size={15} color={colors.main} />
                    <Text style={styles.addCartText}>{helper.translate("tocart")}</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                onPress={()=>addRemoveFavorites(product_id)}
                style={ 
                    favDisabled ? 
                    { ...styles.favoritesButton , backgroundColor: colors.border }:
                    (favorites? {...styles.favoritesButton , ...styles.fav}:styles.favoritesButton)
                } 
                disabled={favDisabled}
                >
                    <FontAwesome 
                    name="heart-o" 
                    size={16} 
                    color={
                        favDisabled ? 
                        colors.black :
                        favorites? colors.main :colors.text
                    } 
                        style={styles.heartIcon}
                    />
                </TouchableOpacity>
            </View>   
        </ScrollView>
       </Modal>
    )

}

const styles =  StyleSheet.create({
    layoutModal: {
        backgroundColor: colors.main , 
        padding: helper.px(16),
        borderTopRightRadius: helper.px(10),
        borderTopLeftRadius: helper.px(10), 
    },
    lineContainer: {
        width: "100%", 
        justifyContent:"center" ,
        alignItems: "center" , 
        marginBottom: helper.px(16) ,
    },
    line:{
        width: helper.px(134), 
        height: helper.px(5),
        backgroundColor: colors.border, 
    },
    imageBg: {
        borderWidth: helper.px(1),
        borderColor: colors.border,
        width: "100%",
        height:helper.px(358), 
    }, 
    bgImage:{
        width:"95%",
        position:"absolute" , 
        left: "2.45%",
    },
    infoContainer:{
        marginBottom: helper.px(20) ,
        marginTop:helper.px(20) ,
    },
    title: {
        fontSize: helper.px(24), 
        fontWeight: "700", 
        fontFamily:helper.fontFamily(),
        lineHeight:helper.px(30),
        color: colors.text,
        marginBottom: helper.px(20) ,
    }, 
    description: {
        fontFamily:helper.fontFamily(),
        fontSize: helper.px(16), 
        fontWeight: "400", 
        lineHeight:helper.px(20),
        color: colors.text,
    },
    dropDown:{
        borderColor: colors.border, 
        borderRadius: helper.px(0),
        marginBottom:helper.px(30),
        position: "relative"
    },
    buttonsContainer:{
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems: "center",
        marginBottom: helper.px(50),
    },
    subTitle: {
        marginBottom: helper.px(13),
        
    },
    increaseDecreaseContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: helper.px(108),
        height: helper.px(44),
        borderWidth: helper.px(1),
        borderColor: colors.border,
    },
    buttons:{
        width: helper.px(40),
        height:"100%",
        alignItems:"center",
        justifyContent:"center",
    },
    increaseDecreaseText: {
        // fontSize: helper.px(12), 
        fontFamily:helper.fontFamily("Bold"),
        fontSize: helper.px(14), 
        fontWeight: "600", 
        lineHeight:helper.px(16),
        color: colors.text,
    },
    addCart:{
        width:helper.px(179),
        height:helper.px(45.49),
        backgroundColor:colors.text,
        alignItems:"center",
        justifyContent:"center",
        flexDirection:"row",
        borderRadius: helper.px(40),
    },
    addCartText:{
        fontFamily:helper.fontFamily("Bold"),
        fontSize: helper.px(14), 
        fontWeight: "600", 
        lineHeight:helper.px(17),
        color: colors.main,
        marginLeft: helper.px(8),
    },
    favoritesButton:{
        width:helper.px(45),
        height:helper.px(45),
        alignItems:"center",
        justifyContent:"center",
        borderWidth: helper.px(1),
        borderColor: colors.border, 
        borderRadius: helper.px(100),
    }, 
    fav: {
        backgroundColor: "#FF4D4D",
    }
})

export default helper.mobx(CartModal);