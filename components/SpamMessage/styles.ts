import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    padding: 3,
  },
  messageBox: {
    borderRadius: 10,
    padding: 10
  },
  name: {
    fontWeight: 'bold',
    marginBottom: 2
  },
  message: {
    fontSize: 16,
    fontStyle: 'italic'
  },
  time: {
    alignSelf: 'flex-end',
    fontSize: 13
  }
})

export default styles
