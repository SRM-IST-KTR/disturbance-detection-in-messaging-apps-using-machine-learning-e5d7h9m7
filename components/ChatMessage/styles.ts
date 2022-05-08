import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    padding: 3,
  },
  messageBox: {
    borderRadius: 10
  },
  name: {
    fontWeight: 'bold',
    marginBottom: 2
  },
  message: {
    fontSize: 16
  },
  time: {
    alignSelf: 'flex-end',
    fontSize: 13
  },
  image: {
    minWidth: '100%',
    borderRadius: 8
  },
  activityIndicator: {
    position: 'absolute',
    top: '45%',
    left: '45%'
  }
})

export default styles
