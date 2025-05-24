import { configureStore } from '@reduxjs/toolkit'
import crearEspacioComunReducer from '../store/slices/espacioComun/crearEspacioComunSlice'
import listadoEspacioComunReducer from '../store/slices/espacioComun/listadoEspacioComunSlice'
import disponibilidadEspacioComunReducer from '../store/slices/espacioComun/disponibilidadEspacioComunSlice'
import historialReservasReducer from '../store/slices/espacioComun/historialReservasSlice'
import reservaEspacioComunReducer from '../store/slices/espacioComun/reservaEspacioComunSlice'
import userReducer from '../store/slices/perfil/perfilUsuarioSlice';
import emergenciaReducer from '../store/slices/emergencia/emergenciaSlice';
import votacionesReducer from '../store/slices/votacion/votacionesSlice';
import crearVotacionesReducer from '../store/slices/votacion/crearVotacionesSlice';
import authReducer from '../store/slices/login/authSlice';
import avisoReducer from '../store/slices/avisos/avisoSlice'
import usuariosReducer from '../store/slices/perfil/usuariosSlice'
import anuncioReducer from '../store/slices/anuncio/anuncioSlice';
import comunidadReducer from '../store/slices/comunidad/comunidadSlice';

export const store = configureStore({
    reducer: {
        crearEspacioComun: crearEspacioComunReducer,
        listadoEspacioComun: listadoEspacioComunReducer,
        disponibilidadEspacioComun: disponibilidadEspacioComunReducer,
        historialReservas: historialReservasReducer,
        reservaEspacioComun: reservaEspacioComunReducer,
        crearVotaciones: crearVotacionesReducer,
        user: userReducer,
        emergencia: emergenciaReducer,
        votaciones: votacionesReducer,
        auth: authReducer,
        aviso: avisoReducer,
        usuarios: usuariosReducer,
        anuncio: anuncioReducer,
        comunidad: comunidadReducer
    }, middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    'user/loginUser/fulfilled',
                    'anuncios/fetchAnuncios/fulfilled',
                    'user/setUsuario',
                    'user/setUsuarioDetalle',
                    'anuncios/setAnuncioForm',
                ],
                ignoredPaths: [
                    'user.usuario.fechaCaducidad',
                    'anuncios.anuncioForm.fechaDesde',
                    'anuncios.anuncioForm.fechaHasta',
                    'anuncios.dataDetalle.fechaDesde',
                    'anuncios.dataDetalle.fechaHasta',
                ],
            },
        }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch