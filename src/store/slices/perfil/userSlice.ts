import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    enComunidad: boolean;
    imagenPerfil: string;
    nombre: string;
}

const initialState: UserState = {
    enComunidad: false,
    imagenPerfil: '',
    nombre: '',
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserData: (state, action: PayloadAction<Partial<UserState>>) => {
            Object.assign(state, action.payload);
        },
        clearUser: () => initialState,
    },
});

export const { setUserData, clearUser } = userSlice.actions;
export default userSlice.reducer;