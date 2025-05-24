import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { loginThunk, suscribirPushThunk } from '../../../store/slices/login/authSlice';
import { toast } from 'react-toastify';
import logo from './../../../components/utils/img/logo.png';
import { setCambiarMenu } from '../../../store/slices/comunidad/comunidadSlice';

const posicionAlertas = 'bottom-left';
interface Props {
    onLogin: () => void
}
const Login: React.FC<Props> = ({ onLogin }) => {
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector(state => state.auth);

    const [loguear, setLoguear] = useState({ usuario: '', clave: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLoguear(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await dispatch(loginThunk(loguear));
        if (loginThunk.fulfilled.match(result)) {
            const user = result.payload;
            toast.success('Inicio de sesión exitoso', { position: posicionAlertas });
            /* dispatch(suscribirPushThunk({ idCondominio: localStorage.getItem('idCondominio')!, idUsuario: user.id })); */
            dispatch(setCambiarMenu({ mostrar: "verAvisos", tipo: 999 } as any))
        } else {
            toast.error('Credenciales incorrectas', { position: posicionAlertas });
            onLogin()
        }
    };

    return (
        <form onSubmit={handleSubmit} className="login-form">
            <div className="w-100" style={{ display: 'grid' }}>
                <img className="w-75 mx-auto" alt="Logo" src={logo} />
            </div>
            <div className="w-100 search-container">
                <label htmlFor="usuario" className="search-label">Inicio de Sesión</label>
                <div className="login-box">
                    <input
                        type="text"
                        name="usuario"
                        className="search-input"
                        value={loguear.usuario}
                        onChange={handleChange}
                    />
                    <input
                        type="password"
                        name="clave"
                        className="search-input"
                        value={loguear.clave}
                        onChange={handleChange}
                    />
                    <button type="submit" className="search-button">
                        {loading ? 'Ingresando...' : 'Ingresar'}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default Login;
