export const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-gray-950 border-b border-gray-800">
      {/* Safe area padding for devices with notches */}
      <div className="h-16 pt-safe flex items-center justify-center">
        <h1 className="text-3xl font-normal text-blue-400">LIAR</h1>
      </div>
    </header>
  )
}