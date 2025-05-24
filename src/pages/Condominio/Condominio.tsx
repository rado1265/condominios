import React, { useEffect, useState, useRef } from "react";
import Loading from "../../components/utils/loading";
import './Condominio.css';
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
import HuinchaSuperior from "../HuinchaSuperior/HuinchaSuperior";
import CryptoJS from "crypto-js";
import EspacioComun from "./espacioComun/EspacioComun";
import iconClose from '../../components/utils/img/menuInferior/close.png';
import iconBuscar from '../../components/utils/img/menuInferior/buscar-select.png';
import PanelUsuarios from "./usuarios/PanelUsuarios";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from "../../store/store";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { crearSuscripcion, setActive, setCambiarMenu, setCerrarTodo, setComunidad, setEnComunidad, setLoading, setTipo } from "../../store/slices/comunidad/comunidadSlice"
import { setActiveFilter, setAlignment, setBuscarEnMenu, fetchAnuncios, setDataFullParse, setBuscarDataFull, setCriterio, setOrden, setChangeTipo } from "../../store/slices/anuncio/anuncioSlice"
import { loginStorage, loginThunk, logout } from "../../store/slices/login/authSlice";
import { fetchAvisos, fetchTiposAviso } from '../../store/slices/avisos/avisoSlice'
import { obtenerVotaciones } from "../../store/slices/votacion/votacionesSlice";
import { fetchUsuarios } from "../../store/slices/perfil/usuariosSlice";
import { fetchEmergencias } from "../../store/slices/emergencia/emergenciaSlice";
import { fetchReservas } from "../../store/slices/espacioComun/historialReservasSlice";
import { cargarEspacios } from "../../store/slices/espacioComun/listadoEspacioComunSlice";
import { useSignalR } from "../../components/utils/useSignalR";
const posicionAlertas = "bottom-left";

