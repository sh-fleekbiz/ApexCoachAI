# Convert SQLite repositories to PostgreSQL
$files = @(
  "admin-action-log-repository.ts",
  "analytics-repository.ts",
  "invitation-repository.ts",
  "knowledge-base-repository.ts",
  "meta-prompt-repository.ts",
  "program-repository.ts",
  "user-settings-repository.ts",
  "white-label-settings-repository.ts"
)

$basePath = "H:\Repos\sh-fleekbiz\ApexCoachAI\apps\backend\search\src\db"

foreach ($file in $files) {
  $filePath = Join-Path $basePath $file
  Write-Host "Converting $file..."

  $content = Get-Content $filePath -Raw

  # Replace import
  $content = $content -replace "import \{ database \} from './database\.js';", "import { withClient } from '@shared/data';"

  # Replace .prepare patterns - this is complex, so we'll just mark for manual review
  # For now, let's just replace the import and flag the file

  Set-Content $filePath $content -NoNewline
  Write-Host "  ✓ Updated imports for $file (manual fixes still needed)"
}

Write-Host "`n⚠️  Import statements updated. Repository methods still need manual conversion from SQLite to PostgreSQL syntax."
Write-Host "   - Replace database.prepare().run() with withClient + client.query()"
Write-Host "   - Replace ? placeholders with `$1, `$2, etc."
Write-Host "   - Make methods async"
Write-Host "   - Use RETURNING * instead of lastInsertRowid"
