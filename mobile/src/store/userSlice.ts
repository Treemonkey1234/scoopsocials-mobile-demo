import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserProfile {
  id: string;
  phoneNumber: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  accountType: 'free' | 'professional';
  trustScore: number;
  isVerified: boolean;
  avatar?: string;
  socialAccounts: {
    platform: string;
    username: string;
    isVerified: boolean;
  }[];
  friends: string[];
  createdAt: string;
}

interface UserState {
  profile: UserProfile | null;
  contacts: {
    id: string;
    name: string;
    phoneNumber: string;
    hasApp: boolean;
  }[];
  isContactsImported: boolean;
}

const initialState: UserState = {
  profile: null,
  contacts: [],
  isContactsImported: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
    },
    updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
    setContacts: (state, action: PayloadAction<UserState['contacts']>) => {
      state.contacts = action.payload;
      state.isContactsImported = true;
    },
    addFriend: (state, action: PayloadAction<string>) => {
      if (state.profile && !state.profile.friends.includes(action.payload)) {
        state.profile.friends.push(action.payload);
      }
    },
    removeFriend: (state, action: PayloadAction<string>) => {
      if (state.profile) {
        state.profile.friends = state.profile.friends.filter(id => id !== action.payload);
      }
    },
    clearUserData: (state) => {
      state.profile = null;
      state.contacts = [];
      state.isContactsImported = false;
    },
  },
});

export const {
  setUserProfile,
  updateProfile,
  setContacts,
  addFriend,
  removeFriend,
  clearUserData,
} = userSlice.actions;

export default userSlice.reducer;