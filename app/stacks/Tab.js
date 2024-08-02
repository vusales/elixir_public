import React, {
  useState , 
  useEffect
} from 'react';
import {StyleSheet , View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import colors from '../values/colors';
import helper from '../helpers/helper';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  HomeScreen ,  
  SearchScreen , 
  SearchDetailsScreen ,
  FilterDetailsScreen,
  FavoritesScreen, 
  UserAccountScreen, 
  AccountDetailsScreen , 
  AccountNavigationScreen
} from "../screens/index";
import {
  HOME , 
  SEARCH , 
  SEARCHDETAILS , 
  FILTERDETAILS ,
  FAVORITES,
  ACCOUNT,
  ACCOUNTDETAILS, 
  LOGEDINACCOUNT,
} from '../values/screensList';


const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const SearchStack = createNativeStackNavigator();
const FavoritesStack = createNativeStackNavigator();
const UserAccountStack = createNativeStackNavigator();


const HomeScreenComponent =  props => (
  <HomeStack.Navigator screenOptions={helper.screenOptions}>
    <HomeStack.Screen name={HOME} component={HomeScreen} />
    <HomeStack.Screen name={FILTERDETAILS} component={FilterDetailsScreen} />
  </HomeStack.Navigator>
); 

const SearchScreenComponent =  props => (
  <SearchStack.Navigator screenOptions={helper.screenOptions}>
    <SearchStack.Screen name={SEARCH} component={SearchScreen} />
    <SearchStack.Screen name={SEARCHDETAILS} component={SearchDetailsScreen} />
  </SearchStack.Navigator>
); 

const FavoritesScreenComponent =  props => (
  <FavoritesStack.Navigator screenOptions={helper.screenOptions}>
    <FavoritesStack.Screen name={FAVORITES} component={FavoritesScreen} />
  </FavoritesStack.Navigator>
);

const UserAccountScreenComponent =  props => (
  <UserAccountStack.Navigator 
  screenOptions={helper.screenOptions}
  >
    <UserAccountStack.Screen name={ACCOUNT} component={AccountNavigationScreen} />
    <UserAccountStack.Screen name={LOGEDINACCOUNT} component={UserAccountScreen} />
    <UserAccountStack.Screen name={ACCOUNTDETAILS} component={AccountDetailsScreen} />
  </UserAccountStack.Navigator>
);

const Tabs = () => {

  const  [loginToken ,  setLoginToken ]= useState("");
  const [ deviceToken ,  setdeviceToken]= useState("");

  useEffect(()=>{
    // console.log("-----AAAA   loginToken" , loginToken ) ;
    // console.log("-----BBBB   deviceToken" , deviceToken ) ;
    getAsyncToken();
  },[loginToken , deviceToken ]);

  const getAsyncToken = async () => {
    try{
        await AsyncStorage.getItem("@logged_In_Token").then((data)=>{
          if(data !== null){
            setLoginToken(data);
          }
        }); 
        await AsyncStorage.getItem("@device_Token").then((data)=>{
          if(data !== null){
            setdeviceToken(data);
          }
        });

    }catch(error){
        console.log("error", error);
    }
  }


  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        tabBarStyle: {
          height: helper.isIOS ? helper.px(100) :helper.px(60),
          borderTopColor: colors.lightGray,
          borderBottomColor: colors.lightGray,
        },
      }}
      backBehavior="initialRoute"
      initialRouteName={HOME + "stack"} 
    >
      <Tab.Screen
        name={HOME + "stack"}
        header="box"
        component={HomeScreenComponent}
        options={{
          tabBarIcon: icon => {
            return (
              <View
              style={icon.focused ? {...styles.unfocusedIconLayout , ...styles.iconsLayout } : styles.unfocusedIconLayout}
              >
                <SimpleLineIcons
                  name="bag"
                  size={24}
                  style={styles.icon}
                  // color={icon.focused ? colors.text : colors.secondary}
                  color={colors.black}
                />
              </View>
          )},
          tabBarShowLabel: false,
        }}
      />  

      <Tab.Screen
        name={SEARCH + "stack"}
        header="box"
        component={SearchScreenComponent}
        options={{
          tabBarIcon: icon => {
            return (
              <View
              style={icon.focused ? {...styles.unfocusedIconLayout , ...styles.iconsLayout } : styles.unfocusedIconLayout}
              >
                <AntDesign
                  name="search1"
                  size={24}
                  style={styles.icon}
                  // color={icon.focused ? colors.text : colors.secondary}
                  color={colors.black}
                />
              </View>
          )},
          tabBarShowLabel: false,
        }}
      />  

      <Tab.Screen
        name={FAVORITES + "stack"}
        header="box"
        component={FavoritesScreenComponent}
        options={{
          tabBarIcon: icon => {
            return (
              <View
              style={icon.focused ? {...styles.unfocusedIconLayout , ...styles.iconsLayout } : styles.unfocusedIconLayout}
              >
                <AntDesign
                  name="hearto"
                  size={24}
                  style={styles.icon}
                  // color={icon.focused ? colors.text : colors.secondary}
                  color={colors.black}
                />
              </View>
          )},
          tabBarShowLabel: false,
        }}
      />  

      <Tab.Screen
        name={ ACCOUNT + "stack"}
        header="box"
        component={UserAccountScreenComponent}
        options={{
          tabBarIcon: icon => {
            return (
              <View
              style={icon.focused ? {...styles.unfocusedIconLayout , ...styles.iconsLayout } : styles.unfocusedIconLayout}
              >
                <AntDesign
                  name="user"
                  size={24}
                  style={styles.icon}
                  // color={icon.focused ? colors.text : colors.secondary}
                  color={colors.black}
                />
              </View>
          )},
          tabBarShowLabel: false,
        }}
        listeners={({ navigation, route }) => ({
          tabPress: async (e) => {
            // Prevent default action
            e.preventDefault();
            await getAsyncToken();
            if(loginToken !== deviceToken){
              navigation.navigate( 
                ACCOUNT + "stack" , 
                { screen: LOGEDINACCOUNT } 
              );
            }else{
              navigation.navigate("Login");
            }
          },
        })}
      /> 
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconsLayout: {
    backgroundColor: "#EEEEEE",
  }, 
  unfocusedIconLayout: {
    justifyContent:"center", 
    alignItems:"center", 
    borderRadius:helper.px(100),
    width: helper.px(50),
    height: helper.px(50),
    marginBottom:helper.px(5),
  }, 
  icon: {
    padding: helper.px(2),
  },
  tabStyle: {
    backgroundColor: 'black',
  },
});

export default Tabs;