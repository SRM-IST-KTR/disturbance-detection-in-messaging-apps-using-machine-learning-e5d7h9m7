import React from "react";
import { View, Text } from "react-native";
import styles from "./styles";
import Colors from "../../constants/Colors";
import useColorScheme from '../../hooks/useColorScheme';
import { useRecoilState } from "recoil";
import { TintColor } from "../../atoms/HelperStates";

const SpamMessage = ({ isMyMessage, timestamp, name }) => {
  const colorScheme = useColorScheme()
  const [tintColor] = useRecoilState(TintColor)
  return (
    <View style = {styles.container}>
      <View style = {
        [styles.messageBox,{
          backgroundColor: isMyMessage() ? Colors.customThemes[tintColor][colorScheme].tintFaded : colorScheme == 'light' ? 'white' : '#424949',
          marginRight: isMyMessage() ? 5 : 50,
          marginLeft: isMyMessage() ? 50 : 5,
          alignSelf: isMyMessage() ? 'flex-end' : 'flex-start',
        }]}>
        {false && !isMyMessage() && <Text style={[styles.name, {color: Colors.customThemes[tintColor][colorScheme].name}]}>{name}</Text>}
        <Text style={[styles.message, {color: colorScheme == 'light' ? '#696969' : '#D0D3D4'}]}>{'Message flagged as Distracting'}</Text>
        <Text style = {[styles.time, {color: colorScheme == 'light' ? 'grey' : '#D0D3D4'}]}>{timestamp()}</Text>
      </View>
    </View>
  )
}

export default SpamMessage
