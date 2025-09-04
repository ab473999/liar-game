# Theme & Word Data Management

This directory contains exported YAML files with themes and words from the database.

## Scripts

### Export from Database to YAML
```bash
# Export with auto-generated timestamp filename
node ../export_to_yaml.js

# Export to specific filename
node ../export_to_yaml.js my_themes.yml
```

### Import from YAML to Database
```bash
# Merge mode (default) - adds new items, updates existing, keeps items not in YAML
node ../import_from_yaml.js themes_export_2025-09-04.yml --merge

# Replace mode - syncs exactly with YAML (deletes items not in YAML)
node ../import_from_yaml.js themes_export_2025-09-04.yml --replace

# Add-only mode - only adds new items, doesn't update or delete
node ../import_from_yaml.js themes_export_2025-09-04.yml --add-only

# Dry run - preview changes without applying
node ../import_from_yaml.js themes_export_2025-09-04.yml --dry-run

# Verbose output
node ../import_from_yaml.js themes_export_2025-09-04.yml --verbose
```

## Workflow

1. **Export current data**: `node ../export_to_yaml.js`
2. **Edit the YAML file** manually with your changes
3. **Import back to database**: `node ../import_from_yaml.js <filename> --replace`

## YAML Structure

```yaml
metadata:
  exported_at: "2025-09-04T21:13:12.144Z"
  total_themes: 23
  total_words: 652
  version: "1.0"
themes:
  - type: activity        # Theme identifier (don't change this)
    name: Activities      # Display name (can be edited)
    words:                # Word list (can add/remove/edit)
      - Camping
      - Cooking
      - Dancing
      # ... more words
```

## Important Notes

- Use `--replace` mode when you want deletions in the YAML to be reflected in the database
- Use `--merge` mode when you only want to add new content without removing existing data
- Always use `--dry-run` first to preview changes before applying them
- Theme `type` field should not be changed (it's the unique identifier)
- Theme `name` and `words` can be freely edited
