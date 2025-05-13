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
import buscar from '../../components/utils/img/menuInferior/buscar.png';
import buscarSelect from '../../components/utils/img/menuInferior/buscar-select.png';
import perfil from '../../components/utils/img/menuInferior/perfil.png';
import perfilSelect from '../../components/utils/img/menuInferior/perfil-select.png';
import mispublicaciones from '../../components/utils/img/menuInferior/mispublicaciones.png';
import mispublicacionesSelect from '../../components/utils/img/menuInferior/mispublicaciones-select.png';
import comunidad from '../../components/utils/img/menuInferior/comunidad.png';
import comunidadSelect from '../../components/utils/img/menuInferior/comunidad-select.png';
import notificaciones from '../../components/utils/img/menuInferior/notificaciones.png';
import rules from '../../components/utils/img/menuInferior/rules.png';
import rulesSelect from '../../components/utils/img/menuInferior/rules-select.png';
import emergency from '../../components/utils/img/menuInferior/emergency.png';
import emergencySelect from '../../components/utils/img/menuInferior/emergency-select.png';

const icons = {
    emergency: (
        <img width={25} src={emergency} />
    ),
    emergencySelect: (
        <img width={25} src={emergencySelect} />
    ),
    rules: (
        <img width={25} src={rules} />
    ),
    rulesSelect: (
        <img width={25} src={rulesSelect} />
    ),
    notificaciones: (
        <img width={25} src={notificaciones} />
    ),
    comunidad: (
        <img width={25} src={comunidad} />
    ),
    comunidadSelect: (
        <img width={25} src={comunidadSelect} />
    ),
    mispublicaciones: (
        <img width={25} src={mispublicaciones} />
    ),
    mispublicacionesSelect: (
        <img width={25} src={mispublicacionesSelect} />
    ),
    perfil: (
        <img width={25} src={perfil} />
    ),
    perfilSelect: (
        <img width={25} src={perfilSelect} />
    ),
    buscar: (
        <img width={25} src={buscar} />
    ),
    buscarSelect: (
        <img width={25} src={buscarSelect} />
    ),
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
                    className={`nav-button ${active === 'buscar' ? 'active' : ''}`}
                    onClick={() => setActive('buscar')}
                    aria-label="Calendario"
                >
                    {active === 'buscar' ? icons.buscarSelect : icons.buscar}
                </button>
                <button
                    className={`nav-button ${active === 'calendario' ? 'active' : ''}`}
                    onClick={() => setActive('calendario')}
                    aria-label="Calendario"
                >
                    {active === 'calendario' ? icons.calendarioSelect : icons.calendario}
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
                    <div className={`${menuOpen ? 'visual' : ''} container-submenu`}>
                        <div className={`create-dropdown ${menuOpen ? 'show' : ''} fullContainerOpciones shadow`}>
                            <div className='filaOpciones'>
                                <button
                                    className={`nav-button container-Opcion`}
                                    onClick={() => setActive('buscar')}
                                    aria-label="Anuncios"
                                >
                                    {icons.perfilSelect}
                                    <span className='txtOpcion'>Mi<br></br>Perfil</span>
                                </button>
                                <button
                                    className={`nav-button container-Opcion`}
                                    onClick={() => setActive('buscar')}
                                    aria-label="Anuncios"
                                >
                                    {icons.mispublicacionesSelect}
                                    <span className='txtOpcion'>Mis<br></br>Publicaciones</span>
                                </button>
                                <button
                                    className={`nav-button container-Opcion`}
                                    onClick={() => setActive('buscar')}
                                    aria-label="Anuncios"
                                >
                                    {icons.comunidadSelect}
                                    <span className='txtOpcion'>Mi<br></br>Comunidad</span>
                                </button>
                                <button
                                    className={`nav-button container-Opcion`}
                                    onClick={() => setActive('buscar')}
                                    aria-label="Anuncios"
                                >
                                    {icons.anunciosSelect}
                                    <span className='txtOpcion'>Crear <br></br>Anuncio</span>
                                </button>
                                <button
                                    className={`nav-button container-Opcion`}
                                    onClick={() => setActive('buscar')}
                                    aria-label="Votaciones"
                                >
                                    {icons.votacionesSelect}
                                    <span className='txtOpcion'>Crear <br></br>Votación</span>
                                </button>
                                <button
                                    className={`nav-button container-Opcion`}
                                    onClick={() => setActive('buscar')}
                                    aria-label="Votaciones"
                                >
                                    {icons.rulesSelect}
                                    <span className='txtOpcion'>Reglas <br></br>y Normas</span>
                                </button>
                                <button
                                    className={`nav-button container-Opcion`}
                                    onClick={() => setActive('buscar')}
                                    aria-label="Votaciones"
                                >
                                    {icons.emergencySelect}
                                    <span className='txtOpcion'>Núm.<br></br> Emergencias</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <button
                    className={`nav-button ${active === 'anuncios' ? 'active' : ''}`}
                    onClick={() => setActive('anuncios')}
                    aria-label="Anuncios"
                >
                    {active === 'anuncios' ? icons.anunciosSelect : icons.anuncios}
                </button>

                <button
                    className={`nav-button ${active === 'votaciones' ? 'active' : ''}`}
                    onClick={() => setActive('votaciones')}
                    aria-label="Votaciones"
                >
                    {active === 'votaciones' ? icons.votacionesSelect : icons.votaciones}
                </button>
            </nav>
        </>
    );
}
