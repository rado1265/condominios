import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import dayjs from 'dayjs';
import { con } from '../../../application/entity/Rutas';

// URL base y headers comunes
const _ruta = con.RetornaRuta()
const baseURL = _ruta; // Cambia por la URL real
const headers = {
    'Access-Control-Allow-Origin': '*',
    'x-community-id': '2b2463d9f3b093b61be6ce0adbdcc4a0f7e56776502d173a4cf4bb0a8f5d0e79',
};

// Thunk para obtener tipos de avisos
export const fetchTiposAviso = createAsyncThunk(
    'aviso/fetchTiposAviso',
    async () => {
        const response = await axios.get(`${baseURL}Condominios/getTipoAvisos?idCondominio=${localStorage.getItem("idCondominio")!.toString()}`, { headers });
        return response.data;
    }
);

// Thunk para crear o eliminar tipo de aviso
export const postTipoAviso = createAsyncThunk(
    'aviso/postTipoAviso',
    async ({ tipoAviso, eliminar }: { tipoAviso: any, eliminar: any }) => {
        console.log(tipoAviso, eliminar)
        const response = await axios.post(`${baseURL}Condominios/createTipoAviso?eliminar=${eliminar}`, tipoAviso, { headers });
        return response.data;
    }
);

// Thunk para obtener avisos por mes y año
export const fetchAvisos = createAsyncThunk(
    'aviso/fetchAvisos',
    async ({ mes, año, idCondominio }: { mes: any, año: any, idCondominio: any }) => {
        // Aquí deberías llamar a la API que devuelve los avisos para mes y año
        // Suponemos que existe un endpoint similar
        const response = await axios.get(`${baseURL}Condominios/getAvisos?mes=${mes}&anio=${año}&idCondominio=${idCondominio}`, { headers });
        return response.data;
    }
);

// Thunk para crear o eliminar avisos
export const postCrearAviso = createAsyncThunk(
    'aviso/postCrearAviso',
    async ({ aviso, eliminar }: { aviso: any, eliminar: any }) => {
        // Lógica para crear o eliminar aviso según eliminar booleano
        // Usa el endpoint correspondiente
        const response = await axios.post(`${baseURL}Condominios/crearAviso?eliminar=${eliminar}`, aviso, { headers });
        return response.data;
    }
);

const initialState = {
    avisos: [],
    tiposAviso: [],
    loading: false,
    error: null,
    año: new Date().getFullYear(),
    mes: new Date().getMonth() + 1, // Mes 1-12
    dia: new Date().getDate(),
    diaMesSelect: { dia: 0, mes: 0, año: 0 },
    avisosDiaSeleccionado: [],
    crearEvento: false,
    editarEvento: false,
    crearTipoEvento: false,
    tipoAvisoActual: {
        id: 0,
        descripcion: '',
        color: '',
        idCondominio: ""/* localStorage.getItem("idCondominio")!.toString() */
    },
    avisoActual: {
        id: 0,
        mensaje: '',
        fecha: '',
        color: '',
        cabecera: '',
        idCondominio: "",/* localStorage.getItem("idCondominio")!.toString(), */
        idReserva: 0,
        idUsuario: 0,
    },
};

const avisoSlice = createSlice({
    name: 'aviso',
    initialState,
    reducers: {
        setMes(state, action) {
            state.mes = action.payload;
        },
        setAño(state, action) {
            state.año = action.payload;
        },
        setDia(state, action) {
            state.dia = action.payload;
        },
        setDiaMesSelect(state, action) {
            state.diaMesSelect = action.payload;
        },
        setAvisosDiaSeleccionado(state, action) {
            state.avisosDiaSeleccionado = action.payload;
        },
        setCrearEvento(state, action) {
            state.crearEvento = action.payload;
            if (!action.payload)
                state.avisoActual = {
                    id: 0,
                    mensaje: '',
                    fecha: '',
                    color: '',
                    cabecera: '',
                    idCondominio: localStorage.getItem("idCondominio")!.toString(),
                    idReserva: 0,
                    idUsuario: 0,
                }
        },
        setCrearTipoEvento(state, action) {
            state.crearTipoEvento = action.payload;
            if (!action.payload)
                state.tipoAvisoActual = {
                    id: 0,
                    descripcion: '',
                    color: '',
                    idCondominio: localStorage.getItem("idCondominio")!.toString()
                }
        },
        setEditarEvento(state, action) {
            state.editarEvento = action.payload;
            if (!action.payload)
                state.avisoActual = {
                    id: 0,
                    mensaje: '',
                    fecha: '',
                    color: '',
                    cabecera: '',
                    idCondominio: localStorage.getItem("idCondominio")!.toString(),
                    idReserva: 0,
                    idUsuario: 0,
                }
        },
        setTipoAvisoActual(state: any, action) {
            const { name, value } = action.payload;
            state.tipoAvisoActual[name] = value;
        },
        setAvisoActual(state: any, action) {
            const { name, value } = action.payload;
            state.avisoActual[name] = value;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTiposAviso.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTiposAviso.fulfilled, (state, action) => {
                state.loading = false;
                state.tiposAviso = action.payload;
            })
            .addCase(fetchTiposAviso.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchAvisos.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAvisos.fulfilled, (state, action) => {
                state.loading = false;
                state.avisos = action.payload;
            })
            .addCase(fetchAvisos.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(postCrearAviso.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(postCrearAviso.fulfilled, (state, action) => {
                state.loading = false;
                state.avisos = action.payload;
                state.crearEvento = false;
                state.crearTipoEvento = false;
                state.editarEvento = false;
            })
            .addCase(postCrearAviso.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(postTipoAviso.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(postTipoAviso.fulfilled, (state, action) => {
                state.loading = false;
                state.tiposAviso = action.payload;
            })
            .addCase(postTipoAviso.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const {
    setMes,
    setAño,
    setDiaMesSelect,
    setAvisosDiaSeleccionado,
    setCrearEvento,
    setCrearTipoEvento,
    setEditarEvento,
    setTipoAvisoActual,
    setAvisoActual,
    setDia
} = avisoSlice.actions;

export default avisoSlice.reducer;
