import React , {useState ,  useMemo , useEffect }  from 'react';
import {View , Text ,  StyleSheet , FlatList , ActivityIndicator} from "react-native"; 
import helper from '../helpers/helper';
import colors from '../values/colors';
import Cart from "../components/Cart";
import { HeaderComponent , DataNotFounComponnet} from '../components';

const SearchDetails = ({navigation ,  route , stores }) => {
    const [page ,  setPage ] = useState(1); 
    const searchResult = useMemo(()=>stores.FilterDetailsStore.filteredProducts);
    let totalPage = useMemo(()=>stores.FilterDetailsStore.totalPage);
    let totalProduct = useMemo(()=>stores.FilterDetailsStore.totalProduct);
    let searchedItem  =  route.params.searchedItem ; 
    // for Favorites (Wishlist)
    const [wishList, setWishList] = useState([]);
    const [wishListItems, setwishListItems] = useState([]);
    const asyncWishlistProducts  =  useMemo(()=> stores.WishListStore.asyncWishProductList, [stores.WishListStore.asyncWishProductList] ); 
    const asyncWishIds = useMemo(()=> stores.WishListStore.asyncWishIdList , [stores.WishListStore.asyncWishIdList]);
    const wishlistFromApi = useMemo(()=> stores.WishListStore.wishList , [stores.WishListStore.wishList]);
    const wishIdFromApi = useMemo(()=> stores.WishListStore.wishId , [stores.WishListStore.wishId]);

    useEffect(()=> {
        getSearchedItem();
        getWishlist();
    }, [page]); 

    const getWishlist = async () => {
        try{ 
            // write function here ---> send getwislist and asign value asyncstorage
            let islogedIn = await stores.WishListStore.getWishlist();
            await stores.WishListStore.getAsyncWishlist();

            if(!islogedIn){
                setWishList(asyncWishIds); 
                setwishListItems(asyncWishlistProducts);
            }else {
                setWishList(wishIdFromApi); 
                setwishListItems(wishlistFromApi);
            }
        }catch(err){
            console.log("getWishlist" , error);
        }
    }

    const getSearchedItem = async() => {
        try{
            let result = {
                "filter_name": searchedItem , 
                "page": page , 
            }
            await stores.FilterDetailsStore.getFilteredProducts(result); 
        }catch(err){
            console.log("err" ,  err);
        }
    }

    const moreProduct = async () =>{
        if(totalPage && page >= totalPage){
            return;
        }
        setPage(page => page+1); 
    }

    const renderItem = ({item}) => (
        <View style={styles.layout}>
            <Cart
            key = {`saleCart${item?.id}`}
            data={item}
            wishList={wishList}
            setWishList={(newList)=>setWishList(newList)}
            setwishListItems={(newItem)=>setwishListItems(newItem)}
            wishListItems={wishListItems}
            />
        </View>
    );

    const sepertorComponent = () => (
        <View style={styles.seperator}></View>
    );
    const headerComponent = () => (
        <>
        <HeaderComponent
          showHeader={true}
          title={helper.translate("searchresult")}
        />
        <View style={styles.titleContainer}>
            <Text style={styles.pageTitle}>{helper.translate("found")} {totalProduct} {helper.translate("products")}</Text>
        </View>
        </>
    );
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
        <FlatList
            data={searchResult}
            contentContainerStyle={{flexGrow:1}}
            style={{flex:1 ,  backgroundColor: colors.main}}
            renderItem={renderItem}
            keyExtractor={(item , index ) => `${index}s-earchDetailsss${item?.id}`}
            ItemSeparatorComponent={sepertorComponent}
            ListHeaderComponent={headerComponent}
            ListFooterComponent={()=> page >= totalPage ? null : <Text style={styles.activity}><ActivityIndicator size="small" color={colors.border} /></Text>}
            ListEmptyComponent={()=>emptyComponent()}
            initialNumToRender={10}
            onEndReachedThreshold={0.5}
            onEndReached={()=> moreProduct()}
        />
    )
}


const styles =  StyleSheet.create({
    layout:{
        flex:1,
        paddingHorizontal: helper.px(16),
        paddingBottom: helper.px(16),
        backgroundColor: colors.main,
    },
    seperator: {
        height: helper.px(1), 
        backgroundColor: colors.border , 
        marginHorizontal: helper.px(16),
        marginVertical: helper.px(16) ,
        width: "100%",
        alignSelf: "center",
    },
    pageTitle:{
        fontWeight: "700", 
        fontFamily:helper.fontFamily(),
        fontSize: helper.px(24), 
        lineHeight: helper.px(30),
        color:colors.text, 
        marginBottom: helper.px(24),
    },
    titleContainer: {
        backgroundColor: colors.main, 
        paddingHorizontal: helper.px(16),
        paddingTop: helper.px(16),
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


export default helper.mobx(SearchDetails); 