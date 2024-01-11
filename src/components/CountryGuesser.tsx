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
            <Controls handleZoomIn={handleZoomIn} handleZoomOut={handleZoomOut} showSettings={showSettings} handleShowSettings={handleShowSettings} />
            <ComposableMap className="w-full h-full bg-blue-500">
              <ZoomableGroup zoom={position.zoom} center={position.coordinates} onMoveEnd={handleMoveEnd}>
                <Geographies geography={geoJSON}>
                  {({ geographies }) =>
                    geographies.map((geo) => (
                      <Geography className={`outline-none fill-current stroke-neutral-100 stroke-[0.1px] ${correct.includes(geo.properties.name) ? 'text-green-600' : 'text-neutral-800 cursor-pointer hover:text-neutral-100'}`} key={geo.rsmKey} geography={geo} onClick={() => handleGeoClick(geo)} />
                    ))
                  }
                </Geographies>
              </ZoomableGroup>
            </ComposableMap>
            { showSettings &&
              <div className="absolute flex flex-col right-2 top-14 w-36 bg-white border-black rounded overflow-hidden shadow-lg">
                <button className="bg-black hover:bg-neutral-800 text-white font-bold border-none py-2 px-4" onClick={handleRestartClick}>restart</button>
                <button className="bg-black hover:bg-neutral-800 text-white font-bold border-none py-2 px-4" onClick={handleMenuClick}>home</button>
              </div>
            }
            { inGameCountdown &&
              <div className="absolute flex items-center justify-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-neutral-500 bg-opacity-50">
                <p className="text-8xl text-white text-bold">{countdown}</p>
              </div>
            }
          </div>
        :
          <div className="relative w-full h-full flex items-center justify-center bg-orange-300">
            <div className="absolute top-2 left-2">
              <button className="text-white drop-shadow text-lg font-semibold hover:pl-1" onClick={handleMenuClick}>back</button>
            </div>
            <div className="flex flex-col w-10/12 max-w-80 h-64">
              <p className="text-white text-3xl font-bold drop-shadow text-center p-2">Country Guesser</p>
              <p className="text-white text-lg drop-shadow p-2 text-center">Find every country as fast as possible. The current country will be displayed in the top left.</p>
              <button className="mt-auto m-4 bg-white hover:bg-neutral-100 text-orange-300 font-bold border-none shadow-lg py-2 px-4 rounded-sm" onClick={handleGameCountdown}>start</button>
            </div>
          </div>
        }
        
      </div>
    </>
  )
}

type ControlsPropsTypes = {
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  showSettings: boolean;
  handleShowSettings: () => void;
}

function Controls({ handleZoomIn, handleZoomOut, showSettings, handleShowSettings }: ControlsPropsTypes) {
  return (
    <>
      <div className="absolute right-0 flex gap-2 p-2">
        <button className="p-2 bg-black text-white rounded-full drop-shadow" onClick={handleZoomIn}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
        <button className="p-2 bg-black text-white rounded-full drop-shadow" onClick={handleZoomOut}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
          </svg>
        </button>
        <button className={`p-2 rounded-full drop-shadow ${showSettings ? 'bg-white text-black' : 'bg-black text-white'}`} onClick={handleShowSettings}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </>
  )
}

function CountryToSelect({ currCountry }: { currCountry: string }) {
  return (
    <>
      <div className="absolute left-0 top-0 p-2">
        <p className="text-3xl tracking-wider text-white font-semibold drop-shadow">{currCountry}</p>
      </div>
    </>
  )
}