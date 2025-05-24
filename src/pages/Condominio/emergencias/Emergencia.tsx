import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import iconeditar from './../../../components/utils/img/editar.png';
import iconborrar from './../../../components/utils/img/iconborrar.png';
import { ConfirmMessage } from '../../../components/utils/messages';
import { toast } from 'react-toastify';
import { AppDispatch, RootState } from "../../../store/store";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
    fetchEmergencias,
    saveEmergencia,
    setEditar,
    setActual,
    handleChange,
    resetActual
} from "../../../store/slices/emergencia/emergenciaSlice"

interface Props {
}

const posicionAlertas = "bottom-left";

const Emergencia: React.FC<Props> = ({  }) => {
    const dispatch = useDispatch<AppDispatch>()
    const { lista, actual, editar, loading } = useSelector((state: RootState) => state.emergencia);
    const { usuario } = useSelector((state: RootState) => state.auth);
    /* useEffect(() => {
        dispatch(fetchEmergencias());
    }, [dispatch]); */

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (actual.descripcion.length > 0) {
            dispatch(saveEmergencia({ data: actual, eliminar: false }))
                .unwrap()
                .then(() => {
                    toast.success('Número de emergencia guardado correctamente', { position: posicionAlertas });
                })
                .catch(() => {
                    toast.error('Error al guardar número de emergencia.', { position: posicionAlertas });
                });
        }
    };

    const handleDelete = async () => {
        const msg: any = await ConfirmMessage(`Eliminar número de emergencia`, `¿Esta seguro de querer eliminar el número de emergencia?`);
        if (msg && actual.descripcion.length > 0) {
            dispatch(saveEmergencia({ data: actual, eliminar: true }))
                .unwrap()
                .then(() => {
                    toast.success('Número de emergencia eliminado correctamente', { position: posicionAlertas });
                })
                .catch(() => {
                    toast.error('Error al eliminar número de emergencia.', { position: posicionAlertas });
                });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-100">
            {editar ? (
                <div className="w-100 px-3">
                    <div className="login-box py-3">
                        <h4 className="mt-3 text-center">Crear número de emergencia</h4>
                        <label className="search-label-admin">Descripción</label>
                        <input
                            name="descripcion"
                            className="search-input"
                            value={actual.descripcion}
                            onChange={(e) => dispatch(handleChange({ name: e.target.name, value: e.target.value }))}
                        />
                        <label className="search-label-admin">Dirección</label>
                        <input
                            name="direccion"
                            className="search-input"
                            value={actual.direccion}
                            onChange={(e) => dispatch(handleChange({ name: e.target.name, value: e.target.value }))}
                        />
                        <label className="search-label-admin">Teléfono</label>
                        <input
                            name="telefono"
                            className="search-input"
                            value={actual.telefono}
                            onChange={(e) => dispatch(handleChange({ name: e.target.name, value: e.target.value }))}
                        />
                        <div className="modal-actions">
                            <button type="submit" className="modal-btn modal-btn-green" disabled={loading}>
                                {loading ? 'Guardando...' : 'Guardar'}
                            </button>
                            <button type="button" className="modal-btn modal-btn-close" onClick={() => dispatch(setEditar(false))}>Cancelar</button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="w-100 login-box py-3">
                    <h3 style={{ textAlign: 'center' }}>Números de Emergencia</h3>
                    {lista.map((e) => (
                        <div key={e.id} className="container-emergencia shadow">
                            <span><strong>{e.descripcion}</strong></span><br />
                            <span>{e.direccion}</span>
                            <a href={`tel:${e.telefono}`} className="d-block">{e.telefono}</a>
                            {usuario.rol === "ADMINISTRADOR" && (
                                <>
                                    <button type="button" className="iconoVolver" style={{ marginTop: '-75px', float: 'right' }} onClick={() => { dispatch(setActual(e)); dispatch(setEditar(true)) }}>
                                        <img src={iconeditar} />
                                    </button>
                                    <button type="button" className="iconoVolver" style={{ marginTop: '-30px', float: 'right' }} onClick={handleDelete}>
                                        <img src={iconborrar} />
                                    </button>
                                </>
                            )}
                        </div>
                    ))}
                    {usuario.rol === "ADMINISTRADOR" && (
                        <button type="button" className="modal-btn modal-btn-green mt-2" onClick={() => dispatch(resetActual()) || dispatch(setEditar(true))}>
                            Crear número de emergencia
                        </button>
                    )}
                </div>
            )}
        </form>
    );
};

export default Emergencia;
