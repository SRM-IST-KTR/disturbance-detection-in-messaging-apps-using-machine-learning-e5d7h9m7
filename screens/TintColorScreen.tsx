import React, { useState, useEffect } from 'react';
import { StyleSheet, Pressable, Text, BackHandler } from "react-native";
import { View } from '../components/Themed';
import Colors from "../constants/Colors";
import { TouchableRipple } from "react-native-paper";
import { TintColor } from "../atoms/HelperStates";
import PreviewScreen from "../components/PreviewScreen";
import { useRecoilState } from "recoil";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, Feather} from '@expo/vector-icons';
import useColorScheme from '../hooks/useColorScheme';

const TintColorScreen = () => {

  const systemColorScheme = useColorScheme()
  const navigation = useNavigation()
  const [colorScheme, setColorScheme] = useState(systemColorScheme)
  const [mode, toggleMode] = useState(systemColorScheme)
  const [tintColor, setTintColor] = useRecoilState(TintColor)
  const [heightArray, setHeightArray] = useState([60, 60, 60, 60, 60])
  const [darkColor, setDarkColor] = useState(systemColorScheme == 'dark' ? '#9897a9' : '#00000060')
  const [lightColor, setLightColor] = useState(systemColorScheme == 'dark' ? '#9897a9' : '#00000060')

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

  const initHeightArray = (index) => {
    var newHeightArray = []
    var i = 0
    while(i<5){
      newHeightArray[i] = (i==index) ? 40 : 60
      i++
    }
    return newHeightArray
  }

  useEffect(() => {
    const index = ['purple', 'blue', 'red', 'green', 'cyan'].indexOf(tintColor)
    setHeightArray(initHeightArray(index))
  }, [])

  useEffect(() => {
    toggleMode(systemColorScheme)
  },[systemColorScheme])

  const changeColor = (color, index) => {
      setTintColor(color)
      setHeightArray(initHeightArray(index))
  }

  const activateModeButton = (mode) => {
    setColorScheme(mode)
    if(mode == 'dark'){
      setDarkColor(systemColorScheme == 'dark' ? 'white' : 'black')
      setLightColor(systemColorScheme == 'dark' ? '#9897a9' : '#00000060')
    }
    else {
      setLightColor(systemColorScheme == 'dark' ? 'white' : 'black')
      setDarkColor(systemColorScheme == 'dark' ? '#9897a9' : '#00000060')
    }
  }

  useEffect(() => {
    activateModeButton(mode)
  },[mode])

  return (
    <View style={styles.container}>

      <View style={[styles.topBar, {borderBottomColor: Colors[systemColorScheme].settingsSeparator}]}>

        <Pressable style={[styles.circle, {width: heightArray[0], height: heightArray[0]}]} onPress={() => changeColor('purple', 0)}>
           <View style={[{backgroundColor: Colors.customThemes['purple'].light.tint, height: heightArray[0], width: heightArray[0]/2 + 0.2}]} />
           <View style={[{backgroundColor: Colors.customThemes['purple'].dark.tintFaded, height: heightArray[0], width: heightArray[0]/2 + 0.2}]} />
        </Pressable>

        <Pressable style={[styles.circle, {width: heightArray[1], height: heightArray[1]}]} onPress={() => changeColor('blue', 1)}>
           <View style={[styles.tintColor, {backgroundColor: Colors.customThemes['blue'].light.tint, height: heightArray[1], width: heightArray[1]/2 + 0.2}]} />
           <View style={[styles.tintColor, {backgroundColor: Colors.customThemes['blue'].dark.tintFaded, height: heightArray[1], width: heightArray[1]/2 + 0.2}]} />
        </Pressable>

        <Pressable style={[styles.circle, {width: heightArray[2], height: heightArray[2]}]} onPress={() => changeColor('red', 2)}>
           <View style={[styles.tintColor, {backgroundColor: Colors.customThemes['red'].light.tint, height: heightArray[2], width: heightArray[2]/2 + 0.2}]} />
           <View style={[styles.tintColor, {backgroundColor: Colors.customThemes['red'].dark.tintFaded, height: heightArray[2], width: heightArray[2]/2 + 0.2}]} />
        </Pressable>

        <Pressable style={[styles.circle, {width: heightArray[3], height: heightArray[3]}]} onPress={() => changeColor('green', 3)}>
           <View style={[styles.tintColor, {backgroundColor: Colors.customThemes['green'].light.tint, height: heightArray[3], width: heightArray[3]/2 + 0.2}]} />
           <View style={[styles.tintColor, {backgroundColor: Colors.customThemes['green'].dark.tintFaded, height: heightArray[3], width: heightArray[3]/2 + 0.2}]} />
        </Pressable>

        <Pressable style={[styles.circle, {width: heightArray[4], height: heightArray[4]}]} onPress={() => changeColor('cyan', 4)}>
           <View style={[styles.tintColor, {backgroundColor: Colors.customThemes['cyan'].light.tint, height: heightArray[4], width: heightArray[4]/2 + 0.2}]} />
           <View style={[styles.tintColor, {backgroundColor: Colors.customThemes['cyan'].dark.tintFaded, height: heightArray[4], width: heightArray[4]/2 + 0.2}]} />
        </Pressable>

      </View>

      <PreviewScreen tintColor={tintColor} colorScheme={colorScheme}/>

      <View style={styles.bottomBar}>
        <Ionicons name="moon" size={35} color={darkColor} onPress={() => toggleMode('dark')}/>
        <Feather name="sun" size={35} color={lightColor} onPress={() => toggleMode('light')}/>
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  topBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    borderBottomWidth: 2,
    height: 100
  },
  circle: {
    flexDirection: 'row',
    borderRadius: 30,
    overflow: 'hidden',
    borderRadius: 30
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '50%',
    top: 80
  }
})

export default TintColorScreen
