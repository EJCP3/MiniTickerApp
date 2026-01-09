# MiniTicker - Sistema de Solicitudes Internas

Esta es la solución para el Sistema de Mesa de Servicios (MiniTicker). El proyecto consiste en una **Single Page Application (SPA)** moderna, diseñada para ser rápida y reactiva.

### Funcionalidades

Los usuarios del sistema pueden:

- Autenticarse según su rol (Solicitante, Gestor o Administrador) 
- Crear solicitudes de servicio asignadas a diferentes áreas (TI, RRHH, etc.)
- Ver un listado de tickets con filtros por Estado, Prioridad y Área.
- Gestionar el ciclo de vida del ticket: cambiar estados y agregar comentarios.
- Navegar rápidamente usando la Paleta de Comandos (Ninja Keys).
- Exportar tablas de datos a Excel y reportes a PDF.
- Recibir notificaciones en tiempo real (Toasts) sobre las acciones realizadas.

### Screenshot

![MiniTicker App](public/image.png)
![Home](public/Home.png)
![Crear](public/Crear.png)
![Form](public/Form.png)
![Table](public/Table.png)
### Links

- **Live URL:** en proceso...

### Construido con

El proyecto integra un ecosistema de librerías modernas:

**Core & Build**
- Vue 3 
- TypeScript
- Vite
- Vue Router

**UI & Estilos**
- Tailwind CSS 4
- DaisyUI 5
- Vue Sonner (Notificaciones)
- Ninja Keys (Command Palette)
- Fontsource (Zen Kaku Gothic)

**Data & State Management**
- Pinia (Store Global)
- Pinia Colada (Data Fetching & Cache)
- Axios

**Forms & Utils**
- FormKit (Manejo de formularios)
- VueUse (Composables)
- JWT Decode (Auth)
- XLSX & jsPDF (Reportes)