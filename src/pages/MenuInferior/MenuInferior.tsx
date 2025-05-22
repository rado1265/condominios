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
import close from '../../components/utils/img/menuInferior/close.png';
import EspacioComun from '../../components/utils/img/menuInferior/comunes.png';
import EspacioComunSelect from '../../components/utils/img/menuInferior/comunesSelect.png';
interface Props {
    active: string;
    orden: string;
    onChangeMenu: (e: string) => void;
    onChangeCriterio: (e: string) => void;
    onFiltrarDataFull: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onChangeOrden: (e: string) => void;
    usuario: any;
}

const icons = {
    close: (
        <img width={25} src={close} alt='Icono Cerrar' />
    ),
    emergency: (
        <img width={25} src={emergency} alt='Icono Números de emergencia' />
    ),
    emergencySelect: (
        <img width={25} src={emergencySelect} alt='Icono Números de emergencia Seleccionado' />
    ),
    rules: (
        <img width={25} src={rules} alt='Icono Reglas y Normas' />
    ),
    rulesSelect: (
        <img width={25} src={rulesSelect} alt='Icono Reglas y Normas Seleccionado' />
    ),
    notificaciones: (
        <img width={25} src={notificaciones} alt='Icono Notificaciones' />
    ),
    comunidad: (
        <img width={25} src={comunidad} alt='Icono Comunidad' />
    ),
    comunidadSelect: (
        <img width={25} src={comunidadSelect} alt='Icono Comunidad Seleccionado' />
    ),
    mispublicaciones: (
        <img width={25} src={mispublicaciones} alt='Icono Mis Publicaciones' />
    ),
    mispublicacionesSelect: (
        <img width={25} src={mispublicacionesSelect} alt='Icono Mis Publicaciones Seleccionado' />
    ),
    perfil: (
        <img width={25} src={perfil} alt='Icono Mis Perfil' />
    ),
    perfilSelect: (
        <img width={25} src={perfilSelect} alt='Icono Mis Perfil Seleccionado' />
    ),
    buscar: (
        <img width={25} src={buscar} alt='Icono Buscar' />
    ),
    buscarSelect: (
        <img width={25} src={buscarSelect} alt='Icono Buscar Seleccionado' />
    ),
    calendario: (
        <img width={25} src={calendario} alt='Icono Calendario' />
    ),
    calendarioSelect: (
        <img width={25} src={calendarioSelect} alt='Icono Calendario Seleccionado' />
    ),
    anuncios: (
        <img width={30} src={anuncio} alt='Icono Anuncios' />
    ),
    anunciosSelect: (
        <img width={30} src={anuncioSelect} alt='Icono Anuncios Seleccionado' />
    ),
    crear: (
        <img width={25} src={iconMore} alt='Icono Crear' />
    ),
    votaciones: (
        <img width={25} src={votaciones} alt='Icono Votaciones' />
    ),
    votacionesSelect: (
        <img width={25} src={votacionesSelect} alt='Icono Votaciones Seleccionado' />
    ),
    more: (
        <img width={25} src={more} alt='Icono Más' />
    ),
    moreSelect: (
        <img id="moreSelect" width={25} src={moreSelect} alt='Icono Más Seleccionado' />
    ),
    anuncioOption: (
        <img width={25} src={anuncio} alt='Icono Opciones Anuncio' />
    ),
    votacionOption: (
        <img width={25} src={votaciones} alt='Icono Opciones Votacion' />
    ),
    EspacioComun: (
        <img width={27} src={EspacioComun} alt='Icono Espacios Comunes' />
    ),
    EspacioComunSelect: (
        <img width={27} src={EspacioComunSelect} alt='Icono Espacios Comunes Seleccionado' />
    ),
};

const BottomNav: React.FC<Props> = ({ active, orden, onChangeMenu, onChangeCriterio, onFiltrarDataFull, onChangeOrden, usuario }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const containerRef = useRef(null);

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

    /*useEffect(() => {
        setMenuOpen(false);
    }, [active]);*/

    const handleCreateClick = () => {
        setMenuOpen((open) => !open);
    };

    const cerrarMenuInf = () => {
        setMenuOpen(false);
    };

    return (
        <>
            <nav className="bottom-nav">
                <button
                    className={`nav-button ${active === 'espacioComun' ? 'active' : ''}`}
                    onClick={() => { onChangeMenu('espacioComun'); cerrarMenuInf() }}
                    aria-label="Espacio Comun"
                >
                    {active === 'espacioComun' ? icons.EspacioComunSelect : icons.EspacioComun}
                </button>
                <button
                    className={`nav-button ${active === 'calendario' ? 'active' : ''}`}
                    onClick={() => { onChangeMenu('calendario'); cerrarMenuInf() }}
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
                                    onClick={() => { onChangeMenu('mispublicaciones'); cerrarMenuInf() }}
                                    aria-label="Mis Publicaciones"
                                >
                                    {icons.mispublicacionesSelect}
                                    <span className='txtOpcion'>Mis<br></br>Publicaciones</span>
                                </button>
                                <button
                                    className={`nav-button container-Opcion`}
                                    onClick={() => { onChangeMenu('comunidad'); cerrarMenuInf() }}
                                    aria-label="Mi Comunidad"
                                >
                                    {icons.comunidadSelect}
                                    <span className='txtOpcion'>Mi<br></br>Comunidad</span>
                                </button>
                                <button
                                    className={`nav-button container-Opcion`}
                                    onClick={() => { onChangeMenu('crearAnuncio'); cerrarMenuInf() }}
                                    aria-label="Crear Publicación"
                                >
                                    {icons.anunciosSelect}
                                    <span className='txtOpcion'>Crear <br></br>Anuncio</span>
                                </button>
                                {usuario.rol === "ADMINISTRADOR" && (
                                    <button
                                        className={`nav-button container-Opcion`}
                                        onClick={() => { onChangeMenu('crearVotacion'); cerrarMenuInf() }}
                                        aria-label="Crear Votación"
                                    >
                                        {icons.votacionesSelect}
                                        <span className='txtOpcion'>Crear <br></br>Votación</span>
                                    </button>
                                )}
                                <button
                                    className={`nav-button container-Opcion`}
                                    onClick={() => { onChangeMenu('reglas'); cerrarMenuInf() }}
                                    aria-label="Reglas y Normas"
                                >
                                    {icons.rulesSelect}
                                    <span className='txtOpcion'>Reglas y<br></br> Normas</span>
                                </button>
                                <button
                                    className={`nav-button container-Opcion`}
                                    onClick={() => { onChangeMenu('numEmergencias'); cerrarMenuInf() }}
                                    aria-label="Número emergencias"
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
                    onClick={() => { onChangeMenu('anuncios'); cerrarMenuInf() }}
                    aria-label="Anuncios"
                >
                    {active === 'anuncios' ? icons.anunciosSelect : icons.anuncios}
                </button>

                <button
                    className={`nav-button ${active === 'votaciones' ? 'active' : ''}`}
                    onClick={() => { onChangeMenu('votaciones'); cerrarMenuInf() }}
                    aria-label="Votaciones"
                >
                    {active === 'votaciones' ? icons.votacionesSelect : icons.votaciones}
                </button>
            </nav>
        </>
    );
};

export default BottomNav;
