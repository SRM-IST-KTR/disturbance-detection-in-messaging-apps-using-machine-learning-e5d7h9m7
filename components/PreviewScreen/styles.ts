import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    top: 50,
    borderRadius: 15
  },
  topBar: {
    height: 35,
    borderTopLeftRadius: 13,
    borderTopRightRadius: 13
  },
  chat: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 4
  },
  message: {
    height: 25,
    borderRadius: 5,
    marginVertical: 4,
    marginHorizontal: 4
  },
  bottomBar: {
    height: 35,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  inputBox: {
    height: 30,
    width: '80%',
    borderRadius: 10,
    marginVertical: 4,
    marginHorizontal: 4,
    borderWidth: 1
  },
  mic: {
    borderRadius: 30,
    height: 30,
    marginVertical: 4,
    marginRight: 8,
    width: 30
  }
})

export default styles;
