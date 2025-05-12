import React, { useState } from 'react';

interface Aviso {
    id: number;
    mensaje: string;
    fecha: string;
}

interface Props {
    avisos: Aviso[];
    mensaje: string;
    fecha: string;
    hora: string;
    onChangeMensaje: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onChangeFecha: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onChangeHora: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onCrear: () => void;
    onEliminar: (aviso: Aviso) => void;
    onEnviarNotificacion: (mensaje: string) => void;
    loading?: boolean;
}

const AvisoPanel: React.FC<Props> = ({
    avisos,
    mensaje,
    fecha,
    hora,
    onChangeMensaje,
    onChangeFecha,
    onChangeHora,
    onCrear,
    onEliminar,
    onEnviarNotificacion,
    loading = false
}) => {
    const [idEdit, setIdEdit] = useState<number | null>(null);

    const handleNotificar = (msg: string) => {
        if (window.confirm("¿Deseas enviar una notificación a todos los vecinos?")) {
            onEnviarNotificacion(msg);
        }
    };

    return (
        <div className="aviso-panel">
            <h3>Avisos del Día</h3>

            
        </div>
    );
};

export default AvisoPanel;
