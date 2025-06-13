import AsyncStorage from '@react-native-async-storage/async-storage';

export type Profile = {
  id: string;
  name: string;
  color: string;
  isKids: boolean;
};

const PROFILES_STORAGE_KEY = '@streamio/profiles';

export const getProfiles = async (): Promise<Profile[]> => {
  try {
    const data = await AsyncStorage.getItem(PROFILES_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting profiles:', error);
    return [];
  }
};

export const getProfile = async (id: string): Promise<Profile | null> => {
  try {
    const profiles = await getProfiles();
    return profiles.find(profile => profile.id === id) || null;
  } catch (error) {
    console.error('Error getting profile:', error);
    return null;
  }
};

export const addProfile = async (profile: Omit<Profile, 'id'>): Promise<void> => {
  try {
    const profiles = await getProfiles();
    const newProfile: Profile = {
      ...profile,
      id: Date.now().toString(),
    };
    await AsyncStorage.setItem(
      PROFILES_STORAGE_KEY,
      JSON.stringify([...profiles, newProfile])
    );
  } catch (error) {
    console.error('Error adding profile:', error);
    throw error;
  }
};

export const updateProfile = async (profile: Profile): Promise<void> => {
  try {
    const profiles = await getProfiles();
    const updatedProfiles = profiles.map(p =>
      p.id === profile.id ? profile : p
    );
    await AsyncStorage.setItem(
      PROFILES_STORAGE_KEY,
      JSON.stringify(updatedProfiles)
    );
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

export const deleteProfile = async (id: string): Promise<void> => {
  try {
    const profiles = await getProfiles();
    const updatedProfiles = profiles.filter(profile => profile.id !== id);
    await AsyncStorage.setItem(
      PROFILES_STORAGE_KEY,
      JSON.stringify(updatedProfiles)
    );
  } catch (error) {
    console.error('Error deleting profile:', error);
    throw error;
  }
}; 