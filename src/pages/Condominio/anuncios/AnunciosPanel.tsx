import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import iconeditar from './../../../components/utils/img/editar.png';
import iconborrar from './../../../components/utils/img/iconborrar.png';
import { toast } from 'react-toastify';
import { AppDispatch, RootState } from "../../../store/store";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { fetchAnuncioCrear, fetchAnuncioEliminar, fetchAnuncioPorId, fetchAnuncios, fetchLike, setAnuncioEditar, setDataDetalle, setImgSelect, setLimpiarAnuncioCrear } from "../../../store/slices/anuncio/anuncioSlice"
import { ConfirmMessage } from '../../../components/utils/messages';
import iconAdmin from './../../../components/utils/img/admin.png';
import corazonVacio from './../../../components/utils/img/corazonVacio.png';
import { setCambiarMenu } from '../../../store/slices/comunidad/comunidadSlice';
import descargarIcon from './../../../components/utils/img/descargar.png';

interface Props {
}
const posicionAlertas = "bottom-left";
const imgErrorUrl = "https://media1.tenor.com/m/Ord0OyTim_wAAAAC/loading-windows11.gif";
const AnunciosPanel: React.FC<Props> = ({
}) => {
    const dispatch = useDispatch<AppDispatch>()
    const { dataDetalle, loading, dataFullParse, modalOpenImg, imgSelect, orden, criterio } = useSelector((state: RootState) => state.anuncio);
    const { usuario } = useSelector((state: RootState) => state.auth);
    /* useEffect(() => {
        dispatch(fetchAnuncios(localStorage.getItem("idCondominio")!.toString()));
    }, [dispatch]); */

    const onLike = (id: any) => {
        if (usuario.nombre.length > 0) {
            dispatch(fetchLike({ id, idUsuario: usuario.id, nombreUsuario: usuario.nombre }))
        }
    };
    const onEditar = (a: any) => {
        dispatch(setAnuncioEditar(a))
        dispatch(setCambiarMenu({ mostrar: "verEditarAnuncio", tipo: 4 } as any))
    }

    const onVerDetalle = (anuncio: any) => {
        dispatch(fetchAnuncioPorId(dataDetalle.id))
    }
    const onEliminar = (a: any) => {
        try {
            handleConfirmMessage(a)
        } catch (er) {
        }
    }
    const handleConfirmMessage = async (a: any) => {
        const msg: any = await ConfirmMessage(`Eliminar anuncio`, `¿Esta seguro de querer eliminar el anuncio?`);
        if (msg) {
            dispatch(fetchAnuncioEliminar(a))
        }
    }

    const ordenarListado = (data: any) => {
        return [...data].sort((a, b) => {
            const valorA = a[criterio];
            const valorB = b[criterio];

            if (criterio === 'cabecera') {
                return orden === 'asc'
                    ? valorA.localeCompare(valorB)
                    : valorB.localeCompare(valorA);
            }

            if (criterio === 'fechaDesde') {
                return orden === 'asc'
                    ? new Date(valorA).getTime() - new Date(valorB).getTime()
                    : new Date(valorB).getTime() - new Date(valorA).getTime();
            }

            return orden === 'asc' ? valorA - valorB : valorB - valorA;
        });
    };

    const normalizarAnuncio = (data: any) => {
        return {
            id: data.id ?? 0,
            idCondominio: localStorage.getItem("idCondominio"),
            cabecera: data.cabecera ?? "",
            descripcion: data.descripcion ?? "",
            organizador: usuario.nombre,
            telefono: data.telefono ?? "",
            amedida: data.amedida ?? "",
            fechaDesde: data.fechaDesde ?? new Date(),
            fechaHasta: data.fechaHasta ?? new Date(),
            idTipo: data.idTipo ?? 1,
            idUsuario: data.idUsuario === 0 ? usuario.id : data.idUsuario,
            activo: data.activo ?? true
        };
    };
    const normalizarDeshabilitarAnuncio = (data: any) => {
        return {
            id: data.id ?? 0,
            idCondominio: localStorage.getItem("idCondominio"),
            cabecera: data.cabecera ?? "",
            descripcion: data.descripcion ?? "",
            organizador: usuario.nombre,
            telefono: data.telefono ?? "",
            amedida: data.amedida ?? "",
            fechaDesde: data.fechaDesde ?? new Date(),
            fechaHasta: data.fechaHasta ?? new Date(),
            idTipo: data.idTipo ?? 1,
            idUsuario: data.idUsuario === 0 ? usuario.id : data.idUsuario,
            activo: !data.activo
        };
    };
    const DeshabilitarAnuncio = (e: any) => {
        try {
            dispatch(fetchAnuncioCrear(normalizarDeshabilitarAnuncio(e)))
        } catch (er) {
        }
    }

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        e.currentTarget.src = imgErrorUrl;
    };

    const openModalImg = (img: any) => {
        dispatch(setImgSelect({ img, mostrar: true }));
    }

    const closeModalImg = () => {
        dispatch(setImgSelect({ img: "", mostrar: false }));
    };

    return <>
        {!loading && dataFullParse !== null && ordenarListado(dataFullParse).map((a: any, i: any) => {
            return <div className={`v2-anuncio card-shadow col-10 col-md-3 my-3 mx-md-1 pb-5 ${a.idUsuario == usuario.id || usuario.rol === "ADMINISTRADOR" ? "pt-5" : "pt-4"}`}>
                <div className="v2-anuncio-header">
                    {(a.idUsuario == usuario.id || usuario.rol === "ADMINISTRADOR") && (
                        <div className="v2-anuncio-actions">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 -960 960 960"
                                className={"v2-icon verInput " + (a.activo ? "Deshabilitar" : "Habilitar")}
                                fill="currentColor"
                                onClick={() => DeshabilitarAnuncio(a)}
                            >
                                {!a.activo ? <path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z" />
                                    :
                                    <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />}
                            </svg>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                className="v2-icon editarInput"
                                onClick={() => onEditar(a)}>
                                <path d="M17.414 2.586a2 2 0 0 0-2.828 0L14 3.586 16.414 6l.586-.586a2 2 0 0 0 0-2.828zM2 15.586V18h2.414l11-11-2.414-2.414-11 11z" />
                            </svg>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                className="v2-icon deleteInput"
                                onClick={() => onEliminar(a.id)}
                            >
                                <path d="M5 3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v1h3a1 1 0 0 1 0 2h-1v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5H1a1 1 0 0 1 0-2h3V3zm1 0v1h8V3H6zm-1 3h10v12H5V6z" />
                            </svg>
                        </div>
                    )}
                    <h3 className="v2-anuncio-title">{a.cabecera}</h3>
                </div>

                <div className="v2-anuncio-body" dangerouslySetInnerHTML={{ __html: a.descripcion }} />

                {
                    a.amedida && (
                        <div className="v2-anuncio-media-wrapper">
                            {a.esVideo ? (
                                <video src={a.amedida} controls />
                            ) : (
                                <img src={a.amedida} onError={handleImageError} alt="Anuncio" onClick={() => { openModalImg(a.amedida) }} />
                            )}
                        </div>
                    )
                }

                <div className="v2-anuncio-footer">
                    <span className='d-flex'> <div className="divUserAnuncio shadow mr-1" style={{ background: `url(${a.imgOrganizador}) no-repeat center center/cover` }}></div> {a.organizador}
                        {a.rolOrganizador == "ADMINISTRADOR" && (
                            <img title='Administrador' alt='Administrador' className="imgUserAnuncio ml-1" src={iconAdmin} style={{ border: 'none' }} />
                        )}
                    </span>
                </div>

                <small className="v2-anuncio-fecha">
                    Fecha publicación: {new Date(a.fechaDesde).toLocaleString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                    })}
                </small>

                <div className="v2-anuncio-comment" onClick={(e) => e.stopPropagation()}>
                    <svg fill="#28bd06" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                        width="24px" height="24px" viewBox="0 0 483.789 483.789" onClick={() => { dispatch(fetchAnuncioPorId(a.id)); dispatch(setCambiarMenu({ mostrar: "verDetalle", tipo: 4 } as any)) }}>
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
                    <span className="v2-comment-count">{a.cantComentarios}</span>
                </div>

                <div className="v2-anuncio-like" onClick={(e) => e.stopPropagation()}>
                    {a.likes.find((e: any) => e.idUsuario == usuario.id) ?
                        <svg
                            className="v2-like-icon"
                            viewBox="0 0 24 24"
                            onClick={() => onLike(a.id)}
                        >
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
                  2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09 
                  C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 
                  22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                        :
                        <img src={corazonVacio} onClick={() => onLike(a.id)} />
                    }
                    <span className="v2-like-count">{a.likes.length}</span>
                </div>
                {modalOpenImg && (
                    <div className="vi-modal-overlay" onClick={closeModalImg}>
                        <div className="vi-modal-content shadow" onClick={e => e.stopPropagation()}>
                            <a title='Descargar imagen' download href={imgSelect} className='containerIconDescargarImg'><img className='iconDescargarImg' src={descargarIcon} /></a>
                            <button className="vi-close-btn" onClick={closeModalImg}>&times;</button>
                            <img src={imgSelect ?? ""}
                                alt="Imagen Ampliada" />
                        </div>
                    </div>
                )}
            </div >
        })
        }
    </>
};

export default AnunciosPanel;
