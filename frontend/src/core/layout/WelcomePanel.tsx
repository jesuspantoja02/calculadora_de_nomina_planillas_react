import { useEffect, useState } from 'react';
import { container } from '../../composition/container';
import { CNJ_ESLOGAN, CNJ_LOGO_URL, CNJ_NOMBRE, CNJ_PANEL_HERO_URL } from '../../config/empresaBranding';

export function WelcomePanel() {
  const [cargando, setCargando] = useState(true);
  const [nombre, setNombre] = useState(CNJ_NOMBRE);
  const [eslogan, setEslogan] = useState(CNJ_ESLOGAN);
  const [logoUrl, setLogoUrl] = useState(CNJ_LOGO_URL);

  useEffect(() => {
    void container.configuracion
      .obtener()
      .then((c) => {
        setNombre(c.empresaNombre?.trim() || CNJ_NOMBRE);
        setEslogan(c.empresaEslogan?.trim() || CNJ_ESLOGAN);
        setLogoUrl(c.empresaLogoUrl?.trim() || CNJ_LOGO_URL);
      })
      .catch(() => {
        /* valores CNJ por defecto */
      })
      .finally(() => setCargando(false));
  }, []);

  return (
    <section
      className="welcome-panel no-print"
      aria-labelledby="welcome-panel-title"
      style={{ backgroundImage: `url(${CNJ_PANEL_HERO_URL})` }}
    >
      <div className="welcome-panel__overlay" aria-hidden="true" />
      <div className="welcome-panel__content">
        {cargando ? (
          <p className="welcome-panel__loading">Cargando…</p>
        ) : (
          <>
            <div className="welcome-panel__logo-wrap">
              <img className="welcome-panel__logo" src={logoUrl} alt={`Logo de ${nombre}`} width={128} height={128} />
            </div>
            <h1 className="welcome-panel__nombre" id="welcome-panel-title">{nombre}</h1>
            <p className="welcome-panel__eslogan">{eslogan}</p>
            <p className="welcome-panel__guia">Selecciona una opción del menú lateral para comenzar.</p>
          </>
        )}
      </div>
    </section>
  );
}
