import React , {useState , useRef, useEffect }  from 'react';
import moment from "moment";
import {
    View , 
    Text ,  
    StyleSheet  , 
    TouchableOpacity , 
    SafeAreaView  ,
    StatusBar ,
    TextInput ,  
} from "react-native"; 
import helper from '../helpers/helper';
import colors from '../values/colors';
import GoBackButton from "../components/layoutComponents/GoBackButton";
import MapView, { PROVIDER_GOOGLE ,  Marker} from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useNavigation } from '@react-navigation/native';
import { ORDER } from '../values/screensList';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import config from "../helpers/config"; 
import Alert from '../components/Alert';
import i18next from 'i18next';
{/* 40.38636358850745, 49.844470127229414 */}
import AutoCompleteInput from '../components/mapComponents/AutoCompleteInputComponent';

const initialMapState = {
    region:{
        latitude: 0 ,
        longitude: 0 ,
        latitudeDelta: 0.010,
        longitudeDelta: 0.0121,
    }, 
    listViewDisplayed: false,
    address: '',
    showAddress: false,
    search: '',
    currentLat: '',
    currentLng: '',
    forceRefresh: 0,
    inputAddress: '',
}


const Map = ({stores}) => {
    const navigation =  useNavigation();
    Geocoder.init(config.MAP_API);
    const mapView = useRef();
    const markerRef = useRef();
    const [mapDetails , setMapDetails] =  useState(initialMapState);
    const [error, setError] = useState({
        errorDescription : "" , 
        showAlert: false , 
        type: ""  
    });

    useEffect(()=>{
        let _mounted =  false ; 
        setMapDetails({
            ...mapDetails , 
            address: "" ,
        });
        // getCurrentPosition();
        return () => {
            _mounted= true ;
        }
    },[]);

    // useEffect(()=>{
    //     console.log("mapdetails" , mapDetails ); 
    // },[mapDetails.region]);

    // const getAddress = () => {
    //     //function to get address using current lat and lng
    //     fetch("https://maps.googleapis.com/maps/api/geocode/json?address=" + mapDetails.region.latitude + "," + mapDetails.region.longitude +"&key=" + "AIzaSyBejMgf-AIzaSyBGogWftlyFKBeX6zXowxks71fWILUNbgM")
    //     .then((response) => response.json())
    //     .then((responseJson) => {
    //         setMapDetails({ 
    //             ...mapDetails , 
    //             address:JSON.stringify(responseJson.results[0].formatted_address).replace(/"/g, "")
    //         });
    //     });
    // }

    const getCurrentPosition =  () => {
        try {
            Geolocation.getCurrentPosition(info => {
                setMapDetails({
                    ...mapDetails , 
                    region: {
                        ...mapDetails.region , 
                        latitude: info.coords.latitude,
                        longitude: info.coords.longitude,
                    }
                });
                changeCoordinatesToText({
                    latitude: info.coords.latitude,
                    longitude: info.coords.longitude,
                });
            });
        }catch(error){
            console.log(" getCurrentPosition error" , error) ; 
        }
    }

    const goToInitialLocation = (region) => {
        let initialRegion = Object.assign({}, region);
        initialRegion["latitudeDelta"] = 0.010;
        initialRegion["longitudeDelta"] = 0.0121;
        mapView.current.animateToRegion(initialRegion, 2000);
    };

    const goToUserText = async (text) => {
        if(text) {
            await Geocoder.from(text)
            .then(json => {
                // if(json.results[0]!=undefined){
                    var location = json.results[0].geometry.location;
                    // console.log("location.lng " , location.lat ,  location.lng ) ;

                    setMapDetails({
                        ...mapDetails ,
                        region: {
                            ...mapDetails.region , 
                            latitude: location.lat, 
                            longitude: location.lng ,
                        } ,
                        address: text, 
                    });
                // }
                return ; 
            })
            .catch(error => console.log("getUserAddress", error));
        }
    }

   const onRegionChange = (region) => {
        setMapDetails(
            {
            ...mapDetails , 
            region: region ,
            forceRefresh: Math.floor(Math.random() * 100),
            },
        );
   };

   const markerAndMapPress = (coordinates) => {
    let newAdddress={
        ...coordinates , 
        latitudeDelta: 0.010,
        longitudeDelta: 0.0121,
    }
    onRegionChange(newAdddress); 
    changeCoordinatesToText(coordinates);

   }

    // Brings lat/long on marker press and changes to text , shows in input     
   const changeCoordinatesToText = (location) => {
        clearTimeout(changeTextTimeOut);
        let changeTextTimeOut = setTimeout(() => {
            Geocoder.from(location)
            .then(json => {
                    var locationText = json.results[0].formatted_address ;
                    // searchText.current.setAddressText(locationText);
                    setMapDetails({
                        ...mapDetails , 
                        address : locationText , 
                        region: {
                            ...mapDetails.region ,
                            ...location , 
                        }
                    });
                return ; 
            })
            .catch(error => console.log("getUserAddress", error)); 
        }, 200);
   }

    const ConfirmAddress =() => {
        if(mapDetails.address){
            navigation.navigate(ORDER , 
            {   
                address : mapDetails.address ,
                mapDetails: mapDetails , 
            });

            setTimeout(() => {
                // after all reset mapdetails
                setMapDetails(initialMapState);
            }, 1000);
        }else {
            setError({
                errorDescription : i18next.t("mapconfirmaddress") , 
                showAlert: true , 
                type: "error"
            }); 
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
            <View 
            style={styles.scrollLayout}>
                <KeyboardAwareScrollView
                    keyboardShouldPersistTaps="always"
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.goButtonContainer}>
                        <GoBackButton/>
                    </View>
                    <View style={styles.container}>
                        <MapView
                        ref={mapView}
                        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                        style={styles.map}
                        region={mapDetails.region}
                        showsCompass={false}
                        onMapReady={() => getCurrentPosition()}
                        onLongPress={(e)=> {
                            markerAndMapPress(e.nativeEvent.coordinate);
                            markerRef.current.animateMarkerToCoordinate(e.nativeEvent.coordinate);
                        }}
                        >
                            <Marker 
                            ref={markerRef}
                            coordinate={mapDetails.region}
                            draggable={true} 
                            tappable={true}
                            stopPropagation={true}
                            onPress={(e)=>{
                                markerAndMapPress(e.nativeEvent.coordinate);
                            }}
                            />
                        </MapView>
                        <AutoCompleteInput
                        confirmAddress={ConfirmAddress}
                        goToUserText={goToUserText}
                        initialAddress={mapDetails.address}
                        />
                    </View>
                </KeyboardAwareScrollView>
            </View>
        </SafeAreaView>
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
    },
    goButtonContainer:{
        position:"relative",
        zIndex:1000, 
        left:helper.px(16),
        top: helper.px(41),
    }, 
    container: {
        height:helper.isIOS ?helper.screenHeight - helper.px(100)  : helper.screenHeight,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    // buttonContainer: {
    //     paddingHorizontal: helper.px(16),
    //     backgroundColor: colors.main ,
    //     width: "100%" ,
    //     paddingBottom: helper.px(40),
    // },
    // confirmOrderButton :{ 
    //     backgroundColor: colors.text, 
    //     paddingHorizontal: helper.px(24),
    //     borderRadius: helper.px(50), 
    //     height: helper.px(44),
    //     justifyContent: "center", 
    //     alignItems: "center",
    //     flexDirection: "row",
    //     width: "100%",
    //     height:helper.px(44),
    //     marginTop: helper.px(10),
    // }, 
    // confirmText: {
    //     fontFamily: helper.fontFamily("Bold"), 
    //     fontWeight: "600", 
    //     color:colors.main, 
    //     lineHeight: helper.px(20), 
    //     fontSize: helper.px(16), 
    // },
    // inputContainer:{
    //     flexDirection: "row",
    //     alignItems:"center",
    //     height:helper.px(56),
    //     borderWidth: helper.px(1),
    //     borderColor: colors.border,
    //     paddingHorizontal: helper.px(16), 
    //     marginTop: helper.px(16),
    // },
}); 

export default helper.mobx(Map)  ; 