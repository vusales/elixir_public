import React,  {useEffect, useState , useMemo } from "react";
import {View , Text ,  StyleSheet  , TouchableOpacity , ScrollView , ImageBackground ,  FlatList   } from "react-native"; 
import Modal from "react-native-modal";
import helper from "../helpers/helper";
import colors from "../values/colors";
import BasketCart from "../components/BasketCart";
import HorizontalSlider from '../components/HorizontalSlider';
import SimilarProductCard from '../components/SimilarProductCard';
import { useNavigation } from "@react-navigation/native";
import { ORDER } from "../values/screensList";

const BasketModal = ({
    visibility , 
    setVisibility ,
    setBasketProducts ,
    basketProducts ,
    totalPrice ,
}) => {

    const navigation=useNavigation();
    // state for usage bonus
    const [useBonus ,  setUsageBonus] = useState(false);
   
    // demo data for Similar products
    const data = [
        {
            id:1,
            title: "VOZOL Alien 7",
            subTitle: "Аромат ягоды;",
            zataj: "2500 затяжек",
            price: 20,
            oldPrice: 50,
        },
        {
            title: "VOZOL Alien 7",
            id:2,
            subTitle: "Аромат ягоды;",
            zataj: "2500 затяжек",
            price: 20,
            oldPrice: 50,
        },
    ];


    return (
    <Modal
       style={{
        margin: 0, 
        bottom: 0 , 
        ...styles.layoutModal 
       }}
       animationIn={"slideInUp"}
       isVisible={visibility}
       onBackdropPress={()=>setVisibility(false)}
       onBackButtonPress={()=>setVisibility(false)}
       onSwipeComplete={()=>setVisibility(false)}
       deviceWidth={helper.screenWidth}
       swipeDirection={['down']}
       panResponderThreshold={50}
       transparent={true}
    >
            <View  style={styles.lineContainer}>
                <View style={styles.line}></View>
            </View>

            <ScrollView
            horizontal={false}
            showsVerticalScrollIndicator ={false}
            keyboardShouldPersistTaps={"always"}
            >
                <View>
                    <View
                        style={styles.layoutScroll}
                    >
                        <Text style={styles.title} >{helper.translate("carttitle")}</Text>
                        {
                            basketProducts?.map((item)=>(
                                <BasketCart
                                key={item.product_id}
                                data={item}
                                basketListData={basketProducts}
                                setBasketListData={(value)=>setBasketProducts(value)}
                                // asyncBasketProducts={asyncBasketProducts}
                                // basketList={basketList}
                                />
                            ))
                        }
                    </View>

                    {/* <HorizontalSlider
                    data={data}
                    title={helper.translate("sameproduct")}
                    renderItemContainerStyle={styles.horizontalSliderRenderItem}
                    // style={styles.layoutScroll}
                    >
                        <SimilarProductCard
                        style={styles.similarPro}
                        />
                    </HorizontalSlider> */}

                    <View style={styles.orderDetailCon}>
                        <View style={styles.orderDetailSectionCon}>
                            <Text style={styles.orderInfoText}>{helper.translate("totalcost")}</Text>
                            <Text style={styles.orderInfoText}>{totalPrice()||0}₼</Text>
                        </View>
                        {/* <View style={styles.orderDetailSectionCon}>
                            <Text style={styles.orderInfoText}>{helper.translate("delivery")}</Text>
                            <Text style={styles.orderInfoText}>10₼</Text>
                        </View>
                        <View style={styles.orderDetailSectionCon}>
                            <TouchableOpacity
                            style={styles.promoButton}
                            onPress={()=>setUsageBonus(!useBonus)}
                            >
                                <CheckBox
                                value={useBonus}
                                onValueChange={()=>setUsageBonus(!useBonus)}
                                style={styles.checkbox}
                                />
                                <Text style={styles.orderInfoText}>{helper.translate("usebonus")}</Text>
                            </TouchableOpacity>
                            <Text style={styles.orderInfoText}>- 5₼</Text>
                        </View>
                        <View style={styles.orderDetailSectionCon}> */}
                            {/* count titalprice with delivery and (if user uses bonus) with bonus */}
                            {/* <Text style={styles.orderInfoText}>{helper.translate("totalpayment")}</Text>
                            <Text style={styles.orderInfoText}>{totalPrice()||0}₼</Text>
                        </View> */}
                    </View>

                    <View style={styles.confirmOrderContainer}>
                        <TouchableOpacity 
                        style={styles.confirmOrderButton}
                        onPress={()=>{
                            navigation.navigate(ORDER);
                            setVisibility(false);
                        }}
                        >
                            <Text style={styles.confirmOrderText}>{helper.translate("order")}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{paddingBottom:helper.px(16)}}></View>
                </View>
            </ScrollView>
        </Modal>
    )
}

const styles = StyleSheet.create({
    layoutModal: {
        backgroundColor: colors.main , 
        height: helper.screenHeight-helper.px(200),
        borderTopRightRadius: helper.px(10),
        borderTopLeftRadius: helper.px(10), 
        paddingVertical: helper.px(16),
    },
    layoutScroll: {
        paddingHorizontal: helper.px(16),
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
    title: {
        fontSize: helper.px(24), 
        fontWeight: "700", 
        fontFamily:helper.fontFamily(),
        lineHeight:helper.px(30),
        color: colors.text,
        marginBottom: helper.px(20) ,
    },
    orderDetailCon: {
        // minHeight:helper.px(60), 
        paddingVertical:helper.px(12),
        paddingHorizontal:helper.px(16),
        justifyContent:"space-between",
        borderTopWidth: helper.px(1),
        borderTopColor: colors.border,
    }, 
    orderDetailSectionCon: {
        flexDirection:"row", 
        alignItems: "center", 
        justifyContent:"space-between",
    },
    orderInfoText:{
        fontSize: helper.px(14), 
        fontWeight: "400", 
        fontFamily:helper.fontFamily(),
        lineHeight:helper.px(17),
        color: colors.text,
    },
    promoButton: {
        flexDirection:"row", 
        alignItems:"center",
    },
    checkbox: {
        width:helper.px(16) ,
        height:helper.px(16) ,
        borderRadius: helper.px(5), 
        borderWidth: helper.px(1), 
        borderColor: colors.border , 
        marginRight: helper.px(10), 
    },
    confirmOrderContainer: {
        height:helper.px(76),
        borderTopColor: colors.border, 
        borderTopWidth: helper.px(1), 
        justifyContent:"center", 
        alignItems:"center", 
        paddingHorizontal: helper.px(16),
    },
    confirmOrderButton: {
        height:helper.px(44),
        width:"100%",
        borderRadius:helper.px(50),
        justifyContent:"center", 
        alignItems:"center", 
        backgroundColor:colors.text,
    },
    confirmOrderText: {
        fontSize: helper.px(16), 
        fontWeight: "600", 
        fontFamily:helper.fontFamily("Bold"),
        lineHeight:helper.px(20),
        color: colors.main,
    },
    horizontalSliderRenderItem : {
        paddingHorizontal: helper.px(16),
    },
    similarPro :{
        width: "100%",
    }
}); 



export default helper.mobx(BasketModal); 