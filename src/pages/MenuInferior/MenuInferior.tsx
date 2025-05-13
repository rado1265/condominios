import React, { useEffect, useRef, useState } from 'react';
import './MenuInferior.css'; // Importamos el CSS externo
import anuncio from '../../components/utils/img/menuInferior/anuncios.png';
import anuncioSelect from '../../components/utils/img/menuInferior/anuncios-select.png';
import calendario from '../../components/utils/img/menuInferior/calendario.png';
import calendarioSelect from '../../components/utils/img/menuInferior/calendario-select.png';
import votaciones from '../../components/utils/img/menuInferior/votaciones.png';
import votacionesSelect from '../../components/utils/img/menuInferior/votaciones-select.png';
import more from '../../components/utils/img/menuInferior/more.png';
import moreSelect from '../../components/utils/img/menuInferior/more-select.png';
import iconMore from '../../components/utils/img/menuInferior/iconMore.png';

const icons = {
    calendario: (
        <img width={25} src={calendario} />
    ),
    calendarioSelect: (
        <img width={25} src={calendarioSelect} />
    ),
    anuncios: (
        <img width={30} src={anuncio} />
    ),
    anunciosSelect: (
        <img width={30} src={anuncioSelect} />
    ),
    crear: (
        <img width={25} src={iconMore} />
    ),
    votaciones: (
        <img width={25} src={votaciones} />
    ),
    votacionesSelect: (
        <img width={25} src={votacionesSelect} />
    ),
    more: (
        <img width={25} src={more} />
    ),
    moreSelect: (
        <img id="moreSelect" width={25} src={moreSelect} />
    ),
    anuncioOption: (
        <img width={25} src={anuncio} />
    ),
    votacionOption: (
        <img width={25} src={votaciones} />
    ),
};

