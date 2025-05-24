import { useEffect } from "react";
import connection from "./signalRConnection";
import { useDispatch } from "react-redux";
import { setNuevoComentario } from "../../store/slices/anuncio/anuncioSlice"

export function useSignalR() {
  const dispatch = useDispatch();

  useEffect(() => {
    connection.start()
      .then(() => console.log("Conectado a SignalR"))
      .catch(err => console.error("Error al conectar", err));

    connection.on("RecibirNuevoComentario", (comentario) => {
      dispatch(setNuevoComentario(comentario)); // esto lo agregará al array en Redux
    });

    return () => {
      connection.stop();
    };
  }, []);
}