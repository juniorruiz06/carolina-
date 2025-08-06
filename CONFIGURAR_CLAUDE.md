# 🤖 Guía Rápida: Configurar Claude AI

## 📋 Pasos para obtener tu API Key de Claude

### 1. Crear cuenta en Anthropic
- Ve a [console.anthropic.com](https://console.anthropic.com)
- Haz clic en "Sign up" o "Create account"
- Usa tu email y crea una contraseña fuerte

### 2. Verificar tu cuenta
- Revisa tu email y verifica tu cuenta
- Inicia sesión en la consola de Anthropic

### 3. Configurar método de pago
⚠️ **Importante**: Claude requiere tarjeta de crédito aunque tengas créditos gratuitos
- Ve a "Billing" en el menú lateral
- Agrega tu método de pago
- **Los primeros $5 USD suelen ser gratuitos**

### 4. Generar API Key
- Ve a "API Keys" en el menú lateral
- Haz clic en "Create Key"
- Dale un nombre descriptivo (ej: "ContigoApp")
- **¡COPIA LA CLAVE INMEDIATAMENTE!** No se mostrará de nuevo

### 5. Configurar en tu proyecto
Edita tu archivo `.env` y reemplaza la línea:
```env
VITE_ANTHROPIC_API_KEY=tu_clave_claude_aqui
```

Por:
```env
VITE_ANTHROPIC_API_KEY=sk-ant-api03-tu_clave_real_aqui
```

## 🔧 Opciones de Configuración

### Opción A: API Key Directa (Más Fácil)
```env
# En tu archivo .env
VITE_ANTHROPIC_API_KEY=sk-ant-api03-abcd1234...
```

### Opción B: Supabase Edge Function (Más Seguro)
1. Ve a tu proyecto Supabase > Edge Functions
2. Configura el secret `ANTHROPIC_API_KEY` con tu clave
3. La app usará automáticamente la Edge Function

## 🧪 Probar la Configuración

1. Ejecuta la app: `npm run dev`
2. Ve al módulo "IA Chat"
3. Envía un mensaje de prueba
4. Si está bien configurado, Claude responderá

## 🚨 Problemas Comunes

### Error: "API key is not configured"
- Verifica que copiaste la clave completa
- Asegúrate de que comience con `sk-ant-api03`
- Reinicia el servidor después de cambiar el .env

### Error: "Insufficient credits"
- Revisa tu balance en console.anthropic.com
- Agrega crédito a tu cuenta si es necesario

### Error: "Rate limit exceeded"
- Espera un poco antes de enviar más mensajes
- Claude tiene límites de velocidad por seguridad

## 💰 Costos Aproximados

- **Modelo**: claude-3-haiku (más económico)
- **Costo aproximado**: ~$0.001 por conversación típica
- **$5 USD**: ~5,000 conversaciones
- **Recomendación**: Empieza con los $5 gratuitos

## 🔒 Seguridad

- ✅ **NUNCA** compartas tu API key en código público
- ✅ Usa variables de entorno (.env)
- ✅ El archivo .env está en .gitignore
- ✅ Para producción, usa Supabase Edge Function

## 📞 ¿Necesitas Ayuda?

Si tienes problemas:
1. Revisa la consola del navegador (F12)
2. Verifica que la clave sea correcta
3. Confirma que tienes crédito en Anthropic
4. Reinicia el servidor de desarrollo

---

**¡Una vez configurado, tendrás un asistente de IA completamente funcional! 🎉**
