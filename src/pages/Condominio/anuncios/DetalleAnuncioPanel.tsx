import React, { ChangeEventHandler } from 'react';
import iconborrar from './../../../components/utils/img/iconborrar.png'
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
    likes: number;
    comentarios: Comentario[];
    fechaDesde: Date;
    fechaHasta: Date;
}

interface Props {
    anuncio: AnuncioDetalle;
    comentario: string;
    onChangeComentario: (e: any) => void;
    onComentar: () => void;
    onLike: () => void;
    onCerrar: () => void;
    loading?: boolean;
    imgError: string;
    user: any;
    onEliminar: (id: number) => void
}

const DetalleAnuncioPanel: React.FC<Props> = ({
    anuncio,
    comentario,
    onChangeComentario,
    onComentar,
    onLike,
    onCerrar,
    loading = false,
    imgError,
    user,
    onEliminar
}) => {
    return <>{!loading &&
        <div className="mx-3">
            <h4 className="mt-3 mb-4 text-center" style={{ fontSize: '1.7rem', fontWeight: '700' }}>{anuncio.cabecera}</h4>
            <div className="anuncio-body" dangerouslySetInnerHTML={{ __html: anuncio.descripcion }} />
            <div className="anuncio-footer">
                <div className="anuncio-organizador">
                    <span>Creado por: </span>
                    <span className="ml-1">{anuncio.organizador}</span>
                </div>
                <span className="anuncio-telefono">{anuncio.telefono}</span>
            </div>
            {anuncio.amedida && anuncio.esVideo ?
                <div className="anuncio-img-wrapper">
                    <video id="videoAnuncio3" src={anuncio.amedida} controls width="300" />
                </div>
                : anuncio.amedida && !anuncio.esVideo ?
                    <div className="anuncio-img-wrapper">
                        <img id="imgAnuncio3" className="anuncio-img"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.onerror = null;
                                target.src = imgError;
                            }}
                            src={anuncio.amedida} alt="Foto" />
                    </div>
                    : ""
            }
            <div className="d-flex align-items-center w-100" style={{ justifyContent: 'space-between' }}>
                <small className="anuncio-fecha" style={{ position: 'relative', marginLeft: '20px', bottom: '0', fontSize: '12px' }}>
                    Fecha publicación: {new Date(anuncio.fechaDesde).toLocaleDateString() + " " + new Date(anuncio.fechaDesde).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                </small>
                <div className="anuncio-like" style={{ position: 'relative', marginRight: '20px', bottom: '0' }}>
                    <svg className="like-icon" viewBox="0 0 24 24" onClick={onLike}>
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
                     2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09 
                     C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 
                     22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    <span className="like-count">{anuncio.likes === 0 ? "" : anuncio.likes}</span>
                </div>
            </div>
            <div className="comments-container">
                <h2 className="comments-title">Comentarios</h2>
                {anuncio.comentarios ? anuncio.comentarios.map((j: any) => {
                    return <div key={j.id} className={`comment-box shadow ${j.idUsuario === user.id || user.rol === "ADMINISTRADOR" ? "pt-4" : ""}`}>
                        {(j.idUsuario === user.id || user.rol === "ADMINISTRADOR") && (
                            <button type="button" className="iconoVolver icon-deleteComentario" onClick={() => onEliminar(j.id)}>
                                <img width={20} height={20} src={iconborrar} />
                            </button>
                        )}
                        <div className="comment-header">
                            <span className="comment-author">{j.nombreUsuario}</span>
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
                    value={comentario}
                    onChange={(e: any) => onChangeComentario(e.target.value)}
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
