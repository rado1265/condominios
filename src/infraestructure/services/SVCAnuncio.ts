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
                    "x-community-id": "2b2463d9f3b093b61be6ce0adbdcc4a0f7e56776502d173a4cf4bb0a8f5d0e79",
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
                    "x-community-id": "2b2463d9f3b093b61be6ce0adbdcc4a0f7e56776502d173a4cf4bb0a8f5d0e79",
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
                    "x-community-id": "2b2463d9f3b093b61be6ce0adbdcc4a0f7e56776502d173a4cf4bb0a8f5d0e79",
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
                    "x-community-id": "2b2463d9f3b093b61be6ce0adbdcc4a0f7e56776502d173a4cf4bb0a8f5d0e79",
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
        /*const registration = await navigator.serviceWorker.ready;

        const response = await axios.get(_ruta + 'Condominios/obtenerKey');
        console.log(response.data)
        const vapidPublicKey = response.data;
        const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: convertedVapidKey,
        });*/
        const url: string = _ruta + "Condominios/getUsuario?usuario";
        let sr: ServiceResult<any> = new ServiceResult<any>();
        sr.errorMessage = "Inicializando invocación";
        await axios
            .post(url, usuario, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    "x-community-id": "2b2463d9f3b093b61be6ce0adbdcc4a0f7e56776502d173a4cf4bb0a8f5d0e79",
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

    public static async SuscribirNotificaciones(registration: any): Promise<IServiceResult<any>> {
        let _ruta: string = con.RetornaRuta();
        const response = await axios.get(_ruta + 'Condominios/obtenerKey');
        const vapidPublicKey = response.data;
        const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: convertedVapidKey,
        });
        let sr: ServiceResult<any> = new ServiceResult<any>();
        sr.errorMessage = "Inicializando invocación";
        sr.result = subscription;

        return sr;
    }
    public static async SuscribirNotificaciones2(idCondominio: any, idUsuario: any, tipoSuscripcion: any, subscription: any): Promise<IServiceResult<any>> {
        let _ruta: string = con.RetornaRuta();
        const url: string = _ruta + "Condominios/guardarSus?idCondominio= " + idCondominio + "&idUsuario=" + idUsuario + "&tipoSuscripcion=" + tipoSuscripcion
        let sr: ServiceResult<any> = new ServiceResult<any>();
        sr.errorMessage = "Inicializando invocación";
        await axios.post(url, subscription, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                "x-community-id": "2b2463d9f3b093b61be6ce0adbdcc4a0f7e56776502d173a4cf4bb0a8f5d0e79",
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
    public static async DesscribirNotificaciones(idUsuario: any, tipoSuscripcion: any): Promise<IServiceResult<any>> {
        let _ruta: string = con.RetornaRuta();

        const url: string = _ruta + "Condominios/eliminarSus?idUsuario=" + idUsuario + "&tipoSuscripcion=" + tipoSuscripcion
        let sr: ServiceResult<any> = new ServiceResult<any>();
        sr.errorMessage = "Inicializando invocación";
        await axios.post(url, [], {
            headers: {
                'Access-Control-Allow-Origin': '*',
                "x-community-id": "2b2463d9f3b093b61be6ce0adbdcc4a0f7e56776502d173a4cf4bb0a8f5d0e79",
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

    public static async DarQuitarLike(idAnuncio: any, idUsuario: any, nombreUsuario: string): Promise<IServiceResult<any>> {
        let _ruta: string = con.RetornaRuta();

        const url: string = _ruta + "Condominios/darLike?idAnuncio=" + idAnuncio + "&idUsuario=" + idUsuario + "&nombreUsuario=" + nombreUsuario
        let sr: ServiceResult<any> = new ServiceResult<any>();
        sr.errorMessage = "Inicializando invocación";
        await axios.post(url, [], {
            headers: {
                'Access-Control-Allow-Origin': '*',
                "x-community-id": "2b2463d9f3b093b61be6ce0adbdcc4a0f7e56776502d173a4cf4bb0a8f5d0e79",
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

    public static async ObtenerVotaciones(idCondominio: string, idUsuario: any): Promise<IServiceResult<any>> {
        let _ruta: string = con.RetornaRuta();

        const url: string = _ruta + "Condominios/getVotaciones?condominio=" + idCondominio + "&idUsuario=" + idUsuario
        let sr: ServiceResult<any> = new ServiceResult<any>();
        sr.errorMessage = "Inicializando invocación";
        await axios.get(url, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                "x-community-id": "2b2463d9f3b093b61be6ce0adbdcc4a0f7e56776502d173a4cf4bb0a8f5d0e79",
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

    public static async CambiarEstadoVotacion(idVotacion: any, estado: any, idCondominio: any, idUsuario: any): Promise<IServiceResult<any>> {
        let _ruta: string = con.RetornaRuta();

        const url: string = _ruta + "Condominios/cambiarEstadoVotacion?idVotacion=" + idVotacion + "&estado=" + estado + "&idCondominio=" + idCondominio + "&idUsuario=" + idUsuario
        let sr: ServiceResult<any> = new ServiceResult<any>();
        sr.errorMessage = "Inicializando invocación";
        await axios.post(url, [], {
            headers: {
                'Access-Control-Allow-Origin': '*',
                "x-community-id": "2b2463d9f3b093b61be6ce0adbdcc4a0f7e56776502d173a4cf4bb0a8f5d0e79",
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
    public static async Votar(idOpcionVotacion: any, idUsuario: any, idCondominio: any): Promise<IServiceResult<any>> {
        let _ruta: string = con.RetornaRuta();

        const url: string = _ruta + "Condominios/votarEnVotacion?idOpcionVotacion=" + idOpcionVotacion + "&idUsuario=" + idUsuario + "&idCondominio=" + idCondominio
        let sr: ServiceResult<any> = new ServiceResult<any>();
        sr.errorMessage = "Inicializando invocación";
        await axios.post(url, [], {
            headers: {
                'Access-Control-Allow-Origin': '*',
                "x-community-id": "2b2463d9f3b093b61be6ce0adbdcc4a0f7e56776502d173a4cf4bb0a8f5d0e79",
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
    public static async CrearVotacion(votacion: any): Promise<IServiceResult<any>> {
        let _ruta: string = con.RetornaRuta();

        const url: string = _ruta + "Condominios/crearVotacion"
        let sr: ServiceResult<any> = new ServiceResult<any>();
        sr.errorMessage = "Inicializando invocación";
        await axios.post(url, votacion, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                "x-community-id": "2b2463d9f3b093b61be6ce0adbdcc4a0f7e56776502d173a4cf4bb0a8f5d0e79",
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
    public static async CrearComentarioAnuncio(comentario: any, idCondominio: any, eliminar: boolean): Promise<IServiceResult<any>> {
        let _ruta: string = con.RetornaRuta();

        const url: string = _ruta + "Condominios/createComentarioAnuncio?idCondominio=" + idCondominio + "&eliminar=" + eliminar;
        let sr: ServiceResult<any> = new ServiceResult<any>();
        sr.errorMessage = "Inicializando invocación";
        await axios
            .post(url, comentario, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    "x-community-id": "2b2463d9f3b093b61be6ce0adbdcc4a0f7e56776502d173a4cf4bb0a8f5d0e79",
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
    public static async ObtenerAnuncioPorId(idAnuncio: string): Promise<IServiceResult<any>> {
        let _ruta: string = con.RetornaRuta();

        const url: string = _ruta + "Condominios/getAnuncioPorId?idAnuncio=" + idAnuncio;
        let sr: ServiceResult<any> = new ServiceResult<any>();
        sr.errorMessage = "Inicializando invocación";
        await axios
            .get(url, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    "x-community-id": "2b2463d9f3b093b61be6ce0adbdcc4a0f7e56776502d173a4cf4bb0a8f5d0e79",
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


    public static async EditUsuarioPorId(usuario: any): Promise<IServiceResult<any>> {
        let _ruta: string = con.RetornaRuta();

        const url: string = _ruta + "Condominios/editUsuarioPorId";
        let sr: ServiceResult<any> = new ServiceResult<any>();
        sr.errorMessage = "Inicializando invocación";
        await axios
            .post(url, usuario, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    "x-community-id": "2b2463d9f3b093b61be6ce0adbdcc4a0f7e56776502d173a4cf4bb0a8f5d0e79",
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
    public static async ObtenerUsuarioPorId(idUsuario: string, idCondominio: string, subscription: any): Promise<IServiceResult<any>> {
        let _ruta: string = con.RetornaRuta();

        const url: string = _ruta + "Condominios/getUsuarioPorId?idUsuario=" + idUsuario + "&idCondominio=" + idCondominio;
        let sr: ServiceResult<any> = new ServiceResult<any>();
        sr.errorMessage = "Inicializando invocación";
        await axios
            .post(url, subscription, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    "x-community-id": "2b2463d9f3b093b61be6ce0adbdcc4a0f7e56776502d173a4cf4bb0a8f5d0e79",
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
    public static async ObtenerUsuarioPorIdSinNotificiaciones(idUsuario: string, idCondominio: string): Promise<IServiceResult<any>> {
        let _ruta: string = con.RetornaRuta();

        const url: string = _ruta + "Condominios/getUsuarioPorIdSinNotificaciones?idUsuario=" + idUsuario + "&idCondominio=" + idCondominio;
        let sr: ServiceResult<any> = new ServiceResult<any>();
        sr.errorMessage = "Inicializando invocación";
        await axios
            .post(url, [], {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    "x-community-id": "2b2463d9f3b093b61be6ce0adbdcc4a0f7e56776502d173a4cf4bb0a8f5d0e79",
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
    public static async ObtenerUsuarios(idCondominio: string): Promise<IServiceResult<any>> {
        let _ruta: string = con.RetornaRuta();

        const url: string = _ruta + "Condominios/getUsuarios?idCondominio=" + idCondominio;
        let sr: ServiceResult<any> = new ServiceResult<any>();
        sr.errorMessage = "Inicializando invocación";
        await axios
            .get(url, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    "x-community-id": "2b2463d9f3b093b61be6ce0adbdcc4a0f7e56776502d173a4cf4bb0a8f5d0e79",
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


    public static async CrearAvisos(aviso: any, eliminar: boolean): Promise<IServiceResult<any>> {
        let _ruta: string = con.RetornaRuta();

        const url: string = _ruta + "Condominios/crearAviso?eliminar=" + eliminar;
        let sr: ServiceResult<any> = new ServiceResult<any>();
        sr.errorMessage = "Inicializando invocación";
        await axios
            .post(url, aviso, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    "x-community-id": "2b2463d9f3b093b61be6ce0adbdcc4a0f7e56776502d173a4cf4bb0a8f5d0e79",
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
    public static async ObtenerAvisos(mes: string, idCondominio: any, anio: any): Promise<IServiceResult<any>> {
        let _ruta: string = con.RetornaRuta();

        const url: string = _ruta + "Condominios/getAvisos?mes=" + mes + "&idCondominio=" + idCondominio + "&anio=" + anio;
        let sr: ServiceResult<any> = new ServiceResult<any>();
        sr.errorMessage = "Inicializando invocación";
        await axios
            .get(url, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    "x-community-id": "2b2463d9f3b093b61be6ce0adbdcc4a0f7e56776502d173a4cf4bb0a8f5d0e79",
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
    public static async CrearEmergencia(emergencia: any, eliminar: boolean): Promise<IServiceResult<any>> {
        let _ruta: string = con.RetornaRuta();

        const url: string = _ruta + "Condominios/crearEmergencia?eliminar=" + eliminar;

        let sr: ServiceResult<any> = new ServiceResult<any>();
        sr.errorMessage = "Inicializando invocación";
        await axios
            .post(url, emergencia, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    "x-community-id": "2b2463d9f3b093b61be6ce0adbdcc4a0f7e56776502d173a4cf4bb0a8f5d0e79",
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

    public static async CrearUsuario(usuario: any, eliminar: boolean): Promise<IServiceResult<any>> {
        let _ruta: string = con.RetornaRuta();

        const url: string = _ruta + "Condominios/crearUsuarioComunidad?eliminar=" + eliminar;

        let sr: ServiceResult<any> = new ServiceResult<any>();
        sr.errorMessage = "Inicializando invocación";
        await axios
            .post(url, usuario, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    "x-community-id": "2b2463d9f3b093b61be6ce0adbdcc4a0f7e56776502d173a4cf4bb0a8f5d0e79",
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
    public static async ObtenerEmergencias(idCondominio: string): Promise<IServiceResult<any>> {
        let _ruta: string = con.RetornaRuta();

        const url: string = _ruta + "Condominios/getEmergencias?idCondominio=" + idCondominio;
        let sr: ServiceResult<any> = new ServiceResult<any>();
        sr.errorMessage = "Inicializando invocación";
        await axios
            .get(url, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    "x-community-id": "2b2463d9f3b093b61be6ce0adbdcc4a0f7e56776502d173a4cf4bb0a8f5d0e79",
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

    public static async CambiarNormas(normas: any, idCondominio: any): Promise<IServiceResult<any>> {
        let _ruta: string = con.RetornaRuta();

        const url: string = _ruta + "Condominios/updateNormas?idCondominio=" + idCondominio;

        let sr: ServiceResult<any> = new ServiceResult<any>();
        sr.errorMessage = "Inicializando invocación";
        await axios
            .post(url, JSON.stringify({ html: normas }), {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                    "x-community-id": "2b2463d9f3b093b61be6ce0adbdcc4a0f7e56776502d173a4cf4bb0a8f5d0e79",
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
    public static async EnviarNotifAviso(aviso: any): Promise<IServiceResult<any>> {
        let _ruta: string = con.RetornaRuta();

        const url: string = _ruta + "Condominios/enviarNotifAvisos";

        let sr: ServiceResult<any> = new ServiceResult<any>();
        sr.errorMessage = "Inicializando invocación";
        await axios
            .post(url, aviso, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    "x-community-id": "2b2463d9f3b093b61be6ce0adbdcc4a0f7e56776502d173a4cf4bb0a8f5d0e79",
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

    public static async ObtenerMisAnuncio(idUsuario: string, idSolicitante: string): Promise<IServiceResult<any>> {
        let _ruta: string = con.RetornaRuta();

        const url: string = _ruta + "Condominios/getAnunciosPorUsuario?idUsuario=" + idUsuario + "&idSolicitante=" + idSolicitante;
        let sr: ServiceResult<any> = new ServiceResult<any>();
        sr.errorMessage = "Inicializando invocación";
        await axios
            .get(url, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    "x-community-id": "2b2463d9f3b093b61be6ce0adbdcc4a0f7e56776502d173a4cf4bb0a8f5d0e79",
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
}