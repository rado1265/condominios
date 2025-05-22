import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface CrearEspacioDTO {
  nombre: string;
  cantidadUnidades: number;
  idCondominio: number;
}

const initialState: CrearEspacioDTO = {
  nombre: '',
  cantidadUnidades: 1,
  idCondominio: parseInt(localStorage.getItem("idCondominio") || '0')
}

const espacioComunSlice = createSlice({
  name: 'espacioComun',
  initialState,
  reducers: {
    setNombre: (state, action: PayloadAction<string>) => {
      state.nombre = action.payload
    },
    setCantidadUnidades: (state, action: PayloadAction<number>) => {
      state.cantidadUnidades = action.payload
    },
    setFormCompleto: (state, action: PayloadAction<CrearEspacioDTO>) => {
      return action.payload
    },
    resetForm: () => initialState
  }
})

export const { setNombre, setCantidadUnidades, setFormCompleto, resetForm } = espacioComunSlice.actions
export default espacioComunSlice.reducer
export type { CrearEspacioDTO }