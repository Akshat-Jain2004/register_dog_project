import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { LinearGradient } from 'expo-linear-gradient';  // Import LinearGradient for dark theme background

// Initialize Firestore
const db = firebase.firestore();

const UserList: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedUser, setSelectedUser] = useState<any>(null);  // For storing selected user data
  const [modalVisible, setModalVisible] = useState<boolean>(false);  // For controlling modal visibility

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await db.collection('users').orderBy('createdAt', 'desc').get();
        const userData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(userData);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const openModal = (user: any) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedUser(null);
  };

  if (loading) {
    return (
      <LinearGradient colors={['#000428', '#004e92']} style={styles.container}>
        <Text style={styles.loadingText}>Loading users...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#000428', '#004e92']} style={styles.container}>
      <Link href="/" style={styles.homeButton}>
        <Text style={styles.homeButtonText}>← Back to Home</Text>
      </Link>
      <Text style={styles.heading}>Registered Users</Text>

      {/* Wrap the user list with ScrollView */}
      <ScrollView style={styles.scrollView}>
        {users.length === 0 ? (
          <Text style={styles.noUsersText}>No users found.</Text>
        ) : (
          users.map((user) => (
            <TouchableOpacity key={user.id} style={styles.userCard} onPress={() => openModal(user)}>
              <Image source={{ uri: user.imageUrl }} style={styles.profileImage} />
              <View style={styles.userInfo}>
                <Text style={styles.name}>{user.firstName} {user.lastName}</Text>
                <Text style={styles.detail}>Email: {user.email}</Text>
                <Text style={styles.detail}>Phone: {user.phoneNumber}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Modal for displaying user details */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {selectedUser && (
                <>
                  <Image source={{ uri: selectedUser.imageUrl }} style={styles.modalProfileImage} />
                  <Text style={styles.modalName}>{selectedUser.firstName} {selectedUser.lastName}</Text>
                  <Text style={styles.modalDetail}>Email: {selectedUser.email}</Text>
                  <Text style={styles.modalDetail}>Phone: {selectedUser.phoneNumber}</Text>
                </>
              )}
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
  },
  scrollView: {
    flexGrow: 1,
    width: '100%',
    marginBottom: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 18,
    color: '#ddd',
  },
  noUsersText: {
    fontSize: 18,
    color: '#ddd',
    marginTop: 20,
  },
  userCard: {
    width: '100%',
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
    backgroundColor: '#444',
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  detail: {
    fontSize: 14,
    color: '#ddd',
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalProfileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  modalName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalDetail: {
    fontSize: 16,
    color: '#ddd',
    marginTop: 10,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
});

export default UserList;
