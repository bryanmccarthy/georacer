import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps'
import geoJSON from '../geoData/countries.json'
import { useState } from 'react'

type Position = {
  coordinates: [number, number],
  zoom: number
}

export default function World() {
  const [position, setPosition] = useState<Position>({ coordinates: [0, 0], zoom: 1 });

  const handleZoomIn = () => {
    if (position.zoom >= 4) return;
    setPosition(pos => ({ ...pos, zoom: pos.zoom + 1 }));
  }

  const handleZoomOut = () => {
    if (position.zoom <= 1) return;
    setPosition(pos => ({ ...pos, zoom: pos.zoom - 1 }));
  }

  const handleMoveEnd = (position: any) => {
    setPosition(position);
  }

  const handleGeoClick = (geo: any) => {
    console.log(geo);
  }

  return (
    <>
      <div className="h-full overflow-scroll">
        <Controls handleZoomIn={handleZoomIn} handleZoomOut={handleZoomOut} />
        <ComposableMap className="bg-blue-500">
          <ZoomableGroup zoom={position.zoom} center={position.coordinates} onMoveEnd={handleMoveEnd}>
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

type ControlsProps = {
  handleZoomIn: () => void,
  handleZoomOut: () => void
}

function Controls({ handleZoomIn, handleZoomOut }: ControlsProps) {
  return (
    <>
      <div className="absolute right-0 flex gap-2 p-2">
        <button className="px-4 py-2 bg-black text-white rounded-md" onClick={handleZoomIn}>+</button>
        <button className="px-4 py-2 bg-black text-white rounded-md" onClick={handleZoomOut}>-</button>
      </div>
    </>
  )
}
