import React, { useState } from 'react';

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
}

const VotacionPanel: React.FC<Props> = ({ votaciones, onCambiarEstado, onCambiarVoto, loading = false, usuario = "" }) => {
    return <>{!loading && <div className='row justify-content-around' style={{ fontFamily: 'Arial, sans-serif' }}>
        <h2 className="mt-3 mb-4 text-center col-12">VOTACIONES</h2>
        {votaciones.map((a: any, i: number) => {
            return (
                <div key={i} className="cardVotacion my-4 col-11 col-md-5 mx-md-2 shadow" style={!a.activo ? { opacity: '0.8' } : {}}>
                    {usuario.rol === "ADMINISTRADOR" && (
                        <label className="checkbox-container">
                            <input
                                type="checkbox"
                                checked={!!a.activo}
                                onChange={() => onCambiarEstado(a.id, !a.activo)}
                            />
                            <span className="checkmark"></span>
                        </label>
                    )}
                    <p className="text-center" style={{fontSize: '1.5rem', fontWeight: '600'}}>{a.cabecera}</p>
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
    </>
}

export default VotacionPanel;
