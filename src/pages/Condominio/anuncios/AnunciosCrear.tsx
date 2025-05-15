import React, { useState, useEffect } from 'react';

interface Anuncio {
    id: number;
    cabecera: string;
    descripcion: string;
    telefono: string;
    amedida: string;
    organizador: string;
    fechaDesde: Date;
    fechaHasta: Date;
    idTipo: number;
    esVideo: boolean;
    idUsuario: number;
    activo: boolean;
    idCondominio: any;
}

interface Props {
    anuncio?: Anuncio; // null para nuevo, lleno para editar
    onGuardar: (anuncio: Anuncio, archivoAdjunto: File | null) => void;
    onCancelar: () => void;
    usuario: any;
}

const AnunciosCrear: React.FC<Props> = ({ anuncio, usuario, onGuardar, onCancelar }) => {
    const [form, setForm] = useState<Anuncio>({
        id: 0,
        cabecera: '',
        descripcion: '',
        telefono: '',
        organizador: usuario.nombre,
        amedida: '',
        fechaDesde: new Date(),
        fechaHasta: new Date(),
        idTipo: 1,
        esVideo: false,
        ...(anuncio || {}),
        idCondominio: localStorage.getItem("idCondominio"),
        idUsuario: usuario.id,
        activo: true,
    });
    console.log(form, usuario, anuncio)
    const [archivo, setArchivo] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        if (anuncio != null && anuncio?.id > 0) {
            setForm(anuncio)
        }
    }, [anuncio])
    useEffect(() => {
        if (archivo) {
            const url = URL.createObjectURL(archivo);
            setPreview(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setPreview(null);
        }
    }, [archivo]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleArchivo = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setArchivo(file);
            const esVideo = /\.(mp4|webm|ogg|mov|avi|mkv)$/i.test(file.name);
            setForm(prev => ({
                ...prev,
                amedida: file.name,
                esVideo
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onGuardar(form, archivo);
    };
    
    return (
        <form onSubmit={handleSubmit} className="anuncio-form">
            <h2 className="mb-4 text-center">{anuncio != null && anuncio.id > 0 ? 'Editar Anuncio' : 'Nuevo Anuncio'}</h2>
            <div className="login-box py-3 px-3" style={{ boxShadow: '0 0 0 1px #e5e5e5', borderRadius: '10px' }}>
                <label htmlFor="textfield" className="search-label-admin">
                    Cabecera
                </label>
                <input
                    type="text"
                    name="cabecera"
                    className="search-input"
                    value={form.cabecera}
                    onChange={handleChange}
                />
                <label htmlFor="textfield" className="search-label-admin">
                    Descripción
                </label>
                <textarea
                    rows={4}
                    cols={50}
                    name="descripcion"
                    className="search-input"
                    value={form.descripcion}
                    onChange={handleChange}
                />
                <label htmlFor="textfield" className="search-label-admin">
                    Organizador
                </label>
                <input
                    type="text"
                    name="organizador"
                    className="search-input"
                    value={form.organizador}
                    disabled
                    onChange={handleChange}
                />
                <label htmlFor="textfield" className="search-label-admin">
                    Teléfono
                </label>
                <input
                    type="text"
                    name="telefono"
                    className="search-input"
                    value={form.telefono}
                    onChange={handleChange}
                />
                <label htmlFor="textfield" className="search-label-admin mt-3">
                    Fecha Hasta
                </label>
                <input
                    type="date"
                    name="fechaHasta"
                    className="typeDate"
                    value={form.fechaHasta ? form.fechaHasta.toString().substring(0, 10) : ''}
                    onChange={handleChange}
                    style={{ padding: '8px', fontSize: '16px' }}
                />

                <label>Imagen o Video</label>
                <input type="file" accept="image/*,video/*" onChange={handleArchivo} />

                {preview && (
                    form.esVideo ? (
                        <video src={preview} controls width={300} />
                    ) : (
                        <img src={preview} alt="Preview" width={300} />
                    )
                )}
                <label htmlFor="textfield" className="search-label mt-3">
                    Tipo
                </label>
                <select id="miCombo" value={form.idTipo} className="typeDate" name="idTipo" onChange={handleChange}>
                    <option value="1">Anuncio</option>
                    <option value="0">Ventas</option>
                    <option value="2">Recordatorio</option>
                </select>

                {/*<div className="form-actions">
                    <button
                        type="submit"
                        className="search-button mt-2"
                    >
                        {anuncio != null && anuncio.id > 0 ? "Editar" : "Crear"}
                    </button>
                    <button type="button" className="search-button mt-2" onClick={onCancelar}>Cancelar</button>
                </div>*/}

                <div className="modal-actions">
                    <button type="submit" className="modal-btn modal-btn-green">{anuncio != null && anuncio.id > 0 ? "Editar" : "Crear"}</button>
                    <button className="modal-btn modal-btn-close" onClick={onCancelar}>Cancelar</button>
                </div>
            </div>
        </form>
    );
};

export default AnunciosCrear;
