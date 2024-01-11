import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps'
import geoJSON from '../geoData/countries.json'
import { countriesList } from '../geoData/countries.ts'
import { useState } from 'react'
import useWindowDimensions from '../hooks/useWindowDimensions.tsx'

type Position = {
  coordinates: [number, number],
  zoom: number
}

export default function CountryGuesser({ setGameState }: { setGameState: (state: string) => void}) {
  const windowDimensions = useWindowDimensions();
  let zoom = windowDimensions.width < 400 ? 3 : windowDimensions.width < 700 ? 2 : windowDimensions.width < 1000 ? 1.5 : 1;
  const [position, setPosition] = useState<Position>({ coordinates: [0, 0], zoom: zoom });
  const [countries, setCountries] = useState<string[]>(countriesList);
  const [correct, setCorrect] = useState<string[]>([]);
  const [currCountry, setCurrCountry] = useState<string>('');
  const [gameActive, setGameActive] = useState(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<string>('3');
  const [inGameCountdown, setInGameCountdown] = useState<boolean>(false);

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

  const initialGameState = () => {
    setCurrCountry(countries[Math.floor(Math.random() * countries.length)]);
  }

  const handleShowSettings = () => {
    setShowSettings(!showSettings);
  }

  const handleRestartClick = () => {
    setCountries(countriesList);
    setCurrCountry('');
    setCorrect([]);
    setShowSettings(false);
    handleGameCountdown();
  }

  const handleMenuClick = () => {
    setGameState('menu');
  }

  const timeout = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // TODO: refactor this
  const handleGameCountdown = async () => {
    setGameActive(true);
    setInGameCountdown(true);
    await timeout(1000).then(() => {
      setCountdown('2');
    })
    await timeout(1000).then(() => {
      setCountdown('1');
    })
    await timeout(1000).then(() => {
      setCountdown('GO!');
    })
    await timeout(600).then(() => {
      initialGameState();
      setInGameCountdown(false);
      setCountdown('3');
    })
  }
  
  // TODO: add resize listener to zoom in/out on window resize
  // TODO: set initial zoom based on window size

  return (
    <>
      <div className="w-full h-full overflow-hidden">
        { gameActive ?
          <div className="relative w-full h-full overflow-hidden">
            <CountryToSelect currCountry={currCountry} />
            <Controls handleZoomIn={handleZoomIn} handleZoomOut={handleZoomOut} handleShowSettings={handleShowSettings} />
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
            { showSettings &&
              <div className="absolute flex flex-col right-2 top-14 w-36 h-36 bg-white border-black rounded overflow-hidden shadow-lg">
                <button className="bg-white hover:bg-neutral-100 text-orange-300 font-bold border-none py-2 px-4" onClick={handleRestartClick}>restart</button>
                <button className="bg-white hover:bg-neutral-100 text-orange-300 font-bold border-none py-2 px-4" onClick={handleMenuClick}>menu</button>
              </div>
            }
            { inGameCountdown &&
              <div className="absolute flex items-center justify-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-neutral-500 bg-opacity-50">
                <p className="text-8xl text-white text-bold">{countdown}</p>
              </div>
            }
          </div>
        :
          <div className="w-full h-full flex items-center justify-center bg-orange-300">
            <button className="bg-white hover:bg-neutral-100 text-orange-300 font-bold border-none shadow-lg py-2 px-4 rounded-sm" onClick={handleGameCountdown}>start</button>
          </div>
        }
        
      </div>
    </>
  )
}

type ControlsPropsTypes = {
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleShowSettings: () => void;
}

function Controls({ handleZoomIn, handleZoomOut, handleShowSettings }: ControlsPropsTypes) {
  return (
    <>
      <div className="absolute right-0 flex gap-2 p-2">
        <button className="px-4 py-2 bg-black text-white rounded-md" onClick={handleZoomIn}>+</button>
        <button className="px-4 py-2 bg-black text-white rounded-md" onClick={handleZoomOut}>-</button>
        <button className="px-4 py-2 bg-black text-white rounded-md" onClick={handleShowSettings}>=</button>
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