import { con } from "../../application/entity/Rutas";
import { IServiceResult } from "../Interfaces/IServiceResult";
import { ServiceResult } from "./ServiceResult";
import axios, { AxiosResponse } from "axios";

function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
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

    public static async SuscribirNotificaciones() {
        const registration = await navigator.serviceWorker.ready;

        const response = await axios.get('/publicKey');
        const vapidPublicKey = response.data;
        const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: convertedVapidKey,
        });

        // Enviar suscripción al backend
        await axios.post('/subscribe', subscription);
        alert('¡Suscripción a notificaciones completada!');
    }
}