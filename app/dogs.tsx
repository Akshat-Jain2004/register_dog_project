import React, { useState, useEffect } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';  // Import the Link component

const Dogs: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imageHistory, setImageHistory] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);

  const fetchRandomImage = async () => {
    try {
      const response = await axios.get('https://dog.ceo/api/breeds/image/random');
      const newImageUrl = response.data.message;

      if (newImageUrl !== imageUrl) {
        const newHistory = [...imageHistory, newImageUrl];
        setImageHistory(newHistory);
        setCurrentIndex(newHistory.length - 1);
        setImageUrl(newImageUrl);
      }
    } catch (error) {
      console.error('Error fetching the image:', error);
    }
  };

  const handleNext = () => {
    fetchRandomImage();
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setImageUrl(imageHistory[currentIndex - 1]);
    }
  };

  useEffect(() => {
    fetchRandomImage();
  }, []);

  return (
    <LinearGradient colors={['#000428', '#004e92']} style={styles.container}>
      {/* Home Button */}
      <Link href="/" style={styles.homeButton}>
        <Text style={styles.homeButtonText}>← Back to Home</Text>
      </Link>
      
      <Text style={styles.heading}>🐶 Random Dog Images 🐾</Text>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.image} />
      ) : (
        <Text style={styles.loadingText}>Loading...</Text>
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, currentIndex <= 0 && styles.disabledButton]}
          onPress={handlePrevious}
          disabled={currentIndex <= 0}
        >
          <Text style={styles.buttonText}>← Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Next →</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  image: {
    width: '90%',
    height: 400,
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#fff',
  },
  loadingText: {
    fontSize: 18,
    color: '#ddd',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  button: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    elevation: 3,
    marginHorizontal: 5,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#555',
  },
  homeButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  homeButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
});

export default Dogs;
