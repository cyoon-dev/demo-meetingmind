import React, { useMemo, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { RootStackParamList } from '../../App';
import { DemoControls } from '../components/DemoControls';
import { summarizeMeeting, transcribeMeeting } from '../services/api';
import { telemetryClient } from '../telemetry/TelemetryClient';

type Props = NativeStackScreenProps<RootStackParamList, 'MeetingLive'> & {
  demoContext: {
    demoFlags: { slowTranscription: boolean; summaryError: boolean; badNetwork: boolean; largePayload: boolean };
    setDemoFlags: React.Dispatch<React.SetStateAction<any>>;
  };
};

export function MeetingLiveScreen({ route, navigation, demoContext }: Props) {
  const meeting = route.params.meeting;
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState<'transcribe' | 'summary' | null>(null);
  const networkLabel = useMemo(() => (demoContext.demoFlags.badNetwork ? '나쁨' : '좋음'), [demoContext.demoFlags.badNetwork]);

  const baseAttrs = {
    'meeting.id': meeting.id,
    'demo.slow_transcription': demoContext.demoFlags.slowTranscription,
    'demo.bad_network': demoContext.demoFlags.badNetwork,
    'demo.large_payload': demoContext.demoFlags.largePayload,
  };

  const uploadAudio = async () => {
    setLoading('transcribe');
    telemetryClient.trackEvent('user.action', { action: 'upload_audio', ...baseAttrs });
    try {
      const data = await transcribeMeeting(
        {
          meetingId: meeting.id,
          audioRef: 'fake://audio-file.m4a',
          options: { largePayload: demoContext.demoFlags.largePayload },
          demo: {
            slow: demoContext.demoFlags.slowTranscription,
            badNetwork: demoContext.demoFlags.badNetwork,
          },
        },
        demoContext.demoFlags.badNetwork,
        baseAttrs
      );
      Alert.alert('전사 성공', `duration: ${data.durationMs}ms`);
      navigation.navigate('Transcript', { meeting: { ...meeting, transcript: data.transcript } });
    } catch (_error) {
      Alert.alert('전사 실패', 'Retry 버튼으로 재시도하세요.');
    } finally {
      setLoading(null);
    }
  };

  const generateSummary = async () => {
    if (!route.params.meeting.transcript) {
      Alert.alert('전사 필요', '먼저 Upload Audio를 진행하세요.');
      return;
    }
    setLoading('summary');
    telemetryClient.trackEvent('user.action', { action: 'generate_summary', ...baseAttrs });
    try {
      const forceError = demoContext.demoFlags.summaryError;
      const data = await summarizeMeeting(
        {
          meetingId: meeting.id,
          transcript: route.params.meeting.transcript,
          options: { largePayload: demoContext.demoFlags.largePayload },
          demo: { slow: demoContext.demoFlags.slowTranscription, forceError },
        },
        demoContext.demoFlags.badNetwork,
        { ...baseAttrs, 'demo.summary_error': forceError }
      );
      if (forceError) {
        demoContext.setDemoFlags((s: any) => ({ ...s, summaryError: false }));
      }
      Alert.alert('요약 성공', `duration: ${data.durationMs}ms`);
      navigation.navigate('Summary', { meeting: { ...meeting, summary: data.summary, transcript: route.params.meeting.transcript } });
    } catch (_error) {
      demoContext.setDemoFlags((s: any) => ({ ...s, summaryError: false }));
      Alert.alert('요약 실패', 'Retry 버튼으로 재시도하세요.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Recording: {recording ? 'ON' : 'OFF'}</Text>
      <Text style={styles.subtitle}>Network: {networkLabel}</Text>

      <View style={styles.row}>
        <Pressable style={styles.btn} onPress={() => { setRecording(true); telemetryClient.trackEvent('user.action', { action: 'recording_start', ...baseAttrs }); }}><Text style={styles.btnText}>Start Recording</Text></Pressable>
        <Pressable style={styles.btn} onPress={() => { setRecording(false); telemetryClient.trackEvent('user.action', { action: 'recording_stop', ...baseAttrs }); }}><Text style={styles.btnText}>Stop Recording</Text></Pressable>
      </View>

      <Pressable style={styles.btn} onPress={uploadAudio}><Text style={styles.btnText}>Upload Audio</Text></Pressable>
      <Pressable style={styles.btn} onPress={generateSummary}><Text style={styles.btnText}>Generate Summary</Text></Pressable>
      <Pressable style={styles.btn} onPress={() => { void Clipboard.setStringAsync('Meeting clip copied'); telemetryClient.trackEvent('user.action', { action: 'share_copy', ...baseAttrs }); Alert.alert('Copied'); }}><Text style={styles.btnText}>Share</Text></Pressable>

      {loading && <ActivityIndicator size="large" color="#1f6feb" />}

      <DemoControls
        demoFlags={demoContext.demoFlags}
        onChange={demoContext.setDemoFlags}
        onTriggerSummaryError={() => demoContext.setDemoFlags((s: any) => ({ ...s, summaryError: true }))}
        onCrash={() => {
          throw new Error('Demo induced crash');
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#eef4ff', padding: 16 },
  title: { fontSize: 18, fontWeight: '700', color: '#1f3b8f', marginBottom: 6 },
  subtitle: { marginBottom: 16 },
  row: { flexDirection: 'row', gap: 8 },
  btn: { backgroundColor: '#1f6feb', padding: 12, borderRadius: 8, marginBottom: 10 },
  btnText: { color: '#fff', textAlign: 'center', fontWeight: '700' },
});
