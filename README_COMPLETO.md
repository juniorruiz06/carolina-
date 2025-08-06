# 🌟 Contigo Wellspring - Tu Compañero de Bienestar Integral

Una aplicación móvil de bienestar diseñada para acompañarte en tu journey emocional, académico y de salud, potenciada por inteligencia artificial.

## 🚀 Características Principales

### ✨ Diseño Móvil Nativo
- **Interface de Glassmorphism**: Diseño moderno con efectos de cristal
- **Navegación Intuitiva**: Tab bar inferior tipo iOS/Android
- **Animaciones Fluidas**: Transiciones suaves y micro-interacciones
- **Responsive Design**: Optimizado para todas las pantallas

### 🧠 Inteligencia Artificial Integrada
- **Claude AI**: Asistente conversacional inteligente
- **Apoyo Emocional**: Consejos personalizados para bienestar mental
- **Asistencia Académica**: Ayuda con estudios y organización
- **Consejos de Salud**: Recomendaciones de estilo de vida saludable
- **Historial de Conversaciones**: Seguimiento de interacciones con IA

### 📱 Módulos de Bienestar
- **Módulo Emocional**: Seguimiento del estado de ánimo y diario
- **Módulo Académico**: Técnicas de estudio y organización
- **Módulo de Salud**: Hábitos saludables y recordatorios
- **Panel de IA**: Chat inteligente con Claude

### 🔧 Tecnologías Utilizadas
- **Frontend**: React 18 + TypeScript + Vite
- **Mobile**: Capacitor para compilación nativa
- **UI**: Tailwind CSS + shadcn/ui + Radix UI
- **Base de Datos**: Supabase (PostgreSQL)
- **IA**: Anthropic Claude API
- **Autenticación**: Supabase Auth
- **Estado**: React Query + Context API

## 📋 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ y npm
- Java JDK 11 o 17
- Android Studio con SDK
- Git

### 1. Clonar y Configurar
```bash
git clone <tu-repositorio>
cd contigo-wellspring
npm install
```

### 2. Configurar Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key

# Anthropic Claude API Configuration
VITE_ANTHROPIC_API_KEY=tu_claude_api_key_aqui
VITE_ANTHROPIC_API_URL=https://api.anthropic.com/v1/messages

# App Configuration
VITE_APP_NAME=Contigo Wellspring
VITE_APP_VERSION=1.0.0
VITE_APP_DESCRIPTION=Tu compañero de bienestar integral
```

### 3. Configurar Claude API

#### Obtener API Key de Claude:
1. Ve a [console.anthropic.com](https://console.anthropic.com)
2. Crea una cuenta o inicia sesión
3. Ve a "API Keys" en el panel
4. Genera una nueva API key
5. Copia la key y agrégala a tu `.env`

#### Configuración de Billing:
- Claude requiere configurar un método de pago
- Los primeros $5 USD suelen ser gratuitos
- Revisa la documentación de precios de Anthropic

### 4. Configurar Supabase

#### Base de Datos:
Crea las siguientes tablas en tu proyecto Supabase:

```sql
-- Tabla para interacciones con IA
CREATE TABLE ai_interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  interaction_type TEXT CHECK (interaction_type IN ('emotional', 'academic', 'health')),
  user_query TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejor performance
CREATE INDEX ai_interactions_user_id_idx ON ai_interactions(user_id);
CREATE INDEX ai_interactions_type_idx ON ai_interactions(interaction_type);
CREATE INDEX ai_interactions_created_at_idx ON ai_interactions(created_at DESC);

-- Políticas de seguridad (Row Level Security)
ALTER TABLE ai_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own interactions" ON ai_interactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own interactions" ON ai_interactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

## 🏗️ Construcción de APK

### Método 1: Construcción Local

```bash
# Construir aplicación web
npm run build

# Sincronizar con Capacitor
npx cap sync

# Abrir Android Studio
npx cap open android
```

En Android Studio:
1. Espera a que termine la sincronización
2. Ve a **Build > Build Bundle(s) / APK(s) > Build APK(s)**
3. El APK se genera en `android/app/build/outputs/apk/debug/`

### Método 2: Script Automatizado
```bash
# Ejecutar script de construcción
.\build-apk.bat  # En Windows
./build-apk.sh   # En macOS/Linux
```

### Método 3: GitHub Actions (Construcción en la Nube)

#### Configurar Secrets en GitHub:
1. Ve a tu repositorio en GitHub
2. Settings > Secrets and variables > Actions
3. Agrega estos secrets:

```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
VITE_ANTHROPIC_API_KEY=tu_claude_api_key
```

#### Para APK de Release:
```
ANDROID_KEYSTORE_FILE=base64_encoded_keystore
ANDROID_KEYSTORE_PASSWORD=password_del_keystore
ANDROID_KEY_ALIAS=alias_de_la_key
ANDROID_KEY_PASSWORD=password_de_la_key
```

