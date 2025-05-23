import React, { useEffect, useState, useRef } from "react";
import Loading from "../../components/utils/loading";
import './Condominio.css';
import { CambiarEstadoVotacionLogic, CambiarNormasLogic, CrearAnuncioLogic, CrearAvisosLogic, CrearComentarioAnuncioLogic, CrearEmergenciaLogic, CrearUsuarioLogic, CrearVotacionLogic, DarQuitarLikeLogic, DessuscribirNotificacionesLogic, EditUsuarioPorIdLogic, EliminarAnuncioLogic, EnviarNotifAvisoLogic, LoginLogic, ObteneCondominioLogic, ObtenerAnuncioPorIdLogic, ObtenerAvisosLogic, ObtenerEmergenciasLogic, ObtenerListadoAnuncioLogic, ObtenerMisAnuncioLogic, ObtenerUsuarioPorIdLogic, ObtenerUsuarioPorIdSinNotificiacionesLogic, ObtenerUsuariosLogic, ObtenerVotacionesLogic, SuscribirNotificaciones2Logic, SuscribirNotificacionesLogic, VotarLogic } from "../../presentation/view-model/Anuncio.logic";
import { ConfirmMessage } from "../../components/utils/messages";

import axios from 'axios';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';
import { ToastContainer, toast } from 'react-toastify';
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
import CryptoJS from "crypto-js";
import EspacioComun from "./espacioComun/EspacioComun";
import iconClose from '../../components/utils/img/menuInferior/close.png';
import iconBuscar from '../../components/utils/img/menuInferior/buscar-select.png';
import PanelUsuarios from "./usuarios/PanelUsuarios";

