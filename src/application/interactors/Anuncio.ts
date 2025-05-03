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
export const Login = (selListado: any, usuario: any) => {
    SVCAnuncio.Login(usuario).then((res: IServiceResult<any>) => {
        if (res.result !== undefined) {
            let data: any = res.result;
            selListado(false, '', data);
        } else {
            selListado(true, 'error', []);
        }
    });
}

export const SuscribirNotificaciones = (selListado: any, idCondominio: any, idUsuario: any, tipoSuscripcion: any) => {
    SVCAnuncio.SuscribirNotificaciones(idCondominio, idUsuario, tipoSuscripcion).then((res: IServiceResult<any>) => {
        if (res.result !== undefined) {
            let data: any = res.result;
            selListado(false, tipoSuscripcion.toString(), data);
        } else {
            selListado(true, 'error', []);
        }
    });
}
export const DesscribirNotificaciones = (selListado: any, idUsuario: any, tipoSuscripcion: any) => {
    SVCAnuncio.DesscribirNotificaciones(idUsuario, tipoSuscripcion).then((res: IServiceResult<any>) => {
        if (res.result !== undefined) {
            let data: any = res.result;
            selListado(false, tipoSuscripcion.toString(), data);
        } else {
            selListado(true, 'error', []);
        }
    });
}
export const DarQuitarLike = (selListado: any, idAnuncio: any, like: any) => {
    SVCAnuncio.DarQuitarLike(idAnuncio, like).then((res: IServiceResult<any>) => {
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

export const CambiarEstadoVotacion = (selListado: any, idVotacion: any, estado: any) => {
    SVCAnuncio.CambiarEstadoVotacion(idVotacion, estado).then((res: IServiceResult<any>) => {
        if (res.result !== undefined) {
            let data: any = res.result;
            selListado(false, '', data);
        } else {
            selListado(true, 'error', []);
        }
    });
}
export const Votar = (selListado: any, idOpcionVotacion: any, idUsuario: any) => {
    SVCAnuncio.Votar(idOpcionVotacion, idUsuario).then((res: IServiceResult<any>) => {
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