import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { fetchEspacios, fetchDisponibles } from "../../../store/slices/espacioComun/disponibilidadEspacioComunSlice";

export default function ListaEspaciosDisponibles({ onCancelar }: any) {
  const dispatch = useAppDispatch();
  const { espacios, disponibles } = useAppSelector((state) => state.disponibilidadEspacioComun);
  const [seleccionado, setSeleccionado] = useState<number | null>(null);
  const [fecha, setFecha] = useState("");

  useEffect(() => {
    dispatch(fetchEspacios());
  }, []);

  const consultarDisponibilidad = () => {
    if (seleccionado && fecha) {
      dispatch(fetchDisponibles({ espacioId: seleccionado, fecha }));
    }
  };

  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold">Espacios Disponibles</h3>
      <select onChange={(e) => setSeleccionado(Number(e.target.value))} value={seleccionado ?? ""}>
        <option value="">Seleccione un espacio</option>
        {espacios.map((e: any) => (
          <option key={e.id} value={e.id}>{e.nombre}</option>
        ))}
      </select>
      <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
      <button onClick={consultarDisponibilidad}>Consultar</button>
      <button onClick={onCancelar}>Cancelar</button>
      <ul className="mt-2">
        {disponibles.map((u: any) => (
          <li key={u.id}>Unidad #{u.numero} <button>Reservar</button></li>
        ))}
      </ul>
    </div>
  );
}
