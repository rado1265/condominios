import React, { useEffect, useState } from "react";
import Loading from "../../components/utils/loading";
import './Condominio.css';
import { CrearAnuncioLogic, EliminarAnuncioLogic, LoginLogic, ObtenerListadoAnuncioLogic, SuscribirNotificacionesLogic } from "../../presentation/view-model/Anuncio.logic";
import { ConfirmMessage, ErrorMessage, SuccessMessage } from "../../components/utils/messages";

const Condominio = () => {
    const [loading, setLoading] = useState(false);
    const [dataFull, setDataFull] = useState({
        anuncios: [],
        nombre: "",
        logo: ""
    });
    const fullURL = window.location.href;
    const urlPase = fullURL.split("/");
    const [tipo, setTipo] = useState(1)
    const [usuario, setUsuario] = useState({
        nombre: ""
    });
    const [loguear, setLoguear] = useState({
        usuario: "",
        clave: "",
        idCondominio: localStorage.getItem("idCondominio")
    });
    const [iniciarSesion, setIniciarSesion] = useState(false)
    const [crear, setCrear] = useState(false)
    const [editar, setEditar] = useState(false)
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
        idTipo: 1
    });
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
            idTipo: 1
        })
    }
    const [key, setKey] = useState(0)
    useEffect(() => {
        if (!localStorage.getItem("idCondominio")) localStorage.setItem("idCondominio", urlPase[3]);
        if (urlPase[3]) {
            setLoading(true);
            ObtenerListadoAnuncioLogic(selListadoAnuncios, urlPase[3]);
        }
    }, [])
    const EliminarAnuncio = (a: any) => {
        try {
            handleConfirmMessage(a)
        } catch (er) {
        }
    }
    const handleConfirmMessage = async (a: any) => {
        console.log(a)
        const msg: any = await ConfirmMessage(`Eliminar anuncio`, `¿Esta seguro de querer eliminar el anuncio?`);
        if (msg) {
            setLoading(true);
            EliminarAnuncioLogic(selEliminarAnuncio, a)
        }
    }
    const selEliminarAnuncio = (error: Boolean, err: string, data: any) => {
        try {
            if (data) {
                SuccessMessage("Anuncio eliminado correctamente.")
                ObtenerListadoAnuncioLogic(selListadoAnuncios, localStorage.getItem("idCondominio")!.toString());
                /* setTipo(1) */
            }
            else {
                ErrorMessage("Error al eliminar anuncio", "Favor intentarlo nuevamente en unos minutos")
                ObtenerListadoAnuncioLogic(selListadoAnuncios, localStorage.getItem("idCondominio")!.toString());
                /* setTipo(1) */
            }
        } catch (er) {
            ErrorMessage("Credenciales incorrectas", "")
        }
    }

    const normalizarLogin = (data: any) => {
        return {
            usuario: data.usuario ?? "",
            clave: data.clave ?? "",
            idCondominio: localStorage.getItem("idCondominio")
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
            if (data.nombre != null) {
                setUsuario(data);
                setTipo(1)
                setIniciarSesion(false)
            }
            else {
                setUsuario({
                    nombre: ""
                });
                ErrorMessage("Credenciales incorrectas", "")
            }
        } catch (er) {
            ErrorMessage("Credenciales incorrectas", "")
        }
    }

    const normalizarAnuncio = (data: any) => {
        return {
            id: data.id ?? 0,
            idCondominio: data.idCondominio ?? "",
            cabecera: data.cabecera ?? "",
            descripcion: data.descripcion ?? "",
            organizador: data.organizador ?? "",
            telefono: data.telefono ?? "",
            amedida: data.amedida ?? "",
            fechaDesde: data.fechaDesde ? data.fechaDesde.substring(0, 10) : "",
            fechaHasta: data.fechaHasta ? data.fechaHasta.substring(0, 10) : "",
            idTipo: data.idTipo ?? 1
        };
    };

    const CrearAnuncio = () => {
        try {
            if (anuncio.cabecera.length > 0) {
                setLoading(true);
                CrearAnuncioLogic(selCrearAnuncio, anuncio)
                console.log(normalizarAnuncio(anuncio))
            }
        } catch (er) {
        }
    }
    const selCrearAnuncio = (error: Boolean, err: string, data: any) => {
        try {
            if (data) {
                ObtenerListadoAnuncioLogic(selListadoAnuncios, localStorage.getItem("idCondominio")!.toString());
                setTipo(1);
                setCrear(false);
                setEditar(false);
                limpiarAnuncio();
            }
            else {
                ErrorMessage("Ha ocurrido un error", "Ha ocurrido un error al intentar Crear Anuncio. Comuníquese con el Administrador.")
            }
        } catch (er) {
            ErrorMessage("Ha ocurrido un error", "Ha ocurrido un error al intentar Crear Anuncio. Comuníquese con el Administrador.")
        }
    }
    const selListadoAnuncios = (error: Boolean, err: string, data: any) => {
        try {
            setLoading(false);
            setDataFull(data);
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
    const changeMenu = (a: number, b: boolean = false, c: boolean = false, d: boolean = false) => {
        setTipo(a)
        setIniciarSesion(b)
        setCrear(c)
        setEditar(d)
        if (c)
            limpiarAnuncio()
    }
    const cargarAnuncioParaEdit = (a: any) => {
        setAnuncio(a)
    }

    const handleImageChange = (e: any) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event: any) => {
            const base64 = event.target.result;
            console.log(base64.replace("data:image/jpeg;base64,", ""))
            if (base64.startsWith('data:image')) {
                setAnuncio(prev => ({
                    ...prev,
                    ["amedida"]: base64.replace("data:image/jpeg;base64,", "")
                }));
            } else {
                alert('Archivo no válido o no es una imagen.');
            }
        };
        reader.readAsDataURL(file);
    };

    const navegador = () => {
        return <div className="fixed bottom-0 left-0 z-50 w-full bg-white border-t">
            <div className="grid max-w-lg grid-cols-4 mx-auto font-medium" style={{ background: 'white' }}>
                <button type="button" className={tipo == 1 ? "button btnactive" : "button"} onClick={() => changeMenu(1)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" className="icon">
                        <path d="M10 2a1 1 0 0 1 1 1v4.586l3.293-3.293a1 1 0 0 1 1.414 1.414l-4.293 4.293a1 1 0 0 1-1.414 0l-4.293-4.293a1 1 0 0 1 1.414-1.414L9 7.586V3a1 1 0 0 1 1-1zM2 10a8 8 0 1 1 16 0 8 8 0 0 1-16 0zm8 4a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                    </svg>
                    <span className="text">Anuncios</span>
                </button>
                <button type="button" className={tipo == 0 ? "button btnactive" : "button"} onClick={() => changeMenu(0)}>
                    <svg className="icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6 2a1 1 0 0 0-1 1v2H3a1 1 0 0 0-1 1v2h20V6a1 1 0 0 0-1-1h-2V3a1 1 0 0 0-1-1H6Zm1 3V4h10v1H7Zm-4 5v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V10H3Zm7 3a1 1 0 0 1 2 0v1a1 1 0 1 1-2 0v-1Zm4 0a1 1 0 0 1 2 0v1a1 1 0 1 1-2 0v-1Z" />
                    </svg>
                    <span className="text">Ventas</span>
                </button>
                <button type="button" className={tipo == 2 ? "button btnactive" : "button"} onClick={() => changeMenu(2)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" className="icon">
                        <path d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm0 14a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm-.5-9a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5V7z" />
                    </svg>
                    <span className="text">Recordatorios</span>
                </button>

                {
                    usuario.nombre.length > 0 ? <button type="button" className={tipo == 3 ? "button btnactive" : "button"} onClick={() => changeMenu(3, false, true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" className="icon">
                            <path d="M10 2a1 1 0 0 1 1 1v6h6a1 1 0 0 1 0 2h-6v6a1 1 0 0 1-2 0v-6H3a1 1 0 0 1 0-2h6V3a1 1 0 0 1 1-1z" />
                        </svg>
                        <span className="text">Crear</span>
                    </button> :
                        <button type="button" className={tipo == 4 ? "button btnactive" : "button"} onClick={() => changeMenu(4, true)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" className="icon">
                                <path d="M10 0a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 12c-4.418 0-8 2.686-8 6v2h16v-2c0-3.314-3.582-6-8-6z" />
                            </svg>
                            <span className="text">Perfil</span>
                        </button>
                }
            </div >
        </div >
    }
    const panelAnuncios = (a: any, i: any) => {
        if (a.idTipo != tipo)
            return false
        else
            return <div key={i} className="anuncio card-shadow col-12 col-md-4 my-3">
                <div className="anuncio-header">
                    {
                        usuario.nombre.length > 0 && <div style={{ justifyContent: 'end', display: 'flex' }} >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" className="icon editarInput" onClick={() => {
                                changeMenu(3, false, false, true)
                                cargarAnuncioParaEdit(a)
                            }}>
                                <path d="M17.414 2.586a2 2 0 0 0-2.828 0L14 3.586 16.414 6l.586-.586a2 2 0 0 0 0-2.828zM2 15.586V18h2.414l11-11-2.414-2.414-11 11z" />
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" className="icon deleteInput" onClick={() => {
                                EliminarAnuncio(a.id)
                            }}>
                                <path d="M5 3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v1h3a1 1 0 0 1 0 2h-1v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5H1a1 1 0 0 1 0-2h3V3zm1 0v1h8V3H6zm-1 3h10v12H5V6z" />
                            </svg>
                        </div>
                    }
                    <span className="anuncio-title">{a.cabecera}</span>
                </div>
                <div className="anuncio-body" dangerouslySetInnerHTML={{ __html: a.descripcion }} />
                <div className="anuncio-footer">
                    <div className="anuncio-organizador">
                        <span>Organizado por: </span>
                        <span className="ml-1">{a.organizador}</span>
                    </div>
                    <span className="anuncio-telefono">{a.telefono}</span>
                </div>
                {a.amedida && (
                    <div className="anuncio-img-wrapper">
                        <img className="anuncio-img" src={`data:image/jpeg;base64,${a.amedida}`} alt="Foto" />
                    </div>
                )}
                <small className="anuncio-fecha">
                    Fecha publicación: {new Date(a.fechaDesde).toLocaleDateString()}
                </small>
            </div>
    }

    const handleKeyDown = (e: any) => {
        if (e.key === 'Enter') {
            login();
        }
    };

    const panelInicioSesion = () => {
        return <div className="mx-3 w-100 search-container">
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
    }
    const panelCrearAnuncio = () => {
        return <div key={key} className="w-100" style={{ maxWidth: '700px', margin: '0 auto' }}>
            <h2 className="mb-4 text-center">{crear ? "Crear" : "Editar"} Anuncio</h2>

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
                    value={anuncio.organizador}
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
                <label htmlFor="textfield" className="search-label-admin mt-3">
                    Cargar imagen
                </label>
                <input type="file" accept="image/*" className="w-100" onChange={handleImageChange} />
                {anuncio.amedida && (
                    <div>
                        <h3>Vista previa:</h3>
                        <img
                            src={`data:image/jpeg;base64,${anuncio.amedida}`}
                            alt="Vista previa"
                            style={{ maxWidth: '300px', marginTop: '10px' }}
                        />
                    </div>
                )}
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


    /////////////////////////////////////////////////////////////////////////////////////////////////////

    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/service-worker.js')
                .then(reg => {
                    console.log('Service Worker registrado:', reg);
                })
                .catch(err => console.error('Error al registrar SW:', err));
        }
    }, []);


    const webpush = require("web-push");
    const vapidKeys = webpush.generateVAPIDKeys();
    console.log(vapidKeys);

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    return (
        <React.Fragment>
            {
                loading ?
                    <Loading />
                    :
                    <div>
                        <div className="w-100 pb-3 mb-3" style={{ background: 'linear-gradient(rgb(255, 255, 255), rgb(144 212 164 / 67%))', justifyContent: 'center', display: 'grid', boxShadow: 'rgb(2 109 33 / 24%) 0px 0px 24px 0px' }}>
                            <img className="w-50 mx-auto" src={`data:image/jpeg;base64,${dataFull.logo}`} alt="Logo" />
                            <h2 className="text-center" style={{ color: '#316371', margin: '0' }}>{dataFull.nombre}</h2>
                            {
                                usuario.nombre.length > 0 && <h6 className="text-center" style={{ color: '#316371', margin: '0' }}>Usuario: {usuario.nombre}</h6>
                            }
                            <button onClick={() => SuscribirNotificacionesLogic()}>
                                Activar notificaciones
                            </button>
                        </div>
                        <div className="container pb-5 mb-5">
                            <div className="row px-3 px-md-0 justify-content-around">
                                {
                                    iniciarSesion ?
                                        <>
                                            {panelInicioSesion()}
                                        </>
                                        :
                                        crear || editar ?
                                            <>
                                                {panelCrearAnuncio()}
                                            </>
                                            : <>
                                                {dataFull.anuncios.map((a: any, i) => (
                                                    panelAnuncios(a, i)
                                                ))}
                                            </>
                                }
                            </div>
                        </div>
                        {navegador()}
                    </div>
            }
        </React.Fragment>
    );
}

export default Condominio;