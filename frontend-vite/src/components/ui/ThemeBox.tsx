interface ThemeBoxProps {
  name: string
  onClick?: () => void
}

export const ThemeBox = ({ name, onClick }: ThemeBoxProps) => {
  return (
    <div
      className="text-base rounded-3xl cursor-pointer"
      style={{
        backgroundColor: 'var(--color-themebox-bg)',
        border: '1px solid var(--color-themebox-border)',
        color: 'var(--color-themebox-font)',
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
