import React , {useState , useRef, useEffect ,  useMemo}  from 'react';
import {View , Text ,  StyleSheet  , TouchableOpacity , ScrollView ,  ActivityIndicator  } from "react-native"; 
import Authlayout from "../layouts/AuthLayout";
import helper from '../helpers/helper';
import colors from '../values/colors';
import CategoryButton from '../components/CategoryButton';
import Cart from "../components/Cart"; 
import {useNavigation , useIsFocused } from '@react-navigation/native';
import {FILTERDETAILS} from "../values/screensList"; 
import BasketButton from "../components/BasketButton"; 
import AgeConfirmationModal from '../modals/AgeConfirmationModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = (props) => {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [choosen , setChoosen]=  useState(false); 
    // const [ ageConfirmation , setAgeConfirmation ] = useState(false); 
    const brands = useMemo (()=>  props.stores.HomepageStore.brands , [props.stores.HomepageStore.brands]) ;
    const discountedProducts = useMemo (()=>  props.stores.HomepageStore.discountedProducts , [props.stores.HomepageStore.discountedProducts]) ;
    let loader = useMemo(()=>props.stores.HomepageStore.loader); 
    // for Favorites 
    const [wishList, setWishList] = useState([]);
    const [wishListItems, setwishListItems] = useState([]);
    const asyncWishlistProducts  =  useMemo(()=> props.stores.WishListStore.asyncWishProductList, [props.stores.WishListStore.asyncWishProductList] ); 
    const asyncWishIds = useMemo(()=> props.stores.WishListStore.asyncWishIdList , [props.stores.WishListStore.asyncWishIdList]);
    const wishlistFromApi = useMemo(()=> props.stores.WishListStore.wishList , [props.stores.WishListStore.wishList]);
    const wishIdFromApi = useMemo(()=> props.stores.WishListStore.wishId , [props.stores.WishListStore.wishId]);
    // RENDERS HOME PAGE WHEN ASYNCbASKETLIST OR BASKETLIST FROM BACKEND CHANGES
    const [basketProducts ,  setBasketProducts ]= useState([]); 
    const asyncBasketProducts  =  useMemo(()=> props.stores.BasketStore.asyncBasketProductList , [props.stores.BasketStore.asyncBasketProductList]); 
    const basketList = useMemo(()=>props.stores.BasketStore.basketList , [props.stores.BasketStore.basketList] ); 

    

    // for getting data and show loader if data is not laoded
    useEffect(()=>{
        let mounted =  true ; 
        if(mounted) {
            // checkAge(); 
            getData(); 
        }
        if(isFocused){
            getWishlist(); 
            getBasketList();
        }
        return () => {
            mounted =  false ; 
        }
    }, [
        loader , 
        isFocused
    ]); 


    // for getting wishlist
    useEffect(()=> {
        if(!wishIdFromApi.length){
            setWishList(asyncWishIds); 
            setwishListItems(asyncWishlistProducts);
        }else {
            setWishList(wishIdFromApi); 
            setwishListItems(wishlistFromApi);
        }
    }, [asyncWishlistProducts ,  wishlistFromApi]); 


    useEffect(()=>{  
         if(!basketList?.length){
            // console.log("asyncBasketProducts length true" );
            setBasketProducts(asyncBasketProducts);
        }else if(basketList?.length){
            // console.log("basketList length true " );
            setBasketProducts(basketList);
        }else {
            // console.log("ELSE");
            setBasketProducts([]);
        }

        // console.log("asyncBasketProducts ---async" ,  asyncBasketProducts );
        // console.log("basketList---from api" ,  basketList );
        // console.log("basketProd ---- this is state " ,  basketProducts );

    } , [asyncBasketProducts , basketList]); 


    // get homepage data
    const getData = async ()=>{
        try{
            await props.stores.HomepageStore.getHomePageData(); 
        }catch(err){
            console.log("homePage error: ", {err}); 
        }
    }

    // for getting favorites list choosen before
    const getWishlist = async () => {
        try{ 
            // write function here ---> send getwislist and asign value asyncstorage
            let islogedIn = await props.stores.WishListStore.getWishlist();
            await props.stores.WishListStore.getAsyncWishlist();
            
        }catch(err){
            console.log("homePage getWishlist err" , err);
        }
    }

    // get basketlist 
    const getBasketList = async ()=>{
        try{
            // getBasketList
            await  props.stores.BasketStore.getBasketList(); 
            await  props.stores.BasketStore.getAsyncBasketProduct();
        }catch(err){
            console.log("homePage getBasketList error: ", {err}); 
        }
    }

    const FilterChoosen = (value , name) => {
        setChoosen(prev => prev!==value ? value : false );
        navigation.navigate(FILTERDETAILS , {
            value , 
            name ,
            brands: brands?.data ,  
            products : discountedProducts?.data ,
        });
    }


    // AgeConfirmation modal visibility setting
    const checkAge = async () => {
        try{
            await AsyncStorage.getItem("@age_Confirmation").then((data)=>{
                if(data !== null) {
                    setAgeConfirmation(false);
                }else{
                    setAgeConfirmation(true);
                }
            }); 
        }catch(Err) {
            console.log("err" , {Err}); 
        }
    }

    return (
        <>
        <Authlayout
        introHeader={loader?false:true}
        loader={loader}
        >
            {
                loader? 
                <View style={styles.layoutLoader}>
                    <ActivityIndicator size="large" color="#fff" />
                </View>
                :
                <View style={styles.layout}>
                    {/* {
                        brands?.length? */}
                        <View style={styles.filter}>
                            <Text style={styles.filterTitle}>
                                {brands?.title}
                            </Text>
                            <ScrollView 
                            style={styles.scrollContainer}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            >
                                {
                                    brands?.data?.map((item, index)=>(
                                        <CategoryButton
                                        key={`categoryButton-${index}`}
                                        firstChild={index===0 ? true : false}
                                        lastChild={ index === brands?.data?.length-1 ? true : false}
                                        data={item}
                                        choosen={choosen===item.id ? true : false}
                                        filter = {(value , choosenName ) => FilterChoosen(value , choosenName)}
                                        />
                                    ))
                                }
                            </ScrollView>
                        </View>
                        {/* :null
                    } */}

                    {
                        discountedProducts&&discountedProducts.data.length ? 
                        <View style={styles.saleConatiner}>
                        <Text style={styles.filterTitle}>
                            {discountedProducts?.title}
                        </Text>
                        {
                            discountedProducts?.data?.map((item , index)=>(
                                <Cart
                                key={`saleCart${index}`}
                                data={item}
                                wishList={wishList}
                                setWishList={(newList)=>setWishList(newList)}
                                setwishListItems={(newItem)=>setwishListItems(newItem)}
                                wishListItems={wishListItems}
                                />
                            ))
                        }  
                        </View>
                        :null
                    }
                    {/* <AgeConfirmationModal 
                        visibility={ageConfirmation}
                        setVisibility={(cbValue)=>setAgeConfirmation(cbValue)}
                    /> */}
                </View>
            }         
        </Authlayout>
        {
            loader? null :
            (
            basketProducts.length? 
            <BasketButton
            setProducts={(value)=>setBasketProducts(value)}
            products={basketProducts}
            />
            :null
            )
        }
        </>
    )
}

const styles = StyleSheet.create({
    layout:{
        paddingBottom:helper.px(30),
    },
    layoutLoader:{
        height:helper.screenHeight ,  
        justifyContent: "center" , 
        alignItems: "center",
        paddingHorizontal: helper.px(20),
        backgroundColor: colors.text , 
    },
    scrollContainer:{
    },
    filter: {
        paddingHorizontal: helper.px(20),
    },
    saleConatiner:{
        paddingHorizontal: helper.px(20),
    },
    filterTitle: {
        fontWeight: "700", 
        fontFamily:helper.fontFamily(),
        fontSize: helper.px(24), 
        lineHeight: helper.px(30),
        color:colors.text, 
        marginBottom: helper.px(23),
        marginTop: helper.px(32),
    }, 
   
}); 

export default helper.mobx(Home);