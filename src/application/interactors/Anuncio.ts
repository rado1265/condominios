import { IServiceResult } from "../../infraestructure/Interfaces/IServiceResult";
import { SVCAnuncio } from "../../infraestructure/services/SVCAnuncio";

export const ListadoAnuncios = (selListado: any, idCondominio: string) => {
    SVCAnuncio.ListadoAnuncios(idCondominio).then((res: IServiceResult<any>) => {
        if (res.result !== undefined) {
            let data: any = res.result;
            selListado(false, '', data);
        } else {
            selListado(true, 'error', []);
        }
    });
};

export const ObteneCondominio = (selListado: any, guid: string) => {
    SVCAnuncio.ObteneCondominio(guid).then((res: IServiceResult<any>) => {
        if (res.result !== undefined) {
            let data: any = res.result;
            selListado(false, '', data);
        } else {
            selListado(true, 'error', []);
        }
    });
}
export const EliminarAnuncio = (selListado: any, idAnuncio: string) => {
    SVCAnuncio.EliminarAnuncio(idAnuncio).then((res: IServiceResult<any>) => {
        if (res.result !== undefined) {
            let data: any = res.result;
            selListado(false, '', data);
        } else {
            selListado(true, 'error', []);
        }
    });
}
export const CrearAnuncio = (selListado: any, anuncio: any) => {
    SVCAnuncio.CrearAnuncio(anuncio).then((res: IServiceResult<any>) => {
        if (res.result !== undefined) {
            let data: any = res.result;
            selListado(false, '', data);
        } else {
            selListado(true, 'error', []);
        }
    });
}
export const Login = (selListado: any, usuario: any, suscribir: boolean) => {
    SVCAnuncio.Login(usuario).then((res: IServiceResult<any>) => {
        if (res.result !== undefined) {
            let data: any = res.result;
            selListado(false, suscribir, data);
        } else {
            selListado(true, suscribir, []);
        }
    });
}

export const SuscribirNotificaciones = (selListado: any, tipoSuscripcion: any, registration: any) => {
    SVCAnuncio.SuscribirNotificaciones(registration).then((res: IServiceResult<any>) => {
        if (res.result !== undefined) {
            let data: any = res.result;
            selListado(false, tipoSuscripcion.toString(), data);
        } else {
            selListado(true, 'error', []);
        }
    });
}
export const SuscribirNotificaciones2 = (selListado: any, idCondominio: any, idUsuario: any, tipoSuscripcion: any, subscription: any, notificar: boolean) => {
    SVCAnuncio.SuscribirNotificaciones2(idCondominio, idUsuario, tipoSuscripcion, subscription).then((res: IServiceResult<any>) => {
        if (res.result !== undefined) {
            let data: any = res.result;
            selListado(false, tipoSuscripcion.toString(), data, notificar);
        } else {
            selListado(true, 'error', []);
        }
    });
}
export const DesscribirNotificaciones = (selListado: any, idUsuario: any, tipoSuscripcion: any, subscription: any) => {
    SVCAnuncio.DesscribirNotificaciones(idUsuario, tipoSuscripcion, subscription).then((res: IServiceResult<any>) => {
        if (res.result !== undefined) {
            let data: any = res.result;
            selListado(false, tipoSuscripcion.toString(), data);
        } else {
            selListado(true, 'error', []);
        }
    });
}
export const DarQuitarLike = (selListado: any, idAnuncio: any, idUsuario: any, nombreUsuario: string) => {
    SVCAnuncio.DarQuitarLike(idAnuncio, idUsuario, nombreUsuario).then((res: IServiceResult<any>) => {
        if (res.result !== undefined) {
            let data: any = res.result;
            selListado(false, '', data);
        } else {
            selListado(true, 'error', []);
        }
    });
}
export const ObtenerVotaciones = (selListado: any, idCondominio: string, idUsuario: any) => {
    SVCAnuncio.ObtenerVotaciones(idCondominio, idUsuario).then((res: IServiceResult<any>) => {
        if (res.result !== undefined) {
            let data: any = res.result;
            selListado(false, '', data);
        } else {
            selListado(true, 'error', []);
        }
    });
}

export const CambiarEstadoVotacion = (selListado: any, idVotacion: any, estado: any, idCondominio: any, idUsuario: any) => {
    SVCAnuncio.CambiarEstadoVotacion(idVotacion, estado, idCondominio, idUsuario).then((res: IServiceResult<any>) => {
        if (res.result !== undefined) {
            let data: any = res.result;
            selListado(false, '', data);
        } else {
            selListado(true, 'error', []);
        }
    });
}
export const Votar = (selListado: any, idOpcionVotacion: any, idUsuario: any, idCondominio: any) => {
    SVCAnuncio.Votar(idOpcionVotacion, idUsuario, idCondominio).then((res: IServiceResult<any>) => {
        if (res.result !== undefined) {
            let data: any = res.result;
            selListado(false, '', data);
        } else {
            selListado(true, 'error', []);
        }
    });
}
export const CrearVotacion = (selListado: any, votacion: any) => {
    SVCAnuncio.CrearVotacion(votacion).then((res: IServiceResult<any>) => {
        if (res.result !== undefined) {
            let data: any = res.result;
            selListado(false, '', data);
        } else {
            selListado(true, 'error', []);
        }
    });
}

