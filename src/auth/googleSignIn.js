import { Platform } from 'react-native';
import { supabase } from '../lib/supabase';

export async function signInWithGoogle() {
  if (Platform.OS !== 'android') {
    throw new Error('Please sign in using the Steps Android app.');
  }

  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
  if (!supabase || !webClientId) {
    throw new Error('Add the Supabase URL, publishable key, and Google web client ID to .env, then restart the development server.');
  }

  // Load the native module only on Android and when sign-in is requested.
  const { GoogleSignin, isSuccessResponse } = await import(
    '@react-native-google-signin/google-signin'
  );
  GoogleSignin.configure({ webClientId });
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

  const response = await GoogleSignin.signIn();
  if (!isSuccessResponse(response)) return null;

  const token = response.data.idToken;
  if (!token) {
    throw new Error('Google did not return an ID token. Check the Google web client ID.');
  }

  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: 'google',
    token,
  });

  if (error) throw error;
  return data;
}
