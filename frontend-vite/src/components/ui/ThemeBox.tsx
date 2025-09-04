interface ThemeBoxProps {
  name: string
  onClick?: () => void
}

export const ThemeBox = ({ name, onClick }: ThemeBoxProps) => {
  return (
    <div
      className="text-base rounded-3xl cursor-pointer"
      style={{
        backgroundColor: 'var(--mainbutton-bg)',
        border: '1px solid var(--mainbutton-border)',
        color: 'var(--font-primary)',
        padding: '0.75rem',
        aspectRatio: '1 / 1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        wordWrap: 'break-word',
        overflowWrap: 'break-word'
      }}
      onClick={onClick}
    >
      {name}
    </div>
  )
}
