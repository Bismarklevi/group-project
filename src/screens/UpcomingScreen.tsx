import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const UpcomingScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Upcoming</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  text: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold', 
    textAlign: 'center',
    marginTop: 100,
  },
});


export default UpcomingScreen