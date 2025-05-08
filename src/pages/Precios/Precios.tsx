import React from 'react';
import './Precios.css'; // CSS personalizado

const Precios = () => {
    return (
        <div className="container text-center mb-5" style={{ marginTop: '-50px' }}>
            <h1 className="text-primary titulo-precios">PRECIOS</h1>
            <h2 className="text-danger spacing mb-4">COMUNIDADES</h2>
            <div className="row justify-content-center">
                {/* Plan 1 */}
                <div className="col-md-3 mx-4 card-pricing bg-blue shadow ">
                    <div className="ribbon">
                        <span className='color-blue'>100 USUARIOS</span>
                        <h2 className="price color-blue">$500</h2>
                        <p className="subtext color-blue">Por Usuario</p>
                    </div>
                    <ul className="text-start caracteristicas">
                        <li>Publicaciones</li>
                        <li>Votaciones</li>
                        <li>Calendario</li>
                        <li>Notificaciones</li>
                        <li>Y mucho más...</li>
                    </ul>
                    <button className="btn-loquiero-blue">¡LO QUIERO!</button>
                </div>
                {/* Plan 2 */}
                <div className="col-md-3 mx-4 card-pricing bg-red shadow ">
                    <div className="ribbon">
                        <span className='color-red'>200 USUARIOS</span>
                        <h2 className="price color-red">$350</h2>
                        <p className="subtext color-red">Por Usuario</p>
                    </div>
                    <ul className="text-start caracteristicas">
                        <li>Publicaciones</li>
                        <li>Votaciones</li>
                        <li>Calendario</li>
                        <li>Notificaciones</li>
                        <li>Y mucho más...</li>
                    </ul>
                    <button className="btn-loquiero-red">¡LO QUIERO!</button>
                </div>
                {/* Plan 3 */}
                <div className="col-md-3 mx-4 card-pricing bg-orange shadow ">
                    <div className="ribbon">
                        <span className='color-orange'>300+ USUARIOS</span>
                        <h2 className="price color-orange">$330</h2>
                        <p className="subtext color-orange">Por Usuario</p>
                    </div>
                    <ul className="text-start caracteristicas">
                        <li>Publicaciones</li>
                        <li>Votaciones</li>
                        <li>Calendario</li>
                        <li>Notificaciones</li>
                        <li>Y mucho más...</li>
                    </ul>
                    <button className="btn-loquiero-orange">¡LO QUIERO!</button>
                </div>
            </div>
        </div>
    );
};

export default Precios;
