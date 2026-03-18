$env:PATH = "C:\Program Files\nodejs;" + $env:PATH
Set-Location "C:\Users\Ced-IT\apps\prompt-generator"

Write-Host "Installation des dependances..." -ForegroundColor Cyan
npm install

Write-Host "`nDemarrage du backend (port 3001)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$env:PATH = 'C:\Program Files\nodejs;' + `$env:PATH; Set-Location 'C:\Users\Ced-IT\apps\prompt-generator'; npm run server"

Start-Sleep -Seconds 2

Write-Host "Demarrage du frontend (port 5173)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$env:PATH = 'C:\Program Files\nodejs;' + `$env:PATH; Set-Location 'C:\Users\Ced-IT\apps\prompt-generator'; npm run dev"

Write-Host "`nServeurs lances !" -ForegroundColor Green
Write-Host "Frontend : http://localhost:5173" -ForegroundColor Yellow
Write-Host "Backend  : http://localhost:3001" -ForegroundColor Yellow
