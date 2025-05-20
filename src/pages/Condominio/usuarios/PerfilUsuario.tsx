import React, { useState, useEffect } from 'react';
import iconeditar from './../../../components/utils/img/editar.png'
interface UsuarioDetalle {
    id: number;
    nombre: string;
    direccion: string;
    telefono: string;
    imagen: string;
    clave: string;
    activo: boolean;
    fechaCaducidad: Date;
    tieneSuscripcionMensajes: boolean;
    tieneSuscripcionVotaciones: boolean;
    tieneSuscripcionAnuncios: boolean;
    tieneSuscripcionAvisos: boolean;
    tieneSuscripcionEspacioComun: boolean;
    rol: string;
    mostrarDireccion: boolean;
}

interface Props {
    usuario: UsuarioDetalle;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onGuardar: (archivoAdjunto: File | null) => void;
    onCancelar: () => void;
    onChangeCreateSub: (tiene: any, id: any, ev: any) => void;
    loading?: boolean;
    onChangedireccion: (e: boolean) => void
}

const PerfilUsuario: React.FC<Props> = ({
    usuario,
    onChange,
    onGuardar,
    onCancelar,
    onChangeCreateSub,
    loading = false,
    onChangedireccion
}) => {
    const [preview, setPreview] = useState<string>("");
    const [editarPerfil, setEditarPerfil] = useState(false)
    const [archivoTemp, setArchivoTemp] = useState<File | null>(null);

    useEffect(() => {
        if (usuario.imagen) {
            setPreview(usuario.imagen);
        }
    }, [usuario.imagen]);

    const handleImagePerfilChange = (e: any) => {
        const file = e.target.files[0];

        if (!file) return;

        setArchivoTemp(file);

        document.getElementById('userDetallePerfil')?.classList.remove("d-none");
        document.getElementById('userDetallePerfilSVG')?.classList.add("d-none");

        const img = document.getElementById('userDetallePerfil') as HTMLImageElement | null;
        if (img) {
            img.src = URL.createObjectURL(file);
        }
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
        <form onSubmit={(e) => { e.preventDefault(); onGuardar(archivoTemp); setEditarPerfil(false); }} className="perfil-form mt-md-5">
            {
                editarPerfil ?
                    <>
                        <div className="login-box py-3 w-100">

                            <div style={{ justifySelf: 'center' }}>
                                <img
                                    className={usuario.imagen != null ? "" : "d-none"}
                                    id="userDetallePerfil"
                                    src={usuario.imagen}
                                    alt="Vista previa"
                                    style={{ maxWidth: '200px', marginTop: '10px' }}
                                />
                                <div id="userDetallePerfilSVG" className={usuario.imagen != null ? "d-none" : "perfil-avatar"}>
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
                                value={usuario.nombre}
                                disabled
                            />
                            <label htmlFor="textfield" className="search-label-admin">
                                Rol
                            </label>
                            <input
                                name="descripcion"
                                className="search-input"
                                value={usuario.rol}
                                disabled
                            />
                            <label htmlFor="textfield" className="search-label-admin" defaultValue={""}>
                                Depto./Casa
                            </label>
                            <input
                                type="text"
                                name="direccion"
                                className="search-input"
                                value={usuario.direccion}
                                onChange={onChange}
                            />
                            {/* <label htmlFor="textfield" className="search-label-admin" defaultValue={""}>
                                Visible Depto./Casa
                            </label> */}
                            <div className="container-dataPerfil">
                                <button type="button" name='mostrarDireccion' className="submenu-item" onClick={(e: any) => {
                                    e.preventDefault(); onChangedireccion(!usuario.mostrarDireccion)
                                }}>
                                    Mostrar Depto./casa
                                    {iconNotificaciones(usuario.mostrarDireccion)}
                                </button>
                            </div>

                            <label htmlFor="textfield" className="search-label-admin">
                                Teléfono
                            </label>
                            <input
                                type="text"
                                name="telefono"
                                className="search-input"
                                value={usuario.telefono}
                                onChange={onChange}
                            />
                            <label htmlFor="textfield" className="search-label-admin">
                                Contraseña
                            </label>
                            <input
                                type="text"
                                name="clave"
                                className="search-input"
                                value={usuario.clave}
                                onChange={onChange}
                            />
                            {/*<div className="form-actions">
                                <button type="submit" className="search-input" disabled={loading}>
                                    {loading ? 'Guardando...' : 'Guardar'}
                                </button>
                                <button type="button" className="search-input" onClick={() => setEditarPerfil(false)}>Cancelar</button>
                            </div>*/}
                            <div className="modal-actions">
                                <button type="submit" className="modal-btn modal-btn-green" disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
                                <button className="modal-btn modal-btn-close" onClick={() => setEditarPerfil(false)}>Cancelar</button>
                            </div>
                        </div>
                    </>
                    :
                    !loading && <div className="perfil-box w-100 my-0">
                        <button
                            type="button"
                            className="perfil-edit-btn"
                            onClick={() => { setEditarPerfil(true) }}
                            aria-label="Editar perfil"
                        >
                            <img src={iconeditar} />
                        </button>
                        <div className="perfil-avatar">
                            {usuario.imagen ? (
                                <img
                                    src={usuario.imagen}
                                    alt="Vista previa"
                                />
                            ) : (
                                <svg width="72" height="72" fill="#e0e0e0" viewBox="0 0 24 24">
                                    <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
                                </svg>
                            )}
                        </div>
                        <h4 className="perfil-nombre">{usuario.nombre}</h4>

                        <div className="perfil-info">
                            <div className="w-100">
                                <div className="container-dataPerfil">
                                    {usuario.rol && <span>Rol</span>}
                                    {usuario.rol && <span style={{ marginLeft: '30px', textAlign: 'end', fontWeight: '700' }}>{usuario.rol}</span>}
                                </div>
                                <div className="container-dataPerfil">
                                    <span>Depto./casa{usuario.mostrarDireccion ? "(visible)" : "(Oculto)"}</span>
                                    {usuario.direccion ? <span style={{ marginLeft: '30px', textAlign: 'end', fontWeight: '700' }}>{usuario.direccion}</span> : <span style={{ marginLeft: '30px', textAlign: 'end', fontWeight: '700' }}>Sin Datos</span>}
                                </div>
                                <div className="container-dataPerfil">
                                    <span>Teléfono</span>
                                    {usuario.telefono ? <span style={{ marginLeft: '30px', textAlign: 'end', fontWeight: '700' }}>{usuario.telefono}</span> : <span style={{ marginLeft: '30px', textAlign: 'end', fontWeight: '700' }}>Sin Datos</span>}
                                </div>
                                <div className="container-dataPerfil">
                                    <button type="button" className="submenu-item" onClick={(ev) => {
                                        onChangeCreateSub(usuario.tieneSuscripcionAnuncios, 1, ev)
                                    }}>
                                        Notif. Anuncios
                                        {iconNotificaciones(usuario.tieneSuscripcionAnuncios)}
                                    </button>
                                </div>
                                <div className="container-dataPerfil">
                                    <button type="button" className="submenu-item" onClick={(ev) => {
                                        onChangeCreateSub(usuario.tieneSuscripcionMensajes, 2, ev)
                                    }}>
                                        Notif. Mensajes
                                        {iconNotificaciones(usuario.tieneSuscripcionMensajes)}
                                    </button>
                                </div>
                                <div className="container-dataPerfil">
                                    <button type="button" className="submenu-item" onClick={(ev) => {
                                        onChangeCreateSub(usuario.tieneSuscripcionVotaciones, 3, ev)
                                    }}>
                                        Notif. Votaciones
                                        {iconNotificaciones(usuario.tieneSuscripcionVotaciones)}
                                    </button>
                                </div>
                                <div className="container-dataPerfil">
                                    <button type="button" className="submenu-item" onClick={(ev) => {
                                        onChangeCreateSub(usuario.tieneSuscripcionAvisos, 4, ev)
                                    }}>
                                        Notif. Calendario
                                        {iconNotificaciones(usuario.tieneSuscripcionAvisos)}
                                    </button>
                                </div>
                                <div className="container-dataPerfil">
                                    <button type="button" className="submenu-item" onClick={(ev) => {
                                        onChangeCreateSub(usuario.tieneSuscripcionEspacioComun, 5, ev)
                                    }}>
                                        Notif. Espacio Común
                                        {iconNotificaciones(usuario.tieneSuscripcionEspacioComun)}
                                    </button>
                                </div>
                                <div className="container-dataPerfil">
                                    <span>Fecha Caducidad</span>
                                    {usuario.fechaCaducidad && (
                                        <span style={{ marginLeft: '30px', textAlign: 'end', fontWeight: '700' }}>{new Date(usuario.fechaCaducidad).toLocaleDateString()}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
            }
        </form >
    );
};

export default PerfilUsuario;
