import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import axios from 'axios';
import { con } from '../../../application/entity/Rutas';
import iconeditar from './../../../components/utils/img/editar.png'
import iconborrar from './../../../components/utils/img/iconborrar.png'
import iconNotificacion from './../../../components/utils/img/notificacion.png'
import agregar from './../../../components/utils/img/plus.png'
interface Aviso {
    id: number;
    mensaje: string;
    fecha: string;
    color: string;
    cabecera: string;
    idCondominio: number;
    idReserva: number;
    idUsuario: number;
}

interface Props {
    avisos: Aviso[];
    año: number;
    mes: number;
    onCrear: (_aviso: Aviso) => void;
    onEliminar: (aviso: Aviso) => void;
    onCambiarMes: (mes: any, anio: any) => void;
    onEnviarNotificacion: (mensaje: string) => void;
    loading?: boolean;
    onEditar: (aviso: Aviso) => void;
    usuario: any;
}

const AvisoPanel: React.FC<Props> = ({
    avisos,
    año,
    mes,
    onCrear,
    onEliminar,
    onCambiarMes,
    onEnviarNotificacion,
    loading = false,
    usuario
}) => {
    dayjs.extend(utc);
    dayjs.extend(timezone);
    const [idEdit, setIdEdit] = useState<number | null>(null);
    const [crearEvento, setCrearEvento] = useState(false);
    const [editarEvento, setEditarEvento] = useState(false);
    const [crearTipoAviso, setCrearTipoAviso] = useState(false)
    const [editarTipoAviso, setEditarTipoAviso] = useState(false)
    const [monthTitle, setMonthTitle] = useState('');
    const [days, setDays] = useState([]);
    const [avisosParse, setAvisosParse] = useState<Aviso[]>();
    const [diaMesSelect, setDiaMesSelect] = useState({ dia: 0, mes: 0, anio: 0 })
    let _ruta: string = con.RetornaRuta();
    const [tiposAviso, setTiposAviso] = useState([]);
    const [tipoAviso, setTipoAviso] = useState({
        id: 0,
        descripcion: "",
        color: "",
        idCondominio: parseInt(localStorage.getItem("idCondominio")!.toString())
    });
    const [aviso, setAviso] = useState<Aviso>({
        id: 0,
        fecha: '',
        mensaje: "",
        idUsuario: usuario.id,
        color: "",
        idCondominio: parseInt(localStorage.getItem("idCondominio")!.toString()),
        idReserva: 0,
        cabecera: ""
    });

    const handleNotificar = (msg: string) => {
        if (window.confirm("¿Deseas enviar una notificación a todos los vecinos?")) {
            onEnviarNotificacion(msg);
        }
    };
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setAviso(prev => ({
            ...prev,
            [name]: value
        }));
        if (name === "cabecera") {
            const eventoSeleccionado: any = tiposAviso.find(
                (_aviso: any) => _aviso.descripcion === value
            );

            if (eventoSeleccionado) {
                setAviso(prev => ({
                    ...prev,
                    ["color"]: eventoSeleccionado.color
                }));
            } else {
                setAviso(prev => ({
                    ...prev,
                    ["color"]: ""
                }));
            }
        }
    };
    const handleChangeTipoAviso = (e: any) => {
        const { name, value } = e.target;
        setTipoAviso(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const getObtenerAvisosDia = (dia: number, mes: number) => {
        setDiaMesSelect({ dia: dia, mes: mes, anio: año })
        const avisosDeHoy = avisos.filter((a) => (new Date(a.fecha)).getTime() === (new Date(año + '/' + mes + '/' + dia)).getTime());
        const avisosOrdenados = avisosDeHoy.slice().sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
        setAvisosParse(avisosOrdenados);
        setAviso(prev => ({
            ...prev,
            ["fecha"]: `${año}-${mes.toString().padStart(2, '0')}-${dia}`
        }));
    }

    useEffect(() => {
        cargar();
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

    const cargar = async () => {
        const res = await axios.get(_ruta + "Condominios/getTipoAvisos?idCondominio=" + localStorage.getItem("idCondominio")!.toString(), {
            headers: {
                'Access-Control-Allow-Origin': '*',
                "x-community-id": "2b2463d9f3b093b61be6ce0adbdcc4a0f7e56776502d173a4cf4bb0a8f5d0e79",
            }
        });
        setTiposAviso(res.data);
    };
    const CrearTipoAviso = async (eliminar: boolean) => {
        const res = await axios.post(_ruta + "Condominios/createTipoAviso?eliminar" + eliminar, tipoAviso, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                "x-community-id": "2b2463d9f3b093b61be6ce0adbdcc4a0f7e56776502d173a4cf4bb0a8f5d0e79",
            }
        });
        setTiposAviso(res.data);
    };

    return (
        <div className="aviso-panel w-100 row mt-md-5">
            <div className='container-calendario col-12 col-md-7 d-md-block'>
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
                <div className="calendario h-md-50">
                    {days}
                </div>
            </div>
            <div className='col-12 col-md-5'>
                <div className='container-title-eventosdelDia'>
                    <h5 className='title-eventosdeldia'>Eventos {diaMesSelect.dia} de {monthTitle}</h5>
                    {usuario.rol === "ADMINISTRADOR" && (
                        <button className="avisos-add" title="Agregar Evento" onClick={() => { setCrearEvento(true) }}>
                            <svg width="25" height="25" viewBox="0 0 18 18" fill="none">
                                <circle cx="9" cy="9" r="9" fill="#336699" />
                                <path d="M9 5v8M5 9h8" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </button>
                    )}
                </div>
                {avisosParse?.map((a: any, i: number) => {
                    return (
                        <div className='avisos-dia' key={i} style={{ borderBottom: `4px solid ${a.color}`, background: `${a.color}12`, color: a.color }}>
                            {(a.idReserva === 0 && usuario.rol === "ADMINISTRADOR") && <div style={{ float: 'right', display: 'flex', alignItems: 'center', marginTop: '-5px' }}>
                                <button type="button" className="iconoVolver " onClick={() => onEnviarNotificacion(a.cabecera + ": " + a.mensaje)}>
                                    <img width={20} height={20} src={iconNotificacion} />
                                </button>
                                <button
                                    type="button"
                                    className="iconoVolver"
                                    onClick={() => { setEditarEvento(true); setAviso(a); }}
                                    aria-label="Editar perfil"
                                >
                                    <img src={iconeditar} />
                                </button>
                                <button type="button" className="iconoVolver " onClick={() => onEliminar(a)}>
                                    <img width={20} height={20} src={iconborrar} />
                                </button>
                            </div>}
                            <span><strong>{a.cabecera}:</strong></span><br />
                            <span>{a.mensaje}</span>
                            <div style={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#9a9a9a">
                                    <path d="M580-240q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Z" />
                                </svg>
                                <span style={{ color: '#9a9a9a', fontWeight: '500', marginLeft: '5px' }}>{new Date(a.fecha).toLocaleDateString()}</span>
                            </div>
                        </div>);
                })}
                {avisosParse?.length === 0 && (
                    <div className='sinEventos'>
                        <span>Sin eventos para este día</span>
                    </div>
                )}
            </div>
            <div className={`modal-overlay ${crearEvento || editarEvento ? "" : "d-none"}`}>
                <div className="modal-content">
                    <h5 className="modal-title">{crearEvento ? "Crear evento" : "Editar evento"}<br></br>{diaMesSelect.dia} de {monthTitle}</h5>
                    <input
                        className="modal-input"
                        type="text"
                        placeholder="Escribe tu mensaje..."
                        value={aviso.mensaje}
                        name='mensaje'
                        onChange={handleChange}
                    />
                    <div className='d-flex w-100'>
                        <select id="miCombo" value={aviso.cabecera} className="typeDate" style={{ width: '90%' }} name="cabecera" onChange={handleChange}>
                            <option key={0} value={""}>Seleccione tipo evento</option>
                            {tiposAviso.map((a: any) => (
                                <option key={a.id} value={a.descripcion}>{a.descripcion}</option>
                            ))}
                        </select>
                        <button title='Crear Tipo Aviso' type="button" className="iconoVolver  mt-2" aria-label='Crear Tipo Aviso' onClick={() => setCrearTipoAviso(true)}>
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
                            onCrear(aviso); setAviso({
                                id: 0,
                                fecha: '',
                                mensaje: "",
                                idUsuario: usuario.id,
                                color: "",
                                idCondominio: parseInt(localStorage.getItem("idCondominio")!.toString()),
                                idReserva: 0,
                                cabecera: ""
                            })
                            setCrearEvento(false); setEditarEvento(false)
                        }}>
                            Guardar
                        </button>
                        <button className="modal-btn modal-btn-close" onClick={() => { setCrearEvento(false); setEditarEvento(false) }}>
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
            <div className={`modal-overlay ${crearTipoAviso || editarTipoAviso ? "" : "d-none"}`}>
                <div className="modal-content">
                    <h5 className="modal-title w-75 mx-auto">{crearTipoAviso ? "Crear nuevo tipo de aviso" : "Editar Tipo Aviso"}<br /></h5>
                    <input
                        className="modal-input"
                        type="text"
                        placeholder="Escribe tu mensaje..."
                        value={tipoAviso.descripcion}
                        name='descripcion'
                        onChange={handleChangeTipoAviso}
                    />
                    {<select
                        id="colorEvento"
                        style={{ color: tipoAviso.color, fontWeight: 600 }}
                        className="modal-select"
                        name="color"
                        value={tipoAviso.color}
                        onChange={handleChangeTipoAviso}
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
                            if (tipoAviso.color != "" && tipoAviso.descripcion != "") {
                                CrearTipoAviso(false); setTipoAviso({
                                    id: 0,
                                    descripcion: "",
                                    color: "",
                                    idCondominio: parseInt(localStorage.getItem("idCondominio")!.toString())
                                })
                                setCrearTipoAviso(false); setEditarTipoAviso(false)
                            }
                        }}>
                            Guardar
                        </button>
                        <button className="modal-btn modal-btn-close" onClick={() => { setCrearTipoAviso(false); setEditarTipoAviso(false) }}>
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default AvisoPanel;
