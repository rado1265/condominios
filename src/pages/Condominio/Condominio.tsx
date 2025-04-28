import React, { useEffect, useState } from "react";
import Loading from "../../components/utils/loading";
import './Condominio.css';
import { ObtenerListadoAnuncioLogic } from "../../presentation/view-model/Anuncio.logic";

const Condominio = () => {
    const [loading, setLoading] = useState(false);
    const [dataFull, setDataFull] = useState({
        anuncios: [],
        nombre: "",
        logo: ""
    });
    const fullURL = window.location.href;
    const urlPase = fullURL.split("/");

    useEffect(() => {
        if (urlPase[3]) {
            setLoading(true);
            ObtenerListadoAnuncioLogic(selListadoAnuncios, urlPase[3]);
        }
    }, [])

    const selListadoAnuncios = (error: Boolean, err: string, data: any) => {
        try {
            setLoading(false);
            setDataFull(data);
            console.log(data);
        } catch (er) {
            //ErrorMessage("Ha ocurrido un error", "Ha ocurrido un error desconocido. Comuníquese con el Administrador.")
        }
    }

    return (
        <React.Fragment>
            {
                loading ?
                    <Loading />
                    :
                    <div>
                        <div className="w-100 pb-3 mb-3" style={{background: '#E6F4EA', justifyContent: 'center', display: 'grid', boxShadow: '0px 0px 24px 0px #5d8067'}}>
                            <img className="w-50 mx-auto" src={`data:image/jpeg;base64,${dataFull.logo}`} alt="Logo" />
                            <h2 className="text-center" style={{color: '#656565', margin: '0'}}>{dataFull.nombre}</h2>
                        </div>
                        <div className="container pb-5">
                            <div className="row px-3">
                                {dataFull.anuncios.map((a: any) => {
                                    return (
                                        <div className="anuncio col-md-6 my-2 pt-5 pb-3">
                                            <small>Fecha publicación: {new Date(a.fechaDesde).toLocaleDateString()}</small>
                                            <span className="text-center w-100 d-block mb-2" style={{ fontSize: '1.5rem', lineHeight: '1' }}>{a.cabecera}</span>
                                            <div dangerouslySetInnerHTML={{ __html: a.descripcion }} />
                                            <div className="d-inline-flex w-100 mt-2" style={{ justifyContent: 'end' }}>
                                                <span>Organizador@: </span>
                                                <span className="ml-1">{a.organizador}</span>
                                            </div>
                                            <span className="d-flex" style={{ justifyContent: 'end' }}>{a.telefono}</span>
                                            {a.amedida ?
                                                <img style={{ maxWidth: '100%' }} src={`data:image/jpeg;base64,${a.amedida}`} alt="Foto" />
                                                : ""}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>


            }
        </React.Fragment>
    );
}

export default Condominio;