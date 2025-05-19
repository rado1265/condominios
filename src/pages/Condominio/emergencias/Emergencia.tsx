import React, { useState, useEffect } from 'react';
import iconeditar from './../../../components/utils/img/editar.png'
import iconborrar from './../../../components/utils/img/iconborrar.png'
interface Emergencia {
    id: number;
    descripcion: string;
    telefono: string;
    direccion: string;
}

interface Props {
    emergencia: Emergencia;
    emergencias: Emergencia[];
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onGuardar: () => void;
    onEliminar: () => void;
    onCancelar: () => void;
    loading?: boolean;
    rolUsuario?: string;
    onSelect: (e: any) => void;
    modoEdicion: boolean;
}

const Emergencia: React.FC<Props> = ({
    emergencia,
    emergencias,
    onChange,
    onGuardar,
    onEliminar,
    onCancelar,
    onSelect,
    loading = false,
    rolUsuario,
    modoEdicion = false
}) => {
    return (
        <form onSubmit={(e) => { e.preventDefault(); onGuardar(); }} className='w-100'>
            {modoEdicion ?
                <div className="w-100 px-3">
                    <div className="login-box py-3">
                        <h4 className="mt-3 text-center">Crear número de emergencia</h4>
                        <label htmlFor="textfield" className="search-label-admin">
                            Descripción
                        </label>
                        <input
                            name="descripcion"
                            className="search-input"
                            value={emergencia.descripcion}
                            onChange={onChange}
                        />
                        <label htmlFor="textfield" className="search-label-admin" defaultValue={""}>
                            Dirección
                        </label>
                        <input
                            name="direccion"
                            className="search-input"
                            value={emergencia.direccion}
                            onChange={onChange}
                        />
                        <label htmlFor="textfield" className="search-label-admin">
                            Teléfono
                        </label>
                        <input
                            name="telefono"
                            className="search-input"
                            value={emergencia.telefono}
                            onChange={onChange}
                        />
                        <div className="modal-actions">
                            <button type="submit" className="modal-btn modal-btn-green" disabled={loading}>
                                {loading ? 'Guardando...' : 'Guardar'}
                            </button>
                            <button type="button" className="modal-btn modal-btn-close" onClick={onCancelar}>Cancelar</button>
                        </div>
                    </div>
                </div>
                :
                <div className="w-100 login-box py-3">
                    <h3 style={{ textAlign: 'center' }}>Números de Emergencia</h3>
                    <div className="login-box py-3">
                        {
                            emergencias.map((e: any) => {
                                return (
                                    <div className="container-emergencia shadow">
                                        <span><strong>{e.descripcion}</strong></span><br />
                                        <span>{e.direccion}</span>
                                        <a href={`tel:${e.telefono}`} className="d-block">{e.telefono}</a>
                                        {
                                            rolUsuario === "ADMINISTRADOR" &&
                                            <>
                                                {/*<span className="d-block">{e.telefono}</span>*/}

                                                <button type="button" className="iconoVolver" style={{ marginTop: '-75px', float: 'right' }} onClick={() => onSelect(e)}>
                                                    <img src={iconeditar} />
                                                </button>
                                                <button type="button" className="iconoVolver" style={{ marginTop: '-30px', float: 'right' }} onClick={onEliminar}>
                                                    <img src={iconborrar} />
                                                </button>
                                            </>
                                        }
                                    </div>
                                )
                            })
                        }
                        {
                            rolUsuario === "ADMINISTRADOR" &&
                            <button type="button" className="modal-btn modal-btn-green mt-2" onClick={() => {
                                onSelect({
                                    id: 0,
                                    descripcion: '',
                                    telefono: '',
                                    idcondominio: 0,
                                    direccion: ''
                                })
                            }}>
                                Crear número de emergencia
                            </button>
                        }
                    </div>
                </div >
            }
        </form>
    );
};

export default Emergencia;
