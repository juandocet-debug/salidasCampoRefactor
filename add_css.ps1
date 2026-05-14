Add-Content -Path "frontend\src\features\salidas\presentacion\componentes\AppEstudiante\AppEstudiante.css" -Encoding UTF8 -Value @"

/* Tarjetas premium Mis Salidas */
.app-est__card-item {
  display: flex;
  align-items: center;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 14px;
  margin-bottom: 10px;
  overflow: hidden;
  position: relative;
  transition: background 0.15s;
}
.app-est__card-item:active { background: rgba(255,255,255,0.08); }
.app-est__card-color-bar { width: 4px; align-self: stretch; flex-shrink: 0; }
.app-est__card-ico {
  width: 44px; height: 44px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  margin: 10px 10px 10px 8px; flex-shrink: 0;
}
.app-est__card-ico svg { width: 22px; height: 22px; }
.app-est__card-body {
  flex: 1; min-width: 0; padding: 10px 6px 10px 0;
  display: flex; flex-direction: column; gap: 3px;
}
.app-est__card-row1 { display: flex; align-items: flex-start; justify-content: space-between; gap: 6px; }
.app-est__card-nombre {
  font-size: 0.85rem; font-weight: 700; color: #e2e8f0; line-height: 1.2;
  display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;
}
.app-est__card-sub {
  font-size: 0.7rem; color: #64748b; font-weight: 500;
  display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;
}
.app-est__card-row3 { font-size: 0.7rem; color: #94a3b8; font-weight: 500; display: flex; flex-wrap: wrap; gap: 2px; }
.app-est__card-chevron { padding: 0 12px; color: #475569; flex-shrink: 0; }
"@
Write-Host "Done"
