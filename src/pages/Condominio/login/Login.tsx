import React from 'react';
import logo from './../../../components/utils/img/logo.png'
interface Props {
    usuario: string;
    clave: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onLogin: () => void;
    loading?: boolean;
}

const Login: React.FC<Props> = ({ usuario, clave, onChange, onLogin, loading = false }) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin();
    };

    return (
        <form onSubmit={handleSubmit} className="login-form">
            <div className="w-100" style={{ display: 'grid' }}>
                <img className="w-75 mx-auto" alt="Logo" src={logo} />
            </div>
            <div className="w-100 search-container">
                <label htmlFor="textfield" className="search-label">
                    Inicio de Sesión
                </label>
                <div className="login-box">
                    <input
                        type="text"
                        name="usuario"
                        className="search-input"
                        value={usuario}
                        onChange={onChange}
                    />
                    <input
                        type="password"
                        name="clave"
                        className="search-input"
                        value={clave}
                        onChange={onChange}
                        autoComplete="current-password"
                    />
                    <button
                        type="submit"
                        className="search-button"
                    >
                        {loading ? 'Ingresando...' : 'Ingresar'}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default Login;
