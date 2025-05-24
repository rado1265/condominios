import React, { useEffect, useState } from 'react';
import iconeditar from './../../../components/utils/img/editar.png'
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchUsuario,
    editarUsuario,
    setEditar,
    setUsuarioDetalle,
    setArchivoTemp,
    setPreview,
    crearSuscripcion,
    eliminarSuscripcion
} from "../../../store/slices/perfil/perfilUsuarioSlice"
import type { RootState, AppDispatch } from "../../../store/store";
import { ref, uploadBytes } from 'firebase/storage';
import { storage } from '../../../config';
import { toast } from 'react-toastify';

const PerfilUsuario: React.FC<{ }> = ({
}) => {
    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
        Perfil()
    }, [])
    const {
        usuarioDetalle,
        loading,
        archivoTemp,
        editar
    } = useSelector((state: RootState) => state.user);
    const { usuario } = useSelector((state: RootState) => state.auth);
    const { sinNotificaciones } = useSelector((state: RootState) => state.comunidad);
    const posicionAlertas = "bottom-left";

    function urlBase64ToUint8Array(base64String: string) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }
    async function solicitarPermisoNotificaciones() {
        const permiso = await Notification.requestPermission();
        if (permiso === 'granted') {
            /* alert('✅ Permiso de notificaciones concedido'); */
            const registration = await navigator.serviceWorker.register('/service-worker.js');
            const ready = await navigator.serviceWorker.ready;

            let subscription = await ready.pushManager.getSubscription();
            if (!subscription) {
                subscription = await ready.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array("BDhWFTbhmhdKANFtk6FZsIE4gQE1eHAiCPvwXsE8UGCKa-U-vVh3cTzOCFtNy01QBc08mP8GcUeCLybWsD-5No0"),
                });
            }
            return subscription
        } else if (permiso === 'denied') {
            alert('❌ Has denegado las notificaciones. Puedes activarlas desde la configuración del navegador.');
            return false
        } else {
            alert('ℹ️ Las notificaciones están bloqueadas o no se solicitaron correctamente.');
            return false
        }
    }
    async function Perfil() {
        var result: any = await solicitarPermisoNotificaciones()
        if (result) {
            dispatch(fetchUsuario({ id: usuario.id, idCondominio: localStorage.getItem("idCondominio")!.toString(), result }))
            /* setSinNotificaciones(false) */
        } else {
            /* setSinNotificaciones(true) */
            dispatch(fetchUsuario({ id: usuario.id, idCondominio: localStorage.getItem("idCondominio")!.toString(), result }))
        }
    }
    const handleChangePerfil = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        dispatch(setUsuarioDetalle({ name: e.target.name, value: e.target.value }));
    }
    const handleChangePerfilDireccion = (e: boolean) => {
        dispatch(setUsuarioDetalle({ name: "mostrarDireccion", value: e }));
    }
    const handleChangePerfilTelefono = (e: boolean) => {
        dispatch(setUsuarioDetalle({ name: "mostrarTelefono", value: e }));
    }

    const createSuscripcion = (tieneSuscripcion: boolean, tipoSuscripcion: any, ev: any) => {
        ev.preventDefault();
        if (tieneSuscripcion) {
            Dessuscripcion(tipoSuscripcion)
        } else {
            Suscripcion(tipoSuscripcion)
        }
    }
    async function Suscripcion(tipoSuscripcion: any) {
        var result: any = await solicitarPermisoNotificaciones()
        if (result) {
            dispatch(crearSuscripcion({ idCondominio: localStorage.getItem("idCondominio")!.toString(), idUsuario: usuarioDetalle!.id, tipoSuscripcion, result }))
        }
    }
    async function Dessuscripcion(tipoSuscripcion: any) {
        var result: any = await solicitarPermisoNotificaciones()
        if (result) {
            const resultAction = await dispatch(eliminarSuscripcion({ idUsuario: usuarioDetalle!.id, tipoSuscripcion, result }))
            if (eliminarSuscripcion.fulfilled.match(resultAction)) {
                Perfil()
            } else {
                Perfil()
            }
        }
    }
    async function EditarPerfil(archivoTemp: File | null) {
        if (archivoTemp) {
            guardarArchivo(1, archivoTemp);
            dispatch(setUsuarioDetalle({ name: "imagen", value: archivoTemp.name }));
        }
        try {

            const resultAction = await dispatch(editarUsuario(usuarioDetalle))

            if (editarUsuario.fulfilled.match(resultAction)) {
                Perfil()
            } else {
                Perfil()
            }
        } catch (er) {
        }
    }
    const guardarArchivo = (tipoArchivo: number = 1, archivoAsubir: File | null = null) => {
        if (archivoAsubir && !(archivoAsubir.size > 100000000)) {
            if (tipoArchivo === 4) {
                const storageRef = ref(storage, `comunidad-${localStorage.getItem("idCondominio")}/${archivoAsubir.name}`);
                const uploadTask = uploadBytes(storageRef, archivoAsubir);
            } else {
                const storageRef = ref(storage, `perfiles/${archivoAsubir.name}`);
                const uploadTask = uploadBytes(storageRef, archivoAsubir);
            }
        } else if (archivoAsubir && (archivoAsubir.size > 100000000)) {
            alert("El archivo pesa mas de 100 MB")
        }
    }
    useEffect(() => {
        if (usuarioDetalle != null && usuarioDetalle.imagen) {
            dispatch(setPreview(usuarioDetalle!.imagen))
        }
    }, [usuarioDetalle]);

    const handleImagePerfilChange = (e: any) => {
        const file = e.target.files[0];

        if (!file) return;

        dispatch(setArchivoTemp(file));

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
                disabled={sinNotificaciones}
                className="switch-checkbox"
            />
            <span className="switch-slider" />
        </label>
    }
    return (
        <form onSubmit={(e) => { e.preventDefault(); EditarPerfil(archivoTemp); }} className="perfil-form mt-md-5 col-12">
            {
                (loading || usuarioDetalle === null) ? "" :
                    editar ?
                        <>
                            <div className="login-box py-3 px-md-5 col-12 col-md-8 mx-auto shadow rounded">

                                <div style={{ justifySelf: 'center' }}>
                                    <img
                                        className={usuarioDetalle!.imagen != null ? "" : "d-none"}
                                        id="userDetallePerfil"
                                        src={usuarioDetalle!.imagen}
                                        alt="Vista previa"
                                        style={{ maxWidth: '200px', marginTop: '10px' }}
                                    />
                                    <div id="userDetallePerfilSVG" className={usuarioDetalle!.imagen != null ? "d-none" : "perfil-avatar"}>
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
                                    value={usuarioDetalle!.nombre}
                                    disabled
                                />
                                <label htmlFor="textfield" className="search-label-admin">
                                    Rol
                                </label>
                                <input
                                    name="descripcion"
                                    className="search-input"
                                    value={usuarioDetalle!.rol}
                                    disabled
                                />
                                <label htmlFor="textfield" className="search-label-admin" defaultValue={""}>
                                    Depto./Casa
                                </label>
                                <input
                                    type="text"
                                    name="direccion"
                                    className="search-input"
                                    value={usuarioDetalle!.direccion}
                                    onChange={handleChangePerfil}
                                />
                                <div className="container-dataPerfil">
                                    <button type="button" name='mostrarDireccion' className="submenu-item" onClick={(e: any) => {
                                        e.preventDefault(); handleChangePerfilDireccion(!usuarioDetalle!.mostrarDireccion)
                                    }}>
                                        Mostrar Depto./casa
                                        {iconNotificaciones(usuarioDetalle!.mostrarDireccion)}
                                    </button>
                                </div>

                                <label htmlFor="textfield" className="search-label-admin">
                                    Teléfono
                                </label>
                                <input
                                    type="text"
                                    name="telefono"
                                    className="search-input"
                                    value={usuarioDetalle!.telefono}
                                    onChange={handleChangePerfil}
                                />
                                <div className="container-dataPerfil">
                                    <button type="button" name='mostrarTelefono' className="submenu-item" onClick={(e: any) => {
                                        e.preventDefault(); handleChangePerfilTelefono(!usuarioDetalle!.mostrarTelefono)
                                    }}>
                                        Mostrar Teléfono
                                        {iconNotificaciones(usuarioDetalle!.mostrarTelefono)}
                                    </button>
                                </div>
                                <label htmlFor="textfield" className="search-label-admin">
                                    Contraseña
                                </label>
                                <input
                                    type="text"
                                    name="clave"
                                    className="search-input"
                                    value={usuarioDetalle!.clave}
                                    onChange={handleChangePerfil}
                                />
                                <div className="modal-actions">
                                    <button type="submit" className="modal-btn modal-btn-green" disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
                                    <button className="modal-btn modal-btn-close" onClick={() => dispatch(setEditar(false))}>Cancelar</button>
                                </div>
                            </div>
                        </>
                        :
                        !loading && <div className="perfil-box w-100 my-0">
                            <button
                                type="button"
                                className="perfil-edit-btn"
                                onClick={() => { dispatch(setEditar(true)) }}
                                aria-label="Editar perfil"
                            >
                                <img src={iconeditar} />
                            </button>
                            <div className="perfil-avatar">
                                {usuarioDetalle!.imagen ? (
                                    <img
                                        src={usuarioDetalle!.imagen}
                                        alt="Vista previa"
                                    />
                                ) : (
                                    <svg width="72" height="72" fill="#e0e0e0" viewBox="0 0 24 24">
                                        <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
                                    </svg>
                                )}
                            </div>
                            <h4 className="perfil-nombre">{usuarioDetalle!.nombre}</h4>
                            <div className="perfil-info">
                                <div className="w-100">
                                    <div className="container-dataPerfil">
                                        {usuarioDetalle!.rol && <span>Rol</span>}
                                        {usuarioDetalle!.rol && <span style={{ marginLeft: '30px', textAlign: 'end', fontWeight: '700' }}>{usuarioDetalle!.rol}</span>}
                                    </div>
                                    <div className="container-dataPerfil">
                                        <span>Depto./casa{usuarioDetalle!.mostrarDireccion ? "(visible)" : "(Oculto)"}</span>
                                        {usuarioDetalle!.direccion ? <span style={{ marginLeft: '30px', textAlign: 'end', fontWeight: '700' }}>{usuarioDetalle!.direccion}</span> : <span style={{ marginLeft: '30px', textAlign: 'end', fontWeight: '700' }}>Sin Datos</span>}
                                    </div>
                                    <div className="container-dataPerfil">
                                        <span>Teléfono{usuarioDetalle!.mostrarTelefono ? "(visible)" : "(Oculto)"}</span>
                                        {usuarioDetalle!.telefono ? <span style={{ marginLeft: '30px', textAlign: 'end', fontWeight: '700' }}>{usuarioDetalle!.telefono}</span> : <span style={{ marginLeft: '30px', textAlign: 'end', fontWeight: '700' }}>Sin Datos</span>}
                                    </div>
                                    {
                                        sinNotificaciones ?
                                            <div className="container-dataPerfil notDesactivadas">
                                                <span style={{ color: '#1565c0' }}>Para poder activar las notificaciones es necesario dar permisos para notificaciones a la aplicación.</span>
                                            </div>
                                            :
                                            <> <div className="container-dataPerfil">
                                                <button type="button" className="submenu-item" onClick={(ev) => {
                                                    if (!sinNotificaciones) createSuscripcion(usuarioDetalle!.tieneSuscripcionAnuncios, 1, ev)
                                                }}>
                                                    Notif. Anuncios
                                                    {iconNotificaciones(usuarioDetalle!.tieneSuscripcionAnuncios)}
                                                </button>
                                            </div>
                                                <div className="container-dataPerfil">
                                                    <button type="button" className="submenu-item" onClick={(ev) => {
                                                        if (!sinNotificaciones) createSuscripcion(usuarioDetalle!.tieneSuscripcionMensajes, 2, ev)
                                                    }}>
                                                        Notif. Mensajes
                                                        {iconNotificaciones(usuarioDetalle!.tieneSuscripcionMensajes)}
                                                    </button>
                                                </div>
                                                <div className="container-dataPerfil">
                                                    <button type="button" className="submenu-item" onClick={(ev) => {
                                                        if (!sinNotificaciones) createSuscripcion(usuarioDetalle!.tieneSuscripcionVotaciones, 3, ev)
                                                    }}>
                                                        Notif. Votaciones
                                                        {iconNotificaciones(usuarioDetalle!.tieneSuscripcionVotaciones)}
                                                    </button>
                                                </div>
                                                <div className="container-dataPerfil">
                                                    <button type="button" className="submenu-item" onClick={(ev) => {
                                                        if (!sinNotificaciones) createSuscripcion(usuarioDetalle!.tieneSuscripcionAvisos, 4, ev)
                                                    }}>
                                                        Notif. Calendario
                                                        {iconNotificaciones(usuarioDetalle!.tieneSuscripcionAvisos)}
                                                    </button>
                                                </div>
                                                <div className="container-dataPerfil">
                                                    <button type="button" className="submenu-item" onClick={(ev) => {
                                                        if (!sinNotificaciones) createSuscripcion(usuarioDetalle!.tieneSuscripcionEspacioComun, 5, ev)
                                                    }}>
                                                        Notif. Espacio Común
                                                        {iconNotificaciones(usuarioDetalle!.tieneSuscripcionEspacioComun)}
                                                    </button>
                                                </div></>
                                    }
                                    <div className="container-dataPerfil">
                                        <span>Fecha Caducidad</span>
                                        {usuarioDetalle!.fechaCaducidad && (
                                            <span style={{ marginLeft: '30px', textAlign: 'end', fontWeight: '700' }}>{new Date(usuarioDetalle!.fechaCaducidad).toLocaleDateString()}</span>
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
