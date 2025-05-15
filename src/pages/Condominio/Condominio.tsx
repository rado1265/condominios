import React, { useEffect, useState, useRef } from "react";
import Loading from "../../components/utils/loading";
import './Condominio.css';
import { CambiarEstadoVotacionLogic, CambiarNormasLogic, CerrarSesionLogic, CrearAnuncioLogic, CrearAvisosLogic, CrearComentarioAnuncioLogic, CrearEmergenciaLogic, CrearUsuarioLogic, CrearVotacionLogic, DarQuitarLikeLogic, DessuscribirNotificacionesLogic, EditUsuarioPorIdLogic, EliminarAnuncioLogic, EnviarNotifAvisoLogic, LoginLogic, ObteneCondominioLogic, ObtenerAnuncioPorIdLogic, ObtenerAvisosLogic, ObtenerEmergenciasLogic, ObtenerListadoAnuncioLogic, ObtenerMisAnuncioLogic, ObtenerUsuarioPorIdLogic, ObtenerUsuariosLogic, ObtenerVotacionesLogic, SuscribirNotificaciones2Logic, SuscribirNotificacionesLogic, ValidarPersonaLogic, VotarLogic } from "../../presentation/view-model/Anuncio.logic";
import { ConfirmMessage } from "../../components/utils/messages";
import actualizar from './../../components/utils/img/actualizar-flecha.png';
import menuicon from './../../components/utils/img/menuicon.png';
import volver from './../../components/utils/img/volver.png';
import axios from 'axios';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';
import { ToastContainer, toast } from 'react-toastify';
import filtro from './../../components/utils/img/flechas-arriba-y-abajo.png';
import AnunciosPanel from "./anuncios/AnunciosPanel";
import AnunciosCrear from "./anuncios/AnunciosCrear";
import Login from "./login/Login";
import PerfilUsuario from "./usuarios/PerfilUsuario";
import Emergencia from "./emergencias/Emergencia";
import AvisoPanel from "./avisos/AvisoPanel";
import VotacionCrear from "./votacion/VotacionCrear";
import VotacionPanel from "./votacion/VotacionPanel";
import DetalleAnuncioPanel from "./anuncios/DetalleAnuncioPanel";
import ReglasNormasPanel from "./reglas/ReglasNormasPanel";
import BottomNav from './../MenuInferior/MenuInferior';
import AsyncStorage from '@react-native-async-storage/async-storage';
import iconborrar from './../../components/utils/img/iconborrar.png';
import iconeditar from './../../components/utils/img/editar.png';
import HuinchaSuperior from "../HuinchaSuperior/HuinchaSuperior";

interface SafeSearchAnnotation {
    adult: string;
    violence: string;
    sexualContent: string;
    medical: string;
    racy: string;
}

const API_KEY = 'AIzaSyCdexoCXGuhE2--pejbSZgTeiIUBjE_UyM';

const chileTime = new Intl.DateTimeFormat("es-CL", {
    timeZone: "America/Santiago",
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
}).format(new Date());

interface DataFull {
    anuncios: any[];
    nombre: string;
    logo: string;
    normas: string;
    avisosHoy: boolean;
    esVideo: boolean;
}

