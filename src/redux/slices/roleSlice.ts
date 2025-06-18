
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UserRole } from '@/constants/roles'

type RoleState = {
  value: UserRole;
  loaded: boolean;
  avatarUrl?: string;
  firstName?: string; 
  lastName?: string;
  schoolName?: string;
  birthday: string;
  phoneNumber: string;
  address?: string;
  username: string;
  sex?: string;
}

const initialState: RoleState = {
  value: 'guest',
  loaded: false, 
  avatarUrl: undefined,
  firstName: '',
  lastName: '',
  schoolName: '',
  birthday: '',
  phoneNumber: '',
  address: '',
  username: '',
  sex: undefined,
  
}

export const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    setRole: (state, action: PayloadAction<{ role: UserRole, avatarUrl?: string, firstName?: string, lastName?: string, schoolName?: string, birthday?: string, phoneNumber?: string, username?: string, sex?: string, address?: string   }>) => {
      state.value = action.payload.role;
      state.avatarUrl = action.payload.avatarUrl;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.schoolName = action.payload.schoolName;
      state.birthday = action.payload.birthday;
      state.phoneNumber = action.payload.phoneNumber;
      state.username = action.payload.username;
      state.address = action.payload.address;
      state.sex = action.payload.sex;
      state.loaded = true;
    },
    resetRole: (state) => {
      state.value = 'guest';
      state.loaded = true;
      state.avatarUrl = undefined;
      state.firstName = '';
      state.lastName = '';
      state.schoolName = ''; 
      state.birthday= '';
      state.phoneNumber= '';
      state.username= '';
      state.address= '';
      state.sex= '';
    },
  },
})

export const { setRole, resetRole } = roleSlice.actions
export default roleSlice.reducer
