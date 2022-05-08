import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, ImageBackground, Dimensions, TouchableOpacity, TextInput, Pressable, Keyboard, ActivityIndicator, BackHandler } from "react-native";
import { View, Text } from '../components/Themed';
import { useRecoilState } from "recoil";
import Colors from "../constants/Colors";
import { TouchableRipple } from "react-native-paper";
import { Storage } from "aws-amplify";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialCommunityIcons, MaterialIcons, FontAwesome5, FontAwesome, Feather } from '@expo/vector-icons';
import { UserData, TintColor, AvatarLock } from "../atoms/HelperStates";
import useColorScheme from '../hooks/useColorScheme';
import BottomSheet from '@gorhom/bottom-sheet';
import EditAvatar from "../components/EditAvatar";
import Toast from 'react-native-root-toast';
import { API, graphqlOperation } from "aws-amplify";
import { updateUser } from "../src/graphql/mutations";

const EditDetailsScreen = ({ route }) => {

  const [userData, setUserData] = useRecoilState(UserData)
  const [tintColor] = useRecoilState(TintColor)
  const [avatar, setAvatar] = useState('none')
  const [imgDisplay, setImgDisplay] = useState('none')
  const colorScheme = useColorScheme()
  const navigation = useNavigation();
  const windowHeight = Dimensions.get('window').height
  const windowWidth = Dimensions.get('window').width
  const bottomSheetRef = useRef<BottomSheet>(null)
  const [avatarLock, setAvatarLock] = useRecoilState(AvatarLock)
  const [status, setStatus] = useState(userData.status)
  const [multiline, setMultiline] = useState(true)
  const [vdoCats, setVdoCats] = useState(userData.vdoCats == null ? [] : userData.vdoCats)
  const [bubbleColor, setBubbleColor] = useState('transparent')
  const [percentage, setPercentage] = useState(-1)
  const [snapLock, setSnapLock] = useState(true)
  const snapPoint = useRef(-1)
  const url = useRef('')

  useEffect(() => {
    const fetchAvatar = (async() => {
      if(userData && userData.imageUri != 'none'){
        url.current = await Storage.get(userData.imageUri)
        setAvatar(url.current)
      }
    })()
  },[])

  const editImage = () => {
    Keyboard.dismiss()
    snapPoint.current == 0 ? bottomSheetRef?.current?.close() : bottomSheetRef?.current?.snapToIndex(0)
    snapPoint.current = !snapPoint.current
  }

  const toggleCategory = (cat) => {
    Keyboard.dismiss()
    bottomSheetRef?.current?.close()
    if(vdoCats.indexOf(cat) > -1){
      setVdoCats(vdoCats.filter((cats) => cats != cat))
    }
    else{
      setVdoCats([...vdoCats, cat])
    }
  }

  const uploadImage = async(filename, img) => {
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

  const isEqual = (a, b) => {
    a = a.filter((elem) => b.indexOf(elem) == -1)
    return a.length == 0
  }

  const updateData = async() => {
    await API.graphql(graphqlOperation(updateUser, {
      input: {
        id: userData.id,
        status: status,
        videoCats: vdoCats
      }
    }))
    if(avatar == url.current) displayToast('Profile Updated')
  }

  const hardwareBackPress = () => {
    if(!avatarLock) navigation.goBack()
    return true
  }

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', hardwareBackPress);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', hardwareBackPress);
    };
  },[avatarLock]);

  const updateImage = async() => {
    route.params.setSettingsAvatar(avatar)
    setPercentage(0)
    setSnapLock(false)
    bottomSheetRef?.current?.snapToIndex(0)
    setAvatarLock(true)
    const img = await fetchImageFromUri(avatar)
    await uploadImage(userData.imageUri,img)
    setAvatarLock(false)
    bottomSheetRef?.current?.close()
    setSnapLock(true)
    setPercentage(-1)
    displayToast('Profile Updated')
    navigation.goBack()
  }

  const saveChanges = () => {
    if(userData.status != status || !isEqual(userData.vdoCats, vdoCats)) updateData()
    if(avatar != url.current) updateImage()
    setUserData({
      id: userData.id,
      name: userData.name,
      imageUri: userData.imageUri,
      status: status,
      vdoCats: vdoCats
    })
    if(avatar == url.current) navigation.goBack()
  }

  const displayToast = (message) => {
    Toast.show(message,{
      duration: 1000,
      position: -100,
      shadow: true,
      animation: true,
      backgroundColor: colorScheme == 'light' ? '#ffffff' : '#4D5656',
      textColor: Colors[colorScheme].text,
      shadowColor: colorScheme == 'light' ? 'black' : '#d0d3d4',
      opacity: 0.95
    })
  }

  return(
    <View style={styles.container}>

        <ImageBackground
          source={{uri: avatar}} imageStyle={styles.image} style={{height: 160/853 * windowHeight, width: 160/853 * windowHeight}} onLoad={() => setImgDisplay('flex')} >
          {(avatar == 'none' || imgDisplay == 'none') &&
            <View style={[styles.image, {backgroundColor: Colors[colorScheme].contactBackground, height: 160/853 * windowHeight, width: 160/853 * windowHeight}]}>
              <Ionicons name="person" size={72} color={colorScheme == 'light' ? Colors.customThemes[tintColor].light.tint : Colors.customThemes[tintColor].dark.tabs} />
            </View>
          }
          <View style={[styles.imgEdit, {backgroundColor: Colors.customThemes[tintColor].light.tint, top: 110/853 * windowHeight}]}>
            <TouchableOpacity onPress={() => editImage()} >
              <MaterialCommunityIcons name="image-edit-outline" size={30} color={'white'} />
            </TouchableOpacity>
          </View>
        </ImageBackground>

        <View style={[styles.dataItem, {top: 30}]}>
          <FontAwesome5 name="user" size={28} style={{marginRight: 5}} color={Colors.customThemes[tintColor].dark.settingsIcons} />
          <View style={[styles.textBox, {flex: 1}]}>
            <Text style={[styles.title, {color: Colors.customThemes[tintColor].dark.settingsIcons}]}>{'Username'}</Text>
            <Text style={styles.name}>{userData.name}</Text>
          </View>
          <FontAwesome name="lock" size={26} color={'gray'} style={{padding: 5}}/>
        </View>

        <View style={[styles.dataItem, {top: 20}]}>
          <MaterialIcons name="info-outline" size={30} style={{marginLeft: -1}} color={Colors.customThemes[tintColor].dark.settingsIcons} />
          <View style={[styles.textBox, {flex: 1}]}>
            <Text style={[styles.title, {color: Colors.customThemes[tintColor].dark.settingsIcons}]}>{'Status'}</Text>
            <TextInput placeholder={status == '' ? 'No Status Set' : status}
                       placeholderTextColor= {colorScheme == 'light' ? 'grey' : '#D0D3D4'}
                       style={[styles.textInput, {color: Colors[colorScheme].text, borderBottomColor: 'gray', fontStyle: status == '' ? 'italic' : 'normal'}]}
                       value = {status}
                       multiline = {multiline}
                       onFocus = {() => {setMultiline(false); bottomSheetRef?.current?.close()}}
                       onChangeText = {setStatus}
                       onBlur = {() => {setStatus(status.trim()); setMultiline(true)}}
                       />
          </View>
        </View>

        <View style={[styles.dataItem, {top: 20, alignItems: 'flex-start'}]}>
          <Feather name="youtube" size={30} style = {{top: 15}} color={Colors.customThemes[tintColor].dark.settingsIcons} />
          <View style={[styles.textBox, {flex: 1}]}>
            <Text style={[styles.title, {color: Colors.customThemes[tintColor].dark.settingsIcons, marginBottom: 8}]}>{'Youtube Restricted Categories'}</Text>

            {[['Games', 'Entertainment'], ['Education', 'Sports']].map((row) =>
              <View key={row} style={{flexDirection: 'row'}}>
                {row.map((cat) =>
                  <Pressable key={cat} style={[styles.bubble, {backgroundColor: vdoCats.indexOf(cat) > -1 ? Colors.customThemes[tintColor].dark.settingsIcons: 'transparent', borderColor: Colors.customThemes[tintColor].dark.settingsIcons}]} onPress={() => toggleCategory(cat)}>
                    <Text style={[styles.category, {color: colorScheme == 'light' ? vdoCats.indexOf(cat) > -1 ? 'white' : 'black' : vdoCats.indexOf(cat) > -1 ? 'black' : '#ccc'}]}>{cat}</Text>
                  </Pressable>
                )}
              </View>
            )}

          </View>
        </View>

        <TouchableOpacity onPress={() => saveChanges()} style={[styles.button, {backgroundColor: Colors.customThemes[tintColor].dark.settingsIcons}]}>
            <Text style={styles.btnText}>{'SAVE'}</Text>
        </TouchableOpacity>

        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={['23%']}
          enablePanDownToClose={snapLock}
          backgroundStyle={{backgroundColor: colorScheme == 'dark' ? Colors.dark.keypad : '#ccc'}}
          handleIndicatorStyle={{backgroundColor: colorScheme == 'light' ? 'black' : '#d0d3d4'}}
        >
        {percentage > -1 ?
          <View style={[styles.loadingContainer, {backgroundColor: colorScheme == 'dark' ? Colors.dark.keypad : '#ccc'}]}>
            <ActivityIndicator color={colorScheme == 'light' ? 'black' : '#d0d3d4'} size='large' />
            <Text style={[styles.progress, {color: colorScheme == 'light' ? 'black' : '#d0d3d4'}]}>Sending Image</Text>
            <Text style={[styles.progress,{marginTop: 5, color: colorScheme == 'light' ? 'black' : '#d0d3d4'}]}>{percentage+' %'}</Text>
          </View>
        :
          <EditAvatar setAvatar={setAvatar} bottomSheetRef={bottomSheetRef}/>}
        </BottomSheet>

    </View>
  )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 50,
    paddingHorizontal: 30
  },
  image: {
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imgEdit: {
    position: 'absolute',
    alignSelf: 'flex-end',
    borderRadius: 30,
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10
  },
  dataItem: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center'
  },
  textBox: {
    paddingVertical: 20,
    paddingRight: 0,
    paddingLeft: 15
  },
  name: {
    fontSize: 16,
    marginTop: 5
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold'
  },
  textInput: {
    fontSize: 16,
    alignSelf: 'stretch',
    borderBottomWidth: 2
  },
  bubble: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginVertical: 5,
    marginRight: 10,
    borderRadius: 12,
    borderWidth: 2
  },
  category: {
    fontSize: 16
  },
  button: {
    top: 50,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5
  },
  btnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white'
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center'
  },
  progress: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: 'bold'
  }
})

export default EditDetailsScreen
