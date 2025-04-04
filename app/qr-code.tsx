import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Share,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Clipboard from 'expo-clipboard';

export default function QRCodeScreen() {
  const [loading, setLoading] = useState(true);
  const [generatingDID, setGeneratingDID] = useState(true);
  const [did, setDid] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  
  useEffect(() => {
    const generateDID = async () => {
      try {
        // Simulate DID generation
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Generate a random DID
        const randomDID = `did:aeid:${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
        setDid(randomDID);
        setGeneratingDID(false);
        
        // Generate QR code using the API
        const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(randomDID)}`;
        setQrCodeUrl(qrApiUrl);
        
        // Simulate loading the QR code
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLoading(false);
      } catch (error) {
        console.error('Error generating digital ID:', error);
        setLoading(false);
      }
    };
    
    generateDID();
  }, []);
  
  const handleCopyDID = async () => {
    try {
      await Clipboard.setStringAsync(did);
      alert('DID copied to clipboard');
    } catch (error) {
      console.error('Failed to copy DID:', error);
    }
  };
  
  const handleShare = async () => {
    try {
      await Share.share({
        message: `My Digital Identity DID: ${did}`,
        title: 'My Digital Identity',
      });
    } catch (error) {
      console.error('Error sharing DID:', error);
    }
  };
  
  const handleFinish = () => {
    router.replace('/');
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Digital Identity</Text>
      </View>
      
      <View style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text style={styles.loadingText}>
              {generatingDID ? 'Generating DID...' : 'Creating QR Code...'}
            </Text>
            <Text style={styles.loadingSubtext}>
              {generatingDID 
                ? 'Creating your unique decentralized identifier' 
                : 'Generating your secure QR code'}
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.successContainer}>
              <View style={styles.successIconContainer}>
                <Ionicons name="checkmark" size={30} color="#FFFFFF" />
              </View>
              <Text style={styles.successTitle}>Digital ID Created!</Text>
              <Text style={styles.successMessage}>
                Your decentralized identity has been successfully created.
              </Text>
            </View>
            
            <View style={styles.qrContainer}>
              <Text style={styles.qrTitle}>Your Digital Identity QR</Text>
              <View style={styles.qrImageContainer}>
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
              <Text style={styles.qrDescription}>
                Scan this QR code to verify your digital identity
              </Text>
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
            
          </>
        )}
      </View>
      
      {!loading && (
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.finishButton}
            onPress={handleFinish}
          >
            <Text style={styles.finishButtonText}>Go to Dashboard</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginTop: 20,
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 8,
    textAlign: 'center',
  },
  successContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  successIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  successMessage: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    maxWidth: '80%',
  },
  didContainer: {
    marginBottom: 24,
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
  qrContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  qrTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  qrImageContainer: {
    width: 250,
    height: 250,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  qrImage: {
    width: '100%',
    height: '100%',
  },
  qrPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrDescription: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
  actionsContainer: {
    alignItems: 'center',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  shareButtonText: {
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: '500',
    marginLeft: 8,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  finishButton: {
    backgroundColor: '#3B82F6',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  finishButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});