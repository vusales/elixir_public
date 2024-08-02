import React, { useEffect ,  useState } from "react";
import {
    Text,
    View,
    StyleSheet,
    Animated,
    FlatList, 
  } from 'react-native';
import colors from '../values/colors';
import helper from '../helpers/helper';




const HorizontalSlider = (props) => {
    
    const scrollX = new Animated.Value(0);
    let position = Animated.divide(scrollX , helper.screenWidth);
    
    const RenderItem = ({item}) => {
        return <View style={{...styles.container , ...props.renderItemContainerStyle}}>{React.cloneElement(props.children, { data: item})}</View>  
    }

    
    if(props.data&&props.data.length){
        
        return (
            <View 
            style={{...styles.layout, ...props.style}}
            >
                {props.title?
                <Text style={styles.headerComponent}> {props.title} </Text>
                :null}

                <FlatList
                data={props.data}
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
                        props.data?.map((item , index)=> {
                            let opacity = position.interpolate({
                                inputRange: [ index-1, index , index+1 ] ,
                                outputRange: [0.3 , 1 , 0.3 ],
                                extrapolate: "clamp"
                            });
        
                            return (
                                <Animated.View
                                key={index}
                                style={{opacity , ...styles.dotCon }}
                                >
                                    <View style={styles.dot}></View>
                                </Animated.View>
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
    container:{
        alignItems:"center",
        justifyContent:"center",
        // width:helper.px(355),
        width:helper.screenWidth ,
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
    dotCon:{
        height:helper.px(14) , 
        width: helper.px(14) ,
        marginHorizontal: helper.px(8) , 
        marginVertical: helper.px(10),
        backgroundColor: colors.text , 
        borderRadius: 100,
        justifyContent:"center",
        alignItems:"center", 
    },
    dot: {
        height:helper.px(10) , 
        width: helper.px(10) , 
        backgroundColor: colors.border , 
        borderRadius: 100,
    }, 
    headerComponent: {
        fontFamily: helper.fontFamily("Bold"), 
        fontSize:helper.px(16),
        lineHeight:helper.px(20),
        color:colors.text,  
        fontWeight:"600",
        textAlign: "center",
        marginBottom: helper.px(16),
    }

});

export default HorizontalSlider ; 