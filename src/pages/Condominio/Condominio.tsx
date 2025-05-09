import React, { useEffect, useState, useRef } from "react";
import Loading from "../../components/utils/loading";
import './Condominio.css';
import { CambiarEstadoVotacionLogic, CambiarNormasLogic, CrearAnuncioLogic, CrearAvisosLogic, CrearComentarioAnuncioLogic, CrearEmergenciaLogic, CrearUsuarioLogic, CrearVotacionLogic, DarQuitarLikeLogic, DessuscribirNotificacionesLogic, EditUsuarioPorIdLogic, EliminarAnuncioLogic, EnviarNotifAvisoLogic, LoginLogic, ObteneCondominioLogic, ObtenerAnuncioPorIdLogic, ObtenerAvisosLogic, ObtenerEmergenciasLogic, ObtenerListadoAnuncioLogic, ObtenerMisAnuncioLogic, ObtenerUsuarioPorIdLogic, ObtenerUsuariosLogic, ObtenerVotacionesLogic, SuscribirNotificaciones2Logic, SuscribirNotificacionesLogic, VotarLogic } from "../../presentation/view-model/Anuncio.logic";
import { ConfirmMessage, ErrorMessage, SuccessMessage } from "../../components/utils/messages";
import iconmenos from './../../components/utils/img/icon-menos.png';
import actualizar from './../../components/utils/img/actualizar-flecha.png';
import menuicon from './../../components/utils/img/menuicon.png';
import volver from './../../components/utils/img/volver.png';
import iconeditar from './../../components/utils/img/editar.png';
import iconborrar from './../../components/utils/img/iconborrar.png';
import notificar from './../../components/utils/img/notificar.png';
import logo from './../../components/utils/img/logo.png';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';
import { ToastContainer, toast } from 'react-toastify';
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
    const [archivoTemp, setArchivoTemp] = useState<File | null>(null);
    const [editImgPerfil, setEditImgPerfil] = useState(false);
    const [agregarUsuario, setAgregarUsuario] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editarTextRich, setEditarTextRich] = useState(false);
    const [actualizarData, setActualizarData] = useState(false);
    const [newTextRich, setNewTextRich] = useState("");
    const [textRichEditado, setTextRichEditado] = useState(false);
    const [verDetalleAvisos, setVerDetalleAvisos] = useState(false);
    const [tipoSubir, setTipoSubir] = useState(0);
    const [dataCondominios, setDataCondominios] = useState([]);
    const [dataArchivosComunidad, setDataArchivosComunidad] = useState([{ nombre: "test", url: "test" }]);
    const [enComunidad, setEnComunidad] = useState(false);
    const [open, setOpen] = useState(false);
    const [dataFull, setDataFull] = useState<DataFull>({
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
        nombre: "",
        tieneSuscripcionMensajes: false,
        tieneSuscripcionVotaciones: false,
        tieneSuscripcionAnuncios: false,
        tieneSuscripcionAvisos: false,
        rol: "",
        id: 0
    });
    const [listadousuarios, setUsuarios] = useState([{ nombre: "", rol: "", fechaCaducidad: "", activo: false, direccion: "", telefono: "", tieneSuscripcionAnuncios: false, tieneSuscripcionMensajes: false, tieneSuscripcionVotaciones: false, tieneSuscripcionAvisos: false, imagen: "" }]);
    const [listadousuariosParse, setUsuariosParse] = useState([{ nombre: "", rol: "", fechaCaducidad: "", activo: false, direccion: "", telefono: "", tieneSuscripcionAnuncios: false, tieneSuscripcionMensajes: false, tieneSuscripcionVotaciones: false, tieneSuscripcionAvisos: false, imagen: "" }]);
    const [dataUserSelect, setDataUserSelect] = useState({ nombre: "", rol: "", fechaCaducidad: "", activo: false, direccion: "", telefono: "", tieneSuscripcionAnuncios: false, tieneSuscripcionMensajes: false, tieneSuscripcionVotaciones: false, tieneSuscripcionAvisos: false, imagen: "" });
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

    /* {
        id: 0,
                idUsuario: 0,
                idAnuncio: 0,
                mensaje: "",
                nombreUsuario: "",
                fecha: new Date()
            } */

    const limpiarAnuncio = () => {
        setAnuncio({
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
        })
        setVerDetalle(false);
    }

    const imgError = "https://media1.tenor.com/m/Ord0OyTim_wAAAAC/loading-windows11.gif";

    //const [imgError, setImgError] = useState("https://img.freepik.com/vector-premium/imagen-no-es-conjunto-iconos-disponibles-simbolo-vectorial-stock-fotos-faltante-defecto-estilo-relleno-delineado-negro-signo-no-encontro-imagen_268104-6708.jpg");

    /*const obtenerAchivosComunidad = () => {
        const folderRef = ref(storage, `comunidad-${localStorage.getItem("idCondominio")}/`);
        console.log(folderRef);
        let arrayArchivos: any = [];
        listAll(folderRef)
            .then((res: any) => {
                res.items.forEach((itemRef: any) => {
                    // Obtener el nombre del archivo
                    const nombreArchivo = itemRef.name;

                    // Obtener la URL de descarga
                    getDownloadURL(itemRef).then((url) => {
                        arrayArchivos.push({
                            nombre: nombreArchivo,
                            url: url
                        })
                    });
                });
            })
            .catch((error: any) => {
                console.error('Error al listar archivos:', error);
            });

        setDataArchivosComunidad(arrayArchivos)
    }

    useEffect(() => {
        if (actualizarData) {
            obtenerAchivosComunidad();
            let newDataFull = dataFull;
            newDataFull.anuncios.map((a: any) => {
                let matchArchivo = dataArchivosComunidad.filter((b: any) => b.nombre === a.amedida.replace("video-", "").replace("img-", ""));
                if (matchArchivo[0]) {
                    a.amedida = matchArchivo[0].url;
                }
            })

            if (JSON.stringify(newDataFull) !== JSON.stringify(dataFull)) {
                setDataFull(newDataFull);
            }
        }

    }, [actualizarData])*/

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
                    const nombreBuscado = a.amedida?.replace("video-", "").replace("img-", "") || "";
                    const matchArchivo = archivos.find((b: any) => b.nombre === nombreBuscado);
                    return {
                        ...a,
                        amedida: matchArchivo ? matchArchivo.url : a.amedida,
                        esVideo: matchArchivo ? matchArchivo.esVideo : false
                    };
                }),
            };

            if (JSON.stringify(newDataFull) !== JSON.stringify(dataFull)) {
                setDataFull(newDataFull);
            }

            setActualizarData(false);
        };

        cargarDatos();
    }, [actualizarData]);

    useEffect(() => {
        if (localStorage.getItem("idCondominio")) {
            const cargarDatos = async () => {
                const archivos = await obtenerArchivosComunidad(localStorage.getItem("idCondominio")!);
                setDataArchivosComunidad(archivos);
            }
            cargarDatos();
        }
        registerPush();
        if ((localStorage.getItem("nombreUsuario") && localStorage.getItem("nombreUsuario") != 'undefined') &&
            /*localStorage.getItem("tieneSuscripcionMensajes") &&
            localStorage.getItem("tieneSuscripcionVotaciones") &&
            localStorage.getItem("tieneSuscripcionAnuncios") &&
            localStorage.getItem("tieneSuscripcionAvisos") &&*/
            (localStorage.getItem("rolUsuario") && localStorage.getItem("nombreUsuario") != 'undefined') &&
            (localStorage.getItem("clave") && localStorage.getItem("nombreUsuario") != 'undefined') &&
            (localStorage.getItem("idUsuario") && localStorage.getItem("nombreUsuario") != 'undefined')) {

            LoginLogic(selLogin, {
                usuario: localStorage.getItem("nombreUsuario"),
                clave: localStorage.getItem("clave"),
                idCondominio: 0
            })
            /*setUsuario({
                nombre: localStorage.getItem("nombreUsuario") ?? "",
                tieneSuscripcionMensajes: localStorage.getItem("tieneSuscripcionMensajes") === "true",
                tieneSuscripcionVotaciones: localStorage.getItem("tieneSuscripcionVotaciones") === "true",
                tieneSuscripcionAnuncios: localStorage.getItem("tieneSuscripcionAnuncios") === "true",
                tieneSuscripcionAvisos: localStorage.getItem("tieneSuscripcionAvisos") === "true",
                rol: localStorage.getItem("rolUsuario") ?? "",
                id: parseInt(localStorage.getItem("idUsuario") ?? "")
            })*/
        }
        else {
            cerrarSesion()
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
            /* alert((serviceWorker as any).endpoint) */
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

            // Envía la suscripción al backend
            setServiceWorker(subscription)


        } catch (err) {
        }
    }



    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js').catch(console.error);
        });
    }



    ///////////////////////////////////////////////////////////////////

    const cerrarSesion = () => {
        localStorage.removeItem("nombreUsuario");
        localStorage.removeItem("tieneSuscripcionMensajes");
        localStorage.removeItem("tieneSuscripcionVotaciones");
        localStorage.removeItem("tieneSuscripcionAnuncios");
        localStorage.removeItem("tieneSuscripcionAvisos");
        localStorage.removeItem("rolUsuario");
        localStorage.removeItem("idUsuario");
        localStorage.removeItem("clave");
        localStorage.removeItem("idCondominio");
        setDataCondominios([]);
        setUsuario({
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
                //SuccessMessage("Anuncio eliminado correctamente.")
                toast.success('Anuncio eliminado correctamente', {
                    position: posicionAlertas,
                });
                /* ObtenerListadoAnuncioLogic(selListadoAnuncios, localStorage.getItem("idCondominio")!.toString()); */
                /* setTipo(1) */
            }
            else {
                //ErrorMessage("Error al eliminar anuncio", "Favor intentarlo nuevamente en unos minutos")
                toast.error('Error al eliminar anuncio", "Favor intentarlo nuevamente en unos minutos', {
                    position: posicionAlertas,
                });
                /* ObtenerListadoAnuncioLogic(selListadoAnuncios, localStorage.getItem("idCondominio")!.toString()); */
                /* setTipo(1) */
            }
            setDataFull(data);
            setMisAnuncios(data.anuncios);
            setActualizarMisAnuncios(true);
            setActualizarData(true);
            setLoading(false);
        } catch (er) {
            //ErrorMessage("Credenciales incorrectas", "")
            toast.error('Credenciales incorrectas', {
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
                setUsuario(data);
                setTipo(1)
                setIniciarSesion(false)
                localStorage.setItem("nombreUsuario", data.nombre);
                localStorage.setItem("clave", data.clave);
                localStorage.setItem("rolUsuario", data.rol);
                localStorage.setItem("idUsuario", data.id);
                setDataCondominios(data.condominios);
                if (localStorage.getItem("idCondominio")) {
                    let condSelect = data.condominios.filter((a: any) => a.id.toString() === localStorage.getItem("idCondominio")!.toString());
                    if (new Date(condSelect[0].fechaCaducidad) < new Date()) {
                        cerrarSesion();
                    } else {
                        setLoading(true);
                        setEnComunidad(true); ObtenerListadoAnuncioLogic(selListadoAnuncios, localStorage.getItem("idCondominio")!.toString())
                    }
                } else {
                    if (data.condominios.length === 1 && new Date(data.condominios[0].fechaCaducidad) > new Date()) {
                        setEnComunidad(true);
                        setLoading(true);
                        ObtenerListadoAnuncioLogic(selListadoAnuncios, data.condominios[0].id); localStorage.setItem("idCondominio", data.condominios[0].id)
                    } else if (data.condominios.length === 1 && new Date(data.condominios[0].fechaCaducidad) < new Date()) {
                        cerrarSesion();
                        //ErrorMessage("Su usuario no tiene comunidades activas", "")
                        toast.info('Su usuario no tiene comunidades activas', {
                            position: posicionAlertas,
                        });
                    }
                }
            }
            else {
                /*setUsuario({
                    nombre: "",
                    tieneSuscripcionMensajes: false,
                    tieneSuscripcionVotaciones: false,
                    tieneSuscripcionAnuncios: false,
                    tieneSuscripcionAvisos: false,
                    rol: "",
                    id: 0
                });*/
                //ErrorMessage("Credenciales incorrectas", "")
                toast.info('Credenciales incorrectas', {
                    position: posicionAlertas,
                });

            }
            setLoguear({
                usuario: "",
                clave: "",
                idCondominio: "0"
            })
        } catch (er) {
            //ErrorMessage("Credenciales incorrectas", "")
            toast.info('Credenciales incorrectas', {
                position: posicionAlertas,
            });
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

    const CrearAnuncio = () => {
        guardarArchivo();
        let anuncioParse = anuncio;
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
    const CrearUsuario = () => {
        try {
            if (newUser.nombre.length > 0) {
                setLoading(true);
                CrearUsuarioLogic(selCrearUsuario, newUser)
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
                    nombre: '',
                    clave: '',
                    rol: '',
                    idCondominio: 0
                })
                toast.success('Usuario creado correctamente', {
                    position: posicionAlertas,
                });
            }
            else {
                setLoading(false);
                //ErrorMessage("Ha ocurrido un error", "Ha ocurrido un error al intentar Crear Usuario. Comuníquese con el Administrador.")
                toast.info('Error al crear usuario. Comuníquese con el Administrador.', {
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
                if (data.avisosHoy) {
                    setAlerta({ tipo: 1, mensaje: "Tu calendario muestra eventos programados para hoy" })
                }
                setDataFull(data);
                setActualizarData(true);
            }
            setLoading(false);
        } catch (er) {
        }
    }

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
    const changeMenu = (a: number, b: boolean = false, c: boolean = false, d: boolean = false, e: boolean = false, f: boolean = false) => {
        window.scrollTo(0, 0);
        setAlerta({ tipo: 1, mensaje: "" })
        setAlertaCerrada(false);
        setVerDetalle(false);
        setTipo(a);
        setIniciarSesion(b);
        setCrear(c);
        setEditar(d);
        setEncuesta(e);
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
        if (c)
            limpiarAnuncio()
    }
    const cargarAnuncioParaEdit = (a: any) => {
        setTipoSubir(0);
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
                /* setLoading(true); */
                /* ObtenerListadoAnuncioLogic(selListadoAnuncios, localStorage.getItem("idCondominio")!.toString()); */
                setDataFull(data);
                setActualizarData(true);
                setLoading(false);
            }
            else {
            }
        } catch (er) {
            //ErrorMessage("Error dar Like", "Favor comuniquese con el administrador.")
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

    const crearVotacion = () => {
        try {
            var _opciones: any = [];
            // eslint-disable-next-line
            options.map((e: any) => {
                _opciones.push({ Descripcion: e.value, IdVotacion: 0 })
            })

            var votacion: any = {
                Id: 0,
                Cabecera: question,
                Descripcion: questionDesc,
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
        return <div className="fixed bottom-0 left-0 z-50 w-full bg-white border-t">
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
            <div className="grid max-w-lg grid-cols-4 mx-auto font-medium" style={{ background: 'white' }}>
                <button aria-label="Anuncios" type="button" className={tipo === 1 ? "button btnactive" : "button"} onClick={() => {
                    cerrarMenu(false); changeMenu(1); setLoading(true); ObtenerListadoAnuncioLogic(selListadoAnuncios, localStorage.getItem("idCondominio")!.toString());
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" className="icon">
                        <path d="M10 2a1 1 0 0 1 1 1v4.586l3.293-3.293a1 1 0 0 1 1.414 1.414l-4.293 4.293a1 1 0 0 1-1.414 0l-4.293-4.293a1 1 0 0 1 1.414-1.414L9 7.586V3a1 1 0 0 1 1-1zM2 10a8 8 0 1 1 16 0 8 8 0 0 1-16 0zm8 4a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                    </svg>
                    <span className="text">Anuncios</span>
                </button>
                <button aria-label="Ventas" type="button" className={tipo === 0 ? "button btnactive" : "button"} onClick={() => { cerrarMenu(false); changeMenu(0) }}>
                    <svg className="icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6 2a1 1 0 0 0-1 1v2H3a1 1 0 0 0-1 1v2h20V6a1 1 0 0 0-1-1h-2V3a1 1 0 0 0-1-1H6Zm1 3V4h10v1H7Zm-4 5v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V10H3Zm7 3a1 1 0 0 1 2 0v1a1 1 0 1 1-2 0v-1Zm4 0a1 1 0 0 1 2 0v1a1 1 0 1 1-2 0v-1Z" />
                    </svg>
                    <span className="text">Ventas</span>
                </button>
                <button aria-label="Recordatorios" type="button" className={tipo === 2 ? "button btnactive" : "button"} onClick={() => { cerrarMenu(false); changeMenu(2) }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" className="icon">
                        <path d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm0 14a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm-.5-9a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5V7z" />
                    </svg>
                    <span className="text">Recordatorios</span>
                </button>
                {
                    usuario.nombre.length > 0 ? <button type="button" className={tipo === 5 ? "button btnactive" : "button"} onClick={() => { cerrarMenu(false); changeMenu(5, false, false) }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" className="icon">
                            <path d="M4 3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4zm1 3h10v2H5V6zm0 4h10v2H5v-2zm0 4h6v2H5v-2z" />
                        </svg>
                        <span className="text">Votaciones</span>
                    </button> :
                        <button type="button" className={tipo === 4 ? "button btnactive" : "button"} onClick={() => { cerrarMenu(false); changeMenu(4, true); }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" className="icon">
                                <path d="M10 0a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 12c-4.418 0-8 2.686-8 6v2h16v-2c0-3.314-3.582-6-8-6z" />
                            </svg>
                            <span className="text">Perfil</span>
                        </button>
                }
            </div >
        </div >
    }
    const panelMisAnuncios = (a: any, i: any) => {
        return <div
            key={i}
            className="v2-anuncio card-shadow col-12 my-3 pb-5"
        >
            <div className="v2-anuncio-header">
                {usuario.nombre.length > 0 && (
                    <div className="v2-anuncio-actions">
                        {(usuario.id === a.idUsuario || usuario.rol === "ADMINISTRADOR") && (
                            <>
                                {!a.activo ?
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 -960 960 960"
                                        className="v2-icon verInput inactivo"
                                        fill="currentColor"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            DeshabilitarAnuncio(a);
                                        }}
                                    >
                                        <path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z" />
                                    </svg>
                                    :
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 -960 960 960"
                                        fill="currentColor"
                                        className="v2-icon verInput activo"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            DeshabilitarAnuncio(a);
                                        }}
                                    >
                                        <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />
                                    </svg>
                                }
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    className="v2-icon editarInput"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        changeMenu(a.idTipo, false, false, true);
                                        cargarAnuncioParaEdit(a);
                                    }}
                                >
                                    <path d="M17.414 2.586a2 2 0 0 0-2.828 0L14 3.586 16.414 6l.586-.586a2 2 0 0 0 0-2.828zM2 15.586V18h2.414l11-11-2.414-2.414-11 11z" />
                                </svg>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    className="v2-icon deleteInput"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        EliminarAnuncio(a.id);
                                    }}
                                >
                                    <path d="M5 3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v1h3a1 1 0 0 1 0 2h-1v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5H1a1 1 0 0 1 0-2h3V3zm1 0v1h8V3H6zm-1 3h10v12H5V6z" />
                                </svg>
                            </>
                        )}
                    </div>
                )}
                <h3 className={(usuario.id === a.idUsuario || usuario.rol === "ADMINISTRADOR") ? "v2-anuncio-title mt-4" : "v2-anuncio-title"}>{a.cabecera}</h3>
            </div>

            <div className="v2-anuncio-body" dangerouslySetInnerHTML={{ __html: a.descripcion }} />

            {(a.amedida && (
                <div className="v2-anuncio-media-wrapper">
                    {a.esVideo ? (
                        <video src={a.amedida} controls />
                    ) : (
                        <img src={a.amedida} alt="Foto Mis Anuncios"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.onerror = null;
                                target.src = imgError;
                            }}
                            onClick={() => openModalImg(a.amedida)} />
                    )}
                </div>
            )) || null}

            <div className="v2-anuncio-footer">
                <div className="v2-anuncio-organizador">
                    <span>Creado por:</span>
                    <span className="ml-1">{a.organizador}</span>
                </div>
                <span className="v2-anuncio-telefono">{a.telefono}</span>
            </div>

            <small className="v2-anuncio-fecha">
                Fecha publicación: {new Date(a.fechaDesde).toLocaleDateString() + " " + new Date(a.fechaDesde).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
            </small>

            {a.idTipo !== 2 && (
                <div className="v2-anuncio-comment" onClick={(e) => e.stopPropagation()}>
                    <svg fill="#28bd06" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                        width="24px" height="24px" viewBox="0 0 483.789 483.789" onClick={() => {
                            //setLoading(true);
                            ObtenerAnuncioPorIdLogic(selObtenerAnuncioPorId, a.id);
                            setDataDetalle(a);
                            setVerDetalle(true);
                        }}>
                        <g>
                            <g>
                                <polygon points="434.77,405.332 465.895,405.332 465.895,122.667 329.895,122.667 329.895,280.288 329.895,293.333 
			316.073,293.333 167.228,293.333 167.228,405.332 361.895,405.332 361.895,483.789 		"/>
                                <path d="M17.895,280h30.88l73.12,79.973V280h45.333h149.333V122.667V0H17.895V280z M266.138,116.6
			c6.267,0,11.989,3.4,16.407,6.067c5.43,5.333,8.885,11.845,8.885,19.549c0,13.968-11.325,25.453-25.292,25.453
			c-13.968,0-25.294-11.565-25.294-25.533c0-7.701,3.453-14.133,8.886-19.467C254.145,120,259.867,116.6,266.138,116.6z
			 M199.927,116.6c6.267,0,11.99,3.4,16.408,6.067c5.429,5.333,8.886,11.845,8.886,19.549c0,13.968-11.326,25.453-25.294,25.453
			c-13.968,0-25.293-11.565-25.293-25.533c0-7.701,3.454-14.133,8.886-19.467C187.937,120,193.66,116.6,199.927,116.6z
			 M133.715,117.243c13.971,0,25.293,11.326,25.293,25.293c0,13.968-11.325,25.293-25.293,25.293
			c-13.968,0-25.293-11.325-25.293-25.293C108.422,128.565,119.748,117.243,133.715,117.243z M67.507,117.243
			c13.968,0,25.293,11.326,25.293,25.293c0,13.968-11.326,25.293-25.293,25.293c-13.971,0-25.293-11.325-25.293-25.293
			C42.214,128.565,53.538,117.243,67.507,117.243z"/>
                            </g>
                        </g>
                    </svg>
                    <span className="v2-comment-count">{a.cantComentarios}</span>
                </div>
            )}

            <div className="v2-anuncio-like" onClick={(e) => e.stopPropagation()}>
                <svg
                    className="v2-like-icon"
                    viewBox="0 0 24 24"
                    onClick={() => handleLike(a.id, true, false)}
                >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
                  2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09 
                  C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 
                  22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                <span className="v2-like-count">{a.likes}</span>
            </div>
        </div>

    }
    const panelAnuncios = (a: any, i: any) => {
        if (a.idTipo !== tipo)
            return false
        else
            return <div
                key={i}
                className="v2-anuncio card-shadow col-12 my-3 pb-5"
            >
                <div className="v2-anuncio-header">
                    {usuario.nombre.length > 0 && (
                        <div className="v2-anuncio-actions">
                            {(usuario.id === a.idUsuario || usuario.rol === "ADMINISTRADOR") && (
                                <>
                                    {!a.activo ?
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 -960 960 960"
                                            className="v2-icon verInput inactivo"
                                            fill="currentColor"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                DeshabilitarAnuncio(a);
                                            }}
                                        >
                                            <path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z" />
                                        </svg>
                                        :
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 -960 960 960"
                                            fill="currentColor"
                                            className="v2-icon verInput activo"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                DeshabilitarAnuncio(a);
                                            }}
                                        >
                                            <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />
                                        </svg>
                                    }
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        className="v2-icon editarInput"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            changeMenu(a.idTipo, false, false, true);
                                            cargarAnuncioParaEdit(a);
                                        }}
                                    >
                                        <path d="M17.414 2.586a2 2 0 0 0-2.828 0L14 3.586 16.414 6l.586-.586a2 2 0 0 0 0-2.828zM2 15.586V18h2.414l11-11-2.414-2.414-11 11z" />
                                    </svg>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        className="v2-icon deleteInput"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            EliminarAnuncio(a.id);
                                        }}
                                    >
                                        <path d="M5 3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v1h3a1 1 0 0 1 0 2h-1v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5H1a1 1 0 0 1 0-2h3V3zm1 0v1h8V3H6zm-1 3h10v12H5V6z" />
                                    </svg>
                                </>
                            )}
                        </div>
                    )}
                    <h3 className={(usuario.id === a.idUsuario || usuario.rol === "ADMINISTRADOR") ? "v2-anuncio-title mt-4" : "v2-anuncio-title"}>{a.cabecera}</h3>
                </div>

                <div className="v2-anuncio-body" dangerouslySetInnerHTML={{ __html: a.descripcion }} />

                {(a.amedida && (
                    <div className="v2-anuncio-media-wrapper">
                        {a.esVideo ? (
                            <video src={a.amedida} controls />
                        ) : (
                            <img src={a.amedida} alt="Foto Anuncios"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.onerror = null;
                                    target.src = imgError;
                                }}
                                onClick={() => openModalImg(a.amedida)} />
                        )}
                    </div>
                )) || null}

                <div className="v2-anuncio-footer">
                    <div className="v2-anuncio-organizador">
                        <span>Creado por:</span>
                        <span className="ml-1">{a.organizador}</span>
                    </div>
                    <span className="v2-anuncio-telefono">{a.telefono}</span>
                </div>

                <small className="v2-anuncio-fecha">
                    Fecha publicación: {new Date(a.fechaDesde).toLocaleDateString() + " " + new Date(a.fechaDesde).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                </small>

                {a.idTipo !== 2 && (
                    <div className="v2-anuncio-comment" onClick={(e) => e.stopPropagation()}>
                        <svg fill="#28bd06" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                            width="24px" height="24px" viewBox="0 0 483.789 483.789" onClick={() => {
                                //setLoading(true);
                                ObtenerAnuncioPorIdLogic(selObtenerAnuncioPorId, a.id);
                                setDataDetalle(a);
                                setVerDetalle(true);
                            }}>
                            <g>
                                <g>
                                    <polygon points="434.77,405.332 465.895,405.332 465.895,122.667 329.895,122.667 329.895,280.288 329.895,293.333 
			316.073,293.333 167.228,293.333 167.228,405.332 361.895,405.332 361.895,483.789 		"/>
                                    <path d="M17.895,280h30.88l73.12,79.973V280h45.333h149.333V122.667V0H17.895V280z M266.138,116.6
			c6.267,0,11.989,3.4,16.407,6.067c5.43,5.333,8.885,11.845,8.885,19.549c0,13.968-11.325,25.453-25.292,25.453
			c-13.968,0-25.294-11.565-25.294-25.533c0-7.701,3.453-14.133,8.886-19.467C254.145,120,259.867,116.6,266.138,116.6z
			 M199.927,116.6c6.267,0,11.99,3.4,16.408,6.067c5.429,5.333,8.886,11.845,8.886,19.549c0,13.968-11.326,25.453-25.294,25.453
			c-13.968,0-25.293-11.565-25.293-25.533c0-7.701,3.454-14.133,8.886-19.467C187.937,120,193.66,116.6,199.927,116.6z
			 M133.715,117.243c13.971,0,25.293,11.326,25.293,25.293c0,13.968-11.325,25.293-25.293,25.293
			c-13.968,0-25.293-11.325-25.293-25.293C108.422,128.565,119.748,117.243,133.715,117.243z M67.507,117.243
			c13.968,0,25.293,11.326,25.293,25.293c0,13.968-11.326,25.293-25.293,25.293c-13.971,0-25.293-11.325-25.293-25.293
			C42.214,128.565,53.538,117.243,67.507,117.243z"/>
                                </g>
                            </g>
                        </svg>
                        <span className="v2-comment-count">{a.cantComentarios}</span>
                    </div>
                )}

                <div className="v2-anuncio-like" onClick={(e) => e.stopPropagation()}>
                    <svg
                        className="v2-like-icon"
                        viewBox="0 0 24 24"
                        onClick={() => handleLike(a.id, true, false)}
                    >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
                  2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09 
                  C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 
                  22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                    <span className="v2-like-count">{a.likes}</span>
                </div>
            </div>

    }

    const handleKeyDown = (e: any) => {
        if (e.key === 'Enter') {
            login();
        }
    };

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

    const panelInicioSesion = () => {
        return <div style={{ marginTop: '-10%' }}>
            <div className="w-100" style={{ display: 'grid' }}>
                <img className="w-75 mx-auto" alt="Logo" src={logo} />
            </div>
            <div className="w-100 search-container">
                <label htmlFor="textfield" className="search-label">
                    Inicio de Sesión
                </label>
                <div className="login-box">
                    <input
                        type="text"
                        name="usuario"
                        className="search-input"
                        value={loguear.usuario}
                        onChange={handleChangeLogin}
                    />
                    <input
                        type="password"
                        name="clave"
                        className="search-input"
                        value={loguear.clave}
                        onChange={handleChangeLogin}
                        onKeyDown={handleKeyDown}
                    />
                    <button
                        type="button"
                        className="search-button"
                        onClick={login}
                    >
                        Ingresar
                    </button>
                </div>
            </div>
        </div>
    }
    type Option = {
        id: number;
        value: string;
    };

    const [question, setQuestion] = useState('');
    const [questionDesc, setQuestionDesc] = useState('');
    const [options, setOptions] = useState<Option[]>([
        { id: 1, value: '' },
        { id: 2, value: '' },
    ]);

    const handleAddOption = () => {
        const newOption = {
            id: options.length + 1,
            value: '',
        };
        setOptions([...options, newOption]);
    };

    const handleOptionChange = (id: number, value: string) => {
        const updatedOptions = options.map(opt =>
            opt.id === id ? { ...opt, value } : opt
        );
        setOptions(updatedOptions);
    };


    const handleRemoveOption = (id: number) => {
        const filteredOptions = options.filter(opt => opt.id !== id);
        setOptions(filteredOptions);
        //setShowAddButton(true);
    };

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
    const crearComentarioAnuncio = () => {
        var comentarioAnuncio: any = {
            Id: 0,
            IdUsuario: usuario.id,
            NombreUsuario: usuario.nombre,
            IdAnuncio: dataDetalle.id,
            Mensaje: newComentario,
            Fecha: new Date(chileTime)
        };
        setNewComentario("");
        CrearComentarioAnuncioLogic(selcrearComentarioAnuncio, comentarioAnuncio, localStorage.getItem("idCondominio")!.toString());
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

                if (newData.amedida) {
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

    const selObteneCondominio = (error: Boolean, err: string, data: any) => {
        try {
            setLoading(false);
            if (data === 0) {
                //ErrorMessage("Código Incorrecto", "El código ingresado es incorrecto");
                toast.info('Código Incorrecto', {
                    position: posicionAlertas,
                });
            } else {
                window.location.href = "/" + data + "/comunidad"
            }
        } catch (er) {
        }
    }

    const panelVotaciones = () => {
        return <div style={{ fontFamily: 'Arial, sans-serif' }}>
            <h4 className="mt-3 mb-4 text-center">VOTACIONES</h4>
            {dataVotaciones.map((a: any, i: number) => {
                return (
                    <div key={i} className="cardVotacion my-4" style={!a.activo ? { opacity: '0.8' } : {}}>
                        {usuario.rol === "ADMINISTRADOR" && (
                            <label className="checkbox-container">
                                <input
                                    type="checkbox"
                                    checked={!!a.activo}
                                    onChange={() => {
                                        setLoading(true);
                                        CambiarEstadoVotacionLogic(selCambiarEstadoVotacion, a.id, !a.activo, localStorage.getItem("idCondominio")!.toString(), usuario.id)
                                    }}
                                />
                                <span className="checkmark"></span>
                            </label>
                        )}
                        <h4 className="text-center">{a.cabecera}</h4>
                        <span className="mb-3 text-center d-block">{a.descripcion}</span>
                        {a.opcionesVotacion.map((b: any, o: number) => {
                            let percentage = a.total && b.votaciones.length ? (b.votaciones.length / a.total) * 100 : 0;
                            return (<div key={o} style={{ marginBottom: '10px' }}>
                                <div className="d-flex" style={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                    <span>{b.descripcion}</span>
                                    <small style={{ color: 'grey' }}>{b.votaciones.length} votos</small>
                                </div>
                                <div className={!a.activo ? "disabled-click" : ""} id={b.id} style={{ background: '#ddd', height: '25px', width: '100%', borderRadius: '5px', marginTop: '5px' }} onClick={(ev) => { cambiarVoto(ev); }}>
                                    <div style={{ background: '#4caf50', height: '100%', width: `${percentage}%`, borderRadius: '5px', textAlign: 'center' }}>
                                        {b.votaciones.find((votacion: any) => votacion.idUsuario === usuario.id) ?
                                            <span style={{ color: 'white', display: 'block', width: '55px', margin: '0 auto' }}>Votado</span>
                                            : ""}
                                    </div>
                                </div>
                            </div>);
                        })}
                    </div>
                );
            })}
        </div>
    }


    const panelDetalleAnuncio = () => {
        return (
            <div className="mx-3">
                <button type="button" className="iconoVolver" onClick={() => {
                    setVerDetalle(false)
                }}>
                    <img width={35} src={volver} alt="Icono volver" />
                </button>
                <h4 className="mt-3 mb-4 text-center" style={{ fontSize: '1.7rem', fontWeight: '700' }}>{dataDetalle.cabecera}</h4>
                <div className="anuncio-body" dangerouslySetInnerHTML={{ __html: dataDetalle.descripcion }} />
                <div className="anuncio-footer">
                    <div className="anuncio-organizador">
                        <span>Creado por: </span>
                        <span className="ml-1">{dataDetalle.organizador}</span>
                    </div>
                    <span className="anuncio-telefono">{dataDetalle.telefono}</span>
                </div>
                {dataDetalle.amedida && dataDetalle.esVideo ?
                    <div className="anuncio-img-wrapper">
                        <video id="videoAnuncio3" src={dataDetalle.amedida} controls width="300" />
                    </div>
                    : dataDetalle.amedida && !dataDetalle.esVideo ?
                        <div className="anuncio-img-wrapper">
                            <img id="imgAnuncio3" className="anuncio-img"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.onerror = null;
                                    target.src = imgError;
                                }}
                                src={dataDetalle.amedida} alt="Foto" />
                        </div>
                        : ""
                }
                <div className="d-flex align-items-center w-100" style={{ justifyContent: 'space-between' }}>
                    <small className="anuncio-fecha" style={{ position: 'relative', marginLeft: '20px', bottom: '0', fontSize: '12px' }}>
                        Fecha publicación: {new Date(dataDetalle.fechaDesde).toLocaleDateString() + " " + new Date(dataDetalle.fechaDesde).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                    </small>
                    <div className="anuncio-like" style={{ position: 'relative', marginRight: '20px', bottom: '0' }}>
                        <svg className="like-icon" viewBox="0 0 24 24" onClick={() => handleLike(dataDetalle.id, true, true)}>
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
             2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09 
             C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 
             22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                        <span className="like-count">{dataDetalle.likes === 0 ? "" : dataDetalle.likes}</span>
                    </div>
                </div>
                <div className="comments-container">
                    <h2 className="comments-title">Comentarios</h2>
                    {dataDetalle.comentarios ? dataDetalle.comentarios.map((j: any) => {
                        return <div key={j.id} className="comment-box">
                            <div className="comment-header">
                                <span className="comment-author">{j.nombreUsuario}</span>
                                <div>
                                    <span className="comment-date">{new Date(j.fecha).toLocaleDateString()}</span>
                                    <span className="comment-date ml-2">{new Date(j.fecha).toLocaleTimeString().split(":").slice(0, 2).join(":")}</span>
                                </div>
                            </div>
                            <p className="comment-content">{j.mensaje}</p>
                        </div>
                    }) : ""}
                    <textarea
                        className="comment-textarea"
                        placeholder="Escribe tu comentario..."
                        value={newComentario}
                        onChange={(e) => setNewComentario(e.target.value)}
                        rows={3}
                        maxLength={500}
                    />
                    <button
                        type="button"
                        className="search-button w-100 mt-1"
                        onClick={crearComentarioAnuncio}
                    >
                        Publicar comentario
                    </button>
                </div>
            </div>
        );
    }

    const panelPerfil = () => {
        return (
            <div className="w-100 px-3">
                {
                    editarPerfil ?
                        <>
                            <div className="login-box py-3 w-100">
                                <button type="button" className="iconoVolver" onClick={() => {
                                    setEditarPerfil(false)
                                }}>
                                    <img width={30} src={volver} alt="Icono volver" />
                                </button>
                                <div style={{ justifySelf: 'center' }}>
                                    <img
                                        className={usuarioDetalle.imagen != null ? "" : "d-none"}
                                        id="userDetallePerfil"
                                        src={editImgPerfil ? usuarioDetalle.imagen : ""}
                                        alt="Vista previa"
                                        style={{ maxWidth: '200px', marginTop: '10px' }}
                                    />
                                    <div id="userDetallePerfilSVG" className={usuarioDetalle.imagen != null ? "d-none" : "perfil-avatar"}>
                                        <svg fill="#e0e0e0" viewBox="0 0 24 24" style={{ width: '50px' }} width="72" height="72">
                                            <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"></path>
                                        </svg>
                                    </div>
                                </div>

                                {
                                    <div>
                                        <input type="file" accept="image/*" className="w-100" onChange={handleImagePerfilChange} />
                                    </div>
                                }
                                <label htmlFor="textfield" className="search-label-admin">
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    name="cabecera"
                                    className="search-input"
                                    value={usuarioDetalle.nombre}
                                    disabled
                                />
                                <label htmlFor="textfield" className="search-label-admin">
                                    Rol
                                </label>
                                <input
                                    name="descripcion"
                                    className="search-input"
                                    value={usuarioDetalle.rol}
                                    disabled
                                />
                                <label htmlFor="textfield" className="search-label-admin" defaultValue={""}>
                                    Dirección
                                </label>
                                <input
                                    type="text"
                                    name="direccion"
                                    className="search-input"
                                    value={usuarioDetalle.direccion}
                                    onChange={handleChangePerfil}
                                />
                                <label htmlFor="textfield" className="search-label-admin">
                                    Teléfono
                                </label>
                                <input
                                    type="text"
                                    name="telefono"
                                    className="search-input"
                                    value={usuarioDetalle.telefono}
                                    onChange={handleChangePerfil}
                                />
                                <label htmlFor="textfield" className="search-label-admin">
                                    Contraseña
                                </label>
                                <input
                                    type="text"
                                    name="clave"
                                    className="search-input"
                                    value={usuarioDetalle.clave}
                                    onChange={handleChangePerfil}
                                />
                                <button
                                    type="button"
                                    className="search-button mt-2"
                                    onClick={EditarPerfil}
                                >
                                    Editar
                                </button>
                            </div>
                        </>
                        :
                        !loading &&
                        <div className="perfil-box w-100">
                            <button
                                type="button"
                                className="perfil-edit-btn"
                                onClick={() => { setEditarPerfil(true); setEditImgPerfil(usuarioDetalle.imagen != "" && usuarioDetalle.imagen != null ? true : false) }}
                                aria-label="Editar perfil"
                            >
                                <img src={iconeditar} />
                            </button>
                            <div className="perfil-avatar">
                                {usuarioDetalle.imagen ? (
                                    <img
                                        src={usuarioDetalle.imagen}
                                        alt="Vista previa"
                                    />
                                ) : (
                                    <svg width="72" height="72" fill="#e0e0e0" viewBox="0 0 24 24">
                                        <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
                                    </svg>
                                )}
                            </div>
                            <h4 className="perfil-nombre">{usuarioDetalle.nombre}</h4>

                            <div className="perfil-info">
                                <div className="w-100">
                                    <div className="container-dataPerfil">
                                        {usuarioDetalle.rol && <span>Rol</span>}
                                        {usuarioDetalle.rol && <span style={{ marginLeft: '30px', textAlign: 'end', fontWeight: '700' }}>{usuarioDetalle.rol}</span>}
                                    </div>
                                    <div className="container-dataPerfil">
                                        <span>Dirección</span>
                                        {usuarioDetalle.direccion ? <span style={{ marginLeft: '30px', textAlign: 'end', fontWeight: '700' }}>{usuarioDetalle.direccion}</span> : <span style={{ marginLeft: '30px', textAlign: 'end', fontWeight: '700' }}>Sin Datos</span>}
                                    </div>
                                    <div className="container-dataPerfil">
                                        <span>Teléfono</span>
                                        {usuarioDetalle.telefono ? <span style={{ marginLeft: '30px', textAlign: 'end', fontWeight: '700' }}>{usuarioDetalle.telefono}</span> : <span style={{ marginLeft: '30px', textAlign: 'end', fontWeight: '700' }}>Sin Datos</span>}
                                    </div>
                                    <div className="container-dataPerfil">
                                        <span>Notif. Anuncios</span>
                                        <span style={{ marginLeft: '30px', textAlign: 'end', fontWeight: '700' }}>{usuarioDetalle.tieneSuscripcionAnuncios ? "Activa" : "Inactiva"}</span>
                                    </div>
                                    <div className="container-dataPerfil">
                                        <span>Notif. Mensajes</span>
                                        <span style={{ marginLeft: '30px', textAlign: 'end', fontWeight: '700' }}>{usuarioDetalle.tieneSuscripcionMensajes ? "Activa" : "Inactiva"}</span>
                                    </div>
                                    <div className="container-dataPerfil">
                                        <span>Notif. Votaciones</span>
                                        <span style={{ marginLeft: '30px', textAlign: 'end', fontWeight: '700' }}>{usuarioDetalle.tieneSuscripcionVotaciones ? "Activa" : "Inactiva"}</span>
                                    </div>
                                    <div className="container-dataPerfil">
                                        <span>Notif. Calendario</span>
                                        <span style={{ marginLeft: '30px', textAlign: 'end', fontWeight: '700' }}>{usuarioDetalle.tieneSuscripcionAvisos ? "Activa" : "Inactiva"}</span>
                                    </div>
                                    <div className="container-dataPerfil">
                                        <span>Fecha Caducidad</span>
                                        {usuarioDetalle.fechaCaducidad && (
                                            <span style={{ marginLeft: '30px', textAlign: 'end', fontWeight: '700' }}>{new Date(usuarioDetalle.fechaCaducidad).toLocaleDateString()}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                }
            </div>
        );
    }

    const filtrarUsuarios = (ev: any) => {
        let parselistadoUser = listadousuarios.filter((e) => e.nombre.toLocaleLowerCase().includes(ev.target.value.toLocaleLowerCase()));
        setUsuariosParse(parselistadoUser);
    }



    const panelUsuarios = () => {
        return (
            <div className="w-100 px-3">
                {
                    agregarUsuario ?
                        <>
                            <div className="w-100 px-3 mt-2">
                                <div className="login-box py-3">
                                    <h2 className="text-center">Agregar Usuario</h2>
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
                                        onClick={CrearUsuario}
                                    >
                                        Aceptar
                                    </button>
                                </div>
                            </div>
                        </> :
                        !verUsuarioInd ?
                            <>
                                <div className="usuariosContainer">
                                    <h4 className="usuarios-title">Listado Usuarios</h4>
                                    {(cupoUsuarios.cupo > cupoUsuarios.usados) ?
                                        <div className="cupo-usuarios-container" style={{ cursor: 'pointer' }} onClick={() => {
                                            setAgregarUsuario(true); setNewUser({ nombre: "", clave: "", rol: "VECINO", idCondominio: parseInt(localStorage.getItem("idCondominio")!.toString()) });
                                        }}>
                                            <button className="cupo-usuarios-add" title="Agregar usuario">
                                                <svg width="30" height="30" viewBox="0 0 18 18" fill="none">
                                                    <circle cx="9" cy="9" r="9" fill="#05c724" />
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
        );
    }

    const editorRef = useRef<HTMLDivElement>(null);

    const handleInput = (ev: any) => {
        //setNewTextRich(ev.target.children[0].outerHTML);
        setTextRichEditado(true);
    };
    const handleBlur = (ev: any) => {
        if (editorRef.current) {
            setNewTextRich(editorRef.current.innerHTML);
        }
    };
    const cambiarNormas = () => {
        CambiarNormasLogic(selCambiarNormas, newTextRich, localStorage.getItem("idCondominio")!.toString())
    }
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
    const panelReglasNormas = () => {
        return (
            <div className="login-box py-3 px-3 ">
                <h4 className="mt-3 mb-4 text-center" style={{ fontSize: '1.7rem', fontWeight: '700' }}>Reglas y Normas</h4>
                <div className="containerReglas">
                    {
                        usuario.rol !== "ADMINISTRADOR" ?
                            <div
                                dangerouslySetInnerHTML={{ __html: dataFull.normas }}
                            /> :
                            editarTextRich ?
                                <div
                                    dangerouslySetInnerHTML={{ __html: dataFull.normas }}
                                />
                                :
                                <div>
                                    <div
                                        className="rich-text-input"
                                        contentEditable
                                        ref={editorRef}
                                        onInput={handleInput}
                                        onBlur={handleBlur}
                                        suppressContentEditableWarning={true}
                                        dangerouslySetInnerHTML={{ __html: newTextRich }}
                                        spellCheck={true}
                                        aria-label="Editor de texto enriquecido"
                                    />
                                    {textRichEditado ?
                                        <button type="button" className="search-button mt-2 w-100" onClick={() => {
                                            setTextRichEditado(false);
                                            cambiarNormas();
                                        }}>
                                            Guardar cambios
                                        </button>
                                        : ""}
                                    {textRichEditado ?
                                        <button type="button" className="search-button mt-2 w-100" onClick={() => {
                                            setNewTextRich(dataFull.normas);
                                            setTextRichEditado(false);
                                        }}>
                                            Descartar cambios
                                        </button>
                                        : ""}
                                </div>
                    }

                </div>
            </div>
        );
    }
    useEffect(() => {
        generarCalendario();
    }, [avisos]);

    const generarCalendario = () => {
        const nombresDias = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
        const primerDia = new Date(año, mes, 1);
        const diasEnMes = new Date(año, mes + 1, 0).getDate();

        let diaSemana = primerDia.getDay(); // domingo = 0
        diaSemana = diaSemana === 0 ? 6 : diaSemana - 1; // lunes = 0

        const fechaActual = new Date(año, mes);
        const nombreMes = fechaActual.toLocaleString('es-ES', {
            month: 'long',
            year: 'numeric',
        });
        setMonthTitle(nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1));

        const celdas: any = [];

        // Encabezados
        for (let i = 0; i < 7; i++) {
            celdas.push(<div key={`head-${i}`} className="encabezado">{nombresDias[i]}</div>);
        }

        // Vacíos antes del 1
        for (let i = 0; i < diaSemana; i++) {
            celdas.push(<div key={`empty-${i}`} className="dia"></div>);
        }

        const formatoFecha = (fecha: any) => {
            let _fecha: Date = new Date(fecha);
            const _año = _fecha.getFullYear();
            const _mes = _fecha.getMonth();
            const _dia = _fecha.getDate();
            return `${_año}-${(_mes + 1).toString().padStart(2, '0')}-${_dia.toString().padStart(2, '0')}`;
        }
        // Días con avisos
        for (let dia = 1; dia <= diasEnMes; dia++) {
            const fechaTexto = `${año}-${(mes + 1).toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
            const avisosDelDia = avisos.filter((a: any) => formatoFecha(a.fecha) === fechaTexto);

            celdas.push(
                <div key={`dia-${dia}`} className="dia" onClick={() => { getObtenerAvisosDia(dia, mes + 1) }}>
                    <div className="fecha">{dia}</div>
                    {avisosDelDia.map((a: any, i: any) => (
                        <div key={i} className="mensaje">{a.mensaje}</div>
                    ))}
                </div>
            );
        }

        setDays(celdas);
    };

    const getObtenerAvisosDia = (dia: number, mes: number) => {
        setDiaMesSelect({ dia: dia, mes: mes, anio: año })
        setVerDetalleAvisos(true);
    }

    const panelEmergencia = () => {
        return editarEmergencia ?
            <div className="w-100 px-3">
                <div className="login-box py-3">
                    <button type="button" className="iconoVolver" onClick={() => {
                        setEditarEmergencia(false)
                    }}>
                        <img width={35} src={volver} alt="Icono volver" />
                    </button>
                    <h4 className="mt-3 text-center">Crear número de emergencia</h4>
                    <label htmlFor="textfield" className="search-label-admin">
                        Descripción
                    </label>
                    <input
                        name="descripcion"
                        className="search-input"
                        value={emergencia.descripcion}
                        onChange={(e: any) => handleChangeEmergencia(e)}
                    />
                    <label htmlFor="textfield" className="search-label-admin" defaultValue={""}>
                        Dirección
                    </label>
                    <input
                        name="direccion"
                        className="search-input"
                        value={emergencia.direccion}
                        onChange={(e: any) => handleChangeEmergencia(e)}
                    />
                    <label htmlFor="textfield" className="search-label-admin">
                        Teléfono
                    </label>
                    <input
                        name="telefono"
                        className="search-input"
                        value={emergencia.telefono}
                        onChange={(e: any) => handleChangeEmergencia(e)}
                    />
                    <button
                        type="button"
                        className="search-button mt-2"
                        onClick={CrearEmergencia}
                    >
                        Aceptar
                    </button>
                </div>
            </div>
            :
            <div className="w-100 login-box py-3">
                <h3 style={{ textAlign: 'center' }}>Números de Emergencia</h3>
                <div className="login-box py-3">
                    {
                        emergenciaDetalle.map((e: any) => {
                            return (
                                <div className="container-emergencia">
                                    <span><strong>{e.descripcion}</strong></span><br />
                                    <span>{e.direccion}</span>
                                    <a href={`tel:${e.telefono}`} className="d-block">{e.telefono}</a>
                                    {
                                        usuario.rol === "ADMINISTRADOR" &&
                                        <>
                                            {/*<span className="d-block">{e.telefono}</span>*/}

                                            <button type="button" className="iconoVolver" style={{ right: '25px', marginTop: '-75px', position: 'absolute' }} onClick={() => {
                                                setEmergencia(e)
                                                setEditarEmergencia(true)
                                            }}>
                                                <img src={iconeditar} />
                                            </button>
                                            <button type="button" className="iconoVolver" style={{ right: '25px', marginTop: '-30px', position: 'absolute' }} onClick={() => {
                                                setEmergencia(e)
                                                EliminarEmergencia()
                                            }}>
                                                <img src={iconborrar} />
                                            </button>
                                        </>
                                    }
                                </div>
                            )
                        })
                    }
                    {
                        usuario.rol === "ADMINISTRADOR" &&
                        <button type="button" className="search-button mt-2" onClick={() => {
                            setEditarEmergencia(true)
                            setCrear(false)
                            setEmergencia({
                                id: 0,
                                descripcion: '',
                                telefono: '',
                                idcondominio: 0,
                                direccion: ''
                            })
                        }}>
                            Crear número de emergencia
                        </button>
                    }
                </div>
            </div >
    }

    const anunciosInteres = [
        {
            id: 1,
            titulo: "Ferretería El Tornillo",
            descripcion: "Todo en herramientas y materiales para tu hogar.",
            imagen: "https://plus.unsplash.com/premium_photo-1682089012647-14ff235735c1?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZmVycmV0ZXIlQzMlQURhfGVufDB8fDB8fHww",
            url: "#"
        },
        {
            id: 2,
            titulo: "Ropa Urbana",
            descripcion: "Moda joven con estilo único y precios accesibles.",
            imagen: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80",
            url: "#"
        },
        {
            id: 3,
            titulo: "Verdulería La Huerta",
            descripcion: "Frutas y verduras frescas de la mejor calidad.",
            imagen: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=400&q=80",
            url: "#"
        }
    ];

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

    const panelPuntosInteres = () => {
        return (

            <div className="login-box w-100">
                <h1 style={{ textAlign: 'center' }}>Puntos de Interes</h1>
                <div className="anuncios-lista-container">
                    {anunciosInteres.map(({ id, titulo, descripcion, imagen, url }) => (
                        <AnuncioCard
                            key={id}
                            titulo={titulo}
                            descripcion={descripcion}
                            imagen={imagen}
                            url={url}
                        />
                    ))}
                </div>
            </div>
        );
    }

    function obtenerNombreMes(numeroMes: any) {
        const nombresMeses = [
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];

        if (numeroMes >= 1 && numeroMes <= 12) {
            return nombresMeses[numeroMes - 1];
        } else {
            return "Mes inválido";
        }
    }

    const changeFechaTime = (ev: any) => {
        setHoraAviso(ev.target.value);
    }
    const cambiarMes = (a: any, b: any) => {
        setMes(a)
        setAño(b)
        setLoading(true)
        ObtenerAvisosLogic(selListadoAvisos, (a + 1).toString(), localStorage.getItem("idCondominio")!.toString(), b.toString());
    }

    const panelAvisos = () => {
        return verDetalleAvisos ?
            <div className="w-100 login-box py-3">
                <button type="button" className="iconoVolver" onClick={() => {
                    setVerDetalleAvisos(false)
                }}>
                    <img width={35} src={volver} alt="Icono volver" />
                </button>
                <h3 style={{ textAlign: 'center' }}>Avisos día {diaMesSelect.dia} de {obtenerNombreMes(diaMesSelect.mes)} del {diaMesSelect.anio}</h3>
                <div className="login-box py-3">
                    {
                        avisos.filter((a: any) => new Date(a.fecha).getDate() === diaMesSelect.dia).map((e: any) => {
                            return (
                                <div className="container-avisos">
                                    <div className="d-block">
                                        <span><strong>{e.mensaje}</strong></span><br />
                                        {/* <span>{new Date(e.fecha).toLocaleTimeString()}</span> */}
                                    </div>
                                    <div style={{ position: 'absolute', right: '25px' }}>
                                        {
                                            usuario.rol === "ADMINISTRADOR" &&
                                            <>
                                                <button type="button" className="iconoVolver" style={{ background: 'transparent' }} onClick={() => {
                                                    EnviarNotifAviso(e.mensaje)
                                                }}>
                                                    <img src={notificar} />
                                                </button>

                                                <button type="button" className="iconoVolver" style={{ background: 'transparent' }} onClick={() => {
                                                    setEditarAvisos(true);
                                                    setCrear(false);
                                                    setVerDetalleAvisos(false);
                                                    setFechaAviso(e.fecha.toString().substring(0, 10));
                                                    setHoraAviso(e.fecha.toString().substring(11));
                                                    setMensajeAviso(e.mensaje);
                                                    setIdAviso(e.id)
                                                }}>
                                                    <img src={iconeditar} />
                                                </button>
                                                <button type="button" className="iconoVolver" style={{ background: 'transparent' }} onClick={() => {
                                                    EliminarAviso(e.id, e.fecha, e.mensaje)
                                                }}>
                                                    <img src={iconborrar} />
                                                </button>
                                            </>
                                        }
                                    </div>
                                </div>
                            )
                        })
                    }
                    {
                        usuario.rol === "ADMINISTRADOR" &&
                        <button type="button" className="search-button mt-2" onClick={() => {
                            setEditarAvisos(true)
                            setVerDetalleAvisos(false);
                            setFechaAviso(new Date(diaMesSelect.anio, diaMesSelect.mes - 1, diaMesSelect.dia).toISOString().substring(0, 10));
                            setHoraAviso("");
                            setMensajeAviso('');
                            setIdAviso(0)
                        }}>
                            Crear aviso
                        </button>
                    }
                </div>
            </div> : editarAvisos ?
                <div className="px-2">
                    <div className="login-box py-3 w-100">
                        <button type="button" className="iconoVolver" onClick={() => {
                            setEditarAvisos(false)
                        }}>
                            <img width={35} src={volver} alt="Icono volver" />
                        </button>
                        <label htmlFor="textfield" className="search-label-admin">
                            Mensaje Aviso
                        </label>
                        <textarea
                            rows={4}
                            cols={50}
                            name="descripcion"
                            className="search-input"
                            value={mensajeAviso}
                            onChange={(e: any) => setMensajeAviso(e.target.value)}
                        />
                        <label htmlFor="textfield" className="search-label-admin mt-3">
                            Fecha Aviso
                        </label>
                        <div className="d-inline-flex" style={{ justifyContent: 'space-between' }}>
                            <input
                                type="date"
                                name="fechaAviso"
                                className="typeDate"
                                disabled
                                value={fechaAviso ? fechaAviso.toString() : ""}
                                style={{ padding: '8px', fontSize: '16px', width: '100%' }}
                            />

                            {/*  <input
                                type="time"
                                name="fechaAviso"
                                className="typeDate"
                                value={horaAviso ? horaAviso.toString() : ""}
                                //onChange={(e: any) => {setFechaAviso(e.target.value);}}
                                onChange={(e: any) => { changeFechaTime(e) }}
                                style={{ padding: '8px', fontSize: '16px', width: '48%' }}
                            /> */}
                        </div>
                        <button
                            type="button"
                            className="search-button mt-2"
                            onClick={CrearAviso}
                        >
                            Aceptar
                        </button>
                    </div>
                </div>
                :
                <div className="login-box py-3 px-3 w-100">
                    <h1 className="mb-0" style={{ textAlign: 'center' }}>Calendario</h1>
                    <div style={{ justifyContent: 'space-between', display: 'flex', alignItems: 'center' }}>
                        <button
                            onClick={() => {
                                const nuevoMes = mes === 1 ? 12 : mes - 1;
                                const nuevoAño = mes === 1 ? año - 1 : año;
                                cambiarMes(nuevoMes, nuevoAño);
                            }}
                            aria-label="Iquierda"
                            className="iconFlecha"
                        >
                            <svg fill="#fff" height="20px" width="20px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 330 330">
                                <path id="XMLID_92_" d="M111.213,165.004L250.607,25.607c5.858-5.858,5.858-15.355,0-21.213c-5.858-5.858-15.355-5.858-21.213,0.001
	l-150,150.004C76.58,157.211,75,161.026,75,165.004c0,3.979,1.581,7.794,4.394,10.607l150,149.996
	C232.322,328.536,236.161,330,240,330s7.678-1.464,10.607-4.394c5.858-5.858,5.858-15.355,0-21.213L111.213,165.004z"/>
                            </svg>
                        </button>
                        <h4 className="m-0">{monthTitle}</h4>
                        <button
                            onClick={() => {
                                const nuevoMes = mes === 12 ? 1 : mes + 1;
                                const nuevoAño = mes === 12 ? año + 1 : año;
                                cambiarMes(nuevoMes, nuevoAño);
                            }}
                            aria-label="Derecha"
                            className="iconFlecha"
                        >
                            <svg fill="#fff" height="20px" width="20px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 330.002 330.002">
                                <path id="XMLID_103_" d="M233.252,155.997L120.752,6.001c-4.972-6.628-14.372-7.97-21-3c-6.628,4.971-7.971,14.373-3,21
	l105.75,140.997L96.752,306.001c-4.971,6.627-3.627,16.03,3,21c2.698,2.024,5.856,3.001,8.988,3.001
	c4.561,0,9.065-2.072,12.012-6.001l112.5-150.004C237.252,168.664,237.252,161.33,233.252,155.997z"/>
                            </svg>
                        </button>
                    </div>
                    <div className="calendario">
                        {days}
                    </div>
                </div>
    }

    const panelCrearEncuesta = () => {
        return <div key={1} className="w-100" style={{ maxWidth: '700px', margin: '0 auto' }}>
            <div className="survey-creator-container">
                <h2 className="creator-title">Creador de Votaciones</h2>

                <div className="input-group">
                    <label className="h4" htmlFor="question">Pregunta:</label>
                    <textarea
                        id="question"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Escribe tu pregunta aquí..."
                        rows={2}
                    />
                </div>
                <div className="input-group">
                    <label className="h4" htmlFor="question">Descripción:</label>
                    <textarea
                        id="question"
                        value={questionDesc}
                        onChange={(e) => setQuestionDesc(e.target.value)}
                        placeholder="Escribe tu pregunta aquí..."
                        rows={2}
                    />
                </div>
                <div className="options-section">
                    <h4>Opciones de respuesta:</h4>
                    {options.map((option, index) => (
                        <div id={option.id.toString()} className="option-item">
                            <input
                                id={index.toString()}
                                type="text"
                                value={option.value}
                                onChange={(e) => handleOptionChange(option.id, e.target.value)}
                                placeholder={`Opción ${index + 1}`}
                            />
                            {options.length > 2 && (
                                <button
                                    className="remove-option"
                                    onClick={() => handleRemoveOption(option.id)}
                                    aria-label="Eliminar opción"
                                >
                                    <img width={25} src={iconmenos} alt="icono de eliminar" />
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        className="add-option"
                        onClick={handleAddOption}
                    >
                        + Añadir opción
                    </button>
                </div>

                <button
                    className="create-button"
                    onClick={() => crearVotacion()}
                >
                    Crear Encuesta
                </button>
            </div>

        </div>
    }
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
                    <input type="file" accept="image/*" className="w-100" onChange={handleImageChange} />
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

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    /* if ('serviceWorker' in navigator) {
        window.addEventListener('load', async () => {
            try {
                const registration = await navigator.serviceWorker.register('/service-worker.js');
                console.log('SW registrado:', registration);

                const readyReg = await navigator.serviceWorker.ready;
                console.log('SW listo:', readyReg);
                setEstadoServiceWorker('SW listo:' + readyReg.toString())
                setServiceWorker(readyReg)
                // Aquí puedes continuar con pushManager.subscribe...
            } catch (error) {
                console.error('Error al registrar o preparar el Service Worker:', error);
            }
        });
    } else {
        console.warn('El navegador no soporta Service Workers');
    } */

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


    const cerrarMenu = (a: any, b: any = false, c: any = false, d: any = false, e: any = false, f: any = false, g: any = false, h: any = false, i: any = false) => {
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
    }
    // eslint-disable-next-line
    const selSuscribir = (error: Boolean, err: string, data: any) => {
        try {
            if (data) {
                SuscribirNotificaciones2Logic(selSuscribir2, localStorage.getItem("idCondominio")!.toString(), usuario.id, err, data)
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
    const selSuscribir2 = (error: Boolean, err: string, data: any) => {
        setLoading(false);
        try {
            if (data) {
                //SuccessMessage("Su suscripción a las notificaciones fue realizada correctamente.")
                toast.success('Su suscripción a las notificaciones fue realizada correctamente.', {
                    position: posicionAlertas,
                });
                setUsuario({
                    nombre: usuario.nombre,
                    tieneSuscripcionMensajes: err === "2" ? true : usuario.tieneSuscripcionMensajes,
                    tieneSuscripcionVotaciones: err === "3" ? true : usuario.tieneSuscripcionVotaciones,
                    tieneSuscripcionAnuncios: err === "1" ? true : usuario.tieneSuscripcionAnuncios,
                    tieneSuscripcionAvisos: err === "4" ? true : usuario.tieneSuscripcionAvisos,
                    rol: usuario.rol,
                    id: usuario.id
                });
                let campo = err === "2" ? "tieneSuscripcionMensajes" : err === "3" ? "tieneSuscripcionVotaciones" : "tieneSuscripcionAnuncios";
                localStorage.setItem(campo, "true");
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
                    setOpen(false);
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
                <div className={enComunidad ? "w-100 pb-3 mb-3 containerMenu" : "d-none"}>
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
                                cerrarMenu(false, true)
                                setCrear(false)
                                setLoading(true);

                                Perfil()
                            }}>
                                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                                </svg>
                                Perfil
                            </button>
                            <button type="button" onClick={() => {
                                cerrarMenu(false); changeMenu(999);
                                setLoading(true);
                                setVerMisAnuncios(true)
                                setTipo(8);
                                ObtenerMisAnuncioLogic(selMisAnuncios, usuario.id.toString());
                            }}>
                                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M3 5a2 2 0 0 1 2-2h9l5 5v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5zm13.586 4L13 5.414V9h3.586zM7 13h10v1.5H7V13zm0 3h7v1.5H7V16z" />
                                </svg>
                                Mis Publicaciones
                            </button>
                            {/*  {usuario.rol === "ADMINISTRADOR" && ( */}
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
                            {/*  )} */}
                            {openCrear && /* usuario.rol === "ADMINISTRADOR" &&  */(
                                <div className="submenu">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setTipo(1);
                                            setOpenCrear(false);
                                            changeMenu(3, false, true);
                                            cerrarMenu(false)
                                            setOpen(false);
                                        }}
                                        className="submenu-item ml-3"
                                    >
                                        Publicación
                                    </button>
                                    {usuario.rol === "ADMINISTRADOR" &&
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setOpenCrear(false);
                                                cerrarMenu(false);
                                                changeMenu(3, false, false, false, true);
                                                setOpen(false);
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
                                        cerrarMenu(false, false, false, false, false, false, false, false, true)
                                        setCrear(false);
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
                                cerrarMenu(false, false, true);
                                setCrear(false)
                                setEncuesta(false);
                                setNewTextRich(dataFull.normas);
                            }}>
                                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 10-1.5 0v1.5a.75.75 0 001.5 0v-1.5zM10 9a.75.75 0 00-.75.75v4a.75.75 0 001.5 0v-4A.75.75 0 0010 9z" clipRule="evenodd" />
                                </svg>
                                Reglas y Normas
                            </button>
                            <button type="button" onClick={() => {
                                cerrarMenu(false, false, false, true)
                                changeMenu(999)
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
                                cerrarMenu(false, false, false, false, false, true)
                                setCrear(false)
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="red" width="24" height="24" viewBox="0 0 24 24">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
                                </svg>
                                Puntos de Interes
                            </button>
                            <button type="button" onClick={() => {
                                cerrarMenu(false, false, false, false, false, false, true)
                                setCrear(false)
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
                                cerrarMenu(false)
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
                </div>
                {(alerta.mensaje !== "" && !alertaCerrada) && mensajeSuperior()}
                <div className="container pb-5 mb-5">
                    <div className="row px-3 justify-content-around">
                        {
                            dataCondominios.length > 1 && !enComunidad ?
                                <>
                                    {panelPrincipal()}
                                </>
                                :
                                iniciarSesion ?
                                    <>
                                        {panelInicioSesion()}
                                    </>
                                    :
                                    crear || editar ?
                                        <>
                                            {panelCrearAnuncio()}
                                        </>
                                        : votaciones ?
                                            <>
                                                {panelVotaciones()}
                                            </>
                                            : verEmergencia ?
                                                <>
                                                    {panelEmergencia()}
                                                </>
                                                :
                                                verPuntosInteres ?
                                                    <>
                                                        {panelPuntosInteres()}
                                                    </>
                                                    :
                                                    encuesta ?
                                                        <>
                                                            {panelCrearEncuesta()}
                                                        </>
                                                        :
                                                        verAvisos ?
                                                            <>
                                                                {panelAvisos()}
                                                            </>
                                                            :
                                                            verPerfil ?
                                                                <>
                                                                    {panelPerfil()}
                                                                </>
                                                                :
                                                                verUsuarios ?
                                                                    <>
                                                                        {panelUsuarios()}
                                                                    </>
                                                                    :
                                                                    verReglasNormas ?
                                                                        <>
                                                                            {panelReglasNormas()}
                                                                        </>
                                                                        :
                                                                        verDetalle && tipo !== 2 ?
                                                                            <>
                                                                                {panelDetalleAnuncio()}
                                                                            </>
                                                                            :
                                                                            verMisAnuncios ?
                                                                                <>
                                                                                    <h4>Mis Publicaciones</h4>
                                                                                    {misAnuncios !== null && misAnuncios.map((a: any, i) => (
                                                                                        panelMisAnuncios(a, i)
                                                                                    ))}
                                                                                </>
                                                                                :
                                                                                <>
                                                                                    {dataFull.anuncios !== null && dataFull.anuncios.map((a: any, i) => (
                                                                                        panelAnuncios(a, i)
                                                                                    ))}
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