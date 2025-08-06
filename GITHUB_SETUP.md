# 🚀 Configuración de GitHub para Carolina Wellspring

## 📋 Pasos para configurar el repositorio

### 1. Crear el repositorio en GitHub
1. Ve a [GitHub](https://github.com/juniorruiz06)
2. Crea un nuevo repositorio llamado `carolina-`
3. **NO** inicialices con README, .gitignore o licencia (ya los tenemos)

### 2. Configurar Secrets en GitHub

Ve a tu repositorio → Settings → Secrets and variables → Actions

#### Secrets requeridos:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key_aqui

# Anthropic Claude API
VITE_ANTHROPIC_API_KEY=sk-ant-api03-tu_claude_api_key_aqui

# Android Signing (para APK release)
ANDROID_KEYSTORE_FILE=base64_encoded_keystore_file
ANDROID_KEYSTORE_PASSWORD=tu_keystore_password
ANDROID_KEY_ALIAS=tu_key_alias
ANDROID_KEY_PASSWORD=tu_key_password
```

### 3. Generar Keystore para Android (Opcional - para releases)

```bash
# Generar keystore
keytool -genkey -v -keystore carolina-release-key.keystore -alias carolina-key -keyalg RSA -keysize 2048 -validity 10000

# Convertir a base64 para GitHub Secret
base64 -i carolina-release-key.keystore | pbcopy  # macOS
base64 -w 0 carolina-release-key.keystore         # Linux
certutil -encode carolina-release-key.keystore carolina-release-key.txt  # Windows
```

### 4. Configurar Branch Protection (Recomendado)

1. Ve a Settings → Branches
2. Add rule para `main`:
   - ✅ Require status checks to pass
   - ✅ Require branches to be up to date
   - ✅ Require pull request reviews

## 🔄 Flujo de trabajo automatizado

### APK Debug (Automático)
- **Trigger**: Push a `main` o `develop`
- **Output**: APK debug en Actions → Artifacts
- **Tiempo**: ~5-10 minutos

### APK Release (Con Tag)
```bash
# Crear release
git tag v1.0.0
git push origin v1.0.0
```
- **Output**: APK firmado + GitHub Release
- **Tiempo**: ~8-15 minutos

## 📱 Descargar APKs

### Desde GitHub Actions
1. Ve a Actions tab
2. Selecciona el workflow run
3. Descarga desde "Artifacts"

### Desde Releases
1. Ve a Releases tab
2. Descarga el APK adjunto

## 🛠️ Comandos útiles

```bash
# Ver status del repositorio
git status
git remote -v

# Subir cambios
git add .
git commit -m "feat: nueva funcionalidad"
git push origin main

# Crear release
git tag v1.0.1
git push origin v1.0.1

# Ver logs de build
git log --oneline
```

## 🔍 Troubleshooting

### Build falla
1. Revisa los logs en Actions
2. Verifica que todos los secrets estén configurados
3. Asegúrate de que las dependencias estén actualizadas

### APK no se genera
1. Verifica que el workflow esté habilitado
2. Revisa permisos del repositorio
3. Confirma que el branch trigger sea correcto

### Keystore issues
1. Verifica que el base64 esté correcto
2. Confirma passwords en secrets
3. Regenera keystore si es necesario

## 📊 Monitoreo

- **Build Status**: Badge en README
- **Actions**: Tab de Actions para logs
- **Releases**: Tab de Releases para APKs
- **Issues**: Para reportar bugs

## 🎯 Próximos pasos

1. ✅ Configurar secrets
2. ✅ Hacer primer push
3. ✅ Verificar build automático
4. ✅ Crear primer release
5. ✅ Descargar y probar APK

---

**¡Tu pipeline de CI/CD está listo! 🚀**