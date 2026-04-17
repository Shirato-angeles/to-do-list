# 🚀 Task Manager App - Prueba Técnica

Aplicación desarrollada con Ionic + Angular + Firebase que permite gestionar tareas con categorías, incluyendo feature flags usando Remote Config.

---

## 🧠 Tecnologías utilizadas

* Ionic Framework
* Angular
* Firebase:

  * Firestore (base de datos)
  * Remote Config (feature flags)
* Capacitor (para builds nativos Android / iOS)

---

## 📱 Funcionalidades

### ✅ Gestión de tareas

* Crear tareas
* Marcar tareas como completadas
* Eliminar tareas

### 🗂️ Categorías

* Crear categorías
* Eliminar categorías
* Asignar categoría a tareas
* Filtrar tareas por categoría

### 🚩 Feature Flags

* Uso de Firebase Remote Config
* Control dinámico para mostrar/ocultar categorías

---

## 🧩 Arquitectura

* `services/` → manejo de lógica y conexión con Firebase
* `models/` → definición de estructuras de datos
* `home/` → pantalla principal (UI + lógica)
* `message/` → componente reutilizable para tareas

---

## ⚙️ Configuración del proyecto

### 1. Clonar repositorio

```bash
git clone <URL_DEL_REPO>
cd to-do-list
```

---

### 2. Instalar dependencias

```bash
yarn 
```

---

### 3. Configurar Firebase

Ir a:

👉 https://console.firebase.google.com/

Crear proyecto y obtener configuración web.

Luego editar:

```bash
src/environments/environment.ts
src/environments/environment.prod.ts
```

Agregar:

```ts
export const environment = {
  production: false,
  firebase: {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "XXXX",
    appId: "XXXX"
  }
};
```

---

### 4. Configurar Firestore

* Crear colección: `categories`
* Estructura:

```json
{
  "name": "Trabajo",
  "createdAt": 123456789
}
```

---

### 5. Configurar Remote Config

Ir a Firebase → Remote Config

Crear parámetro:

```bash
enable_categories
```

Valor:

```bash
true
```

Publicar cambios.

---

## ▶️ Ejecutar en desarrollo

```bash
ionic serve
```

Abrir en navegador:

```bash
http://localhost:8100
```

---

## 📦 Generar build web

```bash
ionic build
```

---

## 🤖 Build Android (APK)

```bash
npx cap add android
npx cap sync android
npx cap open android
```

En Android Studio:

* Build → Build APK(s)

Archivo generado:

```bash
android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 🍎 Build iOS

```bash
npx cap add ios
npx cap sync ios
npx cap open ios
```

En Xcode:

* Product → Archive
* Export → Ad Hoc

---

## 🧪 Pruebas

La app permite:

* Crear tareas
* Asignar categorías
* Filtrar tareas
* Eliminar tareas
* Activar/desactivar categorías dinámicamente con Remote Config

---

## 💡 Decisiones técnicas

* Uso de Firebase para backend serverless
* Feature flags con Remote Config para control dinámico
* Arquitectura modular para escalabilidad
* UI optimizada para experiencia de usuario

---


## 👨‍💻 Autor

Miguel Ángel Hurtado García
