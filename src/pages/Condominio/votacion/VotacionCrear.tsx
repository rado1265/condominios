import React, { useState } from 'react';
import iconmenos from './../../../components/utils/img/icon-menos.png';
type Opcion = {
    id: number;
    value: string;
};
interface Votacion {
    Id: number;
    Cabecera: string;
    Descripcion: string;
    Activo: boolean;
    OpcionesVotacion: Opcion[];
}

interface Props {
    onCrear: (cabecera: string, descripcion: string, opciones: Opcion[]) => void;
    loading?: boolean;
}

const VotacionCrear: React.FC<Props> = ({ onCrear, loading = false }) => {
    const [cabecera, setCabecera] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [options, setOptions] = useState<Opcion[]>([
        { id: 1, value: '' },
        { id: 2, value: '' },
    ]);
    const handleAddOption = () => {
        const newOption = {
            id: options.length + 1,
            value: '',
        };
        setOptions([...options, newOption]);
    };

    const crearVotacion = () => {
        if (cabecera && options.length >= 2) {
            onCrear(cabecera, descripcion, options);
            setCabecera('');
            setDescripcion('');
            setOptions([
                { id: 1, value: '' },
                { id: 2, value: '' },
            ]);
        } else {
            alert('Debe agregar al menos 2 opciones y un título.');
        }
    };
    const handleOptionChange = (id: number, value: string) => {
        const updatedOptions = options.map(opt =>
            opt.id === id ? { ...opt, value } : opt
        );
        setOptions(updatedOptions);
    };


    const handleRemoveOption = (id: number) => {
        const filteredOptions = options.filter(opt => opt.id !== id);
        setOptions(filteredOptions);
        //setShowAddButton(true);
    };

    return (
        <div key={1} className="w-100 mt-4" style={{ maxWidth: '700px', margin: '0 auto' }}>
            <div className="survey-creator-container">
                <h2 className="creator-title">Creador de Votaciones</h2>

                <div className="input-group">
                    <label className="h4" htmlFor="question">Pregunta:</label>
                    <textarea
                        id="question"
                        value={cabecera}
                        onChange={(e) => setCabecera(e.target.value)}
                        placeholder="Escribe tu pregunta aquí..."
                        rows={2}
                    />
                </div>
                <div className="input-group">
                    <label className="h4" htmlFor="question">Descripción:</label>
                    <textarea
                        id="question"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        placeholder="Escribe tu descripción aquí..."
                        rows={2}
                    />
                </div>
                <div className="options-section">
                    <h4>Opciones de respuesta:</h4>
                    {options.map((option, index) => (
                        <div id={option.id.toString()} className="option-item">
                            <input
                                id={index.toString()}
                                type="text"
                                value={option.value}
                                onChange={(e) => handleOptionChange(option.id, e.target.value)}
                                placeholder={`Opción ${index + 1}`}
                            />
                            {options.length > 2 && (
                                <button
                                    className="remove-option"
                                    onClick={() => handleRemoveOption(option.id)}
                                    aria-label="Eliminar opción"
                                >
                                    <img width={25} src={iconmenos} alt="icono de eliminar" />
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        className="add-option"
                        onClick={handleAddOption}
                    >
                        + Añadir opción
                    </button>
                </div>

                <button className="modal-btn modal-btn-green w-100 mt-3" onClick={() => crearVotacion()}>Crear Encuesta</button>

            </div>

        </div>
    );
};

export default VotacionCrear;
