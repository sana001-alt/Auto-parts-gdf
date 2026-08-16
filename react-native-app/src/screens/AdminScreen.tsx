import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Card, Text, Button, SegmentedButtons, List, Avatar, Badge, TextInput, useTheme } from 'react-native-paper';

export default function AdminScreen({ navigation }: any) {
  const [tab, setTab] = useState('listings');

  return (
    <ScrollView style={styles.container}>
      <Text variant="headlineSmall" style={styles.title}>Admin & Moderation</Text>
      
      <SegmentedButtons
        value={tab}
        onValueChange={setTab}
        buttons={[
          { value: 'listings', label: 'Listings' },
          { value: 'users', label: 'Users' },
          { value: 'banners', label: 'Banners' },
        ]}
        style={styles.segmented}
      />

      {tab === 'listings' && (
        <Card style={styles.card}>
          <Card.Title title="Listing Moderation" subtitle="Approve/Reject pending spare parts" />
          <Card.Content>
            <Text variant="bodyMedium">All active listings are currently verified.</Text>
          </Card.Content>
        </Card>
      )}

      {tab === 'users' && (
        <Card style={styles.card}>
          <Card.Title title="User Management" subtitle="Manage registered vendors and buyers" />
          <Card.Content>
            <Text variant="bodyMedium">Search user IDs or manage blocked accounts.</Text>
          </Card.Content>
        </Card>
      )}

      {tab === 'banners' && (
        <Card style={styles.card}>
          <Card.Title title="Promotional Banners" subtitle="Configure home page banner campaigns" />
          <Card.Content>
            <Text variant="bodyMedium">No active banner updates pending.</Text>
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontWeight: 'bold',
    color: '#0B1220',
    marginBottom: 16,
  },
  segmented: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#F8FAFC',
    marginBottom: 12,
  },
});
