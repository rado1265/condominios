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

export const SuscribirNotificaciones = (selListado: any, idCondominio: any, idUsuario: any) => {
    SVCAnuncio.SuscribirNotificaciones(idCondominio, idUsuario).then((res: IServiceResult<any>) => {
        if (res.result !== undefined) {
            let data: any = res.result;
            selListado(false, '', data);
        } else {
            selListado(true, 'error', []);
        }
    });
}
export const DesscribirNotificaciones = (selListado: any, idUsuario: any) => {
    SVCAnuncio.DesscribirNotificaciones(idUsuario).then((res: IServiceResult<any>) => {
        if (res.result !== undefined) {
            let data: any = res.result;
            selListado(false, '', data);
        } else {
            selListado(true, 'error', []);
        }
    });
}

