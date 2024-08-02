import React , {
    useState , 
    useRef , 
    useEffect , 
    useMemo , 
}  from 'react';
import moment from "moment";
import {
    View , 
    Text ,  
    StyleSheet  , 
    TouchableOpacity , 
    ScrollView ,
    SafeAreaView  ,
    StatusBar,
    FlatList, 
    TextInput
} from "react-native"; 
import helper from '../helpers/helper';
import colors from '../values/colors';
import GoBackButton from "../components/layoutComponents/GoBackButton";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from '@react-navigation/native';
import { MAP ,  HOME } from '../values/screensList';
import Alert from '../components/Alert';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WarningModal from '../modals/WarningModal';
import i18next from 'i18next';



const Order = ({route , stores}) => {
    const navigation = useNavigation();
    const [comment, setComment] =  useState("");
    const [addressdetails, setAddressdetails] =  useState([]);
    const [ openWarningModal ,  setOpenWarningModal ] =  useState(false); 
    const [address, setAddress] =  useState(helper.translate("noselectedaddress"));
    const [showConfirmButton , setShowConfirmButton ] =  useState(false) ; 
    let confirmOrderButtonText =  helper.translate("confirmorder"); 
    let deliveryCalculateBtn = helper.translate("calculationdelivery"); 
    let deliverypriceWarningText =  helper.translate("deliveryprice") ; 
    let totalPriceText =  helper.translate("total") ; 

    // BASKETLIST
    const [basketProducts ,  setBasketProducts ]= useState([]); 
    const asyncBasketProducts  =  useMemo(()=> stores.BasketStore.asyncBasketProductList , [stores.BasketStore.asyncBasketProductList]); 
    const basketList = useMemo(()=>stores.BasketStore.basketList , [stores.BasketStore.basketList]);
    const deliveryPrice = useMemo(()=>stores.Order.deliveryPrice , [stores.Order.deliveryPrice]);
    // for Alert
    const [error, setError] = useState({
        errorDescription : "" , 
        showAlert: false , 
        type: ""
    });

    useEffect(()=>{
        // show address that choosen from map
        if(route?.params?.address){
            setAddress(route?.params?.address+"...");
            setAddressdetails(route.params?.mapDetails); 
        }
    },[route?.params?.address]);

    useEffect(()=>{
        getBasketList();
    }, []); 

    // get basketlist 
    const getBasketList = async ()=> {
        try{
            // getBasketList
            await  stores.BasketStore.getBasketList(); 
            await  stores.BasketStore.getAsyncBasketProduct();
            if(asyncBasketProducts?.length) {
                setBasketProducts(asyncBasketProducts); 
            }else if(basketList?.length){
                setBasketProducts(basketList); 
            }
        }catch(err){
            console.log("Order page getBasketList error: ", {err}); 
        }
    }

    const getHeaderTokens =  async () => {
        try {
            let asyncToken = await AsyncStorage.getItem("@logged_In_Token");
            let asyncDeviceToken = await AsyncStorage.getItem("@device_Token");
            let headerToken = asyncToken != null ? JSON.parse(asyncToken) : false ;
            let deviceToken = asyncDeviceToken != null ? JSON.parse(asyncDeviceToken) : false ; 
            return {
                headerToken , 
                deviceToken 
            }
        }catch(err) {
            console.log("getHeaderTokens error"  , {err}); 
        }
    }

    const confirmOrder = async () => {
        try{
            const {headerToken , deviceToken } = await getHeaderTokens(); 

            if(headerToken !== deviceToken &&  headerToken && deviceToken ) {

                let body = {
                    products: basketProducts , 
                    addressText : address ,
                    addressdetails : addressdetails , 
                    comment : comment  ,
                }

                await stores.Order.makeOrder(body); 

                // reset deliveryPrice
                await stores.Order.resetDeliveryPrice(); 

                // setError({
                //     errorDescription : "Successfull order confitmation" , 
                //     showAlert: true , 
                //     type: "success" ,
                // });
                setOpenWarningModal(true);
                // clean basketStore

            }else {
                navigation.navigate("Login" , {
                    fromOrder:  true , 
                });
            }
        }catch(err){
            console.log("confirmOrderError"  , {err}); 
        }
    }

    const orderSuccesModalCallback = async () => { 
        clearTimeout(goHome);
        await stores.BasketStore.cleanBasket(); 
        await stores.BasketStore.setAsyncBasketProducts([]);
        setOpenWarningModal(false) ; 
        let goHome =  setTimeout(() => {
            navigation.navigate(HOME);    
        }, 500);
    }

    const renderItem = ({item}) => {
        return(
            <View style={styles.orderItem}>
                <Text style={{
                  ...styles.orderItemText ,
                  width: helper.px(140) ,
                  textAlign:"left",
                }}
                numberOfLines={1}
                >{item.name}</Text>
                <Text style={{...styles.orderItemText , textAlign:"center"}}>{item.discountPrice ?? item.price}</Text>
                <Text style={{...styles.orderItemText , textAlign:"center"}}>x{item.quantity}</Text>
                <Text style={{...styles.orderItemText , textAlign:"center"}}>{(item.discountPrice ?? item.price)*item.quantity}</Text>
            </View>
        )
    }

    const HeaderComponent = () => {
        return (
            <View style={{...styles.orderItem,  marginBottom: helper.px(12)}}>
                <Text style={{
                  ...styles.orderItemText ,
                  width: helper.px(140) ,
                  textAlign:"left",
                }}
                numberOfLines={1}
                >{helper.translate("product")}</Text>
                <Text style={{...styles.orderItemText , textAlign:"center"}}>{helper.translate("price")}</Text>
                <Text style={{...styles.orderItemText , textAlign:"center"}}>{helper.translate("quantity")}</Text>
                <Text style={{...styles.orderItemText , textAlign:"center"}}>{helper.translate("total")}</Text>
            </View>
        )
    }

    const calculateDeliveryPrice = async () => {
        try{
            if(!address) return setError({
                errorDescription : i18next.t("choose.address") , 
                showAlert: true , 
                type: "error"
            });
            const {headerToken , deviceToken } = await getHeaderTokens();
            if(headerToken !== deviceToken &&  headerToken && deviceToken ){
                let body = {
                    products: basketProducts , 
                    addressText : address ,
                    addressdetails : addressdetails , 
                    comment : comment  ,
                }
                let result =  await stores.Order.calculateDelivery(body); 
                if(result) {
                    setShowConfirmButton(true) ;
                }
            }else{
                navigation.navigate("Login" , {
                    fromOrder:  true , 
                });
            }           
        }catch(err){
            console.log("err" ,  err) ;
        }
    }

    const getTotalProductPrice = () => {
        let total= 0 ; 
        basketProducts?.map((prdct)=>{
            let price ; 
            if(prdct?.discountPrice){
                price = prdct?.discountPrice; 
            }else {
                price = prdct?.price; 
            }
            total += price *  prdct?.quantity; 
        });
        return total ;
    }

    const Seperator =()=> <View style={{height:helper.px(12)}}></View>

    const today = new Date().toString();
    return(
        <>
        {
            error.showAlert ? 
            <Alert
            type={error.type}
            message={error.errorDescription}
            callback={(val)=> setError({
                ...error ,
                showAlert: val ,
            })}
            />
            :null
        }
        <SafeAreaView
        style={{
          flex: 0,
          backgroundColor: colors.main,
        }}
        />
        <StatusBar
            translucent={false}
            backgroundColor={colors.black}
        />
        <SafeAreaView
        style={styles.layout}
        >
            {
                error.showAlert ? 
                <Alert
                type={error.type}
                message={error.errorDescription}
                callback={(val)=> setError({
                    ...error ,
                    showAlert: val ,
                }) }
                />
                :null
            }

            <ScrollView 
            keyboardShouldPersistTaps="always"
            style={styles.scrollLayout}
            >
                <View>
                    <View style={styles.goBackButtonContainer}>
                        <GoBackButton
                        bgColor={colors.border}
                        />
                        <Text style={styles.currentTime} >{moment(today).format("DD MMMM YYYY, HH:mm")}</Text>
                    </View>

                    <Text style={styles.title}>{helper.translate("yourorder")}</Text>

                    <View style={styles.orderListContainer}>
                        <FlatList
                        data={basketProducts}
                        keyExtractor={(item , index )=> `${index}smth`}
                        renderItem={renderItem}
                        ListHeaderComponent={()=>HeaderComponent()}
                        ItemSeparatorComponent={()=>Seperator()}
                        />
                    </View>

                    <View >
                        <View style={styles.commentsCont}>
                            <MaterialCommunityIcons name="comment-text-outline" size={20} color={colors.black}/> 
                            <Text style={styles.commentTitle}>{helper.translate("comment")}</Text>
                        </View>
                        <TextInput 
                        multiline={true}
                        value={comment}
                        onChange={(value)=>setComment(value)}
                        placeholder={helper.translate("addcomment")}
                        placeholderTextColor={colors.secondary}
                        userInterfaceStyle="light"
                        />
                    </View>

                    <TouchableOpacity
                    style={styles.chooseAddressButton}
                    onPress={()=>navigation.navigate(MAP)}
                    >
                        <Ionicons name="add" size={22} color={colors.black}/>
                        <Text>{helper.translate("address")}</Text>
                    </TouchableOpacity>

                    <View>
                        <View style={styles.details}>
                            <View style={styles.addressAndDelivery}>
                                <Text style={styles.orderItemText}>{helper.translate("delivery")}</Text>
                                <Text 
                                style={styles.subText}
                                numberOfLines={1}
                                >{address}</Text>
                            </View>
                            <Text style={{...styles.orderItemText , ...styles.orderItemTextPrice}}>{ deliveryPrice ? (deliveryPrice + "₼") : deliverypriceWarningText}</Text>   
                        </View>
                        <View style={{...styles.details, ...styles.center}}>
                            <Text style={styles.orderItemText}>{helper.translate("subtotal")}</Text>
                            <Text style={{...styles.orderItemText , ...styles.orderItemTextPrice}}>{getTotalProductPrice()}₼</Text>   
                        </View>
                        {
                            deliveryPrice ? 
                            <View style={styles.details}>
                                <Text style={styles.orderItemText}>{totalPriceText}</Text>
                                <Text style={{...styles.orderItemText , ...styles.orderItemTextPrice}}>{getTotalProductPrice() + deliveryPrice }₼</Text>   
                            </View>
                            :null
                        }
                        
                    </View>
                    {
                        showConfirmButton ? 
                        <TouchableOpacity
                        style={styles.confirmOrderButton}
                        onPress={()=>confirmOrder()}
                        >
                            <Text style={styles.confirmText}>{confirmOrderButtonText}</Text>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity
                        style={styles.confirmOrderButton}
                        onPress={()=>calculateDeliveryPrice()}
                        >
                            <Text style={styles.confirmText}>{deliveryCalculateBtn}</Text>
                        </TouchableOpacity>
                    }
                    <View style={{height:helper.px(50)}}></View>
                </View>
            </ScrollView>
        </SafeAreaView>
        <WarningModal
        visibility = {openWarningModal}
        setVisibility ={(val)=>setOpenWarningModal(val)}
        description  ={() => i18next.t("orderresult")}  
        pressFunction ={()=>orderSuccesModalCallback()}
        buttonText ={helper.translate("gohome")}
        />
        </>
        
    )
}

