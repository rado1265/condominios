import { useState, useEffect } from "react";
import axios from "axios";
import { con } from "../../../application/entity/Rutas";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function ReservaConHorario(props: any) {
  let _ruta: string = con.RetornaRuta();
  const [espacios, setEspacios] = useState([]);
  const [espacioId, setEspacioId] = useState<number | null>(null);
  const [espacioSelect, setEspacioSelect] = useState<any>(null);
  const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
  const [fechaFin, setFechaFin] = useState<Date | null>(null);
  const [unidadesDisponibles, setUnidadesDisponibles] = useState<{ id: number; numero: number }[]>([]);

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
  };

  const reservar = async (unidadId: number) => {
    await axios.post(_ruta + "EspacioComun/reservar",
      {
        id: 0,
        idUnidadEspacio: unidadId,
        fechaInicio: formatToLocalISOString(new Date(fechaInicio ?? new Date())),
        fechaFin: formatToLocalISOString(new Date(fechaFin ?? new Date())),
        idUsuario: props.usuario.id,
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
    props.onCancelar()
  };
  useEffect(() => {
    if (espacioId) {
      setEspacioSelect(espacios.find((e: any) => e.id === espacioId));
    }
  }, [espacioId]);

  return (
    <div className="p-4 border rounded mt-4">
      <h3 className="font-bold">Reservar con horario</h3>

      <select onChange={(e) => setEspacioId(Number(e.target.value))} value={espacioId ?? ""}>
        <option value="">Seleccione un espacio</option>
        {espacios.map((e: any) => (
          <option key={e.id} value={e.id}>
            {e.nombre}
          </option>
        ))}
      </select>
      <div className="flex gap-2 my-2">
        <div>
          <label>Desde:</label>
          <DatePicker
            selected={fechaInicio}
            onChange={(date) => setFechaInicio(date)}
            showTimeSelect
            timeIntervals={30}
            dateFormat="Pp"
            placeholderText="Inicio"
          />
        </div>
        <div>
          <label>Hasta:</label>
          <DatePicker
            selected={fechaFin}
            onChange={(date) => setFechaFin(date)}
            showTimeSelect
            timeIntervals={30}
            dateFormat="Pp"
            placeholderText="Fin"
          />
        </div>
      </div>

      <button onClick={buscarDisponibles} className="mb-2">
        Consultar disponibilidad
      </button>
      <ul>
        {unidadesDisponibles.length > 0 && unidadesDisponibles.map((h: any) => {
          return <li key={h.id}>
            Unidad #{h.numero}{" "}
            <button onClick={() => reservar(h.id)} className="ml-2">
              Reservar
            </button>
          </li>
        })
        }
      </ul>
      <button className="modal-btn modal-btn-close" onClick={props.onCancelar}>Cancelar</button>
    </div>
  );
}
