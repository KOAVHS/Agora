# Agora

## Desarrollo local

Este repo tiene dos partes:
- `backend`: API de FastAPI
- `mobile`: app Expo

### Backend

Instala dependencias de desarrollo en el entorno Python:

```bash
pip install -r backend/requirements.txt
```

Arrancar el backend:

- Windows PowerShell:
  ```powershell
  cd backend
  .\run.ps1
  ```

- macOS/Linux:
  ```bash
  cd backend
  ./run.sh
  ```

También puedes ejecutar directamente:

```bash
cd backend
python -m uvicorn app.main:app --reload
```

### Mobile

Arranca Expo desde la carpeta `mobile`:

```bash
cd mobile
npx expo start
```

### Desarrollo conjunto

Para iniciar backend y mobile juntos en desarrollo:

- Windows PowerShell:
  ```powershell
  .\run-dev.ps1
  ```

- macOS/Linux:
  ```bash
  ./run-dev.sh
  ```

### Notas

- Los scripts son para desarrollo local.
- En producción, la app móvil se debe construir/distribuir con Expo y el backend se ejecuta como un servidor ASGI.
