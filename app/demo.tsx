import React, { useState, useRef } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import styled from "styled-components"; // Import styled-components
import { Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient"; // For gradient background

const firebaseConfig = {
  apiKey: "AIzaSyA1eJ0mft0FI7mY3j0jbIvU2cVAB4C7czI",
  authDomain: "project-bd4f6.firebaseapp.com",
  projectId: "project-bd4f6",
  storageBucket: "project-bd4f6.firebasestorage.app",
  messagingSenderId: "1068005970238",
  appId: "1:1068005970238:web:f54340137a0580b38fdc6f",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Define the Modal component and its props with dark theme styles
const Modal = styled.div<{ isOpen: boolean }>`
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7); // Dark overlay
`;

const ModalContent = styled.div`
  background-color: #333;  // Dark background for modal
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  max-width: 500px;
  text-align: center;
  border-radius: 10px;
  color: #fff;  // Light text for dark theme
`;

const CloseButton = styled.span`
  color: #ccc;
  font-size: 28px;
  font-weight: bold;
  float: right;

  &:hover,
  &:focus {
    color: white;
    cursor: pointer;
  }
`;

const Container = styled.div`
  max-width: 500px;
  margin: 50px auto;
  padding: 20px;
  background-color: #222;  // Dark background for main form
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  text-align: center;
  color: #fff;  // Light text color
`;

const Heading = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 20px;
`;

const BackButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  text-align: left;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #444;  // Darker border color
  border-radius: 5px;
  width: 100%;
  box-sizing: border-box;
  background-color: #333;  // Dark input background
  color: white;  // White text inside inputs

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const Button = styled.button`
  background-color: #28a745; // Matching green button like WelcomePage
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #45a049;
  }
`;

const UploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  margin-top: 20px;
`;

const SubHeading = styled.h2`
  font-size: 18px;
  font-weight: 500;
  color: #ddd;  // Light text for subheading
  margin-bottom: 10px;
`;

const ImagePreview = styled.div<{ imagePreview: string }>`
  width: 100%;
  height: 200px;
  display: ${({ imagePreview }) => (imagePreview ? "flex" : "none")};
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 10px;
  border: 1px solid #444;
  background-color: #333;
`;

const PreviewImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: contain;
`;

const RegistrationForm: React.FC = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploadedImageURL, setUploadedImageURL] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [phoneError, setPhoneError] = useState<string>("");

  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Fade in animation for the page
  Animated.timing(fadeAnim, {
    toValue: 1,
    duration: 1000,
    useNativeDriver: true,
  }).start();

  const navigateHome = () => {
    window.location.href = "/";
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setSelectedFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const phoneValidation = (phone: string) => {
    // Regex for validating phone numbers (simple version)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phone.match(phoneRegex)) {
      setPhoneError("Please enter a valid 10-digit phone number.");
      return false;
    }
    setPhoneError("");
    return true;
  };

  const submitRegistration = async () => {
    if (!phoneValidation(phoneNumber)) return; // Early exit if phone number is invalid

    if (firstName && lastName && email && phoneNumber && selectedFile) {
      openModal();

      try {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("upload_preset", "Akshat");

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/dwhliky9s/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await response.json();
        const uploadedImageURL = data.secure_url;

        // Store user data in Firebase Firestore
        const userData = {
          firstName,
          lastName,
          email,
          phoneNumber,
          imageUrl: uploadedImageURL,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        };

        await db.collection("users").add(userData);

        setUploadedImageURL(uploadedImageURL);

        // Wait for 5 seconds before resetting the form
        setTimeout(() => {
          // Reset the form
          setFirstName("");
          setLastName("");
          setEmail("");
          setPhoneNumber("");
          setSelectedFile(null);
          setImagePreview("");
          setUploadedImageURL("");

          // Close the modal after 5 seconds
          closeModal();
        }, 5000);
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("An error occurred while uploading the image.");
        closeModal();
      }
    } else {
      alert("Please fill out all fields and select an image to upload.");
    }
  };

  return (
    <LinearGradient colors={['#000428', '#004e92']} style={{ flex: 1 }}>
      <Container>
        <BackButton onClick={navigateHome}>← Home</BackButton>
        <Animated.View style={{ opacity: fadeAnim }}>
          <Heading>Registration Form</Heading>
        </Animated.View>

        <FormContainer>
          <Input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
            required
          />
          <Input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
            required
          />
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <Input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Phone Number"
            required
          />
          {phoneError && <p style={{ color: 'red' }}>{phoneError}</p>}

          <UploadContainer>
            <SubHeading>Upload Your Profile Image</SubHeading>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <ImagePreview imagePreview={imagePreview}>
              {imagePreview && <PreviewImage src={imagePreview} alt="Preview" />}
            </ImagePreview>
          </UploadContainer>
          <Button type="button" onClick={submitRegistration}>Submit</Button>
        </FormContainer>
      </Container>

      {/* Modal for registration processing */}
      <Modal isOpen={isModalOpen}>
        <ModalContent>
          <CloseButton onClick={closeModal}>&times;</CloseButton>
          <h2>Processing Registration...</h2>
          <p>Please wait while your registration is being processed.</p>
        </ModalContent>
      </Modal>
    </LinearGradient>
  );
};

export default RegistrationForm;
