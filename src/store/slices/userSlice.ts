import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api';

interface UserState {
  username: string;
  role: number | null;
  isAuthenticated: boolean;
  isModerator: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  username: '',
  role: null,
  isAuthenticated: false,
  isModerator: false,
  loading: false,
  error: null,
};

// Асинхронное действие для авторизации
export const loginUser = createAsyncThunk(
  'user/login',
  async (credentials: { login: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.auth.loginCreate(credentials);
      const { token, login, role } = response.data;
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('username', login || credentials.login);
        if (role !== undefined) {
          localStorage.setItem('role', String(role));
        }
      }
      return { login: login || credentials.login, role: role ?? null };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка авторизации');
    }
  }
);

// Асинхронное действие для регистрации
export const registerUser = createAsyncThunk(
  'user/register',
  async (userData: { login: string; password: string; full_name?: string }, { rejectWithValue }) => {
    try {
      const response = await api.auth.registerCreate({
        login: userData.login,
        password: userData.password,
        full_name: userData.full_name,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка регистрации');
    }
  }
);

// Асинхронное действие для деавторизации
export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await api.auth.logoutCreate();
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('role');
      return null;
    } catch (error: any) {
      // Даже если запрос не удался, очищаем локальное состояние
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('role');
      return rejectWithValue(error.response?.data?.message || 'Ошибка при выходе');
    }
  }
);

// Асинхронное действие для обновления профиля
export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (data: { full_name?: string; password?: string }, { rejectWithValue }) => {
    try {
      const response = await api.auth.profileUpdate(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка обновления профиля');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    checkAuth: (state) => {
      const token = localStorage.getItem('token');
      const username = localStorage.getItem('username');
       const role = localStorage.getItem('role');
      state.isAuthenticated = !!token;
      state.username = username || '';
       state.role = role ? Number(role) : null;
       state.isModerator = role ? Number(role) >= 2 : false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.username = action.payload.login;
      state.role = action.payload.role;
      state.isModerator = (action.payload.role ?? -1) >= 2;
      state.error = null;
    })
    .addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.isAuthenticated = false;
      state.role = null;
      state.isModerator = false;
    })
    // Register
    .addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
    })
    // Logout
    .addCase(logoutUser.fulfilled, (state) => {
      state.isAuthenticated = false;
      state.username = '';
      state.role = null;
      state.isModerator = false;
      state.error = null;
    })
    .addCase(logoutUser.rejected, (state) => {
      state.isAuthenticated = false;
      state.username = '';
      state.role = null;
      state.isModerator = false;
    })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, checkAuth } = userSlice.actions;
export default userSlice.reducer;
