import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Streamio</Text>
      
      <View style={styles.iconContainer}>
        <TouchableOpacity style={styles.iconButton}>
          <AntDesign name="home" size={24} color="white" />
          <Text style={styles.iconText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="play-circle" size={24} color="white" />
          <Text style={styles.iconText}>Play</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton}>
          <MaterialIcons name="settings" size={24} color="white" />
          <Text style={styles.iconText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 40,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
  },
  iconButton: {
    alignItems: 'center',
    padding: 10,
  },
  iconText: {
    color: 'white',
    marginTop: 5,
  },
}); 