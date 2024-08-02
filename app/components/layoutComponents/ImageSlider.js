import React, { useEffect ,  useState } from "react";
import {
    Text,
    View,
    ImageBackground, 
    StyleSheet,
    Image,
    StatusBar,
    SafeAreaView,
    TouchableOpacity,
    Animated,
    FlatList, 
  } from 'react-native';
import colors from '../../values/colors';
import helper from '../../helpers/helper';
import { reduce } from "lodash";

// let flatlist ; 


// const infiniteScroll = (datalist) => {
//     const numberOfData= datalist.length ;
//     let scrollValue = 0 , scrolled = 0 ;
//     setInterval(
//         ()=>{
//             scrolled ++ ; 
//             if(scrolled < numberOfData){
//                 scrolled = scrollValue + helper.screenWidth ;
//             }else {
//                 scrollValue = 0 ;
//                 scrolled = 0 ; 
//             }
//             this.flatlist.scrollToOffset({animated:true , offset: scrollValue })
//         }, 2000
//     )
// }

const RenderItem = ({item}) => {
    return (
        <View
        style={styles.imageContainer}
        >
          <Image 
          style={styles.image} 
          source={{uri: item.image}}
          />
        </View>
    )
}

const ImageSlider = ({data}) => {
    const scrollX = new Animated.Value(0);
    let position = Animated.divide(scrollX , helper.screenWidth);
    // const [dataList ,  setDataList] = useState(data);

    // useEffect(()=>{
    //     setDataList(data);
    //     infiniteScroll(dataList);
    // }, []);

    if(data&&data.length){
        return (
            <View 
            style={styles.layout}
            >
                <FlatList
                // ref={(flatlist)=>{this.flatlist = flatlist}}
                data={data}
                keyExtractor={(item, index)=>"key"+ index}
                horizontal
                pagingEnabled
                scrollEnabled
                snapToAlignment="center"
                scrollEventThrottle={16}
                decelerationRate={"fast"}
                showsHorizontalScrollIndicator={false}
                renderItem={({item})=> <RenderItem item={item} /> }
                onScroll={Animated.event(
                    [{nativeEvent: {contentOffset : {x: scrollX } } }],
                    {useNativeDriver: false}
                )}
                />
    
                <View style={styles.dotView}>
                    {
                        data?.map((item , index)=> {
                            let opacity = position.interpolate({
                                inputRange: [ index-1, index , index+1 ] ,
                                outputRange: [0.3 , 1 , 0.3 ],
                                extrapolate: "clamp"
                            });
        
                            return (
                                <Animated.View
                                key={index}
                                style={{opacity , height:5 , width: 40 , backgroundColor: colors.main , margin: 8 , borderRadius: 10}}
                                />
                            )
                        })
                    }
                </View>
            </View>
        )
    } 

    return null; 
}

const styles = StyleSheet.create({
    imageContainer:{
        // height: helper.px(250), 
        // width: helper.px(358), 
        width: helper.px(355), 
        height: helper.px(230), 
        alignItems:"center",
        justifyContent:"center",
        padding: helper.px(16),
        paddingHorizontal: helper.px(10),
    },
    image: {
        width:"100%", 
        height:"100%",
        borderRadius: helper.px(15), 
    },
    layout: {
        marginTop:helper.px(24),
    },
    dotView: {
        flexDirection:"row", 
        justifyContent:"center", 
    }, 

});

export default ImageSlider ; 