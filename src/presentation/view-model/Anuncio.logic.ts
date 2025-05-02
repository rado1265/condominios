import { ListadoAnuncios, ObteneCondominio, EliminarAnuncio, CrearAnuncio, Login, SuscribirNotificaciones, DesscribirNotificaciones, DarQuitarLike, ObtenerVotaciones, CambiarEstadoVotacion, Votar, CrearVotacion } from "../../application/interactors/Anuncio";

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
export const SuscribirNotificacionesLogic = (selListado: any, idCondominio: any, idUsuario: any) => {
    return SuscribirNotificaciones(selListado, idCondominio, idUsuario);
}
export const DessuscribirNotificacionesLogic = (selListado: any, idUsuario: any) => {
    return DesscribirNotificaciones(selListado, idUsuario);
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
