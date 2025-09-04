# Game Configuration

This directory contains configuration files for the Liar Game.

## Environment Variables

The game can be configured using environment variables. Create a `.env` or `.env.local` file in the `frontend-vite` directory with the following variables:

### `VITE_CAN_FIRST_PLAYER_BE_LIAR`

Controls whether the first player can be selected as the Liar.

- **Type**: Boolean (true/false)
- **Default**: `false` (first player cannot be the Liar)
- **Example**: `VITE_CAN_FIRST_PLAYER_BE_LIAR=false`

When set to `false`, the liar will always be selected from players 2 through N. This ensures the first player to see their word is never the Liar, which can be useful for game balance or specific game modes.

When set to `true`, any player (including the first) can be randomly selected as the Liar.

## Usage

1. Create a `.env` file in the `frontend-vite` directory:
```env
VITE_CAN_FIRST_PLAYER_BE_LIAR=false
```

2. Restart the development server for the changes to take effect.

## Note

In Vite, all environment variables that need to be exposed to the client code must be prefixed with `VITE_`.
