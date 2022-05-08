import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    margin: 10,
    alignItems: 'flex-end'
  },
  mainContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 25,
    marginRight: 10,
    flex: 1,
    borderWidth: 1,
    alignItems: 'center'
  },
  textInput: {
    flex: 1,
    marginHorizontal: 10,
    fontSize: 16,
    maxHeight: 110
  },
  buttonContainer: {
    borderRadius: 50,
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    marginHorizontal: 5
  }
})

export default styles