#### Triggers del Workflow:
- **Push a main/develop**: Construye APK debug automáticamente
- **Tag de version**: Construye APK de release firmado
- **Manual**: Trigger manual desde Actions tab

## 🎯 Funcionalidades Implementadas

### ✅ Módulo de IA
- Chat conversacional con Claude AI
- Respuestas contextuales según el módulo (emocional, académico, salud)
- Historial de conversaciones guardado en Supabase
- Manejo de errores y estados de carga
- Sugerencias rápidas predefinidas

### ✅ Interface Móvil
- Dashboard principal con métricas
- Sistema de navegación con tabs
- Sheets/Modales para acciones secundarias
- Notificaciones push simuladas
- Floating Action Button para asistente de voz

### ✅ Autenticación
- Sistema completo de login/registro
- Recuperación de contraseña
- Persistencia de sesión
- Integración con Supabase Auth

## 🔮 Próximas Funcionalidades

### 🚧 En Desarrollo
- **Agentes IA Especializados**: Diferentes personalidades de IA
- **Análisis de Sentimientos**: Procesamiento de emociones en tiempo real
- **Recordatorios Inteligentes**: Notificaciones basadas en IA
- **Integración con Wearables**: Sincronización con dispositivos de salud

### 📝 Backlog
- **Modo Offline**: Funcionalidad básica sin conexión
- **Temas Personalizables**: Dark mode y colores personalizados
- **Gamificación**: Sistema de logros y progreso
- **Comunidad**: Funciones sociales básicas

## 🛡️ Seguridad y Privacidad

### 🔒 Medidas Implementadas
- **Cifrado en Tránsito**: HTTPS/TLS en todas las comunicaciones
- **Row Level Security**: Políticas de acceso en Supabase
- **API Key Protection**: Variables de entorno seguras
- **Validación de Entrada**: Sanitización de inputs del usuario

### 📋 Cumplimiento
- **GDPR Ready**: Estructura preparada para cumplimiento
- **Data Retention**: Políticas de retención de datos
- **User Consent**: Flujos de consentimiento implementables

## 🧪 Testing

### Comandos de Testing
```bash
# Ejecutar todos los tests
npm test

# Tests con coverage
npm run test:coverage

# Tests en modo watch
npm run test:watch
```

### Testing Manual
1. **Funcionalidad de IA**: Probar con y sin API key configurada
2. **Navegación**: Verificar todas las transiciones de pantalla
3. **Autenticación**: Probar login, registro y recuperación
4. **Responsive**: Probar en diferentes tamaños de pantalla

## 📊 Performance

### Optimizaciones Implementadas
- **Code Splitting**: Carga diferida de módulos
- **Image Optimization**: Compresión y lazy loading
- **Bundle Analysis**: Análisis de tamaño de bundles
- **Caching Strategy**: Cache inteligente de recursos

### Métricas Objetivo
- **First Paint**: < 1.5s
- **Bundle Size**: < 1MB gzipped
- **Lighthouse Score**: > 90

## 🤝 Contribución

### Estructura del Proyecto
```
src/
├── components/          # Componentes reutilizables
│   ├── ai/             # Componentes específicos de IA
│   ├── auth/           # Componentes de autenticación
│   ├── mobile/         # Componentes optimizados para móvil
│   └── ui/             # Componentes base de UI
├── hooks/              # Custom hooks
├── pages/              # Páginas principales
├── services/           # Servicios y APIs
├── integrations/       # Integraciones externas
└── types/              # Definiciones de tipos TypeScript
```

### Guidelines de Código
- **TypeScript**: Tipado estricto obligatorio
- **ESLint/Prettier**: Formateo automático configurado
- **Commit Conventions**: Conventional commits
- **Branch Strategy**: GitFlow modificado

## 📞 Soporte

### Problemas Comunes

#### "Claude AI no responde"
1. Verifica que `VITE_ANTHROPIC_API_KEY` esté configurada
2. Confirma que tienes crédito en tu cuenta Anthropic
3. Revisa la consola del navegador por errores

#### "APK no se construye"
1. Verifica Java JDK instalado (11 o 17)
2. Confirma Android SDK configurado
3. Ejecuta `npm run build` antes de `npx cap sync`

#### "Supabase no conecta"
1. Verifica URLs y keys en `.env`
2. Confirma que las tablas existen en Supabase
3. Revisa políticas de Row Level Security

### Contacto
- **Issues**: Usa GitHub Issues para reportar bugs
- **Features**: Abre Discussion para nuevas características
- **Security**: Contacta directamente para vulnerabilidades

## 📜 Licencia

Este proyecto está bajo licencia MIT. Ver `LICENSE` para más detalles.

---

**¡Desarrollado con ❤️ para acompañar tu bienestar integral!**
