import React, { useEffect, useState } from "react";
import Loading from "../../components/utils/loading";
import './Home.css';
import { ObtenerListadoAnuncioLogic } from "../../presentation/view-model/Anuncio.logic";

const Home = () => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
            if (localStorage.getItem("idCondominio")) {
                //localStorage.setItem(key, value)
                window.location.href = "/" + localStorage.getItem("idCondominio") + "/comunidad"
            }
    }, [])

    return (
        <React.Fragment>
            {
                loading ?
                    <Loading />
                    :
                    <div style={{ marginTop: '10rem', textAlignLast: 'center', fontSize: '10rem' }}>
                        Hola Mundo!
                    </div>

            }
        </React.Fragment>
    );
}

export default Home;