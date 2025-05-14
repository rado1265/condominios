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

interface Props {
    active: string;
    onChangeMenu: (e: string) => void;
}

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

const BottomNav: React.FC<Props> = ({active, onChangeMenu}) => {
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

    useEffect(() => {
        setMenuOpen(false);
    }, [active]);

    const handleCreateClick = () => {
        setMenuOpen((open) => !open);
    };

    return (
        <>
            <nav className="bottom-nav">
                <button
                    className={`nav-button ${active === 'buscar' ? 'active' : ''}`}
                    //onClick={() => onChangeMenu('buscar')}
                    aria-label="Buscar"
                >
                    {active === 'buscar' ? icons.buscarSelect : icons.buscar}
                </button>
                <button
                    className={`nav-button ${active === 'calendario' ? 'active' : ''}`}
                    onClick={() => onChangeMenu('calendario')}
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
                                    onClick={() => onChangeMenu('perfil')}
                                    aria-label="Mi Perfil"
                                >
                                    {icons.perfilSelect}
                                    <span className='txtOpcion'>Mi<br></br>Perfil</span>
                                </button>
                                <button
                                    className={`nav-button container-Opcion`}
                                    onClick={() => onChangeMenu('mispublicaciones')}
                                    aria-label="Mis Publicaciones"
                                >
                                    {icons.mispublicacionesSelect}
                                    <span className='txtOpcion'>Mis<br></br>Publicaciones</span>
                                </button>
                                <button
                                    className={`nav-button container-Opcion`}
                                    onClick={() => onChangeMenu('comunidad')}
                                    aria-label="Mi Comunidad"
                                >
                                    {icons.comunidadSelect}
                                    <span className='txtOpcion'>Mi<br></br>Comunidad</span>
                                </button>
                                <button
                                    className={`nav-button container-Opcion`}
                                    onClick={() => onChangeMenu('crearAnuncio')}
                                    aria-label="Crear Anuncio"
                                >
                                    {icons.anunciosSelect}
                                    <span className='txtOpcion'>Crear <br></br>Anuncio</span>
                                </button>
                                <button
                                    className={`nav-button container-Opcion`}
                                    onClick={() => onChangeMenu('crearVotacion')}
                                    aria-label="Crear Votación"
                                >
                                    {icons.votacionesSelect}
                                    <span className='txtOpcion'>Crear <br></br>Votación</span>
                                </button>
                                <button
                                    className={`nav-button container-Opcion`}
                                    onClick={() => onChangeMenu('reglas')}
                                    aria-label="Reglas y Normas"
                                >
                                    {icons.rulesSelect}
                                    <span className='txtOpcion'>Reglas y<br></br> Normas</span>
                                </button>
                                <button
                                    className={`nav-button container-Opcion`}
                                    onClick={() => onChangeMenu('numEmergencias')}
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
                    onClick={() => onChangeMenu('anuncios')}
                    aria-label="Anuncios"
                >
                    {active === 'anuncios' ? icons.anunciosSelect : icons.anuncios}
                </button>

                <button
                    className={`nav-button ${active === 'votaciones' ? 'active' : ''}`}
                    onClick={() => onChangeMenu('votaciones')}
                    aria-label="Votaciones"
                >
                    {active === 'votaciones' ? icons.votacionesSelect : icons.votaciones}
                </button>
            </nav>
        </>
    );
};

export default BottomNav;
