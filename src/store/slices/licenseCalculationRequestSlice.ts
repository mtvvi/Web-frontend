import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../api';
import type { DtoLicenseCalculationRequestResponse, DtoServiceInLicenseCalculationRequestResp } from '../../api';

interface LicenseCalculationRequestState {
  licenseCalculationRequests: DtoLicenseCalculationRequestResponse[];
  currentLicenseCalculationRequest: DtoLicenseCalculationRequestResponse | null;
  services: DtoServiceInLicenseCalculationRequestResp[];
  loading: boolean;
  error: string | null;
  isDraft: boolean;
  licenseCalculationRequestFields: {
    users: number;
    cores: number;
    period: number;
  };
}

const initialState: LicenseCalculationRequestState = {
  licenseCalculationRequests: [],
  currentLicenseCalculationRequest: null,
  services: [],
  loading: false,
  error: null,
  isDraft: false,
  licenseCalculationRequestFields: {
    users: 1,
    cores: 1,
    period: 12,
  },
};

// Получение списка заявок
export const getLicenseCalculationRequestsList = createAsyncThunk(
  'licenseCalculationRequest/getLicenseCalculationRequestsList',
  async (filters: { status?: string; date_from?: string; date_to?: string } | undefined, { rejectWithValue }) => {
    try {
      const response = await api.licenseCalculationRequests.licenseCalculationRequestsList(filters);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки заявок');
    }
  }
);

