import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';

export default function KYCChecker() {
  const params = useLocalSearchParams<{
    documentType: string;
    documentImage: string;
  }>();
  
  const [loading, setLoading] = useState(true);
  const [kycStatus, setKycStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [kycDetails, setKycDetails] = useState<any[]>([]);
  
  useEffect(() => {
    // Simulate KYC verification process
    const verifyKYC = async () => {
      try {
        // In a real app, you would send the data to your KYC provider
        await new Promise(resolve => setTimeout(resolve, 2500));
        
        // Simulate successful KYC verification
        setKycStatus('success');
        setKycDetails([
          { name: 'Identity Verification', value: 'Verified', status: 'success' },
          { name: 'Address Verification', value: 'Verified', status: 'success' },
          { name: 'AML Screening', value: 'Passed', status: 'success' },
          { name: 'Risk Assessment', value: 'Low Risk', status: 'success' },
        ]);
      } catch (error) {
        console.error('KYC verification error:', error);
        setKycStatus('failed');
      } finally {
        setLoading(false);
      }
    };
    
    verifyKYC();
  }, []);
  
  const handleGenerateDigitalID = () => {
    // Navigate to QR code generation page instead of home
    router.push('/qr-code');
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
        <Text style={styles.headerTitle}>KYC Verification</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.kycSection}>
          <Text style={styles.sectionTitle}>KYC Process</Text>
          
          <View style={styles.kycInfoCard}>
            <Text style={styles.kycInfoText}>
              Know Your Customer (KYC) verification helps us confirm your identity and comply with regulations.
            </Text>
          </View>
          
          <View style={styles.kycProcessContainer}>
            <View style={styles.processStep}>
              <View style={styles.processIconContainer}>
                <Ionicons name="document-text-outline" size={24} color="#3B82F6" />
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.processStepTitle}>Document Verification</Text>
                <Text style={styles.processStepText}>Your ID document is being verified for authenticity</Text>
              </View>
            </View>
            
            <View style={styles.processStep}>
              <View style={styles.processIconContainer}>
                <Ionicons name="person-outline" size={24} color="#3B82F6" />
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.processStepTitle}>Identity Confirmation</Text>
                <Text style={styles.processStepText}>Confirming your personal information matches official records</Text>
              </View>
            </View>
            
            <View style={styles.processStep}>
              <View style={styles.processIconContainer}>
                <Ionicons name="shield-outline" size={24} color="#3B82F6" />
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.processStepTitle}>Security Checks</Text>
                <Text style={styles.processStepText}>Running security and compliance checks</Text>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.verificationSection}>
          <Text style={styles.sectionTitle}>KYC Verification Results</Text>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3B82F6" />
              <Text style={styles.loadingText}>Processing KYC verification...</Text>
              <Text style={styles.loadingSubtext}>This may take a moment</Text>
            </View>
          ) : (
            <>
              <View style={styles.statusContainer}>
                <View style={[
                  styles.statusIconContainer,
                  kycStatus === 'success' ? styles.successContainer : styles.failedContainer
                ]}>
                  <Ionicons 
                    name={kycStatus === 'success' ? "shield-checkmark" : "alert-circle"} 
                    size={30} 
                    color="#FFFFFF" 
                  />
                </View>
                <Text style={styles.statusTitle}>
                  {kycStatus === 'success' ? 'KYC Verification Successful' : 'KYC Verification Failed'}
                </Text>
                <Text style={styles.statusMessage}>
                  {kycStatus === 'success' 
                    ? 'Your identity has been successfully verified.' 
                    : 'We couldn\'t complete your KYC verification. Please try again.'}
                </Text>
              </View>
              
              {kycStatus === 'success' && (
                <View style={styles.detailsContainer}>
                  {kycDetails.map((detail, index) => (
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
            </>
          )}
        </View>
        
        {kycStatus === 'success' && !loading && (
          <View style={styles.congratsSection}>
            <View style={styles.congratsCard}>
              <Ionicons name="ribbon-outline" size={40} color="#3B82F6" />
              <Text style={styles.congratsTitle}>Congratulations!</Text>
              <Text style={styles.congratsText}>
                You've successfully completed the verification process. You can now generate your Digital ID.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
      
      <View style={styles.footer}>
        {!loading && (
          <>
            {kycStatus === 'success' ? (
              <TouchableOpacity 
                style={styles.generateButton}
                onPress={handleGenerateDigitalID}
              >
                <Ionicons name="id-card-outline" size={20} color="#FFFFFF" />
                <Text style={styles.generateButtonText}>Generate Digital ID</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={styles.retryButton}
                onPress={() => router.back()}
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
  kycSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  kycInfoCard: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  kycInfoText: {
    fontSize: 14,
    color: '#0369A1',
    lineHeight: 20,
  },
  kycProcessContainer: {
    marginTop: 16,
  },
  processStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
  },
  processIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  processStepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
  },
  processStepText: {
    fontSize: 14,
    color: '#64748B',
    flex: 2,
    lineHeight: 20,
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
  congratsSection: {
    marginBottom: 24,
  },
  congratsCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  congratsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginTop: 12,
    marginBottom: 8,
  },
  congratsText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  generateButton: {
    backgroundColor: '#3B82F6',
    height: 56,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  retryButton: {
    backgroundColor: '#EF4444',
    height: 56,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
});