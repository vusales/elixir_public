import React,  {useState , useEffect , useMemo} from "react";
import { 
    TouchableOpacity ,  
    View , 
    StyleSheet , 
    Text,
}  from "react-native";
import helper from '../../helpers/helper';
import colors from '../../values/colors';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import FilterModal  from "../../modals/FilterModal";


const FilterButton = ({stores , apiBody }) => {
    
    const [openFilter ,  setOpenFilter]= useState(false);
    // for range slider in Filter details modal
    const minMaxPriceSlider = useMemo(()=> stores.FilterDetailsStore.priceSliderValue);
    // puffs 
    const puffs = useMemo(()=> stores.FilterDetailsStore.puffs , [stores.FilterDetailsStore.puffs]);
    // taste
    const vapeTaste = useMemo(()=> stores.FilterDetailsStore.vapeTaste);
    // mah
    const mah = useMemo(()=> stores.FilterDetailsStore.mah);
    // mah and Taste Array 
    const mahAndTaste = useMemo(()=> stores.FilterDetailsStore.mahAndTestArray);

    // subCategories 

    const subCategories = useMemo(()=> stores.FilterDetailsStore.subCategories , [stores.FilterDetailsStore.subCategories] );


    useEffect(()=>{
        getFilterChoices();
    },[]);

    //for filter details Modal this function gets data 
    const getFilterChoices = async () => {
        try{    
            const getSubCatResult =  {
                category_id: apiBody.manufacturer_id , 
            }; 
            await stores.FilterDetailsStore.getFilterChoices(); 
            await stores.FilterDetailsStore.getFilteredSubCategory(getSubCatResult); 
        }catch(error){
            console.log("getFilterData modal func error" , {error});
        }
    }

    return (
        <>
            <TouchableOpacity
            style={styles.filterButton}
            onPress={()=>setOpenFilter(!openFilter)}
            >
                <View style={styles.container}>
                    <FontAwesomeIcon  name="sliders" size={helper.px(14)} color={colors.text}/> 
                    <Text style={styles.text}>{helper.translate("filter")}</Text>
                </View>
            </TouchableOpacity>

            <FilterModal 
            visibility={openFilter}
            setVisibility={setOpenFilter}
            minMaxPriceSlider={minMaxPriceSlider}
            puffs={puffs}
            mah={mah}
            vapeTaste={vapeTaste}
            apiBody={apiBody}
            mahAndTaste={mahAndTaste}
            subCategories={subCategories}
            /> 
        </>
    )
}

const styles = StyleSheet.create({
    filterButton: {
        width:helper.px(104.91), 
        height: helper.px(33), 
        backgroundColor:"#fff",
        borderRadius:helper.px(40), 
        paddingHorizontal:helper.px(16) ,
        paddingVertical:helper.px(8),
        marginRight:helper.px(17), 
    },
    text:{
        color: colors.text , 
        fontWeight:"600", 
        fontSize:helper.px(14),
        lineHeight:helper.px(17), 
        fontFamily:helper.fontFamily("Bold"),
    },
    container: {
        width:"100%",
        flexDirection:"row", 
        justifyContent:"space-around",
        alignItems:"center",
    }
});

export default helper.mobx(FilterButton) ;