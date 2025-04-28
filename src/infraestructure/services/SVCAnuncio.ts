import { con } from "../../application/entity/Rutas";
import { IServiceResult } from "../Interfaces/IServiceResult";
import { ServiceResult } from "./ServiceResult";
import axios, { AxiosResponse } from "axios";


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
}