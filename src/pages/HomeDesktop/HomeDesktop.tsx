import React from "react";
import './HomeDesktop.css';
import celApp from './../../components/utils/img/celApp.png';

const HomeDesktop = () => {

    return (
        <React.Fragment>
            <main className="contenedor-principal">
                <section className="contenido-izquierdo">
                    <h1>Este sistema está optimizado para móviles</h1>
                    <p>Accede desde tu teléfono para disfrutar de:</p>
                    <ul>
                        <li>✅ Anuncios comunitarios: Mantente informado de lo que sucede a tu alrededor.</li>
                        <li>✅ Ventas entre vecinos: Compra/vende artículos de manera segura y cerca de ti.</li>
                        <li>✅ Información de tu comunidad: Conoce eventos, servicios y noticias importantes.</li>
                    </ul>
                    {/*<button className="cta-btn">Contactanos</button>*/}
                </section>
                <section className="contenido-derecho">
                    <img src={celApp} alt="Vista previa de la aplicación" className="app-mockup" />
                </section>
            </main>
        </React.Fragment>
    );
}

export default HomeDesktop;