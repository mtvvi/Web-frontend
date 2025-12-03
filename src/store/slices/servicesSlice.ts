import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../api';
import type { DtoServiceResponse } from '../../api';
import { SERVICES_MOCK } from '../../mock/ServicesMock';

interface ServicesState {
  searchValue: string;
  services: DtoServiceResponse[];
  loading: boolean;
  error: string | null;
  cartOrderId: number | null;
  cartCount: number;
}

const initialState: ServicesState = {
  searchValue: '',
  services: [],
  loading: false,
  error: null,
  cartOrderId: null,
  cartCount: 0,
};

// Получение списка услуг
export const getServicesList = createAsyncThunk(
  'services/getServicesList',
  async (_, { getState, rejectWithValue }) => {
    const { services }: any = getState();
    try {
      const response = await api.services.servicesList({
        query: services.searchValue || undefined,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue('Ошибка при загрузке данных');
    }
  }
);

// Получение информации о корзине
export const getCartInfo = createAsyncThunk(
  'services/getCartInfo',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.orders.cartList();
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return { order_id: null, service_count: 0 };
      }
      return rejectWithValue('Ошибка получения корзины');
    }
  }
);

// Добавление услуги в заявку
export const addServiceToOrder = createAsyncThunk(
  'services/addServiceToOrder',
  async (serviceId: number, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.services.addToOrderCreate(serviceId);
      dispatch(getCartInfo());
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка добавления услуги');
    }
  }
);

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    setSearchValue(state, action: PayloadAction<string>) {
      state.searchValue = action.payload;
    },
    clearCart(state) {
      state.cartOrderId = null;
      state.cartCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // getServicesList
      .addCase(getServicesList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getServicesList.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload.services || [];
        state.error = null;
      })
      .addCase(getServicesList.rejected, (state) => {
        state.loading = false;
        // При ошибке используем mock данные
        state.services = SERVICES_MOCK.services.filter((item) =>
          item.name.toLowerCase().includes(state.searchValue.toLowerCase())
        );
        state.error = 'Сервис временно недоступен. Показаны mock-данные.';
      })
      // getCartInfo
      .addCase(getCartInfo.fulfilled, (state, action) => {
        state.cartOrderId = action.payload.order_id || null;
        state.cartCount = action.payload.service_count || 0;
      })
      .addCase(getCartInfo.rejected, (state) => {
        state.cartOrderId = null;
        state.cartCount = 0;
      })
      // addServiceToOrder
      .addCase(addServiceToOrder.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { setSearchValue, clearCart } = servicesSlice.actions;
export default servicesSlice.reducer;
