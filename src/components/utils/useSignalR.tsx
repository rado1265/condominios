import { useEffect } from "react";
import connection from "./signalRConnection";
import { useDispatch } from "react-redux";
import { setCrearAnuncio, setEliminarAnuncio, setLikes, setNuevoComentario } from "../../store/slices/anuncio/anuncioSlice"
import { setCreaAviso } from "../../store/slices/avisos/avisoSlice"
export function useSignalR() {
  const dispatch = useDispatch();

  useEffect(() => {
    connection.start()
      .then(() => console.log("Conectado a SignalR"))
      .catch(err => console.error("Error al conectar", err));

    connection.on("RecibirNuevoComentario", (comentario) => {
      console.log("RecibirNuevoComentario", (comentario))
      dispatch(setNuevoComentario(comentario));
    });
    connection.on("EliminarAnuncio", (idAnuncio) => {
      console.log("EliminarAnuncio", (idAnuncio))
      dispatch(setEliminarAnuncio(idAnuncio));
    });
    connection.on("CrearAnuncio", (anuncio) => {
      console.log("CrearAnuncio", (anuncio))
      dispatch(setCrearAnuncio(anuncio));
    });
    connection.on("DarLike", (like) => {
      console.log("DarLike", (like))
      dispatch(setLikes(like));
    });
    connection.on("CrearAviso", (aviso) => {
      console.log("CrearAviso", (aviso))
      dispatch(setCreaAviso(aviso));
    });
    return () => {
      connection.stop();
    };
  }, []);
}