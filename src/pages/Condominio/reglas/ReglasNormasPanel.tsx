import React, { useState } from 'react';

interface Props {
    normas: string;
    editando: boolean;
    onChangeNormas: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onGuardar: () => void;
    onEditarToggle: () => void;
    onCancelar: () => void;
    loading?: boolean;
    puedeEditar: boolean;
    editorRef: any;
    handleInput: () => void;
    handleBlur: () => void;
    newTextRich: any;
}

const ReglasNormasPanel: React.FC<Props> = ({
    normas,
    editando,
    onChangeNormas,
    onGuardar,
    onEditarToggle,
    onCancelar,
    loading = false,
    puedeEditar,
    editorRef,
    handleInput,
    handleBlur,
    newTextRich
}) => {
    const [textRichEditado, setTextRichEditado] = useState(false);
    return (
        <div className="login-box py-3 px-3 ">
            <h4 className="mt-3 mb-4 text-center" style={{ fontSize: '1.7rem', fontWeight: '700' }}>Reglas y Normas</h4>
            <div className="containerReglas">
                {
                    !puedeEditar ?
                        <div
                            dangerouslySetInnerHTML={{ __html: normas }}
                        /> :
                        editando ?
                            <div
                                dangerouslySetInnerHTML={{ __html: normas }}
                            />
                            :
                            <div className="reglas-normas-panel">
                                <div
                                    className="rich-text-input"
                                    contentEditable
                                    ref={editorRef}
                                    onInput={() => setTextRichEditado(true)}
                                    onBlur={handleBlur}
                                    suppressContentEditableWarning={true}
                                    dangerouslySetInnerHTML={{ __html: newTextRich }}
                                    spellCheck={true}
                                    aria-label="Editor de texto enriquecido"
                                />
                                {textRichEditado ?
                                    <button type="button" className="search-button mt-2 w-100" onClick={onGuardar}>
                                        {loading ? "Guardando..." : "Guardar"}
                                    </button>
                                    : ""}
                                {textRichEditado ?
                                    <button type="button" className="search-button mt-2 w-100" onClick={onCancelar}>
                                        Descartar
                                    </button>
                                    : ""}
                            </div>
                }

            </div>
        </div>
    );
};

export default ReglasNormasPanel;
