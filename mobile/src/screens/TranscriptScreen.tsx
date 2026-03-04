import React, { useEffect } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { RootStackParamList } from '../../App';
import { telemetryClient } from '../telemetry/TelemetryClient';

type Props = NativeStackScreenProps<RootStackParamList, 'Transcript'>;

export function TranscriptScreen({ route, navigation }: Props) {
  useEffect(() => {
    telemetryClient.startSpan('screen.view: Transcript', { 'meeting.id': route.params.meeting.id }).end();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Transcript</Text>
      <Text style={styles.body}>{route.params.meeting.transcript ?? 'No transcript yet.'}</Text>
      <Pressable style={styles.btn} onPress={() => navigation.navigate('MeetingLive', { meeting: route.params.meeting })}>
        <Text style={styles.btnText}>Generate Summary로 이동</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 10 },
  body: { lineHeight: 20, marginBottom: 16 },
  btn: { backgroundColor: '#1f6feb', padding: 12, borderRadius: 8 },
  btnText: { color: '#fff', textAlign: 'center', fontWeight: '700' },
});
