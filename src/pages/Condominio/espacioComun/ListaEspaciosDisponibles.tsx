import { useEffect, useState } from "react";
import axios from "axios";

export interface EspacioComun {
  id: number;
  nombre: string;
}

export interface UnidadDisponible {
  id: number;
  numero: number;
}
export default function ListaEspaciosDisponibles(props: any) {
  console.log(props)
  const [espacios, setEspacios] = useState<EspacioComun[]>([]);
  const [seleccionado, setSeleccionado] = useState<number | null>(null);
  const [fecha, setFecha] = useState("");
  const [disponibles, setDisponibles] = useState<UnidadDisponible[]>([]);

  /*   useEffect(() => {
      axios.get("/api/espacios").then((res) => setEspacios(res.data));
    }, []); */

  const consultarDisponibilidad = async () => {
    if (!seleccionado || !fecha) return;
    const res = await axios.get(`/api/espacios/${seleccionado}/disponibles`, {
      params: { fecha }, headers: {
        'Access-Control-Allow-Origin': '*',
        "x-community-id": "2b2463d9f3b093b61be6ce0adbdcc4a0f7e56776502d173a4cf4bb0a8f5d0e79",
      }
    });
    setDisponibles(res.data);
  };

  const reservar = async (unidadId: number) => {
    await axios.post("/api/espacios/reservar", {
      unidadEspacioId: unidadId,
      fecha,
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        "x-community-id": "2b2463d9f3b093b61be6ce0adbdcc4a0f7e56776502d173a4cf4bb0a8f5d0e79",
      }
    });
    alert("Reservado");
    //consultarDisponibilidad(); // refresca la lista
  };

  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold">Espacios Disponibles</h3>

      <select
        onChange={(e) => setSeleccionado(Number(e.target.value))}
        value={seleccionado ?? ""}
      >
        <option value="">Seleccione un espacio</option>
        {espacios.map((e) => (
          <option key={e.id} value={e.id}>
            {e.nombre}
          </option>
        ))}
      </select>

      <input
        type="date"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
      />

      <button onClick={consultarDisponibilidad}>Consultar</button>
      <button className="modal-btn modal-btn-close" onClick={props.onCancelar}>Cancelar</button>
      <ul className="mt-2">
        {disponibles.map((u) => (
          <li key={u.id}>
            Unidad #{u.numero}{" "}
            <button onClick={() => reservar(u.id)}>Reservar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
