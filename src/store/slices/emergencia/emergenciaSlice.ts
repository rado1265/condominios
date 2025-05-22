// src/redux/slices/emergenciaSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { CrearEmergenciaLogic, ObtenerEmergenciasLogic } from '../../../presentation/view-model/Anuncio.logic';

export interface Emergencia {
  id: number;
  descripcion: string;
  telefono: string;
  idcondominio: number;
  direccion: string;
}

interface EmergenciaState {
  lista: Emergencia[];
  actual: Emergencia;
  loading: boolean;
  editar: boolean;
}

const initialState: EmergenciaState = {
  lista: [],
  actual: {
    id: 0,
    descripcion: '',
    telefono: '',
    idcondominio: 0,
    direccion: ''
  },
  loading: false,
  editar: false,
};

const normalizarEmergencia = (data: Emergencia): Emergencia => ({
  ...data,
  idcondominio: Number(localStorage.getItem("idCondominio")),
});

export const fetchEmergencias = createAsyncThunk(
  'emergencia/fetchAll',
  async (_, thunkAPI) => {
    return new Promise<Emergencia[]>((resolve, reject) => {
      ObtenerEmergenciasLogic((error: any, err: any, data: any) => {
        if (error) reject(err);
        else resolve(data);
      }, localStorage.getItem("idCondominio")!);
    });
  }
);

export const saveEmergencia = createAsyncThunk(
  'emergencia/save',
  async ({ data, eliminar }: { data: Emergencia; eliminar: boolean }, thunkAPI) => {
    return new Promise<Emergencia[]>((resolve, reject) => {
      CrearEmergenciaLogic((error: any, err: any, result: any) => {
        if (error) reject(err);
        else resolve(result);
      }, normalizarEmergencia(data), eliminar);
    });
  }
);

const emergenciaSlice = createSlice({
  name: 'emergencia',
  initialState,
  reducers: {
    setEditar: (state, action: PayloadAction<boolean>) => {
      state.editar = action.payload;
    },
    setActual: (state, action: PayloadAction<Emergencia>) => {
      state.actual = action.payload;
    },
    handleChange: (state, action: PayloadAction<{ name: string; value: string }>) => {
      state.actual = {
        ...state.actual,
        [action.payload.name]: action.payload.value,
      };
    },
    resetActual: (state) => {
      state.actual = initialState.actual;
      state.editar = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmergencias.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEmergencias.fulfilled, (state, action) => {
        state.lista = action.payload;
        state.loading = false;
      })
      .addCase(fetchEmergencias.rejected, (state) => {
        state.loading = false;
      })
      .addCase(saveEmergencia.pending, (state) => {
        state.loading = true;
      })
      .addCase(saveEmergencia.fulfilled, (state, action) => {
        state.lista = action.payload;
        state.loading = false;
        state.editar = false;
        state.actual = initialState.actual;
      })
      .addCase(saveEmergencia.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setEditar, setActual, handleChange, resetActual } = emergenciaSlice.actions;
export default emergenciaSlice.reducer;
