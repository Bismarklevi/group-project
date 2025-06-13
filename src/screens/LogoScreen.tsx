import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { COLORS } from '../services/constants';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Logo'>;

const { width } = Dimensions.get('window');
const LOGO_SIZE = width * 0.4;

const LogoScreen: React.FC<Props> = ({ navigation }) => {
  const opacity = new Animated.Value(0);
  const scale = new Animated.Value(1.3);

  useEffect(() => {
    // Fade in and scale down animation
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate to profile selection after animation
    const timer = setTimeout(() => {
      navigation.replace('ProfileSelection');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Text
        style={[
          styles.logo,
          {
            opacity,
            transform: [{ scale }],
          },
        ]}
      >
        STREAMIO
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    color: COLORS.PRIMARY,
    fontSize: LOGO_SIZE * 0.25,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
});

export default LogoScreen; 