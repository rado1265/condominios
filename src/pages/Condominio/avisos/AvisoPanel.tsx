import React, { useEffect, useState } from 'react';
import { ObtenerAvisosLogic } from '../../../presentation/view-model/Anuncio.logic';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

interface Aviso {
    id: number;
    mensaje: string;
    fecha: string;
    color: string;
}

interface Props {
    avisos: Aviso[];
    mensaje: string;
    fecha: string;
    hora: string;
    año: number;
    mes: number;
    colorEvento: string;
    onChangeMensaje: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onChangeFecha: (e: string) => void;
    onChangeHora: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onChangeColor: (e: string) => void;
    onCrear: () => void;
    onEliminar: (aviso: Aviso) => void;
    onCambiarMes: (mes: any, anio: any) => void;
    onEnviarNotificacion: (mensaje: string) => void;
    loading?: boolean;
}

const AvisoPanel: React.FC<Props> = ({
    avisos,
    mensaje,
    fecha,
    hora,
    año,
    mes,
    colorEvento,
    onChangeMensaje,
    onChangeFecha,
    onChangeHora,
    onCrear,
    onEliminar,
    onCambiarMes,
    onEnviarNotificacion,
    onChangeColor,
    loading = false
}) => {
    dayjs.extend(utc);
    dayjs.extend(timezone);
    const [idEdit, setIdEdit] = useState<number | null>(null);
    const [crearEvento, setCrearEvento] = useState(false);
    const [monthTitle, setMonthTitle] = useState('');
    const [days, setDays] = useState([]);
    const [avisosParse, setAvisosParse] = useState<Aviso[]>();
    const [diaMesSelect, setDiaMesSelect] = useState({ dia: 0, mes: 0, anio: 0 })

    const handleNotificar = (msg: string) => {
        if (window.confirm("¿Deseas enviar una notificación a todos los vecinos?")) {
            onEnviarNotificacion(msg);
        }
    };

    const getObtenerAvisosDia = (dia: number, mes: number) => {
        setDiaMesSelect({ dia: dia, mes: mes, anio: año })
        const avisosDeHoy = avisos.filter((a) => (new Date(a.fecha)).getTime() === (new Date(año + '/' + mes + '/' + dia)).getTime());
        const avisosOrdenados = avisosDeHoy.slice().sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
        setAvisosParse(avisosOrdenados);
        onChangeFecha(`${año}-${mes.toString().padStart(2, '0')}-${dia}`);
    }

    useEffect(() => {
        generarCalendario();
        const fechaChile = dayjs().tz("America/Santiago");
        const avisosDeHoy = avisos.filter((a, b) => new Date(a.fecha).getTime() === new Date().getTime());
        const avisosOrdenados = avisosDeHoy.slice().sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
        setAvisosParse(avisosOrdenados);
        if (diaMesSelect.dia > 0) {
            getObtenerAvisosDia(diaMesSelect.dia, diaMesSelect.mes);
        } else {
            setDiaMesSelect({ dia: parseInt(fechaChile.format('DD')), mes: parseInt(fechaChile.format('MM')), anio: parseInt(fechaChile.format('YYYY')) })
        }
        setCrearEvento(false);
    }, [avisos]);

    const generarCalendario = () => {
        const nombresDias = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
        const primerDia = new Date(año, mes, 1);
        const diasEnMes = new Date(año, mes + 1, 0).getDate();

        let diaSemana = primerDia.getDay(); // domingo = 0
        diaSemana = diaSemana === 0 ? 6 : diaSemana - 1; // lunes = 0

        const fechaActual = new Date(año, mes);
        const nombreMes = fechaActual.toLocaleString('es-ES', {
            month: 'long',
            year: 'numeric',
        });
        setMonthTitle(nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1));

        const celdas: any = [];

        // Encabezados
        for (let i = 0; i < 7; i++) {
            celdas.push(<div key={`head-${i}`} className="encabezado">{nombresDias[i]}</div>);
        }

        // Vacíos antes del 1
        for (let i = 0; i < diaSemana; i++) {
            celdas.push(<div key={`empty-${i}`} className="dia"></div>);
        }

        const formatoFecha = (fecha: any) => {
            let _fecha: Date = new Date(fecha);
            const _año = _fecha.getFullYear();
            const _mes = _fecha.getMonth();
            const _dia = _fecha.getDate();
            return `${_año}-${(_mes + 1).toString().padStart(2, '0')}-${_dia.toString().padStart(2, '0')}`;
        }
        // Días con avisos
        const fechaActualParse = dayjs().tz("America/Santiago").format().split("T")[0];
        for (let dia = 1; dia <= diasEnMes; dia++) {
            const fechaTexto = `${año}-${(mes + 1).toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
            const avisosDelDia = avisos.filter((a: any) => formatoFecha(a.fecha) === fechaTexto && a.mensaje !== "");

            celdas.push(

                <div key={`dia-${dia}`} className="dia" onClick={() => { getObtenerAvisosDia(dia, mes + 1) }}>
                    {fechaTexto === fechaActualParse ?
                        <div className={`fecha diaActual ${avisosDelDia.length > 0 ? "dia-con-algo" : ""}`}>{dia}</div>
                        :
                        avisosDelDia.length > 0 ?
                            <div className={`fecha ${avisosDelDia.length > 0 ? "dia-con-algo" : ""}`}>{dia}</div>
                            :
                            <div className={`fecha`}>{dia}</div>
                    }
                </div>
            );
        }

        setDays(celdas);
    };


    const handleSave = () => {
        setCrearEvento(false);
    };

    return (
        <div className="aviso-panel w-100">
            <div className='container-calendario shadow'>
                <div style={{ justifyContent: 'space-between', display: 'flex', alignItems: 'center' }}>
                    <button
                        onClick={() => {
                            const nuevoMes = mes === 1 ? 12 : mes - 1;
                            const nuevoAño = mes === 1 ? año - 1 : año;
                            onCambiarMes(nuevoMes, nuevoAño);
                        }}
                        aria-label="Iquierda"
                        className="iconFlecha"
                    >
                        <svg fill="#9a9a9a" height="20px" width="20px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 330 330">
                            <path id="XMLID_92_" d="M111.213,165.004L250.607,25.607c5.858-5.858,5.858-15.355,0-21.213c-5.858-5.858-15.355-5.858-21.213,0.001
	l-150,150.004C76.58,157.211,75,161.026,75,165.004c0,3.979,1.581,7.794,4.394,10.607l150,149.996
	C232.322,328.536,236.161,330,240,330s7.678-1.464,10.607-4.394c5.858-5.858,5.858-15.355,0-21.213L111.213,165.004z"/>
                        </svg>
                    </button>
                    <h4 className="m-0 titulocalendarioAviso">{monthTitle}</h4>
                    <button
                        onClick={() => {
                            const nuevoMes = mes === 12 ? 1 : mes + 1;
                            const nuevoAño = mes === 12 ? año + 1 : año;
                            onCambiarMes(nuevoMes, nuevoAño);
                        }}
                        aria-label="Derecha"
                        className="iconFlecha"
                    >
                        <svg fill="#9a9a9a" height="20px" width="20px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 330.002 330.002">
                            <path id="XMLID_103_" d="M233.252,155.997L120.752,6.001c-4.972-6.628-14.372-7.97-21-3c-6.628,4.971-7.971,14.373-3,21
	l105.75,140.997L96.752,306.001c-4.971,6.627-3.627,16.03,3,21c2.698,2.024,5.856,3.001,8.988,3.001
	c4.561,0,9.065-2.072,12.012-6.001l112.5-150.004C237.252,168.664,237.252,161.33,233.252,155.997z"/>
                        </svg>
                    </button>
                </div>
                <div className="calendario">
                    {days}
                </div>
            </div>
            <div>
                <div className='container-title-eventosdelDia'>
                    <h5 className='title-eventosdeldia'>Eventos {diaMesSelect.dia} de {monthTitle}</h5>
                    <button className="avisos-add" title="Agregar Evento" onClick={() => { setCrearEvento(true) }}>
                        <svg width="25" height="25" viewBox="0 0 18 18" fill="none">
                            <circle cx="9" cy="9" r="9" fill="#336699" />
                            <path d="M9 5v8M5 9h8" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>
                {avisosParse?.map((a: any, i: number) => {
                    return (
                        <div className='avisos-dia' key={i} style={{ borderBottom: `4px solid ${a.color}`, background: `${a.color}12`, color: a.color }}>
                            <span>{a.mensaje}</span>
                            <div style={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#9a9a9a">
                                    <path d="M580-240q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Z" />
                                </svg>
                                <span style={{ color: '#9a9a9a', fontWeight: '500', marginLeft: '5px' }}>{new Date(a.fecha).toLocaleDateString()}</span>
                            </div>
                        </div>);
                })}
                {avisosParse?.length == 0 && (
                    <div className='sinEventos'>
                        <span>Sin eventos para este día</span>
                    </div>
                )}
            </div>
            <div className={`modal-overlay ${crearEvento ? "" : "d-none"}`}>
                <div className="modal-content">
                    <h5 className="modal-title">Crear evento <br></br>{diaMesSelect.dia} de {monthTitle}</h5>
                    <input
                        className="modal-input"
                        type="text"
                        placeholder="Escribe tu mensaje..."
                        value={mensaje}
                        onChange={onChangeMensaje}
                    />
                    <select
                        id="colorEvento"
                        style={{ color: colorEvento, fontWeight: 600 }}
                        className="modal-select"
                        value={colorEvento}
                        onChange={(e) => onChangeColor(e.target.value)}
                    >
                        <option value="" disabled>Selecciona un color</option>
                        <option value="#e74c3c" style={{ color: "#e74c3c", fontWeight: 700 }}>Rojo</option>
                        <option value="#3498db" style={{ color: "#3498db", fontWeight: 700 }}>Azul</option>
                        <option value="#f1c40f" style={{ color: "#f1c40f", fontWeight: 700 }}>Amarillo</option>
                        <option value="#27ae60" style={{ color: "#27ae60", fontWeight: 700 }}>Verde</option>
                        <option value="#e67e22" style={{ color: "#e67e22", fontWeight: 700 }}>Naranja</option>
                        <option value="#9b59b6" style={{ color: "#9b59b6", fontWeight: 700 }}>Morado</option>
                    </select>
                    <div className="modal-actions">
                        <button className="modal-btn modal-btn-green" onClick={onCrear}>
                            Guardar
                        </button>
                        <button className="modal-btn modal-btn-close" onClick={() => { setCrearEvento(false) }}>
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AvisoPanel;
