import CountryGuesser from './components/CountryGuesser';
import Menu from './components/Menu';
import { useState } from 'react';

// Game States: menu, countryGuesser

function App() {
  const [gameState, setGameState] = useState('menu');

  return (
    <>
      <div className="h-[calc(100dvh)]">
        { gameState === 'menu' &&
          <Menu setGameState={setGameState} />
        }
        { gameState === 'countryGuesser' &&
          <CountryGuesser />
        }
      </div>
    </>
  )
}

export default App
