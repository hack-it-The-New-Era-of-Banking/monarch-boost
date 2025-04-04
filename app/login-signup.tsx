import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  Dimensions,
  SafeAreaView
} from 'react-native';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

export default function LoginSignup() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    // ... existing authentication logic ...
    if (!email || !password || (!isLogin && !name)) {
      alert('Please fill all fields');
      return;
    }

    setLoading(true);

    try {
      // Simulate authentication process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create a mock user object
      const user = {
        did: `did:example:${Math.random().toString(36).substring(2, 15)}`,
        email,
        name: isLogin ? 'User' : name,
        verified: false,
        createdAt: new Date().toISOString()
      };
      
      // Store user in SecureStore
      await SecureStore.setItemAsync('user', JSON.stringify(user));
      
      // Navigate to verification screen
      router.replace('/verify');
    } catch (error) {
      console.error('Authentication error:', error);
      alert('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    // Clear fields when switching modes
    setPassword('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Ionicons name="qr-code" size={32} color="#3B82F6" />
            </View>
            <Text style={styles.title}>HD QR Code</Text>
            <Text style={styles.subtitle}>Secure Digital Identity</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </Text>
            
            {!isLogin && (
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={22} color="#3B82F6" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  placeholderTextColor="#94A3B8"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
            )}
            
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={22} color="#3B82F6" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor="#94A3B8"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={22} color="#3B82F6" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#94A3B8"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
            
            {isLogin && (
              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleAuth}
              disabled={loading}
            >
              {loading ? (
                <Text style={styles.buttonText}>
                  {isLogin ? 'Logging in...' : 'Creating account...'}
                </Text>
              ) : (
                <Text style={styles.buttonText}>
                  {isLogin ? 'Login' : 'Sign Up'}
                </Text>
              )}
            </TouchableOpacity>
            
            <View style={styles.switchContainer}>
              <Text style={styles.switchText}>
                {isLogin ? "Don't have an account?" : "Already have an account?"}
              </Text>
              <TouchableOpacity onPress={toggleAuthMode}>
                <Text style={styles.switchButton}>
                  {isLogin ? 'Sign Up' : 'Login'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 70,
    height: 70,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
  },
  formContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    color: '#1E293B',
    fontSize: 16,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#3B82F6',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#3B82F6',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  switchText: {
    color: '#64748B',
    fontSize: 14,
  },
  switchButton: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});