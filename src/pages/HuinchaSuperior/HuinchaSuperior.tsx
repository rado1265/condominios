import React, { useEffect, useRef, useState } from 'react';
import './HuinchaSuperior.css';
import back from './../../components/utils/img/menuInferior/back.png';
import logout from './../../components/utils/img/menuInferior/logout.png';
import perfilSelect from './../../components/utils/img/menuInferior/perfil-select.png';

interface Props {
    enComunidad: boolean;
    imagenPerfil: string;
    onChangeAtras: () => void;
}

const HuinchaSuperior: React.FC<Props> = ({ enComunidad, onChangeAtras, imagenPerfil }) => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Cerrar dropdown si se hace click fuera
    useEffect(() => {
        function handleClickOutside(event: any) {
            if (dropdownRef.current && !(dropdownRef.current as any).contains(event.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <>
            <div className={enComunidad ? "w-100 p-3 mb-3 containerMenu" : "d-none"}>
                <img src={back} onClick={onChangeAtras} />
                <span className='tituloMenu'>Mi Comunidad</span>
                <div className="huincha-profile-dropdown" ref={dropdownRef}>
                    <button
                        className="huincha-icon-button"
                        aria-label="Perfil de usuario"
                        onClick={() => setOpen((o) => !o)}
                        aria-expanded={open}
                        aria-haspopup="true"
                        type="button"
                    >
                        <img src={imagenPerfil} />
                    </button>

                    {open && (
                        <div className="huincha-dropdown-menu" role="menu">
                            <div
                                className="huincha-dropdown-item"
                                role="menuitem"
                                tabIndex={0}
                                onClick={() => {
                                    setOpen(false);
                                    alert("Ir a Mi Perfil");
                                }}
                                onKeyDown={(e) => e.key === "Enter" && alert("Ir a Mi Perfil")}
                            >
                                <img className='mr-1' src={perfilSelect}/> Mi Perfil
                            </div>
                            <div
                                className="huincha-dropdown-item"
                                role="menuitem"
                                tabIndex={0}
                                onClick={() => {
                                    setOpen(false);
                                    alert("Cerrar Sesión");
                                }}
                                onKeyDown={(e) => e.key === "Enter" && alert("Cerrar Sesión")}
                            >
                                <img className='mr-1' src={logout}/> Cerrar Sesión
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default HuinchaSuperior;
