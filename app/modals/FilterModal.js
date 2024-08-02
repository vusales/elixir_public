import React,  {useEffect, useMemo, useState ,  } from "react";
import {View , Text ,  StyleSheet  , TouchableOpacity , ScrollView , ImageBackground , Pressable   } from "react-native"; 
import Modal from "react-native-modal";
import helper from "../helpers/helper";
import colors from "../values/colors";
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { useNavigation } from '@react-navigation/native';
import FilterCheckboxComponnet from "../components/FilterCheckBoxComponent";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import i18next from "i18next";
import DropDownComponent from "../components/DropDownComponent";
import { cloneDeep } from 'lodash';
import PuffsBaseComponent from "../components/PuffsBaseComponent";
import CategortyCollapsibleComponent from "../components/CategortyCollapsibleComponent";


const FilterModal = ({ 
    stores , 
    visibility ,
    setVisibility, 
    minMaxPriceSlider,  
    puffs ,   
    apiBody ,
    mahAndTaste ,
    subCategories , 
}) => {
    const navigation =  useNavigation();
    // choosen filters 
    const resultFilterData=useMemo(()=> stores.FilterDetailsStore.resultData ); 

    // dropdowns value
    const [dropDownValue , setDropDownValue ] = useState(null); 
    const [ allChoosenDropdownValues ,  setDropdownValues ] =  useState({}); 
    // *********

    // for quality puffs (choosenPuffs) 
    const [ choosenPuffs ,  setChoosenPuffs] = useState([]);
    const [qualityValue , setQualityValue] = useState([]); 
    const [choosenPuffsWithId , setChoosenPuffsWithId] = useState({}); 
    const setQualityVal = (value) => {
        // if(puffs[0]){
        //     let values = puffs[0]?.values?.map((item)=>{
        //         return item.value; 
        //     });
        //     setQualityValue(values) ; 
        // }

        if(value.length) {
            let values = value?.map((item)=>{
                return item.value; 
            });
            setQualityValue(values);
        }
    }
    // ***********

    //3. range slider (sliderValue)
    const [scrollEnabled,  setScrollEnabled ] =  useState(false);
    const [sliderValue ,  setSliderValue]=useState([minMaxPriceSlider.min  , minMaxPriceSlider.max]);
    const enableScroll = () => setScrollEnabled(true);
    const disableScroll = () => setScrollEnabled(true);
    // ************


    //4. Choosen SubCategory

    const [ subCategory , setSubCategory ] = useState("") ; 

    useEffect(()=>{
        // for show previous chosen puffs 
        // if(resultFilterData?.filter?.[puffs[0].filter_id]){
        //     setChoosenPuffs([ ...resultFilterData?.filter?.[puffs[0].filter_id] , ...choosenPuffs]); 
        // }
        // ******************************
        if(resultFilterData?.filter?.category_id){
            setSubCategory(resultFilterData?.filter?.category_id); 
        }
        // min max value
        if(resultFilterData?.price_max){
            setInitialSliderVal("1" , resultFilterData?.price_max );   
        }
        if(resultFilterData?.price_min){
            setInitialSliderVal("0" , resultFilterData?.price_min );   
        }
        // *********************

        // setting puffs quality for quality puffs (choosenPuffs)
        // setQualityVal(); 

    }, []);

    useEffect(()=>{
        // for price Slider  
        if(resultFilterData.price_max && resultFilterData.price_min ){
            setSliderValue([resultFilterData.price_min   , resultFilterData.price_max]); 
        }else{
            setSliderValue([minMaxPriceSlider.min  , minMaxPriceSlider.max]); 
        }
        // ****************
    }, [minMaxPriceSlider]); 

    // set dropdown value 
    useEffect(()=>{
        setDropDownValues();
    }, [dropDownValue]) ; 

    const CustomMarkerComponent=()=>(<View style={styles.markerStyle}></View>);

    const setInitialSliderVal = (index , value ) => {
        const sliderValueClone = cloneDeep(sliderValue)
        sliderValueClone[index] = value ; 
        setSliderValue(sliderValueClone); 
    }

    const applyFilter = async () => {
        try{
            let resultData = {
                "manufacturer_id":apiBody.manufacturer_id,
                "page": 1 , 
                "filter" : {},
                "price_min" :  sliderValue[0] ,  
                "price_max": sliderValue[1],  
            }

            resultData.filter = {
                "category_id":  subCategory ,
                ...allChoosenDropdownValues , 
            }

            // if(choosenPuffs.length) {
            //     resultData.filter[puffs[0].filter_id] = choosenPuffs ; 
            // }

            await stores.FilterDetailsStore.setResultData(resultData); 
            await stores.FilterDetailsStore.getFilteredProducts(resultData); 

        }catch(error){
            console.log("apply Filter catch error" , {error}) ; 
        }
        setVisibility(false);
    }

    const clearFilters = async () => {
        try{
            await stores.FilterDetailsStore.clearResultData();
            await stores.FilterDetailsStore.getFilteredProducts(apiBody); 
        }catch(error){
            console.log("clear filter Error" , {error} ); 
        }
    }

    // Dropdown values
    const setDropDownValues = () => {
        let filterValuesItem = cloneDeep(allChoosenDropdownValues) ; 
        if(dropDownValue !== null && dropDownValue ){
            mahAndTaste.map((item) => {
                let finded =  item.values.find( (item)=> item.value == dropDownValue ); 
                if(finded?.value == dropDownValue ){

                    if(filterValuesItem[item.filter_id]){
                        filterValuesItem[item.filter_id].push(dropDownValue); 
                    }else {
                        filterValuesItem[item.filter_id] = [dropDownValue] ; 
                    }
                } 
            }); 
            // console.log("filterValuesItem" ,  filterValuesItem );

            setDropdownValues({...filterValuesItem});
        }
    }

    // dropDown Zindexs
    const  calculateZindex = (index , length ) => {
        let zIndex = length * 1000 ;
        if(index === 0) {
            return zIndex ; 
        }else {
            if (zIndex === 0 ) return ; 
            zIndex-=1000 ;
            return zIndex ; 
        }
    }


    // brings choosenPufss and makes object whitch keys are id 
    const setChoosenPuffsWithIdFunc = (filter_id  , values) => {
        const baseObj =  cloneDeep(choosenPuffsWithId) ; 
        baseObj[filter_id] = values ; 

        setChoosenPuffsWithId({
            ...baseObj 
        }); 
    }

    // helper.translate gave more renderer error because i used clearFilterText
    const clearFilterText = i18next.t("clearfilter"); 
    
    return(
       <Modal
       style={{margin: 0, bottom: 0 , ...styles.layoutModal }}
       animationIn={"slideInUp"}
       isVisible={visibility}
       onBackdropPress={()=>setVisibility(false)}
       onBackButtonPress={()=>setVisibility(false)}
       onSwipeComplete={()=>setVisibility(false)}
       deviceWidth={helper.screenWidth}
       swipeDirection={['down']}
       panResponderThreshold={50}
       >
        <View  style={styles.lineContainer}>
            <View style={styles.line}></View>
        </View>
        <ScrollView
        horizontal={false}
        showsVerticalScrollIndicator={false}
        // style={styles.layoutModal}
        keyboardShouldPersistTaps={"always"}
        >
            <View style={styles.titleAndClear}>
                <Text style={styles.title} >{helper.translate("filterproducts")}</Text>
                {
                    dropDownValue !== null && dropDownValue 
                    || choosenPuffs.length !== 0 || subCategory ? 
                    <TouchableOpacity 
                    style={styles.clearButton}
                    onPress={()=>clearFilters()}
                    >
                        <MaterialIcons name="clear-all" size={22} color={colors.error} />
                        <Text 
                        breakMode="word-wrap"
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={styles.clearButtonText}>{clearFilterText}</Text>
                    </TouchableOpacity>
                    :null
                }
            </View>

            <View style={{
                minHeight:500, 
                marginBottom: helper.px(50) ,
            }}>
                {/* {
                    puffs?.map((item , index)=>{
                        setQualityVal(item.values);

                        return (
                            <PuffsBaseComponent
                            key={index}
                            choosenPuffs={choosenPuffs}
                            setChoosenPuffs={(val)=>setChoosenPuffs(val)}
                            title={item.name}
                            qualityValue={qualityValue}
                            setChoosenPuffsWithIdFunc={()=>setChoosenPuffsWithIdFunc(item.filter_id , qualityValue )}
                            />
                        )
                    })
                } */}
                {/* <Text style={styles.subTitle} >{helper.translate("smokequality")}</Text>
                <View style={styles.checboxesContainer}>
                    {
                        qualityValue?.map((item ,index)=>{
                            return(
                                <FilterCheckboxComponnet 
                                key={`filterDetailsCheckbox${index}`}
                                index={index}
                                item={item}
                                choosenPuffs={choosenPuffs}
                                setChoosenPuffs={(val)=>setChoosenPuffs(val)}
                                />
                            );
                        })
                    }
                </View> */}
                {
                    subCategories?.length? 
                    <CategortyCollapsibleComponent
                    setSubCategory={(value) => setSubCategory(value)}
                    subCategories={subCategories}
                    subCategory={subCategory}
                    />
                    :null
                }
                
                <Text style={styles.subTitle} >{helper.translate("value")}</Text>
                <View style={styles.rangeContainer}>
                    <View style={styles.rangePriceLabel}>
                        <Text style={styles.rangeText}>{sliderValue[0]} ₼</Text>
                        <Text style={styles.rangeText}>{sliderValue[1]} ₼</Text>
                    </View>
                    <MultiSlider
                        values={[sliderValue[0] , sliderValue[1] ]}
                        onValuesChange={(value)=>{
                            setSliderValue(value);
                        }}
                        min={minMaxPriceSlider.min}
                        max={minMaxPriceSlider.max}
                        step={3}
                        allowOverlap={false}
                        snapped
                        minMarkerOverlapDistance={40}
                        customMarker={CustomMarkerComponent}
                        trackStyle={{
                            height: 5,
                            borderRadius: 8
                        }}
                        containerStyle={{
                            height: helper.px(30),
                        }}
                        selectedStyle={{
                            backgroundColor: colors.text,
                            height: helper.px(1),
                        }}
                        unselectedStyle={{
                            backgroundColor: "#ABB5B6",
                            height: helper.px(1),
                        }}
                        sliderLength={helper.px(295)}
                    />
                </View>
                {
                    mahAndTaste.map((item , index )=>{
                        return(
                            <DropDownComponent
                            key={index}
                            drItems={item.values}
                            drTitle={item.name}
                            getDropDownValue={(value) => setDropDownValue(value)}
                            drZindex={calculateZindex(index , mahAndTaste?.length )}
                            />
                        )
                    })
                }
                <TouchableOpacity
                style={styles.resultButton}
                onPress={()=>applyFilter()}
                >
                    <Text style={styles.buttonText}>{helper.translate("applyfilter")}</Text>
                </TouchableOpacity>
            </View> 
        </ScrollView>
       </Modal>
    )

}

