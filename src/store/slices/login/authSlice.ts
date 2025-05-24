import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import CryptoJS from 'crypto-js';
import { LoginLogic, SuscribirNotificaciones2Logic } from '../../../presentation/view-model/Anuncio.logic';

const secret = '2b2463d9f3b093b61be6ce0adbdcc4a0f7e56776502d173a4cf4bb0a8f5d0e79';

function serializeToAscii(data: any): string {
    const json = JSON.stringify(data);
    return Array.from(json).map(char => char.charCodeAt(0)).join(',');
}

function normalizeLogin(data: any) {
    return {
        usuario: data.usuario ?? '',
        clave: data.clave ?? '',
        idCondominio: 0
    };
}

function urlBase64ToUint8Array(base64String: any) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, "+")
        .replace(/_/g, "/");

    const raw = atob(base64);
    const output = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; ++i) {
        output[i] = raw.charCodeAt(i);
    }
    return output;
}

async function solicitarPermisoNotificaciones(): Promise<PushSubscription | false> {
    const permiso = await Notification.requestPermission();
    if (permiso !== 'granted') return false;

    const registration = await navigator.serviceWorker.register('/service-worker.js');
    const ready = await navigator.serviceWorker.ready;

    let subscription = await ready.pushManager.getSubscription();
    if (!subscription) {
        subscription = await ready.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array("BDhWFTbhmhdKANFtk6FZsIE4gQE1eHAiCPvwXsE8UGCKa-U-vVh3cTzOCFtNy01QBc08mP8GcUeCLybWsD-5No0"),
        });
    }

    return subscription;
}

export const loginThunk = createAsyncThunk(
    'auth/login',
    async (data: { usuario: string; clave: string }, { rejectWithValue }) => {
        try {
            const jsonData = JSON.stringify(normalizeLogin(data));
            const hash = CryptoJS.HmacSHA256(jsonData, secret).toString();
            const paquete = { datos: jsonData, firma: hash };

            localStorage.setItem("ZXN0byBlcyBzZWNyZXRv", serializeToAscii(data));

            return new Promise<any>((resolve, reject) => {
                LoginLogic((error: any, errMsg: any, user: any) => {
                    if (user?.nombre) resolve(user);
                    else reject(rejectWithValue('Credenciales incorrectas'));
                }, paquete, true);
            });
        } catch (error) {
            return rejectWithValue('Error inesperado');
        }
    }
);
export const loginStorage = createAsyncThunk(
    'auth/loginStorage',
    async (paquete: any, { rejectWithValue }) => {
        try {
            return new Promise<any>((resolve, reject) => {
                LoginLogic((error: any, errMsg: any, user: any) => {
                    if (user?.nombre) resolve(user);
                    else reject(rejectWithValue('Credenciales incorrectas'));
                }, paquete, false);
            });
        } catch (error) {
            return rejectWithValue('Error inesperado');
        }
    }
);

export const suscribirPushThunk = createAsyncThunk(
    'auth/suscribir',
    async ({ idCondominio, idUsuario }: { idCondominio: string; idUsuario: number }) => {
        const subscription = await solicitarPermisoNotificaciones();
        if (!subscription) return;

        return new Promise((resolve: any) => {
            SuscribirNotificaciones2Logic(() => resolve(true), idCondominio, idUsuario, 0, subscription, false);
        });
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        usuario: null as any,
        loading: false,
        error: null as string | null,
    },
    reducers: {
        logout: (state) => {
            localStorage.clear();
            state.usuario = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.usuario = action.payload;
            })
            .addCase(loginThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(loginStorage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginStorage.fulfilled, (state, action) => {
                /* state.loading = false; */
                state.usuario = action.payload;
            })
            .addCase(loginStorage.rejected, (state, action) => {
                /* state.loading = false; */
                state.error = action.payload as string;
            });
    }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
