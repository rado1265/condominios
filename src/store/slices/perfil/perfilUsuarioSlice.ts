import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { DessuscribirNotificacionesLogic, EditUsuarioPorIdLogic, ObtenerUsuarioPorIdLogic, ObtenerUsuarioPorIdSinNotificiacionesLogic, SuscribirNotificaciones2Logic } from '../../../presentation/view-model/Anuncio.logic';

export interface Usuario {
  id: number;
  nombre: string;
  telefono: string;
  direccion: string;
  imagen: string;
  tieneSuscripcionMensajes: boolean;
  tieneSuscripcionVotaciones: boolean;
  tieneSuscripcionAnuncios: boolean;
  tieneSuscripcionAvisos: boolean;
  tieneSuscripcionEspacioComun: boolean;
  mostrarDireccion: boolean
  mostrarTelefono: boolean
  rol: string;
  clave: string;
  fechaCaducidad: string;
}

export interface Archivo {
  id: string;
  nombre: string;
  url: string;
}

interface PerfilUsuarioState {
  usuarioDetalle: Usuario | null;
  archivos: Archivo[];
  loading: boolean;
  error: string | null;
  archivoSubiendo: boolean;
  editar: boolean,
  preview: string,
  archivoTemp: any
}

const initialState: PerfilUsuarioState = {
  usuarioDetalle: null,
  archivos: [],
  loading: false,
  error: null,
  archivoSubiendo: false,
  editar: false,
  preview: '',
  archivoTemp: null
};

// Async Thunks

export const fetchUsuario = createAsyncThunk(
  'perfilUsuario/fetchUsuario', async ({ id, idCondominio, result }: { id: any, idCondominio: any, result: any }, thunkAPI) => {
    return new Promise<Usuario>((resolve, reject) => {
      if (result) {
        ObtenerUsuarioPorIdLogic((error: any, err: any, result: any) => {
          if (error) reject(err);
          else resolve(result);
        }, id, idCondominio, result);
      } else {
        ObtenerUsuarioPorIdSinNotificiacionesLogic((error: any, err: any, result: any) => {
          if (error) reject(err);
          else resolve(result);
        }, id, idCondominio);
      }
    });
  });

export const editarUsuario = createAsyncThunk('perfilUsuario/editarUsuario', async (usuario: any, thunkAPI) => {
  return new Promise<Usuario>((resolve, reject) => {
    EditUsuarioPorIdLogic((error: any, err: any, result: any) => {
      if (error) reject(err);
      else resolve(result);
    }, usuario);

  });
});

export const crearSuscripcion = createAsyncThunk(
  'perfilUsuario/crearSuscripcion',
  async ({ idCondominio, idUsuario, tipoSuscripcion, result }: { idCondominio: any, idUsuario: any, tipoSuscripcion: any, result: any }, thunkAPI) => {
    return new Promise<Usuario>((resolve, reject) => {
      SuscribirNotificaciones2Logic((error: any, err: any, result: any) => {
        if (error) reject(err);
        else resolve(result);
      }, idCondominio, idUsuario, tipoSuscripcion, result, true);
    })
  });

export const eliminarSuscripcion = createAsyncThunk(
  'perfilUsuario/eliminarSuscripcion',
  async ({ idUsuario, tipoSuscripcion, result }: { idUsuario: any, tipoSuscripcion: any, result: any }, thunkAPI) => {
    return new Promise<Usuario>((resolve, reject) => {
      DessuscribirNotificacionesLogic((error: any, err: any, result: any) => {
        if (error) reject(err);
        else resolve(result);
      }, idUsuario, tipoSuscripcion, result);
    })
  }
);

