import React , {useState , useEffect , useMemo } from "react"; 
import {View , Text ,  StyleSheet  ,SafeAreaView, TouchableOpacity , ScrollView ,  TextInput , FlatList} from "react-native"; 
import Authlayout from "../layouts/AuthLayout";
import helper from '../helpers/helper';
import colors from '../values/colors';
import AntDesign from "react-native-vector-icons/AntDesign";
import Feather from "react-native-vector-icons/Feather";
import Entypo from "react-native-vector-icons/Entypo";
import {FAVORITES ,  ORDERHİSTORY , ACCOUNTDETAILS , HOME ,} from "../values/screensList";
import { useNavigation } from "@react-navigation/native";
import BasketModal from "../modals/BasketModal";
import BonusModal from "../modals/BonusModal";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Alert from '../components/Alert';
import i18next from 'i18next';

const UserAccount = (props) => {
    // const [ modalVisibility , setModalVisibility]=useState(false);
    const [ userDetails , setUserDetails]=useState({});
    const [ headerTokens , setHeaderTokens]=useState({});
    const [ bonusModalVisibility , setBonusModalVisibility]=useState(false);
    const [error, setError] = useState({
        errorDescription : "" , 
        showAlert: false , 
        type: ""
    });
    const navigation = useNavigation();
    const bonus = helper.translate("bonus") ; 
    const userOrders = helper.translate("myorders") ; 
    const userdetails = helper.translate("userdata") ; 
    const removeUser= helper.translate("remove.user") ;
    const login = helper.translate("login") ; 
    const signOut = helper.translate("signout"); 
    const fromLogIn = props?.route?.params?.fromLoginPage ; 
    const removeUserAlert =  helper.translate('remove.user.alert') ; 
    


    useEffect(()=>{
        if(fromLogIn){
            getHeaderTokens();
            navigation.addListener("beforeRemove", (e) => {
                if(!fromLogIn) {
                   return ;
                }else{
                  e.preventDefault();
                  navigation.navigate(HOME);
                }
            });
        }
        // getBasketList();
        getUserDetails();
    },[navigation]);

    useEffect(()=>{
        getHeaderTokens();
    },[headerTokens]);

    const getUserDetails = async () => {
        try{
            await AsyncStorage.getItem("@user_Details").then((data)=>{
                if(data !== null){
                    const parsedData =  JSON.parse(data); 
                    setUserDetails(parsedData); 
                }
            }); 
        }
        catch(err){
            console.log("err" , err) ; 
        }
    }

    const logout = async () => {

        getAllKeys();
        try{
            await props.stores.LoginStore.logout(); 
            await props.stores.FilterDetailsStore.logout(); 
            await props.stores.ForgetPasswordStore.logout(); 
            // await props.stores.HomepageStore.logout(); 
            await props.stores.UserDetailsStore.logout(); 
            await props.stores.WishListStore.logout(); 

            // clear all asyncStorage 
            let keys = [
                "@device_Token" , 
                "@errorMessage" , 
                "@logged_In_Token" , 
                // "@userLunched" , 
                "@user_Details" , 
                "@wish_list",
                "@wish_list_products" , 
                "basket_products",
                "basket_ids"
            ]; 
            await AsyncStorage.multiRemove(keys).then(async()=>{
                try{
                    // get device token again 
                    let newToken = await props.stores.GetTokenStore.getToken();
                    if(newToken){
                        // navigate to login page 
                        navigation.navigate("Login" ,  { fromAccount: true }); 
                    }
                }catch(err) {
                    console.log("AsyncStorage.clear" , err);
                }
            }).catch((err)=>console.log("async clear cache " ,  err)); 

        }catch(err){
            console.log(err);
            // setError({
            //     errorDescription : i18next.t("success"), 
            //     showAlert: true , 
            //     type: "success"
            // });
        }
        finally{
            // for to show back errors
            let errorMessage = await AsyncStorage.getItem("@errorMessage") ; 
            if(errorMessage && errorMessage != null){
                setError({
                errorDescription : i18next.t(errorMessage), 
                showAlert: true , 
                type: "error"
                });          
            }
            setTimeout(async ()=> await AsyncStorage.setItem("@errorMessage" , "") , 3000 ) ; 
        }
    }

    // i will remove this before production
    const getAllKeys = async () => {
        let keys = []
        try {
          keys = await AsyncStorage.getAllKeys()
        } catch(e) {
          // read key error
        }
    }

    const getHeaderTokens =  async () => {
        try {
            let asyncToken = await AsyncStorage.getItem("@logged_In_Token");
            let asyncDeviceToken = await AsyncStorage.getItem("@device_Token");
            let headerToken = asyncToken != null ? JSON.parse(asyncToken) : false ;
            let deviceToken = asyncDeviceToken != null ? JSON.parse(asyncDeviceToken) : false ; 
            setHeaderTokens({
                headerToken , 
                deviceToken 
            }); 
            return {
                headerToken , 
                deviceToken 
            }
        }catch(err) {
            console.log("getHeaderTokens error"  , {err}); 
        }
    }


    return (
        <>
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
        <Authlayout
        showHeader={true}
        title={ helper.translate("welcometext") + 
        ` ${ headerTokens.headerToken !== headerTokens.deviceToken ? ( userDetails?.firstname || "" ): ""}👋`}
        languageButton={headerTokens.headerToken !== headerTokens.deviceToken ? true : false }
        >
            <View style={styles.layout}>
                <Text style={styles.note}>{helper.translate("goto")}</Text>
                <View style={styles.buttonsLayout}>
                    {
                        headerTokens.headerToken !== headerTokens.deviceToken ?
                        <>
                            <View style={styles.buttonsView}>
                                <TouchableOpacity 
                                onPress={()=>navigation.navigate(ACCOUNTDETAILS)}
                                style={styles.buttons}>
                                    <AntDesign  name="user" color={colors.main}  size={30} />
                                </TouchableOpacity>
                                <Text style={styles.buttonsText}>{userdetails}</Text>
                            </View>
                            <View style={styles.buttonsView}>
                                <TouchableOpacity 
                                onPress={()=>navigation.navigate(ORDERHİSTORY)}
                                style={styles.buttons}>
                                    <Feather  name="truck" color={colors.main}  size={30} />
                                </TouchableOpacity>
                                <Text style={styles.buttonsText}>{userOrders}</Text>
                            </View>
                            <View style={styles.buttonsView}>
                                <TouchableOpacity 
                                onPress={()=> setError({
                                        errorDescription : removeUserAlert, 
                                        showAlert: true , 
                                        type: "error"
                                    })
                                }
                                style={[styles.buttons,  {backgroundColor: "darkred"}]}
                                >
                                    <AntDesign  name="deleteuser" color={colors.main}  size={30} />
                                </TouchableOpacity>
                                <Text style={styles.buttonsText}>{removeUser}</Text>
                            </View>
                            {/* <View style={styles.buttonsView}>
                                <TouchableOpacity 
                                onPress={()=>setBonusModalVisibility(!bonusModalVisibility)}
                                style={styles.buttons}>
                                    <Entypo  name="wallet" color={colors.main}  size={30} />
                                </TouchableOpacity>
                                <Text style={styles.buttonsText}>{bonus}</Text>
                            </View> */}
                        </>
                        : null
                    }
                    
                    <View style={styles.buttonsView}>
                        <TouchableOpacity 
                        onPress={()=>navigation.navigate(FAVORITES+"stack")}
                        style={styles.buttons}>
                            <AntDesign  name="hearto" color={colors.main}  size={30} />
                        </TouchableOpacity>
                        <Text style={styles.buttonsText}>{helper.translate("favorites")}</Text>
                    </View>    
                </View>
                <BonusModal 
                visibility={bonusModalVisibility}
                setVisibility={(value)=>setBonusModalVisibility(value)}
                />

            </View>
        </Authlayout> 
        <View style={styles.logOut}>
            {
                headerTokens.headerToken === headerTokens.deviceToken ?
                <TouchableOpacity 
                style={styles.logOutButton}
                onPress={()=>navigation.navigate("Login")}
                >
                    <Text style={styles.logOutText} >{login}</Text>
                </TouchableOpacity>
                :
                <TouchableOpacity 
                style={styles.logOutButton}
                onPress={()=>logout()}
                >
                    <Text style={styles.logOutText} >{signOut}</Text>
                </TouchableOpacity>
            }
        </View>
        </>
        
    )
}

