import React, { useEffect, useState } from 'react';

interface Anuncio {
    id: number;
    idUsuario: number;
    idTipo: number;
    cabecera: string;
    descripcion: string;
    organizador: string;
    telefono: string;
    amedida: string;
    esVideo: boolean;
    activo: boolean;
    cantComentarios: number;
    fechaDesde: string;
    likes: number;
    imgOrganizador: string;
    direccionOrganizador: string;
}

interface Props {
    anuncio: Anuncio;
    usuarioId: number;
    usuarioRol: string;
    onEditar: (anuncio: Anuncio) => void;
    onEliminar: (id: number) => void;
    onDeshabilitar: (anuncio: Anuncio) => void;
    onVerDetalle: (anuncio: Anuncio) => void;
    onLike: (id: number) => void;
    imgErrorUrl: string;
    loading: boolean;
    arrayImgUsers: any[];
}

const AnunciosPanel: React.FC<Props> = ({
    anuncio,
    usuarioId,
    usuarioRol,
    onEditar,
    onEliminar,
    onDeshabilitar,
    onVerDetalle,
    onLike,
    imgErrorUrl,
    loading,
    arrayImgUsers
}) => {
    const esPropietario = usuarioId === anuncio.idUsuario || usuarioRol === "ADMINISTRADOR";
    const [modalOpenImg, setModalOpenImg] = useState(false);
    const [imgSelect, setImgSelect] = useState("");
    const [imgAnuncio, setImgAnuncio] = useState("");


    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        e.currentTarget.src = imgErrorUrl;
    };

    const openModalImg = (img: any) => {
        setImgSelect(img);
        setModalOpenImg(true);
    }

    const closeModalImg = () => {
        setModalOpenImg(false);
        setImgSelect("");
    };

    useEffect(() => {
        const matchArchivo = arrayImgUsers.find((b: any) => b.nombre === anuncio.imgOrganizador);
        if (matchArchivo) {
            setImgAnuncio(matchArchivo.url);
        } else if (anuncio.imgOrganizador.includes("https")) {
            setImgAnuncio(anuncio.imgOrganizador);
        }
    }, [])


    return <>
        {!loading && <div className="v2-anuncio card-shadow col-10 col-md-3 my-3 mx-md-1 pb-5 pt-5">
            <div className="v2-anuncio-header">
                {esPropietario && (
                    <div className="v2-anuncio-actions">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 -960 960 960"
                            className={"v2-icon verInput " + (anuncio.activo ? "Deshabilitar" : "Habilitar")}
                            fill="currentColor"
                            onClick={() => onDeshabilitar(anuncio)}
                        >
                            {!anuncio.activo ? <path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z" />
                                :
                                <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />}
                        </svg>
                        {/*  <button >
                            {anuncio.activo ? "Deshabilitar" : "Habilitar"}
                        </button> */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            className="v2-icon editarInput"
                            onClick={() => onEditar(anuncio)}>
                            <path d="M17.414 2.586a2 2 0 0 0-2.828 0L14 3.586 16.414 6l.586-.586a2 2 0 0 0 0-2.828zM2 15.586V18h2.414l11-11-2.414-2.414-11 11z" />
                        </svg>
                        {/* <button Editar</button> */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            className="v2-icon deleteInput"
                            onClick={() => onEliminar(anuncio.id)}
                        >
                            <path d="M5 3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v1h3a1 1 0 0 1 0 2h-1v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5H1a1 1 0 0 1 0-2h3V3zm1 0v1h8V3H6zm-1 3h10v12H5V6z" />
                        </svg>
                        {/* <button >Eliminar</button> */}
                    </div>
                )}
                <h3 className="v2-anuncio-title">{anuncio.cabecera}</h3>
            </div>

            <div className="v2-anuncio-body" dangerouslySetInnerHTML={{ __html: anuncio.descripcion }} />

            {
                anuncio.amedida && (
                    <div className="v2-anuncio-media-wrapper">
                        {anuncio.esVideo ? (
                            <video src={anuncio.amedida} controls />
                        ) : (
                            <img src={anuncio.amedida} onError={handleImageError} alt="Anuncio" onClick={() => { openModalImg(anuncio.amedida) }} />
                        )}
                    </div>
                )
            }

            <div className="v2-anuncio-footer">
                <span className='d-flex'> <img className="imgUserAnuncio shadow mr-1" src={imgAnuncio} /> {anuncio.organizador}</span>
            </div>

            <small className="v2-anuncio-fecha">
                Fecha publicación: {new Date(anuncio.fechaDesde).toLocaleString()}
            </small>

            <div className="v2-anuncio-comment" onClick={(e) => e.stopPropagation()}>
                <svg fill="#28bd06" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                    width="24px" height="24px" viewBox="0 0 483.789 483.789" onClick={() => onVerDetalle(anuncio)}>
                    <g>
                        <g>
                            <polygon points="434.77,405.332 465.895,405.332 465.895,122.667 329.895,122.667 329.895,280.288 329.895,293.333 
            316.073,293.333 167.228,293.333 167.228,405.332 361.895,405.332 361.895,483.789 		"/>
                            <path d="M17.895,280h30.88l73.12,79.973V280h45.333h149.333V122.667V0H17.895V280z M266.138,116.6
            c6.267,0,11.989,3.4,16.407,6.067c5.43,5.333,8.885,11.845,8.885,19.549c0,13.968-11.325,25.453-25.292,25.453
            c-13.968,0-25.294-11.565-25.294-25.533c0-7.701,3.453-14.133,8.886-19.467C254.145,120,259.867,116.6,266.138,116.6z
             M199.927,116.6c6.267,0,11.99,3.4,16.408,6.067c5.429,5.333,8.886,11.845,8.886,19.549c0,13.968-11.326,25.453-25.294,25.453
            c-13.968,0-25.293-11.565-25.293-25.533c0-7.701,3.454-14.133,8.886-19.467C187.937,120,193.66,116.6,199.927,116.6z
             M133.715,117.243c13.971,0,25.293,11.326,25.293,25.293c0,13.968-11.325,25.293-25.293,25.293
            c-13.968,0-25.293-11.325-25.293-25.293C108.422,128.565,119.748,117.243,133.715,117.243z M67.507,117.243
            c13.968,0,25.293,11.326,25.293,25.293c0,13.968-11.326,25.293-25.293,25.293c-13.971,0-25.293-11.325-25.293-25.293
            C42.214,128.565,53.538,117.243,67.507,117.243z"/>
                        </g>
                    </g>
                </svg>
                <span className="v2-comment-count">{anuncio.cantComentarios}</span>
            </div>

            <div className="v2-anuncio-like" onClick={(e) => e.stopPropagation()}>
                <svg
                    className="v2-like-icon"
                    viewBox="0 0 24 24"
                    onClick={() => onLike(anuncio.id)}
                >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
                  2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09 
                  C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 
                  22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                <span className="v2-like-count">{anuncio.likes}</span>
            </div>
        </div >
        }
        {modalOpenImg && (
            <div className="vi-modal-overlay" onClick={closeModalImg}>
                <div className="vi-modal-content shadow" onClick={e => e.stopPropagation()}>
                    <button className="vi-close-btn" onClick={closeModalImg}>&times;</button>
                    <img src={imgSelect ?? ""}
                        alt="Imagen Ampliada" />
                </div>
            </div>
        )}
    </>
};

export default AnunciosPanel;
