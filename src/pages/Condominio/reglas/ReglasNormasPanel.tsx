import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import iconeditar from './../../../components/utils/img/editar.png';
import iconborrar from './../../../components/utils/img/iconborrar.png';
import { ConfirmMessage } from '../../../components/utils/messages';
import { toast } from 'react-toastify';
import { AppDispatch, RootState } from "../../../store/store";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { fetchCambiarNormas, setCambiarMenu, setEditadoNormas, setEditarNormas, setNuevaNorma } from "../../../store/slices/comunidad/comunidadSlice"
interface Props {
}

const ReglasNormasPanel: React.FC<Props> = ({
}) => {
    const dispatch = useDispatch<AppDispatch>()
    const { nuevaNorma, comunidad, editarNormas, editadoNormas, loading } = useSelector((state: RootState) => state.comunidad);
    const { usuario } = useSelector((state: RootState) => state.auth);
    const editorRef = useRef<HTMLDivElement>(null);
    const handleInput = () => {
        //setNewTextRich(ev.target.children[0].outerHTML);
        /* setTextRichEditado(true); */
    };
    const handleBlur = () => {
        if (editorRef.current) {
            dispatch(setNuevaNorma(editorRef.current.innerHTML as any))
        }
    };
    console.log(comunidad.normas)
    return (
        <div className="login-box py-3 px-3 ">
            <h4 className="mt-3 mb-4 text-center" style={{ fontSize: '1.7rem', fontWeight: '700' }}>Reglas y Normas</h4>
            <div className="containerReglas">
                {
                    usuario.rol != "ADMINISTRADOR" ?
                        <div
                            dangerouslySetInnerHTML={{ __html: comunidad.normas }}
                        /> :
                        editarNormas ?
                            <div
                                dangerouslySetInnerHTML={{ __html: comunidad.normas }}
                            />
                            :
                            <div className="reglas-normas-panel">
                                <div
                                    className="rich-text-input"
                                    contentEditable
                                    ref={editorRef}
                                    onInput={() => dispatch(setEditadoNormas(true as any))}
                                    onBlur={handleBlur}
                                    suppressContentEditableWarning={true}
                                    dangerouslySetInnerHTML={{ __html: nuevaNorma }}
                                    spellCheck={true}
                                    aria-label="Editor de texto enriquecido"
                                />
                                <button type="button" className="modal-btn modal-btn-green mt-2 w-100" onClick={() => { dispatch(fetchCambiarNormas({ idCondominio: comunidad.id, normas: nuevaNorma })); dispatch(setCambiarMenu({ mostrar: "verAvisos", tipo: 4 } as any)) }}>
                                    {loading ? "Guardando..." : "Guardar"}
                                </button>
                                <button className="modal-btn modal-btn-close w-100 mt-3" onClick={() => { dispatch(setEditarNormas(false as any)); dispatch(setCambiarMenu({ mostrar: "verAvisos", tipo: 4 } as any)) }}>Descartar</button>
                            </div>
                }

            </div>
        </div>
    );
};

export default ReglasNormasPanel;
