import { View, Text, Switch, Pressable, StyleSheet } from 'react-native';
import { DemoFlags } from '../types/api';

interface Props {
  demoFlags: DemoFlags;
  onChange: (next: DemoFlags) => void;
  onTriggerSummaryError: () => void;
  onCrash: () => void;
}

export function DemoControls({ demoFlags, onChange, onTriggerSummaryError, onCrash }: Props) {
  const toggle = (key: keyof DemoFlags) => onChange({ ...demoFlags, [key]: !demoFlags[key] });

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Demo Controls</Text>
      <Row label="느린 전사" value={demoFlags.slowTranscription} onToggle={() => toggle('slowTranscription')} />
      <Row label="네트워크 불안정" value={demoFlags.badNetwork} onToggle={() => toggle('badNetwork')} />
      <Row label="큰 payload" value={demoFlags.largePayload} onToggle={() => toggle('largePayload')} />
      <Pressable style={styles.button} onPress={onTriggerSummaryError}>
        <Text style={styles.buttonText}>요약 실패 1회 트리거</Text>
      </Pressable>
      <Pressable style={[styles.button, styles.danger]} onPress={onCrash}>
        <Text style={styles.buttonText}>Crash App</Text>
      </Pressable>
    </View>
  );
}

function Row({ label, value, onToggle }: { label: string; value: boolean; onToggle: () => void }) {
  return (
    <View style={styles.row}>
      <Text>{label}</Text>
      <Switch value={value} onValueChange={onToggle} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', padding: 12, borderRadius: 8, gap: 8 },
  title: { fontWeight: '700', color: '#1f3b8f' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  button: { backgroundColor: '#1f6feb', padding: 10, borderRadius: 8 },
  danger: { backgroundColor: '#c62828' },
  buttonText: { color: '#fff', fontWeight: '600', textAlign: 'center' },
});
