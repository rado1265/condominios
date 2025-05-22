import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { con } from '../../../application/entity/Rutas'

export interface Espacio {
  id: number
  nombre: string
  unidades: any[]
}

interface EstadoEspacios {
  espacios: Espacio[]
  espacioSeleccionado: Espacio | null
  modo: 'lista' | 'crear' | 'editar'
}

const initialState: EstadoEspacios = {
  espacios: [],
  espacioSeleccionado: null,
  modo: 'lista'
}

export const cargarEspacios = createAsyncThunk(
  'espacioComun/cargarEspacios',
  async () => {
    const _ruta = con.RetornaRuta()
    const res = await axios.get(
      _ruta + 'EspacioComun?idCondominio=' + localStorage.getItem('idCondominio'),
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'x-community-id':
            '2b2463d9f3b093b61be6ce0adbdcc4a0f7e56776502d173a4cf4bb0a8f5d0e79'
        }
      }
    )
    return res.data as Espacio[]
  }
)

const espacioComunSlice = createSlice({
  name: 'espacioComun',
  initialState,
  reducers: {
    setModo: (state, action: PayloadAction<'lista' | 'crear' | 'editar'>) => {
      state.modo = action.payload
    },
    seleccionarEspacio: (state, action: PayloadAction<Espacio | null>) => {
      state.espacioSeleccionado = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(cargarEspacios.fulfilled, (state, action) => {
      state.espacios = action.payload
    })
  }
})

export const { setModo, seleccionarEspacio } = espacioComunSlice.actions
export default espacioComunSlice.reducer