const styles=StyleSheet.create({
    layout:{
        paddingHorizontal: helper.px(16),
        paddingTop: helper.px(32),
    },
    note: {
        fontFamily:helper.fontFamily(),
        fontSize: helper.px(16), 
        fontWeight: "400" , 
        lineHeight: helper.px(20), 
        color: colors.subTitle , 
        marginBottom: helper.px(24),
    },
    buttonsLayout: {   
        flexDirection:"row" , 
        alignItems: "center",
        justifyContent:"center",
        flexWrap: "wrap", 
        height: "auto"  ,
        flex: 2,
    }, 
    buttonsView: {
        justifyContent: "flex-start" ,
        alignItems: "center",
        marginBottom: helper.px(16),
        width:helper.px(105),
        marginHorizontal:helper.px(3),
        height: helper.px(150),
    },
    buttons: {
        width: helper.px(80),
        height: helper.px(80),
        backgroundColor: colors.text,
        justifyContent: "center", 
        alignItems: "center",
        borderRadius: helper.px(20)
    },
    buttonsText: {
        fontFamily:helper.fontFamily(),
        fontSize: helper.px(16), 
        fontWeight: "400" , 
        lineHeight: helper.px(20), 
        color: colors.text , 
        marginTop: helper.px(10),
        textAlign: "center",
    }, 
    logOut: {
        // width: "100%",
        // width:helper.screenWidth,
        height:helper.px(76),
        padding:helper.px(16),
        justifyContent: "center", 
        alignItems: "center",
        backgroundColor: colors.main,
        borderTopWidth: helper.px(1) , 
        borderTopColor: colors.border , 
    }, 
    logOutButton: {
        height: helper.px(44),
        justifyContent: "center", 
        alignItems: "center",
        backgroundColor: colors.text,
        width: "100%",
        borderRadius: helper.px(50),
    }, 
    logOutText: {
        fontFamily:helper.fontFamily("Bold"),
        fontSize: helper.px(16), 
        fontWeight: "600" , 
        lineHeight: helper.px(20), 
        color: colors.main , 
    }, 
});

export default helper.mobx(UserAccount);