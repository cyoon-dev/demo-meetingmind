import AsyncStorage from '@react-native-async-storage/async-storage';
import { MeetingRecord } from '../types/api';

const KEY = 'meetingmind.recentMeetings';

export const loadRecentMeetings = async (): Promise<MeetingRecord[]> => {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) {
    return [];
  }
  return JSON.parse(raw) as MeetingRecord[];
};

export const saveRecentMeetings = async (meetings: MeetingRecord[]): Promise<void> => {
  await AsyncStorage.setItem(KEY, JSON.stringify(meetings.slice(0, 5)));
};
