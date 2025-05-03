import { ListadoAnuncios, ObteneCondominio, EliminarAnuncio, CrearAnuncio, Login, SuscribirNotificaciones, DesscribirNotificaciones, DarQuitarLike, ObtenerVotaciones, CambiarEstadoVotacion, Votar, CrearVotacion, CrearComentarioAnuncio, ObtenerAnuncioPorId } from "../../application/interactors/Anuncio";

export const ObtenerListadoAnuncioLogic = (selListado: any, idCondominio: string) => {
    return ListadoAnuncios(selListado, idCondominio);
}
export const ObteneCondominioLogic = (selListado: any, guid: string) => {
    return ObteneCondominio(selListado, guid);
}
export const EliminarAnuncioLogic = (selListado: any, idAnuncio: string) => {
    return EliminarAnuncio(selListado, idAnuncio);
}
export const CrearAnuncioLogic = (selListado: any, anuncio: any) => {
    return CrearAnuncio(selListado, anuncio);
}
export const LoginLogic = (selListado: any, usuario: any) => {
    return Login(selListado, usuario);
}
export const SuscribirNotificacionesLogic = (selListado: any, idCondominio: any, idUsuario: any, tipoSuscripcion: any) => {
    return SuscribirNotificaciones(selListado, idCondominio, idUsuario, tipoSuscripcion);
}
export const DessuscribirNotificacionesLogic = (selListado: any, idUsuario: any, tipoSuscripcion: any) => {
    return DesscribirNotificaciones(selListado, idUsuario, tipoSuscripcion);
}
export const DarQuitarLikeLogic = (selListado: any, idAnuncio: any, like: any) => {
    return DarQuitarLike(selListado, idAnuncio, like);
}
export const ObtenerVotacionesLogic = (selListado: any, idCondominio: string, idUsuario: any) => {
    return ObtenerVotaciones(selListado, idCondominio, idUsuario);
}
export const CambiarEstadoVotacionLogic = (selListado: any, idVotacion: any, estado: any) => {
    return CambiarEstadoVotacion(selListado, idVotacion, estado);
}
export const VotarLogic = (selListado: any, idOpcionVotacion: any, idUsuario: any) => {
    return Votar(selListado, idOpcionVotacion, idUsuario);
}
export const CrearVotacionLogic = (selListado: any, votacion: any) => {
    return CrearVotacion(selListado, votacion);
}
export const CrearComentarioAnuncioLogic = (selListado: any, comentario: any, idCondominio: any) => {
    return CrearComentarioAnuncio(selListado, comentario, idCondominio);
}

export const ObtenerAnuncioPorIdLogic = (selListado: any, idAnuncio: string) => {
    return ObtenerAnuncioPorId(selListado, idAnuncio);
}