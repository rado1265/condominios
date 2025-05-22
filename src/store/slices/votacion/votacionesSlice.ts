import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { CambiarEstadoVotacionLogic, ObtenerVotacionesLogic, VotarLogic } from '../../../presentation/view-model/Anuncio.logic';

export interface Opcion {
    descripcion: string;
    idVotacion: number;
    id: number;
    votaciones: any[];
}
export interface Votacion {
    id: number;
    cabecera: string;
    descripcion: string;
    activo: boolean;
    opcionesVotacion: Opcion[];
    total?: number;
}

interface VotacionesState {
    votaciones: Votacion[];
    loading: boolean;
    error: string | null;
}

const initialState: VotacionesState = {
    votaciones: [],
    loading: false,
    error: null
};

// Obtener votaciones
export const obtenerVotaciones = createAsyncThunk(
    'votaciones/obtenerVotaciones',
    async ({ idCondominio, idUsuario }: { idCondominio: string; idUsuario: number }) => {
        return new Promise<Votacion[]>((resolve, reject) => {
            ObtenerVotacionesLogic((err: any, _: any, data: any) => {
                if (err) reject('Error al obtener votaciones');
                else resolve(data);
            }, idCondominio, idUsuario);
        });
    }
);

// Cambiar estado de una votación
export const cambiarEstadoVotacion = createAsyncThunk(
    'votaciones/cambiarEstado',
    async ({ idVotacion, activo, idCondominio, idUsuario }: { idVotacion: number; activo: boolean; idCondominio: string; idUsuario: number }) => {
        return new Promise<Votacion[]>((resolve, reject) => {
            CambiarEstadoVotacionLogic((err: any, _: any, data: any) => {
                if (err) reject('Error al cambiar estado');
                else resolve(data);
            }, idVotacion, activo, idCondominio, idUsuario);
        });
    }
);

// Votar
export const votar = createAsyncThunk(
    'votaciones/votar',
    async ({ idOpcion, idUsuario, idCondominio }: { idOpcion: number; idUsuario: number; idCondominio: string }) => {
        return new Promise<Votacion[]>((resolve, reject) => {
            VotarLogic((err: any, _: any, data: any) => {
                if (err) reject('Error al votar');
                else resolve(data);
            }, idOpcion, idUsuario, idCondominio);
        });
    }
);

const votacionesSlice = createSlice({
    name: 'votaciones',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(obtenerVotaciones.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(obtenerVotaciones.fulfilled, (state, action) => {
                state.loading = false;
                state.votaciones = action.payload;
            })
            .addCase(obtenerVotaciones.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? null;
            })
            .addCase(cambiarEstadoVotacion.fulfilled, (state, action) => {
                state.votaciones = action.payload;
            })
            .addCase(votar.fulfilled, (state, action) => {
                state.votaciones = action.payload;
            });
    }
});

export default votacionesSlice.reducer;
