import React, { useEffect, useState } from "react";
import Loading from "../../components/utils/loading";
import './Home.css';
import { LoginLogic } from "../../presentation/view-model/Anuncio.logic";
import { ErrorMessage } from "../../components/utils/messages";
import logo from './../../components/utils/img/logo.png';

const Home = () => {
    const [loading, setLoading] = useState(false);
    const [loguear, setLoguear] = useState({
        usuario: "",
        clave: "",
        idCondominio: localStorage.getItem("idCondominio") ?? ""
    });

    const [usuario, setUsuario] = useState({
        nombre: "",
        tieneSuscripcionMensajes: false,
        tieneSuscripcionVotaciones: false,
        tieneSuscripcionAnuncios: false,
        tieneSuscripcionAvisos: false,
        rol: "",
        id: 0
    });
    const [iniciarSesion, setIniciarSesion] = useState(false)

    /*useEffect(() => {
        if (localStorage.getItem("idCondominio"))
            window.location.href = "/" + localStorage.getItem("idCondominio") + "/comunidad"
    }, [])*/

    const handleKeyDown = (e: any) => {
        if (e.key === 'Enter') {
            LoginLogic(selLogin, normalizarLogin(loguear))
        }
    };

    const normalizarLogin = (data: any) => {
        return {
            usuario: data.usuario ?? "",
            clave: data.clave ?? "",
            idCondominio: localStorage.getItem("idCondominio") ?? ""
        };
    };

    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/service-worker.js')
                .then(reg => {
                    //console.log('Service Worker registrado:', reg);
                })
                .catch(err => {
                    //console.error('Error al registrar SW:', err)
                });
        }
    }, []);


    const login = () => {
        try {
            setLoading(true);
            LoginLogic(selLogin, normalizarLogin(loguear))
        } catch (er) {
            console.log(er);
        }
    }

    const handleChangeLogin = (e: any) => {
        const { name, value } = e.target;
        setLoguear(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const selLogin = (error: Boolean, err: string, data: any) => {
        try {
            setLoading(false);
            if (data.nombre !== null) {
                setUsuario(data);
                setIniciarSesion(false)
                localStorage.setItem("nombreUsuario", data.nombre);
                localStorage.setItem("tieneSuscripcionMensajes", data.tieneSuscripcionMensajes);
                localStorage.setItem("tieneSuscripcionVotaciones", data.tieneSuscripcionVotaciones);
                localStorage.setItem("tieneSuscripcionAnuncios", data.tieneSuscripcionAnuncios);
                localStorage.setItem("tieneSuscripcionAvisos", data.tieneSuscripcionAvisos);
                localStorage.setItem("rolUsuario", data.rol);
                localStorage.setItem("idUsuario", data.id);
            }
            else {
                setUsuario({
                    nombre: "",
                    tieneSuscripcionMensajes: false,
                    tieneSuscripcionVotaciones: false,
                    tieneSuscripcionAnuncios: false,
                    tieneSuscripcionAvisos: false,
                    rol: "",
                    id: 0
                });
                ErrorMessage("Credenciales incorrectas", "")
            }
            setLoguear({
                usuario: "",
                clave: "",
                idCondominio: localStorage.getItem("idCondominio")!.toString()
            })
        } catch (er) {
            ErrorMessage("Credenciales incorrectas", "")
        }
    }

    return (
        <React.Fragment>
            {
                loading ?
                    <Loading />
                    :
                    <div style={{ marginTop: '-10%' }}>
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
        </React.Fragment>
    );
}

export default Home;