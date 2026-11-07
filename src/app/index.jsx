import { useRef, useState } from 'react';
import { signInWithGoogle } from '../auth/googleSignIn';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';

export default function Welcome() {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const signingIn = useRef(false);

  async function handleSignIn() {
    if (signingIn.current) return;
    signingIn.current = true;
    setIsSigningIn(true);
    setErrorMessage('');
    try {
      await signInWithGoogle();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Sign-in failed. Please try again.');
    } finally {
      signingIn.current = false;
      setIsSigningIn(false);
    }
  }

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.container} bounces={false}>
        <View style={styles.content}>
          <View style={styles.brand}>
            <View style={styles.mark} accessible={false}>
              <View style={styles.shortBar} />
              <View style={styles.tallBar} />
            </View>
            <Text style={styles.wordmark}>Steps</Text>
          </View>

          <Text accessibilityRole="header" style={styles.title}>
            Welcome to Steps.
          </Text>
          <Text style={styles.description}>
            Set a daily step goal and see how your friends did when the day wraps up.
          </Text>

          <Pressable
            accessibilityRole="button"
            onPress={handleSignIn}
            disabled={isSigningIn}
            accessibilityState={{ disabled: isSigningIn, busy: isSigningIn }}
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          >
            <Image
              source={require('../../assets/images/google-g.svg')}
              style={styles.googleLogo}
              accessible={false}
            />
            {isSigningIn && <ActivityIndicator size="small" color="#FFFFFF" />}
            <Text style={styles.buttonLabel}>
              {isSigningIn ? 'Signing in…' : 'Continue with Google'}
            </Text>
          </Pressable>
          {!!errorMessage && (
            <Text accessibilityRole="alert" style={styles.error}>{errorMessage}</Text>
          )}
          <Text style={styles.note}>
            Why just Google? We went for a walk instead of building a password reset screen.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FAFAF6' },
  container: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 28 },
  content: { width: '100%', maxWidth: 420 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 32 },
  mark: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#DCEBDF',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingBottom: 9,
    gap: 3,
  },
  shortBar: { width: 6, height: 10, borderRadius: 2, backgroundColor: '#24543D' },
  tallBar: { width: 6, height: 18, borderRadius: 2, backgroundColor: '#24543D' },
  wordmark: { fontSize: 18, fontWeight: '700', color: '#24543D' },
  title: { fontSize: 42, letterSpacing: -1.6, fontWeight: '700', color: '#17251D' },
  description: { marginTop: 12, fontSize: 17, lineHeight: 26, color: '#4C5C51' },
  button: {
    marginTop: 32,
    minHeight: 54,
    padding: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    borderRadius: 12,
    backgroundColor: '#24543D',
  },
  buttonPressed: { backgroundColor: '#1A412F' },
  googleLogo: { width: 20, height: 20 },
  buttonLabel: { fontSize: 16, fontWeight: '600', color: '#FFFFFF', textAlign: 'center', flexShrink: 1 },
  error: { marginTop: 14, color: '#A32626', fontSize: 14, lineHeight: 21 },
  note: { marginTop: 14, fontSize: 14, lineHeight: 21, color: '#4C5C51', textAlign: 'center' },
});