export const CrearComentarioAnuncio = (selListado: any, comentario: any, idCondominio: any, eliminar: boolean) => {
    SVCAnuncio.CrearComentarioAnuncio(comentario, idCondominio, eliminar).then((res: IServiceResult<any>) => {
        if (res.result !== undefined) {
            let data: any = res.result;
            selListado(false, eliminar, data);
        } else {
            selListado(true, eliminar, []);
        }
    });
}
export const ObtenerAnuncioPorId = (selListado: any, idAnuncio: string) => {
    SVCAnuncio.ObtenerAnuncioPorId(idAnuncio).then((res: IServiceResult<any>) => {
        if (res.result !== undefined) {
            let data: any = res.result;
            selListado(false, '', data);
        } else {
            selListado(true, 'error', []);
        }
    });
};
export const EditUsuarioPorId = (selListado: any, usuario: any) => {
    SVCAnuncio.EditUsuarioPorId(usuario).then((res: IServiceResult<any>) => {
        if (res.result !== undefined) {
            let data: any = res.result;
            selListado(false, '', data);
        } else {
            selListado(true, 'error', []);
        }
    });
};
export const ObtenerUsuarioPorId = (selListado: any, idUsuario: string, idCondominio: string, registration: any) => {
    SVCAnuncio.ObtenerUsuarioPorId(idUsuario, idCondominio, registration).then((res: IServiceResult<any>) => {
        if (res.result !== undefined) {
            let data: any = res.result;
            selListado(false, '', data);
        } else {
            selListado(true, 'error', []);
        }
    });
};
export const ObtenerUsuarioPorIdSinNotificiaciones = (selListado: any, idUsuario: string, idCondominio: string) => {
    SVCAnuncio.ObtenerUsuarioPorIdSinNotificiaciones(idUsuario, idCondominio).then((res: IServiceResult<any>) => {
        if (res.result !== undefined) {
            let data: any = res.result;
            selListado(false, '', data);
        } else {
            selListado(true, 'error', []);
        }
    });
};
export const ObtenerUsuarios = (selListado: any, idCondominio: string) => {
    SVCAnuncio.ObtenerUsuarios(idCondominio).then((res: IServiceResult<any>) => {
        if (res.result !== undefined) {
            let data: any = res.result;
            selListado(false, '', data);
        } else {
            selListado(true, 'error', []);
        }
    });
};

export const ObtenerAvisos = (selListado: any, mes: any, idCondominio: any, anio: any) => {
    SVCAnuncio.ObtenerAvisos(mes, idCondominio, anio).then((res: IServiceResult<any>) => {
        if (res.result !== undefined) {
            let data: any = res.result;
            selListado(false, '', data);
        } else {
            selListado(true, 'error', []);
        }
    });
};

export const CrearAvisos = (selListado: any, aviso: string, eliminar: boolean) => {
    SVCAnuncio.CrearAvisos(aviso, eliminar).then((res: IServiceResult<any>) => {
        if (res.result !== undefined) {
            let data: any = res.result;
            selListado(false, eliminar, data);
        } else {
            selListado(true, eliminar, []);
        }
    });
};

export const ObtenerEmergencias = (selListado: any, idcondominio: any) => {
    SVCAnuncio.ObtenerEmergencias(idcondominio).then((res: IServiceResult<any>) => {
        if (res.result !== undefined) {
            let data: any = res.result;
            selListado(false, '', data);
        } else {
            selListado(true, 'error', []);
        }
    });
};

export const CrearEmergencia = (selListado: any, emergencia: string, eliminar: boolean) => {
    SVCAnuncio.CrearEmergencia(emergencia, eliminar).then((res: IServiceResult<any>) => {
        if (res.result !== undefined) {
            let data: any = res.result;
            selListado(false, '', data);
        } else {
            selListado(true, 'error', []);
        }
    });
};
export const CrearUsuario = (selListado: any, usuario: string, eliminar: boolean) => {
    SVCAnuncio.CrearUsuario(usuario, eliminar).then((res: IServiceResult<any>) => {
        if (res.result !== undefined) {
            let data: any = res.result;
            selListado(false, eliminar, data);
        } else {
            selListado(true, eliminar, []);
        }
    });
};
export const CambiarNormas = (selListado: any, normas: any, idCondominio: any) => {
    SVCAnuncio.CambiarNormas(normas, idCondominio).then((res: IServiceResult<any>) => {
        if (res.result !== undefined) {
            let data: any = res.result;
            selListado(false, '', data);
        } else {
            selListado(true, 'error', []);
        }
    });
};
export const EnviarNotifAviso = (selListado: any, aviso: any) => {
    SVCAnuncio.EnviarNotifAviso(aviso).then((res: IServiceResult<any>) => {
        if (res.result !== undefined) {
            let data: any = res.result;
            selListado(false, '', data);
        } else {
            selListado(true, 'error', []);
        }
    });
};
export const ObtenerMisAnuncio = (selListado: any, idUsuario: string, idSolicitante: string) => {
    SVCAnuncio.ObtenerMisAnuncio(idUsuario, idSolicitante).then((res: IServiceResult<any>) => {
        if (res.result !== undefined) {
            let data: any = res.result;
            selListado(false, '', data);
        } else {
            selListado(true, 'error', []);
        }
    });
};
