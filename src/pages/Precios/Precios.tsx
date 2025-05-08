import React, { useRef, useEffect } from 'react';
import './Precios.css'; // CSS personalizado
import logo from './../../components/utils/img/logo.png';

const Precios = () => {
    const sectionLogoRef = useRef<HTMLDivElement>(null);
    const sectionPreciosRef = useRef<HTMLDivElement>(null);

    useEffect(() => {

        const sectionLogo = sectionLogoRef.current;
        const sectionPrecios = sectionPreciosRef.current;

        if (!sectionLogo || !sectionPrecios) return;

        const onWheel = (e: any) => {
            // Si el scroll es hacia abajo (deltaY positivo)
            if (e.deltaY > 0) {
                e.preventDefault(); // prevenir scroll normal
                sectionPrecios.scrollIntoView({ behavior: 'smooth' });
            }
        };

        sectionLogo.addEventListener('wheel', onWheel, { passive: false });

        return () => {
            sectionLogo.removeEventListener('wheel', onWheel);
        };
    }, []);
    return (
        <div className="container text-center mb-5" style={{ marginTop: '-50px' }}>
            <section id="sectionLogo" className='d-flex justify-content-center align-items-center' style={{ height: '100vh' }} ref={sectionLogoRef}>
                <img src={logo} style={{ width: '80%', marginTop: '-25px' }} />
            </section>
            <section id="sectionPrecios" ref={sectionPreciosRef}>
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
            </section>
        </div>
    );
};

export default Precios;