export const fetchArchivos = createAsyncThunk('perfilUsuario/fetchArchivos', async (_, thunkAPI) => {
  try {
    const resp = await fetch(`/api/archivos`);
    if (!resp.ok) throw new Error('Error al obtener archivos');
    const data = await resp.json();
    return data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const subirArchivo = createAsyncThunk('perfilUsuario/subirArchivo', async (archivo: any, thunkAPI) => {
  try {
    const formData = new FormData();
    formData.append('archivo', archivo);

    const resp = await fetch(`/api/archivos`, {
      method: 'POST',
      body: formData,
    });
    if (!resp.ok) throw new Error('Error al subir archivo');
    const data = await resp.json();
    return data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const eliminarArchivo = createAsyncThunk('perfilUsuario/eliminarArchivo', async (idArchivo: any, thunkAPI) => {
  try {
    const resp = await fetch(`/api/archivos/${idArchivo}`, {
      method: 'DELETE',
    });
    if (!resp.ok) throw new Error('Error al eliminar archivo');
    return idArchivo;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Slice

const perfilUsuarioSlice = createSlice({
  name: 'perfilUsuario',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    limpiarUsuario(state) {
      state.usuarioDetalle = null;
      state.archivos = [];
      state.loading = true;
      state.error = null;
      state.archivoSubiendo = false;
      state.editar = false
    },
    setEditar: (state, action: PayloadAction<boolean>) => {
      state.editar = action.payload;
    },
    setUsuarioDetalle(state: any, action) {
      const { name, value } = action.payload;
      state.usuarioDetalle[name] = value;
    },
    setPreview(state: any, action) {
      state.preview = action.payload;
    },
    setArchivoTemp(state: any, action) {
      state.archivoTemp = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      // fetchUsuario
      .addCase(fetchUsuario.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.editar = false;
      })
      .addCase(fetchUsuario.fulfilled, (state, action: PayloadAction<Usuario>) => {
        state.usuarioDetalle = action.payload;
        state.loading = false;
        state.editar = false;
      })
      .addCase(fetchUsuario.rejected, (state: any, action) => {
        state.error = action.payload || 'Error desconocido';
        state.loading = false;
        state.editar = false;
      })
      // editarUsuario
      .addCase(editarUsuario.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.editar = true;
      })
      .addCase(editarUsuario.fulfilled, (state, action: PayloadAction<Usuario>) => {
        state.loading = false;
        state.editar = false;
      })
      .addCase(editarUsuario.rejected, (state: any, action) => {
        state.error = action.payload || 'Error desconocido';
        state.loading = false;
        state.editar = false;
      })
      // crearSuscripcion
      .addCase(crearSuscripcion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(crearSuscripcion.fulfilled, (state, action) => {
        state.usuarioDetalle = action.payload;
        state.loading = false;
      })
      .addCase(crearSuscripcion.rejected, (state: any, action) => {
        state.error = action.payload || 'Error desconocido';
        state.loading = false;
      })
      // eliminarSuscripcion
      .addCase(eliminarSuscripcion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(eliminarSuscripcion.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(eliminarSuscripcion.rejected, (state: any, action) => {
        state.error = action.payload || 'Error desconocido';
        state.loading = false;
      })
      // fetchArchivos
      .addCase(fetchArchivos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArchivos.fulfilled, (state, action: PayloadAction<Archivo[]>) => {
        state.archivos = action.payload;
        state.loading = false;
      })
      .addCase(fetchArchivos.rejected, (state: any, action) => {
        state.error = action.payload || 'Error desconocido';
        state.loading = false;
      })
      // subirArchivo
      .addCase(subirArchivo.pending, (state) => {
        state.archivoSubiendo = true;
        state.error = null;
      })
      .addCase(subirArchivo.fulfilled, (state, action: PayloadAction<Archivo>) => {
        state.archivos.push(action.payload);
        state.archivoSubiendo = false;
      })
      .addCase(subirArchivo.rejected, (state: any, action) => {
        state.error = action.payload || 'Error desconocido';
        state.archivoSubiendo = false;
      })
      // eliminarArchivo
      .addCase(eliminarArchivo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(eliminarArchivo.fulfilled, (state, action: PayloadAction<string>) => {
        state.archivos = state.archivos.filter((a) => a.id !== action.payload);
        state.loading = false;
      })
      .addCase(eliminarArchivo.rejected, (state: any, action) => {
        state.error = action.payload || 'Error desconocido';
        state.loading = false;
      });
  },
});

export const { clearError, limpiarUsuario, setEditar, setUsuarioDetalle, setPreview, setArchivoTemp } = perfilUsuarioSlice.actions;

export default perfilUsuarioSlice.reducer;
