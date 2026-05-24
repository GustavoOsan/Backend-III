# AdoptMe - Backend API 🐾

Proyecto final para el curso de Backend III. Esta API RESTful gestiona la adopción de mascotas, implementando arquitectura por capas, testing funcional, documentación y despliegue contenerizado.

## 🚀 Tecnologías Utilizadas
* Node.js & Express
* MongoDB & Mongoose
* Jest & Supertest (Testing)
* Docker & DockerHub
* Swagger (Documentación)

## 📦 Imagen Docker
La aplicación ha sido contenerizada y la imagen pública está disponible en DockerHub para su fácil consumo.
* **URL de DockerHub:** https://hub.docker.com/r/gustavoosan/adoptme-final
* **Comando para descargar la imagen:** ```bash
docker pull gustavoosan/adoptme-final:v1
```

## 🛠️ Instrucciones de Ejecución Local

1. **Clonar el repositorio:**
```bash
git clone [https://github.com/GustavoOsan/Backend-III.git](https://github.com/GustavoOsan/Backend-III.git)
cd BACKEND-III
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Ejecutar tests funcionales:**
```bash
npm test
```

4. **Ejecutar la aplicación usando Docker (Local):**
```bash
docker build -t gustavoosan/adoptme-final:v1 .
docker run -p 8080:8080 --env-file .env gustavoosan/adoptme-final:v1
```