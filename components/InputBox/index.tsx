import React, { useState, useEffect, useRef } from "react";
import { TextInput, View, TouchableOpacity, Keyboard, AsyncStorage } from "react-native";
import styles from "./styles";
import moment from "moment";
import { MaterialCommunityIcons, FontAwesome5, Entypo, Ionicons, MaterialIcons, Octicons, AntDesign } from "@expo/vector-icons";
import EmojiSelector, { Categories} from 'react-native-emoji-selector'
import { Emoji, TintColor } from "../../atoms/HelperStates";
import Colors from "../../constants/Colors";
import useColorScheme from '../../hooks/useColorScheme';

import { API, graphqlOperation, Auth } from "aws-amplify";
import { createMessage, updateChatRoom } from "../../src/graphql/mutations";
import { SentMessages, ImpLock } from "../../atoms/WorkMode";
import { useRecoilState } from "recoil";

const InputBox = (props) => {

  const colorScheme = useColorScheme()
  const { chatRoomID, isFirst, addMessage, sendImage, getEmoji, showEmo, flatlist } = props
  const [message, setMessage] = useState('')
  const [myUserID, setMyUserID] = useState(null)
  const [myName, setMyName] = useState(null)
  const [emoji, showEmoji] = useState(false)
  const [emojiHeight, setEmojiHeight] = useState(318)
  const [emojiSearch, setEmojiSearch] = useState(false)
  const keyboard = useRef(null)
  const keyboardHeight = useRef(0)
  const [sentMsgs, setSentMsgs] = useRecoilState(SentMessages)
  const [counter, setCounter] = useState(1)
  const [emojiCheck] = useRecoilState(Emoji)
  const [impLock, setImpLock] = useRecoilState(ImpLock)
  const [tintColor] = useRecoilState(TintColor)
  var shouldScroll = !isFirst

  getEmoji(emoji)

  useEffect(() => {
    showEmoji(false)
  },[showEmo])

  useEffect(() => {
    const fetchUser = (async() => {
      const userInfo = await Auth.currentAuthenticatedUser()
      setMyUserID(userInfo.attributes.sub)
      setMyName(userInfo.signInUserSession.accessToken.payload.username)
    })()
  },[])

  const onMicrophonePress = () => {
    console.warn('Microphone')
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

  const getCategories = (categoryMap) => {
    var cats = []
    Object.keys(categoryMap).forEach((key) => {
      if(categoryMap[key] == 1) cats.push(key)
    });
    return cats
  }

  const checkSpam = (message) => {
    return new Promise(async(resolve, reject) => {
      message = message.replace(/\s+/g, '+')
      try{
        var words = message.split('+')
        words = words.filter(word => (word.includes('youtu.be') || word.includes('youtube.com')))
        if(words.length == 0){
          const result = await fetch('https://imtext.herokuapp.com/predict?t='+message)
          const ans = await result.json()
          resolve(ans.results.results)
        }
        else{
          const promises = []
          words.forEach(word => {
            const startingIndex = word.includes('youtu.be') || word.includes('shorts') ? word.lastIndexOf('/')+1 : word.lastIndexOf('=')+1
            const code = word.substring(startingIndex, startingIndex + 11)
            promises.push(new Promise(async(resolve) => {
              const result = await fetch('https://im-youtube.herokuapp.com/predict?t='+code)
              const ans = await result.json()
              resolve(getCategories(ans.results))
            }))
          })
          Promise.all(promises).then(results => {
            const combinedRes = results.reduce((prev, curr) => prev.concat(curr))
            resolve([...new Set(combinedRes)]) //removing duplicates
          })
        }
      }
      catch(e) { console.log(e);resolve(0) }
    })
  }

  const onSendPress = () => {
    //send to backend
    if(message.trim() !== ""){
      setImpLock(true)
      addMessage({
        user: {
          name: myName.charAt(0).toUpperCase() + myName.slice(1),
          id: myUserID
        },
        content: message.trim(),
        createdAt: moment().toISOString(),
        isImage: false,
        index: counter
      })
      setMessage('')
      shouldScroll ? flatlist.current.scrollToIndex({index: 0}) :
      shouldScroll = true
      try {
        checkSpam(message.trim()).then(async(result) => {
          const spam = result.constructor === Array ? null : result === 1
          const vdoCats = result.constructor === Array ? result : null
          const sentMessage = await API.graphql(graphqlOperation(createMessage, {
            input: {
              content: message.trim(),
              userID: myUserID,
              chatRoomID,
              isImage: false,
              isSpam: spam,
              videoCats: vdoCats
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
        .catch(err => { console.log(err) })
      }
      catch(e) { console.log(e) }
    }
  }

  const onPress = () => {
    if(!message) {
      onMicrophonePress()
    }
    else{
      onSendPress()
    }
  }

  const pickEmoji = () => {
    Keyboard.dismiss()
    showEmoji(!emoji)
  }

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => {
        if(emojiSearch){
          setEmojiHeight(120)
        }
        else{
          showEmoji(false);
          keyboardHeight.current = e.endCoordinates.height
          setEmojiHeight(keyboardHeight.current)
        }
      }
    )
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setEmojiHeight(keyboardHeight.current)
      }
    )
    return () => {
      keyboardDidShowListener.remove()
      keyboardDidHideListener.remove()
    };
  }, [emojiSearch]);

  useEffect(() => {
    if(!emoji){
      setEmojiSearch(false)
    }
  },[emoji])

  const endSearch = () => {
    showEmoji(false)
    keyboard.current.focus()
  }

  const addImage = () => {
    sendImage()
    showEmoji(false)
  }

  const handleEmoji = (emoji) => {
    if(!emojiCheck) AsyncStorage.setItem('emoji', 'true')
    setMessage(message+emoji)
  }

  return (
    <View>
      <View style={styles.container}>
        <View style={[styles.mainContainer,{borderColor: colorScheme == 'light' ? Colors.customThemes[tintColor].light.tint : 'transparent', backgroundColor: Colors[colorScheme].keypad}]}>
          {emoji
          ? emojiSearch
            ? <TouchableOpacity onPress={endSearch}>
                <AntDesign name="arrowleft" size={24} color={colorScheme == 'light' ? 'grey' : '#D0D3D4'} />
              </TouchableOpacity>
            : <TouchableOpacity onPress={() => keyboard.current.focus()}>
                <Entypo name="keyboard" size={24} color={colorScheme == 'light' ? 'grey' : '#D0D3D4'} />
              </TouchableOpacity>
          : <TouchableOpacity onPress={pickEmoji}>
              <FontAwesome5 name='laugh-beam' size={24} color={colorScheme == 'light' ? 'grey' : '#D0D3D4'} />
            </TouchableOpacity>
          }
          <TextInput ref = {keyboard}
                     placeholder="Say Something"
                     placeholderTextColor= {colorScheme == 'light' ? 'grey' : '#D0D3D4'}
                     style={[styles.textInput, {color: Colors[colorScheme].text}]}
                     multiline
                     value = {message}
                     onChangeText = {setMessage}
                     />
          {emoji && !emojiSearch &&
            <TouchableOpacity onPress={() => setEmojiSearch(true)}>
              <Octicons name='search' size={22} color={colorScheme == 'light' ? 'grey' : '#D0D3D4'} style={styles.icon}/>
            </TouchableOpacity> }
          {!emoji && <Entypo name='attachment' size={24} color={colorScheme == 'light' ? 'grey' : '#D0D3D4'} style={styles.icon}/>}
          {!message &&
            <TouchableOpacity onPress = {addImage}>
              <Ionicons name='image-outline' size={26} color={colorScheme == 'light' ? 'grey' : '#D0D3D4'} style={styles.icon}/>
            </TouchableOpacity>
          }
        </View>
        <TouchableOpacity onPress={onPress}>
          <View style={[styles.buttonContainer, {backgroundColor: Colors.customThemes[tintColor]['light'].tint}]}>
            {
              !message
              ? <MaterialCommunityIcons name='microphone' size={28} color={'white'} />
              : <MaterialIcons name='send' size={28} color={'white'} />
            }
          </View>
        </TouchableOpacity>
      </View>
      {emoji && <View style={{backgroundColor: colorScheme == 'light' ? '#ffffffaa' : '#2a2f32', height: emojiHeight }}>
        <EmojiSelector
          category = {emojiCheck ? Categories.history : Categories.emotion}
          onEmojiSelected={(emoji) => handleEmoji(emoji)}
          theme = {emojiSearch ? 'transparent' : colorScheme == 'light' ? Colors.customThemes[tintColor].light.tint : 'black'}
          showHistory = {true}
          columns = {10}
          placeholder = {'Search'}
          showSearchBar = {emojiSearch}
          showSectionTitles = {false}
          showTabs = {!emojiSearch}
        />
      </View>}
    </View>
  )
}

export default InputBox
