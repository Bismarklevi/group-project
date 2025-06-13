import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    // In a real app, you would validate credentials here
    navigation.replace('ProfileSelection');
  };

  const handleSignUp = () => {
    navigation.navigate('Signup');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Text style={styles.logo}>STREAMIO</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#666"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#666"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.signInButton} onPress={handleLogin}>
        <Text style={styles.signInText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => {}}>
        <Text style={styles.forgotPassword}>Forgot password?</Text>
      </TouchableOpacity>

      <View style={styles.signUpContainer}>
        <Text style={styles.newToText}>New to Streamio? </Text>
        <TouchableOpacity onPress={handleSignUp}>
          <Text style={styles.signUpText}>Sign up now</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
    justifyContent: 'center',
  },
  logo: {
    color: '#E50914',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 48,
  },
  input: {
    backgroundColor: '#333',
    borderRadius: 4,
    padding: 15,
    marginBottom: 16,
    color: '#fff',
    borderWidth: 1,
  },
  signInButton: {
    backgroundColor: '#E50914',
    padding: 15,
    borderRadius: 4,
    marginTop: 16,
  },
  signInText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotPassword: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 16,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  newToText: {
    color: '#666',
  },
  signUpText: {
    color: '#fff',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen; 