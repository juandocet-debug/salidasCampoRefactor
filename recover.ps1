$historyDir = "$env:APPDATA\Code\User\History"
$targetFile = "AppEstudiante.jsx"
$latestTime = 0
$latestFile = ""

Get-ChildItem -Path $historyDir -Filter "entries.json" -Recurse -ErrorAction SilentlyContinue | ForEach-Object {
    $content = Get-Content $_.FullName -Raw | ConvertFrom-Json
    if ($content.resource -like "*$targetFile") {
        foreach ($entry in $content.entries) {
            if ($entry.timestamp -gt $latestTime) {
                $latestTime = $entry.timestamp
                $latestFile = Join-Path $_.DirectoryName $entry.id
            }
        }
    }
}

if ($latestFile) {
    Write-Host "Found backup: $latestFile"
    Copy-Item -Path $latestFile -Destination "frontend\src\features\salidas\presentacion\componentes\AppEstudiante\AppEstudiante.jsx" -Force
    Write-Host "Restored!"
} else {
    Write-Host "No backup found!"
}
