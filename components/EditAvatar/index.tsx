import React, { useEffect } from 'react';
import { Text, View, Pressable } from "react-native";
import styles from "./styles";
import * as ImagePicker from 'expo-image-picker';
import { Fontisto, Ionicons, MaterialIcons } from '@expo/vector-icons';
import Colors from "../../constants/Colors";
import useColorScheme from '../../hooks/useColorScheme';

const EditAvatar = ({ setAvatar, bottomSheetRef }) => {

  const colorScheme = useColorScheme()

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  },[]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1
    });
    handleImagePicked(result)
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1
    });
    handleImagePicked(result);
  };

  const deleteImage = () => {
    setAvatar('none')
    bottomSheetRef?.current?.close()
  }

  const handleImagePicked = async(result) => {
    if (!result.cancelled) {
      const img = result.uri
      setAvatar(img)
    }
    bottomSheetRef?.current?.close()
  }

  return(
    <View>
      <View style={styles.container}>

        <View style={styles.innerContainer}>
          <Pressable onPress={takePhoto}>
            <Fontisto name="camera" size={36} color={colorScheme == 'light' ? 'black' : '#d0d3d4'} style={styles.image}/>
          </Pressable>
          <Text style={[styles.text, {color: colorScheme == 'light' ? 'black' : '#d0d3d4'}]}>Camera</Text>
        </View>

        <View style={styles.innerContainer}>
          <Pressable onPress={pickImage} >
            <Ionicons name="images" size={40} color={colorScheme == 'light' ? 'black' : '#d0d3d4'} style={styles.image}/>
          </Pressable>
          <Text style={[styles.text, {color: colorScheme == 'light' ? 'black' : '#d0d3d4'}]}>Gallery</Text>
        </View>

        <View style={styles.innerContainer}>
          <Pressable onPress={deleteImage} >
            <MaterialIcons name="delete" size={45} color={colorScheme == 'light' ? 'black' : '#d0d3d4'} style={styles.image} />
          </Pressable>
          <Text style={[styles.text, {color: colorScheme == 'light' ? 'black' : '#d0d3d4'}]}>Delete</Text>
        </View>

      </View>
    </View>
  )
}

export default EditAvatar
