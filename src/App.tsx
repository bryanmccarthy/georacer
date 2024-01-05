import World from './components/World';

function App() {

  return (
    <>
      <div className="h-[calc(100dvh)]">
        <div className="h-[calc(5dvh)] text-2xl font-bold text-center">Header</div>
        <World />
      </div>
    </>
  )
}

export default App