const Condominio = () => {
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
    const [buscarDataFull, setBuscarDataFull] = useState("");
    const [imagenPerfil, setImagenPerfil] = useState("");
    const [archivoTemp, setArchivoTemp] = useState<File | null>(null);
    const [editImgPerfil, setEditImgPerfil] = useState(false);
    const [agregarUsuario, setAgregarUsuario] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editarTextRich, setEditarTextRich] = useState(false);
    const [actualizarData, setActualizarData] = useState(false);
    const [newTextRich, setNewTextRich] = useState("");
    const [textRichEditado, setTextRichEditado] = useState(false);
    const [verDetalleAvisos, setVerDetalleAvisos] = useState(false);
    const [colorAviso, setColorAviso] = useState("");
    const [tipoSubir, setTipoSubir] = useState(0);
    const [dataCondominios, setDataCondominios] = useState([]);
    const [dataArchivosComunidad, setDataArchivosComunidad] = useState([{ nombre: "test", url: "test" }]);
    const [enComunidad, setEnComunidad] = useState(false);
    const [dataFull, setDataFull] = useState<DataFull>({
        anuncios: [],
        nombre: "",
        logo: "",
        normas: '',
        avisosHoy: false,
        esVideo: false
    });

    const [dataFullParse, setDataFullParse] = useState<DataFull>({
        anuncios: [],
        nombre: "",
        logo: "",
        normas: '',
        avisosHoy: false,
        esVideo: false
    });
    const [misAnuncios, setMisAnuncios] = useState<any[]>([]);
    const [actualizarMisAnuncios, setActualizarMisAnuncios] = useState(false);
    const [tipo, setTipo] = useState(1)
    const [cupoUsuarios, setCupoUsuarios] = useState({ usados: 0, cupo: 0 })
    const [usuario, setUsuario] = useState({
        usuario: '',
        nombre: "",
        tieneSuscripcionMensajes: false,
        tieneSuscripcionVotaciones: false,
        tieneSuscripcionAnuncios: false,
        tieneSuscripcionAvisos: false,
        rol: "",
        id: 0
    });
    const [listadousuarios, setUsuarios] = useState([{ id: 0, usuario: '', clave: '', nombre: "", rol: "", fechaCaducidad: "", activo: false, direccion: "", telefono: "", tieneSuscripcionAnuncios: false, tieneSuscripcionMensajes: false, tieneSuscripcionVotaciones: false, tieneSuscripcionAvisos: false, imagen: "" }]);
    const [listadousuariosParse, setUsuariosParse] = useState([{ id: 0, usuario: '', clave: '', nombre: "", rol: "", fechaCaducidad: "", activo: false, direccion: "", telefono: "", tieneSuscripcionAnuncios: false, tieneSuscripcionMensajes: false, tieneSuscripcionVotaciones: false, tieneSuscripcionAvisos: false, imagen: "" }]);
    const [dataUserSelect, setDataUserSelect] = useState({ id: 0, usuario: '', clave: '', nombre: "", rol: "", fechaCaducidad: "", activo: false, direccion: "", telefono: "", tieneSuscripcionAnuncios: false, tieneSuscripcionMensajes: false, tieneSuscripcionVotaciones: false, tieneSuscripcionAvisos: false, imagen: "" });
    const [verUsuarioInd, setVerUserInd] = useState(false);
    const [usuarioDetalle, setUsuarioDetalle] = useState({
        nombre: "",
        tieneSuscripcionMensajes: false,
        tieneSuscripcionVotaciones: false,
        tieneSuscripcionAnuncios: false,
        tieneSuscripcionAvisos: false,
        rol: "",
        id: 0,
        activo: false,
        direccion: '',
        telefono: '',
        fechaCaducidad: new Date(),
        imagen: '',
        clave: ''
    });
    const [loguear, setLoguear] = useState({
        usuario: "",
        clave: "",
        idCondominio: localStorage.getItem("idCondominio") ?? ""
    });

    const posicionAlertas = "bottom-left";

    /*
        1 - Información / Celeste - Defecto
        2 - Success / Verde
        3 - Peligro / Rojo
        4 - Warning / Amarillo
    */
    const [alerta, setAlerta] = useState({
        tipo: 1,
        mensaje: ""
    });
    const [alertaCerrada, setAlertaCerrada] = useState(false)
    const [iniciarSesion, setIniciarSesion] = useState(false)
    const [crear, setCrear] = useState(false)
    const [editar, setEditar] = useState(false)
    const [votaciones, setVotaciones] = useState(false)
    const [encuesta, setEncuesta] = useState(false)
    const [menuOpciones, setMenuOpciones] = useState(false)
    const [dataVotaciones, setDataVotaciones] = useState([{ cabecera: "", opcionesVotacion: [] }])
    const [dataDetalle, setDataDetalle] = useState({ cabecera: "", descripcion: "", amedida: "", id: "", telefono: "", likes: 0, organizador: "", fechaDesde: new Date(), fechaHasta: new Date(), comentarios: [], esVideo: false })
    const [verDetalle, setVerDetalle] = useState(false)
    const menuRef = useRef(null);
    const [anuncio, setAnuncio] = useState({
        id: 0,
        idCondominio: localStorage.getItem("idCondominio"),
        cabecera: "",
        descripcion: "",
        organizador: "",
        telefono: "",
        amedida: "",
        fechaDesde: new Date(),
        fechaHasta: new Date(),
        idTipo: 1,
        idUsuario: 0,
        activo: true,
        esVideo: false
    });
    const [active, setActive] = useState('calendario');
    const [menuAnterior, setMenuAnterior] = useState('calendario');
    const [newComentario, setNewComentario] = useState('')
    const [verPerfil, setVerPerfil] = useState(false)
    const [verUsuarios, setVerUsuarios] = useState(false)
    const [diaMesSelect, setDiaMesSelect] = useState({ dia: 0, mes: 0, anio: 0 })
    const [verReglasNormas, setVerReglasNormas] = useState(false)
    const [editarPerfil, setEditarPerfil] = useState(false)
    const [verAvisos, setVerAvisos] = useState(false)
    const [editarAvisos, setEditarAvisos] = useState(false)
    const [verEmergencia, setVerEmergencia] = useState(false)
    const [editarEmergencia, setEditarEmergencia] = useState(false)
    const [verMisAnuncios, setVerMisAnuncios] = useState(false)
    const [verPuntosInteres, setVerPuntosInteres] = useState(false)
    const [days, setDays] = useState([]);
    const [monthTitle, setMonthTitle] = useState('');

    const [avisos, setAvisos] = useState([]);

    const [año, setAño] = useState(new Date().getFullYear());
    const [mes, setMes] = useState(new Date().getMonth());

    const [mensajeAviso, setMensajeAviso] = useState('');
    const [fechaAviso, setFechaAviso] = useState('');
    const [horaAviso, setHoraAviso] = useState(new Date().toLocaleTimeString());
    const [idAviso, setIdAviso] = useState(0);
    const [emergenciaDetalle, setEmergenciaDetalle] = useState([]);
    const [emergencia, setEmergencia] = useState({
        id: 0,
        descripcion: '',
        telefono: '',
        idcondominio: 0,
        direccion: ''
    })

    const [newUser, setNewUser] = useState({
        id: 0,
        usuario: '',
        nombre: '',
        clave: '',
        rol: '',
        idCondominio: 0
    })

    const [modalOpenImg, setModalOpenImg] = useState(false);
    const [imgSelect, setImgSelect] = useState("");
    const [serviceWorker, setServiceWorker] = useState({})
    const [estadoServiceWorker, setEstadoServiceWorker] = useState('aun nada')
    const openModalImg = (img: any) => {
        setImgSelect(img);
        setModalOpenImg(true);
    }

    const closeModalImg = () => {
        setModalOpenImg(false);
        setImgSelect("");
    };

    const [orden, setOrden] = useState<'asc' | 'desc'>('desc');
    const [criterio, setCriterio] = useState<'fechaDesde' | 'likes' | 'cantComentarios' | 'cabecera'>('fechaDesde');
    const ordenarListado = (data: any) => {
        return [...data].sort((a, b) => {
            const valorA = a[criterio];
            const valorB = b[criterio];

            if (criterio === 'cabecera') {
                return orden === 'asc'
                    ? valorA.localeCompare(valorB)
                    : valorB.localeCompare(valorA);
            }

            if (criterio === 'fechaDesde') {
                return orden === 'asc'
                    ? new Date(valorA).getTime() - new Date(valorB).getTime()
                    : new Date(valorB).getTime() - new Date(valorA).getTime();
            }

            return orden === 'asc' ? valorA - valorB : valorB - valorA;
        });
    };

    const limpiarAnuncio = () => {
        setAnuncio({
            id: 0,
            idCondominio: localStorage.getItem("idCondominio"),
            cabecera: "",
            descripcion: "",
            organizador: usuario.nombre,
            telefono: "",
            amedida: "",
            fechaDesde: new Date(),
            fechaHasta: new Date(),
            idTipo: 1,
            idUsuario: usuario.id,
            activo: true,
            esVideo: false
        })
        setVerDetalle(false);
    }

    const imgError = "https://media1.tenor.com/m/Ord0OyTim_wAAAAC/loading-windows11.gif";

    const handleImage = (files: any) => {
        if (files.target.files.length === 0) return;
        const file = files.target.files[0];

        setArchivoTemp(files.target.files[0]);

        document.getElementById('containerViewImg')?.classList.remove("d-none");

        const img = document.getElementById('visualizadorImg') as HTMLImageElement | null;
        if (img) {
            img.src = URL.createObjectURL(files.target.files[0]);
        }

        const reader = new FileReader();

        reader.onloadend = async () => {
            if (!reader.result || typeof reader.result !== 'string') {
                return;
            }

            const base64 = reader.result.split(',')[1];

            const body = {
                requests: [
                    {
                        image: { content: base64 },
                        features: [{ type: 'SAFE_SEARCH_DETECTION' }],
                    },
                ],
            };

            try {
                const response = await axios.post(
                    `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`,
                    body
                );
                const safeSearch = response.data.responses[0].safeSearchAnnotation;
                console.log(response.data.responses[0]);
                if (safeSearch.adult === "VERY_LIKELY" || safeSearch.adult === 'LIKELY') {
                    toast.error('La imagen contiene posiblemente contenido para adultos. Se enviará a su revisión', {
                        position: posicionAlertas,
                    });
                }
            } catch (err) {

            } finally {

            }
        };

        reader.readAsDataURL(file);
    };

    const obtenerArchivosComunidad = async (idCondominio: string) => {
        const folderRef = ref(storage, `comunidad-${idCondominio}/`);
        try {
            const res = await listAll(folderRef);
            const arrayArchivos = await Promise.all(
                res.items.map(async (itemRef) => {
                    const nombreArchivo = itemRef.name;
                    const url = await getDownloadURL(itemRef);
                    const esVideo = /\.(mp4|webm|ogg|mov|avi|mkv)$/i.test(itemRef.fullPath)
                    return { nombre: nombreArchivo, url: url, esVideo: esVideo };
                })
            );
            return arrayArchivos;
        } catch (error) {
            console.error("Error al listar archivos:", error);
            return [];
        }
    };

    const obtenerArchivosPerfil = async () => {
        const folderRef = ref(storage, `perfiles/`);
        try {
            const res = await listAll(folderRef);
            const arrayArchivos = await Promise.all(
                res.items.map(async (itemRef) => {
                    const nombreArchivo = itemRef.name;
                    const url = await getDownloadURL(itemRef);
                    return { nombre: nombreArchivo, url: url };
                })
            );
            return arrayArchivos;
        } catch (error) {
            console.error("Error al listar archivos:", error);
            return [];
        }
    };

    useEffect(() => {
        const cargarDatos = async () => {
            if (!actualizarData) return;

            const idCondominio = localStorage.getItem("idCondominio");
            if (!idCondominio) return;

            const archivos = await obtenerArchivosComunidad(idCondominio);

            setDataArchivosComunidad(archivos);

            const newDataFull = {
                ...dataFull,
                anuncios: dataFull.anuncios.map((a: any) => {
                    const nombreBuscado = a.amedida || "";
                    const matchArchivo = archivos.find((b: any) => b.nombre === nombreBuscado);
                    let esVideodesdeURL = false;
                    if (!matchArchivo) {
                        esVideodesdeURL = /\.(mp4|webm|ogg|mov|avi|mkv)$/i.test(a.amedida)
                    }
                    return {
                        ...a,
                        amedida: matchArchivo ? matchArchivo.url : a.amedida,
                        esVideo: matchArchivo ? matchArchivo.esVideo : esVideodesdeURL
                    };
                }),
            };

            if (JSON.stringify(newDataFull) !== JSON.stringify(dataFull)) {
                setDataFull(newDataFull);
                setDataFullParse(newDataFull as any);
                setBuscarDataFull("");
            }

            setActualizarData(false);
        };

        cargarDatos();
    }, [actualizarData]);

    useEffect(() => {
        if (navigator.onLine) {
            if (!iniciarSesion)
                ValidarPersonaLogic(selLogin)
            /* if ((localStorage.getItem("usuario") && localStorage.getItem("usuario") != 'undefined') &&
                (localStorage.getItem("rolUsuario") && localStorage.getItem("rolUsuario") != 'undefined') &&
                (localStorage.getItem("clave") && localStorage.getItem("clave") != 'undefined') &&
                (localStorage.getItem("idUsuario") && localStorage.getItem("idUsuario") != 'undefined')) {

                LoginLogic(selLogin, {
                    usuario: localStorage.getItem("usuario"),
                    clave: localStorage.getItem("clave"),
                    idCondominio: 0
                })
            }
            else {
                cerrarSesion()
            } */
        } else {
            obtenerUltimoRegistro()
            setUsuario({
                usuario: localStorage.getItem("usuario") ?? "",
                nombre: localStorage.getItem("nombreUsuario") ?? "",
                tieneSuscripcionMensajes: false,
                tieneSuscripcionVotaciones: false,
                tieneSuscripcionAnuncios: false,
                tieneSuscripcionAvisos: false,
                rol: localStorage.getItem("rolUsuario") ?? "",
                id: parseInt(localStorage.getItem("idUsuario") ?? "")
            })
            setTipo(1)
            setIniciarSesion(false)
            setEnComunidad(true)
            setLoading(false)
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    ///////////////////////////////////////////////////////////////////
    function urlBase64ToUint8Array(base64String: string) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    function isIos() {
        return /iphone|ipad|ipod/i.test(navigator.userAgent);
    }

    function isAndroid() {
        return /android/i.test(navigator.userAgent);
    }

    function isStandalone() {
        return window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
    }

    function supportsPushNotifications() {
        const isSecure = window.isSecureContext;
        const hasServiceWorker = 'serviceWorker' in navigator;
        const hasPushManager = 'PushManager' in window;

        // En iOS, solo las PWAs instaladas permiten notificaciones
        if (isIos() && isAndroid()) {
            return false;
        }

        return isSecure && hasServiceWorker && hasPushManager;
    }
    async function Perfil() {

        var result: any = await solicitarPermisoNotificaciones()
        if (result) {
            setLoading(true)
            ObtenerUsuarioPorIdLogic(selObtenerUsuarioPorId, usuario.id.toString(), localStorage.getItem("idCondominio")!.toString(), result);
        }
    }
    async function registerPush() {
        if (!supportsPushNotifications()) {
            return;
        }

        try {
            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
                /* alert('Debes permitir notificaciones para activarlas.'); */
                return;
            }

            const registration = await navigator.serviceWorker.register('/service-worker.js');
            const ready = await navigator.serviceWorker.ready;

            let subscription = await ready.pushManager.getSubscription();
            if (!subscription) {
                subscription = await ready.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array("BDhWFTbhmhdKANFtk6FZsIE4gQE1eHAiCPvwXsE8UGCKa-U-vVh3cTzOCFtNy01QBc08mP8GcUeCLybWsD-5No0"),
                });
            }
            setServiceWorker(subscription)


        } catch (err) {
        }
    }

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js').catch(console.error);
        });
    }

    const cerrarSesion = () => {
        CerrarSesionLogic(selCerrarSesion);

    }
    const selCerrarSesion = (error: Boolean, err: string, data: any) => {
        localStorage.clear();

        setDataCondominios([]);
        setUsuario({
            usuario: '',
            nombre: "",
            tieneSuscripcionMensajes: false,
            tieneSuscripcionVotaciones: false,
            tieneSuscripcionAnuncios: false,
            tieneSuscripcionAvisos: false,
            rol: "",
            id: 0
        });

        setIniciarSesion(true);
        setEnComunidad(false);
    }

    const EliminarAnuncio = (a: any) => {
        try {
            handleConfirmMessage(a)
        } catch (er) {
        }
    }
    const handleConfirmMessage = async (a: any) => {
        const msg: any = await ConfirmMessage(`Eliminar anuncio`, `¿Esta seguro de querer eliminar el anuncio?`);
        if (msg) {
            setLoading(true);
            EliminarAnuncioLogic(selEliminarAnuncio, a)
        }
    }
    const selEliminarAnuncio = (error: Boolean, err: string, data: any) => {
        try {
            if (data) {
                toast.success('Anuncio eliminado correctamente', {
                    position: posicionAlertas,
                });
            }
            else {
                toast.error('Error al eliminar anuncio", "Favor intentarlo nuevamente en unos minutos', {
                    position: posicionAlertas,
                });
            }
            if (verMisAnuncios) {
                ObtenerMisAnuncioLogic(selMisAnuncios, usuario.id.toString())
            } else {
                setDataFull(data);
                setActualizarData(true);
                setLoading(false);
            }
        } catch (er) {
            //ErrorMessage("Credenciales incorrectas", "")
            toast.error('Error al eliminar anuncio", "Favor intentarlo nuevamente en unos minutos', {
                position: posicionAlertas,
            });
        }
    }

    const uploadVideo = (files: any) => {
        const file = files[0];
        setArchivoTemp(file);

        if (!file) return;

        /*setAnuncio(prev => ({
            ...prev,
            // eslint-disable-next-line
            ["amedida"]: 'video-' + file.name
        }));*/

        document.getElementById('containerViewVideo')?.classList.remove("d-none");

        const videoPreview = document.getElementById('visualizadorVideo') as HTMLVideoElement;
        if (videoPreview) {
            const videoURL = URL.createObjectURL(file);
            videoPreview.src = videoURL;
            videoPreview.load();
        }
    };

    const normalizarLogin = (data: any) => {
        return {
            usuario: data.usuario ?? "",
            clave: data.clave ?? "",
            idCondominio: 0
        };
    };

    const login = () => {
        try {
            setLoading(true);
            LoginLogic(selLogin, normalizarLogin(loguear))
        } catch (er) {
        }
    }

    const selLogin = (error: Boolean, err: string, data: any) => {
        try {
            setLoading(false);
            if (data.nombre && data.nombre != null && data.nombre != "") {
                if (localStorage.getItem("idCondominio")) {
                    const cargarDatos = async () => {
                        const archivos = await obtenerArchivosComunidad(localStorage.getItem("idCondominio")!);
                        setDataArchivosComunidad(archivos);
                    }
                    cargarDatos();
                }
                registerPush();
                setUsuario(data);
                setTipo(1)
                setIniciarSesion(false)
                if (data.imagen && !data.imagen.includes("http")) {
                    const imageRef = ref(storage, `perfiles/${data.imagen}`);

                    getDownloadURL(imageRef)
                        .then((url) => {
                            setImagenPerfil(url)
                        })
                        .catch((err) => {
                            console.error(err);
                        });

                } else if (data.imagen.includes("http")) {
                    setImagenPerfil(data.imagen);
                } else {
                    setImagenPerfil("");
                }
                setDataCondominios(data.condominios);
                //guardarUltimoRegistro(data.condominios, 'condominios')

                if (localStorage.getItem("idCondominio")) {
                    let condSelect = data.condominios.filter((a: any) => a.id.toString() === localStorage.getItem("idCondominio")!.toString());
                    if (new Date(condSelect[0].fechaCaducidad) < new Date()) {
                        cerrarSesion();
                    } else {
                        setLoading(true);
                        alert("tiene idCondominio " + localStorage.getItem("idCondominio")!.toString())
                        setEnComunidad(true); ObtenerListadoAnuncioLogic(selListadoAnuncios, localStorage.getItem("idCondominio")!.toString())
                    }
                } else {
                    if (data.condominios.length === 1 && new Date(data.condominios[0].fechaCaducidad) > new Date()) {
                        setEnComunidad(true);
                        setLoading(true);
                        alert("tiene 1 Condominio " + data.condominios[0].id + localStorage.getItem("idCondominio")!.toString())
                        ObtenerListadoAnuncioLogic(selListadoAnuncios, data.condominios[0].id); localStorage.setItem("idCondominio", data.condominios[0].id)
                    } else if (data.condominios.length === 1 && new Date(data.condominios[0].fechaCaducidad) < new Date()) {
                        cerrarSesion();
                        alert("no tiene Condominio ")
                        //ErrorMessage("Su usuario no tiene comunidades activas", "")
                        toast.info('Su usuario no tiene comunidades activas', {
                            position: posicionAlertas,
                        });
                    }
                }
            }
            else {
                toast.info('Credenciales incorrectas', {
                    position: posicionAlertas,
                });

                localStorage.clear();
                setLoguear({
                    usuario: "",
                    clave: "",
                    idCondominio: "0"
                })
                cerrarSesion()
            }

        } catch (er) {
            //ErrorMessage("Credenciales incorrectas", "")
            toast.info('Credenciales incorrectas', {
                position: posicionAlertas,
            });

            localStorage.clear();
        }
    }

    const normalizarAnuncio = (data: any) => {
        return {
            id: data.id ?? 0,
            idCondominio: localStorage.getItem("idCondominio"),
            cabecera: data.cabecera ?? "",
            descripcion: data.descripcion ?? "",
            organizador: usuario.nombre,
            telefono: data.telefono ?? "",
            amedida: data.amedida ?? "",
            fechaDesde: data.fechaDesde ?? new Date(),
            fechaHasta: data.fechaHasta ?? new Date(),
            idTipo: data.idTipo ?? 1,
            idUsuario: data.idUsuario === 0 ? usuario.id : data.idUsuario,
            activo: data.activo ?? true
        };
    };
    const normalizarDeshabilitarAnuncio = (data: any) => {
        return {
            id: data.id ?? 0,
            idCondominio: localStorage.getItem("idCondominio"),
            cabecera: data.cabecera ?? "",
            descripcion: data.descripcion ?? "",
            organizador: usuario.nombre,
            telefono: data.telefono ?? "",
            amedida: data.amedida ?? "",
            fechaDesde: data.fechaDesde ?? new Date(),
            fechaHasta: data.fechaHasta ?? new Date(),
            idTipo: data.idTipo ?? 1,
            idUsuario: data.idUsuario === 0 ? usuario.id : data.idUsuario,
            activo: !data.activo
        };
    };
    const normalizarEmergencia = (data: any) => {
        return {
            id: data.id,
            descripcion: data.descripcion,
            telefono: data.telefono,
            idcondominio: localStorage.getItem("idCondominio"),
            direccion: data.direccion
        };
    };

    const CrearAnuncio = (form: any) => {
        guardarArchivo();
        let anuncioParse = form;
        if (archivoTemp) {
            anuncioParse.amedida = archivoTemp.name
        }
        try {

            if (anuncioParse.cabecera.length > 0) {
                setLoading(true);
                CrearAnuncioLogic(selCrearAnuncio, normalizarAnuncio(anuncioParse))
            }
        } catch (er) {
        }
    }
    const DeshabilitarAnuncio = (e: any) => {
        try {
            setLoading(true);
            CrearAnuncioLogic(selDeshabilitarAnuncio, normalizarDeshabilitarAnuncio(e))
        } catch (er) {
        }
    }
    const EliminarAviso = (a: any, b: any, c: any) => {
        try {
            let fecha: Date = new Date(b)
            var aviso: any = {
                id: a,
                fecha: b,
                mensaje: c,
                idUsuario: usuario.id,
                idCondominio: localStorage.getItem("idCondominio")!.toString()
            }
            CrearAvisosLogic(selCrearAvisos, aviso, true)
        } catch (er) {
        }
    }
    const CrearAviso = () => {
        try {
            let newFecha = fechaAviso;

            var aviso: any = {
                id: idAviso,
                fecha: newFecha,//fecha: fecha.getFullYear() + "-" + ((fecha.getMonth() + 1).toString().length === 1 ? "0" + (fecha.getMonth() + 1) : fecha.getMonth() + 1) + "-" + ((fecha.getDate()).toString().length === 1 ? "0" + (fecha.getDate()) : fecha.getDate()) + "T" + horaAviso,
                mensaje: mensajeAviso,
                idUsuario: usuario.id,
                color: colorAviso,
                idCondominio: localStorage.getItem("idCondominio")!.toString()
            }

            CrearAvisosLogic(selCrearAvisos, aviso, false)
        } catch (er) {
        }
    }
    const EnviarNotifAviso = (a: any) => {
        try {
            var aviso: any = {
                mensaje: a,
                idCondominio: localStorage.getItem("idCondominio")!.toString(),
                usuario: usuario.nombre
            }
            EnviarNotifAvisoLogic(selEnviarNotifAviso, aviso)
        } catch (er) {
        }
    }
    const selEnviarNotifAviso = (error: Boolean, err: string, data: any) => {
        try {
            if (data) {
                //SuccessMessage("Aviso enviado correctamente.")
                toast.success('Aviso enviado correctamente.', {
                    position: posicionAlertas,
                });
            }
            else {
                //ErrorMessage("Ha ocurrido un error", "Ha ocurrido un error al intentar Crear Anuncio. Comuníquese con el Administrador.")
                toast.info('Error al intentar Crear Anuncio. Comuníquese con el Administrador.', {
                    position: posicionAlertas,
                });
            }
        } catch (er) {
            //ErrorMessage("Ha ocurrido un error", "Ha ocurrido un error al intentar Crear Anuncio. Comuníquese con el Administrador.")
            toast.info('Error al intentar Crear Anuncio. Comuníquese con el Administrador.', {
                position: posicionAlertas,
            });
        }
    }
    const selCrearAvisos = (error: Boolean, err: string, data: any) => {
        try {
            if (data) {
                setAvisos(data);
                setLoading(false);
                setVerAvisos(true);
                setEditarAvisos(false);
                setMensajeAviso('');
                setFechaAviso('');
                setColorAviso("");
                setHoraAviso(new Date().toLocaleTimeString());
                setIdAviso(0);
                toast.success('Aviso creado correctamente', {
                    position: posicionAlertas,
                });
            }
            else {
                //ErrorMessage("Ha ocurrido un error", "Ha ocurrido un error al intentar Crear Anuncio. Comuníquese con el Administrador.")
                toast.info('Error al intentar Crear Aviso. Comuníquese con el Administrador.', {
                    position: posicionAlertas,
                });
            }
        } catch (er) {
            //ErrorMessage("Ha ocurrido un error", "Ha ocurrido un error al intentar Crear Anuncio. Comuníquese con el Administrador.")
            toast.info('Error al intentar Crear Aviso. Comuníquese con el Administrador.', {
                position: posicionAlertas,
            });
        }
    }
    const selCrearAnuncio = (error: Boolean, err: string, data: any) => {
        try {
            if (data) {
                /* ObtenerListadoAnuncioLogic(selListadoAnuncios, localStorage.getItem("idCondominio")!.toString()); */
                setTipo(1);
                setCrear(false);
                setEditar(false);
                limpiarAnuncio();
                setArchivoTemp(null);
                toast.success('Anuncio creado correctamente', {
                    position: posicionAlertas,
                });
            }
            else {
                //ErrorMessage("Ha ocurrido un error", "Ha ocurrido un error al intentar Crear Anuncio. Comuníquese con el Administrador.")
                toast.info('Error al intentar Crear Anuncio. Comuníquese con el Administrador.', {
                    position: posicionAlertas,
                });
            }
            setDataFull(data);
            setActualizarData(true);
            setLoading(false);
        } catch (er) {
            //ErrorMessage("Ha ocurrido un error", "Ha ocurrido un error al intentar Crear Anuncio. Comuníquese con el Administrador.")
            toast.info('Error al intentar Crear Anuncio. Comuníquese con el Administrador.', {
                position: posicionAlertas,
            });
        }
    }
    const selDeshabilitarAnuncio = (error: Boolean, err: string, data: any) => {
        try {
            if (data) {
                /* setLoading(true); */
                /* if (tipo === 8) {
                    ObtenerMisAnuncioLogic(selMisAnuncios, usuario.id.toString());
                } else {
                    ObtenerListadoAnuncioLogic(selListadoAnuncios, localStorage.getItem("idCondominio")!.toString());
                } */
                setCrear(false);
                setEditar(false);
                limpiarAnuncio();
                toast.success('Anuncio deshabilitado correctamente', {
                    position: posicionAlertas,
                });
            }
            else {
                //ErrorMessage("Ha ocurrido un error", "Ha ocurrido un error al intentar Crear Anuncio. Comuníquese con el Administrador.")
                toast.info('Error al deshabilitar anuncio. Comuníquese con el Administrador.', {
                    position: posicionAlertas,
                });
            }
            if (tipo === 8) {
                setLoading(true);
                ObtenerMisAnuncioLogic(selMisAnuncios, usuario.id.toString());
            } else {
                setDataFull(data);
                setActualizarData(true);
                setLoading(false);
            }

        } catch (er) {
            //ErrorMessage("Ha ocurrido un error", "Ha ocurrido un error al intentar Crear Anuncio. Comuníquese con el Administrador.")
            toast.info('Error al deshabilitar anuncio. Comuníquese con el Administrador.', {
                position: posicionAlertas,
            });
        }
    }
    const CrearEmergencia = () => {
        try {
            if (emergencia.descripcion.length > 0) {
                setLoading(true);
                CrearEmergenciaLogic(selCrearEmergencia, normalizarEmergencia(emergencia), false)
            }
        } catch (er) {
        }
    }
    const CrearUsuario = (eliminar: boolean) => {
        try {
            if (newUser.nombre.length > 0 && newUser.usuario.length > 3 && newUser.clave.length > 3) {
                setLoading(true);
                CrearUsuarioLogic(selCrearUsuario, newUser, eliminar)
            }
        } catch (er) {
        }
    }
    const EliminarUsuario = (user: any) => {
        try {
            if (user.id > 0) {
                setLoading(true);
                setVerUserInd(false)
                CrearUsuarioLogic(selCrearUsuario, user, true)
            }
        } catch (er) {
        }
    }
    const EliminarEmergencia = () => {
        try {
            handleConfirmMessageEliminarEmergencia()
        } catch (er) {
        }
    }
    const SeleccionarEmergencia = (e: any) => {
        setEmergenciaDetalle(e);
        setEditarEmergencia(true);
    }
    const handleConfirmMessageEliminarEmergencia = async () => {
        const msg: any = await ConfirmMessage(`Eliminar número de emergencia`, `¿Esta seguro de querer eliminar el número de emergencia?`);
        if (msg) {
            if (emergencia.descripcion.length > 0) {
                setLoading(true);
                CrearEmergenciaLogic(selCrearEmergencia, normalizarEmergencia(emergencia), true)
            }
        }
    }
    const selCrearEmergencia = (error: Boolean, err: string, data: any) => {
        try {
            if (data) {
                setEmergenciaDetalle(data);
                setLoading(false);
                setEditarEmergencia(false)
                setEmergencia({
                    id: 0,
                    descripcion: '',
                    telefono: '',
                    idcondominio: 0,
                    direccion: ''
                })
                toast.success('Número de emergencia creado correctamente', {
                    position: posicionAlertas,
                });
            }
            else {
                //ErrorMessage("Ha ocurrido un error", "Ha ocurrido un error al intentar Crear Anuncio. Comuníquese con el Administrador.")
                toast.info('Error al crear número de emergencia. Comuníquese con el Administrador.', {
                    position: posicionAlertas,
                });
            }
            setLoading(false)
        } catch (er) {
            //ErrorMessage("Ha ocurrido un error", "Ha ocurrido un error al intentar Crear Anuncio. Comuníquese con el Administrador.")
            toast.info('Error al crear número de emergencia. Comuníquese con el Administrador.', {
                position: posicionAlertas,
            });
        }
    }

    const selCrearUsuario = (error: Boolean, err: string, data: any) => {
        try {
            if (data) {
                ObtenerUsuariosLogic(selObtenerUsuarios, localStorage.getItem("idCondominio")!.toString());
                setAgregarUsuario(false);
                setNewUser({
                    id: 0,
                    usuario: '',
                    nombre: '',
                    clave: '',
                    rol: '',
                    idCondominio: 0
                })
                toast.success(err ? 'Usuario eliminado correctamente' : 'Usuario creado correctamente', {
                    position: posicionAlertas,
                });
            }
            else {
                setLoading(false);
                //ErrorMessage("Ha ocurrido un error", "Ha ocurrido un error al intentar Crear Usuario. Comuníquese con el Administrador.")
                toast.info(err ? 'Error al eliminar usuario. Comuníquese con el Administrador.' : 'Error al crear usuario. Comuníquese con el Administrador.', {
                    position: posicionAlertas,
                });
            }
        } catch (er) {
            setLoading(false);
            //ErrorMessage("Ha ocurrido un error", "Ha ocurrido un error al intentar Crear Usuario. Comuníquese con el Administrador.")
            toast.info('Error al crear usuario. Comuníquese con el Administrador.', {
                position: posicionAlertas,
            });
        }
    }


    const EditarPerfil = () => {
        guardarArchivo(2);
        let usuarioParse = usuarioDetalle;
        if (archivoTemp) {
            usuarioParse.imagen = archivoTemp.name
        }
        try {
            setLoading(true);
            EditUsuarioPorIdLogic(selEditarPerfil, usuarioParse)
        } catch (er) {
        }
    }
    async function PerfilEditar() {

        var result: any = await solicitarPermisoNotificaciones()
        if (result) {
            /* alert((serviceWorker as any).endpoint) */
            ObtenerUsuarioPorIdLogic(selObtenerUsuarioPorId, usuarioDetalle.id.toString(), localStorage.getItem("idCondominio")!.toString(), result);
            setEditarPerfil(false);
        }
    }
    const selEditarPerfil = (error: Boolean, err: string, data: any) => {
        try {
            if (data) {
                PerfilEditar()
                toast.success('Perfil editado correctamente', {
                    position: posicionAlertas,
                });
            }
            else {
                //ErrorMessage("Ha ocurrido un error", "Ha ocurrido un error al intentar Crear Anuncio. Comuníquese con el Administrador.")
                toast.info('Error al editar perfil. Comuníquese con el Administrador.', {
                    position: posicionAlertas,
                });
            }
        } catch (er) {
            //ErrorMessage("Ha ocurrido un error", "Ha ocurrido un error al intentar Crear Anuncio. Comuníquese con el Administrador.")
            toast.info('Error al editar perfil. Comuníquese con el Administrador.', {
                position: posicionAlertas,
            });
        }
    }

    const selListadoVotaciones = (error: Boolean, err: string, data: any) => {
        try {
            if (data) {
                setDataVotaciones(data);
            }
            setLoading(false);
        } catch (er) {
        }
    }
    const selListadoAnuncios = (error: Boolean, err: string, data: any) => {
        try {
            if (data) {
                /* if (data.avisosHoy) {
                    setAlerta({ tipo: 1, mensaje: "Tu calendario muestra eventos programados para hoy" })
                } */
                setDataFull(data);
                setActualizarData(true);
                guardarUltimoRegistro(data, 'anuncios')
                alert("nice" + JSON.stringify(data))
            } else {
                alert("catch" + JSON.stringify(data))
            }
            setLoading(false);
        } catch (er) {
            alert("catch" + er)
        }
    }
    const guardarUltimoRegistro = async (ultimoRegistro: any, nombre: string) => {
        try {

            await AsyncStorage.setItem(nombre, JSON.stringify(ultimoRegistro));

            /* console.log('Último registro guardado', JSON.stringify(ultimoRegistro)); */
        } catch (error) {
            console.error('Error al guardar el registro:', error);
        }
    };
    const obtenerUltimoRegistro = async () => {
        const jsonanuncios = await AsyncStorage.getItem('anuncios');
        const registroanuncios = jsonanuncios != null ? JSON.parse(jsonanuncios) : null;
        const jsoncondominios = await AsyncStorage.getItem('condominios');
        const registrocondominios = jsoncondominios != null ? JSON.parse(jsoncondominios) : null;
        setDataFull(registroanuncios);
        setDataFullParse(registroanuncios);
        setDataCondominios(registrocondominios)
        setEnComunidad(false)
    };
    useEffect(() => {
        const cargarDatos = async () => {
            if (!actualizarMisAnuncios) return;

            const idCondominio = localStorage.getItem("idCondominio");
            if (!idCondominio) return;

            const archivos = await obtenerArchivosComunidad(idCondominio);

            setDataArchivosComunidad(archivos);

            // Crear nuevo array modificando cada elemento sin mutar el original
            const newDataFull = misAnuncios.map((a: any) => {
                const nombreBuscado = a.amedida?.replace("video-", "").replace("img-", "") || "";
                const matchArchivo = archivos.find((b: any) => b.nombre === nombreBuscado);
                return {
                    ...a,
                    amedida: matchArchivo ? matchArchivo.url : a.amedida,
                    esVideo: matchArchivo ? matchArchivo.esVideo : false,
                };
            });

            setMisAnuncios(newDataFull);
            setActualizarMisAnuncios(false);
        };

        cargarDatos();
    }, [actualizarMisAnuncios]);

    const selMisAnuncios = (error: Boolean, err: string, data: any) => {
        try {
            if (data) {
                setMisAnuncios(data);
                setActualizarMisAnuncios(true);
            }
            setLoading(false);
        } catch (er) {
        }
    }
    const selListadoAvisos = (error: Boolean, err: string, data: any) => {
        try {
            if (data) {
                setAvisos(data);
            }
            setLoading(false);
        } catch (er) {
        }
    }
    const handleChangeLogin = (e: any) => {
        const { name, value } = e.target;
        setLoguear(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleChangeCriterio = (e: any) => {
        setCriterio(e);
    }

    const handleChangeOrden = (e: string) => {
        setOrden(orden === 'asc' ? 'desc' : 'asc');
    }

    const handleVolverAtras = () => {
        handleChangeMenu(menuAnterior);
    }

    const handleChangeMenu = (e: any) => {
        setMenuAnterior(active);
        setActive(e);
        switch (e) {
            case "perfil":
                cerrarMenu()
                setVerPerfil(true)
                Perfil()
                break;
            case "mispublicaciones":
                cerrarMenu();
                setVerMisAnuncios(true)
                setTipo(8);
                setLoading(true);
                ObtenerMisAnuncioLogic(selMisAnuncios, usuario.id.toString());
                break;
            case "comunidad":
                cerrarMenu()
                changeMenu(999);
                setVerUsuarios(true)
                setLoading(true);
                ObtenerUsuariosLogic(selObtenerUsuarios, localStorage.getItem("idCondominio")!.toString());
                break;
            case "crearAnuncio":
                setTipo(1);
                cerrarMenu()
                setCrear(true)
                break;
            case "crearVotacion":
                cerrarMenu();
                changeMenu(3);
                setEncuesta(true);
                break;
            case "reglas":
                cerrarMenu();
                changeMenu(999);
                setVerReglasNormas(true);
                setNewTextRich(dataFull.normas);
                break;
            case "anuncios":
                cerrarMenu();
                changeMenu(1);
                setLoading(true);
                ObtenerListadoAnuncioLogic(selListadoAnuncios, localStorage.getItem("idCondominio")!.toString());
                break;
            case "votaciones":
                cerrarMenu();
                changeMenu(5);
                setVotaciones(true)
                break;
            case "calendario":
                cerrarMenu()
                changeMenu(999)
                setVerAvisos(true)
                setLoading(true)
                ObtenerAvisosLogic(selListadoAvisos, (mes + 1).toString(), localStorage.getItem("idCondominio")!.toString(), año.toString());
                break;
            case "numEmergencias":
                cerrarMenu();
                changeMenu(999);
                setVerEmergencia(true);
                setLoading(true);
                ObtenerEmergenciasLogic(selObtenerEmergencia, localStorage.getItem("idCondominio")!.toString())
                break;
            case "cerrarSesion":
                cerrarMenu();
                changeMenu(999);
                cerrarSesion();
                break;
            default:

                break;
        }
    }

    const handleChangeAnuncio = (e: any) => {
        const { name, value } = e.target;
        setAnuncio(prev => ({
            ...prev,
            [name]: value
        }));
    };
    const handleChangeEmergencia = (e: any) => {
        const { name, value } = e.target;
        setEmergencia(prev => ({
            ...prev,
            [name]: value
        }));
    };
    const handleChangeNewUser = (e: any) => {
        const { name, value } = e.target;
        setNewUser(prev => ({
            ...prev,
            [name]: value
        }));
    };
    const handleChangePerfil = (e: any) => {
        const { name, value } = e.target;
        setUsuarioDetalle(prev => ({
            ...prev,
            [name]: value
        }));
    };
    const changeMenu = (a: number) => {
        window.scrollTo(0, 0);
        setAlerta({ tipo: 1, mensaje: "" })
        setAlertaCerrada(false);
        setVerDetalle(false);
        setTipo(a);
        setIniciarSesion(false);
        setCrear(false);
        setEditar(false);
        setEncuesta(false);
        setVerDetalle(false)
        setVerPerfil(false);
        setEditarPerfil(false);
        setEditarAvisos(false);
        setVerUsuarios(false);
        setEditarEmergencia(false);
        setVerReglasNormas(false);
        setVerDetalleAvisos(false);
        setVerMisAnuncios(false);
        setAgregarUsuario(false);
        if (a === 5) {
            setLoading(true);
            ObtenerVotacionesLogic(selListadoVotaciones, localStorage.getItem("idCondominio")!.toString(), usuario.id);
            setVotaciones(true);
        } else {
            setVotaciones(false);
        }
    }
    const cargarAnuncioParaEdit = (a: any) => {
        setTipoSubir(0);
        setEditar(true)
        setAnuncio(a);
    }

    const guardarArchivo = (tipo: number = 1) => {
        if (archivoTemp && !(archivoTemp.size > 100000000)) {
            if (tipo === 1) {
                const storageRef = ref(storage, `comunidad-${localStorage.getItem("idCondominio")}/${archivoTemp.name}`);
                const uploadTask = uploadBytes(storageRef, archivoTemp);
            } else {
                const storageRef = ref(storage, `perfiles/${archivoTemp.name}`);
                const uploadTask = uploadBytes(storageRef, archivoTemp);
            }
            setArchivoTemp(null);
        } else if (archivoTemp && (archivoTemp.size > 100000000)) {
            alert("El archivo pesa mas de 100 MB")
        }
    }

    const handleImageChange = (e: any) => {
        const file = e.target.files[0];
        setArchivoTemp(file);

        if (!file) return;

        document.getElementById('containerViewImg')?.classList.remove("d-none");

        const img = document.getElementById('visualizadorImg') as HTMLImageElement | null;
        if (img) {
            img.src = URL.createObjectURL(file);
            /*setAnuncio(prev => ({
                ...prev,
                // eslint-disable-next-line
                ["amedida"]: 'img-' + file.name
            }));*/
        }
    };

    const handleImagePerfilChange = (e: any) => {
        const file = e.target.files[0];
        setArchivoTemp(file);

        if (!file) return;

        document.getElementById('userDetallePerfil')?.classList.remove("d-none");
        document.getElementById('userDetallePerfilSVG')?.classList.add("d-none");

        const img = document.getElementById('userDetallePerfil') as HTMLImageElement | null;
        if (img) {
            img.src = URL.createObjectURL(file);
            /*setUsuarioDetalle(prev => ({
                ...prev,
                // eslint-disable-next-line
                ["imagen"]: 'img-' + file.name
            }));*/
        }
    };

    /*  document.addEventListener('visibilitychange', () => {
         if (document.visibilityState === 'visible' && tipo < 3) {
             setLoading(true);
             ObtenerListadoAnuncioLogic(selListadoAnuncios, localStorage.getItem("idCondominio")!.toString());
         }
     }); */

    const selDarQuitarLike = (error: Boolean, err: string, data: any) => {
        setLoading(false);
        try {
            if (data) {
                setDataFull(data);
                setActualizarData(true);
                setLoading(false);
            }
            else {
            }
        } catch (er) {
            toast.info('Error al dar like. Comuníquese con el Administrador.', {
                position: posicionAlertas,
            });
        }
    }

    const handleLike = (id: any, like: any, esPantallaComentario: boolean) => {
        if (usuario.nombre.length > 0) {
            DarQuitarLikeLogic(selDarQuitarLike, id, like)
        }
        if (esPantallaComentario) {
            setVerDetalle(true)
            ObtenerAnuncioPorIdLogic(selObtenerAnuncioPorId, dataDetalle.id)
        }
    };

    const crearVotacion = (cabecera: any, descripcion: any, options: any) => {
        try {
            var _opciones: any = [];
            // eslint-disable-next-line
            options.map((e: any) => {
                _opciones.push({ Descripcion: e.value, IdVotacion: 0 })
            })

            var votacion: any = {
                Id: 0,
                Cabecera: cabecera,
                Descripcion: descripcion,
                Activo: true,
                IdUsuario: usuario.id,
                IdCondominio: localStorage.getItem("idCondominio"),
                OpcionesVotacion: _opciones
            }

            setLoading(true);
            CrearVotacionLogic(selCrearVotacion, (votacion))
        } catch (er) {
        }
    }
    const selCrearVotacion = (error: Boolean, err: string, data: any) => {
        try {
            setLoading(false);
            if (data) {
                //SuccessMessage("Votación creada correctamente.")
                toast.success('Votación creada correctamente.', {
                    position: posicionAlertas,
                });
                setDataVotaciones(data);
                setLoading(false);
                changeMenu(5);
            }
            else {
                //ErrorMessage("Ocurrió un error al crear la Votación", "")
                toast.info('Error al crear votación. Comuníquese con el Administrador.', {
                    position: posicionAlertas,
                });
            }
        } catch (er) {
            //ErrorMessage("Ocurrió un error al crear la Votación", "")
            toast.info('Error al crear votación. Comuníquese con el Administrador.', {
                position: posicionAlertas,
            });
        }
    }

    const selCambiarEstadoVotacion = (error: Boolean, err: string, data: any) => {
        try {
            if (data) {
                setDataVotaciones(data);
                changeMenu(5);
                toast.success('Estado votación cambiado correctamente', {
                    position: posicionAlertas,
                });
            }
            setLoading(false);
        } catch (er) {
            //ErrorMessage("Ocurrió un error al crear la Votación", "")
            toast.info('Error al cambiar estado. Comuníquese con el Administrador.', {
                position: posicionAlertas,
            });
        }
    }

    const mensajeSuperior = () => {
        return (
            <div className={`${alerta.tipo === 1 ? "alert-primary" : alerta.tipo === 2 ? "alert-success" : alerta.tipo === 3 ? "alert-danger" : alerta.tipo === 4 ? "alert-warning" : "alert-primary"} alert alert-dismissible fade show mx-3 text-center`} role="alert">
                {alerta.mensaje}
                <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={() => {
                    setAlerta({ tipo: 1, mensaje: "" });
                    setAlertaCerrada(true);
                }}>
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        );
    }


    const navegador = () => {
        return <div className="fixed bottom-0 left-0 z-50 w-full bg-white">
            {/*usuario.nombre.length > 0 ?
                <div className="circular-menu">
                    <button
                        className={`menu-button ${open ? "open" : ""}`}
                        onClick={() => setOpen(!open)}
                        aria-label="Abrir menú"
                    >
                        <img width={50} src={iconmas} alt="icono de menu" />
                    </button>
                    <div className={`menu-items ${open ? "open" : ""}`}>
                        <button disabled={!open} className="menu-item encuesta" onClick={() => { cerrarMenu(false); changeMenu(3, false, true); setOpen(false); }}>Anuncio</button>
                        {
                            usuario.rol === "ADMINISTRADOR" &&
                            <button disabled={!open} className="menu-item encuesta" onClick={() => { cerrarMenu(false); changeMenu(3, false, false, false, true); setOpen(false); }}>Votación</button>
                        }
                    </div>
                </div>
                : ""*/}


            {/*
        return <div className="fixed bottom-0 left-0 z-50 w-full bg-white border-t">
            <div className="grid max-w-lg grid-cols-4 mx-auto font-medium" style={{ background: 'white' }}>
                <button aria-label="Anuncios" type="button" className={tipo === 1 ? "button btnactive" : "button"} onClick={() => {
                    cerrarMenu(); changeMenu(1); setLoading(true); ObtenerListadoAnuncioLogic(selListadoAnuncios, localStorage.getItem("idCondominio")!.toString());
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" className="icon">
                        <path d="M10 2a1 1 0 0 1 1 1v4.586l3.293-3.293a1 1 0 0 1 1.414 1.414l-4.293 4.293a1 1 0 0 1-1.414 0l-4.293-4.293a1 1 0 0 1 1.414-1.414L9 7.586V3a1 1 0 0 1 1-1zM2 10a8 8 0 1 1 16 0 8 8 0 0 1-16 0zm8 4a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                    </svg>
                    <span className="text">Anuncios</span>
                </button>
                <button aria-label="Ventas" type="button" className={tipo === 0 ? "button btnactive" : "button"} onClick={() => { cerrarMenu(); changeMenu(0) }}>
                    <svg className="icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6 2a1 1 0 0 0-1 1v2H3a1 1 0 0 0-1 1v2h20V6a1 1 0 0 0-1-1h-2V3a1 1 0 0 0-1-1H6Zm1 3V4h10v1H7Zm-4 5v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V10H3Zm7 3a1 1 0 0 1 2 0v1a1 1 0 1 1-2 0v-1Zm4 0a1 1 0 0 1 2 0v1a1 1 0 1 1-2 0v-1Z" />
                    </svg>
                    <span className="text">Ventas</span>
                </button>
                <button aria-label="Recordatorios" type="button" className={tipo === 2 ? "button btnactive" : "button"} onClick={() => { cerrarMenu(); changeMenu(2) }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" className="icon">
                        <path d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm0 14a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm-.5-9a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5V7z" />
                    </svg>
                    <span className="text">Recordatorios</span>
                </button>
                {
                    usuario.nombre.length > 0 ? <button type="button" className={tipo === 5 ? "button btnactive" : "button"} onClick={() => { cerrarMenu(); changeMenu(5); setVotaciones(true) }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" className="icon">
                            <path d="M4 3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4zm1 3h10v2H5V6zm0 4h10v2H5v-2zm0 4h6v2H5v-2z" />
                        </svg>
                        <span className="text">Votaciones</span>
                    </button> :
                        <button type="button" className={tipo === 4 ? "button btnactive" : "button"} onClick={() => { cerrarMenu(); changeMenu(4); setVerPerfil(true) }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" className="icon">
                                <path d="M10 0a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 12c-4.418 0-8 2.686-8 6v2h16v-2c0-3.314-3.582-6-8-6z" />
                            </svg>
                            <span className="text">Perfil</span>
                        </button>
                }
            </div >*/}

            <BottomNav
                onChangeMenu={handleChangeMenu}
                active={active}
                orden={orden}
                onChangeCriterio={handleChangeCriterio}
                onFiltrarDataFull={filtrarDataFull}
                onChangeOrden={handleChangeOrden}
            />
        </div >
    }

    const panelPrincipal = () => {
        return <div className="container">
            <div className="row">
                <span className="w-100 text-center h2 mb-4">Tus Comunidades</span>
                {dataCondominios.map((a: any) => {
                    let activo = new Date(a.fechaCaducidad.toString()) > new Date();
                    return (
                        <div className={activo ? "card col-12 condominioList mb-3" : "card col-12 condominioList mb-3 disabled"} onClick={() => { setEnComunidad(true); setLoading(true); ObtenerListadoAnuncioLogic(selListadoAnuncios, a.id); localStorage.setItem("idCondominio", a.id) }}>
                            {a.logo && (
                                <img id="imgComunidad" width={200} src={`data:image/jpeg;base64,${a.logo}`} />
                            )}
                            <span id="nomComunidad" className="h5">{a.nombre}</span>
                        </div>
                    );
                })}
            </div>

        </div>
    }

    const cambiarVoto = (ev: any) => {
        setLoading(true);
        if (ev.target.id) {
            VotarLogic(selVotar, ev.target.id, usuario.id, localStorage.getItem("idCondominio")!.toString());
        } else {
            VotarLogic(selVotar, ev.target.parentNode.id, usuario.id, localStorage.getItem("idCondominio")!.toString());
        }
    }

    const selVotar = (error: Boolean, err: string, data: any) => {
        try {
            /* ObtenerVotacionesLogic(selListadoVotaciones, localStorage.getItem("idCondominio")!.toString(), usuario.id); */
            setDataVotaciones(data);
            setLoading(false);
        } catch (er) {
        }
    }

    const selcrearComentarioAnuncio = (error: Boolean, err: string, data: any) => {
        try {
            if (data) {
                setLoading(true);
                ObtenerAnuncioPorIdLogic(selObtenerAnuncioPorId, dataDetalle.id);
            }
        } catch (er) {
        }
    }
    const selObtenerAnuncioPorId = (error: Boolean, err: string, data: any) => {
        try {
            if (data) {
                let newData = data;

                if (newData.amedida && !newData.amedida.includes("http")) {
                    const imageRef = ref(storage, `comunidad-${localStorage.getItem("idCondominio")}/${newData.amedida.replace("video-", "").replace("img-", "")}`);

                    const esVideo = /\.(mp4|webm|ogg|mov|avi|mkv)$/i.test(imageRef.fullPath)

                    getDownloadURL(imageRef)
                        .then((url) => {
                            newData.amedida = url;
                            newData.esVideo = esVideo;
                            setDataDetalle(newData);
                            setLoading(false);
                        })
                        .catch((err) => {
                            console.error(err);
                        });

                } else {
                    const esVideo = /\.(mp4|webm|ogg|mov|avi|mkv)$/i.test(newData.amedida.fullPath)
                    newData.esVideo = esVideo;
                    setDataDetalle(newData);
                    setLoading(false);
                }
            }
        } catch (er) {
        }
    }
    const selObtenerUsuarioPorId = (error: Boolean, err: string, data: any) => {
        try {
            if (data) {
                let newData = data;
                if (newData.imagen) {
                    const imageRef = ref(storage, `perfiles/${newData.imagen}`);

                    getDownloadURL(imageRef)
                        .then((url) => {
                            newData.imagen = url;
                            setUsuarioDetalle(newData);
                            setLoading(false);
                        })
                        .catch((err) => {
                            setUsuarioDetalle(newData);
                            console.error(err);
                            setLoading(false);
                        });
                } else {
                    setUsuarioDetalle(newData);
                    setLoading(false);
                }
            }
        } catch (er) {
        }
    }
    const selObtenerUsuarios = (error: Boolean, err: string, data: any) => {
        try {
            if (data) {
                let usuariosParse = data.usuarios;
                setCupoUsuarios({ usados: data.cantUsuario, cupo: data.totalUsuario })
                const cargarDatos = async () => {

                    const archivos = await obtenerArchivosPerfil();

                    if (archivos && archivos.length > 0) {
                        usuariosParse.map((a: any) => {
                            const nombreBuscado = a.imagen?.replace("video-", "").replace("img-", "") || "";
                            const matchArchivo = archivos.find((b: any) => b.nombre === nombreBuscado);
                            if (matchArchivo) {
                                a.imagen = matchArchivo.url;
                            }
                        });
                    }

                    setLoading(false);
                    setUsuarios(usuariosParse);
                    setUsuariosParse(usuariosParse);
                };

                cargarDatos();
            }
        } catch (er) {
        }
    }
    const selObtenerEmergencia = (error: Boolean, err: string, data: any) => {
        try {
            if (data) {
                setEmergenciaDetalle(data);
            }
            setLoading(false);
        } catch (er) {
        }
    }

    const filtrarUsuarios = (ev: any) => {
        let parselistadoUser = listadousuarios.filter((e) => e.nombre.toLocaleLowerCase().includes(ev.target.value.toLocaleLowerCase()));
        setUsuariosParse(parselistadoUser);
    }

    const filtrarDataFull = (ev: any) => {
        const texto = ev.target.value.toLowerCase();

        const filtrado = dataFull.anuncios.filter((item: any) => {
            const cabecera = item.cabecera?.toLowerCase() || '';
            const organizador = item.organizador?.toLowerCase() || '';
            return cabecera.includes(texto) || organizador.includes(texto);
        });
        setDataFullParse(prev => ({
            ...prev,
            ['anuncios']: filtrado
        }));
        setBuscarDataFull(ev.target.value);
    }


    const panelUsuarios = () => {
        return <>
            {!loading &&
                <div className="w-100 px-3">
                    {
                        agregarUsuario ?
                            <>
                                <div className="w-100 px-3 mt-2">
                                    <button type="button" className="iconoVolver" style={{ position: 'absolute', left: '15px', top: '15px', zIndex: '1' }} onClick={() => {
                                        setVerUserInd(false); setAgregarUsuario(false);
                                    }}>
                                        <img width={35} src={volver} alt="Icono volver" />
                                    </button>
                                    <div className="login-box py-3">
                                        <h2 className="text-center">Agregar Usuario</h2>
                                        <label htmlFor="textfield" className="search-label-admin">
                                            Usuario
                                        </label>
                                        <input
                                            name="usuario"
                                            className="search-input"
                                            value={newUser.usuario}
                                            onChange={(e: any) => handleChangeNewUser(e)}
                                        />
                                        <label htmlFor="textfield" className="search-label-admin">
                                            Nombre
                                        </label>
                                        <input
                                            name="nombre"
                                            className="search-input"
                                            value={newUser.nombre}
                                            onChange={(e: any) => handleChangeNewUser(e)}
                                        />
                                        <label htmlFor="textfield" className="search-label-admin" defaultValue={""}>
                                            Clave
                                        </label>
                                        <input
                                            name="clave"
                                            className="search-input"
                                            value={newUser.clave}
                                            onChange={(e: any) => handleChangeNewUser(e)}
                                        />
                                        <label htmlFor="textfield" className="search-label-admin">
                                            Rol
                                        </label>
                                        <select id="rol" className="typeDate" name="rol" onChange={(e: any) => { handleChangeNewUser(e) }}>
                                            <option value="VECINO" selected>Vecino</option>
                                            <option value="ADMINISTRADOR">Administrador</option>
                                        </select>
                                        <button
                                            type="button"
                                            disabled={newUser.nombre === "" || newUser.clave === ""}
                                            className="search-button mt-2"
                                            onClick={() => CrearUsuario(false)}
                                        >
                                            Aceptar
                                        </button>
                                        <button
                                            type="button"
                                            disabled={newUser.nombre === "" || newUser.clave === ""}
                                            className="modal-btn modal-btn-close mt-2"
                                            onClick={() => setAgregarUsuario(false)}
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            </> :
                            !verUsuarioInd ?
                                <>
                                    <div className="usuariosContainer">
                                        <h2 className="usuarios-title">Listado Usuarios</h2>
                                        {(cupoUsuarios.cupo > cupoUsuarios.usados) ?
                                            <div className="cupo-usuarios-container" style={{ cursor: 'pointer' }} onClick={() => {
                                                setAgregarUsuario(true); setNewUser({ id: 0, usuario: '', nombre: "", clave: "", rol: "VECINO", idCondominio: parseInt(localStorage.getItem("idCondominio")!.toString()) });
                                            }}>
                                                <button className="cupo-usuarios-add" title="Agregar usuario">
                                                    <svg width="30" height="30" viewBox="0 0 18 18" fill="none">
                                                        <circle cx="9" cy="9" r="9" fill="#009688" />
                                                        <path d="M9 5v8M5 9h8" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                                                    </svg>
                                                </button>
                                                <span className="cupo-usuarios">
                                                    {cupoUsuarios.usados}/{cupoUsuarios.cupo}
                                                </span>
                                            </div>
                                            :
                                            <div className="cupo-usuarios-container" style={{ cursor: 'pointer' }}>
                                                <span className="cupo-usuarios">
                                                    {cupoUsuarios.usados}/{cupoUsuarios.cupo}
                                                </span>
                                            </div>
                                        }
                                        <div className="buscaruser-search-container">
                                            <label className="buscaruser-search-label">Buscar Usuario</label>
                                            <input
                                                type="search"
                                                id="buscar-usuario"
                                                className="buscaruser-search-input"
                                                placeholder="Escribe para buscar..."
                                                onChange={(ev) => { filtrarUsuarios(ev) }}
                                            />
                                        </div>
                                        <div>
                                            {listadousuariosParse.map((a, idx) => (
                                                <div className="usuarios-listado" key={idx} onClick={() => { setDataUserSelect(a); setVerUserInd(true); }}>
                                                    <div className="usuarios-item">
                                                        <span className="usuarios-item-title">Nombre</span>
                                                        <span className="usuarios-item-value">{a.nombre}</span>
                                                    </div>
                                                    <div className="usuarios-item">
                                                        <span className="usuarios-item-title">Rol</span>
                                                        <span className="usuarios-item-value">{a.rol}</span>
                                                    </div>
                                                    <div className="usuarios-item">
                                                        <span className="usuarios-item-title">Fecha Caducidad</span>
                                                        <span className="usuarios-item-value">{new Date(a.fechaCaducidad).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="usuarios-item">
                                                        <span className="usuarios-item-title">Estado</span>
                                                        <span className={a.activo ? "usuarios-item-value user-activo" : "usuarios-item-value user-inactivo"}>{a.activo ? "Activo" : "Inactivo"}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                                :
                                <div className="perfil-box w-100" style={{ padding: '20px' }}>
                                    <button type="button" className="iconoVolver" style={{ position: 'absolute', left: '15px', top: '15px', zIndex: '1' }} onClick={() => {
                                        setVerUserInd(false)
                                    }}>
                                        <img width={35} src={volver} alt="Icono volver" />
                                    </button>
                                    <button
                                        type="button"
                                        className="perfil-edit-btn"
                                        onClick={() => { EliminarUsuario({ id: dataUserSelect.id, usuario: dataUserSelect.usuario, nombre: dataUserSelect.nombre, clave: dataUserSelect.clave, rol: "VECINO", idCondominio: parseInt(localStorage.getItem("idCondominio")!.toString()) }) }}
                                        aria-label="Editar perfil"
                                    >
                                        <img src={iconborrar} />
                                    </button>
                                    <button
                                        type="button"
                                        className="perfil-edit-btn mr-5"
                                        onClick={() => { setAgregarUsuario(true); setNewUser({ id: dataUserSelect.id, usuario: dataUserSelect.usuario, nombre: dataUserSelect.nombre, clave: dataUserSelect.clave, rol: "VECINO", idCondominio: parseInt(localStorage.getItem("idCondominio")!.toString()) }) }}
                                        aria-label="Editar perfil"
                                    >
                                        <img src={iconeditar} />
                                    </button>
                                    <div className="perfil-avatar">
                                        {dataUserSelect.imagen ? (
                                            <img
                                                id="imgPerfilSelect1"
                                                src={dataUserSelect.imagen}
                                                alt="Vista previa"
                                            />
                                        ) : (
                                            <svg width="72" height="72" fill="#e0e0e0" viewBox="0 0 24 24">
                                                <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
                                            </svg>
                                        )}
                                    </div>
                                    <h4 className="perfil-nombre">{dataUserSelect.nombre}</h4>
                                    <div className="perfil-info">
                                        <div className="w-100">
                                            <div className="container-dataPerfil">
                                                <span>Rol</span>
                                                {dataUserSelect.rol && <span style={{ marginLeft: '30px', textAlign: 'end', fontWeight: '700' }}>{dataUserSelect.rol}</span>}
                                            </div>
                                            <div className="container-dataPerfil">
                                                <span>Dirección</span>
                                                {dataUserSelect.direccion ? <span style={{ marginLeft: '30px', textAlign: 'end', fontWeight: '700' }}>{dataUserSelect.direccion}</span> : <span style={{ marginLeft: '30px', textAlign: 'end', fontWeight: '700' }}>Sin Datos</span>}
                                            </div>
                                            <div className="container-dataPerfil">
                                                <span>Teléfono</span>
                                                {dataUserSelect.telefono ? <span style={{ marginLeft: '30px', textAlign: 'end', fontWeight: '700' }}>{dataUserSelect.telefono}</span> : <span style={{ marginLeft: '30px', textAlign: 'end', fontWeight: '700' }}>Sin Datos</span>}
                                            </div>
                                            <div className="container-dataPerfil">
                                                <span>Notif. Anuncios</span>
                                                <span style={{ marginLeft: '30px', textAlign: 'end', fontWeight: '700' }}>{dataUserSelect.tieneSuscripcionAnuncios ? "Activa" : "Inactiva"}</span>
                                            </div>
                                            <div className="container-dataPerfil">
                                                <span>Notif. Mensajes</span>
                                                <span style={{ marginLeft: '30px', textAlign: 'end', fontWeight: '700' }}>{dataUserSelect.tieneSuscripcionMensajes ? "Activa" : "Inactiva"}</span>
                                            </div>
                                            <div className="container-dataPerfil">
                                                <span>Notif. Votaciones</span>
                                                <span style={{ marginLeft: '30px', textAlign: 'end', fontWeight: '700' }}>{dataUserSelect.tieneSuscripcionVotaciones ? "Activa" : "Inactiva"}</span>
                                            </div>
                                            <div className="container-dataPerfil">
                                                <span>Notif. Calendario</span>
                                                <span style={{ marginLeft: '30px', textAlign: 'end', fontWeight: '700' }}>{dataUserSelect.tieneSuscripcionAvisos ? "Activa" : "Inactiva"}</span>
                                            </div>
                                            <div className="container-dataPerfil">
                                                <span>Fecha Caducidad</span>
                                                {dataUserSelect.fechaCaducidad && (
                                                    <span style={{ marginLeft: '30px', textAlign: 'end', fontWeight: '700' }}>{new Date(dataUserSelect.fechaCaducidad).toLocaleDateString()}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                    }
                </div>
            }
        </>
    }

    const editorRef = useRef<HTMLDivElement>(null);

    const handleInput = () => {
        //setNewTextRich(ev.target.children[0].outerHTML);
        setTextRichEditado(true);
    };
    const handleBlur = () => {
        if (editorRef.current) {
            setNewTextRich(editorRef.current.innerHTML);
        }
    };
    const selCambiarNormas = (error: Boolean, err: string, data: any) => {
        try {
            if (data) {
                /* setLoading(true);
                ObtenerListadoAnuncioLogic(selListadoAnuncios, localStorage.getItem("idCondominio")!.toString()); */
                setDataFull(data);
                setActualizarData(true);
                setLoading(false);
                toast.success('Normas editadas correctamente', {
                    position: posicionAlertas,
                });
            }
            else {
                //ErrorMessage("Ha ocurrido un error", "Ha ocurrido un error al intentar Crear Anuncio. Comuníquese con el Administrador.")
                toast.info('Error al cambiar las normas. Comuníquese con el Administrador.', {
                    position: posicionAlertas,
                });
            }
        } catch (er) {
            //ErrorMessage("Ha ocurrido un error", "Ha ocurrido un error al intentar Crear Anuncio. Comuníquese con el Administrador.")
            toast.info('Error al cambiar las normas. Comuníquese con el Administrador.', {
                position: posicionAlertas,
            });
        }
    }

    const getObtenerAvisosDia = (dia: number, mes: number) => {
        setDiaMesSelect({ dia: dia, mes: mes, anio: año })
        setVerDetalleAvisos(true);
    }

    function useVisible(ref: any) {
        const [visible, setVisible] = useState(false);

        useEffect(() => {
            const observer = new IntersectionObserver(
                ([entry]) => setVisible(entry.isIntersecting),
                { threshold: 0.1 }
            );
            if (ref.current) observer.observe(ref.current);
            return () => {
                if (ref.current) observer.unobserve(ref.current);
            };
        }, [ref]);

        return visible;
    }

    function AnuncioCard({ titulo, descripcion, imagen, url }: { titulo: string, descripcion: string, imagen: string, url: string }) {
        const ref = useRef(null);
        const visible = useVisible(ref);

        return (
            <a
                href={url}
                className={`anuncio-card ${visible ? "visible" : ""}`}
                ref={ref}
                target="_blank"
                rel="noopener noreferrer"
            >
                <div
                    className="anuncio-imagen"
                    style={{ backgroundImage: `url(${imagen})` }}
                    aria-label={titulo}
                />
                <div className="anuncio-texto">
                    <h3>{titulo}</h3>
                    <p>{descripcion}</p>
                </div>
            </a>
        );
    }

    const cambiarMes = (a: any, b: any) => {
        setMes(a)
        setAño(b)
        setLoading(true)
        ObtenerAvisosLogic(selListadoAvisos, (a + 1).toString(), localStorage.getItem("idCondominio")!.toString(), b.toString());
    }
    /* 
        const panelCrearAnuncio = () => {
            return <div key={2} className="w-100" style={{ maxWidth: '700px', margin: '0 auto' }}>
                {!crear && (
                    <button type="button" className="iconoVolver" onClick={() => {
                        setCrear(false);
                        setEditar(false);
                        setVerDetalle(false);
                    }}>
                        <img width={35} src={volver} alt="Icono volver" />
                    </button>
                )}
                <h2 className="mb-4 text-center">{crear ? "Crear" : "Editar"} {!crear ? tipo === 1 ? "Anuncio" : tipo === 0 ? "Venta" : "Recordatorio" : ""}</h2>
     
                <div className="login-box py-3 px-3" style={{ boxShadow: '0 0 0 1px #e5e5e5', borderRadius: '10px' }}>
                    <label htmlFor="textfield" className="search-label-admin">
                        Cabecera
                    </label>
                    <input
                        type="text"
                        name="cabecera"
                        className="search-input"
                        value={anuncio.cabecera}
                        onChange={handleChangeAnuncio}
                    />
                    <label htmlFor="textfield" className="search-label-admin">
                        Descripción
                    </label>
                    <textarea
                        rows={4}
                        cols={50}
                        name="descripcion"
                        className="search-input"
                        value={anuncio.descripcion}
                        onChange={handleChangeAnuncio}
                    />
                    <label htmlFor="textfield" className="search-label-admin">
                        Organizador
                    </label>
                    <input
                        type="text"
                        name="organizador"
                        className="search-input"
                        value={usuario.nombre}
                        disabled
                        onChange={handleChangeAnuncio}
                    />
                    <label htmlFor="textfield" className="search-label-admin">
                        Teléfono
                    </label>
                    <input
                        type="text"
                        name="telefono"
                        className="search-input"
                        value={anuncio.telefono}
                        onChange={handleChangeAnuncio}
                    />
                    <label htmlFor="textfield" className="search-label-admin mt-3">
                        Fecha Hasta
                    </label>
                    <input
                        type="date"
                        name="fechaHasta"
                        className="typeDate"
                        value={anuncio.fechaHasta ? anuncio.fechaHasta.toString().substring(0, 10) : ''}
                        onChange={handleChangeAnuncio}
                        style={{ padding: '8px', fontSize: '16px' }}
                    />
     
                    {(crear || (!crear && !anuncio.amedida)) && (
                        <div>
                            <label>Subir archivo</label>
                            <div className="radio-group">
                                <label className="radio-label">
                                    <input type="radio" name="fileType" className="radio-input" value="image" onClick={e => setTipoSubir(1)} />
                                    <span>🖼️</span>
                                    <span className="text">Imagen</span>
                                </label>
     
                                <label className="radio-label">
                                    <input type="radio" name="fileType" className="radio-input" value="video" onClick={e => setTipoSubir(2)} />
                                    <span>🎥</span>
                                    <span className="text">Video</span>
                                </label>
                            </div>
                        </div>
                    )}
     
                    {(tipoSubir === 1 || (editar && (anuncio.amedida && !anuncio.esVideo))) && (
                        <label htmlFor="textfield" className="search-label-admin mt-3">
                            Cargar imagen
                        </label>
                    )}
                    {(tipoSubir === 1 || (editar && (anuncio.amedida && !anuncio.esVideo))) && (
                        <input type="file" accept="image/*" className="w-100" onChange={handleImage} />
                    )}
                    <div id="containerViewImg" className={anuncio.amedida && !anuncio.esVideo ? "" : "d-none"}>
                        <h3>Vista previa Imagen:</h3>
                        <img
                            id="visualizadorImg"
                            src={!crear ? anuncio.amedida : ""}
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.onerror = null;
                                target.src = imgError;
                            }}
                            alt="Vista previa"
                            style={{ maxWidth: '300px', marginTop: '10px' }}
                        />
                    </div>
     
     
                    {(tipoSubir === 2 || (editar && (anuncio.amedida && anuncio.esVideo))) && (
                        <label htmlFor="textfield" className="search-label-admin mt-3">
                            Cargar video
                        </label>
                    )}
                    {(tipoSubir === 2 || (editar && (anuncio.amedida && anuncio.esVideo))) && (
                        <input type="file" accept="video/*" className="w-100" onChange={e => uploadVideo(e.target.files)} />
                    )}
                    <div id="containerViewVideo" className={anuncio.amedida && anuncio.esVideo ? "" : "d-none"}>
                        <h3>Vista previa Video:</h3>
                        <video id="visualizadorVideo" src={!crear ? anuncio.amedida : ""} controls width="300" />
                    </div>
                    <label htmlFor="textfield" className="search-label mt-3">
                        Tipo
                    </label>
                    <select id="miCombo" value={anuncio.idTipo} className="typeDate" name="idTipo" onChange={handleChangeAnuncio}>
                        <option value="1">Anuncio</option>
                        <option value="0">Ventas</option>
                        <option value="2">Recordatorio</option>
                    </select>
                    <button
                        type="button"
                        className="search-button mt-2"
                        onClick={CrearAnuncio}
                    >
                        {crear ? "Crear" : "Editar"}
                    </button>
                </div>
            </div>
        } */
    const iconNotificaciones = (activa: boolean) => {
        return <label className="switch">
            <input
                type="checkbox"
                checked={activa}
                defaultChecked={activa}
                className="switch-checkbox"
            />
            <span className="switch-slider" />
        </label>
    }
    async function solicitarPermisoNotificaciones() {
        const permiso = await Notification.requestPermission();

        if (permiso === 'granted') {
            /* alert('✅ Permiso de notificaciones concedido'); */
            const registration = await navigator.serviceWorker.register('/service-worker.js');
            const ready = await navigator.serviceWorker.ready;

            let subscription = await ready.pushManager.getSubscription();
            if (!subscription) {
                subscription = await ready.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array("BDhWFTbhmhdKANFtk6FZsIE4gQE1eHAiCPvwXsE8UGCKa-U-vVh3cTzOCFtNy01QBc08mP8GcUeCLybWsD-5No0"),
                });
            }
            return subscription
        } else if (permiso === 'denied') {
            alert('❌ Has denegado las notificaciones. Puedes activarlas desde la configuración del navegador.');
            return false
        } else {
            alert('ℹ️ Las notificaciones están bloqueadas o no se solicitaron correctamente.');
            return false
        }
    }


    /* const cerrarMenu = (a: any, b: any = false, c: any = false, d: any = false, e: any = false, f: any = false, g: any = false, h: any = false, i: any = false) => {
        setAlerta({ tipo: 1, mensaje: "" })
        setAlertaCerrada(false);
        setMenuOpciones(a)
        setVerPerfil(b)
        setVerReglasNormas(c);
        setVerAvisos(d)
        setEditarAvisos(e)
        setVerPuntosInteres(f)
        setVerEmergencia(g)
        setVotaciones(h);
        setVerUsuarios(i);
        setVerMisAnuncios(false);
        setAgregarUsuario(false);
    } */
    const cerrarMenu = () => {
        setAlerta({ tipo: 1, mensaje: "" })
        setAlertaCerrada(false);
        setMenuOpciones(false)
        setVerPerfil(false)
        setVerMisAnuncios(false);
        setCrear(false)
        setEditar(false)
        setVerUsuarios(false);
        setVerReglasNormas(false);
        setVerAvisos(false)
        setEditarAvisos(false)
        setVerPuntosInteres(false)
        setVerEmergencia(false)
        setVotaciones(false);
        setAgregarUsuario(false);
        setOpenCrear(false);
        setEncuesta(false);
    }

    const selSuscribir2 = (error: Boolean, err: string, data: any) => {
        setLoading(false);
        try {
            if (data) {
                //SuccessMessage("Su suscripción a las notificaciones fue realizada correctamente.")
                toast.success('Su suscripción a las notificaciones fue realizada correctamente.', {
                    position: posicionAlertas,
                });
                let newData = data;
                if (newData.imagen) {
                    const imageRef = ref(storage, `perfiles/${newData.imagen}`);

                    getDownloadURL(imageRef)
                        .then((url) => {
                            newData.imagen = url;
                            setUsuarioDetalle(newData);
                            setLoading(false);
                        })
                        .catch((err) => {
                            setUsuarioDetalle(newData);
                            console.error(err);
                            setLoading(false);
                        });
                } else {
                    setUsuarioDetalle(newData);
                    setLoading(false);
                }
            }
            else {
                //ErrorMessage("Error crear suscripción", "Favor intentarlo nuevamente en unos minutos")
                toast.info('Error al crear suscripción. Comuníquese con el Administrador.', {
                    position: posicionAlertas,
                });
            }
        } catch (er) {
            //ErrorMessage("Error crear suscripción", "Favor comuniquese con el administrador.")
            toast.info('Error al crear suscripción. Comuníquese con el Administrador.', {
                position: posicionAlertas,
            });
        }
    }
    const changeComentario = (ev: any) => {
        setNewComentario(ev)
    }

    // eslint-disable-next-line
    const selDesSuscribir = (error: Boolean, err: string, data: any) => {
        setLoading(false);
        try {
            if (data) {
                //SuccessMessage("Su desuscribipción a las notificaciones fue realizada correctamente.")
                toast.info('Su desuscribipción a las notificaciones fue realizada correctamente.', {
                    position: posicionAlertas,
                });
                setUsuario({
                    usuario: usuario.usuario,
                    nombre: usuario.nombre,
                    tieneSuscripcionMensajes: err === "2" ? false : usuario.tieneSuscripcionMensajes,
                    tieneSuscripcionVotaciones: err === "3" ? false : usuario.tieneSuscripcionVotaciones,
                    tieneSuscripcionAnuncios: err === "1" ? false : usuario.tieneSuscripcionAnuncios,
                    tieneSuscripcionAvisos: err === "4" ? false : usuario.tieneSuscripcionAvisos,
                    rol: usuario.rol,
                    id: usuario.id
                });
                let campo = err === "2" ? "tieneSuscripcionMensajes" : err === "3" ? "tieneSuscripcionVotaciones" : "tieneSuscripcionAnuncios";
                localStorage.setItem(campo, "false");
            }
            else {
                //ErrorMessage("Error quitar suscripción", "Favor intentarlo nuevamente en unos minutos")
                toast.info('Error al quitar suscripción. Comuníquese con el Administrador.', {
                    position: posicionAlertas,
                });
            }
        } catch (er) {
            //ErrorMessage("Error quitar suscripción", "Favor comuniquese con el administrador.")
            toast.info('Error al quitar suscripción. Comuníquese con el Administrador.', {
                position: posicionAlertas,
            });
        }
    }

    useEffect(() => {
        if (!menuOpciones) return;

        const handleClickOutside = (event: any) => {
            if (menuRef.current && !(menuRef.current as any).contains(event.target)) {
                if (event.target.id !== "iconoMenuSup") {
                    setMenuOpciones(false);
                    setOpenNotificaciones(false);
                }
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuOpciones]);

    const createSuscripcion = (tieneSuscripcion: boolean, tipoSuscripcion: any, ev: any) => {
        ev.preventDefault();
        setOpenNotificaciones(false);
        setMenuOpciones(false);
        setLoading(true);
        if (tieneSuscripcion) {
            DessuscribirNotificacionesLogic(selDesSuscribir, usuario.id, tipoSuscripcion)
        } else {
            Suscripcion(tipoSuscripcion)
        }
    }
    async function Suscripcion(tipoSuscripcion: any) {

        var result: any = await solicitarPermisoNotificaciones()
        if (result) {
            /* alert((serviceWorker as any).endpoint) */
            SuscribirNotificaciones2Logic(selSuscribir2, localStorage.getItem("idCondominio")!.toString(), usuario.id, tipoSuscripcion, result)
        }
    }

    const [openCrear, setOpenCrear] = useState(false);

    const [openNotificaciones, setOpenNotificaciones] = useState(false);

    async function UsuarioObtener() {

        var result: any = await solicitarPermisoNotificaciones()
        if (result) {
            /* alert((serviceWorker as any).endpoint) */
            ObtenerUsuarioPorIdLogic(selObtenerUsuarioPorId, usuario.id.toString(), localStorage.getItem("idCondominio")!.toString(), result);
        }
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////////
    return (
        <React.Fragment>
            <div>
                {
                    loading ?
                        <Loading />
                        : ""}
                {/*<div className={enComunidad ? "w-100 pb-3 mb-3 containerMenu" : "d-none"}>
                    <div className="containerImgMenu">
                        {
                            usuario.nombre.length > 0 && <button id="iconoMenuSup" className="iconNotificacion" onClick={() => { setMenuOpciones(!menuOpciones); }}>
                                <img id="iconoMenuSup" width={25} src={menuicon} alt="icono abrir menu" />
                            </button>
                        }
                        {dataFull.logo ?
                            <img src={`data:image/jpeg;base64,${dataFull.logo}`} alt="Logo" style={{ width: '65px', margin: '0 auto' }} />
                            : ""}
                        <button className="iconRefresh" onClick={() => { setLoading(true); ObtenerListadoAnuncioLogic(selListadoAnuncios, localStorage.getItem("idCondominio")!.toString()); }}>
                            <img width={25} src={actualizar} alt="icono actualizar" />
                        </button>
                    </div>
                    {menuOpciones && (
                        <div ref={menuRef} className="custom-menu">
                            <button type="button" onClick={() => {
                                cerrarMenu()
                                setVerPerfil(true)
                                Perfil()
                            }}>
                                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                                </svg>
                                Perfil
                            </button>
                            <button type="button" onClick={() => {
                                cerrarMenu();
                                setVerMisAnuncios(true)
                                setTipo(8);
                                setLoading(true);
                                ObtenerMisAnuncioLogic(selMisAnuncios, usuario.id.toString());
                            }}>
                                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M3 5a2 2 0 0 1 2-2h9l5 5v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5zm13.586 4L13 5.414V9h3.586zM7 13h10v1.5H7V13zm0 3h7v1.5H7V16z" />
                                </svg>
                                Mis Publicaciones
                            </button>
                            <button
                                type="button"
                                onClick={() => { setOpenCrear(!openCrear); setOpenNotificaciones(false); }}
                                className="crear-btn"
                            >
                                <svg fill="#000000" height="800px" width="800px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 27.963 27.963">
                                    <g>
                                        <g id="c140__x2B_">
                                            <path d="M13.98,0C6.259,0,0,6.26,0,13.982s6.259,13.981,13.98,13.981c7.725,0,13.983-6.26,13.983-13.981
			C27.963,6.26,21.705,0,13.98,0z M21.102,16.059h-4.939v5.042h-4.299v-5.042H6.862V11.76h5.001v-4.9h4.299v4.9h4.939v4.299H21.102z
			"/>
                                        </g>
                                        <g id="Capa_1_9_">
                                        </g>
                                    </g>
                                </svg>
                                Crear
                                <svg style={{ position: 'absolute', right: '0' }} width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5.70711 9.71069C5.31658 10.1012 5.31658 10.7344 5.70711 11.1249L10.5993 16.0123C11.3805 16.7927 12.6463 16.7924 13.4271 16.0117L18.3174 11.1213C18.708 10.7308 18.708 10.0976 18.3174 9.70708C17.9269 9.31655 17.2937 9.31655 16.9032 9.70708L12.7176 13.8927C12.3271 14.2833 11.6939 14.2832 11.3034 13.8927L7.12132 9.71069C6.7308 9.32016 6.09763 9.32016 5.70711 9.71069Z" fill="#0F0F0F" />
                                </svg>
                            </button>
                            {openCrear && (
                                <div className="submenu">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setTipo(1);
                                            cerrarMenu()
                                            setCrear(true)
                                        }}
                                        className="submenu-item ml-3"
                                    >
                                        Publicación
                                    </button>
                                    {usuario.rol === "ADMINISTRADOR" &&
                                        <button
                                            type="button"
                                            onClick={() => {
                                                cerrarMenu();
                                                changeMenu(3);
                                                setEncuesta(true);
                                            }}
                                            className="submenu-item ml-3"
                                        >
                                            Votación
                                        </button>
                                    }
                                </div>
                            )}
                            {
                                usuario.rol === "Administrador" || usuario.rol === "ADMINISTRADOR" && (
                                    <button type="button" onClick={() => {
                                        cerrarMenu()
                                        changeMenu(999);
                                        setVerUsuarios(true)
                                        setLoading(true);
                                        ObtenerUsuariosLogic(selObtenerUsuarios, localStorage.getItem("idCondominio")!.toString());
                                    }}>
                                        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3Zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3Zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13Zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 2.05 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5Z" />
                                        </svg>
                                        Comunidad
                                    </button>
                                )
                            }

                            <button
                                type="button"
                                onClick={() => { setOpenNotificaciones(!openNotificaciones); setOpenCrear(false); UsuarioObtener(); }}
                                className="crear-btn"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path d="M10 2a6 6 0 00-6 6v2.586l-.707.707A1 1 0 004 13h12a1 1 0 00.707-1.707L16 10.586V8a6 6 0 00-6-6zm0 16a2 2 0 002-2H8a2 2 0 002 2z" />
                                </svg>
                                Notificaciones
                                <svg style={{ position: 'absolute', right: '0' }} width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5.70711 9.71069C5.31658 10.1012 5.31658 10.7344 5.70711 11.1249L10.5993 16.0123C11.3805 16.7927 12.6463 16.7924 13.4271 16.0117L18.3174 11.1213C18.708 10.7308 18.708 10.0976 18.3174 9.70708C17.9269 9.31655 17.2937 9.31655 16.9032 9.70708L12.7176 13.8927C12.3271 14.2833 11.6939 14.2832 11.3034 13.8927L7.12132 9.71069C6.7308 9.32016 6.09763 9.32016 5.70711 9.71069Z" fill="#0F0F0F" />
                                </svg>
                            </button>

                            {openNotificaciones && (
                                <div className="submenu">
                                    <button type="button" className="submenu-item ml-3" onClick={(ev) => {
                                        createSuscripcion(usuario.tieneSuscripcionAnuncios, 1, ev)
                                    }}>
                                        Notif. Anuncios
                                        {iconNotificaciones(usuarioDetalle.tieneSuscripcionAnuncios)}
                                    </button>
                                    <button type="button" className="submenu-item ml-3" onClick={(ev) => {
                                        createSuscripcion(usuario.tieneSuscripcionMensajes, 2, ev)
                                    }}>
                                        Notif. Mensajes
                                        {iconNotificaciones(usuarioDetalle.tieneSuscripcionMensajes)}
                                    </button>
                                    <button type="button" className="submenu-item ml-3" onClick={(ev) => {
                                        createSuscripcion(usuario.tieneSuscripcionVotaciones, 3, ev)
                                    }}>
                                        Notif. Votaciones
                                        {iconNotificaciones(usuarioDetalle.tieneSuscripcionVotaciones)}
                                    </button>
                                    <button type="button" className="submenu-item ml-3" onClick={(ev) => {
                                        createSuscripcion(usuario.tieneSuscripcionAvisos, 4, ev)
                                    }}>
                                        Notif. Calendario
                                        {iconNotificaciones(usuarioDetalle.tieneSuscripcionAvisos)}
                                    </button>
                                </div>
                            )}

                            <button type="button" onClick={() => {
                                cerrarMenu();
                                changeMenu(999);
                                setVerReglasNormas(true);
                                setNewTextRich(dataFull.normas);
                            }}>
                                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 10-1.5 0v1.5a.75.75 0 001.5 0v-1.5zM10 9a.75.75 0 00-.75.75v4a.75.75 0 001.5 0v-4A.75.75 0 0010 9z" clipRule="evenodd" />
                                </svg>
                                Reglas y Normas
                            </button>
                            <button type="button" onClick={() => {
                                cerrarMenu()
                                changeMenu(999)
                                setVerAvisos(true)
                                setLoading(true)
                                ObtenerAvisosLogic(selListadoAvisos, (mes + 1).toString(), localStorage.getItem("idCondominio")!.toString(), año.toString());
                            }}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="20px"
                                    viewBox="0 -960 960 960"
                                    width="20px"
                                    fill="currentColor"
                                >
                                    <path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z" />
                                </svg>
                                Calendario
                            </button>
                            <button type="button" onClick={() => {
                                cerrarMenu()
                                changeMenu(999);
                                setVerEmergencia(true)
                                setLoading(true)
                                ObtenerEmergenciasLogic(selObtenerEmergencia, localStorage.getItem("idCondominio")!.toString())
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="red">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M10.29 3.86L1.82 18a1 1 0 00.86 1.5h18.64a1 1 0 00.86-1.5L13.71 3.86a1 1 0 00-1.72 0zM12 9v4m0 4h.01" />
                                </svg>
                                Núm. Emergencias
                            </button>
                            <button type="button" onClick={() => {
                                cerrarMenu()
                                changeMenu(999);
                                cerrarSesion()
                            }}>
                                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path d="M14.707 7.793a1 1 0 0 0-1.414 0L11 10.086V1.5a1 1 0 0 0-2 0v8.586L6.707 7.793a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.416 0l4-4a1 1 0 0 0-.002-1.414Z" />
                                    <path d="M18 12h-2.55l-2.975 2.975a3.5 3.5 0 0 1-4.95 0L4.55 12H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-3 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
                                </svg>
                                Cerrar Sesión
                            </button>
                        </div>
                    )}
                </div>*/}
                <HuinchaSuperior
                    enComunidad={enComunidad}
                    onChangeAtras={handleVolverAtras}
                    imagenPerfil={imagenPerfil}
                    onChangeMenu={handleChangeMenu}
                />
                {(alerta.mensaje !== "" && !alertaCerrada) && mensajeSuperior()}
                <div className="container pb-5 mb-5">
                    <div className="row px-3 justify-content-around">
                        {
                            dataCondominios.length > 1 && !enComunidad &&
                            <>
                                {panelPrincipal()}
                            </>
                        }
                        {
                            iniciarSesion &&
                            <>
                                <Login
                                    usuario={loguear.usuario}
                                    clave={loguear.clave}
                                    onChange={handleChangeLogin}
                                    onLogin={login}
                                    loading={loading}
                                />
                            </>
                        }
                        {
                            (crear || editar) &&
                            <>
                                <AnunciosCrear
                                    anuncio={anuncio}
                                    onGuardar={(form: any, archivo: any) => {
                                        setArchivoTemp(archivo);
                                        setAnuncio(form);
                                        CrearAnuncio(form);
                                    }}
                                    onCancelar={() => {
                                        limpiarAnuncio();
                                        setCrear(false);
                                        setEditar(false);
                                    }}
                                    usuario={usuario}
                                />
                            </>
                        }
                        {
                            votaciones &&
                            <>
                                <VotacionPanel
                                    votaciones={dataVotaciones}
                                    onCambiarEstado={(votacion, activo) => {
                                        setLoading(true);
                                        CambiarEstadoVotacionLogic(selCambiarEstadoVotacion, votacion, activo, localStorage.getItem("idCondominio")!.toString(), usuario.id);
                                    }}
                                    onCambiarVoto={cambiarVoto}
                                    usuario={usuario}
                                    loading={loading}
                                />
                            </>
                        }
                        {
                            verEmergencia &&
                            <>
                                <Emergencia
                                    emergencia={emergencia}
                                    emergencias={emergenciaDetalle}
                                    onChange={handleChangeEmergencia}
                                    onGuardar={CrearEmergencia}
                                    onEliminar={EliminarEmergencia}
                                    onCancelar={() => {
                                        setEditarEmergencia(false);
                                    }}
                                    onSelect={SeleccionarEmergencia}
                                    rolUsuario={usuario.rol}
                                    loading={loading}
                                    modoEdicion={editarEmergencia}
                                />
                            </>
                        }
                        {
                            encuesta &&
                            <>
                                <VotacionCrear
                                    onCrear={(cabecera, descripcion, opciones) => {
                                        crearVotacion(cabecera, descripcion, opciones);
                                    }}
                                    loading={loading}
                                />
                            </>
                        }
                        {
                            verAvisos &&
                            <>
                                <AvisoPanel
                                    avisos={avisos}
                                    mensaje={mensajeAviso}
                                    fecha={fechaAviso}
                                    hora={horaAviso}
                                    mes={mes}
                                    año={año}
                                    colorEvento={colorAviso}
                                    onCambiarMes={cambiarMes}
                                    onChangeColor={(e) => setColorAviso(e)}
                                    onChangeMensaje={(e) => setMensajeAviso(e.target.value)}
                                    onChangeFecha={(e) => setFechaAviso(e)}
                                    onChangeHora={(e) => setHoraAviso(e.target.value)}
                                    onCrear={CrearAviso}
                                    onEliminar={(a) => EliminarAviso(a.id, a.fecha, a.mensaje)}
                                    onEnviarNotificacion={EnviarNotifAviso}
                                    loading={loading}
                                />
                            </>
                        }
                        {verPerfil &&
                            <>
                                <PerfilUsuario
                                    usuario={usuarioDetalle}
                                    onChange={handleChangePerfil}
                                    onGuardar={EditarPerfil}
                                    onCancelar={() => setEditarPerfil(false)}
                                    onImagenSeleccionada={(file) => setArchivoTemp(file)}
                                    loading={loading}
                                    onChangeCreateSub={createSuscripcion}
                                />
                            </>
                        }
                        {
                            verUsuarios &&
                            <>
                                {panelUsuarios()}
                            </>
                        }
                        {
                            verReglasNormas &&
                            <>
                                <ReglasNormasPanel
                                    normas={dataFull.normas}
                                    editando={editarTextRich}
                                    onChangeNormas={(e) => setNewTextRich(e.target.value)}
                                    onGuardar={() => {
                                        setLoading(true);
                                        CambiarNormasLogic(selCambiarNormas, newTextRich, localStorage.getItem("idCondominio")!.toString())
                                    }}
                                    onEditarToggle={() => setEditarTextRich(true)}
                                    onCancelar={() => { setEditarTextRich(false); setNewTextRich(dataFull.normas); }}
                                    loading={loading}
                                    puedeEditar={usuario.rol === "ADMINISTRADOR"}
                                    editorRef={editorRef}
                                    handleInput={handleInput}
                                    handleBlur={handleBlur}
                                    newTextRich={newTextRich}
                                />
                            </>
                        }
                        {verDetalle && tipo !== 2 &&
                            <>
                                <DetalleAnuncioPanel
                                    anuncio={dataDetalle}
                                    comentario={newComentario}
                                    onChangeComentario={changeComentario}
                                    onComentar={() => {
                                        if (newComentario.trim()) {
                                            CrearComentarioAnuncioLogic(selcrearComentarioAnuncio, {
                                                Id: 0,
                                                IdUsuario: usuario.id,
                                                NombreUsuario: usuario.nombre,
                                                IdAnuncio: dataDetalle.id,
                                                Mensaje: newComentario,
                                                Fecha: new Date()
                                            }, localStorage.getItem("idCondominio")!.toString());
                                            setNewComentario('');
                                        }
                                    }}
                                    onLike={() => handleLike(dataDetalle.id, true, true)}
                                    onCerrar={() => setVerDetalle(false)}
                                    loading={loading}
                                    imgError={imgError}
                                />
                            </>
                        }
                        {
                            verMisAnuncios &&
                            <>
                                <h2>Mis Publicaciones</h2>
                                {misAnuncios !== null && ordenarListado(misAnuncios).map((a: any, i: any) => (
                                    <AnunciosPanel
                                        key={i}
                                        anuncio={a}
                                        usuarioId={usuario.id}
                                        usuarioRol={usuario.rol}
                                        onEditar={cargarAnuncioParaEdit}
                                        onEliminar={EliminarAnuncio}
                                        onDeshabilitar={DeshabilitarAnuncio}
                                        onVerDetalle={(anuncio: any) => {
                                            setDataDetalle(anuncio);
                                            setVerDetalle(true);
                                            ObtenerAnuncioPorIdLogic(selObtenerAnuncioPorId, a.id);
                                        }}
                                        onLike={(id: any) => handleLike(id, true, false)}
                                        imgErrorUrl={imgError}
                                        loading={loading}
                                    />
                                ))}
                            </>
                        }
                        {
                            tipo < 3 && !iniciarSesion && !verPerfil && !crear && !editar && enComunidad && !verDetalle &&
                            <>
                                {dataFullParse.anuncios !== null && ordenarListado(dataFullParse.anuncios).map((a: any, i: any) => {
                                    if (Number(tipo) === Number(a.idTipo))
                                        return <AnunciosPanel
                                            key={i}
                                            anuncio={a}
                                            usuarioId={usuario.id}
                                            usuarioRol={usuario.rol}
                                            onEditar={cargarAnuncioParaEdit}
                                            onEliminar={EliminarAnuncio}
                                            onDeshabilitar={DeshabilitarAnuncio}
                                            onVerDetalle={(anuncio: any) => {
                                                setDataDetalle(anuncio);
                                                setVerDetalle(true);
                                                ObtenerAnuncioPorIdLogic(selObtenerAnuncioPorId, a.id);
                                            }}
                                            onLike={(id: any) => handleLike(id, true, false)}
                                            imgErrorUrl={imgError}
                                            loading={loading}
                                        />
                                }
                                )}
                            </>
                        }
                    </div>
                </div>
                {modalOpenImg && (
                    <div className="modal-overlay" onClick={closeModalImg}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <button className="close-btn" onClick={closeModalImg}>&times;</button>
                            <img src={imgSelect ?? ""}
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.onerror = null;
                                    target.src = imgError;
                                }}
                                alt="Imagen Ampliada" />
                        </div>
                    </div>
                )}
                <ToastContainer />
                {enComunidad && navegador()}
            </div>
        </React.Fragment>
    );
}

export default Condominio;