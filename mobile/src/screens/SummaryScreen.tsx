import React, { useEffect } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Alert, Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { RootStackParamList } from '../../App';
import { telemetryClient } from '../telemetry/TelemetryClient';

type Props = NativeStackScreenProps<RootStackParamList, 'Summary'>;

export function SummaryScreen({ route }: Props) {
  useEffect(() => {
    telemetryClient.startSpan('screen.view: Summary', { 'meeting.id': route.params.meeting.id }).end();
  }, []);

  const summary = route.params.meeting.summary;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Summary</Text>
      {summary?.bullets.map((bullet) => (
        <Text key={bullet} style={styles.item}>• {bullet}</Text>
      ))}
      <Text style={styles.subtitle}>Action Items</Text>
      {summary?.actionItems.map((item) => (
        <Text key={item} style={styles.item}>- {item}</Text>
      ))}

      <Pressable style={styles.btn} onPress={() => { void Clipboard.setStringAsync(JSON.stringify(summary)); telemetryClient.trackEvent('user.action', { action: 'share_copy', 'meeting.id': route.params.meeting.id }); Alert.alert('Copied'); }}><Text style={styles.btnText}>Copy</Text></Pressable>
      <Pressable style={styles.btn} onPress={() => Alert.alert('Export PDF', '가짜 PDF export 완료')}><Text style={styles.btnText}>Export PDF(가짜)</Text></Pressable>
      <Pressable style={styles.btn} onPress={() => { telemetryClient.trackEvent('user.action', { action: 'share_slack', 'meeting.id': route.params.meeting.id }); Alert.alert('Slack', '가짜 Slack 공유 완료'); }}><Text style={styles.btnText}>Share to Slack(가짜)</Text></Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 10 },
  subtitle: { marginTop: 16, fontWeight: '700' },
  item: { marginBottom: 8, lineHeight: 20 },
  btn: { backgroundColor: '#1f6feb', padding: 12, borderRadius: 8, marginTop: 8 },
  btnText: { color: '#fff', textAlign: 'center', fontWeight: '700' },
});
