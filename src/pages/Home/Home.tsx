import React, { useEffect, useState } from "react";
import Loading from "../../components/utils/loading";
import './Home.css';
import { ObtenerListadoAnuncioLogic } from "../../presentation/view-model/Anuncio.logic";

const Home = () => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        ObtenerListadoAnuncioLogic(selListadoAnuncios, "1");
    }, [])

    const selListadoAnuncios = (error: Boolean, err: string, data: any) => {
        try {
            setLoading(false);
            console.log(data);
            console.log(error);
            console.log(err);
        } catch (er) {
            //ErrorMessage("Ha ocurrido un error", "Ha ocurrido un error desconocido. Comuníquese con el Administrador.")
        }
    }

    return (
        <React.Fragment>
            {
                loading ?
                    <Loading />
                    :
                    <div style={{marginTop:'10rem', textAlignLast:'center', fontSize:'10rem'}}>
                        Hola Mundo!
                    </div>

            }
        </React.Fragment>
    );
}

export default Home;