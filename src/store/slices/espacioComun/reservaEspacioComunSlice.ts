import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { con } from "../../../application/entity/Rutas";

const _ruta = con.RetornaRuta();

interface Espacio {
  id: number;
  nombre: string;
}

interface UnidadDisponible {
  id: number;
  numero: number;
}

interface ReservaState {
  espacios: Espacio[];
  espacioId: number | null;
  espacioSelect: Espacio | null;
  fechaInicio: Date | null;
  fechaFin: Date | null;
  unidadesDisponibles: UnidadDisponible[];
  verDisp: boolean;
  userSelect: number;
  loading: boolean;
}

const initialState: ReservaState = {
  espacios: [],
  espacioId: null,
  espacioSelect: null,
  fechaInicio: null,
  fechaFin: null,
  unidadesDisponibles: [],
  verDisp: false,
  userSelect: 0,
  loading: false,
};

function formatToLocalISOString(date: Date) {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
}

export const fetchEspacios = createAsyncThunk("reserva/fetchEspacios", async () => {
  const res = await axios.get(_ruta + "EspacioComun?idCondominio=" + localStorage.getItem("idCondominio"), {
    headers: {
      'Access-Control-Allow-Origin': '*',
      "x-community-id": "2b2463d9f3b093b61be6ce0adbdcc4a0f7e56776502d173a4cf4bb0a8f5d0e79",
    }
  });
  return res.data;
});

export const fetchDisponibles = createAsyncThunk(
  "reserva/fetchDisponibles",
  async (_, { getState }: any) => {

    const { reserva } = getState();
    const { espacioId, fechaInicio } = reserva;
    if (!espacioId || !fechaInicio) return [];
    console.log("ejecutando",fechaInicio)
    const res = await axios.get(_ruta + `EspacioComun/${espacioId}/disponibles`, {
      params: {
        fecha: formatToLocalISOString(new Date(fechaInicio))
      },
      headers: {
        'Access-Control-Allow-Origin': '*',
        "x-community-id": "2b2463d9f3b093b61be6ce0adbdcc4a0f7e56776502d173a4cf4bb0a8f5d0e79",
      }
    });

    return res.data;
  }
);

export const reservarUnidad = createAsyncThunk(
  "reserva/reservarUnidad",
  async ({ unidadId, usuarioId }: { unidadId: number, usuarioId: number }, { getState }) => {
    const { reserva } = getState() as { reserva: ReservaState };
    const res = await axios.post(_ruta + "EspacioComun/reservar", {
      id: 0,
      idUnidadEspacio: unidadId,
      fechaInicio: formatToLocalISOString(new Date(reserva.fechaInicio ?? new Date())),
      fechaFin: formatToLocalISOString(new Date(reserva.fechaFin ?? new Date())),
      idUsuario: reserva.userSelect !== 0 ? reserva.userSelect : usuarioId,
      idCondominio: parseInt(localStorage.getItem("idCondominio")!.toString()),
      fechaSolicitud: formatToLocalISOString(new Date()),
      estado: false,
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        "x-community-id": "2b2463d9f3b093b61be6ce0adbdcc4a0f7e56776502d173a4cf4bb0a8f5d0e79",
      }
    });
    return res.data;
  }
);

const reservaEspacioComunSlice = createSlice({
  name: "reserva",
  initialState,
  reducers: {
    setEspacioId(state, action: PayloadAction<number | null>) {
      state.espacioId = action.payload;
      state.espacioSelect = state.espacios.find(e => e.id === action.payload) ?? null;
      state.verDisp = false;
    },
    setFechaInicio(state, action: PayloadAction<Date | null>) {
      state.fechaInicio = action.payload;
      if (state.fechaFin && action.payload && state.fechaFin < action.payload) {
        state.fechaFin = null;
      }
      state.unidadesDisponibles = [];
      state.verDisp = false;
    },
    setFechaFin(state, action: PayloadAction<Date | null>) {
      state.fechaFin = action.payload;
      state.unidadesDisponibles = [];
      state.verDisp = false;
    },
    setUserSelect(state, action: PayloadAction<number>) {
      state.userSelect = action.payload;
    },
    resetDisponibilidad(state) {
      state.verDisp = false;
      state.unidadesDisponibles = [];
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchEspacios.fulfilled, (state, action) => {
      state.espacios = action.payload;
    });
    builder.addCase(fetchDisponibles.fulfilled, (state, action) => {
      state.unidadesDisponibles = action.payload;
      state.verDisp = true;
    });
  }
});

export const {
  setEspacioId,
  setFechaInicio,
  setFechaFin,
  setUserSelect,
  resetDisponibilidad
} = reservaEspacioComunSlice.actions;

export const selectReservaState = (state: any) => state.reserva;

export default reservaEspacioComunSlice.reducer;