// Получение заявки по ID
export const getLicenseCalculationRequestDetail = createAsyncThunk(
  'licenseCalculationRequest/getLicenseCalculationRequestDetail',
  async (licenseCalculationRequestId: number, { rejectWithValue }) => {
    try {
      const response = await api.licenseCalculationRequests.licenseCalculationRequestsDetail(licenseCalculationRequestId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки заявки');
    }
  }
);

// Обновление полей заявки
export const updateLicenseCalculationRequestFields = createAsyncThunk(
  'licenseCalculationRequest/updateLicenseCalculationRequestFields',
  async ({ licenseCalculationRequestId, data }: { licenseCalculationRequestId: number; data: { user_count?: number; core_count?: number; period?: number } }, { rejectWithValue }) => {
    try {
      const response = await api.licenseCalculationRequests.licenseCalculationRequestsUpdate(licenseCalculationRequestId, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка обновления заявки');
    }
  }
);

// Удаление заявки
export const deleteLicenseCalculationRequest = createAsyncThunk(
  'licenseCalculationRequest/deleteLicenseCalculationRequest',
  async (licenseCalculationRequestId: number, { rejectWithValue }) => {
    try {
      const response = await api.licenseCalculationRequests.licenseCalculationRequestsDelete(licenseCalculationRequestId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка удаления заявки');
    }
  }
);

// Формирование заявки
export const formatLicenseCalculationRequest = createAsyncThunk(
  'licenseCalculationRequest/formatLicenseCalculationRequest',
  async (licenseCalculationRequestId: number, { rejectWithValue }) => {
    try {
      const response = await api.licenseCalculationRequests.formatUpdate(licenseCalculationRequestId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка формирования заявки');
    }
  }
);

// Завершение заявки (модератор)
export const completeLicenseCalculationRequest = createAsyncThunk(
  'licenseCalculationRequest/completeLicenseCalculationRequest',
  async (licenseCalculationRequestId: number, { rejectWithValue }) => {
    try {
      const response = await api.licenseCalculationRequests.completeUpdate(licenseCalculationRequestId);
      return { licenseCalculationRequestId, data: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка завершения заявки');
    }
  }
);

// Отклонение заявки (модератор)
export const rejectLicenseCalculationRequest = createAsyncThunk(
  'licenseCalculationRequest/rejectLicenseCalculationRequest',
  async (licenseCalculationRequestId: number, { rejectWithValue }) => {
    try {
      const response = await api.licenseCalculationRequests.rejectUpdate(licenseCalculationRequestId);
      return { licenseCalculationRequestId, data: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка отклонения заявки');
    }
  }
);

// Удаление услуги из заявки
export const removeServiceFromLicenseCalculationRequest = createAsyncThunk(
  'licenseCalculationRequest/removeServiceFromLicenseCalculationRequest',
  async ({ licenseCalculationRequestId, serviceId }: { licenseCalculationRequestId: number; serviceId: number }, { rejectWithValue }) => {
    try {
      const response = await api.licenseCalculationRequestServices.deleteService(licenseCalculationRequestId, serviceId);
      return { serviceId, data: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка удаления услуги');
    }
  }
);

// Обновление коэффициента поддержки услуги
export const updateServiceSupportLevel = createAsyncThunk(
  'licenseCalculationRequest/updateServiceSupportLevel',
  async ({ licenseCalculationRequestId, serviceId, supportLevel }: { licenseCalculationRequestId: number; serviceId: number; supportLevel: number }, { rejectWithValue }) => {
    try {
      const response = await api.licenseCalculationRequestServices.updateService(licenseCalculationRequestId, serviceId, { support_level: supportLevel });
      return { serviceId, supportLevel, data: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка обновления уровня поддержки');
    }
  }
);

const licenseCalculationRequestSlice = createSlice({
  name: 'licenseCalculationRequest',
  initialState,
  reducers: {
    setLicenseCalculationRequestFields(state, action: PayloadAction<{ users?: number; cores?: number; period?: number }>) {
      state.licenseCalculationRequestFields = { ...state.licenseCalculationRequestFields, ...action.payload };
    },
    clearLicenseCalculationRequest(state) {
      state.currentLicenseCalculationRequest = null;
      state.services = [];
      state.isDraft = false;
      state.licenseCalculationRequestFields = { users: 1, cores: 1, period: 12 };
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
    setServices(state, action: PayloadAction<DtoServiceInLicenseCalculationRequestResp[]>) {
      state.services = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // getLicenseCalculationRequestsList
      .addCase(getLicenseCalculationRequestsList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLicenseCalculationRequestsList.fulfilled, (state, action) => {
        state.loading = false;
        state.licenseCalculationRequests = action.payload.licenseCalculationRequests || [];
      })
      .addCase(getLicenseCalculationRequestsList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // getLicenseCalculationRequestDetail
      .addCase(getLicenseCalculationRequestDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLicenseCalculationRequestDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.currentLicenseCalculationRequest = action.payload;
        state.services = action.payload.services || [];
        state.isDraft = action.payload.status === 'черновик';
        if (action.payload) {
          state.licenseCalculationRequestFields = {
            users: action.payload.users ?? 0,
            cores: action.payload.cores ?? 0,
            period: action.payload.period ?? 1, // Минимум 1 месяц (валидация на бэкенде)
          };
        }
      })
      .addCase(getLicenseCalculationRequestDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // updateLicenseCalculationRequestFields
      .addCase(updateLicenseCalculationRequestFields.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateLicenseCalculationRequestFields.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateLicenseCalculationRequestFields.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // deleteLicenseCalculationRequest
      .addCase(deleteLicenseCalculationRequest.fulfilled, (state) => {
        state.currentLicenseCalculationRequest = null;
        state.services = [];
        state.isDraft = false;
      })
      .addCase(deleteLicenseCalculationRequest.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // formatLicenseCalculationRequest
      .addCase(formatLicenseCalculationRequest.fulfilled, (state) => {
        state.isDraft = false;
        if (state.currentLicenseCalculationRequest) {
          state.currentLicenseCalculationRequest.status = 'сформирован';
        }
      })
      .addCase(formatLicenseCalculationRequest.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // removeServiceFromLicenseCalculationRequest
      .addCase(removeServiceFromLicenseCalculationRequest.fulfilled, (state, action) => {
        state.services = state.services.filter(s => s.id !== action.payload.serviceId);
      })
      .addCase(removeServiceFromLicenseCalculationRequest.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // updateServiceSupportLevel
      .addCase(updateServiceSupportLevel.fulfilled, (state, action) => {
        const service = state.services.find(s => s.id === action.payload.serviceId);
        if (service) {
          service.support_level = action.payload.supportLevel;
        }
      })
      .addCase(updateServiceSupportLevel.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // completeLicenseCalculationRequest
      .addCase(completeLicenseCalculationRequest.fulfilled, (state) => {
        if (state.currentLicenseCalculationRequest) {
          state.currentLicenseCalculationRequest.status = 'завершён';
        }
      })
      .addCase(completeLicenseCalculationRequest.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // rejectLicenseCalculationRequest
      .addCase(rejectLicenseCalculationRequest.fulfilled, (state) => {
        if (state.currentLicenseCalculationRequest) {
          state.currentLicenseCalculationRequest.status = 'отклонён';
        }
      })
      .addCase(rejectLicenseCalculationRequest.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { setLicenseCalculationRequestFields, clearLicenseCalculationRequest, setError, clearError, setServices } = licenseCalculationRequestSlice.actions;
export default licenseCalculationRequestSlice.reducer;
