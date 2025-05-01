import { ListadoAnuncios, ObteneCondominio, EliminarAnuncio, CrearAnuncio, Login, SuscribirNotificaciones } from "../../application/interactors/Anuncio";

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
export const SuscribirNotificacionesLogic = () => {
    return SuscribirNotificaciones();
}
