import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../api';
import type { DtoOrderResponse, DtoServiceInOrderResp } from '../../api';

interface OrderState {
  orders: DtoOrderResponse[];
  currentOrder: DtoOrderResponse | null;
  services: DtoServiceInOrderResp[];
  loading: boolean;
  error: string | null;
  isDraft: boolean;
  orderFields: {
    users: number;
    cores: number;
    period: number;
  };
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  services: [],
  loading: false,
  error: null,
  isDraft: false,
  orderFields: {
    users: 1,
    cores: 1,
    period: 12,
  },
};

// Получение списка заявок
export const getOrdersList = createAsyncThunk(
  'order/getOrdersList',
  async (filters: { status?: string; date_from?: string; date_to?: string } | undefined, { rejectWithValue }) => {
    try {
      const response = await api.orders.ordersList(filters);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки заявок');
    }
  }
);

// Получение заявки по ID
export const getOrderDetail = createAsyncThunk(
  'order/getOrderDetail',
  async (orderId: number, { rejectWithValue }) => {
    try {
      const response = await api.orders.ordersDetail(orderId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки заявки');
    }
  }
);

// Обновление полей заявки
export const updateOrderFields = createAsyncThunk(
  'order/updateOrderFields',
  async ({ orderId, data }: { orderId: number; data: { user_count?: number; core_count?: number; period?: number } }, { rejectWithValue }) => {
    try {
      const response = await api.orders.ordersUpdate(orderId, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка обновления заявки');
    }
  }
);

// Удаление заявки
export const deleteOrder = createAsyncThunk(
  'order/deleteOrder',
  async (orderId: number, { rejectWithValue }) => {
    try {
      const response = await api.orders.ordersDelete(orderId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка удаления заявки');
    }
  }
);

// Формирование заявки
export const formatOrder = createAsyncThunk(
  'order/formatOrder',
  async (orderId: number, { rejectWithValue }) => {
    try {
      const response = await api.orders.formatUpdate(orderId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка формирования заявки');
    }
  }
);

// Удаление услуги из заявки
export const removeServiceFromOrder = createAsyncThunk(
  'order/removeServiceFromOrder',
  async ({ orderId, serviceId }: { orderId: number; serviceId: number }, { rejectWithValue }) => {
    try {
      const response = await api.orderServices.deleteService(orderId, serviceId);
      return { serviceId, data: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка удаления услуги');
    }
  }
);

// Обновление коэффициента поддержки услуги
export const updateServiceSupportLevel = createAsyncThunk(
  'order/updateServiceSupportLevel',
  async ({ orderId, serviceId, supportLevel }: { orderId: number; serviceId: number; supportLevel: number }, { rejectWithValue }) => {
    try {
      const response = await api.orderServices.updateService(orderId, serviceId, { support_level: supportLevel });
      return { serviceId, supportLevel, data: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка обновления уровня поддержки');
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrderFields(state, action: PayloadAction<{ users?: number; cores?: number; period?: number }>) {
      state.orderFields = { ...state.orderFields, ...action.payload };
    },
    clearOrder(state) {
      state.currentOrder = null;
      state.services = [];
      state.isDraft = false;
      state.orderFields = { users: 1, cores: 1, period: 12 };
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
    setServices(state, action: PayloadAction<DtoServiceInOrderResp[]>) {
      state.services = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // getOrdersList
      .addCase(getOrdersList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrdersList.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders || [];
      })
      .addCase(getOrdersList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // getOrderDetail
      .addCase(getOrderDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.services = action.payload.services || [];
        state.isDraft = action.payload.status === 'черновик';
        if (action.payload) {
          state.orderFields = {
            users: action.payload.users ?? 0,
            cores: action.payload.cores ?? 0,
            period: action.payload.period ?? 0,
          };
        }
      })
      .addCase(getOrderDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // updateOrderFields
      .addCase(updateOrderFields.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateOrderFields.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateOrderFields.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // deleteOrder
      .addCase(deleteOrder.fulfilled, (state) => {
        state.currentOrder = null;
        state.services = [];
        state.isDraft = false;
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // formatOrder
      .addCase(formatOrder.fulfilled, (state) => {
        state.isDraft = false;
        if (state.currentOrder) {
          state.currentOrder.status = 'formatted';
        }
      })
      .addCase(formatOrder.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // removeServiceFromOrder
      .addCase(removeServiceFromOrder.fulfilled, (state, action) => {
        state.services = state.services.filter(s => s.id !== action.payload.serviceId);
      })
      .addCase(removeServiceFromOrder.rejected, (state, action) => {
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
      });
  },
});

export const { setOrderFields, clearOrder, setError, clearError, setServices } = orderSlice.actions;
export default orderSlice.reducer;
