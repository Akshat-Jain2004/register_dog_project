import React, { useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';

const WelcomePage: React.FC = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Fade in animation
  Animated.timing(fadeAnim, {
    toValue: 1,
    duration: 1000,
    useNativeDriver: true,
  }).start();

  return (
    <LinearGradient
      colors={['#000428', '#004e92']}
      style={styles.gradientBackground}
    >
      <Animated.View style={[styles.welcomeContainer, { opacity: fadeAnim }]}>
        <Text style={styles.titleText}>
          🌟 Welcome to My App! 🌟
        </Text>
        <Text style={styles.subTitle}>
          🧭 Discover exciting features, demos, and resources to explore. Navigate using the options below. 🚀
        </Text>
      </Animated.View>

      <View style={styles.buttonContainer}>
        <Link href="/demo" style={styles.button}>
          <Text style={styles.buttonText}>📝 Register</Text>
        </Link>
        <Link href="/user-list" style={styles.button}>
          <Text style={styles.buttonText}>👥 View Registered Users</Text>
        </Link>
        <Link href="/dogs" style={styles.button}>
          <Text style={styles.buttonText}>🐕 Dog Images</Text>
        </Link>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeContainer: {
    marginBottom: 40,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 16,
    color: '#d1d1d1',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 10,
    width: '70%',
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
});

export default WelcomePage;
