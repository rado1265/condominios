import React, { useEffect, useState } from "react";
import Loading from "../../components/utils/loading";
import './Condominio.css';
import { CrearAnuncioLogic, CrearVotacionLogic, DarQuitarLikeLogic, DessuscribirNotificacionesLogic, EliminarAnuncioLogic, LoginLogic, ObtenerListadoAnuncioLogic, ObtenerVotacionesLogic, SuscribirNotificacionesLogic, VotarLogic } from "../../presentation/view-model/Anuncio.logic";
import { ConfirmMessage, ErrorMessage, SuccessMessage } from "../../components/utils/messages";
import iconmas from './../../components/utils/img/icon-mas.png';
import iconmenos from './../../components/utils/img/icon-menos.png';
import actualizar from './../../components/utils/img/actualizar-flecha.png';
import menuicon from './../../components/utils/img/menuicon.png';

const Condominio = () => {
    const [loading, setLoading] = useState(false);
    const [tipoSubir, setTipoSubir] = useState(0);
    const [open, setOpen] = useState(false);
    const [dataFull, setDataFull] = useState({
        anuncios: [],
        nombre: "",
        logo: ""
    });
    const fullURL = window.location.href;
    const urlPase = fullURL.split("/");
    const [tipo, setTipo] = useState(1)
    const [usuario, setUsuario] = useState({
        nombre: "",
        tieneSuscripcionMensajes: false,
        tieneSuscripcionVotaciones: false,
        tieneSuscripcionAnuncios: false,
        rol: "",
        id: 0
    });
    const [loguear, setLoguear] = useState({
        usuario: "",
        clave: "",
        idCondominio: localStorage.getItem("idCondominio")
    });
    const [iniciarSesion, setIniciarSesion] = useState(false)
    const [crear, setCrear] = useState(false)
    const [editar, setEditar] = useState(false)
    const [votaciones, setVotaciones] = useState(false)
    const [encuesta, setEncuesta] = useState(false)
    const [menuOpciones, setMenuOpciones] = useState(false)
    const [dataVotaciones, setDataVotaciones] = useState([{ cabecera: "", opcionesVotacion: [] }])
    const [dataDetalle, setDataDetalle] = useState({ cabecera: "", descripcion: "", amedida: "", id: "", telefono: "", likes: 0, organizador: "", fechaDesde: new Date(), fechaHasta: new Date() })
    const [verDetalle, setVerDetalle] = useState(false)
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
        idUsuario: 0
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
            idTipo: 1,
            idUsuario: 0
        })
        setVerDetalle(false);
    }
    useEffect(() => {
        if (!localStorage.getItem("idCondominio")) localStorage.setItem("idCondominio", urlPase[3]);
        if (localStorage.getItem("nombreUsuario") &&
            localStorage.getItem("tieneSuscripcionMensajes") &&
            localStorage.getItem("tieneSuscripcionVotaciones") &&
            localStorage.getItem("tieneSuscripcionAnuncios") &&
            localStorage.getItem("rolUsuario") &&
            localStorage.getItem("idUsuario")) {
            setUsuario({
                nombre: localStorage.getItem("nombreUsuario") ?? "",
                tieneSuscripcionMensajes: localStorage.getItem("tieneSuscripcionMensajes") === "true",
                tieneSuscripcionVotaciones: localStorage.getItem("tieneSuscripcionVotaciones") === "true",
                tieneSuscripcionAnuncios: localStorage.getItem("tieneSuscripcionAnuncios") === "true",
                rol: localStorage.getItem("rolUsuario") ?? "",
                id: parseInt(localStorage.getItem("idUsuario") ?? "")
            })
        }
        else {
            cerrarSesion()
        }

        if (urlPase[3]) {
            setLoading(true);
            ObtenerListadoAnuncioLogic(selListadoAnuncios, urlPase[3]);
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const cerrarSesion = () => {
        localStorage.removeItem("nombreUsuario");
        localStorage.removeItem("tieneSuscripcionMensajes");
        localStorage.removeItem("tieneSuscripcionVotaciones");
        localStorage.removeItem("tieneSuscripcionAnuncios");
        localStorage.removeItem("rolUsuario");
        localStorage.removeItem("idUsuario");
        setUsuario({
            nombre: "",
            tieneSuscripcionMensajes: false,
            tieneSuscripcionVotaciones: false,
            tieneSuscripcionAnuncios: false,
            rol: "",
            id: 0
        });
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

    const uploadVideo = (files: any) => {
        const formData = new FormData();
        formData.append("file", files[0]);
        formData.append("upload_preset", "conexionresidencial");

        fetch("https://api.cloudinary.com/v1_1/djphh67ai/video/upload", {
            method: "POST",
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                setAnuncio(prev => ({
                    ...prev,
                    // eslint-disable-next-line
                    ["amedida"]: data.secure_url
                }));
            });
    };

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
            if (data.nombre !== null) {
                setUsuario(data);
                setTipo(1)
                setIniciarSesion(false)
                localStorage.setItem("nombreUsuario", data.nombre);
                localStorage.setItem("tieneSuscripcionMensajes", data.tieneSuscripcionMensajes);
                localStorage.setItem("tieneSuscripcionVotaciones", data.tieneSuscripcionVotaciones);
                localStorage.setItem("tieneSuscripcionAnuncios", data.tieneSuscripcionAnuncios);
                localStorage.setItem("rolUsuario", data.rol);
                localStorage.setItem("idUsuario", data.id);
            }
            else {
                setUsuario({
                    nombre: "",
                    tieneSuscripcionMensajes: false,
                    tieneSuscripcionVotaciones: false,
                    tieneSuscripcionAnuncios: false,
                    rol: "",
                    id: 0
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
            idCondominio: localStorage.getItem("idCondominio"),
            cabecera: data.cabecera ?? "",
            descripcion: data.descripcion ?? "",
            organizador: usuario.nombre,
            telefono: data.telefono ?? "",
            amedida: data.amedida ?? "",
            fechaDesde: data.fechaDesde ?? new Date(),
            fechaHasta: data.fechaHasta ?? new Date(),
            idTipo: data.idTipo ?? 1,
            idUsuario: data.idUsuario === 0 ? usuario.id : data.idUsuario
        };
    };

    const CrearAnuncio = () => {
        try {
            if (anuncio.cabecera.length > 0) {
                setLoading(true);
                CrearAnuncioLogic(selCrearAnuncio, normalizarAnuncio(anuncio))
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

    const selListadoVotaciones = (error: Boolean, err: string, data: any) => {
        try {
            setLoading(false);
            setDataVotaciones(data);
        } catch (er) {
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
    const changeMenu = (a: number, b: boolean = false, c: boolean = false, d: boolean = false, e: boolean = false) => {
        setVerDetalle(false);
        setTipo(a)
        setIniciarSesion(b)
        setCrear(c)
        setEditar(d)
        setEncuesta(e)
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

    const handleImageChange = (e: any) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event: any) => {
            const base64 = event.target.result;
            //console.log(base64.replace("data:image/jpeg;base64,", ""))
            if (base64.startsWith('data:image')) {
                setAnuncio(prev => ({
                    ...prev,
                    // eslint-disable-next-line
                    ["amedida"]: base64.replace("data:image/jpeg;base64,", "")
                }));
            } else {
                alert('Archivo no válido o no es una imagen.');
            }
        };
        reader.readAsDataURL(file);
    };
    /*document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            setLoading(true);
            ObtenerListadoAnuncioLogic(selListadoAnuncios, urlPase[3]);
        }
    });*/

    const selDarQuitarLike = (error: Boolean, err: string, data: any) => {
        setLoading(false);
        try {
            if (data) {
                setLoading(true);
                ObtenerListadoAnuncioLogic(selListadoAnuncios, urlPase[3]);
            }
            else {
            }
        } catch (er) {
            ErrorMessage("Error dar Like", "Favor comuniquese con el administrador.")
        }
    }

    const handleLike = (id: any, like: any) => {
        if (usuario.nombre.length > 0)
            DarQuitarLikeLogic(selDarQuitarLike, id, like)
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
                SuccessMessage("Votación creada correctamente.")
            }
            else {
                ErrorMessage("Ocurrió un error al crear la Votación", "")
            }
        } catch (er) {
            ErrorMessage("Ocurrió un error al crear la Votación", "")
        }
    }


    const navegador = () => {
        return <div className="fixed bottom-0 left-0 z-50 w-full bg-white border-t">
            {usuario.nombre.length > 0 ?
                <div className="circular-menu">
                    <button
                        className={`menu-button ${open ? "open" : ""}`}
                        onClick={() => setOpen(!open)}
                        aria-label="Abrir menú"
                    >
                        <img width={50} src={iconmas} alt="icono de menu" />
                    </button>
                    <div className={`menu-items ${open ? "open" : ""}`}>
                        <button className="menu-item encuesta" onClick={() => { changeMenu(3, false, true); setOpen(false); }}>Anuncio</button>
                        <button className="menu-item encuesta" onClick={() => { changeMenu(3, false, false, false, true); setOpen(false); }}>Votación</button>
                    </div>
                </div>
                : ""}
            <div className="grid max-w-lg grid-cols-4 mx-auto font-medium" style={{ background: 'white' }}>
                <button aria-label="Anuncios" type="button" className={tipo === 1 ? "button btnactive" : "button"} onClick={() => changeMenu(1)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" className="icon">
                        <path d="M10 2a1 1 0 0 1 1 1v4.586l3.293-3.293a1 1 0 0 1 1.414 1.414l-4.293 4.293a1 1 0 0 1-1.414 0l-4.293-4.293a1 1 0 0 1 1.414-1.414L9 7.586V3a1 1 0 0 1 1-1zM2 10a8 8 0 1 1 16 0 8 8 0 0 1-16 0zm8 4a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                    </svg>
                    <span className="text">Anuncios</span>
                </button>
                <button aria-label="Ventas" type="button" className={tipo === 0 ? "button btnactive" : "button"} onClick={() => changeMenu(0)}>
                    <svg className="icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6 2a1 1 0 0 0-1 1v2H3a1 1 0 0 0-1 1v2h20V6a1 1 0 0 0-1-1h-2V3a1 1 0 0 0-1-1H6Zm1 3V4h10v1H7Zm-4 5v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V10H3Zm7 3a1 1 0 0 1 2 0v1a1 1 0 1 1-2 0v-1Zm4 0a1 1 0 0 1 2 0v1a1 1 0 1 1-2 0v-1Z" />
                    </svg>
                    <span className="text">Ventas</span>
                </button>
                <button aria-label="Recordatorios" type="button" className={tipo === 2 ? "button btnactive" : "button"} onClick={() => changeMenu(2)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" className="icon">
                        <path d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm0 14a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm-.5-9a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5V7z" />
                    </svg>
                    <span className="text">Recordatorios</span>
                </button>
                {
                    usuario.nombre.length > 0 ? <button type="button" className={tipo === 5 ? "button btnactive" : "button"} onClick={() => changeMenu(5, false, false)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" className="icon">
                            <path d="M4 3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4zm1 3h10v2H5V6zm0 4h10v2H5v-2zm0 4h6v2H5v-2z" />
                        </svg>
                        <span className="text">Votaciones</span>
                    </button> :
                        <button type="button" className={tipo === 4 ? "button btnactive" : "button"} onClick={() => changeMenu(4, true)}>
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
        if (a.idTipo !== tipo)
            return false
        else
            return <div key={i} className="anuncio card-shadow col-12 col-md-4 my-3" onClick={() => { setDataDetalle(a); setVerDetalle(true); }}>
                <div className="anuncio-header">
                    {
                        usuario.nombre.length > 0 && <div style={{ justifyContent: 'end', display: 'flex' }} >
                            {
                                usuario.id === a.idUsuario || usuario.rol === "ADMINISTRADOR" ?
                                    <>
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
                                    </>
                                    : ""
                            }

                        </div>
                    }
                    <span className="anuncio-title">{a.cabecera}</span>
                </div>
                <div className="anuncio-body" dangerouslySetInnerHTML={{ __html: a.descripcion }} />
                <div className="anuncio-footer">
                    <div className="anuncio-organizador">
                        <span>Creado por: </span>
                        <span className="ml-1">{a.organizador}</span>
                    </div>
                    <span className="anuncio-telefono">{a.telefono}</span>
                </div>
                {a.amedida && a.amedida.includes("http") ?
                    <div className="anuncio-img-wrapper">
                        <video src={a.amedida} controls width="300" />
                    </div>
                    : a.amedida && !a.amedida.includes("http") ?
                        <div className="anuncio-img-wrapper">
                            <img className="anuncio-img" src={`data:image/jpeg;base64,${a.amedida}`} alt="Foto" />
                        </div>
                        : ""
                }
                <small className="anuncio-fecha">
                    Fecha publicación: {new Date(a.fechaDesde).toLocaleDateString()}
                </small>
                <div className="anuncio-like">
                    <svg className="like-icon" viewBox="0 0 24 24" onClick={() => handleLike(a.id, true)}>
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
             2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09 
             C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 
             22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    <span className="like-count">{a.likes === 0 ? "" : a.likes}</span>
                </div>
            </div>
    }

    const handleKeyDown = (e: any) => {
        if (e.key === 'Enter') {
            login();
        }
    };

    const panelInicioSesion = () => {
        return <div className="mx-3 w-100 search-container" style={{ marginTop: '35%' }}>
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
            VotarLogic(selVotar, ev.target.id, usuario.id);
        } else {
            VotarLogic(selVotar, ev.target.parentNode.id, usuario.id);
        }
    }

    const selVotar = (error: Boolean, err: string, data: any) => {
        try {
            ObtenerVotacionesLogic(selListadoVotaciones, localStorage.getItem("idCondominio")!.toString(), usuario.id);
        } catch (er) {
        }
    }

    const panelVotaciones = () => {
        return <div style={{ fontFamily: 'Arial, sans-serif' }}>
            <h2 className="mt-3 mb-4">VOTACIONES ACTIVAS</h2>
            {dataVotaciones.map((a: any, i: number) => {
                return (
                    <div className="cardVotacion">
                        <h4 className="text-center">{a.cabecera}</h4>
                        <span className="mb-3 text-center d-block">{a.descripcion}</span>
                        {a.opcionesVotacion.map((b: any, o: number) => {
                            let percentage = a.total && b.votaciones.length ? (b.votaciones.length / a.total) * 100 : 0;
                            return (<div key={o} style={{ marginBottom: '10px' }}>
                                <span>{b.descripcion}</span>
                                <div id={b.id} style={{ background: '#ddd', height: '25px', width: '100%', borderRadius: '5px', marginTop: '5px' }} onClick={(ev) => { cambiarVoto(ev); }}>
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

    const comments = [
        {
            id: 1,
            author: 'Juan Pérez',
            date: '2025-05-01',
            content: 'Me interesa vecina.',
        },
        {
            id: 2,
            author: 'María López',
            date: '2025-05-02',
            content: 'Está muy caro 😥.',
        },
        {
            id: 3,
            author: 'Carlos Gómez',
            date: '2025-05-03',
            content: 'A mi me gustan mucho de esas',
        },
    ];

    const panelDetalleAnuncio = () => {
        console.log(dataDetalle);
        return (
            <div className="mx-3">
                <h4 className="mt-3 mb-4 text-center" style={{fontSize: '1.7rem', fontWeight: '700'}}>{dataDetalle.cabecera}</h4>
                <div className="anuncio-body" dangerouslySetInnerHTML={{ __html: dataDetalle.descripcion }} />
                <div className="anuncio-footer">
                    <div className="anuncio-organizador">
                        <span>Creado por: </span>
                        <span className="ml-1">{dataDetalle.organizador}</span>
                    </div>
                    <span className="anuncio-telefono">{dataDetalle.telefono}</span>
                </div>
                {dataDetalle.amedida && dataDetalle.amedida.includes("http") ?
                    <div className="anuncio-img-wrapper">
                        <video src={dataDetalle.amedida} controls width="300" />
                    </div>
                    : dataDetalle.amedida && !dataDetalle.amedida.includes("http") ?
                        <div className="anuncio-img-wrapper">
                            <img className="anuncio-img" src={`data:image/jpeg;base64,${dataDetalle.amedida}`} alt="Foto" />
                        </div>
                        : ""
                }
                <div className="d-flex align-items-center w-100" style={{justifyContent: 'space-between'}}>
                <small className="anuncio-fecha" style={{position: 'relative', marginLeft: '20px', bottom: '0'}}>
                    Fecha publicación: {new Date(dataDetalle.fechaDesde).toLocaleDateString()}
                </small>
                <div className="anuncio-like" style={{position: 'relative', marginRight: '20px', bottom: '0'}}>
                    <svg className="like-icon" viewBox="0 0 24 24" onClick={() => handleLike(dataDetalle.id, true)}>
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
                    {comments.map(({ id, author, date, content }) => (
                        <div key={id} className="comment-box">
                            <div className="comment-header">
                                <span className="comment-author">{author}</span>
                                <span className="comment-date">{new Date(date).toLocaleDateString()}</span>
                            </div>
                            <p className="comment-content">{content}</p>
                        </div>
                    ))}
                    <textarea
                        className="comment-textarea"
                        placeholder="Escribe tu comentario..."
                        //value={content}
                        //onChange={(e) => setContent(e.target.value)}
                        rows={3}
                        maxLength={500}
                    />
                    <button
                        type="button"
                        className="search-button w-100 mt-1"
                    //onClick={handleClick}
                    >
                        Publicar comentario
                    </button>
                </div>
            </div>
        );
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

                {(tipoSubir === 1 || (editar && (anuncio.amedida && !anuncio.amedida.startsWith("http")))) && (
                    <label htmlFor="textfield" className="search-label-admin mt-3">
                        Cargar imagen
                    </label>
                )}
                {(tipoSubir === 1 || (editar && (anuncio.amedida && !anuncio.amedida.startsWith("http")))) && (
                    <input type="file" accept="image/*" className="w-100" onChange={handleImageChange} />
                )}
                {(anuncio.amedida && (anuncio.amedida && !anuncio.amedida.startsWith("http"))) && (
                    <div>
                        <h3>Vista previa Imagen:</h3>
                        <img
                            src={`data:image/jpeg;base64,${anuncio.amedida}`}
                            alt="Vista previa"
                            style={{ maxWidth: '300px', marginTop: '10px' }}
                        />
                    </div>
                )}


                {(tipoSubir === 2 || (editar && (anuncio.amedida && anuncio.amedida.startsWith("http")))) && (
                    <label htmlFor="textfield" className="search-label-admin mt-3">
                        Cargar video
                    </label>
                )}
                {(tipoSubir === 2 || (editar && (anuncio.amedida && anuncio.amedida.startsWith("http")))) && (
                    <input type="file" accept="video/*" className="w-100" onChange={e => uploadVideo(e.target.files)} />
                )}
                {(anuncio.amedida && anuncio.amedida.startsWith("http")) && (
                    <div>
                        <h3>Vista previa Video:</h3>
                        <video src={anuncio.amedida} controls width="300" />
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
    const iconNotificaciones = (activa: boolean) => {
        return !activa ?""
            :
            <img width={25} src={menuicon} alt="icono abrir menu" />
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


    // eslint-disable-next-line
    const selSuscribir = (error: Boolean, err: string, data: any) => {
        setLoading(false);
        try {
            if (data) {
                SuccessMessage("Su suscripción a las notificaciones fue realizada correctamente.")
                setUsuario({
                    nombre: usuario.nombre,
                    tieneSuscripcionMensajes: err === "2" ? true : usuario.tieneSuscripcionMensajes,
                    tieneSuscripcionVotaciones: err === "3" ? true : usuario.tieneSuscripcionVotaciones,
                    tieneSuscripcionAnuncios: err === "1" ? true : usuario.tieneSuscripcionAnuncios,
                    rol: usuario.rol,
                    id: usuario.id
                });
                let campo = err === "2" ? "tieneSuscripcionMensajes" : err === "3" ? "tieneSuscripcionVotaciones" : "tieneSuscripcionAnuncios";
                localStorage.setItem(campo, "true");
            }
            else {
                ErrorMessage("Error crear suscripción", "Favor intentarlo nuevamente en unos minutos")
            }
        } catch (er) {
            ErrorMessage("Error crear suscripción", "Favor comuniquese con el administrador.")
        }
    }

    // eslint-disable-next-line
    const selDesSuscribir = (error: Boolean, err: string, data: any) => {
        setLoading(false);
        try {
            if (data) {
                SuccessMessage("Su desuscribipción a las notificaciones fue realizada correctamente.")
                setUsuario({
                    nombre: usuario.nombre,
                    tieneSuscripcionMensajes: err === "2" ? false : usuario.tieneSuscripcionMensajes,
                    tieneSuscripcionVotaciones: err === "3" ? false : usuario.tieneSuscripcionVotaciones,
                    tieneSuscripcionAnuncios: err === "1" ? false : usuario.tieneSuscripcionAnuncios,
                    rol: usuario.rol,
                    id: usuario.id
                });
                let campo = err === "2" ? "tieneSuscripcionMensajes" : err === "3" ? "tieneSuscripcionVotaciones" : "tieneSuscripcionAnuncios";
                localStorage.setItem(campo, "false");
            }
            else {
                ErrorMessage("Error quitar suscripción", "Favor intentarlo nuevamente en unos minutos")
            }
        } catch (er) {
            ErrorMessage("Error quitar suscripción", "Favor comuniquese con el administrador.")
        }
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////
    return (
        <React.Fragment>
            {
                loading ?
                    <Loading />
                    :
                    <div>
                        {/*<div className="w-100 pb-3 mb-3" style={{ background: 'linear-gradient(rgb(255, 255, 255), rgb(144 212 164 / 67%))', justifyContent: 'center', display: 'grid', boxShadow: 'rgb(2 109 33 / 24%) 0px 0px 24px 0px' }}>
                            <img className="w-50 mx-auto" src={`data:image/jpeg;base64,${dataFull.logo}`} alt="Logo" />
                            <h2 className="text-center" style={{ color: '#316371', margin: '0' }}>{dataFull.nombre}</h2>
                            {
                                usuario.nombre.length > 0 && <h6 className="text-center" style={{ color: '#316371', margin: '0' }}>Usuario: {usuario.nombre}</h6>
                            }
                            {
                                usuario.rol.length > 0 && <h6 className="text-center" style={{ color: '#316371', margin: '0' }}>{usuario.rol}</h6>
                            }
                            {
                                usuario.nombre.length > 0 && !usuario.tieneSuscripcion ? <button className="iconNotificacion" onClick={() => { setLoading(true); SuscribirNotificacionesLogic(selSuscribir, urlPase[3], usuario.id) }}>
                                    <img src={notificacion} />
                                </button>
                                    : usuario.nombre.length > 0 && usuario.tieneSuscripcion ? <button className="iconNotificacion" onClick={() => { setLoading(true); DessuscribirNotificacionesLogic(selDesSuscribir, usuario.id) }}>
                                        <img src={silenciarnotificacion} />
                                    </button>
                                        : ""
                            }
                            <button className="iconRefresh" onClick={() => { setLoading(true); ObtenerListadoAnuncioLogic(selListadoAnuncios, urlPase[3]); }}>
                                <img width={35} src={refresh} />
                            </button>
                        </div>*/}
                        <div className="w-100 pb-3 mb-3 containerMenu">
                            <div className="containerImgMenu">
                                {/*
                                    usuario.nombre.length > 0 && !usuario.tieneSuscripcion ?
                                        <button className="iconNotificacion" onClick={() => { setLoading(true); SuscribirNotificacionesLogic(selSuscribir, urlPase[3], usuario.id) }}>
                                            <img width={25} src={notificacion} />
                                        </button>
                                        : usuario.nombre.length > 0 && usuario.tieneSuscripcion ?
                                            <button className="iconNotificacion" onClick={() => { setLoading(true); DessuscribirNotificacionesLogic(selDesSuscribir, usuario.id) }}>
                                                <img width={25} src={silenciarnotificacion} />
                                            </button>
                                            : ""
                                */}
                                {
                                    usuario.nombre.length > 0 && <button className="iconNotificacion" onClick={() => { setMenuOpciones(!menuOpciones); }}>
                                        <img width={25} src={menuicon} alt="icono abrir menu" />
                                    </button>
                                }
                                <img src={`data:image/jpeg;base64,${dataFull.logo}`} alt="Logo" style={{ width: '65px', margin: '0 auto' }} />
                                <button className="iconRefresh" onClick={() => { setLoading(true); ObtenerListadoAnuncioLogic(selListadoAnuncios, urlPase[3]); }}>
                                    <img width={25} src={actualizar} alt="icono actualizar" />
                                </button>
                            </div>
                            {menuOpciones && (
                                <div className="custom-menu">
                                    <button type="button">
                                        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                            <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                                        </svg>
                                        Perfil
                                    </button>
                                    <button type="button" onClick={() => {
                                        setLoading(true);
                                        !usuario.tieneSuscripcionAnuncios ? SuscribirNotificacionesLogic(selSuscribir, urlPase[3], usuario.id, 1) : DessuscribirNotificacionesLogic(selDesSuscribir, usuario.id, 1)
                                    }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path d="M10 2a6 6 0 00-6 6v2.586l-.707.707A1 1 0 004 13h12a1 1 0 00.707-1.707L16 10.586V8a6 6 0 00-6-6zm0 16a2 2 0 002-2H8a2 2 0 002 2z" />
                                        </svg>
                                        Notif. Anuncios
                                        {iconNotificaciones(usuario.tieneSuscripcionAnuncios)}
                                    </button>
                                    <button type="button" onClick={() => {
                                        setLoading(true);
                                        !usuario.tieneSuscripcionMensajes ? SuscribirNotificacionesLogic(selSuscribir, urlPase[3], usuario.id, 2) : DessuscribirNotificacionesLogic(selDesSuscribir, usuario.id, 2)
                                    }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path d="M10 2a6 6 0 00-6 6v2.586l-.707.707A1 1 0 004 13h12a1 1 0 00.707-1.707L16 10.586V8a6 6 0 00-6-6zm0 16a2 2 0 002-2H8a2 2 0 002 2z" />
                                        </svg>
                                        Notif. Mensajes
                                        {iconNotificaciones(usuario.tieneSuscripcionMensajes)}
                                    </button>
                                    <button type="button" onClick={() => {
                                        setLoading(true);
                                        !usuario.tieneSuscripcionVotaciones ? SuscribirNotificacionesLogic(selSuscribir, urlPase[3], usuario.id, 3) : DessuscribirNotificacionesLogic(selDesSuscribir, usuario.id, 3)
                                    }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path d="M10 2a6 6 0 00-6 6v2.586l-.707.707A1 1 0 004 13h12a1 1 0 00.707-1.707L16 10.586V8a6 6 0 00-6-6zm0 16a2 2 0 002-2H8a2 2 0 002 2z" />
                                        </svg>
                                        Notif. Votaciones
                                        {iconNotificaciones(usuario.tieneSuscripcionVotaciones)}
                                    </button>
                                    <button type="button" onClick={() => {
                                        setMenuOpciones(false)
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
                                            : votaciones ?
                                                <>
                                                    {panelVotaciones()}
                                                </>
                                                :
                                                encuesta ?
                                                    <>
                                                        {panelCrearEncuesta()}
                                                    </>
                                                    :
                                                    verDetalle && tipo !== 2 ?
                                                        <>
                                                            {panelDetalleAnuncio()}
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
                        {navegador()}
                    </div>
            }
        </React.Fragment>
    );
}

export default Condominio;