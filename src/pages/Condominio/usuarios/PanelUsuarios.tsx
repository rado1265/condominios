import iconborrar from './../../../components/utils/img/iconborrar.png';
import iconeditar from './../../../components/utils/img/editar.png';
import volver from './../../../components/utils/img/volver.png';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { crearUsuario, fetchAnunciosUsuarios, fetchUsuarios, setAgregarUsuario, setDataUserSelect, setLimpiarNewUser, setNewUser, setUsuarioComunidad, setUsuariosParse, setVerMisAnuncios, setVerUserInd } from "../../../store/slices/perfil/usuariosSlice";
import { AppDispatch, RootState } from "../../../store/store";
import { toast } from 'react-toastify';

interface PanelUsuariosProps {
    usuario: any
}
const posicionAlertas = "bottom-left";

const PanelUsuarios: React.FC<PanelUsuariosProps> = ({ usuario }) => {
    const dispatch = useDispatch<AppDispatch>();

    const { listadousuarios, listadousuariosParse, dataUserSelect,
        verMisAnuncios, loading, agregarUsuario, verUsuarioInd, newUser,
        cupoUsuarios, usuarioComunidad, misAnuncios, actualizarMisAnuncios,
        error } = useSelector((state: RootState) => state.usuarios);

    useEffect(() => {
        const idCondominio = localStorage.getItem('idCondominio');
        if (idCondominio) {
            dispatch(fetchUsuarios(idCondominio));
        }
    }, [dispatch]);

    const ChangeNewUser = (e: any) => {
        const { name, value } = e.target;
        dispatch(setNewUser({ name, value }))
    };
    const filtrarUsuarios = (ev: any) => {
        let parselistadoUser = listadousuarios && listadousuarios.filter((e) => e.nombre.toLocaleLowerCase().includes(ev.target.value.toLocaleLowerCase()));
        dispatch(setUsuariosParse(parselistadoUser));
    }
    const CrearUsuario = (eliminar: boolean) => {
        try {
            if (newUser.nombre.length > 0 && newUser.usuario.length > 3 && newUser.clave.length > 3) {
                dispatch(crearUsuario({ newUser, eliminar }))
            }
        } catch (er) {
        }
    }
    const EliminarUsuario = (user: any) => {
        try {
            if (user.id > 0) {
                dispatch(setVerUserInd(false))
                dispatch(crearUsuario({ newUser: user, eliminar: true }))
            }
        } catch (er) {
        }
    }
    return (
        <>
            {!loading && (
                <div className="w-100 px-3">
                    {agregarUsuario ? (
                        <div className="w-100 px-3 mt-2">
                            <button
                                type="button"
                                className="iconoVolver"
                                style={{ position: 'absolute', left: '15px', top: '15px', zIndex: '1' }}
                                onClick={() => {
                                    dispatch(setVerUserInd(false));
                                    dispatch(setAgregarUsuario(false));
                                }}
                            >
                                <img width={35} src={volver} alt="Icono volver" />
                            </button>
                            <div className="login-box py-3">
                                <h2 className="text-center">Agregar Usuario</h2>
                                <label className="search-label-admin">Usuario</label>
                                <input
                                    name="usuario"
                                    className="search-input"
                                    value={newUser.usuario}
                                    onChange={ChangeNewUser}
                                />
                                <label className="search-label-admin">Nombre</label>
                                <input
                                    name="nombre"
                                    className="search-input"
                                    value={newUser.nombre}
                                    onChange={ChangeNewUser}
                                />
                                <label className="search-label-admin">Clave</label>
                                <input
                                    name="clave"
                                    className="search-input"
                                    value={newUser.clave}
                                    onChange={ChangeNewUser}
                                />
                                <label className="search-label-admin">Rol</label>
                                <select
                                    id="rol"
                                    className="typeDate"
                                    name="rol"
                                    value={newUser.rol}
                                    onChange={ChangeNewUser}
                                >
                                    <option value="VECINO">Vecino</option>
                                    <option value="ADMINISTRADOR">Administrador</option>
                                </select>
                                <div className="modal-actions mt-3">
                                    <button
                                        type="button"
                                        onClick={() => CrearUsuario(false)}
                                        className="modal-btn modal-btn-green"
                                    >
                                        Aceptar
                                    </button>
                                    <button className="modal-btn modal-btn-close" onClick={() => dispatch(setAgregarUsuario(false))}>
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : !verUsuarioInd ? (
                        <div className="usuariosContainer">
                            <h2 className="usuarios-title">Listado Usuarios</h2>
                            <div
                                className="cupo-usuarios-container"
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                    if (usuario.rol === 'ADMINISTRADOR' && cupoUsuarios.cupo > cupoUsuarios.usados) {
                                        dispatch(setAgregarUsuario(true));
                                        dispatch(setLimpiarNewUser({
                                            id: 0,
                                            usuario: '',
                                            nombre: '',
                                            clave: '',
                                            rol: 'VECINO',
                                            idCondominio: parseInt(localStorage.getItem('idCondominio') || '0'),
                                        }));
                                    }
                                }}
                            >
                                {usuario.rol === 'ADMINISTRADOR' && (
                                    <button className="cupo-usuarios-add" title="Agregar usuario">
                                        <svg width="30" height="30" viewBox="0 0 18 18" fill="none">
                                            <circle cx="9" cy="9" r="9" fill="#009688" />
                                            <path d="M9 5v8M5 9h8" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                    </button>
                                )}
                                <span className="cupo-usuarios">
                                    {cupoUsuarios.usados}/{cupoUsuarios.cupo}
                                </span>
                            </div>
                            <div className="buscaruser-search-container">
                                <label className="buscaruser-search-label">Buscar Usuario</label>
                                <input
                                    type="search"
                                    id="buscar-usuario"
                                    className="buscaruser-search-input"
                                    placeholder="Escribe para buscar..."
                                    onChange={filtrarUsuarios}
                                />
                            </div>
                            <div>
                                {listadousuariosParse && listadousuariosParse.map((a, idx) => (
                                    <div
                                        className="usuarios-listado"
                                        key={idx}
                                        onClick={() => {
                                            dispatch(setDataUserSelect(a));
                                            setVerMisAnuncios(true);
                                            dispatch(fetchAnunciosUsuarios({ idUsuario: a.id.toString(), idSolicitante: usuario.id.toString() }))
                                            setUsuarioComunidad(true);
                                        }}
                                    >
                                        <div className="usuarios-item">
                                            <span className="usuarios-item-title">Nombre</span>
                                            <span className="usuarios-item-value">{a.nombre}</span>
                                        </div>
                                        <div className="usuarios-item">
                                            <span className="usuarios-item-title">Rol</span>
                                            <span className="usuarios-item-value">{a.rol}</span>
                                        </div>
                                        {usuario.rol === 'ADMINISTRADOR' && (
                                            <>
                                                <div className="usuarios-item">
                                                    <span className="usuarios-item-title">Fecha Caducidad</span>
                                                    <span className="usuarios-item-value">
                                                        {new Date(a.fechaCaducidad || '').toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div className="usuarios-item">
                                                    <span className="usuarios-item-title">Estado</span>
                                                    <span className={a.activo ? 'usuarios-item-value user-activo' : 'usuarios-item-value user-inactivo'}>
                                                        {a.activo ? 'Activo' : 'Inactivo'}
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="perfil-box w-100" style={{ padding: '20px' }}>
                            <button
                                type="button"
                                className="iconoVolver"
                                style={{ position: 'absolute', left: '15px', top: '15px', zIndex: '1' }}
                                onClick={() => {
                                    dispatch(setVerUserInd(false));
                                    dispatch(setVerMisAnuncios(false));
                                    dispatch(setUsuarioComunidad(false));
                                }}
                            >
                                <img width={35} src={volver} alt="Icono volver" />
                            </button>

                            {usuario.rol === 'ADMINISTRADOR' && (
                                <>
                                    <button
                                        type="button"
                                        className="perfil-edit-btn"
                                        onClick={() => EliminarUsuario(dataUserSelect)}
                                        aria-label="Eliminar perfil"
                                    >
                                        <img src={iconborrar} />
                                    </button>
                                    <button
                                        type="button"
                                        className="perfil-edit-btn mr-5"
                                        onClick={() => {
                                            dispatch(setAgregarUsuario(true))
                                            dispatch(setLimpiarNewUser({
                                                ...dataUserSelect,
                                                idCondominio: parseInt(localStorage.getItem('idCondominio') || '0'),
                                            }))
                                        }}
                                        aria-label="Editar perfil"
                                    >
                                        <img src={iconeditar} />
                                    </button>
                                </>
                            )}

                            <div className="perfil-avatar">
                                {dataUserSelect.imagen ? (
                                    <img id="imgPerfilSelect1" src={dataUserSelect.imagen} alt="Vista previa" />
                                ) : (
                                    <svg width="72" height="72" fill="#e0e0e0" viewBox="0 0 24 24">
                                        <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
                                    </svg>
                                )}
                            </div>
                            <h4 className="perfil-nombre">{dataUserSelect.nombre}</h4>
                            <div className="perfil-info">
                                <div className="w-100">
                                    <div className="container-dataPerfil">
                                        <span>Rol</span>
                                        <span style={{ marginLeft: '30px', textAlign: 'end', fontWeight: '700' }}>
                                            {dataUserSelect.rol}
                                        </span>
                                    </div>
                                    {dataUserSelect.mostrarDireccion && (
                                        <div className="container-dataPerfil">
                                            <span>Dirección</span>
                                            <span style={{ marginLeft: '30px', textAlign: 'end', fontWeight: '700' }}>
                                                {dataUserSelect.direccion || 'Sin Datos'}
                                            </span>
                                        </div>
                                    )}
                                    {dataUserSelect.mostrarTelefono && (
                                        <div className="container-dataPerfil">
                                            <span>Teléfono</span>
                                            <span style={{ marginLeft: '30px', textAlign: 'end', fontWeight: '700' }}>
                                                {dataUserSelect.telefono || 'Sin Datos'}
                                            </span>
                                        </div>
                                    )}
                                    {usuario.rol === 'ADMINISTRADOR' && (
                                        <>
                                            <div className="container-dataPerfil">
                                                <span>Notif. Anuncios</span>
                                                <span style={{ marginLeft: '30px', textAlign: 'end', fontWeight: '700' }}>
                                                    {dataUserSelect.tieneSuscripcionAnuncios ? 'Activa' : 'Inactiva'}
                                                </span>
                                            </div>
                                            <div className="container-dataPerfil">
                                                <span>Notif. Mensajes</span>
                                                <span style={{ marginLeft: '30px', textAlign: 'end', fontWeight: '700' }}>
                                                    {dataUserSelect.tieneSuscripcionMensajes ? 'Activa' : 'Inactiva'}
                                                </span>
                                            </div>
                                            <div className="container-dataPerfil">
                                                <span>Notif. Votaciones</span>
                                                <span style={{ marginLeft: '30px', textAlign: 'end', fontWeight: '700' }}>
                                                    {dataUserSelect.tieneSuscripcionVotaciones ? 'Activa' : 'Inactiva'}
                                                </span>
                                            </div>
                                            <div className="container-dataPerfil">
                                                <span>Notif. Calendario</span>
                                                <span style={{ marginLeft: '30px', textAlign: 'end', fontWeight: '700' }}>
                                                    {dataUserSelect.tieneSuscripcionAvisos ? 'Activa' : 'Inactiva'}
                                                </span>
                                            </div>
                                            <div className="container-dataPerfil">
                                                <span>Fecha Caducidad</span>
                                                <span style={{ marginLeft: '30px', textAlign: 'end', fontWeight: '700' }}>
                                                    {dataUserSelect.fechaCaducidad
                                                        ? new Date(dataUserSelect.fechaCaducidad).toLocaleDateString()
                                                        : ''}
                                                </span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default PanelUsuarios;
