import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#00000028',
    borderRadius: 8
  },
  lowerContainer: {
    flexDirection: 'row'
  },
  minImage: {
    aspectRatio: 1,
    width: 80,
    resizeMode: 'cover',
    backgroundColor: 'white',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  textContainer: {
    padding: 7,
    justifyContent: 'center'
  },
  title: {
    fontWeight: 'bold'
  },
  description: {
    fontSize: 13
  },
  maxImage: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    resizeMode: 'cover',
    backgroundColor: 'white',
  }
})

export default styles
