import React, { useEffect, useState } from "react";
import Loading from "../../components/utils/loading";
import './Home.css';
import { ObteneCondominioLogic } from "../../presentation/view-model/Anuncio.logic";
import { ErrorMessage } from "../../components/utils/messages";
import logo from './../../components/utils/img/logo.png';

const Home = () => {
    const [loading, setLoading] = useState(false);
    const [guid, setGuid] = useState("");

    const handleClick = () => {
        ObteneCondominioLogic(selObteneCondominio, guid);
    }
    const selObteneCondominio = (error: Boolean, err: string, data: any) => {
        try {
            setLoading(false);
            if(data === 0){
                ErrorMessage("Código Incorrecto", "El código ingresado es incorrecto");
            }else{
                window.location.href = "/" + data + "/comunidad"
            }
        } catch (er) {
        }
    }
    useEffect(() => {
        if (localStorage.getItem("idCondominio"))
            window.location.href = "/" + localStorage.getItem("idCondominio") + "/comunidad"
    }, [])

    const handlechange = (e: any) => {
        setGuid(e.target.value);
    };

    const handleKeyDown = (e: any) => {
        if (e.key === 'Enter') {
            ObteneCondominioLogic(selObteneCondominio, guid);
        }
    };

    return (
        <React.Fragment>
            {
                loading ?
                    <Loading />
                    :
                    <div>
                        <div className="w-100 my-3" style={{ display: 'grid' }}>
                            <img className="w-75 mx-auto" alt="Logo" src={logo}/>
                        </div>
                        <div className="search-container">
                            <label htmlFor="textfield" className="search-label">
                                Ingrese el código de su comunidad:
                            </label>
                            <div className="search-box">
                                <input
                                    onChange={handlechange}
                                    type="text"
                                    id="textfield"
                                    className="search-input"
                                    placeholder="Escriba aquí..."
                                    onKeyDown={handleKeyDown}
                                />
                                <button
                                    type="button"
                                    className="search-button"
                                    onClick={handleClick}
                                >
                                    Ingresar
                                </button>
                            </div>
                        </div>
                    </div>
            }
        </React.Fragment>
    );
}

export default Home;