# 🌟 Contigo Wellspring

> Tu compañero de bienestar integral potenciado por IA

Una aplicación móvil moderna diseñada para acompañarte en tu journey de bienestar emocional, académico y de salud, con inteligencia artificial integrada.

![Build Status](https://github.com/tu-usuario/contigo-wellspring/workflows/Build%20Android%20APK/badge.svg)

## ✨ Características

- 🤖 **Asistente IA inteligente** con Claude AI
- 💝 **Apoyo emocional personalizado**
- 📚 **Asistencia académica** y técnicas de estudio
- 🏃‍♀️ **Consejos de salud** y bienestar
- 📱 **Diseño móvil nativo** con Glassmorphism
- 🔄 **Sincronización en la nube** con Supabase

## 🚀 Instalación Rápida

### Prerrequisitos
- Node.js 18+
- NPM o Yarn

### 1. Clonar repositorio
```bash
git clone https://github.com/tu-usuario/contigo-wellspring.git
cd contigo-wellspring
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
cp .env.example .env
# Edita .env con tus claves reales
```

### 4. Ejecutar en desarrollo
```bash
npm run dev
```

## 📱 Generar APK

### Automático (GitHub Actions)
1. Haz push a `main` → Se genera APK debug automáticamente
2. Crea un tag → Se genera APK release firmado

### Manual
```bash
# Construir para Android
npm run build
npx cap sync
npx cap open android

# O usar el script automatizado
.\build-apk.bat
```

## 🔧 Configuración

### Claude AI
1. Crea cuenta en [console.anthropic.com](https://console.anthropic.com)
2. Genera API key
3. Configura en `.env`:
   ```env
   VITE_ANTHROPIC_API_KEY=sk-ant-api03-tu_clave_aqui
   ```

### Supabase
1. Crea proyecto en [supabase.com](https://supabase.com)
2. Configura las tablas (ver `README_COMPLETO.md`)
3. Agrega URL y keys al `.env`

## 🏗️ Tecnologías

- **Frontend**: React 18 + TypeScript + Vite
- **Mobile**: Capacitor + Android Studio
- **UI**: Tailwind CSS + shadcn/ui + Radix UI
- **Backend**: Supabase (PostgreSQL)
- **IA**: Anthropic Claude API
- **Estado**: React Query + Context API

## 📚 Documentación

- 📖 [Guía Completa](./README_COMPLETO.md)
- 🤖 [Configurar Claude AI](./CONFIGURAR_CLAUDE.md)
- 🏗️ [Construir APK](./BUILD_ANDROID.md)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m 'Agregar nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 📞 Soporte

¿Necesitas ayuda? 

- 📚 Revisa la [documentación completa](./README_COMPLETO.md)
- 🐛 Reporta bugs en [Issues](https://github.com/tu-usuario/contigo-wellspring/issues)
- 💬 Únete a las [Discussions](https://github.com/tu-usuario/contigo-wellspring/discussions)

---

**Desarrollado con ❤️ para acompañar tu bienestar integral**
