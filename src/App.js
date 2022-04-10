import "./styles.css";
import { useState, useEffect, useRef, useMemo } from "react";
import Globe from "react-globe.gl";
import d3 from "react-globe.gl";

const App = () => {
  const [countries, setCountries] = useState({ features: [] });
  const [hoverD, setHoverD] = useState();

  useEffect(() => {
    // load data
    fetch(
      "https://vasturiano.github.io/react-globe.gl/example/datasets/ne_110m_admin_0_countries.geojson"
    )
      .then((res) => res.json())
      .then(setCountries);
  }, []);

  // GDP per capita (avoiding countries with small pop)
  const getVal = (feat) =>
    feat.properties.GDP_MD_EST / Math.max(1e5, feat.properties.POP_EST);

  const maxVal = useMemo(() => Math.max(...countries.features.map(getVal)), [
    countries
  ]);

  return (
    <Globe
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
      backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
      lineHoverPrecision={0}
      polygonsData={countries.features.filter(
        (d) => d.properties.ISO_A2 !== "AQ"
      )}
      polygonAltitude={(d) => (d === hoverD ? 0.11 : 0.06)}
      polygonSideColor={() => "rgba(500, 100, 100, 0.95)"}
      polygonStrokeColor={() => "10"}
      polygonCapColor={() => "#104"}
      polygonLabel={({ properties: d }) => `
      <b>${d.ADMIN} (${d.ISO_A2}):</b> <br />
      Population: <i>${d.POP_EST}</i><br />
      Min Temp: <i>${d.MIN_LABEL} °C (note: numbers are not final)</i>
      <br />Max Temp: <i>${d.MAX_LABEL} °C (note: numbers are not final)</i>


    `}
      onPolygonHover={setHoverD}
      polygonsTransitionDuration={300}
    />
  );
};

export default App;
