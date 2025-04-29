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
        if (!localStorage.getItem("idCondominio")) localStorage.setItem("idCondominio", urlPase[3]);
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
                        <div className="w-100 pb-3 mb-3" style={{ background: '#E6F4EA', justifyContent: 'center', display: 'grid', boxShadow: '0px 0px 24px 0px #5d8067' }}>
                            <img className="w-50 mx-auto" src={`data:image/jpeg;base64,${dataFull.logo}`} alt="Logo" />
                            <h2 className="text-center" style={{ color: '#656565', margin: '0' }}>{dataFull.nombre}</h2>
                        </div>
                        <div className="container pb-5">
                            <div className="row px-3 justify-content-around">
                                {dataFull.anuncios.map((a:any, i) => (
                                    <div key={i} className="anuncio card-shadow col-12 col-md-4 my-3">
                                        <div className="anuncio-header">
                                            <span className="anuncio-title">{a.cabecera}</span>
                                        </div>
                                        <div className="anuncio-body" dangerouslySetInnerHTML={{ __html: a.descripcion }} />
                                        <div className="anuncio-footer">
                                            <div className="anuncio-organizador">
                                                <span>Organizado por: </span>
                                                <span className="ml-1">{a.organizador}</span>
                                            </div>
                                            <span className="anuncio-telefono">{a.telefono}</span>
                                        </div>
                                        {a.amedida && (
                                            <div className="anuncio-img-wrapper">
                                                <img className="anuncio-img" src={`data:image/jpeg;base64,${a.amedida}`} alt="Foto" />
                                            </div>
                                        )}
                                        <small className="anuncio-fecha">
                                            Fecha publicación: {new Date(a.fechaDesde).toLocaleDateString()}
                                        </small>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
            }
        </React.Fragment>
    );
}

export default Condominio;