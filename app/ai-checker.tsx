import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

export default function AIChecker() {
  const params = useLocalSearchParams<{
    documentType: string;
    documentImage: string;
  }>();
  
  const [loading, setLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [verificationDetails, setVerificationDetails] = useState<any[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [decodedImage, setDecodedImage] = useState<string>('');
  
  useEffect(() => {
    // Decode the image URI
    if (params.documentImage) {
      setDecodedImage(decodeURIComponent(params.documentImage));
    }
    
    // Load user data from SecureStore
    const loadUserData = async () => {
      try {
        const storedUserData = await SecureStore.getItemAsync('user');
        if (storedUserData) {
          setUserData(JSON.parse(storedUserData));
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };
    
    loadUserData();
  }, [params.documentImage]);

  // Update the document image display
  // ...
  {decodedImage && (
    <View style={styles.documentPreviewContainer}>
      <Image 
        source={{ uri: decodedImage }} 
        style={styles.documentImage} 
      />
      {!loading && verificationStatus === 'success' && (
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Ionicons name="checkmark-circle" size={40} color="#10B981" />
        </View>
      )}
    </View>
  )}
  
  useEffect(() => {
    // Simulate AI verification process
    const verifyDocument = async () => {
      try {
        // In a real app, you would send the image to your backend for processing
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Simulate successful verification
        setVerificationStatus('success');
        
        // Create verification details based on the form data and document
        const details = [
          { name: 'Document Type', value: params.documentType, status: 'success' },
          { name: 'Document Authenticity', value: 'Verified', status: 'success' },
          { name: 'Data Extraction', value: 'Complete', status: 'success' },
        ];
        
        // Add form data cross-check if user data is available
        if (userData) {
          details.push(
            { name: 'Name Match', value: 'Verified', status: 'success' },
            { name: 'Address Match', value: 'Verified', status: 'success' },
            { name: 'Date of Birth Match', value: 'Verified', status: 'success' }
          );
        }
        
        // Add face match verification
        details.push({ name: 'Face Match', value: 'Verified', status: 'success' });
        
        setVerificationDetails(details);
      } catch (error) {
        console.error('Verification error:', error);
        setVerificationStatus('failed');
      } finally {
        setLoading(false);
      }
    };
    
    if (params.documentImage) {
      verifyDocument();
    } else {
      setVerificationStatus('failed');
      setLoading(false);
    }
  }, [params.documentImage, params.documentType, userData]);
  
  const handleContinue = () => {
    // Navigate to KYC checker page
    router.push({
      pathname: '/kyc-checker',
      params: {
        documentType: params.documentType,
        documentImage: params.documentImage,
      }
    });
  };
  
  const handleRetry = () => {
    router.back();
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Document Verification</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.documentSection}>
          <Text style={styles.sectionTitle}>Document Analysis</Text>
          
          {params.documentImage && (
            <View style={styles.documentPreviewContainer}>
              <Image 
                source={{ uri: params.documentImage }} 
                style={styles.documentImage} 
              />
              {!loading && verificationStatus === 'success' && (
                <View style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <Ionicons name="checkmark-circle" size={40} color="#10B981" />
                </View>
              )}
            </View>
          )}
          
          <View style={styles.documentInfo}>
            <Text style={styles.documentType}>{params.documentType}</Text>
            <Text style={styles.noImageText}>
              Our AI is analyzing your document for authenticity and extracting information.
            </Text>
          </View>
        </View>
        
        <View style={styles.verificationSection}>
          <Text style={styles.sectionTitle}>Verification Results</Text>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3B82F6" />
              <Text style={styles.loadingText}>Analyzing document...</Text>
              <Text style={styles.loadingSubtext}>This may take a moment</Text>
            </View>
          ) : (
            <>
              <View style={styles.statusContainer}>
                <View style={[
                  styles.statusIconContainer,
                  verificationStatus === 'success' ? styles.successContainer : styles.failedContainer
                ]}>
                  <Ionicons 
                    name={verificationStatus === 'success' ? "shield-checkmark" : "alert-circle"} 
                    size={30} 
                    color="#FFFFFF" 
                  />
                </View>
                <Text style={styles.statusTitle}>
                  {verificationStatus === 'success' ? 'Verification Successful' : 'Verification Failed'}
                </Text>
                <Text style={styles.statusMessage}>
                  {verificationStatus === 'success' 
                    ? 'Your document has been successfully verified.' 
                    : 'We couldn\'t verify your document. Please try again with a clearer image.'}
                </Text>
              </View>
              
              {verificationStatus === 'success' && (
                <View style={styles.detailsContainer}>
                  {verificationDetails.map((detail, index) => (
                    <View key={index} style={styles.detailRow}>
                      <Text style={styles.detailName}>{detail.name}</Text>
                      <View style={styles.detailValueContainer}>
                        <Text style={styles.detailValue}>{detail.value}</Text>
                        <Ionicons 
                          name={detail.status === 'success' ? "checkmark-circle" : "alert-circle"} 
                          size={20} 
                          color={detail.status === 'success' ? "#10B981" : "#F59E0B"} 
                        />
                      </View>
                    </View>
                  ))}
                </View>
              )}
              
              {userData && verificationStatus === 'success' && (
                <View style={styles.crossCheckContainer}>
                  <Text style={styles.crossCheckTitle}>Form Data Cross-Check</Text>
                  <Text style={styles.crossCheckText}>
                    We've successfully cross-checked the information from your document with the details you provided in your form.
                  </Text>
                  <View style={styles.aiVerificationBadge}>
                    <Ionicons name="analytics-outline" size={16} color="#FFFFFF" />
                    <Text style={styles.aiVerificationText}>AI Verified</Text>
                  </View>
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        {!loading && (
          <>
            {verificationStatus === 'success' ? (
              <TouchableOpacity 
                style={styles.continueButton}
                onPress={handleContinue}
              >
                <Text style={styles.actionButtonText}>Continue</Text>
                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={styles.retryButton}
                onPress={handleRetry}
              >
                <Text style={styles.actionButtonText}>Try Again</Text>
                <Ionicons name="refresh" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  documentSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  documentPreviewContainer: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F1F5F9',
    marginBottom: 12,
  },
  documentImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  noImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    fontSize: 16,
    color: '#94A3B8',
    marginTop: 8,
  },
  documentInfo: {
    alignItems: 'center',
  },
  documentType: {
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: '500',
  },
  verificationSection: {
    marginBottom: 24,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
    marginTop: 16,
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  statusContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  statusIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  successContainer: {
    backgroundColor: '#10B981',
  },
  failedContainer: {
    backgroundColor: '#EF4444',
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  statusMessage: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
  },
  detailsContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  detailName: {
    fontSize: 14,
    color: '#64748B',
  },
  detailValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
    marginRight: 8,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  actionButton: {
    height: 56,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButton: {
    backgroundColor: '#3B82F6',
  },
  retryButton: {
    backgroundColor: '#EF4444',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  crossCheckContainer: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    alignItems: 'center',
  },
  crossCheckTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0369A1',
    marginBottom: 8,
  },
  crossCheckText: {
    fontSize: 14,
    color: '#0369A1',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 20,
  },
  aiVerificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  aiVerificationText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
});