const Condominio = () => {
    useSignalR();
    const dispatch = useDispatch<AppDispatch>()
    const { active, comunidad, mostrar, sinNotificaciones, loading } = useSelector((state: RootState) => state.comunidad);
    const { usuario } = useSelector((state: RootState) => state.auth);
    const { alignment, buscarenmenu, activeFilter, dataFull, orden } = useSelector((state: RootState) => state.anuncio);

    const secret = "2b2463d9f3b093b61be6ce0adbdcc4a0f7e56776502d173a4cf4bb0a8f5d0e79";
    function formatToLocalISOString(date: Date) {
        const pad = (n: number) => n.toString().padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T00:00:00`;
    }

    const filters = [
        { label: "Fecha", key: "fechaDesde" },
        { label: "Likes", key: "cantLikes" },
        { label: "Comentarios", key: "cantComentarios" }
    ];

    const handleChange = (value: any) => {
        let tipo = 0;
        switch (value) {
            case "Todo":
                dispatch(setTipo(4));
                tipo = 4;
                break;
            case "Anuncios":
                dispatch(setTipo(1));
                tipo = 1;
                break;
            case "Ventas":
                dispatch(setTipo(0));
                tipo = 0;
                break;
            case "Reclamos":
                dispatch(setTipo(2));
                tipo = 2;
                break;
            case "Servicios":
                dispatch(setTipo(3));
                tipo = 3;
                break;
            default:
                break;
        }
        dispatch(setChangeTipo(tipo))
        dispatch(setAlignment(value))
    };
    const loguearStorage = async () => {
        const jsonData = JSON.stringify(deserializeFromAscii(localStorage.getItem("ZXN0byBlcyBzZWNyZXRv")!));
        const hash = CryptoJS.HmacSHA256(jsonData, secret).toString();
        const paquete = {
            datos: jsonData,
            firma: hash
        };
        const result = await dispatch(loginStorage(paquete))
        if (loginStorage.fulfilled.match(result)) {
            const user = result.payload;
            dispatch(setComunidad(user.condominios[0]))
            localStorage.setItem("idCondominio", user.condominios[0].id)
            dispatch(setCambiarMenu({ mostrar: 'verAvisos', tipo: 999 } as any))
            dispatch(fetchAnuncios(user.condominios[0].id))
            dispatch(fetchTiposAviso());
            dispatch(fetchAvisos({ mes: (new Date().getMonth() + 1), año: new Date().getFullYear(), idCondominio: user.condominios[0].id }));
            dispatch(obtenerVotaciones({ idCondominio: user.condominios[0].id, idUsuario: user.id }));
            dispatch(fetchUsuarios(user.condominios[0].id));
            dispatch(fetchEmergencias());
            dispatch(fetchReservas({ idUsuario: user.id }));
            dispatch(cargarEspacios())
            dispatch(setLoading(false as any))
        } else {
            toast.error('Credenciales incorrectas', { position: posicionAlertas });
            dispatch(setLoading(false as any))
        }
    };
    useEffect(() => {
        if (navigator.onLine) {
            if ((localStorage.getItem("ZXN0byBlcyBzZWNyZXRv") && localStorage.getItem("ZXN0byBlcyBzZWNyZXRv") != 'undefined')) {
                loguearStorage()
            }
            else {
                cerrarSesion()
            }
        } else {
        }
    }, [])

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
    //////////////////////////////////////////
    function isIos() {
        return /iphone|ipad|ipod/i.test(navigator.userAgent);
    }

    function isAndroid() {
        return /android/i.test(navigator.userAgent);
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
        } catch (err) {
        }
    }

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js').catch(console.error);
        });
    }
    //////////////////////////////////////////
    const cerrarSesion = () => {
        localStorage.clear();
        dispatch(setComunidad({
            nombre: '',
            logo: '',
            normas: '',
            avisosHoy: false,
            esVideo: false,
        }))
        dispatch(logout())

        dispatch(setCambiarMenu({ mostrar: 'iniciarSesion', tipo: 0 } as any))
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

    function deserializeFromAscii<T>(asciiStr: string): T {
        const bytes = asciiStr.split(',').map(Number);
        const json = String.fromCharCode(...bytes);
        return JSON.parse(json);
    }
    const handleChangeCriterio = (e: any) => {
        dispatch(setCriterio(e));
    }

    const handleChangeOrden = (e: string) => {
        dispatch(setOrden(orden === 'asc' ? 'desc' : 'asc'));
    }

    const handleChangeMenu = (e: any) => {
        dispatch(setActive(e));
        switch (e) {
            case "perfil":
                dispatch(setCambiarMenu({ mostrar: "verPerfil", tipo: 0 } as any))
                break;
            case "mispublicaciones":
                dispatch(setCambiarMenu({ mostrar: "verMisAnuncios", tipo: 8 } as any))
                break;
            case "comunidad":
                dispatch(setCambiarMenu({ mostrar: "verUsuarios", tipo: 999 } as any))
                break;
            case "crearAnuncio":
                dispatch(setCambiarMenu({ mostrar: "verCrearAnuncio", tipo: 4 } as any))
                break;
            case "crearVotacion":
                dispatch(setCambiarMenu({ mostrar: "encuesta", tipo: 3 } as any))
                break;
            case "reglas":
                dispatch(setCambiarMenu({ mostrar: "verReglasNormas", tipo: 999 } as any))
                /* setNewTextRich(dataFull.normas); */
                break;
            case "anuncios":
                dispatch(setCambiarMenu({ mostrar: "verPublicacion", tipo: 4 } as any))
                dispatch(setAlignment("Todo"))
                break;
            case "votaciones":
                dispatch(setCambiarMenu({ mostrar: "verVotaciones", tipo: 5 } as any))
                break;
            case "calendario":
                dispatch(setCambiarMenu({ mostrar: "verAvisos", tipo: 999 } as any))
                break;
            case "numEmergencias":
                dispatch(setCambiarMenu({ mostrar: "verEmergencia", tipo: 999 } as any))
                break;
            case "cerrarSesion":
                dispatch(setCambiarMenu({ mostrar: "iniciarSesion", tipo: 999 } as any))
                break;
            case "espacioComun":
                dispatch(setCambiarMenu({ mostrar: "verEspacioComun", tipo: 999 } as any))
                break;
            default:
                break;
        }
    }
    const navegador = () => {
        return <div className="fixed bottom-0 left-0 z-50 w-full bg-white">
            <BottomNav
                onChangeMenu={handleChangeMenu}
                active={active}
                usuario={usuario}
                onChangeCriterio={handleChangeCriterio}
                onFiltrarDataFull={filtrarDataFull}
                onChangeOrden={handleChangeOrden}
            />
        </div >
    }
    const filtrarDataFull = (ev: any) => {
        const texto = ev.target.value.toLowerCase();

        const filtrado = dataFull.filter((item: any) => {
            const cabecera = item.cabecera?.toLowerCase() || '';
            const organizador = item.organizador?.toLowerCase() || '';
            return cabecera.includes(texto) || organizador.includes(texto);
        });
        dispatch(setDataFullParse(filtrado))
        dispatch(setBuscarDataFull(ev.target.value));
    }
    const noFiltrar = () => {
        dispatch(setBuscarDataFull(dataFull));
        dispatch(setBuscarEnMenu(false))
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

    const inputBuscarRef = useRef(null);

    const handleClickBuscar = () => {
        dispatch(setBuscarEnMenu(true));
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
                    nombre={comunidad.nombre}
                    enComunidad={mostrar.enComunidad}
                    imagenPerfil={usuario != null ? usuario.imagen : ""}
                    onChangeMenu={handleChangeMenu}
                />
                {
                    mostrar.verPublicacion && (
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
                                                    onClick={() => { handleChangeCriterio(f.key); dispatch(setActiveFilter(f.key)) }}
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
                            mostrar.iniciarSesion && !loading &&
                            <>
                                <Login
                                    onLogin={() => {
                                        cerrarSesion();
                                    }}
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
                            (mostrar.verCrearAnuncio || mostrar.verEditarAnuncio) &&
                            <>
                                <AnunciosCrear />
                            </>
                        }
                        {
                            mostrar.verVotaciones &&
                            <>
                                <VotacionPanel />
                            </>
                        }
                        {
                            mostrar.verEmergencia &&
                            <>
                                <Emergencia />
                            </>
                        }
                        {
                            mostrar.encuesta &&
                            <>
                                <VotacionCrear />
                            </>
                        }
                        {
                            mostrar.verAvisos &&
                            <>
                                <AvisoPanel />
                            </>
                        }
                        {
                            mostrar.verPerfil &&
                            <>
                                <PerfilUsuario />
                            </>
                        }
                        {
                            mostrar.verUsuarios &&
                            <>
                                <PanelUsuarios
                                />
                            </>
                        }
                        {
                            mostrar.verReglasNormas &&
                            <>
                                <ReglasNormasPanel />
                            </>
                        }
                        {(mostrar.verDetalle) &&
                            <>
                                <DetalleAnuncioPanel />
                            </>
                        }
                        {
                            mostrar.verMisAnuncios &&
                            <>
                                <h2 className="col-12 text-center mt-4">{"PUBLICACIONES"}</h2>
                                <AnunciosPanel />
                            </>
                        }
                        {
                            mostrar.verPublicacion &&
                            <div className="mt-4 row justify-content-around">
                                <AnunciosPanel />
                            </div>
                        }
                    </div>
                    {
                        mostrar.verEspacioComun &&
                        <EspacioComun usuario={usuario} />
                    }
                </div>
                <ToastContainer />
                {mostrar.enComunidad && navegador()}
            </div>
        </React.Fragment>
    );
}

export default Condominio;