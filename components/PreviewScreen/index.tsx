import React from "react";
import { View, ImageBackground, Dimensions } from "react-native";
import styles from "./styles";
import Colors from "../../constants/Colors";
import dark from "../../assets/images/dark.png";
import bricks from "../../assets/images/bricks.png";

const PreviewScreen = ({ tintColor, colorScheme}) => {

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  return (
    <ImageBackground
      style = {{width: 250/412 * windowWidth, height: 470/853 * windowHeight}}
      source = {colorScheme == 'dark' ? dark : bricks}
      imageStyle={styles.container}>

      <View style={[styles.container, {width: 250/412 * windowWidth, height: 470/853 * windowHeight, borderWidth: 1, borderColor: colorScheme == 'dark' ? 'white' : 'black'}]} >

          <View style={[styles.topBar, {backgroundColor: Colors.customThemes[tintColor][colorScheme].tint}]}/>

          <View style={styles.chat}>
            <View style={[styles.message, {backgroundColor: Colors.customThemes[tintColor][colorScheme].tintFaded, marginLeft: 103/412 * windowWidth, height: 50, width: 140/412 * windowWidth}]} />
            <View style={[styles.message, {backgroundColor: colorScheme == 'light' ? 'white' : '#424949', width: 140/412 * windowWidth}]} />
            <View style={[styles.message, {backgroundColor: Colors.customThemes[tintColor][colorScheme].tintFaded, marginLeft: 103/412 * windowWidth, width: 140/412 * windowWidth, marginBottom: 10}]} />

            <View style={styles.bottomBar}>
              <View style={[styles.inputBox, {borderColor: colorScheme == 'light' ? Colors.customThemes[tintColor].light.tint : 'transparent', backgroundColor: Colors[colorScheme].keypad}]}/>
              <View style={[styles.mic, {backgroundColor: Colors.customThemes[tintColor]['light'].tint}]}/>
            </View>
          </View>

      </View>
    </ImageBackground>
  )
}

export default PreviewScreen
