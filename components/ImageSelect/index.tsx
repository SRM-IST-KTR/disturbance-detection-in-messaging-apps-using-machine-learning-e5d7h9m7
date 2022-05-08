import React, { useState, useEffect } from 'react';
import { Text, View, Pressable, ActivityIndicator } from "react-native";
import styles from "./styles";
import * as ImagePicker from 'expo-image-picker';
import { Fontisto, Ionicons } from '@expo/vector-icons';
import moment from "moment";
import { Storage } from 'aws-amplify'
import { API, graphqlOperation, Auth } from "aws-amplify";
import { createMessage, updateChatRoom } from "../../src/graphql/mutations";
import Colors from "../../constants/Colors";
import useColorScheme from '../../hooks/useColorScheme';
import { SentMessages } from "../../atoms/WorkMode";
import { useRecoilState } from "recoil";

const ImageSelect = ({ id, name, chatRoomID, addImage, setSnapLock, bottomSheetRef }) => {

  const [image, setImage] = useState(null);
  const [percentage, setPercentage] = useState(-1)
  const colorScheme = useColorScheme()
  const [sentMsgs, setSentMsgs] = useRecoilState(SentMessages)
  const [counter, setCounter] = useState('a')

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
      quality: 1
    });
    handleImagePicked(result)
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1
    });
    handleImagePicked(result);
  };

  const checkSpam = (uri) => {
    return new Promise((resolve) => {
      Storage.get(uri)
        .then((url) => { //ML part
           try{
             fetch('https://tinyurl.com/api-create.php?url='+url).then(response => response.text())
                .then(async(shortURL) => {
                  const result = await fetch('https://im-image.herokuapp.com/predict?t='+shortURL)
                  const ans = await result.json()
                  resolve(ans.results.results)
                })
            }
            catch(e) { console.log(e); resolve(0)}
        })
        .catch((err) => {console.log(err); resolve(0)})
    })
  };

  const handleImagePicked = async(result) => {
    if (!result.cancelled) {
      setSnapLock(false)
      setPercentage(0)
      const img = await fetchImageFromUri(result.uri)
      const key = await uploadImage('images/'+name+'/MIM-'+moment.now()+'.jpg',img)
      bottomSheetRef?.current?.close()
      setPercentage(-1)
      setSnapLock(true)
      addImage({
        user: {
          name: name.charAt(0).toUpperCase() + name.slice(1),
          id
        },
        content: result.uri+' '+key,
        createdAt: moment().toISOString(),
        isImage: true,
        index: counter
      })
      //Spam to be checked
      try {
        checkSpam(key).then(async(result) => {
          const sentMessage = await API.graphql(graphqlOperation(createMessage, {
            input: {
              content: key,
              userID: id,
              chatRoomID,
              isImage: true,
              isSpam: result === 1
            }
          }))
          updateChatRoomLastMessage(sentMessage.data.createMessage.id)
          if(Object.keys(sentMsgs).length > 0){
            const newObj = Object.assign({}, sentMsgs)
            newObj[counter] = sentMessage.data.createMessage.id
            setSentMsgs(newObj)
            setCounter(counter+1)
          }
        })
        .catch(err => {console.log(err)})
      }
      catch(e) { console.log(e) }
    }
    bottomSheetRef?.current?.close()
  }

  const updateChatRoomLastMessage = async(messageID: string) => {
    try{
      await API.graphql(graphqlOperation(updateChatRoom, {
        input: {
          id: chatRoomID,
          lastMessageID: messageID
        }
      }))
    }
    catch(e) { console.log(e) }
  }

  const uploadImage = (filename, img) => {
    return Storage.put(filename, img, {
      level: 'public',
      contentType: 'image/jpg',
      progressCallback(progress){
        setLoading(progress);
      }
    })
    .then((response) => {
      return response.key;
    })
    .catch((error) => {
      console.log(error);
      return error.response;
    });
  };

  const setLoading = (progress) => {
    const calculated = parseInt((progress.loaded / progress.total) * 100);
    setPercentage(calculated);
  };

  const fetchImageFromUri = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
  };

  return(
    <View>
      {percentage > -1 ?
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colorScheme == 'light' ? 'black' : '#d0d3d4'} size='large' />
          <Text style={[styles.progress, {color: colorScheme == 'light' ? 'black' : '#d0d3d4'}]}>Sending Image</Text>
          <Text style={[styles.progress,{marginTop: 5, color: colorScheme == 'light' ? 'black' : '#d0d3d4'}]}>{percentage+' %'}</Text>
        </View>
      :
        <View style={styles.container}>
          <View style={styles.innerContainer}>
            <Pressable onPress={takePhoto}>
              <Fontisto name="camera" size={36} color={colorScheme == 'light' ? 'black' : '#d0d3d4'} style={styles.image}/>
            </Pressable>
            <Text style={[styles.text, {color: colorScheme == 'light' ? 'black' : '#d0d3d4'}]}>Click a Photo</Text>
          </View>
          <View style={styles.innerContainer}>
            <Pressable onPress={pickImage} >
              <Ionicons name="images" size={40} color={colorScheme == 'light' ? 'black' : '#d0d3d4'} style={styles.image}/>
            </Pressable>
            <Text style={[styles.text, {color: colorScheme == 'light' ? 'black' : '#d0d3d4'}]}>Open Gallery</Text>
          </View>
        </View>
      }
    </View>
  )
}

export default ImageSelect
