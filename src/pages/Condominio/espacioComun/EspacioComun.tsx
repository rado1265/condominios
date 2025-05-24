import React, { useState, useEffect } from 'react';
import iconeditar from './../../../components/utils/img/editar.png'
import iconborrar from './../../../components/utils/img/iconborrar.png'
import ListaEspacios from './ListaEspacios';
import HistorialReservas from './HistorialReservas';

interface Props {
    usuario: any;
}

const EspacioComun: React.FC<Props> = ({
    usuario
}) => {
    const [eleccion, setEleccion] = useState("");

    const changeEleccion = (e: any) => {
        const { name, value } = e.target;
        setEleccion(name);
    }
    const verEleccion = () => {
        switch (eleccion) {
            case "verEspacio":
                return <ListaEspacios onCancelar={() => setEleccion("")} />
            case "MisReservas":
                return <HistorialReservas usuario={usuario} onCancelar={() => setEleccion("")} />
            default: break;
        }
    }
    return eleccion === "" ? <>
        <div className="p-4 rounded mt-5 shadow col-md-8 mx-auto">

            <h3 className="font-bold text-center mb-md-3">Espacio Común</h3>

            <div style={{ display: 'grid' }}/* className="d-grid" */>
                {usuario.rol === "ADMINISTRADOR" && <button name="verEspacio" className="modal-btn modal-btn-green my-2" onClick={changeEleccion}>Ver Espacios Comunes</button>}
                <button name="MisReservas" className="modal-btn modal-btn-green my-2" onClick={changeEleccion}>{usuario.rol === "ADMINISTRADOR" ? "Ver Solicitudes" : "Mis Reservas"}</button>
            </div>
        </div>
    </> : <>
        {verEleccion()}
    </>
};

export default EspacioComun;
