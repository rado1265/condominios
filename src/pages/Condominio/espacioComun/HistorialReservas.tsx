import { useEffect, useState } from "react";
import axios from "axios";
import { con } from "../../../application/entity/Rutas";
import ReservaConHorario from "./ReservaConHorario";
export interface ReservaUsuario {
  id: number;
  fechaInicio: string;
  fechaFin: string;
  unidad: number;
  espacio: string;
  usuario: string;
  idUsuario: number;
  fechaSolicitud: Date;
  estado: boolean;
  espacioComun: string;
}
export default function HistorialReservas(props: any) {
  const [reservas, setReservas] = useState<ReservaUsuario[]>([]);
  let _ruta: string = con.RetornaRuta();
  const [crearNuevo, setCrearNuevo] = useState(false)
  const cargarReservas = async () => {
    const res = await axios.get(_ruta + "EspacioComun/mis-reservas?idUsuario=" + props.usuario.id + "&idCondominio=" + localStorage.getItem("idCondominio")!.toString(), {
      headers: {
        'Access-Control-Allow-Origin': '*',
        "x-community-id": "2b2463d9f3b093b61be6ce0adbdcc4a0f7e56776502d173a4cf4bb0a8f5d0e79",
      }
    });
    setReservas(res.data);
  };

  const cancelarReserva = async (id: number) => {
    await axios.delete(_ruta + `EspacioComun/cancelar?id=${id}&idCondominio=${localStorage.getItem("idCondominio")!.toString()}`, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        "x-community-id": "2b2463d9f3b093b61be6ce0adbdcc4a0f7e56776502d173a4cf4bb0a8f5d0e79",
      }
    });
    alert("Reserva cancelada");
    cargarReservas();
  };

  useEffect(() => {
    cargarReservas();
  }, []);

  return (!crearNuevo) ?
    <div className="p-4 border rounded mt-4">
      <h3 className="font-bold">Mis Reservas</h3>
      <button type="submit" className="modal-btn modal-btn-green" onClick={() => setCrearNuevo(true)}>+ Reservar</button>
      {reservas.length === 0 ? (
        <p>No tienes reservas aún.</p>
      ) : (
        <ul>
          {reservas.map((r) => (
            <li key={r.id}>
              {r.espacioComun} {r.espacio} #{r.unidad} - {new Date(r.fechaInicio).toLocaleString()}{" "}{new Date(r.fechaFin).toLocaleString()}{" "}
              {
                ((props.usuario.id === r.idUsuario && r.estado) || (props.usuario.rol === "ADMINISTRADOR")) && (
                  <button onClick={() => cancelarReserva(r.id)} className="ml-2 text-red-500">
                    {r.estado ? "Rechazar" : "Aprobar"}
                  </button>)
              }

            </li>
          ))}
        </ul>
      )}
      <button className="modal-btn modal-btn-close" onClick={props.onCancelar}>Cancelar</button>
    </div>
    :
    <ReservaConHorario onCancelar={() => { setCrearNuevo(false); cargarReservas() }} usuario={props.usuario} />
}
