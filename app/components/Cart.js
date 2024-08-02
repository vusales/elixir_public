import React , {useState}  from 'react';
import {
    View , 
    Text ,  
    StyleSheet  , 
    TouchableOpacity , 
    ScrollView , 
    ImageBackground
} from "react-native"; 
import helper from '../helpers/helper';
import colors from '../values/colors';
import CartModal from '../modals/CartModal';

const Cart = ({
    data , 
    wishList , 
    setWishList , 
    setwishListItems , 
    wishListItems , 
}) => {
    const [ modalVisibility , setModalVisibility]=useState(false);
    const {
        cardImage ,  
        description , 
        discountPrice , 
        excerpt , 
        href ,
        name , 
        price , 
        product_id , 
        options , 
        special , 
    } = data ; 
    

    return (
        <>
            <TouchableOpacity 
            style={styles.baseContainer}
            onPress={()=>setModalVisibility(!modalVisibility)}
            >
                <View style={styles.infoContainer}>
                    <Text style={styles.title}>{name}</Text>
                    <Text 
                    style={styles.smallInfo}
                    numberOfLines={2}
                    >{excerpt||description}</Text>
                    <View style={styles.priceContainer}>
                        {
                            discountPrice? 
                            <>
                                <Text style={styles.newPrice}>{discountPrice}₼</Text>
                                <Text style={styles.oldPrice}>{price}₼</Text>
                            </>
                            :
                            <Text style={styles.newPrice}>{price}₼</Text>
                        }
                    </View>
                </View>
                <View style={styles.imageContainer}>
                    <ImageBackground  
                    source={{uri: cardImage}} 
                    style={styles.image} 
                    resizeMode="contain"
                    imageStyle={styles.imagestyle}
                    ></ImageBackground>
                </View>
            </TouchableOpacity>
            <CartModal
            data={data}
            visibility={modalVisibility}
            setVisibility={(value)=>setModalVisibility(value)}
            setWishList={(newList)=>setWishList(newList)}
            wishList={wishList}
            setwishListItems={(newItem)=>setwishListItems(newItem)}
            wishListItems={wishListItems}
            />
        </>
    )
}

const styles =  StyleSheet.create({
    baseContainer:{
        flexDirection:"row", 
        marginBottom:helper.px(10),   
        paddingVertical:helper.px(10),
        alignItems:"center",
    },
    infoContainer: {
        flex:2, 
    }, 
    imageContainer: {
        flex:1, 
        alignItems:"center",
        justifyContent:"center",
    }, 
    title:{
        fontSize: helper.px(14), 
        fontFamily: helper.fontFamily("Bold"),
        fontWeight: `600` , 
        lineHeight:  helper.px(17), 
        color:colors.text , 
        marginBottom: helper.px(8),
    }, 
    smallInfo: {
        fontSize: helper.px(12), 
        fontFamily: helper.fontFamily(),
        fontWeight: '400', 
        lineHeight: helper.px(15), 
        color: colors.text,
        marginBottom: helper.px(8),
        width:"80%",
    }, 
    priceContainer:{
        flexDirection:"row", 
        alignItems:"center",
    },
    newPrice:{
        fontSize: helper.px(14), 
        fontFamily: helper.fontFamily("Bold"),
        fontWeight: '600', 
        lineHeight: helper.px(17), 
        color: colors.text,
        marginRight: helper.px(5),
    },
    oldPrice:{
        fontSize: helper.px(10), 
        fontFamily: helper.fontFamily("Light"),
        fontWeight: '300', 
        lineHeight: helper.px(12), 
        color: colors.subTitle,
        textDecorationLine: "line-through",
        marginTop: helper.px(4),
    },
    image:{
        flex:1,
        borderWidth: helper.px(1),
        borderColor: colors.border,
        height:helper.px(100),
        width:helper.px(100),
    }, 
    imagestyle: {
        width: "95%",
        position: 'absolute', 
        left: "2.5%"
    }
});

export default Cart ; 