interface SafeSearchAnnotation {
    adult: string;
    violence: string;
    sexualContent: string;
    medical: string;
    racy: string;
}
const posicionAlertas = "bottom-left";
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
    const secret = "2b2463d9f3b093b61be6ce0adbdcc4a0f7e56776502d173a4cf4bb0a8f5d0e79";
    const [loading, setLoading] = useState(false);
    const app = initializeApp(firebaseConfig);
    const storage = getStorage(app);
    const [buscarDataFull, setBuscarDataFull] = useState("");
    const [imagenPerfil, setImagenPerfil] = useState("");

    const [editarTextRich, setEditarTextRich] = useState(false);
    const [actualizarData, setActualizarData] = useState(false);
    const [newTextRich, setNewTextRich] = useState("");
    const [textRichEditado, setTextRichEditado] = useState(false);
    const [verDetalleAvisos, setVerDetalleAvisos] = useState(false);
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


    const [tipo, setTipo] = useState(4)

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


    const [activeFilter, setActiveFilter] = useState("fechaDesde");
    const [buscarenmenu, setBuscarEnMenu] = useState(false);
    const [arrayImgUsers, setArrayImgUsers] = useState([{ nombre: "", url: "" }]);

    const [sinNotificaciones, setSinNotificaciones] = useState(false)

    const [logueado, setLogueado] = useState(false)
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
    const [iniciarSesion, setIniciarSesion] = useState(true)
    const [crear, setCrear] = useState(false)
    const [editar, setEditar] = useState(false)
    const [votaciones, setVotaciones] = useState(false)
    const [encuesta, setEncuesta] = useState(false)
    const [menuOpciones, setMenuOpciones] = useState(false)

    const [dataDetalle, setDataDetalle] = useState({ cabecera: "", descripcion: "", amedida: "", id: "", telefono: "", likes: [], organizador: "", fechaDesde: new Date(), fechaHasta: new Date(), comentarios: [], esVideo: false, imgOrganizador: "" })
    const [verDetalle, setVerDetalle] = useState(false)
    const menuRef = useRef(null);
    const [nombreComunidad, setNombreComunidad] = useState("")
    const [anuncio, setAnuncio] = useState({
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
    });
    const [active, setActive] = useState('calendario');
    const [menuAnterior, setMenuAnterior] = useState('calendario');
    const [newComentario, setNewComentario] = useState('')
    const [verPerfil, setVerPerfil] = useState(false)
    const [verUsuarios, setVerUsuarios] = useState(false)
    const [diaMesSelect, setDiaMesSelect] = useState({ dia: 0, mes: 0, anio: 0 })
    const [verReglasNormas, setVerReglasNormas] = useState(false)
    const [verAvisos, setVerAvisos] = useState(false)

    const [verEmergencia, setVerEmergencia] = useState(false)


    const [verPuntosInteres, setVerPuntosInteres] = useState(false)
    const [emergencia, setEmergencia] = useState({
        id: 0,
        descripcion: '',
        telefono: '',
        idcondominio: 0,
        direccion: ''
    })


    const [verEspacioComun, setVerEspacioComun] = useState(false)
    const [serviceWorker, setServiceWorker] = useState({})


    function formatToLocalISOString(date: Date) {
        const pad = (n: number) => n.toString().padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T00:00:00`;
    }

    const filters = [
        { label: "Fecha", key: "fechaDesde" },
        { label: "Likes", key: "likes" },
        { label: "Comentarios", key: "cantComentarios" }
    ];


    const [alignment, setAlignment] = useState("Todo");

    const handleChange = (value: any) => {
        switch (value) {
            case "Todo":
                cerrarMenu(); changeMenu(4); setLoading(true); ObtenerListadoAnuncioLogic(selListadoAnuncios, localStorage.getItem("idCondominio")!.toString());
                break;
            case "Anuncios":
                cerrarMenu(); changeMenu(1);
                break;
            case "Ventas":
                cerrarMenu(); changeMenu(0)
                break;
            case "Reclamos":
                cerrarMenu(); changeMenu(2)
                break;
            case "Servicios":
                cerrarMenu(); changeMenu(3)
                break;
            default:
                break;
        }
        setAlignment(value);
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
            fechaHasta: new Date(new Date().setMonth(new Date().getMonth() + 1)),
            idTipo: 1,
            idUsuario: usuario.id,
            activo: true,
            esVideo: false
        })
        setVerDetalle(false);
    }

    const imgError = "https://media1.tenor.com/m/Ord0OyTim_wAAAAC/loading-windows11.gif";

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

    const obtenerImgenesPerfil = async () => {
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
            setArrayImgUsers(arrayArchivos);
            return arrayArchivos;
        } catch (error) {
            console.error("Error al listar archivos:", error);
            return [];
        }
    };

    /* useEffect(() => {
        if (navigator.onLine) {
            if ((localStorage.getItem("ZXN0byBlcyBzZWNyZXRv") && localStorage.getItem("ZXN0byBlcyBzZWNyZXRv") != 'undefined')) {
                const jsonData = JSON.stringify(deserializeFromAscii(localStorage.getItem("ZXN0byBlcyBzZWNyZXRv")!));
                const hash = CryptoJS.HmacSHA256(jsonData, secret).toString();
                const paquete = {
                    datos: jsonData,
                    firma: hash
                };
                LoginLogic(selLogin, paquete, false)
            }
            else {
                cerrarSesion()
            }
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
    }, []) */
    useEffect(() => {
        if (navigator.onLine && logueado) {
            if ((localStorage.getItem("ZXN0byBlcyBzZWNyZXRv") && localStorage.getItem("ZXN0byBlcyBzZWNyZXRv") != 'undefined')) {
                const jsonData = JSON.stringify(deserializeFromAscii(localStorage.getItem("ZXN0byBlcyBzZWNyZXRv")!));
                const hash = CryptoJS.HmacSHA256(jsonData, secret).toString();
                const paquete = {
                    datos: jsonData,
                    firma: hash
                };
                LoginLogic(selLogin, paquete, false)
            }
            else {
                cerrarSesion()
            }
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
            setEnComunidad(true)
            setLoading(false)
        }
    }, [logueado])

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

        if (isIos() && isAndroid()) {
            return false;
        }

        return isSecure && hasServiceWorker && hasPushManager;
    }

    async function registerPush() {
        if (!supportsPushNotifications()) {
            return;
        }

        try {
            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
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
        localStorage.clear();
        cerrarMenu()
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
            /* if (verMisAnuncios) {
                ObtenerMisAnuncioLogic(selMisAnuncios, usuario.id.toString(), usuario.id.toString())
            } else { */
            setDataFull(data);
            setActualizarData(true);
            setLoading(false);
            /* } */
        } catch (er) {
            toast.error('Error al eliminar anuncio", "Favor intentarlo nuevamente en unos minutos', {
                position: posicionAlertas,
            });
        }
    }

    const uploadVideo = (files: any) => {
        const file = files[0];

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

    const eliminarComentario = (id: number) => {
        CrearComentarioAnuncioLogic(selcrearComentarioAnuncio, {
            Id: id,
            IdUsuario: usuario.id,
            NombreUsuario: usuario.nombre,
            IdAnuncio: dataDetalle.id,
            Mensaje: "",
            Fecha: new Date()
        }, localStorage.getItem("idCondominio")!.toString(), true);
    }





    function deserializeFromAscii<T>(asciiStr: string): T {
        const bytes = asciiStr.split(',').map(Number);
        const json = String.fromCharCode(...bytes);
        return JSON.parse(json);
    }

    const selLogin = (error: Boolean, err: string, data: any) => {
        try {
            setLoading(false);
            if (data.nombre && data.nombre != null && data.nombre != "") {
                setUsuario(data);
                setTipo(4)
                setIniciarSesion(false)

                setDataCondominios(data.condominios);

                if (localStorage.getItem("idCondominio")) {
                    let condSelect = data.condominios.filter((a: any) => a.id.toString() === localStorage.getItem("idCondominio")!.toString());
                    if (new Date(condSelect[0].fechaCaducidad) < new Date()) {
                        cerrarSesion();
                    } else {
                        /* setLoading(true); */
                        setEnComunidad(true); ObtenerListadoAnuncioLogic(selListadoAnuncios, localStorage.getItem("idCondominio")!.toString())
                    }
                } else {
                    if (data.condominios.length === 1 && new Date(data.condominios[0].fechaCaducidad) > new Date()) {
                        setEnComunidad(true);
                        /* setLoading(true); */
                        ObtenerListadoAnuncioLogic(selListadoAnuncios, data.condominios[0].id); localStorage.setItem("idCondominio", data.condominios[0].id)
                    } else if (data.condominios.length === 1 && new Date(data.condominios[0].fechaCaducidad) < new Date()) {
                        cerrarSesion();
                        toast.info('Su usuario no tiene comunidades activas', {
                            position: posicionAlertas,
                        });
                    }
                }

                /*INICIO SE ABRE CALENDARIO COMO PRINCIPAL*/
                cerrarMenu()
                changeMenu(999)
                setVerAvisos(true)
                /* setLoading(true) */
                /* ObtenerAvisosLogic(selListadoAvisos, (5 + 1).toString(), localStorage.getItem("idCondominio")!.toString(), "2025".toString()); */
                /*FIN SE ABRE CALENDARIO COMO PRINCIPAL*/
                obtenerImgenesPerfil();
            }
            else {
                toast.info('Credenciales incorrectas', {
                    position: posicionAlertas,
                });
                localStorage.clear();
                cerrarSesion()
            }
            if (err) {
                SuscripcionTotal(0, data)
            }
        } catch (er) {
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


    const CrearAnuncio = (form: any, archivoTemp: File | null) => {
        let anuncioParse = form;
        if (archivoTemp) {
            guardarArchivo(4, archivoTemp);
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




    const selCrearAnuncio = (error: Boolean, err: string, data: any) => {
        try {
            if (data) {
                setTipo(4);
                setCrear(false);
                setEditar(false);
                limpiarAnuncio();
                toast.success('Anuncio creado correctamente', {
                    position: posicionAlertas,
                });
            }
            else {
                toast.info('Error al intentar crear publicación. Comuníquese con el Administrador.', {
                    position: posicionAlertas,
                });
            }
            setDataFull(data);
            setActualizarData(true);
            setLoading(false);
            setAnuncio({
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
            })
        } catch (er) {
            toast.info('Error al intentar crear publicación. Comuníquese con el Administrador.', {
                position: posicionAlertas,
            });
        }
    }
    const selDeshabilitarAnuncio = (error: Boolean, err: string, data: any) => {
        try {
            if (data) {
                setCrear(false);
                setEditar(false);
                limpiarAnuncio();
                toast.success('Anuncio deshabilitado correctamente', {
                    position: posicionAlertas,
                });
            }
            else {
                toast.info('Error al deshabilitar anuncio. Comuníquese con el Administrador.', {
                    position: posicionAlertas,
                });
            }
            if (tipo === 8) {
                setLoading(true);
                /*  ObtenerMisAnuncioLogic(selMisAnuncios, usuario.id.toString(), usuario.id.toString()); */
            } else {
                setDataFull(data);
                setActualizarData(true);
                setLoading(false);
            }

        } catch (er) {
            toast.info('Error al deshabilitar anuncio. Comuníquese con el Administrador.', {
                position: posicionAlertas,
            });
        }
    }






    const selListadoAnuncios = (error: Boolean, err: string, data: any) => {
        try {
            if (data) {
                setNombreComunidad(data.nombre);
                setDataFull(data);
                setActualizarData(true);
                guardarUltimoRegistro(data, 'anuncios')
            } else {
            }
            setLoading(false);
        } catch (er) {
        }
    }
    const guardarUltimoRegistro = async (ultimoRegistro: any, nombre: string) => {
        try {

            await AsyncStorage.setItem(nombre, JSON.stringify(ultimoRegistro));
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


    /* const selListadoAvisos = (error: Boolean, err: string, data: any) => {
        try {
            if (data) {
                setAvisos(data);
            }
            setLoading(false);
        } catch (er) {
        }
    } */

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
                break;
            case "mispublicaciones":
                cerrarMenu();
                /* setVerMisAnuncios(true) */
                setTipo(8);
                break;
            case "comunidad":
                cerrarMenu()
                changeMenu(999);
                setVerUsuarios(true)
                break;
            case "crearAnuncio":
                setTipo(4);
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
                changeMenu(4);
                setAlignment("Todo")
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
                break;
            case "numEmergencias":
                cerrarMenu();
                changeMenu(999);
                setVerEmergencia(true);
                /* setLoading(true); */
                /* ObtenerEmergenciasLogic(selObtenerEmergencia, localStorage.getItem("idCondominio")!.toString()) */
                break;
            case "cerrarSesion":
                cerrarMenu();
                changeMenu(999);
                cerrarSesion();
                break;
            case "espacioComun":
                cerrarMenu();
                changeMenu(999);
                setVerEspacioComun(true);
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
        setVerUsuarios(false);
        setVerReglasNormas(false);
        setVerDetalleAvisos(false);
        if (a === 5) {
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

    const guardarArchivo = (tipoArchivo: number = 1, archivoAsubir: File | null = null) => {
        if (archivoAsubir && !(archivoAsubir.size > 100000000)) {
            if (tipoArchivo === 4) {
                const storageRef = ref(storage, `comunidad-${localStorage.getItem("idCondominio")}/${archivoAsubir.name}`);
                const uploadTask = uploadBytes(storageRef, archivoAsubir);
            } else {
                const storageRef = ref(storage, `perfiles/${archivoAsubir.name}`);
                const uploadTask = uploadBytes(storageRef, archivoAsubir);
            }
        } else if (archivoAsubir && (archivoAsubir.size > 100000000)) {
            alert("El archivo pesa mas de 100 MB")
        }
    }

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
            DarQuitarLikeLogic(selDarQuitarLike, id, usuario.id, usuario.nombre)
        }
        if (esPantallaComentario) {
            setLoading(true);
            ObtenerAnuncioPorIdLogic(selObtenerAnuncioPorId, dataDetalle.id)
        }
    };

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
            <BottomNav
                onChangeMenu={handleChangeMenu}
                active={active}
                orden={orden}
                usuario={usuario}
                onChangeCriterio={handleChangeCriterio}
                onFiltrarDataFull={filtrarDataFull}
                onChangeOrden={handleChangeOrden}
            />
        </div >
    }

    /* const panelPrincipal = () => {
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
    } */

    const selcrearComentarioAnuncio = (error: Boolean, err: string, data: any) => {
        try {
            if (data) {
                if (data) {
                    let newData = data;

                    if (newData.amedida && !newData.amedida.includes("http")) {
                        const imageRef = ref(storage, `comunidad-${localStorage.getItem("idCondominio")}/${newData.amedida.replace("video-", "").replace("img-", "")}`);

                        const esVideo = /\.(mp4|webm|ogg|mov|avi|mkv)(\?|&|$)/i.test(imageRef.fullPath)

                        getDownloadURL(imageRef)
                            .then((url) => {
                                newData.amedida = url;
                                newData.esVideo = esVideo;
                                setDataDetalle(newData);
                                setLoading(false);
                            })
                            .catch((_err) => {
                                console.error(_err);
                            });

                    } else {
                        const esVideo = /\.(mp4|webm|ogg|mov|avi|mkv)(\?|&|$)/i.test(newData.amedida.fullPath)
                        newData.esVideo = esVideo;
                        setDataDetalle(newData);
                        setLoading(false);
                    }
                }
            }
            if (err) {
                toast.success("Comentario eliminado correctamente.", {
                    position: posicionAlertas,
                });
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

                    const esVideo = /\.(mp4|webm|ogg|mov|avi|mkv)(\?|&|$)/i.test(imageRef.fullPath)

                    getDownloadURL(imageRef)
                        .then((url) => {
                            newData.amedida = url;
                            newData.esVideo = esVideo;
                            setDataDetalle(newData);
                            setLoading(false);
                            setVerDetalle(true);
                        })
                        .catch((err) => {
                            console.error(err);
                        });

                } else {
                    const esVideo = /\.(mp4|webm|ogg|mov|avi|mkv)(\?|&|$)/i.test(newData.amedida)
                    newData.esVideo = esVideo;
                    setDataDetalle(newData);
                    setLoading(false);
                    setVerDetalle(true);
                }
            }
        } catch (er) {
        }
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

    const noFiltrar = () => {
        setDataFullParse(dataFull);
        setBuscarEnMenu(false);
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
                setDataFull(data);
                setActualizarData(true);
                setLoading(false);
                toast.success('Normas editadas correctamente', {
                    position: posicionAlertas,
                });
            }
            else {
                toast.info('Error al cambiar las normas. Comuníquese con el Administrador.', {
                    position: posicionAlertas,
                });
            }
        } catch (er) {
            toast.info('Error al cambiar las normas. Comuníquese con el Administrador.', {
                position: posicionAlertas,
            });
        }
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
    const cerrarMenu = () => {
        setAlerta({ tipo: 1, mensaje: "" })
        setAlertaCerrada(false);
        setMenuOpciones(false)
        setVerPerfil(false)
        /* setVerMisAnuncios(false); */
        setCrear(false)
        setEditar(false)
        setVerUsuarios(false);
        setVerReglasNormas(false);
        setVerAvisos(false)
        setVerPuntosInteres(false)
        setVerEmergencia(false)
        setVotaciones(false);
        setOpenCrear(false);
        setEncuesta(false);
        setVerEspacioComun(false);
        noFiltrar();
    }


    const changeComentario = (ev: any) => {
        setNewComentario(ev)
    }



    useEffect(() => {
        if (!menuOpciones) return;

        const handleClickOutside = (event: any) => {
            if (menuRef.current && !(menuRef.current as any).contains(event.target)) {
                if (event.target.id !== "iconoMenuSup") {
                    setMenuOpciones(false);
                }
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuOpciones]);

    async function SuscripcionTotal(tipoSuscripcion: any, _usuario: any) {
        var result: any = await solicitarPermisoNotificaciones()
        if (result && localStorage.getItem("idCondominio")) {
            SuscribirNotificaciones2Logic(selSuscribir2, localStorage.getItem("idCondominio")!.toString(), _usuario.id, tipoSuscripcion, result, false)
        }
    }
    const selSuscribir2 = (error: Boolean, err: string, data: any, notificar: boolean) => {
        try {
        } catch (er) {
        }
    }

    const [openCrear, setOpenCrear] = useState(false);


    const inputBuscarRef = useRef(null);

    const handleClickBuscar = () => {
        setBuscarEnMenu(true);
        setTimeout(() => {
            inputBuscarRef.current && (inputBuscarRef.current as HTMLInputElement).focus();
        }, 0);
    };

    /////////////////////////////////////////////////////////////////////////////////////////////////////
    return (
        <React.Fragment>
            <div>
                {
                    loading ?
                        <Loading />
                        : ""}
                <HuinchaSuperior
                    nombre={nombreComunidad}
                    enComunidad={enComunidad}
                    onChangeAtras={handleVolverAtras}
                    imagenPerfil={imagenPerfil}
                    onChangeMenu={handleChangeMenu}
                />
                {(alerta.mensaje !== "" && !alertaCerrada) && mensajeSuperior()}
                {
                    (tipo <= 4 && !iniciarSesion && !verPerfil && !crear && !editar && enComunidad && !verDetalle && !encuesta) && (
                        <>
                            <div
                                role="group"
                                aria-label="Platform"
                                className="btn-group-toggle-custom d-flex justify-content-center"
                            >
                                {["Todo", "Anuncios", "Ventas", "Reclamos"].map((platform) => (
                                    <button
                                        key={platform}
                                        type="button"
                                        className={`btn btn-toggle ${alignment === platform ? "active" : ""
                                            }`}
                                        aria-pressed={alignment === platform}
                                        onClick={() => handleChange(platform)}
                                    >
                                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                                    </button>
                                ))}
                            </div>
                            {!buscarenmenu ?
                                <button
                                    className={`nav-button shadow iconbuscarAnuncios`}
                                    onClick={handleClickBuscar}
                                    aria-label="Buscar"
                                >
                                    <img src={iconBuscar} />
                                </button>
                                :
                                <nav className="bottom-nav" style={{ height: '155px' }}>
                                    <img src={iconClose} style={{ position: 'absolute', top: '7px', right: '7px', cursor: 'pointer' }} onClick={noFiltrar} />
                                    <div className="search-menu-container">
                                        <div className="filters">
                                            <span
                                                key={1}
                                                className={`filter`}
                                            >
                                                Ordenar por:
                                            </span>
                                            {filters.map((f) => (
                                                <span
                                                    key={f.key}
                                                    className={`filter${activeFilter === f.key ? " active" : ""}`}
                                                    onClick={() => { handleChangeCriterio(f.key); setActiveFilter(f.key) }}
                                                >
                                                    {f.label}
                                                </span>
                                            ))}
                                            <button
                                                onClick={() => { handleChangeOrden(orden === 'asc' ? 'desc' : 'asc') }}
                                                className="iconoFiltro" title="Cambiar orden">
                                                <img width={20} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAACxAAAAsQHGLUmNAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAJNJREFUSIntlEEKwyAQRR+9Qwd6/zO0WYZ2W7tJCzlOssgIQ8DWxnGlHz4K6n8i+KF1CRDU4h1+BiZgUc/ApVa4K0SAtwbG0c4/ZD7XXb3XywSKAVhwyAHEg3tdgae5pd0nuvYoAfy175RDKlEHdIAvYCDdisL2g28lsMCxChjVP+VWYt9UtYZTENfwqNiKtjUb1QonJEYB7NA3+gAAAABJRU5ErkJggg==" />
                                            </button>
                                        </div>
                                        <div className="search-bar">
                                            <span className="search-icon">
                                                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                                                    <circle cx="11" cy="11" r="7" stroke="#222" strokeWidth="2" />
                                                    <line x1="16.65" y1="16.65" x2="21" y2="21" stroke="#222" strokeWidth="2" strokeLinecap="round" />
                                                </svg>
                                            </span>
                                            <input
                                                ref={inputBuscarRef}
                                                type="text"
                                                placeholder="Buscar por título o creador"
                                                onChange={filtrarDataFull}
                                            />
                                        </div>
                                    </div>
                                </nav>
                            }
                        </>
                    )}
                <div className={`container pb-5 mb-5`}>
                    <div className={`row px-2 justify-content-around ${buscarenmenu ? "mb-5" : ""}`}>
                        {
                            iniciarSesion &&
                            <>
                                <Login
                                    onLogin={() => {
                                        cerrarSesion();
                                        setLogueado(false)
                                    }}
                                    logueado={() => { setIniciarSesion(false); setLogueado(true) }}
                                />
                            </>
                        }
                        {/* {
                            (dataCondominios.length > 1 && !enComunidad) &&
                            <>
                                {panelPrincipal()}
                            </>
                        } */}

                        {
                            (crear || editar) &&
                            <>
                                <AnunciosCrear
                                    anuncio={anuncio}
                                    onGuardar={(form: any, archivo: any) => {
                                        setAnuncio(form);
                                        CrearAnuncio(form, archivo);
                                    }}
                                    onCancelar={() => {
                                        limpiarAnuncio();
                                        setCrear(false);
                                        setEditar(false);
                                    }}
                                    imgError={imgError}
                                    usuario={usuario}
                                    crear={crear}
                                    editar={editar}
                                />
                            </>
                        }
                        {
                            votaciones &&
                            <>
                                <VotacionPanel
                                    arrayImgUsers={arrayImgUsers}
                                    usuario={usuario}
                                />
                            </>
                        }
                        {
                            verEmergencia &&
                            <>
                                <Emergencia
                                    rolUsuario={usuario.rol}
                                />
                            </>
                        }
                        {
                            encuesta &&
                            <>
                                <VotacionCrear
                                    usuario={usuario}
                                />
                            </>
                        }
                        {
                            verAvisos &&
                            <>
                                <AvisoPanel
                                    usuario={usuario}
                                />
                            </>
                        }
                        {verPerfil &&
                            <>
                                <PerfilUsuario
                                    usuario={usuario}
                                    sinNotificaciones={sinNotificaciones}
                                />
                            </>
                        }
                        {
                            verUsuarios &&
                            <>
                                {/* {panelUsuarios()} */}
                                <PanelUsuarios
                                    usuario={usuario}
                                />
                            </>
                        }
                        {
                           /*  verReglasNormas &&
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
                            </> */
                        }
                        {(verDetalle) &&
                            <>
                                <DetalleAnuncioPanel
                                    anuncio={dataDetalle}
                                    comentario={newComentario}
                                    onChangeComentario={changeComentario}
                                    user={usuario}
                                    arrayImgUsers={arrayImgUsers}
                                    onComentar={() => {
                                        if (newComentario.trim()) {
                                            CrearComentarioAnuncioLogic(selcrearComentarioAnuncio, {
                                                Id: 0,
                                                IdUsuario: usuario.id,
                                                NombreUsuario: usuario.nombre,
                                                IdAnuncio: dataDetalle.id,
                                                Mensaje: newComentario,
                                                Fecha: new Date()
                                            }, localStorage.getItem("idCondominio")!.toString(), false);
                                            setNewComentario('');
                                        }
                                    }}
                                    onEliminar={eliminarComentario}
                                    onLike={() => handleLike(dataDetalle.id, true, true)}
                                    onCerrar={() => setVerDetalle(false)}
                                    loading={loading}
                                    imgError={imgError}
                                />
                            </>
                        }
                        {
                            /*  (verMisAnuncios && !verDetalle) &&
                             <>
                                 <h2 className="col-12 text-center mt-4">{usuarioComunidad ? "PUBLICACIONES" : "MIS PUBLICACIONES"}</h2>
                                 {misAnuncios !== null && !loading && ordenarListado(misAnuncios).map((a: any, i: any) => (
                                     <AnunciosPanel
                                         key={i}
                                         anuncio={a}
                                         usuarioId={usuario.id}
                                         usuarioRol={usuario.rol}
                                         arrayImgUsers={arrayImgUsers}
                                         onEditar={cargarAnuncioParaEdit}
                                         onEliminar={EliminarAnuncio}
                                         onDeshabilitar={DeshabilitarAnuncio}
                                         onVerDetalle={(anuncio: any) => {
                                             setLoading(true);
                                             ObtenerAnuncioPorIdLogic(selObtenerAnuncioPorId, a.id);
                                         }}
                                         onLike={(id: any) => handleLike(id, true, false)}
                                         imgErrorUrl={imgError}
                                         loading={loading}
                                     />
                                 ))}
                             </> */
                        }
                        {
                            (tipo <= 4 && !iniciarSesion && !encuesta && !verPerfil && !crear && !editar && enComunidad && !verDetalle && !verEspacioComun) &&
                            <div className="mt-4 row justify-content-around">
                                {dataFullParse.anuncios !== null && ordenarListado(dataFullParse.anuncios).map((a: any, i: any) => {
                                    if (Number(tipo) === Number(a.idTipo) || Number(tipo) === 4)
                                        return <AnunciosPanel
                                            key={i}
                                            anuncio={a}
                                            usuarioId={usuario.id}
                                            usuarioRol={usuario.rol}
                                            arrayImgUsers={arrayImgUsers}
                                            onEditar={cargarAnuncioParaEdit}
                                            onEliminar={EliminarAnuncio}
                                            onDeshabilitar={DeshabilitarAnuncio}
                                            onVerDetalle={(anuncio: any) => {
                                                setLoading(true);
                                                ObtenerAnuncioPorIdLogic(selObtenerAnuncioPorId, a.id);
                                            }}
                                            onLike={(id: any) => handleLike(id, true, false)}
                                            imgErrorUrl={imgError}
                                            loading={loading}
                                        />
                                }
                                )}
                            </div>
                        }
                    </div>
                    {
                        verEspacioComun &&
                        <EspacioComun onSelect={() => setVerEspacioComun(false)} usuario={usuario} /* listadoUsuarios={listadousuarios} */ />
                    }
                </div>
                <ToastContainer />
                {enComunidad && navegador()}
            </div>
        </React.Fragment>
    );
}

export default Condominio;