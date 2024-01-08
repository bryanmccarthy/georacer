import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import geoJSON from '../geo/countries.json'

export default function World() {
  return (
    <>
      <div className="w-full h-[calc(95dvh)] overflow-scroll">
        <ComposableMap className="bg-blue-500">
          <Geographies geography={geoJSON}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography key={geo.rsmKey} geography={geo} />
              ))
            }
          </Geographies>
        </ComposableMap>
      </div>
    </>
  )
}
