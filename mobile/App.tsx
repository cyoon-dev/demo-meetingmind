import React, { useMemo, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from './src/screens/HomeScreen';
import { MeetingLiveScreen } from './src/screens/MeetingLiveScreen';
import { TranscriptScreen } from './src/screens/TranscriptScreen';
import { SummaryScreen } from './src/screens/SummaryScreen';
import { DemoFlags, MeetingRecord } from './src/types/api';

export type RootStackParamList = {
  Home: undefined;
  MeetingLive: { meeting: MeetingRecord };
  Transcript: { meeting: MeetingRecord };
  Summary: { meeting: MeetingRecord };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [demoFlags, setDemoFlags] = useState<DemoFlags>({
    slowTranscription: false,
    summaryError: false,
    badNetwork: false,
    largePayload: false,
  });

  const contextValue = useMemo(() => ({ demoFlags, setDemoFlags }), [demoFlags]);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#f5f9ff' } }}>
        <Stack.Screen name="Home">
          {(props) => <HomeScreen {...props} demoContext={contextValue} />}
        </Stack.Screen>
        <Stack.Screen name="MeetingLive" options={{ title: 'Meeting Live' }}>
          {(props) => <MeetingLiveScreen {...props} demoContext={contextValue} />}
        </Stack.Screen>
        <Stack.Screen name="Transcript" component={TranscriptScreen} />
        <Stack.Screen name="Summary" component={SummaryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
