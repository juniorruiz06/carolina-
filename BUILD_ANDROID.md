# Construcción de APK para Contigo Wellspring

## ✅ Configuración Completada

Tu proyecto ya está configurado para generar APKs de Android con las siguientes características:

- **App ID**: `com.contigo.wellspring`
- **Nombre de la App**: `Contigo Wellspring`
- **Framework**: React + Vite + Capacitor
- **Permisos configurados**:
  - Internet y estado de red
  - Almacenamiento (lectura/escritura)
  - Cámara
  - Geolocalización (GPS)

## 📋 Requisitos Previos

Antes de construir el APK, necesitas instalar:

### 1. Java Development Kit (JDK)
```powershell
# Opción 1: Descargar e instalar JDK 11 o 17 desde Oracle o OpenJDK
# https://adoptium.net/ (recomendado)

# Opción 2: Usar Chocolatey (si lo tienes instalado)
choco install openjdk11

# Opción 3: Usar winget
winget install EclipseAdoptium.Temurin.11.JDK
```

### 2. Android Studio
```powershell
# Descargar desde: https://developer.android.com/studio
# O usar winget:
winget install Google.AndroidStudio
```

### 3. Variables de Entorno
Después de instalar Java y Android Studio, configura:
- `JAVA_HOME`: Ruta donde está instalado Java
- `ANDROID_HOME`: Ruta del Android SDK (generalmente en %LOCALAPPDATA%\Android\Sdk)

## 🚀 Scripts Disponibles

### Desarrollo y Construcción Web
```powershell
npm run dev              # Servidor de desarrollo
npm run build            # Construir aplicación web
```

### Scripts de Capacitor
```powershell
npm run cap:sync         # Sincronizar cambios con plataformas nativas
npm run cap:build        # Construir web + sincronizar
npm run cap:android      # Abrir Android Studio
npm run cap:run:android  # Ejecutar en dispositivo Android conectado
```

### Script Automatizado
```powershell
# Ejecutar el script batch que creé:
.\build-apk.bat
```

## 🔨 Proceso de Construcción del APK

### Método 1: Usando el Script Automatizado (Recomendado)
1. Ejecuta: `.\build-apk.bat`
2. Espera a que Android Studio se abra
3. Deja que Android Studio sincronice el proyecto
4. Ve a **Build > Build Bundle(s) / APK(s) > Build APK(s)**

### Método 2: Manual
1. Construir la aplicación web:
   ```powershell
   npm run build
   ```

2. Sincronizar con Capacitor:
   ```powershell
   npx cap sync
   ```

3. Abrir Android Studio:
   ```powershell
   npx cap open android
   ```

4. En Android Studio:
   - Espera a que termine de indexar
   - Ve a **Build > Build Bundle(s) / APK(s) > Build APK(s)**

## 📁 Ubicación de los APKs Generados

- **Debug APK**: `android/app/build/outputs/apk/debug/app-debug.apk`
- **Release APK**: `android/app/build/outputs/apk/release/app-release.apk`

## 🏗️ Construcción en la Nube

Para construir en la nube, puedes usar servicios como:

1. **GitHub Actions** (Gratis para repositorios públicos)
2. **Bitrise**
3. **CodeMagic**
4. **App Center** (Microsoft)

## 🔧 Construcción de APK Release Firmado

Para generar un APK de release para la Play Store:

1. Genera un keystore:
   ```bash
   keytool -genkey -v -keystore contigo-wellspring.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias contigo-wellspring
   ```

2. Configura el signing en `android/app/build.gradle`

3. Construye el APK release desde Android Studio

## 📱 Pruebas

- **Debug**: Instala directamente el APK debug en tu dispositivo
- **Emulador**: Usa Android Studio para crear un emulador
- **Dispositivo físico**: Habilita "Opciones de desarrollador" y "Depuración USB"

## ⚠️ Notas Importantes

- El proyecto usa Supabase, así que necesitarás configurar las variables de entorno correctas
- Los permisos están configurados para funcionalidad completa (cámara, ubicación, etc.)
- El APK debug será considerablemente más grande que el release optimizado
