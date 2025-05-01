import React, { useEffect, useState } from "react";
import './HomeDesktop.css';
import celApp from './../../components/utils/img/celApp.png';
import { ObteneCondominioLogic } from "../../presentation/view-model/Anuncio.logic";

const HomeDesktop = () => {

    return (
        <React.Fragment>
            <main className="contenedor-principal">
                <section className="contenido-izquierdo">
                    <h1>Conecta tu Comunidad</h1>
                    <p>Plataforma integral para:</p>
                    <ul>
                        <li>Anuncios comunitarios</li>
                        <li>Ventas entre vecinos</li>
                        <li>Informaciones de tu comunidad</li>
                    </ul>
                    <button className="cta-btn">Contactanos</button>
                </section>
                <section className="contenido-derecho">
                    <img src={celApp} alt="Vista previa de la aplicación" className="app-mockup" />
                </section>
            </main>
        </React.Fragment>
    );
}

export default HomeDesktop;