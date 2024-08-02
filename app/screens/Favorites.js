import React , {useEffect , useState , useMemo } from "react"; 
import {View ,  StyleSheet  , FlatList} from "react-native"; 
import helper from '../helpers/helper';
import colors from '../values/colors';
import Cart from "../components/Cart";
import { HeaderComponent } from "../components";
import DataNotFoundComponent from "../components/DataNotFoundComponent";
import { useIsFocused } from "@react-navigation/native";


const Favorites= ({stores}) => {
    const isFocused = useIsFocused();

    const [isFetching, setIsFetching] = useState(false);

    // same states in Home Page for Card 
    // for Favorites 
    const [wishList, setWishList] = useState([]);
    const [wishListItems, setwishListItems] = useState([]);
    const asyncWishlistProducts  =  useMemo(()=> stores.WishListStore.asyncWishProductList, [stores.WishListStore.asyncWishProductList ,isFocused] ); 
    const asyncWishIds = useMemo(()=> stores.WishListStore.asyncWishIdList , [stores.WishListStore.asyncWishIdList , isFocused]);
    const wishlistFromApi = useMemo(()=> stores.WishListStore.wishList , [stores.WishListStore.asyncWishIdList , isFocused]);
    const wishIdFromApi = useMemo(()=> stores.WishListStore.wishId , [stores.WishListStore.asyncWishIdList , isFocused]);
    // ********************************

    useEffect(()=>{
        if(isFocused){
            getFavorites();
        }
    }, [isFocused]);

    useEffect(()=>{
        if(!wishlistFromApi.length){
            setWishList(asyncWishIds); 
            setwishListItems(asyncWishlistProducts);
        }else {
            setWishList(wishIdFromApi); 
            setwishListItems(wishlistFromApi);
        }
    }, [asyncWishlistProducts , wishlistFromApi]);

    // works when component mounts
    const getFavorites = async() => {
        try{
            let isLogedIn = await stores.WishListStore.getWishlist();
            setIsFetching(false); 
        }
        catch(err){
            console.log("getFavorites in Fav page",  {err}); 
        }
    }


    const _onRefresh = () => {
        setIsFetching(true); 
        getFavorites();
    }


    const renderItem = ({item}) => (
        <View style={styles.layout}>
            <Cart
            key={`saleCart${item.product_id}`}
            data={item}
            wishList={wishIdFromApi.length ? wishIdFromApi : asyncWishIds }
            setWishList={(newList)=>setWishList(newList)}
            setwishListItems={(newItem)=>setwishListItems(newItem)}
            wishListItems={wishlistFromApi.length ? wishlistFromApi : asyncWishlistProducts }
            />
        </View>
    );
    const seperatorComponent = () => (
        <View style={styles.seperator}></View>
    );
    const headerComponent = () => (
        <View style={styles.headerLayout}>
            <HeaderComponent
            showHeader={true}
            title={helper.translate("favoriteproducts")}
            />
        </View>
    );

    const emptyComponent = () => (
        <View style={styles.emptyListComponent}>
            <DataNotFoundComponent 
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
            data={wishListItems}
            style={{backgroundColor:colors.main}}
            renderItem={renderItem}
            keyExtractor={(item , index)=> `wishlist---${index}`}
            ItemSeparatorComponent={seperatorComponent}
            ListHeaderComponent={headerComponent}
            initialNumToRender={10}
            ListEmptyComponent={()=>emptyComponent()}
            onRefresh={()=>_onRefresh()}
            refreshing={isFetching}
            progressViewOffset={100}
            showsVerticalScrollIndicator={false}
            />
            {/* <BasketButton/> */}
        </>
    )
}

const styles=StyleSheet.create({
    headerLayout:{
        marginBottom:helper.px(16),
    },
    layout: {
        paddingHorizontal: helper.px(16), 
        paddingVertical: helper.px(5), 
    },
    seperator: {
        height: helper.px(1), 
        backgroundColor: colors.border , 
        marginHorizontal: helper.px(16),
        marginVertical: helper.px(16) ,
        width: "98%",
        alignSelf: "center",
    },
    emptyListComponent: {
        alignItems:"center",
        justifyContent:"center",
    }

});

export default helper.mobx(Favorites) ; 