import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface EspacioComun {
  id: number;
  nombre: string;
}
export interface UnidadDisponible {
  id: number;
  numero: number;
}

export const fetchEspacios = createAsyncThunk('espacios/fetchEspacios', async () => {
  const res = await axios.get("/api/espacios");
  return res.data as EspacioComun[];
});

export const fetchDisponibles = createAsyncThunk(
  'espacios/fetchDisponibles',
  async ({ espacioId, fecha }: { espacioId: number; fecha: string }) => {
    const res = await axios.get(`/api/espacios/${espacioId}/disponibles`, {
      params: { fecha },
      headers: {
        'x-community-id': '2b2463d9f3b093b61be6ce0adbdcc4a0f7e56776502d173a4cf4bb0a8f5d0e79',
      },
    });
    return res.data as UnidadDisponible[];
  }
);

const disponibilidadEspacioComunSlice = createSlice({
  name: 'espacios',
  initialState: {
    espacios: [] as EspacioComun[],
    disponibles: [] as UnidadDisponible[],
    status: 'idle',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEspacios.fulfilled, (state, action) => {
        state.espacios = action.payload;
      })
      .addCase(fetchDisponibles.fulfilled, (state, action) => {
        state.disponibles = action.payload;
      });
  },
});

export default disponibilidadEspacioComunSlice.reducer;
