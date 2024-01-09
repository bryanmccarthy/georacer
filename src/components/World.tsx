import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps'
import geoJSON from '../geo/countries.json'

export default function World() {

  const handleGeoClick = (geo: any) => {
    console.log(geo)
  }

  return (
    <>
      <div className="w-full h-[calc(95dvh)] overflow-scroll">
        <ComposableMap className="bg-blue-500">
          <ZoomableGroup center={[0, 0]} zoom={1}>
            <Geographies geography={geoJSON}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography key={geo.rsmKey} geography={geo} onClick={() => handleGeoClick(geo)} />
                ))
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      </div>
    </>
  )
}
