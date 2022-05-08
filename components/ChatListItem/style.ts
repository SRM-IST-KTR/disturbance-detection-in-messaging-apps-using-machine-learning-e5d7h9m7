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
      height: 20,
      flex: 0.95
    },
    midContainer: {
      justifyContent: 'space-around',
      width: '81%',
      marginLeft: 'auto'
    },
    upperContainer: {
      flexDirection: 'row',
    },
    lastMessage: {
      fontSize: 16,
      height: 20
    },
    messageContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      width: '100%',
      paddingRight: 5
    },
    time:{
      fontSize: 13,
      paddingRight: 5,
      marginLeft: 'auto',
      alignSelf: 'flex-end'
    },
    avatar: {
      width: 60,
      height: 60,
      marginRight: 12,
      borderRadius: 50,
      alignItems: 'center',
      justifyContent: 'center'
    }
})

export default styles
