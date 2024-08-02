import React , {
    useMemo , 
    useEffect , 
    useState ,
} from "react"; 
import {
    View , 
    Text ,  
    StyleSheet  ,
    SafeAreaView, 
    TouchableOpacity , 
    ScrollView ,  
    TextInput , 
    FlatList
} from "react-native"; 
import Authlayout from "../layouts/AuthLayout";
import helper from '../helpers/helper';
import colors from '../values/colors';
import Entypo from "react-native-vector-icons/Entypo";
import { GoBackButton ,  FilterButton , DataNotFounComponnet , HeaderComponent } from '../components';


// this will be data from api 
const data =  [
    {
        id: 1 , 
        title: "VOZOL D5 1000" , 
        info: `Затяжек: 1000, С подзарядкой Имеются 6 вкусов на любой ,С подзарядкой Имеются 6 вкусов на любой , С подзарядкой Имеются 6 вкусов на любой , `,
        oldPrice: 20.95, 
        newPrice: 16.95,
        // image : require("../assets/images/sliderImages/1.png"), 
    },
    {
        id: 2 , 
        title: "VOZOL D9 1000" , 
        info: `Затяжек: 2000, С подзарядкой Имеются 6 вкусов на любой`,
        oldPrice: 30.20, 
        newPrice: 16.95,
        // image : require("../assets/images/sliderImages/1.png"), 
    },
    {
        id: 3 , 
        title: "VOZOL D8 1000" , 
        info: `Затяжек: 2000, С подзарядкой Имеются 6 вкусов на любой`,
        oldPrice: 40.20, 
        newPrice: 16.95,
        // image : require("../assets/images/sliderImages/1.png"), 
    },
    {
        id: 4 , 
        title: "VOZOL D8 1000" , 
        info: `Затяжек: 2000, С подзарядкой Имеются 6 вкусов на любой`,
        oldPrice: 30.20, 
        newPrice: 20.95,
        // image : require("../assets/images/sliderImages/1.png"), 
    },
]; 



const OrderHistory = ({stores}) => {
    let orderTitleText = helper.translate("orderhistory");  
    let renderiText =  helper.translate("ordr") ; 
    const [count ,  setCount ]=useState(1);
    const orderHistoryData = useMemo(()=>stores.Order.orderHistoryData , [stores.Order.orderHistoryData]);
    let totalPage = useMemo(()=>stores.Order.totalPage , [stores.Order.totalPage]);
    const [isFetching, setIsFetching] = useState(false);


    useEffect(()=>{
        getOrderHistoryData(count); 
    },[]);


    // getting base data 
    const getOrderHistoryData = async () => {
        try {
            await stores.Order.getOrderHistory() ; 
            setIsFetching(false);
        }catch(err) {
            console.log("getting error on orderHistory",  err ) ; 
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

    const _onRefresh = () => {
        setIsFetching(true); 
        getOrderHistoryData(1);
    }


    // Flatlist components
    const renderItem = ({item}) =>{ 
        return (
        <View style={styles.layout} key = {`orderHis${item?.order_id}`}>
            <View  style={styles.descriptionContainer}>
                <View style={styles.infoCon}>
                    <Text style={styles.idText}>{renderiText}: {item?.order_id}</Text>
                    <Text style={styles.subText}>{item.date_added}</Text>
                </View>
                <View style={styles.infoCon}>
                    <Text style={styles.idText}>{item?.total} {item?.currency_code}</Text>
                </View>
            </View>
        </View>
    )};

    const sepertorComponent = () => (
        <View style={styles.seperator}></View>
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

    const footerComponnet = () => (
        <TouchableOpacity style={styles.seeMoreButton}>
            <Text style={{...styles.seeMoreButtonText , ...styles.idText}}>{helper.translate("seemore")}</Text>
            {/* chevron-thin-up */}
            <Entypo name="chevron-thin-down" size={20} color={colors.text} />
        </TouchableOpacity>
    );

    const headerComponent = () => (
        <View style={styles.headerLay}>
            <HeaderComponent
            showHeader={true}
            // title={helper.translate("orderhistory")}
            title={orderTitleText}
            />
        </View>
        
    );

    return ( 
        <SafeAreaView
        style={{flex: 1}}
        >
            <FlatList
            data={orderHistoryData}
            contentContainerStyle={{flexGrow:1}}
            style={{flex:1 ,  backgroundColor: colors.main}}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={sepertorComponent}
            ListFooterComponent={()=>  count >= totalPage ? null :  footerComponnet() }
            ListHeaderComponent={()=>headerComponent()}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={()=>emptyComponent()}
            initialNumToRender={10}
            onEndReachedThreshold={0.5}
            onEndReached={()=> moreProduct()}
            onRefresh={()=>_onRefresh()}
            refreshing={isFetching}
            progressViewOffset={100}
            />
        </SafeAreaView>
    )
}

const styles=StyleSheet.create({
    layout:{
        paddingHorizontal: helper.px(16), 
    },
    headerLay:{
        marginBottom: helper.px(32),
    }, 
    seperator: {
        height: helper.px(1), 
        backgroundColor: colors.border , 
        marginHorizontal: helper.px(16),
        marginVertical: helper.px(16) ,
        width: "98%",
        alignSelf: "center",
    },
    descriptionContainer:{
        flexDirection: "row", 
        alignItems: "center", 
        justifyContent: "space-between", 
    }, 
    idText: {
        fontFamily:helper.fontFamily(),
        fontSize: helper.px(14),
        lineHeight: helper.px(17),
        fontWeight: "400",
        color: colors.text,
    }, 
    subText: {
        fontFamily:helper.fontFamily(),
        fontSize: helper.px(10),
        lineHeight: helper.px(16),
        fontWeight: "400",
        color: colors.subTitle,
    },
    seeMoreButton: {
        flexDirection: "row", 
        alignItems: "center", 
        justifyContent: "center",
        padding:helper.px(16), 
    }, 
    seeMoreButtonText: {
       marginRight: helper.px(8)
    },
    emptyListComponent: {
        alignItems:"center",
        justifyContent:"center",
    }
});


export default helper.mobx(OrderHistory) ;