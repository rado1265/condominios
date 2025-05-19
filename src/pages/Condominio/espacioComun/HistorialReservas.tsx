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
  const [reservasCargadas, setReservasCargadas] = useState(false)
  const cargarReservas = async () => {
    const res = await axios.get(_ruta + "EspacioComun/mis-reservas?idUsuario=" + props.usuario.id + "&idCondominio=" + localStorage.getItem("idCondominio")!.toString(), {
      headers: {
        'Access-Control-Allow-Origin': '*',
        "x-community-id": "2b2463d9f3b093b61be6ce0adbdcc4a0f7e56776502d173a4cf4bb0a8f5d0e79",
      }
    });
    setReservas(res.data);
    setReservasCargadas(true);
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
    <div className="p-4 p-md-5 rounded mt-5 shadow mx-auto col-md-8">
      <div className="d-flex">
        <h3 className="font-bold">Mis Reservas</h3>
        <button type="submit" className="modal-btn modal-btn-green ml-3 btn-newReserva" onClick={() => setCrearNuevo(true)}>+ Reservar</button>
      </div>
      {!reservasCargadas ? (
        <p>Cargando reservas...</p>
      ) :
        (reservas.length === 0 && reservasCargadas) ? (
          <p>No tienes reservas aún.</p>
        ) : (
          <ul>
            {reservas.map((r) => (
              <li key={r.id} className="shadow px-4 py-3 rounded container-reserva">
                <strong>{r.espacioComun} {r.espacio} #{r.unidad} </strong><br></br>
                {r.usuario} <br></br>
                {new Date(r.fechaInicio).toLocaleString('es-ES', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
                {" - "}
                {new Date(r.fechaFin).toLocaleString('es-ES', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}{" "}
                {
                  ((props.usuario.id === r.idUsuario && r.estado) || (props.usuario.rol === "ADMINISTRADOR")) && (
                    <button onClick={() => cancelarReserva(r.id)} className="ml-2 ml-2 modal-btn modal-btn-green btn-reservar">
                      {r.estado ? "Rechazar" : "Aprobar"}
                    </button>)
                }

              </li>
            ))}
          </ul>
        )}
      <button className="modal-btn modal-btn-close" onClick={props.onCancelar}>Volver</button>
    </div>
    :
    <ReservaConHorario onCancelar={() => { setCrearNuevo(false); cargarReservas() }} usuario={props.usuario} />
}
