import React , {useState, useEffect, useMemo , useCallback }  from 'react';
import {View , Text ,  StyleSheet  , TouchableOpacity , ScrollView ,  TextInput , FlatList , ImageBackground, Image } from "react-native"; 
import helper from '../helpers/helper';
import colors from '../values/colors';
import Cart from "../components/Cart";
import {useNavigation, useIsFocused } from '@react-navigation/native';
import BasketButton from '../components/BasketButton';
import { ActivityIndicator } from 'react-native';
import { GoBackButton ,  FilterButton , DataNotFounComponnet } from '../components';

const FilterDetails = ({route , stores}) => {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const value =  route.params.value;
    const brands =  route.params.brands;
    const name =  route.params.name ;
    const [choosenButton , setChoosenButton]=useState(value);
    const [ choosenName , setChoosenName]=useState("");
    const [count ,  setCount ]=useState(1);
    let filteredProducts = useMemo(()=>stores.FilterDetailsStore.filteredProducts , [stores.FilterDetailsStore.filteredProducts]);
    let totalPage = useMemo(()=>stores.FilterDetailsStore.totalPage ,  [stores.FilterDetailsStore.totalPage]);
    // choosen filters 
    const resultFilterData=useMemo(()=> stores.FilterDetailsStore.resultData , [stores.FilterDetailsStore.resultData]); 
    // for Favorites 
    const [wishList, setWishList] = useState([]);
    const [wishListItems, setwishListItems] = useState([]);
    const asyncWishlistProducts  =  useMemo(()=> stores.WishListStore.asyncWishProductList, [stores.WishListStore.asyncWishProductList] ); 
    const asyncWishIds = useMemo(()=> stores.WishListStore.asyncWishIdList , [stores.WishListStore.asyncWishIdList]);
    const wishlistFromApi = useMemo(()=> stores.WishListStore.wishList , [stores.WishListStore.wishList]);
    const wishIdFromApi = useMemo(()=> stores.WishListStore.wishId , [stores.WishListStore.wishId]);
    // RENDERS HOME PAGE WHEN ASYNCbASKETLIST OR BASKETLIST FROM BACKEND CHANGES
    const [basketProducts ,  setBasketProducts ]= useState([]); 
    const asyncBasketProducts  =  useMemo(()=> stores.BasketStore.asyncBasketProductList , [stores.BasketStore.asyncBasketProductList]); 
    const basketList = useMemo(()=>stores.BasketStore.basketList , [stores.BasketStore.basketList] ); 

    // second useEffect created because of ChooseName,
    // ChooseName changes on every fetch data and it is not desired
    useEffect(()=>{
        setChoosenName(name);
    },[name]);

    // Filter details page specific 
    useEffect(()=>{
        let mounted =  true ; 

        if(mounted){
            getFilteredProducts(choosenButton ,  count);
        }

        return () => {
            mounted =  false ; 
        }

    }, [choosenButton ,  count ]);


    // wishlist and basketlist products
    // for getting data and show loader if data is not laoded
    useEffect(()=>{
        let mounted =  true ; 
        // if(mounted) {
        // }
        if(isFocused){
            getWishlist(); 
            getBasketList();
        }
        return () => {
            mounted =  false ; 
        }
    }, [
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
            setBasketProducts(asyncBasketProducts);
        }else {
            setBasketProducts(basketList);
        }
    } , [asyncBasketProducts , basketList]); 

    // for getting favorites list choosen before
    const getWishlist = async () => {
        try{ 
            // write function here ---> send getwislist and asign value asyncstorage
            let islogedIn = await stores.WishListStore.getWishlist();
            await stores.WishListStore.getAsyncWishlist();
            
        }catch(err){
            console.log("homePage getWishlist err" , err);
        }
    }

    // get basketlist 
    const getBasketList = async ()=>{
        try{
            // getBasketList
            await  stores.BasketStore.getBasketList(); 
            await  stores.BasketStore.getAsyncBasketProduct();
        }catch(err){
            console.log("homePage getBasketList error: ", {err}); 
        }
    }


    // **** Filter details page specific functions ****
    const getFilteredProducts = async (id, pageCount) => {
        try{
            clearTimeout(getFilteredTimeOut); 
            let result ; 
            if(resultFilterData.filter || resultFilterData.price_max || resultFilterData.price_min ){
                result = {
                    ...resultFilterData , 
                    "manufacturer_id": id , 
                    "page": pageCount,
                }
            }else {
                result = {
                    "manufacturer_id": id , 
                    "page": pageCount,
                }
            }
            await stores.FilterDetailsStore.setResultData(result);

            const getFilteredTimeOut = setTimeout(async() => {
                await stores.FilterDetailsStore.getFilteredProducts(result);
            }, 500);

        }catch(error){
            console.log("getFilteredProducts error" , {error});
        }
    }

    // this function have to run when flatlist reached end and gets pageCount appropriated manufacturer id;
    const increasePageCount = async () => {
        if(totalPage&&count >= totalPage){
            return;
        }
        setCount(count => count + 1 );
    }
    const moreProduct = () => {
        increasePageCount();
    }

    // Flatlist components
    const renderItem = ({item}) => {
        return (
            <View style={styles.renderItemLayout}>
                <Cart
                key={`saleCart${item}`}
                data={item}
                wishList={wishList}
                setWishList={(newList)=>setWishList(newList)}
                setwishListItems={(newItem)=>setwishListItems(newItem)}
                wishListItems={wishListItems}
                />
            </View>
    )};
    const sepertorComponent = () => (
        <View style={styles.seperator}></View>
    );
    const headerComponent = () =>{
        return (
            <View>
                <ImageBackground 
                source={require("../assets/images/subBackgroundImage.jpg")}
                style={styles.bgImg}
                resizeMode="cover"
                >
                    <View style={styles.header}>
                        <GoBackButton/>
                        <FilterButton
                        apiBody={{
                            "manufacturer_id": choosenButton , 
                            "page": count,
                        }}
                        />  
                    </View>
                    
                    {/* <Image source={require('../assets/images/vazol.png')}  style={styles.imageVazol} /> */}
                   
                    <Text style={styles.headerTitle}>
                    {choosenName} {helper.translate("introtitle")}
                    </Text>
                    
                </ImageBackground>
                <View>
                    <ScrollView
                    style={styles.scrollContainer}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    keyboardShouldPersistTaps="always"
                    >
                        {
                            brands.map((item ,  index)=>(
                                <TouchableOpacity 
                                key={index}
                                style={styles.button}
                                onPress={()=>{
                                    setChoosenButton(item.id);
                                    setChoosenName(item.name);
                                    setCount(1);
                                }}
                                >
                                    <Text style={ choosenButton === item.id ? styles.choosenButtonText :  styles.buttonText}>{item.name}</Text>
                                </TouchableOpacity>
                            ))
                        }
                    </ScrollView>
                </View>
                <View style={styles.pageTitleLayout}>
                    <Text style={styles.pageTitle}>{choosenName}</Text>
                </View>
            </View>
        )
    } ;
    const emptyComponent = () => (
        <View style={styles.emptyListComponent}>
            <DataNotFounComponnet 
            type="noData"
            title={helper.translate("datanotfound")}
            description=""
            imageStyle={{
                width:helper.px(100),
                height:helper.px(200),
            }}
            titleStyle={{
                fontSize: helper.px(18), 
                lineHeight: helper.px(24),
            }}
            />
        </View>
    );
   
    return (
        <>
            <FlatList
            data={filteredProducts}
            contentContainerStyle={{flexGrow:1}}
            style={{flex:1 ,  backgroundColor: colors.main}}
            renderItem={renderItem}
            keyExtractor={(item, index) => `searchDetails${index}`}
            ItemSeparatorComponent={sepertorComponent}
            ListHeaderComponent={()=>headerComponent()}
            ListFooterComponent={()=> count >= totalPage ? null : <Text style={styles.activity}><ActivityIndicator size="small" color={colors.border} /></Text>}
            onEndReachedThreshold={0.5}
            onEndReached={()=> moreProduct()}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={()=>emptyComponent()}
            initialNumToRender={10}
            />
            {
                basketProducts.length? 
                <BasketButton
                setProducts={(value)=>setBasketProducts(value)}
                products={basketProducts}
                />
                :null
            }
        </> 
    )
}


