import React, { ChangeEventHandler, useEffect, useState } from 'react';
import iconborrar from './../../../components/utils/img/iconborrar.png'
import iconvolver from './../../../components/utils/img/volver.png'
import volverWhite from './../../../components/utils/img/volverWhite.png'
import corazonVacio from '../../../components/utils/img/corazonVacio.png';
import { useDispatch, useSelector } from 'react-redux';
import { ConfirmMessage } from '../../../components/utils/messages';
import { toast } from 'react-toastify';
import { AppDispatch, RootState } from "../../../store/store";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { fetchAnuncioEliminar, fetchAnuncioPorId, fetchComentarioCrear, fetchLike, setNewComentario } from "../../../store/slices/anuncio/anuncioSlice";
import { setCambiarMenu } from '../../../store/slices/comunidad/comunidadSlice';

interface Comentario {
    id: number;
    descripcion: string;
    nombre: string;
    fecha: string;
}

interface AnuncioDetalle {
    id: any;
    cabecera: string;
    descripcion: string;
    organizador: string;
    telefono: string;
    amedida: string;
    esVideo: boolean;
    likes: any;
    comentarios: Comentario[];
    fechaDesde: Date;
    fechaHasta: Date;
    imgOrganizador: string;
}

interface Props {
}
const imgError = "https://media1.tenor.com/m/Ord0OyTim_wAAAAC/loading-windows11.gif";
const DetalleAnuncioPanel: React.FC<Props> = ({
}) => {
    const dispatch = useDispatch<AppDispatch>()
    const { dataDetalle, loading, newComentario } = useSelector((state: RootState) => state.anuncio);
    const { usuario } = useSelector((state: RootState) => state.auth);
    const onLike = async (id: any) => {
        if (usuario.nombre.length > 0) {
            const result = await dispatch(fetchLike({ id, idUsuario: usuario.id, nombreUsuario: usuario.nombre }))

            if (fetchLike.fulfilled.match(result)) {
                dispatch(fetchAnuncioPorId(dataDetalle.id))
            } else {
                dispatch(fetchAnuncioPorId(dataDetalle.id))
            }
        }
    };
    const onEliminar = (a: any) => {
        try {
            handleConfirmMessage(a)
        } catch (er) {
        }
    }
    const handleConfirmMessage = async (a: any) => {
        const msg: any = await ConfirmMessage(`Eliminar anuncio`, `¿Esta seguro de querer eliminar el anuncio?`);
        if (msg) {
            dispatch(fetchComentarioCrear({
                comentario: a, idCondominio: localStorage.getItem("idCondominio")!.toString(), eliminar: true
            }))
        }
    }
    const onComentar = () => {
        if (newComentario.trim()) {
            dispatch(fetchComentarioCrear({
                comentario: {
                    Id: 0,
                    IdUsuario: usuario.id,
                    NombreUsuario: usuario.nombre,
                    IdAnuncio: dataDetalle.id,
                    Mensaje: newComentario,
                    Fecha: new Date()
                }, idCondominio: localStorage.getItem("idCondominio")!.toString(), eliminar: false
            }));
        }
    }
    return <>{!loading &&
        <div className="mx-3">
            <button type="button" className="iconoVolver volverPublicaciones mb-4 mt-2" onClick={() => dispatch(setCambiarMenu({ mostrar: "verPublicacion", tipo: 4 } as any))}>
                <img width={30} height={30} src={volverWhite} style={{ marginRight: '10px' }} />
                Volver a publicaciones
            </button>
            <h4 className="mt-3 mb-4 text-center" style={{ fontSize: '1.7rem', fontWeight: '700' }}>{dataDetalle.cabecera}</h4>
            <div className="anuncio-body" dangerouslySetInnerHTML={{ __html: dataDetalle.descripcion }} />
            <div className="anuncio-footer">
                <div className="anuncio-organizador">
                    <div className="divUserAnuncio shadow" style={{background: `url(${dataDetalle.imgOrganizador}) no-repeat center center/cover`}}></div>
                    <span className="ml-1">{dataDetalle.organizador}</span>
                </div>
                <span className="anuncio-telefono">{dataDetalle.telefono}</span>
            </div>
            {dataDetalle.amedida && dataDetalle.esVideo ?
                <div className="anuncio-img-wrapper">
                    <video id="videoAnuncio3" src={dataDetalle.amedida} controls width="300" />
                </div>
                : dataDetalle.amedida && !dataDetalle.esVideo ?
                    <div className="anuncio-img-wrapper">
                        <img id="imgAnuncio3" className="anuncio-img"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.onerror = null;
                                target.src = imgError;
                            }}
                            src={dataDetalle.amedida} alt="Foto" />
                    </div>
                    : ""
            }
            <div className="d-flex align-items-center w-100" style={{ justifyContent: 'space-between' }}>
                <small className="anuncio-fecha" style={{ position: 'relative', marginLeft: '20px', bottom: '0', fontSize: '12px' }}>
                    Fecha publicación: {new Date(dataDetalle.fechaDesde).toLocaleDateString() + " " + new Date(dataDetalle.fechaDesde).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                </small>
                <div className="anuncio-like" style={{ position: 'relative', marginRight: '20px', bottom: '0' }} onClick={(e) => e.stopPropagation()}>
                    {dataDetalle.likes.find((e: any) => e.idUsuario == usuario.id) ?
                        <svg
                            className="v2-like-icon"
                            viewBox="0 0 24 24"
                            onClick={() => onLike(dataDetalle.id)}
                        >
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
                  2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09 
                  C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 
                  22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                        :
                        <img src={corazonVacio} onClick={() => onLike(dataDetalle.id)} />
                    }
                    <span className="like-count">{dataDetalle.likes.length}</span>
                </div>
            </div>
            <div className="comments-container">
                <h2 className="comments-title">Comentarios</h2>
                {dataDetalle.comentarios ? dataDetalle.comentarios.map((j: any) => {
                    return <div key={j.id} className={`comment-box shadow ${j.idUsuario === usuario.id || usuario.rol === "ADMINISTRADOR" ? "pt-4" : ""}`}>
                        {(j.idUsuario === usuario.id || usuario.rol === "ADMINISTRADOR") && (
                            <button type="button" className="iconoVolver icon-deleteComentario" onClick={() => onEliminar(j)}>
                                <img width={20} height={20} src={iconborrar} />
                            </button>
                        )}
                        <div className="comment-header">
                            <span className="comment-author"><div className="divUserAnuncio shadow mr-1" style={{background: `url(${j.imgUsuario}) no-repeat center center/cover`}}></div>{j.nombreUsuario}</span>
                            <div>
                                <span className="comment-date">{new Date(j.fecha).toLocaleDateString()}</span>
                                <span className="comment-date ml-2">{new Date(j.fecha).toLocaleTimeString().split(":").slice(0, 2).join(":")}</span>
                            </div>
                        </div>
                        <p className="comment-content">{j.mensaje}</p>
                    </div>
                }) : ""}
                <textarea
                    className="comment-textarea shadow"
                    placeholder="Escribe tu comentario..."
                    value={newComentario}
                    onChange={(e: any) => dispatch(setNewComentario(e.target.value))}
                    rows={3}
                    maxLength={500}
                />
                <button
                    type="button"
                    className="modal-btn modal-btn-green w-100 mt-1"
                    onClick={onComentar}
                >
                    Publicar comentario
                </button>
            </div>
        </div>
    }
    </>
};

export default DetalleAnuncioPanel;
