# carolina-

> Aplicación móvil de bienestar integral con IA - Contigo Wellspring

Una aplicación React Native moderna con Capacitor que integra inteligencia artificial para brindar apoyo emocional, académico y de salud personalizado.

![Build Status](https://github.com/juniorruiz06/carolina-/workflows/Build%20Android%20APK/badge.svg)

## ✨ Características Principales

- 🤖 **Asistente IA inteligente** powered by Claude AI
- 💝 **Apoyo emocional personalizado** con análisis de sentimientos
- 📚 **Asistencia académica** y técnicas de estudio avanzadas
- 🏃‍♀️ **Consejos de salud** y seguimiento de bienestar
- 📱 **Diseño móvil nativo** con efectos Glassmorphism
- 🔄 **Sincronización en tiempo real** con Supabase
- 🎙️ **Comandos de voz** integrados
- 🔔 **Notificaciones inteligentes**
- 📊 **Dashboard analítico** de progreso

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+
- Android Studio (para desarrollo Android)
- Git

### 1. Clonar el repositorio
```bash
git clone https://github.com/juniorruiz06/carolina-.git
cd carolina-
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales:
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key

# Anthropic Claude API
VITE_ANTHROPIC_API_KEY=sk-ant-api03-tu_claude_api_key
VITE_ANTHROPIC_API_URL=https://api.anthropic.com/v1/messages

# App Configuration
VITE_APP_NAME=Carolina Wellspring
VITE_APP_VERSION=1.0.0
VITE_APP_DESCRIPTION=Tu compañera de bienestar integral
```

### 4. Ejecutar en desarrollo
```bash
npm run dev
```

## 📱 Generar APK

### 🔄 Automático con GitHub Actions

#### APK Debug (Automático)
- Cada push a `main` o `develop` genera automáticamente un APK debug
- Disponible en la sección "Actions" → "Artifacts"

#### APK Release (Con Tag)
```bash
# Crear y subir tag para release
git tag v1.0.0
git push origin v1.0.0
```

### 🛠️ Manual (Local)
```bash
# Generar APK debug local
npm run cap:build
cd android
./gradlew assembleDebug

# APK estará en: android/app/build/outputs/apk/debug/
```

## 🏗️ Arquitectura del Proyecto

```
src/
├── components/          # Componentes React reutilizables
│   ├── ai/             # Componentes de IA
│   ├── auth/           # Autenticación
│   ├── emotional/      # Módulo emocional
│   ├── mobile/         # Componentes móviles
│   └── ui/             # UI components (shadcn/ui)
├── hooks/              # Custom React hooks
├── pages/              # Páginas principales
├── services/           # Servicios y APIs
├── integrations/       # Integraciones (Supabase)
└── types/              # Definiciones TypeScript
```

## 🔧 Scripts Disponibles

```bash
npm run dev              # Desarrollo web
npm run build            # Build producción
npm run cap:sync         # Sincronizar Capacitor
npm run cap:build        # Build + sync
npm run cap:android      # Abrir Android Studio
npm run cap:run:android  # Ejecutar en Android
```

## 🌐 Configuración de CI/CD

El proyecto incluye GitHub Actions configurado para:

- ✅ Build automático en cada push
- 📦 Generación de APK debug/release
- 🚀 Deploy automático de releases
- 🔒 Firma de APK con keystore seguro

### Secrets requeridos en GitHub:
```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_ANTHROPIC_API_KEY
ANDROID_KEYSTORE_FILE (base64)
ANDROID_KEYSTORE_PASSWORD
ANDROID_KEY_ALIAS
ANDROID_KEY_PASSWORD
```

## 🛡️ Tecnologías Utilizadas

- **Frontend**: React + TypeScript + Vite
- **Mobile**: Capacitor + Android
- **UI**: Tailwind CSS + shadcn/ui + Glassmorphism
- **Backend**: Supabase (Database + Auth + Storage)
- **IA**: Claude AI (Anthropic)
- **CI/CD**: GitHub Actions
- **Build**: Gradle + Android SDK

## 📋 Roadmap

- [ ] Integración con más modelos de IA
- [ ] Modo offline avanzado
- [ ] Sincronización con wearables
- [ ] Análisis predictivo de bienestar
- [ ] Comunidad y social features
- [ ] Versión iOS

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👨‍💻 Autor

**Junior Ruiz** - [@juniorruiz06](https://github.com/juniorruiz06)

---

⭐ ¡Dale una estrella si este proyecto te ayuda!
