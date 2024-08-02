import React , {useState , useMemo}  from 'react';
import {View , Text ,  StyleSheet  , TouchableOpacity , ScrollView ,  TextInput } from "react-native"; 
import Authlayout from "../layouts/AuthLayout";
import helper from '../helpers/helper';
import colors from '../values/colors';
import {SEARCHDETAILS} from "../values/screensList";
import i18next from "i18next";
import Alert from '../components/Alert';


const Search = ({navigation , stores }) => {
    const [searchedItem ,  setSearchedItem ] = useState(""); 
    const [error, setError] = useState({
        errorDescription : "" , 
        showAlert: false , 
        type: ""
    });
    const data = useMemo(()=>stores.FilterDetailsStore.filteredProducts);

    const SearchItems = async () => {
        try{

            if(searchedItem){
                navigation.navigate(SEARCHDETAILS , { searchedItem }); 
                setSearchedItem("");
            }else {
                setError({
                    errorDescription : i18next.t("searchtexterror"), 
                    showAlert: true , 
                    type: "error"
                });
            }
        }catch(error){
            console.log("search catch error" ,  {error}); 
        }
    }

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
            }) }
            />
            :null
        }
        <Authlayout
        showHeader={true}
        title={helper.translate("productsearch")}
        >
            <ScrollView 
            style={styles.layout}
            // StickyHeaderComponent={() => <View>Bottom button</View>}
            stickyHeaderIndices={[0]}
            // invertStickyHeaders={true}
            >
                {/* content */}
                <Text style={styles.pageTitle}>{helper.translate("userdata")}</Text>
                <TextInput 
                style={styles.input}
                onChangeText={setSearchedItem}
                value={searchedItem}
                placeholder="Vozol Alien 5000..."
                placeholderTextColor={colors.secondary}
                userInterfaceStyle="light"
                />   

            </ScrollView>
        </Authlayout>

        {/* stickyFooter */}
        <View style={styles.stickyButtonContainer}>
            <TouchableOpacity
            style={styles.button}
            onPress={()=>SearchItems()}
            >
                <Text style={styles.buttonText}>{helper.translate("search")}</Text>
            </TouchableOpacity>
        </View>

        </>
        
    )
}

const styles =  StyleSheet.create({
    layout:{
        // paddingBottom:helper.px(70),
        paddingHorizontal: helper.px(20),
    },
    pageTitle:{
        fontWeight: "700", 
        fontFamily:helper.fontFamily(),
        fontSize: helper.px(24), 
        lineHeight: helper.px(30),
        color:colors.text, 
        marginBottom: helper.px(24),
        marginTop: helper.px(32),
    },
    input: {
        // paddingHorizontal:helper.px(12), 
        paddingHorizontal:helper.px(16), 
        paddingVertical:helper.px(12), 
        borderWidth: helper.px(1),
        borderColor: colors.border,
    },
    stickyButtonContainer:{
        padding:helper.px(16),
        borderTopWidth:helper.px(1), 
        borderTopColor: colors.border,
        backgroundColor:colors.main,
    },
    button:{
        height:helper.px(44),
        backgroundColor: colors.text,
        borderRadius: helper.px(50),
        justifyContent:"center",
        alignItems: "center",
    }, 
    buttonText: {
        fontWeight: "600", 
        fontFamily:helper.fontFamily("Bold"),
        fontSize: helper.px(16), 
        lineHeight: helper.px(20),
        color:colors.main, 
    }, 

});

export default helper.mobx(Search);