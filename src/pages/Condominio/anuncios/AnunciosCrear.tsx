import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

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
    crear: boolean;
    editar: boolean;
    imgError: string;
}

const AnunciosCrear: React.FC<Props> = ({ anuncio, usuario, onGuardar, onCancelar, crear, editar, imgError }) => {
    const [form, setForm] = useState<Anuncio>({
        id: 0,
        cabecera: '',
        descripcion: '',
        telefono: '',
        organizador: usuario.nombre,
        amedida: '',
        fechaDesde: new Date(),
        fechaHasta: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        idTipo: 1,
        esVideo: false,
        ...(anuncio || {}),
        idCondominio: localStorage.getItem("idCondominio"),
        idUsuario: usuario.id,
        activo: true,
    });
    /* const [archivo, setArchivo] = useState<File | null>(null); */
    const [preview, setPreview] = useState<string | null>(null);
    const [tipoSubir, setTipoSubir] = useState(1);
    const [archivoTemp, setArchivoTemp] = useState<File | null>(null);
    console.log(usuario)
    useEffect(() => {
        if (anuncio != null && anuncio?.id > 0) {
            setForm(anuncio)
        }
    }, [anuncio])
    /* useEffect(() => {
        setForm(prev => ({
            ...prev,
            ["telefono"]: usuario.telefono
        }));
    }, []) */
    useEffect(() => {
        if (archivoTemp) {
            const url = URL.createObjectURL(archivoTemp);
            setPreview(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setPreview(null);
        }
    }, [archivoTemp]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    /* const handleArchivo = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    }; */

    const uploadVideo = (files: any) => {
        const file = files[0];
        setArchivoTemp(file);

        if (!file) return;

        /*setAnuncio(prev => ({
            ...prev,
            // eslint-disable-next-line
            ["amedida"]: 'video-' + file.name
        }));*/

        document.getElementById('containerViewVideo')?.classList.remove("d-none");

        const videoPreview = document.getElementById('visualizadorVideo') as HTMLVideoElement;
        if (videoPreview) {
            const videoURL = URL.createObjectURL(file);
            videoPreview.src = videoURL;
            videoPreview.load();
        }
    };

    const handleImage = (files: any) => {
        if (files.target.files.length === 0) return;
        //const file = files.target.files[0];

        setArchivoTemp(files.target.files[0]);

        document.getElementById('containerViewImg')?.classList.remove("d-none");

        const img = document.getElementById('visualizadorImg') as HTMLImageElement | null;
        if (img) {
            img.src = URL.createObjectURL(files.target.files[0]);
        }

        /*const reader = new FileReader();

        reader.onloadend = async () => {
            if (!reader.result || typeof reader.result !== 'string') {
                return;
            }

         const base64 = reader.result.split(',')[1];

            const body = {
                requests: [
                    {
                        image: { content: base64 },
                        features: [{ type: 'SAFE_SEARCH_DETECTION' }],
                    },
                ],
            };

            try {
                const response = await axios.post(
                    `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`,
                    body
                );
                const safeSearch = response.data.responses[0].safeSearchAnnotation;
                console.log(response.data.responses[0]);
                if (safeSearch.adult === "VERY_LIKELY" || safeSearch.adult === 'LIKELY') {
                    toast.error('La imagen contiene posiblemente contenido para adultos. Se enviará a su revisión', {
                        position: posicionAlertas,
                    });
                }
            } catch (err) {

            } finally {

            } 
        };

        reader.readAsDataURL(file);*/
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onGuardar(form, archivoTemp);
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
                    value={usuario.nombre/* form.organizador */}
                    disabled
                />
                {/* <label htmlFor="textfield" className="search-label-admin">
                    Teléfono
                </label>
                <input
                    type="text"
                    name="telefono"
                    className="search-input"
                    value={form.telefono}
                    onChange={handleChange}
                /> */}
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

                {/* <label>Imagen o Video</label>
                <input type="file" accept="image/*,video/*" onChange={handleArchivo} />

                {preview && (
                    form.esVideo ? (
                        <video src={preview} controls width={300} />
                    ) : (
                        <img src={preview} alt="Preview" width={300} />
                    )
                )} */}
                {/* //////////////////////////////////////////////////////////////////////////// */}

                {(crear || (!crear && !form.amedida)) && (
                    <div>
                        <label>Subir archivo</label>
                        <div className="radio-group">
                            <label className="radio-label">
                                <input type="radio" name="fileType" className="radio-input" value="image" onClick={e => setTipoSubir(1)} />
                                <span>🖼️</span>
                                <span className="text">Imagen</span>
                            </label>

                            <label className="radio-label">
                                <input type="radio" name="fileType" className="radio-input" value="video" onClick={e => setTipoSubir(2)} />
                                <span>🎥</span>
                                <span className="text">Video</span>
                            </label>
                        </div>
                    </div>
                )}
                {(tipoSubir === 1 || (editar && (form.amedida && !form.esVideo))) && (
                    <label htmlFor="textfield" className="search-label-admin mt-3">
                        Cargar imagen
                    </label>)}

                {(tipoSubir === 1 || (editar && (form.amedida && !form.esVideo))) && (
                    <input type="file" accept="image/*" className="w-100" onChange={handleImage} />
                )}
                <div id="containerViewImg" className={form.amedida && !form.esVideo ? "" : "d-none"}>
                    <h3>Vista previa Imagen:</h3>
                    <img
                        id="visualizadorImg"
                        src={!crear ? form.amedida : ""}
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = imgError;
                        }}
                        alt="Vista previa"
                        style={{ maxWidth: '300px', marginTop: '10px' }}
                    />
                </div>
                {(tipoSubir === 2 || (editar && (form.amedida && form.esVideo))) && (
                    <label htmlFor="textfield" className="search-label-admin mt-3">
                        Cargar video
                    </label>
                )}
                {(tipoSubir === 2 || (editar && (form.amedida && form.esVideo))) && (
                    <input type="file" accept="video/*" className="w-100" onChange={e => uploadVideo(e.target.files)} />
                )}
                <div id="containerViewVideo" className={form.amedida && form.esVideo ? "" : "d-none"}>
                    <h3>Vista previa Video:</h3>
                    <video id="visualizadorVideo" src={!crear ? form.amedida : ""} controls width="300" />
                </div>



                {/* //////////////////////////////////////////////////////////////////////////// */}
                <label htmlFor="textfield" className="search-label mt-3">
                    Tipo
                </label>
                <select id="miCombo" value={form.idTipo} className="typeDate" name="idTipo" onChange={handleChange}>
                    <option value="1">Anuncio</option>
                    <option value="0">Ventas</option>
                    <option value="2">Reclamos</option>
                </select>

                <div className="modal-actions">
                    <button type="submit" className="modal-btn modal-btn-green">{anuncio != null && anuncio.id > 0 ? "Editar" : "Crear"}</button>
                    <button className="modal-btn modal-btn-close" onClick={onCancelar}>Cancelar</button>
                </div>
            </div>
        </form>
    );
};

export default AnunciosCrear;
