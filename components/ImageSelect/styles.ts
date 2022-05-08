import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-around'
  },
  image: {
    padding: 10
  },
  innerContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '40%',
    height: 90
  },
  text: {
    fontSize: 15,
    fontWeight: 'bold'
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center'
  },
  progress: {
    marginTop: 10,
    fontSize: 15
  }
})

export default styles
