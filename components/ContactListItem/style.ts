import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
      padding: 10,
    },
    leftContainer: {
      flexDirection: 'row'
    },
    username: {
      fontWeight: 'bold',
      fontSize: 16,
      height: 20
    },
    midContainer: {
      justifyContent: 'space-around',
      width: '81%',
      marginLeft: 'auto'
    },
    avatar: {
      width: 60,
      height: 60,
      marginRight: 12,
      borderRadius: 50,
      alignItems: 'center',
      justifyContent: 'center'
    },
    status: {
      fontSize: 16,
      height: 20
    }
})

export default styles
