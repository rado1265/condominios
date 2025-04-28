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