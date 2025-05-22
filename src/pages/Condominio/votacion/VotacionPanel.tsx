import React, { useEffect, useState } from 'react';
import iconList from '../../../components/utils/img/menuInferior/list.png';

interface Opcion {
    Descripcion: string;
    IdVotacion: number;
}

interface Votacion {
    Id: number;
    Cabecera: string;
    Descripcion: string;
    Activo: boolean;
    OpcionesVotacion: Opcion[];
}

interface Props {
    votaciones: any;/* Votacion[]; */
    onCambiarEstado: (idVotacion: number, activo: boolean) => void;
    loading?: boolean;
    usuario?: any;
    onCambiarVoto: (e: any) => void;
    arrayImgUsers: any[];
}

const VotacionPanel: React.FC<Props> = ({ votaciones, onCambiarEstado, onCambiarVoto, loading = false, usuario = "", arrayImgUsers }) => {
    const [verListadoVotantes, setVerListadoVotantes] = useState(false);
    const [dataListado, setDataListado] = useState([]);

    useEffect(() => {
        if (dataListado) {
            dataListado.map((b: any, o: number) => {
                if (b.votaciones) {
                    b.votaciones.map((p: any) => {
                        const matchArchivo = arrayImgUsers.find((b: any) => b.nombre === p.imgUsuario);
                        if (matchArchivo) {
                            p.imgUsuari = matchArchivo.url;
                        } else if (p.imgUsuario && p.imgUsuario.includes("https")) {
                            p.imgUsuario = p.imgUsuario;
                        }
                    })
                }
            })
        }
    }, [dataListado])

    return <>{!loading && <div className='row justify-content-around' style={{ fontFamily: 'Arial, sans-serif' }}>
        <h2 className="mt-3 mb-4 text-center col-12">VOTACIONES</h2>
        {votaciones.map((a: any, i: number) => {
            return (
                <div key={i} className="cardVotacion my-4 col-11 col-md-5 mx-md-2 shadow" style={!a.activo ? { opacity: '0.8' } : {}}>
                    {usuario.rol === "ADMINISTRADOR" && (
                        <div className='d-flex justify-content-between align-items-center'>
                            <img src={iconList} className='c-pointer' alt='Listado Votos' title='Listado Votos' onClick={() => { setVerListadoVotantes(true); setDataListado(a.opcionesVotacion) }} />
                            <label className="checkbox-container">
                                <input
                                    type="checkbox"
                                    checked={!!a.activo}
                                    onChange={() => onCambiarEstado(a.id, !a.activo)}
                                />
                                <span className="checkmark"></span>
                            </label>
                        </div>
                    )}
                    <p className="text-center" style={{ fontSize: '1.5rem', fontWeight: '600' }}>{a.cabecera}</p>
                    <span className="mb-3 text-center d-block">{a.descripcion}</span>

                    {a.opcionesVotacion.map((b: any, o: number) => {
                        let percentage = a.total && b.votaciones.length ? (b.votaciones.length / a.total) * 100 : 0;
                        return (<div key={o} style={{ marginBottom: '10px' }}>
                            <div className="d-flex" style={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                <span>{b.descripcion}</span>
                                <small style={{ color: 'grey' }}>{b.votaciones.length} votos</small>
                            </div>
                            <div className={!a.activo ? "disabled-click" : "c-pointer"} id={b.id} style={{ background: '#ddd', height: '25px', width: '100%', borderRadius: '5px', marginTop: '5px' }} onClick={(ev) => { onCambiarVoto(ev); }}>
                                <div style={{ background: '#4caf50', height: '100%', width: `${percentage}%`, borderRadius: '5px', textAlign: 'center' }}>
                                    {b.votaciones.find((votacion: any) => votacion.idUsuario === usuario.id) ?
                                        <span style={{ color: 'white', display: 'block', width: '55px', margin: '0 auto' }}>Votado</span>
                                        : ""}
                                </div>
                            </div>
                        </div>);
                    })}
                </div>
            );
        })}
    </div>
    }
        <div className={`modal-overlay ${verListadoVotantes ? "" : "d-none"}`}>
            <div className="modal-content">
                <h4 className="modal-title w-75 mx-auto">Listado Votos</h4>
                <div className='containerListado'>
                    {dataListado.map((b: any, o: number) => {
                        return (
                            <div>
                                <h5>{b.descripcion}</h5>
                                {b.votaciones && (b.votaciones.map((p: any) => {
                                    return (
                                        <li key={o} style={{ marginBottom: '10px' }}>
                                            <img className="imgUserAnuncio shadow mr-2" src={p.imgUsuario} />
                                            {p.nombreUsuario}
                                        </li>)
                                })
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="modal-actions">
                    <button className="modal-btn modal-btn-green" onClick={() => { setVerListadoVotantes(false); setDataListado([]); }}>
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    </>
}

export default VotacionPanel;
