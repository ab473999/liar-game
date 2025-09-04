import { DialogPopup } from '@/components/ui/DialogPopup'
import ReactMarkdown from 'react-markdown'

interface InstructionsDialogProps {
  isOpen: boolean
  onClose: () => void
}

const instructionsMarkdown = `
Welcome to the LIAR Game!

## 1. Setup
After choosing a category, you pass the phone around in a circle.
- Each player silently reads the word on the screen.
- The word will be the same for every player except the liar.
- Once all players have seen their word, put the phone away.

## 2. Making Statements
One by one, players attempt to describe the word (without saying the word itself).
- The liar's goal is to blend in, making their statement sound natural and unsuspicious so they are not identified.

## 3. Discussion
After everyone has spoken, the group discusses who they think the liar might be.
- If everyone agrees on a suspect, move to the next step.
- If there are multiple suspects or no agreement, play another round of statements before deciding.

## 4. Reveal & Scoring
- If the group is wrong about the liar, the real liar earns **2 points**.
- If the group is right, the liar then has a chance to guess the secret word.
  - If they guess correctly, the liar earns **2 points**.
  - If they guess wrong, all other players earn **1 point** each.

## Example:
**Category:** Food | **Word:** Cherry

- **Player 1:** "I am sweet."
- **Player 2 (liar):** "I am expensive."
- **Player 3:** "People eat me in the summer."
- **Player 4:** "My milkshake brings all the boys to the yard."

At this point, players can either accuse someone of being the liar or continue another round for more clues.
`

export const InstructionsDialog = ({ isOpen, onClose }: InstructionsDialogProps) => {
  return (
    <DialogPopup 
      isOpen={isOpen} 
      onClose={onClose}
      title="How to Play"
      className="max-w-2xl"
    >
      <div 
        className="overflow-y-auto max-h-[60vh] px-4 py-4 instructions-content text-xs"
        style={{ color: 'var(--font-primary)' }}
      >
        <ReactMarkdown
          components={{
            h1: ({ children }) => (
              <h1 className="text-base font-bold mb-2" style={{ color: 'var(--header-font-logo)' }}>
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-sm font-semibold mt-3 mb-2" style={{ color: 'var(--font-primary)' }}>
                {children}
              </h2>
            ),
            p: ({ children }) => (
              <p className="mb-2 text-xs" style={{ color: 'var(--font-secondary)' }}>
                {children}
              </p>
            ),
            ul: ({ children }) => (
              <ul className="list-disc list-inside mb-2 space-y-0.5 text-xs">
                {children}
              </ul>
            ),
            li: ({ children }) => (
              <li className="text-xs" style={{ color: 'var(--font-secondary)' }}>
                {children}
              </li>
            ),
            strong: ({ children }) => (
              <strong className="font-semibold" style={{ color: 'var(--font-primary)' }}>
                {children}
              </strong>
            ),
          }}
        >
          {instructionsMarkdown}
        </ReactMarkdown>
      </div>
    </DialogPopup>
  )
}
