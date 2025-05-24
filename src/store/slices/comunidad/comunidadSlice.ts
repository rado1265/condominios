import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { CambiarNormasLogic, ObtenerListadoAnuncioLogic, SuscribirNotificaciones2Logic } from '../../../presentation/view-model/Anuncio.logic';


interface DataFull {
    nombre: string;
    logo: string;
    normas: string;
    avisosHoy: boolean;
    esVideo: boolean;
    id: number;
}
interface ComunidadState {
    comunidad: DataFull;
    loading: boolean;
    mostrar: Mostrar;
    sinNotificaciones: boolean;
    active: string;
    nuevaNorma: string;
    editarNormas: boolean;
    editadoNormas: boolean;
}
interface Mostrar {
    verMisAnuncios: boolean;
    tipo: number;
    iniciarSesion: boolean;
    encuesta: boolean;
    verPerfil: boolean;
    enComunidad: boolean;
    verEspacioComun: boolean;
    verPublicacion: boolean;
    verReglasNormas: boolean;
    verUsuarios: boolean;
    verAvisos: boolean;
    verEmergencia: boolean;
    verVotaciones: boolean;
    verCrearAnuncio: boolean;
    verEditarAnuncio: boolean;
    verDetalle: boolean;
}

const initialState: ComunidadState = {
    comunidad: {
        id: 0,
        nombre: '',
        logo: '',
        normas: '',
        avisosHoy: false,
        esVideo: false,
    },
    loading: false,
    mostrar: {
        verMisAnuncios: false,
        tipo: 0,
        iniciarSesion: true,
        encuesta: false,
        verPerfil: false,
        enComunidad: false,
        verEspacioComun: false,
        verPublicacion: false,
        verReglasNormas: false,
        verUsuarios: false,
        verAvisos: false,
        verEmergencia: false,
        verVotaciones: false,
        verCrearAnuncio: false,
        verEditarAnuncio: false,
        verDetalle: false
    },
    sinNotificaciones: false,
    active: 'calendario',
    nuevaNorma: '',
    editarNormas: false,
    editadoNormas: false,
}

export const fetchAnuncios = createAsyncThunk(
    'usuarios/fetchAnuncios',
    async (idCondominio: string, { rejectWithValue }) => {
        return new Promise((resolve, reject) => {
            ObtenerListadoAnuncioLogic((error: any, err: any, data: any) => {
                if (data) resolve(data);
                else rejectWithValue(err);
            }, idCondominio);
        });
    }
);
export const crearSuscripcion = createAsyncThunk(
    'perfilUsuario/crearSuscripcion',
    async ({ idCondominio, idUsuario, tipoSuscripcion, result }: { idCondominio: any, idUsuario: any, tipoSuscripcion: any, result: any }, thunkAPI) => {
        return new Promise<boolean>((resolve, reject) => {
            SuscribirNotificaciones2Logic((error: any, err: any, result: any) => {
                if (error) reject(err);
                else resolve(result);
            }, idCondominio, idUsuario, tipoSuscripcion, result, true);
        })
    });
export const fetchCambiarNormas = createAsyncThunk(
    'perfilUsuario/fetchCambiarNormas',
    async ({ idCondominio, normas }: { idCondominio: any, normas: any }, thunkAPI) => {
        return new Promise<any>((resolve, reject) => {
            CambiarNormasLogic((error: any, err: any, result: any) => {
                if (error) reject(err);
                else resolve(result);
            }, normas, idCondominio);
        })
    });


const comunidadSlice = createSlice({
    name: 'comunidad',
    initialState,
    reducers: {
        setTipo(state: any, action) {
            state.mostrar.tipo = action.payload;
        },
        setCerrarTodo(state: any) {
            state.mostrar = {
                verMisAnuncios: false, tipo: 0, iniciarSesion: true, encuesta: false, verPerfil: false, enComunidad: false, verEspacioComun: false, verPublicacion: false,
                verReglasNormas: false, verUsuarios: false, verAvisos: false, verEmergencia: false, verVotaciones: false, verCrearAnuncio: false, verEditarAnuncio: false, verDetalle: false
            }
        },
        setComunidad(state: any, action) {
            state.comunidad = action.payload;
        },
        setCambiarMenu(state: any, action: any) {
            const { mostrar, tipo } = action.payload;
            const todasLasKeys = Object.keys(state.mostrar) as (keyof typeof state.mostrar)[];

            todasLasKeys.forEach(key => {
                state.mostrar[key] = (key === mostrar) ? true : false;
            });
            state.mostrar.tipo = tipo;
            if (mostrar != "iniciarSesion")
                state.mostrar.enComunidad = true
        },
        setEnComunidad(state: any, action: any) {
            state.mostrar.enComunidad = action.payload;
        },
        setActive(state: any, action: any) {
            state.active = action.payload;
        },
        setNuevaNorma(state: any, action: any) {
            state.nuevaNorma = action.payload;
        },
        setEditarNormas(state: any, action: any) {
            state.editarNormas = action.payload;
        },
        setEditadoNormas(state: any, action: any) {
            state.editadoNormas = action.payload;
        },
        setLoading(state: any, action: any) {
            state.loading = action.payload;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchAnuncios.pending, state => {
                state.loading = true;
            })
            .addCase(fetchAnuncios.fulfilled, (state, action: any) => {
                state.loading = false;
                state.comunidad = action.payload;
                state.nuevaNorma = action.payload.normas;
            })
            .addCase(fetchAnuncios.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
                state.comunidad = {}
            })
            .addCase(fetchCambiarNormas.pending, state => {
                state.loading = true;
            })
            .addCase(fetchCambiarNormas.fulfilled, (state, action: any) => {
                state.loading = false;
                state.comunidad.normas = action.payload.normas;
            })
            .addCase(fetchCambiarNormas.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    },
});

export const { setTipo, setCerrarTodo, setComunidad, setCambiarMenu, setEnComunidad, setActive, setNuevaNorma, setEditarNormas, setEditadoNormas, setLoading } = comunidadSlice.actions;
export default comunidadSlice.reducer;
