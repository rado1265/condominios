import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import iconeditar from './../../../components/utils/img/editar.png';
import iconborrar from './../../../components/utils/img/iconborrar.png';
import { ConfirmMessage } from '../../../components/utils/messages';
import { toast } from 'react-toastify';
import { AppDispatch, RootState } from "../../../store/store";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { fetchAnuncioCrear, setAnuncioCrear, setArchivoTemp, setLimpiarAnuncioCrear, setTipoSubir } from "../../../store/slices/anuncio/anuncioSlice"
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../config';
import { setCambiarMenu } from '../../../store/slices/comunidad/comunidadSlice';

interface Props {
}
const imgError = "https://media1.tenor.com/m/Ord0OyTim_wAAAAC/loading-windows11.gif";
const AnunciosCrear: React.FC<Props> = ({ }) => {
    const dispatch = useDispatch<AppDispatch>()
    const { dataDetalle, archivoTemp, tipoSubir, anuncioCrear, crear, editar } = useSelector((state: RootState) => state.anuncio);
    const { usuario } = useSelector((state: RootState) => state.auth);

    const onGuardar = async (form: any, archivoTemp: File | null) => {
        var resultImg = "";
        if (archivoTemp) {
            resultImg = await guardarArchivo(4, archivoTemp);
        }
        try {
            if (anuncioCrear.cabecera.length > 0) {
                const result = await dispatch(fetchAnuncioCrear(normalizarAnuncio(anuncioCrear, resultImg)))
                if (fetchAnuncioCrear.fulfilled.match(result)) {
                    dispatch(setCambiarMenu({ mostrar: "verPublicacion", tipo: 4 } as any));
                    dispatch(setLimpiarAnuncioCrear());
                }
            }
        } catch (er) {
        }
    }
    const normalizarAnuncio = (data: any, imgGuardada: string) => {
        return {
            id: data.id ?? 0,
            idCondominio: localStorage.getItem("idCondominio"),
            cabecera: data.cabecera ?? "",
            descripcion: data.descripcion ?? "",
            organizador: usuario.nombre,
            telefono: data.telefono ?? "",
            amedida: imgGuardada != "" ? imgGuardada : data.amedida ?? "",
            fechaDesde: data.fechaDesde != "" ? data.fechaDesde : new Date(),
            fechaHasta: data.fechaHasta ?? new Date(),
            idTipo: data.idTipo ?? 1,
            idUsuario: data.idUsuario === 0 ? usuario.id : data.idUsuario,
            activo: data.activo ?? true
        };
    };
    const guardarArchivo = async (tipoArchivo: number = 1, archivoAsubir: File | null = null) => {
        let randomNumero = Math.floor(Math.random() * (100 - 1 + 1)) + 1;
        let urlSubida = "";
        if (archivoAsubir && !(archivoAsubir.size > 100000000)) {
            if (tipoArchivo === 4) {
                const storageRef = ref(storage, `comunidad-${localStorage.getItem("idCondominio")}/${archivoAsubir.name + randomNumero}`);
                const snapshot = await uploadBytes(storageRef, archivoAsubir);
                urlSubida = await getDownloadURL(snapshot.ref);

            } else {
                const storageRef = ref(storage, `perfiles/${archivoAsubir.name + randomNumero}`);
                const snapshot = await uploadBytes(storageRef, archivoAsubir);
                urlSubida = await getDownloadURL(snapshot.ref);
            }

            //dispatch(setAnuncioCrear({ name: "amedida", value: urlSubida }))
        } else if (archivoAsubir && (archivoAsubir.size > 100000000)) {
            alert("El archivo pesa mas de 100 MB")
        }
        return urlSubida;
    }
    /* useEffect(() => {
        if (archivoTemp) {
            const url = URL.createObjectURL(archivoTemp);
            setPreview(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setPreview(null);
        }
    }, [archivoTemp]); */

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        dispatch(setAnuncioCrear({ name, value }))
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
        dispatch(setArchivoTemp(file));

        if (!file) return;

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

        dispatch(setArchivoTemp(files.target.files[0]));

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
        onGuardar(anuncioCrear, archivoTemp);
    };

    return (
        <form onSubmit={handleSubmit} className="anuncio-form">
            <h2 className="mb-4 text-center">{dataDetalle != null && dataDetalle.id > 0 ? 'Editar Anuncio' : 'Nuevo Anuncio'}</h2>
            <div className="login-box py-3 px-3" style={{ boxShadow: '0 0 0 1px #e5e5e5', borderRadius: '10px' }}>
                <label htmlFor="textfield" className="search-label-admin">
                    Cabecera
                </label>
                <input
                    type="text"
                    name="cabecera"
                    className="search-input"
                    value={anuncioCrear.cabecera}
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
                    value={anuncioCrear.descripcion}
                    onChange={handleChange}
                />
                <label htmlFor="textfield" className="search-label-admin">
                    Organizador
                </label>
                <input
                    type="text"
                    name="organizador"
                    className="search-input"
                    value={usuario.nombre}
                    disabled
                />
                <label htmlFor="textfield" className="search-label-admin mt-3">
                    Fecha Hasta
                </label>
                <input
                    type="date"
                    name="fechaHasta"
                    className="typeDate"
                    value={anuncioCrear.fechaHasta ? anuncioCrear.fechaHasta.toString().substring(0, 10) : ''}
                    onChange={handleChange}
                    style={{ padding: '8px', fontSize: '16px' }}
                />

                {(crear || (!crear && !anuncioCrear.amedida)) && (
                    <div>
                        <label>Subir archivo</label>
                        <div className="radio-group">
                            <label className="radio-label">
                                <input type="radio" name="fileType" className="radio-input" value="image" onClick={e => dispatch(setTipoSubir(1))} />
                                <span>🖼️</span>
                                <span className="text">Imagen</span>
                            </label>

                            <label className="radio-label">
                                <input type="radio" name="fileType" className="radio-input" value="video" onClick={e => dispatch(setTipoSubir(2))} />
                                <span>🎥</span>
                                <span className="text">Video</span>
                            </label>
                        </div>
                    </div>
                )}
                {(tipoSubir === 1 || (editar && (anuncioCrear.amedida && !anuncioCrear.esVideo))) && (
                    <label htmlFor="textfield" className="search-label-admin mt-3">
                        Cargar imagen
                    </label>)}

                {(tipoSubir === 1 || (editar && (anuncioCrear.amedida && !anuncioCrear.esVideo))) && (
                    <input type="file" accept="image/*" className="w-100" onChange={handleImage} />
                )}
                <div id="containerViewImg" className={anuncioCrear.amedida && !anuncioCrear.esVideo ? "" : "d-none"}>
                    <h3>Vista previa Imagen:</h3>
                    <img
                        id="visualizadorImg"
                        src={!crear ? anuncioCrear.amedida : ""}
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = imgError;
                        }}
                        alt="Vista previa"
                        style={{ maxWidth: '300px', marginTop: '10px' }}
                    />
                </div>
                {(tipoSubir === 2 || (editar && (anuncioCrear.amedida && anuncioCrear.esVideo))) && (
                    <label htmlFor="textfield" className="search-label-admin mt-3">
                        Cargar video
                    </label>
                )}
                {(tipoSubir === 2 || (editar && (anuncioCrear.amedida && anuncioCrear.esVideo))) && (
                    <input type="file" accept="video/*" className="w-100" onChange={e => uploadVideo(e.target.files)} />
                )}
                <div id="containerViewVideo" className={anuncioCrear.amedida && anuncioCrear.esVideo ? "" : "d-none"}>
                    <h3>Vista previa Video:</h3>
                    <video id="visualizadorVideo" src={!crear ? anuncioCrear.amedida : ""} controls width="300" />
                </div>
                <label htmlFor="textfield" className="search-label mt-3">
                    Tipo
                </label>
                <select id="miCombo" value={anuncioCrear.idTipo} className="typeDate" name="idTipo" onChange={handleChange}>
                    <option value="1">Anuncio</option>
                    <option value="0">Ventas</option>
                    <option value="2">Reclamos</option>
                </select>

                <div className="modal-actions">
                    <button type="submit" className="modal-btn modal-btn-green">{anuncioCrear != null && dataDetalle.id > 0 ? "Editar" : "Crear"}</button>
                    <button className="modal-btn modal-btn-close" onClick={() => { dispatch(setLimpiarAnuncioCrear()); dispatch(setCambiarMenu({ mostrar: "verPublicacion", tipo: 4 } as any)) }}>Cancelar</button>
                </div>
            </div>
        </form >
    );
};

export default AnunciosCrear;
