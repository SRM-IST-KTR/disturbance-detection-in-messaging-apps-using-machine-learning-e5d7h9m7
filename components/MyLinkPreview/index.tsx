import React, { useEffect, useState } from "react";
import { View, Text, Image, Dimensions, Linking } from "react-native";
import { TouchableRipple } from "react-native-paper";
import styles from "./styles";
import Colors from "../../constants/Colors";
import useColorScheme from '../../hooks/useColorScheme';

const MyLinkPreview = (props) => {
  const colorScheme = useColorScheme()
  const { linkData, setTextWidth, isMyMessage, setTextPadding, imp, toggleImportant } = props
  const windowWidth = Dimensions.get('window').width;
  linkData.description = linkData.description ? linkData.description : 'Link preview'
  linkData.title = linkData.title ? linkData.title : 'Click here to visit the link.'
  const [offset, setOffset] = useState(imp ? 4 : 0)

  useEffect(() => {
    setOffset(imp ? 4 : 0)
  },[imp])

  useEffect(() => {
    if(linkData.image && !isMinImage()){
      setTextWidth(isVerticalImage() ? 270/412 * windowWidth : 300/412 * windowWidth)
    }
    setTextPadding(5)
  },[])

  const isMinImage = () => {
    return linkData.image.height === linkData.image.width
  }

  const getAspectRatio = () => {
    return linkData.image.width / linkData.image.height
  }

  const isVerticalImage = () => {
    return linkData.image.height > linkData.image.width
  }

  const getTextBoxWidth = () => {
    if(linkData.image){
      if(!isMinImage()){
        return isVerticalImage() ? 260/412 * windowWidth : 290/412 * windowWidth
      }
      return 260/412 * windowWidth
    }
    return undefined
  }

  return (
    <TouchableRipple onPress={() => Linking.openURL(linkData.link)} onLongPress={() => toggleImportant(imp)} rippleColor={'#cccccc42'} style={styles.container}>
      <View>
        {linkData.image && !isMinImage() && <Image
                source={{uri: linkData.image.url}}
                aspectRatio={isVerticalImage() ? undefined : getAspectRatio()}
                style={[styles.maxImage, {borderColor: colorScheme == 'light' ? 'black' : 'transparent', borderWidth: isMyMessage() ? 0 : 0.5, width: isVerticalImage() ? 260/412 * windowWidth - offset : 290/412 * windowWidth - offset, height: isVerticalImage() ? 290/412 * windowWidth : undefined}]}/>}
        <View style={[styles.lowerContainer, {height: linkData.image ? isMinImage() ? 80 : undefined : 80}]}>
          {linkData.image && isMinImage() && <Image
                source={{uri: linkData.image.url}}
                style={[styles.minImage, { borderWidth: isMyMessage() ? 0 : 0.5, borderColor: colorScheme == 'light' ? 'black' : 'transparent' }]}/>}
          <View style={[styles.textContainer, {width: getTextBoxWidth(),
            minWidth: linkData.image ? undefined : 260/412 * windowWidth,
            maxWidth: linkData.image ? undefined : 340/412 * windowWidth}]}>
            {linkData.title && <Text numberOfLines = {1} ellipsizeMode={'tail'} style={[styles.title, {color: Colors[colorScheme].text}]}>{linkData.title}</Text>}
            {linkData.description && <Text numberOfLines = {3} ellipsizeMode={'tail'} style={[styles.description, {color: colorScheme == 'light' ? 'black' : '#d0d3d4'}]}>{linkData.description}</Text>}
          </View>
        </View>
      </View>
    </TouchableRipple>
  )
}

export default MyLinkPreview
