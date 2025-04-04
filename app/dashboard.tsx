import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import * as Clipboard from 'expo-clipboard';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [did, setDid] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Get user data from SecureStore
        const userData = await SecureStore.getItemAsync('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        }
        
        // Get DID and QR code URL
        const storedDID = await SecureStore.getItemAsync('userDID');
        const storedQRUrl = await SecureStore.getItemAsync('userQRUrl');
        
        if (storedDID) setDid(storedDID);
        if (storedQRUrl) setQrCodeUrl(storedQRUrl);
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading user data:', error);
        setLoading(false);
      }
    };
    
    loadUserData();
  }, []);
  
  const handleCopyDID = async () => {
    try {
      await Clipboard.setStringAsync(did);
      alert('DID copied to clipboard');
    } catch (error) {
      console.error('Failed to copy DID:', error);
    }
  };
  
  const handleLogout = async () => {
    try {
      // Clear user data but keep DID and QR code
      await SecureStore.deleteItemAsync('user');
      router.replace('/login-signup');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Digital Identity Dashboard</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#64748B" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.userSection}>
          <View style={styles.userIconContainer}>
            <Ionicons name="person" size={40} color="#FFFFFF" />
          </View>
          <Text style={styles.userName}>{user?.fullName || user?.name || 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'No email'}</Text>
          <View style={styles.verificationBadge}>
            <Ionicons name="shield-checkmark" size={16} color="#FFFFFF" />
            <Text style={styles.verificationText}>Verified</Text>
          </View>
        </View>
        
        <View style={styles.cardSection}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Your Digital Identity</Text>
              <Ionicons name="id-card" size={24} color="#3B82F6" />
            </View>
            
            <View style={styles.qrContainer}>
              {qrCodeUrl ? (
                <Image 
                  source={{ uri: qrCodeUrl }} 
                  style={styles.qrImage}
                  resizeMode="contain"
                />
              ) : (
                <View style={styles.qrPlaceholder}>
                  <Ionicons name="qr-code" size={80} color="#94A3B8" />
                </View>
              )}
            </View>
            
            <View style={styles.didContainer}>
              <Text style={styles.didLabel}>Your Decentralized ID (DID)</Text>
              <View style={styles.didValueContainer}>
                <Text style={styles.didValue} numberOfLines={1} ellipsizeMode="middle">
                  {did}
                </Text>
                <TouchableOpacity onPress={handleCopyDID} style={styles.copyButton}>
                  <Ionicons name="copy-outline" size={20} color="#3B82F6" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionIconContainer}>
                <Ionicons name="share-social-outline" size={24} color="#3B82F6" />
              </View>
              <Text style={styles.actionText}>Share ID</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionIconContainer}>
                <Ionicons name="document-text-outline" size={24} color="#3B82F6" />
              </View>
              <Text style={styles.actionText}>View Details</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionIconContainer}>
                <Ionicons name="shield-outline" size={24} color="#3B82F6" />
              </View>
              <Text style={styles.actionText}>Security</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>About Digital Identity</Text>
          <Text style={styles.infoText}>
            Your decentralized identity (DID) is a unique identifier that gives you control over your digital identity without relying on any central authority.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#64748B',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  logoutButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  userSection: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#F8FAFC',
  },
  userIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 12,
  },
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  verificationText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  cardSection: {
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  qrImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
  },
  qrPlaceholder: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
  },
  didContainer: {
    marginTop: 8,
  },
  didLabel: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  didValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  didValue: {
    flex: 1,
    fontSize: 14,
    color: '#1E293B',
    fontFamily: 'monospace',
  },
  copyButton: {
    padding: 4,
  },
  actionsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    alignItems: 'center',
    width: '30%',
  },
  actionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    color: '#1E293B',
  },
  infoSection: {
    padding: 20,
    backgroundColor: '#F8FAFC',
    marginTop: 8,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
});