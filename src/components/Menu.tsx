
export default function Menu({ setGameState }: { setGameState: (gamestate: string) => void }) {
  return (
    <>
      <div className="w-full h-full grid items-center bg-orange-300">
        <div className="flex flex-col items-center">
          <p className="text-white font-bold text-2xl tracking-widest p-4">GEORACER</p>
          <button className="bg-white hover:bg-neutral-100 text-orange-300 font-bold border-none shadow-lg p-2 rounded-sm" onClick={() => setGameState('countryGuesser')}>
            country guesser
          </button>
        </div>
      </div>
    </>
    )
}