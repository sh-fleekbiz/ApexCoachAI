# Add await keywords to all repository calls in route files
$routesDir = "H:\Repos\sh-fleekbiz\ApexCoachAI\apps\backend\search\src\routes"

$files = Get-ChildItem "$routesDir\*.ts"

foreach ($file in $files) {
  $content = Get-Content $file.FullName -Raw

  # Add await before repository method calls
  $content = $content -replace '(\s+)(const \w+ = )(\w+Repository\.\w+\()', '$1$2await $3'
  $content = $content -replace '(\s+)(return )(\w+Repository\.\w+\()', '$1$2await $3'
  $content = $content -replace '(\s+)(\w+Repository\.\w+\()', '$1await $2'

  Set-Content $file.FullName $content -NoNewline
  Write-Host "✓ Updated $($file.Name)"
}

Write-Host "`nDone. Please review the changes and rebuild."
