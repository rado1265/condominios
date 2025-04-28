export default interface Anuncio {
    id: number;
    nombre: string;
    descripcion: string;
    precioCompra: number;
    precioVenta: number;
    idtipo: number;
    urlImagen: string;
    activo: boolean;
    stock: number;
}