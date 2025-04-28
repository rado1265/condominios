import { ListadoAnuncios } from "../../application/interactors/Anuncio";

export const ObtenerListadoAnuncioLogic = (selListado: any, idCondominio: string) => {
    return ListadoAnuncios(selListado, idCondominio);
}