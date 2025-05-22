import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { toast } from 'react-toastify';

import {
    fetchTiposAviso,
    fetchAvisos,
    postCrearAviso,
    setMes,
    setAño,
    setDiaMesSelect,
    setAvisosDiaSeleccionado,
    setCrearEvento,
    setEditarEvento,
    setTipoAvisoActual,
    setCrearTipoEvento,
    setAvisoActual,
    postTipoAviso,
} from "../../../store/slices/avisos/avisoSlice"
import { AppDispatch } from '../../../store/store';

dayjs.extend(utc);
dayjs.extend(timezone);
interface Props {
    usuario: any;
}
const AvisoPanel: React.FC<Props> = ({ usuario }) => {
    const dispatch = useDispatch<AppDispatch>()

    const {
        avisos,
        tiposAviso,
        loading,
        año,
        mes,
        diaMesSelect,
        avisosDiaSeleccionado,
        crearEvento,
        crearTipoEvento,
        editarEvento,
        tipoAvisoActual,
        avisoActual,
    } = useSelector((state: any) => state.aviso);

    const idCondominio: any = localStorage.getItem('idCondominio');

    useEffect(() => {
        if (idCondominio) {
            dispatch(fetchTiposAviso());
            dispatch(fetchAvisos({ mes, año, idCondominio }));
        }
    }, [dispatch, mes, año, idCondominio]);

    // Cambiar mes y año
    const onCambiarMes = (nuevoMes: any, nuevoAño: any) => {
        dispatch(setMes(nuevoMes));
        dispatch(setAño(nuevoAño));
        if (idCondominio) {
            dispatch(fetchAvisos({ mes: nuevoMes, año: nuevoAño, idCondominio }));
        }
    };

    // Seleccionar día y filtrar avisos
    const getObtenerAvisosDia = (dia: any, mesSeleccionado: any) => {
        dispatch(setAvisoActual({ name: "fecha", value: new Date(año, (mesSeleccionado-1), dia) }));
        dispatch(setDiaMesSelect({ dia, mes: mesSeleccionado, año }));
        const avisosDeHoy = avisos.filter(
            (a: any) =>
                dayjs(a.fecha).format('YYYY-MM-DD') ===
                dayjs(`${año}-${mesSeleccionado}-${dia}`).format('YYYY-MM-DD')
        );
        // Ordenar por fecha ascendente
        /* const avisosOrdenados = [...avisosDeHoy].sort(
            (a: any, b: any) => new Date(a.fecha) - new Date(b.fecha)
        ); */
        dispatch(setAvisosDiaSeleccionado(avisosDeHoy));
    };

    const onCrearEliminarAviso = async (aviso: any, eliminar: any = false) => {
        try {
            await dispatch(postCrearAviso({ aviso, eliminar })).unwrap();
            toast.success(
                `Aviso ${eliminar ? 'eliminado' : 'creado'} correctamente.`,
                { position: 'bottom-left' }
            );
            dispatch(fetchAvisos({ mes, año, idCondominio }));
        } catch(error) {
            toast.error('Error al intentar crear/eliminar aviso.', {
                position: 'bottom-left',
            });
        }
    };

    const onEnviarNotificacion = (mensaje: any) => {
        if (window.confirm('¿Deseas enviar una notificación a todos los vecinos?')) {
            toast.success('Notificación enviada correctamente.', {
                position: 'bottom-left',
            });
        }
    };

    // Generar calendario
    const generarCalendario = () => {
        const nombresDias = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
        const primerDia = new Date(año, mes - 1, 1);
        const diasEnMes = new Date(año, mes, 0).getDate();

        let diaSemana = primerDia.getDay();
        diaSemana = diaSemana === 0 ? 6 : diaSemana - 1;

        const celdas = [];

        for (let i = 0; i < 7; i++) {
            celdas.push(
                <div key={`head-${i}`} className="encabezado">
                    {nombresDias[i]}
                </div>
            );
        }

        for (let i = 0; i < diaSemana; i++) {
            celdas.push(
                <div key={`empty-${i}`} className="dia">
                    &nbsp;
                </div>
            );
        }

        const fechaActualParse = dayjs().tz('America/Santiago').format('YYYY-MM-DD');

        for (let dia = 1; dia <= diasEnMes; dia++) {
            const fechaTexto = `${año}-${mes.toString().padStart(2, '0')}-${dia
                .toString()
                .padStart(2, '0')}`;
            const avisosDelDia = avisos.filter(
                (a: any) => dayjs(a.fecha).format('YYYY-MM-DD') === fechaTexto && a.mensaje !== ''
            );

            celdas.push(
                <div
                    key={`dia-${dia}`}
                    className="dia"
                    onClick={() => getObtenerAvisosDia(dia, mes)}
                    style={{ cursor: 'pointer' }}
                >
                    <div
                        className={`fecha ${fechaTexto === fechaActualParse ? 'diaActual' : ''
                            } ${avisosDelDia.length > 0 ? 'dia-con-algo' : ''}`}
                    >
                        {dia}
                    </div>
                </div>
            );
        }

        return celdas;
    };

    const handleAvisoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        dispatch(setAvisoActual({ name: e.target.name, value: e.target.value }));
        if (e.target.name === "cabecera") {
            const eventoSeleccionado: any = tiposAviso.find(
                (_aviso: any) => _aviso.descripcion === e.target.value
            );

            if (eventoSeleccionado) {
                dispatch(setAvisoActual({ name: "color", value: eventoSeleccionado ? eventoSeleccionado.color : "" }));
            }
        };
    }

    const handleTipoAvisoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        dispatch(setTipoAvisoActual({ name: e.target.name, value: e.target.value }));
    };

    return (
        <div className="aviso-panel w-100 row mt-md-5">
            <div className="container-calendario col-12 col-md-7 d-md-block">
                <div
                    style={{
                        justifyContent: 'space-between',
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <button
                        onClick={() => {
                            const nuevoMes = mes === 1 ? 12 : mes - 1;
                            const nuevoAño = mes === 1 ? año - 1 : año;
                            onCambiarMes(nuevoMes, nuevoAño);
                        }}
                        aria-label="Izquierda"
                        className="iconFlecha"
                    >
                        &#8592;
                    </button>
                    <h4 className="m-0 titulocalendarioAviso">
                        {dayjs(new Date(año, mes - 1)).format('MMMM YYYY')}
                    </h4>
                    <button
                        onClick={() => {
                            const nuevoMes = mes === 12 ? 1 : mes + 1;
                            const nuevoAño = mes === 12 ? año + 1 : año;
                            onCambiarMes(nuevoMes, nuevoAño);
                        }}
                        aria-label="Derecha"
                        className="iconFlecha"
                    >
                        &#8594;
                    </button>
                </div>
                <div className="calendario h-md-50">{generarCalendario()}</div>
            </div>
            <div className="col-12 col-md-5">
                <div className="container-title-eventosdelDia">
                    <h5 className="title-eventosdeldia">
                        Eventos {diaMesSelect.dia} de {dayjs(new Date(año, mes - 1)).format('MMMM YYYY')}
                    </h5>
                    {usuario.rol === 'ADMINISTRADOR' && (
                        <button
                            className="avisos-add"
                            title="Agregar Evento"
                            onClick={() => dispatch(setCrearEvento(true))}
                        >
                            +
                        </button>
                    )}
                </div>
                {loading && <p>Cargando avisos...</p>}
                {avisosDiaSeleccionado.length === 0 && <p>No hay eventos para este día.</p>}
                {avisosDiaSeleccionado.map((a: any, i: any) => (
                    <div
                        key={i}
                        className="avisos-dia"
                        style={{
                            borderBottom: `4px solid ${a.color}`,
                            background: `${a.color}12`,
                            color: a.color,
                            marginBottom: '10px',
                            padding: '5px',
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                                <strong>{a.cabecera}</strong>
                                <p>{a.mensaje}</p>
                                <small>{dayjs(a.fecha).format('DD/MM/YYYY')}</small>
                            </div>
                            {a.idReserva === 0 && usuario.rol === 'ADMINISTRADOR' && (
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button
                                        onClick={() => onEnviarNotificacion(`${a.cabecera}: ${a.mensaje}`)}
                                        title="Enviar Notificación"
                                    >
                                        🔔
                                    </button>
                                    <button
                                        onClick={() => onCrearEliminarAviso(a, true)}
                                        title="Eliminar Aviso"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                <div className={`modal-overlay ${crearEvento || editarEvento ? "" : "d-none"}`}>
                    <div className="modal-content">
                        <h5 className="modal-title">{crearEvento ? "Crear evento" : "Editar evento"}<br></br>{diaMesSelect.dia} de {dayjs(new Date(año, mes - 1)).format('MMMM YYYY')}</h5>
                        <input
                            className="modal-input"
                            type="text"
                            placeholder="Escribe tu mensaje..."
                            value={avisoActual.mensaje}
                            name='mensaje'
                            onChange={handleAvisoChange}
                        />
                        <div className='d-flex w-100'>
                            <select id="miCombo" value={avisoActual.cabecera} className="typeDate" style={{ width: '90%' }} name="cabecera" onChange={(e: any) => handleAvisoChange(e)}>
                                <option key={0} value={""}>Seleccione tipo evento</option>
                                {tiposAviso.map((a: any) => (
                                    <option key={a.id} value={a.descripcion}>{a.descripcion}</option>
                                ))}
                            </select>
                            <button title='Crear Tipo Aviso' type="button" className="iconoVolver  mt-2" aria-label='Crear Tipo Aviso' onClick={() => dispatch(setCrearTipoEvento(true))}>
                                <svg width="25" height="25" viewBox="0 0 18 18" fill="none">
                                    <circle cx="9" cy="9" r="9" fill="#336699">
                                    </circle>
                                    <path d="M9 5v8M5 9h8" stroke="#fff" strokeWidth="2" strokeLinecap="round">
                                    </path>
                                </svg>
                            </button>
                        </div>
                        <div className="modal-actions">
                            <button className="modal-btn modal-btn-green" onClick={() => {
                                onCrearEliminarAviso(avisoActual, false); dispatch(setAvisoActual({
                                    id: 0,
                                    fecha: '',
                                    mensaje: "",
                                    idUsuario: usuario.id,
                                    color: "",
                                    idCondominio: parseInt(localStorage.getItem("idCondominio")!.toString()),
                                    idReserva: 0,
                                    cabecera: ""
                                }))
                                dispatch(setEditarEvento(false)); dispatch(setCrearEvento(false));
                            }}>
                                Guardar
                            </button>
                            <button className="modal-btn modal-btn-close" onClick={() => { dispatch(setCrearEvento(false)) }}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
                <div className={`modal-overlay ${crearTipoEvento ? "" : "d-none"}`}>
                    <div className="modal-content">
                        <h5 className="modal-title w-75 mx-auto">{crearTipoEvento ? "Crear nuevo tipo de aviso" : "Editar Tipo Aviso"}<br /></h5>
                        <input
                            className="modal-input"
                            type="text"
                            placeholder="Escribe tu mensaje..."
                            value={tipoAvisoActual.descripcion}
                            name='descripcion'
                            onChange={handleTipoAvisoChange}
                        />
                        {<select
                            id="colorEvento"
                            style={{ color: tipoAvisoActual.color, fontWeight: 600 }}
                            className="modal-select"
                            name="color"
                            value={tipoAvisoActual.color}
                            onChange={(e: any) => handleTipoAvisoChange(e)}
                        >
                            <option value="" disabled>Selecciona un color</option>
                            <option value="#e74c3c" style={{ color: "#e74c3c", fontWeight: 700 }}>Rojo</option>
                            <option value="#3498db" style={{ color: "#3498db", fontWeight: 700 }}>Azul</option>
                            <option value="#f1c40f" style={{ color: "#f1c40f", fontWeight: 700 }}>Amarillo</option>
                            <option value="#27ae60" style={{ color: "#27ae60", fontWeight: 700 }}>Verde</option>
                            <option value="#e67e22" style={{ color: "#e67e22", fontWeight: 700 }}>Naranja</option>
                        </select>}
                        <div className="modal-actions">
                            <button className="modal-btn modal-btn-green" onClick={() => {
                                if (tipoAvisoActual.color != "" && tipoAvisoActual.descripcion != "") {
                                    let eliminar: any = false;
                                    dispatch(postTipoAviso({ tipoAviso: tipoAvisoActual, eliminar }));
                                    dispatch(setTipoAvisoActual({
                                        id: 0,
                                        descripcion: "",
                                        color: "",
                                        idCondominio: parseInt(localStorage.getItem("idCondominio")!.toString())
                                    }))
                                    dispatch(setCrearTipoEvento(false))
                                }
                            }}>
                                Guardar
                            </button>
                            <button className="modal-btn modal-btn-close" onClick={() => { dispatch(setCrearTipoEvento(false)); }}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AvisoPanel;
