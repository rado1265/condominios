import { ListadoAnuncios, ObteneCondominio, EliminarAnuncio, CrearAnuncio, Login, SuscribirNotificaciones, DesscribirNotificaciones, DarQuitarLike, ObtenerVotaciones, CambiarEstadoVotacion, Votar, CrearVotacion, CrearComentarioAnuncio, ObtenerAnuncioPorId, EditUsuarioPorId, ObtenerUsuarioPorId, ObtenerUsuarios, ObtenerAvisos, CrearAvisos, ObtenerEmergencias, CrearEmergencia, SuscribirNotificaciones2, CambiarNormas, EnviarNotifAviso, ObtenerMisAnuncio, CrearUsuario, ObtenerUsuarioPorIdSinNotificiaciones } from "../../application/interactors/Anuncio";

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
export const LoginLogic = (selListado: any, usuario: any, suscribir: boolean) => {
    return Login(selListado, usuario, suscribir);
}
export const SuscribirNotificacionesLogic = (selListado: any, tipoSuscripcion: any, registration: any) => {
    return SuscribirNotificaciones(selListado, tipoSuscripcion, registration);
}
export const SuscribirNotificaciones2Logic = (selListado: any, idCondominio: any, idUsuario: any, tipoSuscripcion: any, subscription: any, notificar: boolean) => {
    return SuscribirNotificaciones2(selListado, idCondominio, idUsuario, tipoSuscripcion, subscription, notificar);
}
export const DessuscribirNotificacionesLogic = (selListado: any, idUsuario: any, tipoSuscripcion: any, subscription: any) => {
    return DesscribirNotificaciones(selListado, idUsuario, tipoSuscripcion, subscription);
}
export const DarQuitarLikeLogic = (selListado: any, idAnuncio: any, idUsuario: any, nombreUsuario: string) => {
    return DarQuitarLike(selListado, idAnuncio, idUsuario, nombreUsuario);
}
export const ObtenerVotacionesLogic = (selListado: any, idCondominio: string, idUsuario: any) => {
    return ObtenerVotaciones(selListado, idCondominio, idUsuario);
}
export const CambiarEstadoVotacionLogic = (selListado: any, idVotacion: any, estado: any, idCondominio: any, idUsuario: any) => {
    return CambiarEstadoVotacion(selListado, idVotacion, estado, idCondominio, idUsuario);
}
export const VotarLogic = (selListado: any, idOpcionVotacion: any, idUsuario: any, idCondominio: any) => {
    return Votar(selListado, idOpcionVotacion, idUsuario, idCondominio);
}
export const CrearVotacionLogic = (selListado: any, votacion: any) => {
    return CrearVotacion(selListado, votacion);
}
export const CrearComentarioAnuncioLogic = (selListado: any, comentario: any, idCondominio: any, eliminar: boolean) => {
    return CrearComentarioAnuncio(selListado, comentario, idCondominio, eliminar);
}

export const ObtenerAnuncioPorIdLogic = (selListado: any, idAnuncio: string) => {
    return ObtenerAnuncioPorId(selListado, idAnuncio);
}

export const EditUsuarioPorIdLogic = (selListado: any, usuario: any) => {
    return EditUsuarioPorId(selListado, usuario);
}

export const ObtenerUsuarioPorIdLogic = (selListado: any, idUsuario: string, idCondominio: string, registration: any) => {
    return ObtenerUsuarioPorId(selListado, idUsuario, idCondominio, registration);
}
export const ObtenerUsuarioPorIdSinNotificiacionesLogic = (selListado: any, idUsuario: string, idCondominio: string) => {
    return ObtenerUsuarioPorIdSinNotificiaciones(selListado, idUsuario, idCondominio);
}

export const ObtenerUsuariosLogic = (selListado: any, idCondominio: string) => {
    return ObtenerUsuarios(selListado, idCondominio);
}

export const ObtenerAvisosLogic = (selListado: any, mes: string, idCondominio: any, anio: any) => {
    return ObtenerAvisos(selListado, mes, idCondominio, anio);
}
export const CrearAvisosLogic = (selListado: any, aviso: any, eliminar: boolean) => {
    return CrearAvisos(selListado, aviso, eliminar);
}
export const ObtenerEmergenciasLogic = (selListado: any, idcondominio: string) => {
    return ObtenerEmergencias(selListado, idcondominio);
}
export const CrearEmergenciaLogic = (selListado: any, emergencia: any, eliminar: boolean) => {
    return CrearEmergencia(selListado, emergencia, eliminar);
}
export const CambiarNormasLogic = (selListado: any, normas: any, idCondominio: any) => {
    return CambiarNormas(selListado, normas, idCondominio);
}

export const EnviarNotifAvisoLogic = (selListado: any, aviso: any) => {
    return EnviarNotifAviso(selListado, aviso);
}

export const ObtenerMisAnuncioLogic = (selListado: any, idUsuario: string, idSolicitante: string) => {
    return ObtenerMisAnuncio(selListado, idUsuario, idSolicitante);
}

export const CrearUsuarioLogic = (selListado: any, usuario: any, eliminar: boolean) => {
    return CrearUsuario(selListado, usuario, eliminar);
}