import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { CrearVotacionLogic } from '../../../presentation/view-model/Anuncio.logic';

interface OpcionVotacion {
    Descripcion: string;
    IdVotacion: number;
}

interface VotacionPayload {
    Id: number;
    Cabecera: string;
    Descripcion: string;
    Activo: boolean;
    IdUsuario: number;
    IdCondominio: string;
    OpcionesVotacion: OpcionVotacion[];
}

interface VotacionesState {
    loading: boolean;
    error: string | null;
    success: boolean;
}

const initialState: VotacionesState = {
    loading: false,
    error: null,
    success: false,
};

export const crearVotacionAsync = createAsyncThunk(
    'votaciones/crearVotacion',
    async (votacion: VotacionPayload) => {
        console.log(votacion)
        return new Promise<VotacionPayload[]>((resolve, reject) => {
            CrearVotacionLogic((err: any, _: any, data: any) => {
                if (err) reject('Error al crear votación');
                else resolve(data);
            }, votacion);
        });
    }
);

const crearVotacionesSlice = createSlice({
    name: 'votaciones',
    initialState,
    reducers: {
        resetVotacionCreacion: (state) => {
            state.loading = false;
            state.success = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(crearVotacionAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(crearVotacionAsync.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
                toast.success('Votación creada correctamente.', { position: 'bottom-left' });
            })
            .addCase(crearVotacionAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                toast.error('Error al crear votación. Comuníquese con el Administrador.', { position: 'bottom-left' });
            });
    },
});

export const { resetVotacionCreacion } = crearVotacionesSlice.actions;
export default crearVotacionesSlice.reducer;
