import { con } from "../../application/entity/Rutas";
import { IServiceResult } from "../Interfaces/IServiceResult";
import { ServiceResult } from "./ServiceResult";
import axios, { AxiosResponse } from "axios";

function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export class SVCAnuncio {
    public static async ListadoAnuncios(idCondominio: string): Promise<IServiceResult<any>> {
        let _ruta: string = con.RetornaRuta();

        const url: string = _ruta + "Condominios/getAnuncios?condominio=" + idCondominio;
        let sr: ServiceResult<any> = new ServiceResult<any>();
        sr.errorMessage = "Inicializando invocación";
        await axios
            .get(url, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                }
            })
            .then((res: AxiosResponse) => {
                if (res.data !== undefined) {
                    sr.result = res.data;
                }
            })
            .catch((err: any) => {
                sr.errorMessage = "Error al leer";
                sr.errorDetails = err;
            });

        return sr;
    }
    public static async ObteneCondominio(guid: string): Promise<IServiceResult<any>> {
        let _ruta: string = con.RetornaRuta();

        const url: string = _ruta + "Condominios/getCondominio?guid=" + guid;
        let sr: ServiceResult<any> = new ServiceResult<any>();
        sr.errorMessage = "Inicializando invocación";
        await axios
            .get(url, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                }
            })
            .then((res: AxiosResponse) => {
                if (res.data !== undefined) {
                    sr.result = res.data;
                }
            })
            .catch((err: any) => {
                sr.errorMessage = "Error al leer";
                sr.errorDetails = err;
            });

        return sr;
    }
    public static async EliminarAnuncio(idAnuncio: string): Promise<IServiceResult<any>> {
        let _ruta: string = con.RetornaRuta();

        const url: string = _ruta + "Condominios/deleteAnuncio/" + idAnuncio;
        let sr: ServiceResult<any> = new ServiceResult<any>();
        sr.errorMessage = "Inicializando invocación";
        await axios
            .get(url, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                }
            })
            .then((res: AxiosResponse) => {
                if (res.data !== undefined) {
                    sr.result = res.data;
                }
            })
            .catch((err: any) => {
                sr.errorMessage = "Error al leer";
                sr.errorDetails = err;
            });

        return sr;
    }
    public static async CrearAnuncio(anuncio: any): Promise<IServiceResult<any>> {
        let _ruta: string = con.RetornaRuta();

        const url: string = _ruta + "Condominios/createAnuncio";
        let sr: ServiceResult<any> = new ServiceResult<any>();
        sr.errorMessage = "Inicializando invocación";
        await axios
            .post(url, anuncio, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                }
            })
            .then((res: AxiosResponse) => {
                if (res.data !== undefined) {
                    sr.result = res.data;
                }
            })
            .catch((err: any) => {
                sr.errorMessage = "Error al leer";
                sr.errorDetails = err;
            });

        return sr;
    }
    public static async Login(usuario: any): Promise<IServiceResult<any>> {
        let _ruta: string = con.RetornaRuta();

        const url: string = _ruta + "Condominios/getUsuario?usuario=" + usuario.usuario + "&clave=" + usuario.clave + "&idCondominio=" + usuario.idCondominio;
        let sr: ServiceResult<any> = new ServiceResult<any>();
        sr.errorMessage = "Inicializando invocación";
        await axios
            .get(url, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                }
            })
            .then((res: AxiosResponse) => {
                if (res.data !== undefined) {
                    sr.result = res.data;
                }
            })
            .catch((err: any) => {
                sr.errorMessage = "Error al leer";
                sr.errorDetails = err;
            });

        return sr;
    }

    public static async SuscribirNotificaciones(idCondominio: any, idUsuario: any): Promise<IServiceResult<any>> {
        let _ruta: string = con.RetornaRuta();
        const registration = await navigator.serviceWorker.ready;

        const response = await axios.get(_ruta + 'Condominios/obtenerKey');
        console.log(response.data)
        const vapidPublicKey = response.data;
        const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: convertedVapidKey,
        });

        // Enviar suscripción al backend


        const url: string = _ruta + "Condominios/guardarSus?idCondominio= " + idCondominio + "&idUsuario=" + idUsuario
        let sr: ServiceResult<any> = new ServiceResult<any>();
        sr.errorMessage = "Inicializando invocación";
        await axios.post(url, subscription)
            .then((res: AxiosResponse) => {
                if (res.data !== undefined) {
                    sr.result = res.data;
                }
            })
            .catch((err: any) => {
                sr.errorMessage = "Error al leer";
                sr.errorDetails = err;
            });

        return sr;
    }
    public static async DesscribirNotificaciones(idUsuario: any): Promise<IServiceResult<any>> {
        let _ruta: string = con.RetornaRuta();

        const url: string = _ruta + "Condominios/eliminarSus?idUsuario=" + idUsuario
        let sr: ServiceResult<any> = new ServiceResult<any>();
        sr.errorMessage = "Inicializando invocación";
        await axios.post(url)
            .then((res: AxiosResponse) => {
                if (res.data !== undefined) {
                    sr.result = res.data;
                }
            })
            .catch((err: any) => {
                sr.errorMessage = "Error al leer";
                sr.errorDetails = err;
            });

        return sr;
    }

    public static async DarQuitarLike(idAnuncio: any, like: any): Promise<IServiceResult<any>> {
        let _ruta: string = con.RetornaRuta();

        const url: string = _ruta + "Condominios/darLike?idAnuncio=" + idAnuncio + "&like=" + like
        let sr: ServiceResult<any> = new ServiceResult<any>();
        sr.errorMessage = "Inicializando invocación";
        await axios.post(url)
            .then((res: AxiosResponse) => {
                if (res.data !== undefined) {
                    sr.result = res.data;
                }
            })
            .catch((err: any) => {
                sr.errorMessage = "Error al leer";
                sr.errorDetails = err;
            });

        return sr;
    }

    public static async ObtenerVotaciones(idCondominio: string, idUsuario: any): Promise<IServiceResult<any>> {
        let _ruta: string = con.RetornaRuta();

        const url: string = _ruta + "Condominios/getVotaciones?idCondominio=" + idCondominio + "&idUsuario=" + idUsuario
        let sr: ServiceResult<any> = new ServiceResult<any>();
        sr.errorMessage = "Inicializando invocación";
        await axios.post(url)
            .then((res: AxiosResponse) => {
                if (res.data !== undefined) {
                    sr.result = res.data;
                }
            })
            .catch((err: any) => {
                sr.errorMessage = "Error al leer";
                sr.errorDetails = err;
            });

        return sr;
    }

    public static async CambiarEstadoVotacion(idVotacion: any, estado: any): Promise<IServiceResult<any>> {
        let _ruta: string = con.RetornaRuta();

        const url: string = _ruta + "Condominios/cambiarEstadoVotacion?idVotacion=" + idVotacion + "&estado=" + estado
        let sr: ServiceResult<any> = new ServiceResult<any>();
        sr.errorMessage = "Inicializando invocación";
        await axios.post(url)
            .then((res: AxiosResponse) => {
                if (res.data !== undefined) {
                    sr.result = res.data;
                }
            })
            .catch((err: any) => {
                sr.errorMessage = "Error al leer";
                sr.errorDetails = err;
            });

        return sr;
    }
    public static async Votar(idOpcionVotacion: any, idUsuario: any): Promise<IServiceResult<any>> {
        let _ruta: string = con.RetornaRuta();

        const url: string = _ruta + "Condominios/votarEnVotacion?idOpcionVotacion=" + idOpcionVotacion + "&idUsuario=" + idUsuario
        let sr: ServiceResult<any> = new ServiceResult<any>();
        sr.errorMessage = "Inicializando invocación";
        await axios.post(url)
            .then((res: AxiosResponse) => {
                if (res.data !== undefined) {
                    sr.result = res.data;
                }
            })
            .catch((err: any) => {
                sr.errorMessage = "Error al leer";
                sr.errorDetails = err;
            });

        return sr;
    }
    public static async CrearVotacion(votacion: any): Promise<IServiceResult<any>> {
        let _ruta: string = con.RetornaRuta();

        const url: string = _ruta + "Condominios/crearVotacion"
        let sr: ServiceResult<any> = new ServiceResult<any>();
        sr.errorMessage = "Inicializando invocación";
        await axios.post(url, votacion)
            .then((res: AxiosResponse) => {
                if (res.data !== undefined) {
                    sr.result = res.data;
                }
            })
            .catch((err: any) => {
                sr.errorMessage = "Error al leer";
                sr.errorDetails = err;
            });

        return sr;
    }
}