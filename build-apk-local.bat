@echo off
echo ========================================
echo    CAROLINA WELLSPRING - BUILD APK
echo ========================================
echo.

echo [1/5] Instalando dependencias...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Fallo al instalar dependencias
    pause
    exit /b 1
)

echo.
echo [2/5] Construyendo aplicacion web...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Fallo al construir la aplicacion
    pause
    exit /b 1
)

echo.
echo [3/5] Sincronizando con Capacitor...
call npx cap sync android
if %errorlevel% neq 0 (
    echo ERROR: Fallo al sincronizar Capacitor
    pause
    exit /b 1
)

echo.
echo [4/5] Construyendo APK debug...
cd android
call gradlew assembleDebug --no-daemon
if %errorlevel% neq 0 (
    echo ERROR: Fallo al construir APK
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo [5/5] APK generado exitosamente!
echo.
echo Ubicacion del APK:
echo %cd%\android\app\build\outputs\apk\debug\app-debug.apk
echo.
echo ========================================
echo           BUILD COMPLETADO
echo ========================================
echo.
echo Presiona cualquier tecla para abrir la carpeta del APK...
pause >nul
explorer "%cd%\android\app\build\outputs\apk\debug"