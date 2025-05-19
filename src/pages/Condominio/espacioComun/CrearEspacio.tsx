import { useEffect, useState } from "react";
import axios from "axios";
import { con } from "../../../application/entity/Rutas";

export interface CrearEspacioDTO {
  nombre: string;
  cantidadUnidades: number;
  idCondominio: number;
}
export default function CrearEspacio(props: any) {
  let _ruta: string = con.RetornaRuta();
  const [form, setForm] = useState<CrearEspacioDTO>({
    nombre: "",
    cantidadUnidades: 1,
    idCondominio: parseInt(localStorage.getItem("idCondominio")!.toString())
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (props.editar) {
      await axios.put(_ruta + "EspacioComun/" + props.espacio.id, form, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          "x-community-id": "2b2463d9f3b093b61be6ce0adbdcc4a0f7e56776502d173a4cf4bb0a8f5d0e79",
        }
      });
    } else {
      await axios.post(_ruta + "EspacioComun", form, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          "x-community-id": "2b2463d9f3b093b61be6ce0adbdcc4a0f7e56776502d173a4cf4bb0a8f5d0e79",
        }
      });
    }

    setForm({ nombre: "", cantidadUnidades: 1, idCondominio: parseInt(localStorage.getItem("idCondominio")!.toString()) });
    alert("Espacio creado");
    props.onCancelar()
  };

  useEffect(() => {
    console.log(props)
    if (props.espacio != null && Object.keys(props.espacio).length > 0)
      setForm({
        nombre: props.espacio.nombre,
        cantidadUnidades: props.espacio.unidades.length,
        idCondominio: parseInt(localStorage.getItem("idCondominio")!.toString())
      })
  }, [props.espacio]);

  return (
    <div className="p-4 rounded shadow mb-4 mt-3 mt-md-5 row col-12 col-md-8 mx-auto">
      <h3 className="font-bold col-12">Crear Espacio Común</h3>

      <div className="col-12 col-md-6">
        <label htmlFor="nombreEspacio" className="search-label-admin">Nombre</label>
        <input
          type="text"
          id="nombreEspacio"
          className="search-input w-100"
          placeholder="Nombre"
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
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
          onChange={(e) =>
            setForm({ ...form, cantidadUnidades: parseInt(e.target.value) })
          }
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
