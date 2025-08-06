@echo off
echo ======================================
echo    Construyendo APK de Contigo Wellspring
echo ======================================

echo.
echo 1. Construyendo aplicación web...
call npm run build

echo.
echo 2. Sincronizando con Capacitor...
call npx cap sync

echo.
echo 3. Abriendo Android Studio para construcción final...
call npx cap open android

echo.
echo ======================================
echo    Instrucciones finales:
echo ======================================
echo 1. Android Studio se abrirá automáticamente
echo 2. Espera a que termine de cargar el proyecto
echo 3. Ve a Build > Build Bundle(s) / APK(s) > Build APK(s)
echo 4. El APK se generará en: android/app/build/outputs/apk/debug/
echo 5. O para release: android/app/build/outputs/apk/release/
echo ======================================

pause
