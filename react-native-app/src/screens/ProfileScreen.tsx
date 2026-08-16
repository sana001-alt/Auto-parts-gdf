import React from 'react';
import { View, ScrollView, StyleSheet, Linking, Alert } from 'react-native';
import { Avatar, Text, Card, List, Button, Divider, SegmentedButtons, Badge, useTheme } from 'react-native-paper';
import { signOut, auth } from '../services/firebase';

export default function ProfileScreen({ navigation, user }: any) {

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Home');
    } catch (err) {
      console.warn('Sign out error:', err);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Avatar.Icon size={80} icon="account" backgroundColor="#1565FF" />
        <Text variant="headlineSmall" style={styles.name}>
          {user?.displayName || user?.name || user?.email?.split('@')[0] || 'Guest User'}
        </Text>
        <Text variant="bodyMedium" style={styles.email}>{user?.email || 'Not logged in'}</Text>
      </View>

      <Divider style={styles.divider} />

      {user ? (
        <View style={styles.content}>
          <List.Section>
            <List.Subheader>Account Management</List.Subheader>
            <List.Item
              title="My Listings"
              description="View and edit your posted spare parts"
              left={(props) => <List.Icon {...props} icon="car-cog" />}
              onPress={() => navigation.navigate('Home')}
            />
            <List.Item
              title="Notifications"
              description="Chat & price alert preferences"
              left={(props) => <List.Icon {...props} icon="bell" />}
              onPress={() => navigation.navigate('Chats')}
            />
            <List.Item
              title="Admin Dashboard"
              description="Platform moderation & verifications"
              left={(props) => <List.Icon {...props} icon="shield-account" />}
              onPress={() => navigation.navigate('Admin')}
            />
          </List.Section>

          <Button 
            mode="outlined" 
            onPress={handleSignOut} 
            textColor="#EF4444"
            style={styles.signOutButton}
          >
            Sign Out
          </Button>
        </View>
      ) : (
        <View style={styles.guestContainer}>
          <Text variant="bodyLarge" style={styles.guestText}>
            Log in to manage listings, save favorite parts, and chat with buyers & sellers directly.
          </Text>
          <Button 
            mode="contained" 
            onPress={() => navigation.navigate('Auth')} 
            buttonColor="#1565FF"
            style={styles.loginBtn}
          >
            Sign In / Register
          </Button>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#0B1220',
  },
  name: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginTop: 12,
  },
  email: {
    color: '#94A3B8',
  },
  divider: {
    height: 1,
  },
  content: {
    padding: 16,
  },
  signOutButton: {
    borderColor: '#EF4444',
    marginTop: 24,
  },
  guestContainer: {
    padding: 32,
    alignItems: 'center',
  },
  guestText: {
    textAlign: 'center',
    color: '#64748B',
    marginBottom: 20,
  },
  loginBtn: {
    width: '100%',
  },
});