const styles =  StyleSheet.create({
    layout:{
        paddingHorizontal: helper.px(16),
        paddingTop: helper.px(32),
        flex:1 , 
    },
    seperator: {
        height: helper.px(1), 
        backgroundColor: colors.border , 
        marginHorizontal: helper.px(16),
        marginVertical: helper.px(16) ,
        width: "97%",
        alignSelf: "center",
    },
    pageTitle:{
        fontWeight: "700", 
        fontFamily:helper.fontFamily(),
        fontSize: helper.px(24), 
        lineHeight: helper.px(30),
        color:colors.text, 
    },
    scrollContainer:{
        height:helper.px(50),
        borderBottomWidth:helper.px(1),
        borderBottomColor:colors.border,
        alignSelf: "flex-start",
    },
    button:{
        paddingHorizontal: helper.px(12),
        paddingVertical: helper.px(16),
        justifyContent:"center",
        alignItems:"center",
        marginLeft:helper.px(10),
        width:helper.px(100),
    },
    choosenButtonText:{
        color:colors.text,
        fontWeight: "700",
        fontFamily:helper.fontFamily(),
        fontSize:helper.px(14),
        lineHeight:helper.px(17),
    },
    buttonText:{
        color:colors.subTitle,
        fontWeight: "400",
        fontFamily:helper.fontFamily(),
        fontSize:helper.px(14),
        lineHeight:helper.px(17),
    },


    bgImg:{
        padding:helper.px(16),
        height:helper.px(364),
        backgroundColor: colors.imageBackground,

      } , 
    imageVazol: {
    marginTop: helper.px(45),
    },
    header: {
        height: helper.px(60),
        justifyContent: 'center',
        alignItems: 'space-between',
        marginTop:helper.px(20),
    },
    headerTitle: {
    fontWeight: "600", 
    fontSize: helper.px(36),
    fontFamily:helper.fontFamily("Bold"),
    lineHeight:helper.px(44),
    color: colors.main,
    // marginTop:helper.px(40),
    marginTop:"auto",
    marginBottom:helper.px(60),
    // textTransform:"uppercase",
    },
    renderItemLayout: {
        paddingHorizontal: helper.px(16),
    },
    pageTitleLayout: {
        marginVertical: helper.px(24),
        paddingHorizontal: helper.px(16),
    }, 
    activity: {
        paddingVertical: helper.px(16),
        textAlign: "center",
    },
    emptyListComponent: {
        alignItems:"center",
        justifyContent:"center",
    }
});


export default helper.mobx(FilterDetails); 