const styles =  StyleSheet.create({
    layoutModal: {
        backgroundColor: colors.main , 
        height: helper.screenHeight,
        padding: helper.px(16),
        borderTopRightRadius: helper.px(10),
        borderTopLeftRadius: helper.px(10), 
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
    titleAndClear:{
        flexDirection: "row", 
        backgroundColor: "skyBlue",
        justifyContent:"space-between",
        alignItems: "flex-start",
    }, 
    clearButton:{
        flexDirection: "row", 
        alignItems:"center",
        justifyContent: "center",
        borderWidth: helper.px(1), 
        borderColor: colors.error , 
        borderRadius: helper.px(10), 
        padding: helper.px(8) ,
        maxWidth:"40%", 
        justifyContent:"space-between",
    },
    clearButtonText:{
        color: colors.error , 
        fontFamily:helper.fontFamily("Bold"),
        fontSize: helper.px(14), 
        fontWeight: "400", 
        lineHeight:helper.px(16),
        marginLeft: helper.px(3),
        width:"70%",
        textAlign:"center",
    },
    title: {
        fontFamily:helper.fontFamily("Black"),
        fontSize: helper.px(24), 
        fontWeight: "700", 
        lineHeight:helper.px(30),
        color: colors.text,
        marginBottom: helper.px(20) ,
    }, 
    subTitle: {
        fontFamily:helper.fontFamily("Bold"),
        fontSize: helper.px(18), 
        fontWeight: "600", 
        lineHeight:helper.px(22),
        color: colors.text,
        marginBottom: helper.px(20) ,
    }, 
    dropDown:{
        borderColor: colors.border, 
        borderRadius: helper.px(0),
        marginBottom:helper.px(30),
    },
    checkbox: {
        width:helper.px(16) ,
        height:helper.px(16) ,
        borderRadius: helper.px(5), 
        borderWidth: helper.px(1), 
        borderColor: colors.border , 
        marginRight: helper.px(10), 
    },
    checboxesContainer: {
        flexDirection:"row", 
        marginBottom:helper.px(20),
        flexWrap: 'wrap', 
        width:"90%",
    },
    checboxText:{
        color: colors.text, 
        fontFamily:helper.fontFamily(),
        fontSize: helper.px(16), 
        fontWeight:"400", 
        lineHeight:helper.px(20), 
    },
    checboxContainer:{
        flexDirection:"row", 
        marginRight: helper.px(10) ,
        width:helper.px(75) ,
        paddingHorizontal: helper.px(8),   
        paddingVertical: helper.px(5),   
    },
    rangeContainer: {
        width: "100%", 
        // height: helper.px(68), 
        padding:helper.px(16),
        borderWidth: helper.px(1), 
        borderColor: colors.border, 
        alignItems: "center" ,  
        justifyContent: "center", 
    },

    markerStyle: {
        width:helper.px(12),
        height:helper.px(12),
        borderWidth: helper.px(1),
        borderColor: colors.text,
        backgroundColor: colors.main,
        borderRadius: helper.px(100),
    }, 
    rangePriceLabel: {
        width: helper.px(320),
        alignItems: "flex-end",
        justifyContent: "space-between",
        flexDirection: "row",
        paddingHorizontal: helper.px(10),
    },
    rangeText:{
        color: colors.text, 
        fontFamily:helper.fontFamily(),
        fontSize: helper.px(16), 
        fontWeight:"400", 
        lineHeight:helper.px(20), 
    }, 
    resultButton: {
        height: helper.px(44), 
        backgroundColor: colors.text, 
        justifyContent: "center", 
        alignItems: "center", 
        borderRadius: helper.px(50),
        marginTop: helper.px(20),
    },
    buttonText: {
        color: colors.main, 
        fontFamily:helper.fontFamily("Bold"),
        fontSize: helper.px(16), 
        fontWeight:"600", 
        lineHeight:helper.px(20), 
    },
});

export default helper.mobx(FilterModal);