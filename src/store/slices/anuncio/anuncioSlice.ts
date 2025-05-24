import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { CrearAnuncioLogic, CrearComentarioAnuncioLogic, DarQuitarLikeLogic, EliminarAnuncioLogic, ObtenerAnuncioPorIdLogic, ObtenerListadoAnuncioLogic } from '../../../presentation/view-model/Anuncio.logic';
interface Anuncio {
    cabecera: string;
    descripcion: string;
    amedida: string;
    id: number;
    telefono: string;
    likes: any[],
    organizador: string;
    fechaDesde: string;
    fechaHasta: string;
    comentarios: any[],
    esVideo: boolean;
    imgOrganizador: string;
    rolOrganizador: string;
    cantComentarios: number;
    cantLikes: number;
    idTipo: number;
}
interface AnuncioCrear {
    id: number;
    idCondominio: string;
    cabecera: string;
    descripcion: string;
    organizador: string;
    telefono: string;
    amedida: string;
    fechaDesde: string;
    fechaHasta: string;
    idTipo: number;
    idUsuario: number;
    activo: boolean;
    esVideo: boolean;
}
interface AnuncioState {
    dataFull: Anuncio[];
    dataFullParse: Anuncio[];
    misAnuncios: Anuncio[];
    dataDetalle: Anuncio;
    anuncioCrear: AnuncioCrear;
    loading: boolean;
    error: string;
    esPropietario: boolean;
    modalOpenImg: boolean;
    imgSelect: string;
    verDetalle: boolean;
    editar: boolean;
    crear: boolean;
    activeFilter: string;
    buscarenmenu: boolean;
    alignment: string;
    buscarDataFull: string;
    orden: string;
    criterio: string;
    ////////////////////
    tipoSubir: number;
    archivoTemp: File | null;
    newComentario: string;
}

const initialState: AnuncioState = {
    dataFull: [],
    dataFullParse: [],
    misAnuncios: [],
    dataDetalle: { idTipo: 0, cantLikes: 0, cabecera: "", descripcion: "", amedida: "", id: 0, telefono: "", likes: [], organizador: "", fechaDesde: "", fechaHasta: "", comentarios: [], esVideo: false, imgOrganizador: "", rolOrganizador: "", cantComentarios: 0 },
    anuncioCrear: {
        id: 0,
        idCondominio: ""/* localStorage.getItem("idCondominio")!.toString() */,
        cabecera: "",
        descripcion: "",
        organizador: "",
        telefono: "",
        amedida: "",
        fechaDesde: "",
        fechaHasta: "",
        idTipo: 1,
        idUsuario: 0,
        activo: true,
        esVideo: false,
    },
    loading: true,
    error: '',
    esPropietario: false,
    modalOpenImg: false,
    imgSelect: '',
    verDetalle: false,
    editar: false,
    crear: false,
    activeFilter: "fechaDesde",
    buscarenmenu: false,
    alignment: 'Todo',
    buscarDataFull: '',
    orden: 'desc',
    criterio: 'fechaDesde',
    ////////////////////
    tipoSubir: 0,
    archivoTemp: null,
    newComentario: ''
}

export const fetchAnuncios = createAsyncThunk(
    'usuarios/fetchAnuncios',
    async (idCondominio: string, { rejectWithValue }) => {
        return new Promise((resolve, reject) => {
            ObtenerListadoAnuncioLogic((error: any, err: any, data: any) => {
                if (data) {
                    let newData = data;
                    newData.anuncios.map((a: any) => {
                        a.esVideo = /\.(mp4|webm|ogg|mov|avi|mkv)/i.test(a.amedida)
                    })
                    resolve(newData);
                }
                else rejectWithValue(err);
            }, idCondominio);
        });
    }
);
export const fetchLike = createAsyncThunk(
    'usuarios/fetchLike',
    async ({ id, idUsuario, nombreUsuario }: { id: any, idUsuario: any, nombreUsuario: any }, { rejectWithValue }) => {
        return new Promise((resolve, reject) => {
            DarQuitarLikeLogic((error: any, err: any, data: any) => {
                if (data) resolve(data);
                else rejectWithValue(err);
            }, id, idUsuario, nombreUsuario);
        });
    }
);
export const fetchAnuncioPorId = createAsyncThunk(
    'usuarios/fetchAnuncioPorId',
    async (id: any, { rejectWithValue }) => {
        return new Promise((resolve, reject) => {
            ObtenerAnuncioPorIdLogic((error: any, err: any, data: any) => {
                if (data) {
                    let newData = data;
                    newData.esVideo = /\.(mp4|webm|ogg|mov|avi|mkv)/i.test(newData.amedida)
                    console.log(newData);
                    resolve(newData);
                }
                else rejectWithValue(err);
            }, id);
        });
    }
);
export const fetchAnuncioEliminar = createAsyncThunk(
    'usuarios/fetchAnuncioEliminar',
    async (id: any, { rejectWithValue }) => {
        return new Promise((resolve, reject) => {
            EliminarAnuncioLogic((error: any, err: any, data: any) => {
                if (data) resolve(data);
                else rejectWithValue(err);
            }, id);
        });
    }
);

export const fetchAnuncioCrear = createAsyncThunk(
    'usuarios/fetchAnuncioCrear',
    async (anuncio: any, { rejectWithValue }) => {
        return new Promise((resolve, reject) => {
            CrearAnuncioLogic((error: any, err: any, data: any) => {
                if (data) resolve(data);
                else rejectWithValue(err);
            }, anuncio);
        });
    }
);
export const fetchComentarioCrear = createAsyncThunk(
    'usuarios/fetchComentarioCrear',
    async ({ comentario, idCondominio, eliminar }: { comentario: any, idCondominio: any, eliminar: any }, { rejectWithValue }) => {
        return new Promise((resolve, reject) => {
            CrearComentarioAnuncioLogic((error: any, err: any, data: any) => {
                if (data) resolve(data);
                else rejectWithValue(err);
            }, comentario, idCondominio, eliminar);
        });
    }
);

