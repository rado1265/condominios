import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../store/store";
import {
  cargarEspacios,
  seleccionarEspacio,
  setModo
} from "../../../store/slices/espacioComun/listadoEspacioComunSlice";
import CrearEspacio from "./CrearEspacio";
import iconeditar from './../../../components/utils/img/editar.png'

export default function ListaEspacios(props: any) {
  const dispatch = useDispatch<AppDispatch>()
  const { espacios, espacioSeleccionado, modo } = useSelector((state: RootState) => state.listadoEspacioComun)

 /*  useEffect(() => {
    dispatch(cargarEspacios())
  }, [dispatch]) */

  if (modo !== 'lista') {
    return (
      <CrearEspacio
        onCancelar={() => {
          dispatch(setModo('lista'))
          dispatch(seleccionarEspacio(null))
          dispatch(cargarEspacios())
        }}
        espacio={espacioSeleccionado}
        editar={modo === 'editar'}
      />
    )
  }

  return (
    <div className="p-md-4 p-2">
      <h2 className="font-bold text-xl mb-2">Espacios creados</h2>
      <ul className="space-y-2">
        <button
          type="submit"
          className="modal-btn modal-btn-green"
          onClick={() => {
            dispatch(setModo('crear'))
            dispatch(seleccionarEspacio(null))
          }}
        >
          + Crear Nuevo
        </button>
        {espacios.map((e: any) => (
          <li
            key={e.id}
            className="border py-3 pl-4 rounded justify-content-space-beetween w-100"
          >
            <button
              type="button"
              className="iconoVolver mr-4"
              style={{ float: 'right' }}
              onClick={() => {
                dispatch(seleccionarEspacio(e))
                dispatch(setModo('editar'))
              }}
            >
              <img src={iconeditar} />
            </button>
            <strong>{e.nombre}</strong> —{" "}
            {e.unidades != null ? e.unidades.length : 0} unidad(es)
          </li>
        ))}
      </ul>
      <button className="modal-btn modal-btn-close" onClick={props.onCancelar}>Volver</button>
    </div>
  );
}
