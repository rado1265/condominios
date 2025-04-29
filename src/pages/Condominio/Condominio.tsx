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
    const [tipo, setTipo] = useState(0)

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
    const navegador = () => {
        return <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t">
            <div className="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">
                <button type="button" className="button" onClick={() => setTipo(0)}>
                    <svg className="icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                    </svg>
                    <span className="text">Home</span>
                </button>
                <button type="button" className="button" onClick={() => setTipo(1)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" className="icon">
                        <path d="M10 2a1 1 0 0 1 1 1v4.586l3.293-3.293a1 1 0 0 1 1.414 1.414l-4.293 4.293a1 1 0 0 1-1.414 0l-4.293-4.293a1 1 0 0 1 1.414-1.414L9 7.586V3a1 1 0 0 1 1-1zM2 10a8 8 0 1 1 16 0 8 8 0 0 1-16 0zm8 4a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                    </svg>
                    <span className="text">Anuncios</span>
                </button>
                <button type="button" className="button" onClick={() => setTipo(2)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" className="icon">
                        <path d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm0 14a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm-.5-9a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5V7z" />
                    </svg>
                    <span className="text">Recordatorios</span>
                </button>
                <button type="button" className="button" onClick={() => setTipo(3)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" className="icon">
                        <path d="M10 2a1 1 0 0 1 1 1v6h6a1 1 0 0 1 0 2h-6v6a1 1 0 0 1-2 0v-6H3a1 1 0 0 1 0-2h6V3a1 1 0 0 1 1-1z" />
                    </svg>
                    <span className="text">Otros</span>
                </button>
            </div>
        </div>
    }
    const anuncios = (a: any) => {
        if (a.idTipo != tipo && tipo != 0)
            return false
        else
            return <div className="anuncio col-md-6 my-2 pt-5 pb-3">
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
                            <div className="row px-3">
                                {dataFull.anuncios.map((a: any) => {
                                    return (
                                        anuncios(a)
                                    );
                                })}
                            </div>
                        </div>
                        {navegador()}
                    </div>
            }
        </React.Fragment>
    );
}

export default Condominio;