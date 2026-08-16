import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Avatar, Text, Card, Button, List, Divider } from 'react-native-paper';

export default function SellerProfileScreen({ route, navigation }: any) {
  const { seller } = route.params || {};

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Avatar.Icon size={72} icon="store" backgroundColor="#1565FF" />
        <Text variant="headlineSmall" style={styles.name}>{seller?.name || 'Automotive Seller'}</Text>
        <Text variant="bodyMedium" style={styles.location}>{seller?.location || 'India'}</Text>
      </View>

      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Title title="Seller Verification" subtitle="Auto Parts India Verified Vendor" />
          <Card.Content>
            <Text variant="bodySmall" style={{ color: '#64748B' }}>
              Genuine dealer verified for authentic auto components and direct buyer communications.
            </Text>
          </Card.Content>
        </Card>
      </View>
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
    marginTop: 8,
  },
  location: {
    color: '#94A3B8',
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: '#F8FAFC',
  },
});
