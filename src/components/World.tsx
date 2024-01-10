import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps'
import geoJSON from '../geoData/countries.json'
import { countriesList } from '../geoData/countries.ts'
import { useState } from 'react'
import useWindowDimensions from '../hooks/useWindowDimensions.tsx'

type Position = {
  coordinates: [number, number],
  zoom: number
}

export default function World() {
  const windowDimensions = useWindowDimensions();
  let zoom = windowDimensions.width < 400 ? 3 : windowDimensions.width < 700 ? 2 : windowDimensions.width < 1000 ? 1.5 : 1;
  const [position, setPosition] = useState<Position>({ coordinates: [0, 0], zoom: zoom });
  const [countries, setCountries] = useState<string[]>(countriesList);
  const [correct, setCorrect] = useState<string[]>([]);
  const [currCountry, setCurrCountry] = useState<string>('');

  const handleZoomIn = () => {
    if (position.zoom >= 4) return;
    setPosition(pos => ({ ...pos, zoom: pos.zoom + 0.5 }));
  }

  const handleZoomOut = () => {
    if (position.zoom <= 1) return;
    setPosition(pos => ({ ...pos, zoom: pos.zoom - 0.5 }));
  }

  const handleMoveEnd = (position: any) => {
    setPosition(position);
  }

  const handleGeoClick = (geo: any) => {
    if (currCountry === geo.properties.name) {
      setCorrect([...correct, currCountry]);
      console.log('correct guess: ' + currCountry); // TODO: remove
      const newCountries = countries.filter((country: string) => country !== currCountry);
      setCountries(newCountries);
      setCurrCountry(newCountries[Math.floor(Math.random() * countries.length)]);
      console.log('correct list: ', correct);
    } else {
      console.log('wrong: ', geo.properties.name);
    }
  }

  const handleStart = () => {
    setCurrCountry(countries[Math.floor(Math.random() * countries.length)]);
  }

  // TODO: add resize listener to zoom in/out on window resize
  // TODO: set initial zoom based on window size

  return (
    <>
      <div className="w-full h-full overflow-hidden">
        {/* TODO: implement proper game start */}
        <button className={`absolute top-0 left-0 m-2 p-2 px-4 bg-black text-white rounded-md ${currCountry === '' ? 'visible' : 'invisible'}`} onClick={handleStart}>Start</button>
        <CountryToSelect currCountry={currCountry} />
        <Controls handleZoomIn={handleZoomIn} handleZoomOut={handleZoomOut} />
        <ComposableMap className="w-full h-full bg-blue-500">
          <ZoomableGroup zoom={position.zoom} center={position.coordinates} onMoveEnd={handleMoveEnd}>
            <Geographies geography={geoJSON}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography className={`outline-none fill-current ${correct.includes(geo.properties.name) ? 'text-green-600 stroke-neutral-800' : 'text-neutral-500 stroke-neutral-800 cursor-pointer hover:text-neutral-600'}`} key={geo.rsmKey} geography={geo} onClick={() => handleGeoClick(geo)} />
                ))
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      </div>
    </>
  )
}

function Controls({ handleZoomIn, handleZoomOut }: { handleZoomIn: () => void, handleZoomOut: () => void }) {
  return (
    <>
      <div className="absolute right-0 flex gap-2 p-2">
        <button className="px-4 py-2 bg-black text-white rounded-md" onClick={handleZoomIn}>+</button>
        <button className="px-4 py-2 bg-black text-white rounded-md" onClick={handleZoomOut}>-</button>
      </div>
    </>
  )
}

function CountryToSelect({ currCountry }: { currCountry: string }) {
  return (
    <>
      <div className="absolute left-0 flex gap-2 p-2">
        <p className="p-2 text-2xl tracking-wider text-white font-bold">{currCountry}</p>
      </div>
    </>
  )
}