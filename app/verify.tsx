import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';

type DocumentType = 'ID Card' | 'Passport' | 'Driver\'s License';

interface DocumentOption {
  id: string;
  type: DocumentType;
  icon: keyof typeof Ionicons.glyphMap;
}

export default function Verify() {
  const [selectedDocument, setSelectedDocument] = useState<DocumentType | null>(null);
  const [documentImage, setDocumentImage] = useState<string | null>(null);

  const documentOptions: DocumentOption[] = [
    { id: '1', type: 'ID Card', icon: 'card-outline' },
    { id: '2', type: 'Passport', icon: 'document-text-outline' },
    { id: '3', type: 'Driver\'s License', icon: 'car-outline' },
  ];

  const pickImage = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to upload documents!');
      return;
    }

    // Launch image picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setDocumentImage(result.assets[0].uri);
    }
  };

  const handleVerify = () => {
    if (!selectedDocument || !documentImage) {
      alert('Please select a document type and upload an image');
      return;
    }

    // Navigate to AI checker page with document data
    router.push({
      pathname: '/ai-checker',
      params: {
        documentType: selectedDocument,
        documentImage: documentImage,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Verify Your Identity</Text>
        <Text style={styles.headerSubtitle}>Upload a document to verify your identity</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Document Type</Text>
          
          <View style={styles.documentOptions}>
            {documentOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.documentOption,
                  selectedDocument === option.type && styles.documentOptionSelected
                ]}
                onPress={() => setSelectedDocument(option.type)}
              >
                <Ionicons 
                  name={option.icon} 
                  size={28} 
                  color={selectedDocument === option.type ? '#3B82F6' : '#64748B'} 
                />
                <Text 
                  style={[
                    styles.documentOptionText,
                    selectedDocument === option.type && styles.documentOptionTextSelected
                  ]}
                >
                  {option.type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upload Document</Text>
          
          <TouchableOpacity 
            style={styles.uploadContainer}
            onPress={pickImage}
          >
            {documentImage ? (
              <Image source={{ uri: documentImage }} style={styles.documentPreview} />
            ) : (
              <View style={styles.uploadPlaceholder}>
                <Ionicons name="cloud-upload-outline" size={40} color="#94A3B8" />
                <Text style={styles.uploadText}>Tap to upload</Text>
                <Text style={styles.uploadSubtext}>JPG, PNG or PDF</Text>
              </View>
            )}
          </TouchableOpacity>
          
          {documentImage && (
            <TouchableOpacity 
              style={styles.retakeButton}
              onPress={pickImage}
            >
              <Ionicons name="refresh-outline" size={20} color="#3B82F6" />
              <Text style={styles.retakeButtonText}>Upload different image</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.infoSection}>
          <Ionicons name="information-circle-outline" size={22} color="#3B82F6" />
          <Text style={styles.infoText}>
            Make sure your document is clearly visible and all information is readable.
          </Text>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[
            styles.verifyButton,
            (!selectedDocument || !documentImage) && styles.verifyButtonDisabled
          ]}
          onPress={handleVerify}
          disabled={!selectedDocument || !documentImage}
        >
          <Text style={styles.verifyButtonText}>Verify Document</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>
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
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#64748B',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  documentOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  documentOption: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    marginHorizontal: 6,
    borderWidth: 2,
    borderColor: '#F1F5F9',
  },
  documentOptionSelected: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  documentOptionText: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 8,
    textAlign: 'center',
  },
  documentOptionTextSelected: {
    color: '#3B82F6',
    fontWeight: '500',
  },
  uploadContainer: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  uploadPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  uploadText: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 12,
  },
  uploadSubtext: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 4,
  },
  documentPreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  retakeButtonText: {
    fontSize: 14,
    color: '#3B82F6',
    marginLeft: 6,
  },
  infoSection: {
    flexDirection: 'row',
    backgroundColor: '#F0F9FF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  infoText: {
    fontSize: 14,
    color: '#0369A1',
    marginLeft: 12,
    flex: 1,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  verifyButton: {
    backgroundColor: '#3B82F6',
    height: 56,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifyButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
});