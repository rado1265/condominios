import { useEffect } from "react";
import axios from "axios";
import { con } from "../../../application/entity/Rutas";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import {
  setNombre,
  setCantidadUnidades,
  setFormCompleto,
  resetForm,
} from "../../../store/slices/espacioComun/crearEspacioComunSlice";

export default function CrearEspacio(props: any) {
  const _ruta = con.RetornaRuta();
  const dispatch = useDispatch();
  const form = useSelector((state: RootState) => state.crearEspacioComun);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'x-community-id': '2b2463d9f3b093b61be6ce0adbdcc4a0f7e56776502d173a4cf4bb0a8f5d0e79'
    };

    if (props.editar) {
      await axios.put(_ruta + "EspacioComun/" + props.espacio.id, form, { headers });
    } else {
      await axios.post(_ruta + "EspacioComun", form, { headers });
    }

    dispatch(resetForm());
    alert("Espacio creado");
    props.onCancelar();
  };

  useEffect(() => {
    if (props.espacio && Object.keys(props.espacio).length > 0) {
      dispatch(setFormCompleto({
        nombre: props.espacio.nombre,
        cantidadUnidades: props.espacio.unidades.length,
        idCondominio: parseInt(localStorage.getItem("idCondominio") || "0"),
      }));
    }
  }, [props.espacio, dispatch]);

  return (
    <div className="p-4 rounded shadow mb-4 mt-3 mt-md-5 row col-12 col-md-8 mx-auto">
      <h3 className="font-bold col-12">{props.editar ? "Editar Espacio" : "Crear Espacio"} Común</h3>

      <div className="col-12 col-md-6">
        <label htmlFor="nombreEspacio" className="search-label-admin">Nombre</label>
        <input
          type="text"
          id="nombreEspacio"
          className="search-input w-100"
          placeholder="Nombre"
          value={form.nombre}
          onChange={(e) => dispatch(setNombre(e.target.value))}
          required
        />
      </div>

      <div className="col-12 col-md-6">
        <label htmlFor="cantEspacio" className="search-label-admin">Cantidad</label>
        <input
          type="number"
          id="cantEspacio"
          className="search-input w-100"
          placeholder="Cantidad"
          value={form.cantidadUnidades}
          onChange={(e) => dispatch(setCantidadUnidades(parseInt(e.target.value)))}
          required
          min={1}
        />
      </div>

      <div className="modal-actions mt-4 col-12">
        <button type="submit" className="modal-btn modal-btn-green" onClick={handleSubmit}>Crear</button>
        <button className="modal-btn modal-btn-close" onClick={props.onCancelar}>Cancelar</button>
      </div>
    </div>
  );
}
