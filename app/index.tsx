// app/index.tsx
import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { View, Text, ActivityIndicator, StyleSheet, Animated, Dimensions, Image } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export default function SplashScreen() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<null | { did: string; verified: boolean }>(null);
  
  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(0.8))[0];
  const logoOpacity = useState(new Animated.Value(0))[0];
  
  useEffect(() => {
    // Start animations
    Animated.sequence([
      // Fade in and scale up the logo
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      // Slight delay
      Animated.delay(300),
      // Fade in the tagline
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Check user authentication
    const checkUser = async () => {
      try {
        const storedUser = await SecureStore.getItemAsync('user');
        // Add null check and JSON validation
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser?.did) {
            setUser(parsedUser);
          }
        }
        
        // Move the timeout outside the conditional
        setTimeout(() => {
          setLoading(false);
        }, 2500);
        
      } catch (error) {
        console.error('Error checking user:', error);
        setLoading(false);
      }
    };
    
    checkUser();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.backgroundCircles}>
          <View style={styles.circle1} />
          <View style={styles.circle2} />
        </View>
        
        <View style={styles.content}>
          <Animated.View 
            style={[
              styles.logoContainer,
              { 
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }]
              }
            ]}
          >
            <View style={styles.qrIconContainer}>
              <Text style={styles.qrIcon}>■</Text>
            </View>
          </Animated.View>
          
          <Animated.View style={[styles.textContainer, { opacity: logoOpacity }]}>
            <Text style={styles.title}>AEID</Text>
            <Text style={styles.subtitle}>Simple</Text>
          </Animated.View>
          
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#FDBB2D" />
          </View>
        </View>
      </View>
    );
  }

  //this is just for testing purposes for demo purposes
  if (1) return <Redirect href="/login-signup" />;

  return <Redirect href="/dashboard" />;
}

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121921',
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundCircles: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  circle1: {
    position: 'absolute',
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: width * 0.6,
    backgroundColor: '#1A2530',
    top: -width * 0.5,
    right: -width * 0.3,
  },
  circle2: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: '#232F3E',
    bottom: -width * 0.2,
    left: -width * 0.2,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  logoContainer: {
    width: width * 0.25,
    height: width * 0.25,
    borderRadius: 16,
    backgroundColor: '#FDBB2D',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  qrIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrIcon: {
    fontSize: 32,
    color: '#121921',
    fontWeight: 'bold',
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FDBB2D',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 40,
  },
  loadingContainer: {
    marginTop: 20,
  },
});
