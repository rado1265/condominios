import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReservas, cancelarReserva } from  '../../../store/slices/espacioComun/historialReservasSlice'
import { RootState, AppDispatch } from "../../../store/store";
import ReservaConHorario from "./ReservaConHorario";

export default function HistorialReservas(props: any) {
  const dispatch: AppDispatch = useDispatch();
  const { reservas, loading } = useSelector((state: RootState) => state.historialReservas);
  const { listadousuarios } = useSelector((state: RootState) => state.usuarios);
  const [crearNuevo, setCrearNuevo] = useState(false);

 /*  useEffect(() => {
    if (props.usuario?.id) {
      dispatch(fetchReservas({ idUsuario: props.usuario.id }));
    }
  }, [props.usuario]); */

  return (!crearNuevo) ? (
    <div className="p-4 p-md-5 rounded mt-2 mt-md-5 shadow mx-auto col-md-8">
      <div className="d-flex">
        <h3 className="font-bold">{props.usuario.rol === "ADMINISTRADOR" ? "Ver Solicitudes" : "Mis Reservas"}</h3>
        <button type="submit" className="modal-btn modal-btn-green ml-3 btn-newReserva" onClick={() => setCrearNuevo(true)}>+ Reservar</button>
      </div>

      {loading ? (
        <p>Cargando reservas...</p>
      ) : reservas.length === 0 ? (
        <p>No tienes reservas aún.</p>
      ) : (
        <ul>
          {reservas.map((r) => (
            <li key={r.id} className="shadow px-4 py-3 pb-5 pb-md-3 rounded container-reserva">
              <strong>{r.espacioComun} {r.espacio} #{r.unidad}</strong><br />
              {r.usuario} {r.direccion ? "(" + r.direccion + ")" : ""}<br />
              {new Date(r.fechaInicio).toLocaleString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
              {" - "}
              {new Date(r.fechaFin).toLocaleString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}<br />
              <span className="f-solicitud">Fecha solicitud: {new Date(r.fechaSolicitud).toLocaleDateString("es-ES")}</span>
              {((props.usuario.id === r.idUsuario && r.estado) || props.usuario.rol === "ADMINISTRADOR") && (
                <button onClick={() => dispatch(cancelarReserva(r.id))} className="ml-2 modal-btn modal-btn-green btn-reservar">
                  {r.estado ? "Rechazar" : "Aprobar"}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
      <button className="modal-btn modal-btn-close" onClick={props.onCancelar}>Volver</button>
    </div>
  ) : (
    <ReservaConHorario onCancelar={() => { setCrearNuevo(false); dispatch(fetchReservas({ idUsuario: props.usuario.id })) }} usuario={props.usuario} listadoUsuarios={listadousuarios} />
  );
}
