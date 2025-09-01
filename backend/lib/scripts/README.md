# Word Generation Script

This script uses OpenAI's Responses API with structured outputs to generate words for themes.

## Setup

1. Create a `.env` file in the `backend` directory with your OpenAI API key:
```
OPENAI_API_KEY=your_openai_api_key_here
```

2. Make sure you have the required dependencies installed:
```bash
npm install js-yaml dotenv
```

## Usage

```bash
node get_words_using_ai.js <theme_type>
```

### Examples

```bash
# Generate words for food theme
node get_words_using_ai.js food

# Generate words for jobs theme
node get_words_using_ai.js jobs

# Generate words for music theme
node get_words_using_ai.js music
```

## Output

The script will:
1. Generate exactly 20 words for the specified theme
2. Each word will be 1-3 words long maximum
3. Words will be provided in English, Korean, and Italian
4. Results will be saved to a timestamped YAML file in `words/` directory
5. Sample words will be displayed in the console

## Generated YAML Structure

```yaml
theme:
  type: food
  name: Food
  generated_at: 2024-01-15T10:30:00.000Z
  word_count: 20
words:
  - apple
  - banana
  - bread
  - cheese
  - pizza
  # ... 15 more words
```

## Features

- Uses OpenAI's latest `gpt-5` model
- Structured outputs ensure consistent JSON format
- Error handling for API failures and parsing errors
- Timestamped output files for easy review
- English word generation only
- Command-line interface with helpful usage instructions
