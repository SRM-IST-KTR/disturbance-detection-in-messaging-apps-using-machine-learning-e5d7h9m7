import React from "react";
import { View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "./styles";
import Colors from "../../constants/Colors";
import useColorScheme from '../../hooks/useColorScheme';
import { useRecoilState } from "recoil";
import { TintColor } from "../../atoms/HelperStates";

const newMessageButton = () => {

  const navigation = useNavigation()
  const colorScheme = useColorScheme()
  const [tintColor] = useRecoilState(TintColor)

  const onPress = () => {
    navigation.navigate('Contacts')
  }

  return (
    <View style={[styles.container,{ backgroundColor: Colors.customThemes[tintColor].light.tint}]}>
      <TouchableOpacity onPress={onPress}>
        <MaterialCommunityIcons
          name='message-reply-text'
          size={30}
          color={'white'}
        />
      </TouchableOpacity>
    </View>
  )
}

export default newMessageButton
