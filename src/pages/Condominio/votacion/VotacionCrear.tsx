// VotacionCrear.tsx (migrado a Redux)
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import iconmenos from './../../../components/utils/img/icon-menos.png';
import { AppDispatch, RootState } from '../../../store/store';
import { crearVotacionAsync, resetVotacionCreacion } from "../../../store/slices/votacion/crearVotacionesSlice";

interface Props {
}

const posicionAlertas = 'bottom-left';

const VotacionCrear: React.FC<Props> = ({  }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error } = useSelector((state: RootState) => state.crearVotaciones);
    const { usuario } = useSelector((state: RootState) => state.auth);
    const [cabecera, setCabecera] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [options, setOptions] = useState([
        { id: 1, value: '' },
        { id: 2, value: '' },
    ]);

    const handleAddOption = () => {
        const newOption = { id: options.length + 1, value: '' };
        setOptions([...options, newOption]);
    };

    const handleOptionChange = (id: number, value: string) => {
        setOptions(options.map(opt => (opt.id === id ? { ...opt, value } : opt)));
    };

    const handleRemoveOption = (id: number) => {
        setOptions(options.filter(opt => opt.id !== id));
    };

    const crearVotacion = () => {
        if (!cabecera || options.length < 2) {
            toast.error('Debe agregar al menos 2 opciones y un título.', {
                position: posicionAlertas,
            });
            return;
        }

        const _opciones = options.map(opt => ({ Descripcion: opt.value, IdVotacion: 0 }));

        const votacion: any = {
            Id: 0,
            Cabecera: cabecera,
            Descripcion: descripcion,
            Activo: true,
            IdUsuario: usuario.id,
            IdCondominio: localStorage.getItem('idCondominio') || '',
            OpcionesVotacion: _opciones,
        };

        dispatch(crearVotacionAsync(votacion))
            .unwrap()
            .then(() => {
                toast.success('Votación creada correctamente.', {
                    position: posicionAlertas,
                });
                setCabecera('');
                setDescripcion('');
                setOptions([
                    { id: 1, value: '' },
                    { id: 2, value: '' },
                ]);
                dispatch(resetVotacionCreacion());
            })
            .catch(() => {
                toast.error('Error al crear votación. Comuníquese con el Administrador.', {
                    position: posicionAlertas,
                });
            });
    };

    return (
        <div className="col-12 mt-4">
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
                    <label className="h4" htmlFor="descripcion">Descripción:</label>
                    <textarea
                        id="descripcion"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        placeholder="Escribe tu descripción aquí..."
                        rows={2}
                    />
                </div>

                <div className="options-section">
                    <h4>Opciones de respuesta:</h4>
                    {options.map((option, index) => (
                        <div key={option.id} className="option-item">
                            <input
                                type="text"
                                className="w-100"
                                value={option.value}
                                onChange={(e) => handleOptionChange(option.id, e.target.value)}
                                placeholder={`Opción ${index + 1}`}
                            />
                            {options.length > 2 && (
                                <button
                                    className="remove-option"
                                    onClick={() => handleRemoveOption(option.id)}
                                >
                                    <img width={25} src={iconmenos} alt="icono de eliminar" />
                                </button>
                            )}
                        </div>
                    ))}
                    <button className="add-option" onClick={handleAddOption}>
                        + Añadir opción
                    </button>
                </div>

                <button
                    className="modal-btn modal-btn-green w-100 mt-3"
                    onClick={crearVotacion}
                    disabled={loading}
                >
                    {loading ? 'Creando...' : 'Crear Encuesta'}
                </button>
            </div>
        </div>
    );
};

export default VotacionCrear;