const anuncioSlice = createSlice({
    name: 'anuncio',
    initialState,
    reducers: {
        setAnuncioEditar(state: any, action) {
            state.anuncioCrear = action.payload;
            state.tipoSubir = 0;
            state.editar = true;
        },
        setImgSelect(state: any, action) {
            const { img, mostrar } = action.payload;
            state.imgSelect = img;
            state.modalOpenImg = mostrar;
        },
        setAlignment(state: any, action) {
            state.alignment = action.payload;
        },
        setBuscarEnMenu(state: any, action) {
            state.buscarenmenu = action.payload;
        },
        setActiveFilter(state: any, action) {
            state.activeFilter = action.payload;
        },
        setDataFullParse(state: any, action) {
            state.dataFullParse = action.payload;
        },
        setBuscarDataFull(state: any, action) {
            state.buscarDataFull = action.payload;
        },
        setOrden(state: any, action) {
            state.orden = action.payload;
        },
        setCriterio(state: any, action) {
            state.criterio = action.payload;
        },
        setLimpiarAnuncioCrear(state: any) {
            state.anuncioCrear = {
                id: 0, idCondominio: ""/* localStorage.getItem("idCondominio")!.toString() */, cabecera: "", descripcion: "", organizador: "",
                telefono: "", amedida: "", fechaDesde: "", fechaHasta: "", idTipo: 1, idUsuario: 0, activo: true, esVideo: false,
            }
            state.crear = false;
            state.editar = false;
        },
        setAnuncioCrear(state: any, action) {
            const { name, value } = action.payload;
            state.anuncioCrear[name] = value;
        },
        setArchivoTemp(state: any, action) {
            state.archivoTemp = action.payload;
        },
        setTipoSubir(state: any, action) {
            state.tipoSubir = action.payload;
        },
        setNewComentario(state: any, action) {
            state.newComentario = action.payload;
        },
        setDataDetalle(state: any, action) {
            state.dataDetalle = action.payload;
        },
        setChangeTipo(state: any, action) {
            state.dataFullParse = state.dataFull.filter((u: Anuncio) => u.idTipo === action.payload || action.payload === 4);
        },
        setNuevoComentario(state: any, action) {
            state.dataDetalle.comentarios.push(action.payload);
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchAnuncios.pending, state => {
                state.loading = true;
            })
            .addCase(fetchAnuncios.fulfilled, (state, action: any) => {
                state.loading = false;
                action.payload.anuncios.forEach((element: Anuncio) => {
                    element.cantLikes = element.likes.length;
                });
                state.dataFullParse = action.payload.anuncios;
                state.dataFull = action.payload.anuncios;
            })
            .addCase(fetchAnuncios.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
                state.dataFullParse = [];
                state.dataFull = [];
            })
            .addCase(fetchLike.pending, state => {
                state.loading = true;
            })
            .addCase(fetchLike.fulfilled, (state, action: any) => {
                state.loading = false;
                action.payload.anuncios.forEach((element: Anuncio) => {
                    element.cantLikes = element.likes.length;
                });
                state.dataFullParse = action.payload.anuncios;
                state.dataFull = action.payload.anuncios;
            })
            .addCase(fetchLike.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchAnuncioPorId.pending, state => {
                state.loading = true;
                state.verDetalle = false;
            })
            .addCase(fetchAnuncioPorId.fulfilled, (state, action: any) => {
                state.loading = false;
                state.dataDetalle = action.payload;
                state.verDetalle = true;
            })
            .addCase(fetchAnuncioPorId.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
                state.dataDetalle = {}
                state.verDetalle = false;
            })
            .addCase(fetchAnuncioEliminar.pending, state => {
                state.loading = true;
            })
            .addCase(fetchAnuncioEliminar.fulfilled, (state, action: any) => {
                state.loading = false;
                action.payload.anuncios.forEach((element: Anuncio) => {
                    element.cantLikes = element.likes.length;
                });
                state.dataFullParse = action.payload.anuncios;
                state.dataFull = action.payload.anuncios;
            })
            .addCase(fetchAnuncioEliminar.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchAnuncioCrear.pending, state => {
                state.loading = true;
            })
            .addCase(fetchAnuncioCrear.fulfilled, (state, action: any) => {
                state.loading = false;
                state.crear = false;
                state.editar = false;
                action.payload.anuncios.forEach((element: Anuncio) => {
                    element.cantLikes = element.likes.length;
                });
                state.dataFullParse = action.payload.anuncios;
                state.dataFull = action.payload.anuncios;
            })
            .addCase(fetchAnuncioCrear.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchComentarioCrear.pending, state => {
                state.loading = true;
            })
            .addCase(fetchComentarioCrear.fulfilled, (state, action: any) => {
                state.loading = false;
                state.newComentario = "";
            })
            .addCase(fetchComentarioCrear.rejected, (state: any, action) => {
                state.loading = false;
                state.error = action.payload;
            })


    },
});

export const {
    setAnuncioEditar,
    setImgSelect,
    setAlignment,
    setBuscarEnMenu,
    setActiveFilter,
    setDataFullParse,
    setBuscarDataFull,
    setOrden,
    setCriterio,
    setLimpiarAnuncioCrear,
    setAnuncioCrear,
    setArchivoTemp,
    setTipoSubir,
    setNewComentario,
    setDataDetalle,
    setChangeTipo,
    setNuevoComentario
} = anuncioSlice.actions;
export default anuncioSlice.reducer;