const styles =StyleSheet.create({
    layout: {
        backgroundColor: colors.main,
        height: helper.screenHeight,
        flex: 1,
        backgroundColor: colors.main,

    },
    scrollLayout:{
        flex: 1 ,
        backgroundColor: colors.main,
        padding:helper.px(16),
    },
    goBackButtonContainer:{
        paddingVertical:helper.px(16),
        justifyContent:"flex-end",
    },
    currentTime:{
        fontFamily: helper.fontFamily("Bold"),
        fontWeight:"600",
        fontSize:helper.px(16),
        lineHeight:helper.px(16),
        color:colors.black, 
        marginTop:helper.px(80),
    },
    title:{
        fontFamily: helper.fontFamily("Bold"),
        fontWeight:"600",
        fontSize:helper.px(24),
        lineHeight:helper.px(30),
        color:colors.black, 
        marginTop:helper.px(16),
    },
    orderListContainer:{
        borderTopWidth: helper.px(1),
        borderBottomWidth: helper.px(1),
        borderTopColor: colors.border , 
        borderBottomColor: colors.border,
        paddingVertical:helper.px(16),
        marginTop:helper.px(16),
    },
    orderItem:{
        flexDirection:"row",
        justifyContent:'space-between',
    },
    orderItemText: {
        fontFamily: helper.fontFamily(),
        fontWeight:"400",
        fontSize:helper.px(14),
        lineHeight:helper.px(17),
        color:colors.black, 
        minWidth:helper.px(70),
    },
    orderItemTextPrice: {
        textAlign: "right"
    },
    commentsCont:{
        flexDirection:"row",
        alignItems:"center",
        marginTop:helper.px(16),
    },
    commentTitle:{
        fontFamily: helper.fontFamily("Bold"),
        fontWeight:"600",
        fontSize:helper.px(16),
        lineHeight:helper.px(20),
        color:colors.black, 
        marginLeft: helper.px(5),
    },
    chooseAddressButton:{
        height:helper.px(44),
        backgroundColor: colors.border, 
        width: helper.screenWidth-32, 
        justifyContent:"center", 
        alignItems: "center",
        flexDirection:"row",
        alignSelf:"center",
        marginVertical: helper.px(16),
    },
    details:{
        paddingVertical: helper.px(16),
        flexDirection:"row",
        justifyContent:"space-between",
    },
    center: {
        borderTopWidth: helper.px(1) , 
        borderBottomWidth: helper.px(1) , 
        borderTopColor: colors.border, 
        borderBottomColor: colors.border, 
    },
    subText: {
        fontFamily: helper.fontFamily(),
        fontWeight:"400",
        fontSize:helper.px(12),
        lineHeight:helper.px(15),
        color:colors.border, 
        marginTop:helper.px(4),
        marginLeft:helper.px(7),
        width: helper.px(150),
    },
    addressAndDelivery:{
       alignItems: "flex-start",
    },
    confirmOrderButton :{ 
        backgroundColor: colors.text, 
        paddingHorizontal: helper.px(24),
        borderRadius: helper.px(50), 
        height: helper.px(44),
        justifyContent: "center", 
        alignItems: "center",
        flexDirection: "row",
        width: "100%",
        height:helper.px(44),
        marginVertical: helper.px(30),
    }, 
    confirmText: {
        fontFamily: helper.fontFamily("Bold"), 
        fontWeight: "600", 
        color:colors.main, 
        lineHeight: helper.px(20), 
        fontSize: helper.px(16), 
    },
    // disPrice : {
    //     fontFamily: helper.fontFamily(""), 
    //     fontWeight: "400", 
    //     color:colors.text, 
    //     lineHeight: helper.px(16), 
    //     fontSize: helper.px(13),
    // }
}); 

export default helper.mobx(Order); 