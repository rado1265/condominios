import { useState, useEffect } from "react";
import axios from "axios";
import { con } from "../../../application/entity/Rutas";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import { es } from 'date-fns/locale/es';
registerLocale('es', es)
setDefaultLocale('es')


export default function ReservaConHorario(props: any) {
  let _ruta: string = con.RetornaRuta();
  const [espacios, setEspacios] = useState([]);
  const [espacioId, setEspacioId] = useState<number | null>(null);
  const [espacioSelect, setEspacioSelect] = useState<any>(null);
  const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
  const [fechaFin, setFechaFin] = useState<Date | null>(null);
  const [unidadesDisponibles, setUnidadesDisponibles] = useState<{ id: number; numero: number }[]>([]);
  const [verDisp, setVerDisp] = useState(false);
  const [userSelect, setUserSelect] = useState(0);

  useEffect(() => {
    axios.get(_ruta + "EspacioComun?idCondominio=" + localStorage.getItem("idCondominio")!.toString(), {
      headers: {
        'Access-Control-Allow-Origin': '*',
        "x-community-id": "2b2463d9f3b093b61be6ce0adbdcc4a0f7e56776502d173a4cf4bb0a8f5d0e79",
      }
    }).then((res) => setEspacios(res.data));
  }, []);

  function formatToLocalISOString(date: Date) {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
  }

  const buscarDisponibles = async () => {
    if (!espacioId || !fechaInicio || !fechaFin) return;

    const res = await axios.get(_ruta + `EspacioComun/${espacioId}/disponibles`, {
      params: {
        fecha: formatToLocalISOString(new Date(fechaInicio))/* ,
        fechaFin: formatToLocalISOString(new Date(fechaFin)) */
      }, headers: {
        'Access-Control-Allow-Origin': '*',
        "x-community-id": "2b2463d9f3b093b61be6ce0adbdcc4a0f7e56776502d173a4cf4bb0a8f5d0e79",
      }
    });

    setUnidadesDisponibles(res.data);
    setVerDisp(true);
  };

  const reservar = async (unidadId: number) => {
    await axios.post(_ruta + "EspacioComun/reservar",
      {
        id: 0,
        idUnidadEspacio: unidadId,
        fechaInicio: formatToLocalISOString(new Date(fechaInicio ?? new Date())),
        fechaFin: formatToLocalISOString(new Date(fechaFin ?? new Date())),
        idUsuario: userSelect != 0 ? userSelect : props.usuario.id,
        idCondominio: parseInt(localStorage.getItem("idCondominio")!.toString()),
        fechaSolicitud: formatToLocalISOString(new Date()),
        estado: false
      }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        "x-community-id": "2b2463d9f3b093b61be6ce0adbdcc4a0f7e56776502d173a4cf4bb0a8f5d0e79",
      }
    }
    );
    alert("Reserva realizada");
    setVerDisp(false);
    props.onCancelar()
  };

  useEffect(() => {
    if (espacioId) {
      setEspacioSelect(espacios.find((e: any) => e.id === espacioId));
      setVerDisp(false);
    }
  }, [espacioId]);

  const handleFechaInicio = (date: any) => {
    setFechaInicio(date);
    if (fechaFin && date && fechaFin < date) {
      setFechaFin(null);
    }
  };

  const handleFechaFin = (date: any) => {
    setFechaFin(date);
  };

  return (
    <div className="reserva-container shadow-lg p-4 rounded-4 bg-white mx-auto mt-3 mt-md-5" style={{ maxWidth: 420 }}>
      <h3 className="fw-bold mb-4 text-center">
        Reservar con horario
      </h3>
      {(props.usuario.rol === "ADMINISTRADOR") && (
        <div className="mb-3">
          <label className="form-label fw-semibold">Usuario</label>
          <select
            className="form-control"
            value={userSelect ?? ""}
            onChange={(e) => setUserSelect(Number(e.target.value))}
          >
            <option value="">Seleccione un usuario</option>
            {props.listadoUsuarios.map((e: any) => (
              <option key={e.id} value={e.id} title={e.nombre}>
                {e.nombre}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="mb-3">
        <label className="form-label fw-semibold">Espacio</label>
        <select
          className="form-control"
          value={espacioId ?? ""}
          onChange={(e) => setEspacioId(Number(e.target.value))}
        >
          <option value="">Seleccione un espacio</option>
          {espacios.map((e: any) => (
            <option key={e.id} value={e.id} title={e.nombre}>
              {e.nombre}
            </option>
          ))}
        </select>
      </div>
      <div className="row g-3 align-items-center mb-4">
        <div className="col-12">
          <label className="form-label">Desde</label>
          <DatePicker
            selected={fechaInicio}
            onChange={handleFechaInicio}
            showTimeSelect
            locale={es}
            timeIntervals={30}
            dateFormat="Pp"
            placeholderText="Inicio"
            className="form-control"
            maxDate={fechaFin ?? undefined}
          />
        </div>
        <div className="col-12 mt-3">
          <label className="form-label">Hasta</label>
          <DatePicker
            selected={fechaFin}
            onChange={handleFechaFin}
            showTimeSelect
            locale={es}
            timeIntervals={30}
            dateFormat="Pp"
            placeholderText="Fin"
            className="form-control"
            minDate={fechaInicio ?? undefined}
            disabled={!fechaInicio}
          />
        </div>
      </div>
      <div className="modal-actions mt-4">
        <button className="modal-btn modal-btn-green" onClick={buscarDisponibles} >
          Ver Disponibilidad
        </button>
        <button className="modal-btn modal-btn-close" onClick={props.onCancelar}>
          Cancelar
        </button>
      </div>
      {(espacioId && fechaInicio && fechaFin && verDisp) && (
        <ul className="list-group mt-4">
          <h5 className="titulo-secundario">Disponibles:</h5>
          {unidadesDisponibles.length > 0 && unidadesDisponibles.map((h: any) => {
            return <li key={h.id}>
              {espacioSelect.nombre} #{h.numero}{" "}
              <button onClick={() => reservar(h.id)} className="ml-3 modal-btn modal-btn-green btn-reservar">
                Reservar
              </button>
            </li>
          })}

          {(unidadesDisponibles.length === 0 && verDisp) && (
            <span>No hay disponibilidad para el rango seleccionado</span>
          )}
        </ul>
      )}
    </div>
  );
}
