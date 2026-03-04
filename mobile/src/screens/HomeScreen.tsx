import React, { useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { v4 as uuid } from 'uuid';
import { RootStackParamList } from '../../App';
import { DemoControls } from '../components/DemoControls';
import { MeetingRecord } from '../types/api';
import { loadRecentMeetings, saveRecentMeetings } from '../utils/storage';
import { telemetryClient } from '../telemetry/TelemetryClient';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'> & {
  demoContext: {
    demoFlags: { slowTranscription: boolean; summaryError: boolean; badNetwork: boolean; largePayload: boolean };
    setDemoFlags: React.Dispatch<React.SetStateAction<any>>;
  };
};

export function HomeScreen({ navigation, demoContext }: Props) {
  const [recent, setRecent] = useState<MeetingRecord[]>([]);

  useEffect(() => {
    void loadRecentMeetings().then(setRecent);
    telemetryClient.startSpan('screen.view: Home').end();
  }, []);

  const startMeeting = async () => {
    const meeting: MeetingRecord = { id: uuid(), createdAt: new Date().toISOString() };
    const next = [meeting, ...recent].slice(0, 5);
    setRecent(next);
    await saveRecentMeetings(next);
    telemetryClient.trackEvent('user.action', { action: 'meeting_start', 'meeting.id': meeting.id });
    navigation.navigate('MeetingLive', { meeting });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>MeetingMind Dashboard</Text>
      <Pressable style={styles.primaryButton} onPress={startMeeting}>
        <Text style={styles.primaryButtonText}>Start Meeting</Text>
      </Pressable>

      <DemoControls
        demoFlags={demoContext.demoFlags}
        onChange={demoContext.setDemoFlags}
        onTriggerSummaryError={() => demoContext.setDemoFlags((s: any) => ({ ...s, summaryError: true }))}
        onCrash={() => {
          throw new Error('Demo induced crash');
        }}
      />

      <Text style={styles.subtitle}>최근 미팅</Text>
      {recent.map((item) => (
        <View key={item.id} style={styles.rowItem}>
          <Text>{item.id.slice(0, 8)}</Text>
          <Text>{new Date(item.createdAt).toLocaleTimeString()}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#eef4ff', padding: 16 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 16, color: '#1f3b8f' },
  subtitle: { marginTop: 20, fontWeight: '700', marginBottom: 10 },
  primaryButton: { backgroundColor: '#1f6feb', borderRadius: 8, padding: 14, marginBottom: 16 },
  primaryButtonText: { color: '#fff', textAlign: 'center', fontWeight: '700' },
  rowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
});
