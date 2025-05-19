import { useEffect, useState } from "react";
import axios from "axios";
import { con } from "../../../application/entity/Rutas";
import CrearEspacio from "./CrearEspacio";
import iconeditar from './../../../components/utils/img/editar.png'
interface Espacio {
  id: number;
  nombre: string;
  unidades: any;
}

export default function ListaEspacios(props: any) {
  let _ruta: string = con.RetornaRuta();
  const [espacios, setEspacios] = useState<Espacio[]>([]);
  const [crearNuevo, setCrearNuevo] = useState(false)
  const [editar, setEditar] = useState(false);
  const [espacio, setEspacio] = useState({})
  const cargar = async () => {
    const res = await axios.get(_ruta + "EspacioComun?idCondominio=" + localStorage.getItem("idCondominio")!.toString(), {
      headers: {
        'Access-Control-Allow-Origin': '*',
        "x-community-id": "2b2463d9f3b093b61be6ce0adbdcc4a0f7e56776502d173a4cf4bb0a8f5d0e79",
      }
    });
    setEspacios(res.data);
  };

  useEffect(() => {
    cargar();
  }, []);

  return (!crearNuevo && !editar) ?
    <div className="p-4">
      <h2 className="font-bold text-xl mb-2">Espacios creados</h2>
      <ul className="space-y-2">
        <button type="submit" className="modal-btn modal-btn-green" onClick={() => setCrearNuevo(true)}>+ Crear Nuevo</button>
        {espacios.map((e) => (
          <li key={e.id} className="border p-2 rounded">
            <button type="button" className="iconoVolver mr-4" style={{ right: '25px',position: 'absolute' }} onClick={() => { setEspacio(e); setEditar(true); }}>
              <img src={iconeditar} />
            </button>
            <strong>{e.nombre}</strong> — {e.unidades != null ? e.unidades.length : 0} unidad(es)
          </li>
        ))}
      </ul>
      <button className="modal-btn modal-btn-close" onClick={props.onCancelar}>Volver</button>
    </div >
    :
    <CrearEspacio onCancelar={() => { setCrearNuevo(false); setEditar(false);cargar() }} espacio={espacio} editar={editar} />
}
