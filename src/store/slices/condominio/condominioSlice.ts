import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';

// Configuración Firebase (copiar la tuya)
const firebaseConfig = {
  apiKey: "AIzaSyAGLBDs0MOUKRBrVxIp0ai7aygveSRHKkA",
  authDomain: "conexionresidencialapp.firebaseapp.com",
  projectId: "conexionresidencialapp",
  storageBucket: "conexionresidencialapp.firebasestorage.app",
  messagingSenderId: "1047153246562",
  appId: "1:1047153246562:web:233d121eafee71fb95ec3b",
  measurementId: "G-54LZY2M3BN"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// Async thunk para obtener archivos comunidad
export const fetchArchivosComunidad = createAsyncThunk(
  'condominio/fetchArchivosComunidad',
  async (idCondominio) => {
    const folderRef = ref(storage, `comunidad-${idCondominio}/`);
    try {
      const res = await listAll(folderRef);
      const archivos = await Promise.all(
        res.items.map(async (itemRef) => {
          const url = await getDownloadURL(itemRef);
          const esVideo = /\.(mp4|webm|ogg|mov|avi|mkv)(\?|&|$)/i.test(itemRef.fullPath);
          return { nombre: itemRef.name, url, esVideo };
        })
      );
      return archivos;
    } catch (error) {
      console.error("Error al listar archivos:", error);
      return [];
    }
  }
);

const initialState = {
  buscarDataFull: "",
  imagenPerfil: "",
  agregarUsuario: false,
  loading: false,
  editarTextRich: false,
  actualizarData: false,
  newTextRich: "",
  textRichEditado: false,
  verDetalleAvisos: false,
  tipoSubir: 0,
  dataCondominios: [],
  dataArchivosComunidad: [],
  enComunidad: false,
  dataFull: {
    anuncios: [],
    nombre: "",
    logo: "",
    normas: '',
    avisosHoy: false,
    esVideo: false
  },
  misAnuncios: [],
  actualizarMisAnuncios: false,
  tipo: 4,
  cupoUsuarios: { usados: 0, cupo: 0 },
  usuario: {
    usuario: '',
    nombre: "",
    tieneSuscripcionMensajes: false,
    tieneSuscripcionVotaciones: false,
    tieneSuscripcionAnuncios: false,
    tieneSuscripcionAvisos: false,
    rol: "",
    id: 0
  },
  listadousuarios: [],
  dataUserSelect: null,
  verUsuarioInd: false,
  usuarioDetalle: null,
  activeFilter: "fechaDesde",
  buscarenmenu: false,
  arrayImgUsers: [],
  loguear: {
    usuario: "",
    clave: "",
    idCondominio: localStorage.getItem("idCondominio") ?? ""
  },
  sinNotificaciones: false,
  alerta: { tipo: 1, mensaje: "" },
  alertaCerrada: false,
  iniciarSesion: false,
  crear: false,
  editar: false,
  votaciones: false,
  encuesta: false,
  menuOpciones: false,
  dataVotaciones: [],
  dataDetalle: null,
  verDetalle: false,
  nombreComunidad: "",
  anuncio: {
    id: 0,
    idCondominio: localStorage.getItem("idCondominio"),
    cabecera: "",
    descripcion: "",
    organizador: "",
    telefono: "",
    amedida: "",
    fechaDesde: new Date(),
    fechaHasta: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    idTipo: 1,
    idUsuario: 0,
    activo: true,
    esVideo: false
  },
  active: 'calendario',
  menuAnterior: 'calendario',
  newComentario: '',
  verPerfil: false,
  verUsuarios: false,
  diaMesSelect: { dia: 0, mes: 0, anio: 0 },
  verReglasNormas: false,
  editarPerfil: false,
  verAvisos: false,
  editarAvisos: false,
  verEmergencia: false,
  editarEmergencia: false,
  verMisAnuncios: false,
  verPuntosInteres: false,
  days: [],
  monthTitle: '',
  avisos: [],
  año: new Date().getFullYear(),
  mes: new Date().getMonth(),
  mensajeAviso: '',
  fechaAviso: '',
  horaAviso: new Date().toLocaleTimeString(),
  idAviso: 0,
  emergenciaDetalle: [],
  usuarioComunidad: false,
  emergencia: {
    id: 0,
    descripcion: '',
    telefono: '',
    idcondominio: 0,
    direccion: ''
  },
  newUser: {
    id: 0,
    usuario: '',
    nombre: '',
    clave: '',
    rol: '',
    idCondominio: 0
  },
  verEspacioComun: false,
  serviceWorker: {},
  estadoServiceWorker: 'aun nada',
  alignment: "Todo",
  orden: 'desc',
  criterio: 'fechaDesde',
};

const condominioSlice = createSlice({
  name: 'condominio',
  initialState,
  reducers: {
    setBuscarDataFull(state, action) {
      state.buscarDataFull = action.payload;
    },
    setImagenPerfil(state, action) {
      state.imagenPerfil = action.payload;
    },
    setAgregarUsuario(state, action) {
      state.agregarUsuario = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setEditarTextRich(state, action) {
      state.editarTextRich = action.payload;
    },
    setActualizarData(state, action) {
      state.actualizarData = action.payload;
    },
    setNewTextRich(state, action) {
      state.newTextRich = action.payload;
    },
    setTextRichEditado(state, action) {
      state.textRichEditado = action.payload;
    },
    setVerDetalleAvisos(state, action) {
      state.verDetalleAvisos = action.payload;
    },
    setTipoSubir(state, action) {
      state.tipoSubir = action.payload;
    },
    setDataCondominios(state, action) {
      state.dataCondominios = action.payload;
    },
    setDataArchivosComunidad(state, action) {
      state.dataArchivosComunidad = action.payload;
    },
    setEnComunidad(state, action) {
      state.enComunidad = action.payload;
    },
    setDataFull(state, action) {
      state.dataFull = action.payload;
    },
    setMisAnuncios(state, action) {
      state.misAnuncios = action.payload;
    },
    setActualizarMisAnuncios(state, action) {
      state.actualizarMisAnuncios = action.payload;
    },
    setTipo(state, action) {
      state.tipo = action.payload;
    },
    setCupoUsuarios(state, action) {
      state.cupoUsuarios = action.payload;
    },
    setUsuario(state, action) {
      state.usuario = action.payload;
    },
    setListadousuarios(state, action) {
      state.listadousuarios = action.payload;
    },
    setDataUserSelect(state, action) {
      state.dataUserSelect = action.payload;
    },
    setVerUsuarioInd(state, action) {
      state.verUsuarioInd = action.payload;
    },
    setUsuarioDetalle(state, action) {
      state.usuarioDetalle = action.payload;
    },
    setActiveFilter(state, action) {
      state.activeFilter = action.payload;
    },
    setBuscarenmenu(state, action) {
      state.buscarenmenu = action.payload;
    },
    setArrayImgUsers(state, action) {
      state.arrayImgUsers = action.payload;
    },
    setLoguear(state, action) {
      state.loguear = action.payload;
    },
    setSinNotificaciones(state, action) {
      state.sinNotificaciones = action.payload;
    },
    setAlerta(state, action) {
      state.alerta = action.payload;
    },
    setAlertaCerrada(state, action) {
      state.alertaCerrada = action.payload;
    },
    setIniciarSesion(state, action) {
      state.iniciarSesion = action.payload;
    },
    setCrear(state, action) {
      state.crear = action.payload;
    },
    setEditar(state, action) {
      state.editar = action.payload;
    },
    setVotaciones(state, action) {
      state.votaciones = action.payload;
    },
    setEncuesta(state, action) {
      state.encuesta = action.payload;
    },
    setMenuOpciones(state, action) {
      state.menuOpciones = action.payload;
    },
    setDataVotaciones(state, action) {
      state.dataVotaciones = action.payload;
    },
    setDataDetalle(state, action) {
      state.dataDetalle = action.payload;
    },
    setVerDetalle(state, action) {
      state.verDetalle = action.payload;
    },
    setNombreComunidad(state, action) {
      state.nombreComunidad = action.payload;
    },
    setAnuncio(state, action) {
      state.anuncio = action.payload;
    },
    setActive(state, action) {
      state.active = action.payload;
    },
    setMenuAnterior(state, action) {
      state.menuAnterior = action.payload;
    },
    setNewComentario(state, action) {
      state.newComentario = action.payload;
    },
    setVerPerfil(state, action) {
      state.verPerfil = action.payload;
    },
    setVerUsuarios(state, action) {
      state.verUsuarios = action.payload;
    },
    setDiaMesSelect(state, action) {
      state.diaMesSelect = action.payload;
    },
    setVerReglasNormas(state, action) {
      state.verReglasNormas = action.payload;
    },
    setEditarPerfil(state, action) {
      state.editarPerfil = action.payload;
    },
    setVerAvisos(state, action) {
      state.verAvisos = action.payload;
    },
    setEditarAvisos(state, action) {
      state.editarAvisos = action.payload;
    },
    setVerEmergencia(state, action) {
      state.verEmergencia = action.payload;
    },
    setEditarEmergencia(state, action) {
      state.editarEmergencia = action.payload;
    },
    setVerMisAnuncios(state, action) {
      state.verMisAnuncios = action.payload;
    },
    setVerPuntosInteres(state, action) {
      state.verPuntosInteres = action.payload;
    },
    setDays(state, action) {
      state.days = action.payload;
    },
    setMonthTitle(state, action) {
      state.monthTitle = action.payload;
    },
    setAvisos(state, action) {
      state.avisos = action.payload;
    },
    setAño(state, action) {
      state.año = action.payload;
    },
    setMes(state, action) {
      state.mes = action.payload;
    },
    setMensajeAviso(state, action) {
      state.mensajeAviso = action.payload;
    },
    setFechaAviso(state, action) {
      state.fechaAviso = action.payload;
    },
    setHoraAviso(state, action) {
      state.horaAviso = action.payload;
    },
    setIdAviso(state, action) {
      state.idAviso = action.payload;
    },
    setEmergenciaDetalle(state, action) {
      state.emergenciaDetalle = action.payload;
    },
    setUsuarioComunidad(state, action) {
      state.usuarioComunidad = action.payload;
    },
    setEmergencia(state, action) {
      state.emergencia = action.payload;
    },
    setNewUser(state, action) {
      state.newUser = action.payload;
    },
    setVerEspacioComun(state, action) {
      state.verEspacioComun = action.payload;
    },
    setServiceWorker(state, action) {
      state.serviceWorker = action.payload;
    },
    setEstadoServiceWorker(state, action) {
      state.estadoServiceWorker = action.payload;
    },
    setAlignment(state, action) {
      state.alignment = action.payload;
    },
    setOrden(state, action) {
      state.orden = action.payload;
    },
    setCriterio(state, action) {
      state.criterio = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchArchivosComunidad.fulfilled, (state: any, action) => {
      state.dataArchivosComunidad = action.payload;
    });
  }
});

export const {
  setBuscarDataFull,
  setImagenPerfil,
  setAgregarUsuario,
  setLoading,
  setEditarTextRich,
  setActualizarData,
  setNewTextRich,
  setTextRichEditado,
  setVerDetalleAvisos,
  setTipoSubir,
  setDataCondominios,
  setDataArchivosComunidad,
  setEnComunidad,
  setDataFull,
  setMisAnuncios,
  setActualizarMisAnuncios,
  setTipo,
  setCupoUsuarios,
  setUsuario,
  setListadousuarios,
  setDataUserSelect,
  setVerUsuarioInd,
  setUsuarioDetalle,
  setActiveFilter,
  setBuscarenmenu,
  setArrayImgUsers,
  setLoguear,
  setSinNotificaciones,
  setAlerta,
  setAlertaCerrada,
  setIniciarSesion,
  setCrear,
  setEditar,
  setVotaciones,
  setEncuesta,
  setMenuOpciones,
  setDataVotaciones,
  setDataDetalle,
  setVerDetalle,
  setNombreComunidad,
  setAnuncio,
  setActive,
  setMenuAnterior,
  setNewComentario,
  setVerPerfil,
  setVerUsuarios,
  setDiaMesSelect,
  setVerReglasNormas,
  setEditarPerfil,
  setVerAvisos,
  setEditarAvisos,
  setVerEmergencia,
  setEditarEmergencia,
  setVerMisAnuncios,
  setVerPuntosInteres,
  setDays,
  setMonthTitle,
  setAvisos,
  setAño,
  setMes,
  setMensajeAviso,
  setFechaAviso,
  setHoraAviso,
  setIdAviso,
  setEmergenciaDetalle,
  setUsuarioComunidad,
  setEmergencia,
  setNewUser,
  setVerEspacioComun,
  setServiceWorker,
  setEstadoServiceWorker,
  setAlignment,
  setOrden,
  setCriterio
} = condominioSlice.actions;

export default condominioSlice.reducer;