export default function BottomNav() {
    const [active, setActive] = useState('calendario');
    const [menuOpen, setMenuOpen] = useState(false);
    const containerRef = useRef(null);
    const [openCrear, setOpenCrear] = useState(false);
    const [usuario, setUsuario] = useState({
        nombre: "",
        tieneSuscripcionMensajes: false,
        tieneSuscripcionVotaciones: false,
        tieneSuscripcionAnuncios: false,
        tieneSuscripcionAvisos: false,
        rol: "",
        id: 0
    });
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
    const [openNotificaciones, setOpenNotificaciones] = useState(false);


    const [openEmergencias, setOpenEmergencias] = useState(false);
    const menuRef = useRef(null);

    // Cierra el menú si se hace click fuera
    useEffect(() => {
        function handleClickOutside(event: any) {
            if (openEmergencias && menuRef.current && !(menuRef.current as any).contains(event.target)) {
                if (event.target.id !== "iconoMenuInf" && event.target.id !== "moreSelect") {
                    setOpenEmergencias(false);
                }
            }
        }
        if (openEmergencias) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [openEmergencias]);

    useEffect(() => {
        function handleClickOutside(event: any) {
            if (containerRef.current && !(containerRef.current as any).contains(event.target)) {
                setMenuOpen(false);
            }
        }
        if (menuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuOpen]);

    const handleCreateClick = () => {
        setMenuOpen((open) => !open);
        setActive('crear');
    };

    const handleOptionClick = (option: any) => {
        setActive(option);
        setMenuOpen(false);
    };

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

    return (
        <>
            <nav className="bottom-nav">
                <button
                    className={`nav-button ${active === 'calendario' ? 'active' : ''}`}
                    onClick={() => setActive('calendario')}
                    aria-label="Calendario"
                >
                    {active === 'calendario' ? icons.calendarioSelect : icons.calendario}
                </button>
                <button
                    className={`nav-button ${active === 'anuncios' ? 'active' : ''}`}
                    onClick={() => setActive('anuncios')}
                    aria-label="Anuncios"
                >
                    {active === 'anuncios' ? icons.anunciosSelect : icons.anuncios}
                </button>

                <div className="create-container">
                    <button
                        className={`nav-button create-button ${menuOpen ? 'open' : ''}`}
                        onClick={handleCreateClick}
                        aria-label="Crear"
                        aria-expanded={menuOpen}
                        aria-haspopup="true"
                    >
                        {icons.crear}
                    </button>

                    <div className={`create-dropdown ${menuOpen ? 'show' : ''}`}>
                        <button
                            className="dropdown-option"
                            onClick={() => handleOptionClick('anuncios')}
                            aria-label="Crear Anuncio"
                        >
                            {icons.anuncioOption}
                            <span className="option-text">Anuncio</span>
                        </button>
                        <button
                            className="dropdown-option"
                            onClick={() => handleOptionClick('votaciones')}
                            aria-label="Crear Votación"
                        >
                            {icons.votacionOption}
                            <span className="option-text">Votación</span>
                        </button>
                    </div>
                </div>

                <button
                    className={`nav-button ${active === 'votaciones' ? 'active' : ''}`}
                    onClick={() => setActive('votaciones')}
                    aria-label="Votaciones"
                >
                    {active === 'votaciones' ? icons.votacionesSelect : icons.votaciones}
                </button>
                <button
                    className={`nav-button ${active === 'more' ? 'active' : ''}`}
                    id='iconoMenuInf'
                    onClick={() => { setActive('more'); setOpenEmergencias(!openEmergencias) }}
                    aria-label="Más opciones"
                >
                    {active === 'more' ? icons.moreSelect : icons.more}
                </button>
            </nav>
            {openEmergencias && (
                <div className='container-custom-menu'>
                    <div ref={menuRef} className="custom-menu">
                        <button type="button" onClick={() => {
                        }}>
                            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                            </svg>
                            Perfil
                        </button>
                        <button type="button" onClick={() => {
                        }}>
                            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M3 5a2 2 0 0 1 2-2h9l5 5v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5zm13.586 4L13 5.414V9h3.586zM7 13h10v1.5H7V13zm0 3h7v1.5H7V16z" />
                            </svg>
                            Mis Publicaciones
                        </button>
                        {
                            usuario.rol === "Administrador" || usuario.rol === "ADMINISTRADOR" && (
                                <button type="button" onClick={() => {
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
                            onClick={() => { setOpenNotificaciones(!openNotificaciones); setOpenCrear(false); }}
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
                                }}>
                                    Notif. Anuncios
                                    {iconNotificaciones(usuarioDetalle.tieneSuscripcionAnuncios)}
                                </button>
                                <button type="button" className="submenu-item ml-3" onClick={(ev) => {
                                }}>
                                    Notif. Mensajes
                                    {iconNotificaciones(usuarioDetalle.tieneSuscripcionMensajes)}
                                </button>
                                <button type="button" className="submenu-item ml-3" onClick={(ev) => {
                                }}>
                                    Notif. Votaciones
                                    {iconNotificaciones(usuarioDetalle.tieneSuscripcionVotaciones)}
                                </button>
                                <button type="button" className="submenu-item ml-3" onClick={(ev) => {
                                }}>
                                    Notif. Calendario
                                    {iconNotificaciones(usuarioDetalle.tieneSuscripcionAvisos)}
                                </button>
                            </div>
                        )}

                        <button type="button" onClick={() => {
                        }}>
                            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 10-1.5 0v1.5a.75.75 0 001.5 0v-1.5zM10 9a.75.75 0 00-.75.75v4a.75.75 0 001.5 0v-4A.75.75 0 0010 9z" clipRule="evenodd" />
                            </svg>
                            Reglas y Normas
                        </button>
                        <button type="button" onClick={() => {
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="red">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M10.29 3.86L1.82 18a1 1 0 00.86 1.5h18.64a1 1 0 00.86-1.5L13.71 3.86a1 1 0 00-1.72 0zM12 9v4m0 4h.01" />
                            </svg>
                            Núm. Emergencias
                        </button>
                        <button type="button" onClick={() => {
                        }}>
                            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M14.707 7.793a1 1 0 0 0-1.414 0L11 10.086V1.5a1 1 0 0 0-2 0v8.586L6.707 7.793a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.416 0l4-4a1 1 0 0 0-.002-1.414Z" />
                                <path d="M18 12h-2.55l-2.975 2.975a3.5 3.5 0 0 1-4.95 0L4.55 12H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-3 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
                            </svg>
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
