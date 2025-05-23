
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UserRole } from '@/constants/roles'

type RoleState = {
  value: UserRole;
  loaded: boolean;
  avatarUrl?: string;
  firstName?: string; 
  lastName?: string;
  schoolName?: string;
}

const initialState: RoleState = {
  value: 'guest',
  loaded: false, 
  avatarUrl: undefined,
  firstName: '',
  lastName: '',
  schoolName: '',
}

export const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    setRole: (state, action: PayloadAction<{ role: UserRole, avatarUrl?: string, firstName?: string, lastName?: string, schoolName?: string }>) => {
      state.value = action.payload.role;
      state.avatarUrl = action.payload.avatarUrl;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.schoolName = action.payload.schoolName;
      state.loaded = true;
    },
    resetRole: (state) => {
      state.value = 'guest';
      state.loaded = true;
      state.avatarUrl = undefined;
      state.firstName = '';
      state.lastName = '';
      state.schoolName = '';
    },
  },
})

export const { setRole, resetRole } = roleSlice.actions
export default roleSlice.reducer
