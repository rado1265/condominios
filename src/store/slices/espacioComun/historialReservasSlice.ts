import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { con } from "../../../application/entity/Rutas";

interface ReservaUsuario {
  id: number;
  fechaInicio: string;
  fechaFin: string;
  unidad: number;
  espacio: string;
  usuario: string;
  idUsuario: number;
  fechaSolicitud: Date;
  estado: boolean;
  espacioComun: string;
  direccion: string;
}

interface ReservasState {
  reservas: ReservaUsuario[];
  loading: boolean;
}

const initialState: ReservasState = {
  reservas: [],
  loading: false,
};

export const fetchReservas = createAsyncThunk(
  "reservas/fetchReservas",
  async ({ idUsuario }: { idUsuario: any }) => {
    const _ruta = con.RetornaRuta()
    const idCondominio = localStorage.getItem("idCondominio")!;
    const res = await axios.get(`${_ruta}EspacioComun/mis-reservas?idUsuario=${idUsuario}&idCondominio=${idCondominio}`, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'x-community-id':
          '2b2463d9f3b093b61be6ce0adbdcc4a0f7e56776502d173a4cf4bb0a8f5d0e79'
      }
    });
    return res.data;
  }
);

export const cancelarReserva = createAsyncThunk(
  "reservas/cancelarReserva",
  async (id: number) => {
    const _ruta = con.RetornaRuta()
    const idCondominio = localStorage.getItem("idCondominio")!;
    await axios.delete(`${_ruta}EspacioComun/cancelar?id=${id}&idCondominio=${idCondominio}`, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'x-community-id':
          '2b2463d9f3b093b61be6ce0adbdcc4a0f7e56776502d173a4cf4bb0a8f5d0e79'
      }
    });
  }
);

const historialReservas = createSlice({
  name: "historialReservas",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchReservas.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchReservas.fulfilled, (state, action) => {
      state.reservas = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchReservas.rejected, (state) => {
      state.loading = false;
    });
  },
});

export default historialReservas.reducer;
