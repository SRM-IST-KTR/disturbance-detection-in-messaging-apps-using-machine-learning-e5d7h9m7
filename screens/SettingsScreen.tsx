import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, Alert, BackHandler } from "react-native";
import { View, Text } from '../components/Themed';
import { UserData } from "../atoms/HelperStates";
import { useRecoilState } from "recoil";
import { Storage, Auth } from "aws-amplify";
import { Ionicons, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import Colors from "../constants/Colors";
import { TouchableRipple } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import AwesomeAlert from 'react-native-awesome-alerts';
import useColorScheme from '../hooks/useColorScheme';
import { TintColor } from "../atoms/HelperStates";

const SettingsScreen = () => {

   const [userData] = useRecoilState(UserData)
   const colorScheme = useColorScheme()
   const [imgDisplay, setImgDisplay] = useState('none')
   const navigation = useNavigation();
   const [tintColor] = useRecoilState(TintColor)
   const [avatar, setAvatar] = useState('none')
   const [showAlert, setShowAlert] = useState(false)

   useEffect(() => {
     const fetchAvatar = (async() => {
       if(userData && userData.imageUri != 'none'){
         const url = await Storage.get(userData.imageUri)
         setAvatar(url)
       }
     })()
   },[])

   const handleBackButtonClick = () => {
     navigation.goBack()
     return true
   }

   useEffect(() => {
     BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
     return () => {
       BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
     };
   },[]);

   return (
     <View style={styles.container}>

        <TouchableRipple onPress={() => {navigation.navigate('EditDetailsScreen', {setSettingsAvatar: setAvatar})}} rippleColor={Colors[colorScheme].rippleColor}>
          <View style={[styles.topBar, {borderBottomColor: Colors[colorScheme].settingsSeparator}]}>
            {avatar != 'none' && <Image source={{uri: avatar}} style={[styles.image, { display: imgDisplay }]} onLoad={() => setImgDisplay('flex')}/>}
            {(avatar == 'none' || imgDisplay == 'none') &&
              <View style={[styles.image, {backgroundColor: Colors[colorScheme].contactBackground}]}>
                <Ionicons name="person" size={36} color={colorScheme == 'light' ? Colors.customThemes[tintColor].light.tint : Colors.customThemes[tintColor].dark.tabs} />
              </View>
            }
            <View style={styles.textBox}>
              <Text style={styles.name} numberOfLines={1} ellipsizeMode={'tail'}>{userData.name}</Text>
              <Text style={[styles.status, {color: Colors[colorScheme].settingsSecondary}]} numberOfLines={1} ellipsizeMode={'tail'}>{userData.status}</Text>
            </View>
          </View>
        </TouchableRipple>

        <TouchableRipple onPress={() => {navigation.navigate('TintColorScreen')}} rippleColor={Colors[colorScheme].rippleColor}>
          <View style={styles.optionBar}>
            <Ionicons name="color-palette" size={32} color={Colors.customThemes[tintColor][colorScheme].settingsIcons} />
            <View style={styles.optionText}>
              <Text style={styles.title} numberOfLines={1} ellipsizeMode={'tail'}>{'Tint Colour'}</Text>
              <Text style={[styles.subTitle, {color: Colors[colorScheme].settingsSecondary}]} numberOfLines={1} ellipsizeMode={'tail'}>{'Choose your own accent color'}</Text>
            </View>
          </View>
        </TouchableRipple>

        <View style={styles.optionBar}>
          <MaterialCommunityIcons name="theme-light-dark" size={32} color={Colors.customThemes[tintColor][colorScheme].settingsIcons} />
          <View style={styles.optionText}>
            <Text style={styles.title} numberOfLines={1} ellipsizeMode={'tail'}>{'App Theme'}</Text>
            <Text style={[styles.subTitle, {color: Colors[colorScheme].settingsSecondary}]} numberOfLines={1} ellipsizeMode={'tail'}>{'Light mode, dark mode, system default'}</Text>
          </View>
        </View>

        <View style={styles.optionBar}>
          <MaterialCommunityIcons name="wallpaper" size={32} color={Colors.customThemes[tintColor][colorScheme].settingsIcons} />
          <View style={styles.optionText}>
            <Text style={styles.title} numberOfLines={1} ellipsizeMode={'tail'}>{'Chat Wallpapers'}</Text>
            <Text style={[styles.subTitle, {color: Colors[colorScheme].settingsSecondary}]} numberOfLines={1} ellipsizeMode={'tail'}>{'Choose your own chat background'}</Text>
          </View>
        </View>

        <TouchableRipple onPress={() => setShowAlert(true)} rippleColor={Colors[colorScheme].rippleColor}>
          <View style={styles.optionBar}>
            <FontAwesome name="sign-out" size={35} color={Colors.customThemes[tintColor][colorScheme].settingsIcons} />
            <View style={styles.optionText}>
              <Text style={styles.title} numberOfLines={1} ellipsizeMode={'tail'}>{'Sign Out'}</Text>
              <Text style={[styles.subTitle, {color: Colors[colorScheme].settingsSecondary}]} numberOfLines={1} ellipsizeMode={'tail'}>{'Logout from your account'}</Text>
            </View>
          </View>
        </TouchableRipple>

        <AwesomeAlert
           show={showAlert}
           showProgress={false}
           title="Sign Out"
           message="Are you sure? Once signed out, you need your credentials to login again."
           closeOnTouchOutside={true}
           closeOnHardwareBackPress={true}
           showCancelButton={true}
           showConfirmButton={true}
           cancelText="NO"
           confirmText="YES"
           onDismiss = {() => setShowAlert(false)}
           onCancelPressed = {() => setShowAlert(false)}
           onConfirmPressed = {() => Auth.signOut()}
           contentContainerStyle = {[styles.alertContainer, {backgroundColor: colorScheme == 'dark' ? '#33414b' : 'white'}]}
           contentStyle = {{padding: 0}}
           titleStyle = {[styles.alertTitle, {color: Colors[colorScheme].text}]}
           messageStyle = {[styles.alertMessage, {color: colorScheme == 'dark' ? '#ccc' : 'black'}]}
           cancelButtonStyle = {[styles.alertButton, {backgroundColor: Colors.customThemes[tintColor][colorScheme].tintFaded}]}
           confirmButtonStyle = {[styles.alertButton, {backgroundColor: colorScheme == 'dark' ? Colors.customThemes[tintColor][colorScheme].settingsIcons : Colors.customThemes[tintColor][colorScheme].tint}]}
           cancelButtonTextStyle = {styles.alertButtonText}
           confirmButtonTextStyle = {styles.alertButtonText}
         />

     </View>
   )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  topBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
    width: '100%',
    borderBottomWidth: 1,
    backgroundColor: 'transparent'
  },
  image: {
    height: 70,
    width: 70,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textBox: {
    padding: 15,
    justifyContent: 'space-around',
    flex: 1,
    backgroundColor: 'transparent'
  },
  name: {
    fontSize: 20
  },
  status: {
    fontSize: 16
  },
  optionBar: {
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 20,
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'transparent'
  },
  title: {
    fontSize: 17,
    paddingVertical: 2
  },
  subTitle: {
    fontSize: 16,
    paddingVertical: 2,
    fontStyle: 'italic'
  },
  optionText: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'space-around',
    flex: 1,
    backgroundColor: 'transparent'
  },
  alertContainer: {
    backgroundColor: 'black',
    borderRadius: 15,
    paddingTop: 15,
    paddingBottom: 25
  },
  alertTitle: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  alertMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 5
  },
  alertButton: {
    width: 80,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center'
  },
  alertButtonText: {
    fontSize: 16,
    fontWeight: 'bold'
  }
})

export default SettingsScreen
