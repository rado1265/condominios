import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { CrearUsuarioLogic, ObtenerMisAnuncioLogic, ObtenerUsuariosLogic } from '../../../presentation/view-model/Anuncio.logic';

interface Usuario {
    id: number;
    usuario: string;
    clave: string;
    nombre: string;
    rol: string;
    fechaCaducidad: string;
    activo: boolean;
    direccion: string;
    telefono: string;
    tieneSuscripcionAnuncios: boolean;
    tieneSuscripcionMensajes: boolean;
    tieneSuscripcionVotaciones: false,
    tieneSuscripcionAvisos: boolean;
    tieneSuscripcionEspacioComun: boolean;
    imagen: string;
    mostrarDireccion: boolean; mostrarTelefono: boolean;

}

interface UsuariosState {
    listadousuarios: Usuario[] | null;
    listadousuariosParse: Usuario[] | null;
    dataUserSelect: Usuario;
    verMisAnuncios: boolean;
    loading: boolean;
    agregarUsuario: boolean;
    verUsuarioInd: boolean;
    newUser: any;
    cupoUsuarios: any;
    usuarioComunidad: boolean;
    misAnuncios: any[];
    actualizarMisAnuncios: boolean;
    error: string;
    anunciosUsuarios: any[];
}
const initialState: UsuariosState = {
    listadousuarios: [{ id: 0, usuario: '', clave: '', nombre: "", rol: "", fechaCaducidad: "", activo: false, direccion: "", telefono: "", tieneSuscripcionAnuncios: false, tieneSuscripcionMensajes: false, tieneSuscripcionVotaciones: false, tieneSuscripcionAvisos: false, tieneSuscripcionEspacioComun: false, imagen: "", mostrarDireccion: false, mostrarTelefono: false }],
    listadousuariosParse: [{ id: 0, usuario: '', clave: '', nombre: "", rol: "", fechaCaducidad: "", activo: false, direccion: "", telefono: "", tieneSuscripcionAnuncios: false, tieneSuscripcionMensajes: false, tieneSuscripcionVotaciones: false, tieneSuscripcionAvisos: false, tieneSuscripcionEspacioComun: false, imagen: "", mostrarDireccion: false, mostrarTelefono: false }],
    dataUserSelect: { id: 0, usuario: '', clave: '', nombre: "", rol: "", fechaCaducidad: "", activo: false, direccion: "", telefono: "", tieneSuscripcionAnuncios: false, tieneSuscripcionMensajes: false, tieneSuscripcionVotaciones: false, tieneSuscripcionAvisos: false, tieneSuscripcionEspacioComun: false, imagen: "", mostrarDireccion: false, mostrarTelefono: false },
    verMisAnuncios: false,
    loading: false,
    agregarUsuario: false,
    verUsuarioInd: false,
    newUser: {
        id: 0,
        usuario: '',
        nombre: '',
        clave: '',
        rol: '',
        idCondominio: 0
    },
    cupoUsuarios: { usados: 0, cupo: 0 },
    usuarioComunidad: false,
    misAnuncios: [],
    actualizarMisAnuncios: false,
    error: "",
    anunciosUsuarios: []
};

export const fetchUsuarios = createAsyncThunk(
    'usuarios/fetchUsuarios',
    async (idCondominio: string, { rejectWithValue }) => {
        return new Promise((resolve, reject) => {
            ObtenerUsuariosLogic((error: any, err: any, data: any) => {
                if (data) resolve(data);
                else rejectWithValue(err);
            }, idCondominio);
        });
    }
);
export const fetchAnunciosUsuarios = createAsyncThunk(
    'usuarios/fetchAnunciosUsuarios',
    async ({ idUsuario, idSolicitante }: { idUsuario: string, idSolicitante: string }, { rejectWithValue }) => {
        return new Promise((resolve, reject) => {
            ObtenerMisAnuncioLogic((error: any, err: any, data: any) => {
                if (data) resolve(data);
                else rejectWithValue(err);
            }, idUsuario, idSolicitante);
        });
    }
);

export const crearUsuario = createAsyncThunk(
    'usuarios/crearUsuario',
    async ({ newUser, eliminar }: { newUser: any; eliminar: boolean }, { dispatch, rejectWithValue }) => {
        return new Promise((resolve, reject) => {
            CrearUsuarioLogic((error: any, err: any, data: any) => {
                if (data) {
                    dispatch(fetchUsuarios(localStorage.getItem('idCondominio')!.toString()));
                    resolve(data);
                } else reject(rejectWithValue(err));
            }, newUser, eliminar);
        });
    }
);

const usuariosSlice = createSlice({
    name: 'usuarios',
    initialState,
    reducers: {
        setLimpiarNewUser(state: any, action) {
            state.newUser = action.payload;
        },
        setNewUser(state: any, action) {
            const { name, value } = action.payload;
            state.newUser[name] = value;
        },
        setAgregarUsuario(state: any, action) {
            state.agregarUsuario = action.payload;
        },
        setVerMisAnuncios(state: any, action) {
            state.verMisAnuncios = action.payload;
        },
        setUsuarioComunidad(state: any, action) {
            state.usuarioComunidad = action.payload;
        },
        setDataUserSelect(state: any, action) {
            state.dataUserSelect = action.payload;
        },
        setVerUserInd(state: any, action) {
            state.verUsuarioInd = action.payload;
        },
        setUsuariosParse(state: any, action) {
            state.listadousuariosParse = action.payload;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchUsuarios.pending, state => {
                state.loading = true;
            })
            .addCase(fetchUsuarios.fulfilled, (state, action: any) => {
                state.loading = false;
                state.listadousuarios = action.payload.usuarios;
                state.listadousuariosParse = action.payload.usuarios;
                state.cupoUsuarios = { usados: action.payload.cantUsuario, cupo: action.payload.totalUsuario };
            })
            .addCase(fetchUsuarios.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
                state.listadousuarios = [];
                state.listadousuariosParse = [];
                state.cupoUsuarios = { usados: 0, cupo: 0 };
            })
            .addCase(fetchAnunciosUsuarios.pending, state => {
                state.loading = true;
            })
            .addCase(fetchAnunciosUsuarios.fulfilled, (state, action: any) => {
                state.loading = false;
                state.anunciosUsuarios = action.payload;
                state.verMisAnuncios = true;
                state.verUsuarioInd = true;
                state.actualizarMisAnuncios = true;
            })
            .addCase(fetchAnunciosUsuarios.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
                state.anunciosUsuarios = [];
            })
            .addCase(crearUsuario.pending, state => {
                state.loading = true;
            })
            .addCase(crearUsuario.fulfilled, (state, action: any) => {
                state.loading = false;
                state.listadousuarios = action.payload.usuarios;
                state.listadousuariosParse = action.payload.usuarios;
                state.verMisAnuncios = false;
                state.verUsuarioInd = false;
                state.agregarUsuario = false;
                state.newUser = { id: 0, usuario: '', nombre: '', clave: '', rol: 'VECINO', idCondominio: parseInt(localStorage.getItem('idCondominio') || '0'), }
            })
            .addCase(crearUsuario.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
                state.anunciosUsuarios = [];
            })
    },
});

export const { setNewUser, setAgregarUsuario, setVerMisAnuncios, setUsuarioComunidad, setDataUserSelect, setVerUserInd, setUsuariosParse, setLimpiarNewUser } = usuariosSlice.actions;
export default usuariosSlice.reducer;
