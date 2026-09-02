# Contexto del proyecto

Estoy desarrollando un SaaS multi-tenant para restaurantes basado en NFC.

La idea es que cada restaurante pueda colocar placas o tags NFC en mesas, barras, entradas, recepción, terraza u otros puntos. Al acercar el teléfono al NFC, el usuario abre una landing pública configurable con acciones como:

- Ver menú
- Conectarse / consultar Wi-Fi
- Dejar reseña en Google
- Abrir Instagram
- Abrir WhatsApp
- Ver promociones
- Visitar sitio web
- Acciones personalizadas

Cada NFC debe poder medirse individualmente.

Ejemplo:

```text
Restaurante
└── Sucursal Cancún Centro
    ├── Mesa 01
    │   └── NFC ABC123
    ├── Mesa 02
    │   └── NFC DEF456
    └── Entrada
        └── NFC XYZ789
```

El dashboard del restaurante debe poder mostrar métricas como:

```text
Taps esta semana: 426

Menú: 282
Wi-Fi: 73
Instagram: 31
Google Reviews: 40
```

También debe permitir consultar métricas por:

- Restaurante
- Sucursal
- Touchpoint
- NFC
- Acción
- Periodo de tiempo


# Stack

Frontend / Full-stack:

- Next.js con App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Server Components cuando sea posible
- Client Components solamente cuando sean necesarios

Backend:

- Next.js Route Handlers
- Server Actions
- No usar Express por ahora

Base de datos / backend services:

- Supabase
- PostgreSQL
- Supabase Auth
- Supabase Storage posteriormente
- Row Level Security

Validación:

- Zod

Estado / fetching del cliente cuando sea necesario:

- TanStack Query

Formularios complejos:

- React Hook Form
- Zod
- @hookform/resolvers

Gráficas:

- Recharts

Hosting:

- Vercel


# Supabase Auth

El proyecto utiliza:

```text
@supabase/supabase-js
@supabase/ssr
```

No utilizar:

```text
@supabase/auth-helpers-nextjs
```

Tenemos clientes separados:

```text
src/lib/supabase/client.ts
src/lib/supabase/server.ts
src/lib/supabase/proxy.ts
src/proxy.ts
```

La autenticación utiliza cookies para SSR.

Actualmente se está implementando:

- Registro email/password
- Inicio de sesión
- Confirmación de correo
- Logout
- Rutas protegidas
- Dashboard

Cuando un usuario se registra se crea automáticamente un registro en `profiles` mediante un trigger de PostgreSQL.


# Arquitectura multi-tenant

Un usuario puede pertenecer a varios restaurantes.

No guardar:

```text
profiles.restaurant_id
profiles.role
```

Los roles pertenecen a la relación usuario-restaurante.

La estructura es:

```text
auth.users
    ↓
profiles
    ↓
restaurant_members
    ↓
restaurants
```

Roles disponibles:

```text
owner
admin
manager
viewer
```


# Modelo de datos

## profiles

Información adicional del usuario de Supabase Auth.

Campos principales:

```text
id uuid PK → auth.users.id
full_name
avatar_url
created_at
updated_at
```


## restaurants

Representa una marca/restaurante.

```text
id bigint identity PK
name
slug UNIQUE
logo_url
instagram_url
website
is_active
created_at
updated_at
```


## restaurant_members

Relaciona usuarios con restaurantes.

```text
id bigint identity PK
restaurant_id
user_id
role
created_at
updated_at

UNIQUE (restaurant_id, user_id)
```

Roles:

```text
owner
admin
manager
viewer
```


## branches

Sucursales.

```text
id bigint identity PK
restaurant_id
name
address
phone
whatsapp
google_review_url
wifi_ssid
wifi_password
timezone
is_active
created_at
updated_at
```

Timezone default:

```text
America/Cancun
```


## touchpoints

Representan los lugares donde se puede colocar un NFC.

No usar una tabla llamada `tables`, porque el producto no está limitado a mesas.

```text
id bigint identity PK
branch_id
name
type
number nullable
is_active
created_at
updated_at
```

Tipos:

```text
table
bar
entrance
terrace
reception
counter
other
```

Ejemplos:

```text
Mesa 01
Mesa 02
Barra
Entrada
Terraza
Recepción
```


## tags

Representa el NFC físico.

```text
id bigint identity PK
touchpoint_id
token UNIQUE
label
is_active
created_at
updated_at
```

La URL pública nunca debe utilizar IDs incrementales.

Debe usar tokens aleatorios.

Ejemplo:

```text
https://dominio.com/t/K8x2Lm91
```

No:

```text
/t/15
```

El NFC siempre guarda una URL permanente.

Si el restaurante cambia el menú, Instagram, WhatsApp, etc., NO debe ser necesario reprogramar físicamente el NFC.


## actions

Configura los botones disponibles en la landing.

```text
id bigint identity PK
restaurant_id
branch_id nullable
type
label
url nullable
is_enabled
sort_order
created_at
updated_at
```

Tipos:

```text
menu
wifi
google_review
instagram
whatsapp
promotion
website
custom
```

Si:

```text
branch_id IS NULL
```

la acción puede considerarse general para el restaurante.

Si tiene `branch_id`, corresponde específicamente a esa sucursal.


## events

Es la tabla principal de analytics.

```text
id bigint identity PK

restaurant_id NOT NULL

branch_id nullable
touchpoint_id nullable
tag_id nullable
action_id nullable

event_name
session_id
device_type
user_agent
referrer
metadata jsonb

created_at
```

Ejemplos de `event_name`:

```text
tap
menu_click
wifi_click
google_review_click
instagram_click
whatsapp_click
promotion_click
website_click
custom_click
```

Los IDs redundantes de:

```text
restaurant_id
branch_id
touchpoint_id
tag_id
```

son intencionales para facilitar analytics.

Los IDs deben determinarse desde el backend, no confiar en IDs enviados por el cliente.


# Flujo NFC público

La URL del NFC será algo similar a:

```text
/t/K8x2Lm91
```

Flujo:

```text
NFC
 ↓
/t/:token
 ↓
buscar tag
 ↓
touchpoint
 ↓
branch
 ↓
restaurant
 ↓
registrar evento "tap"
 ↓
mostrar landing
```

La landing muestra las acciones configuradas para ese restaurante/sucursal.


# Tracking de acciones externas

No enviar directamente al usuario a URLs externas.

Ejemplo incorrecto:

```tsx
<a href={googleReviewUrl}>
```

Preferir:

```text
/go/:actionToken
```

o alguna ruta equivalente.

Flujo:

```text
Usuario toca "Google Reviews"
        ↓
Route Handler
        ↓
registrar google_review_click
        ↓
HTTP redirect
        ↓
Google Reviews
```

Esto evita depender únicamente de eventos JavaScript que podrían no completarse antes de abandonar la página.


# Seguridad de events

Los clientes autenticados pueden LEER eventos de los restaurantes a los que pertenecen.

No permitir:

```text
INSERT
UPDATE
DELETE
```

de eventos directamente desde el cliente.

Los eventos públicos deben insertarse desde Route Handlers del servidor.

Para operaciones públicas sensibles se podrá utilizar un cliente Supabase servidor con `service_role`.

Nunca exponer:

```text
SUPABASE_SERVICE_ROLE_KEY
```

al navegador ni utilizar variables `NEXT_PUBLIC_*` para ella.


# RLS

Todas las tablas públicas tienen RLS habilitado.

Existe un schema:

```text
private
```

con funciones `SECURITY DEFINER` para comprobar:

```text
private.is_restaurant_member()
private.has_restaurant_role()
private.is_branch_member()
private.has_branch_role()
private.is_touchpoint_member()
private.has_touchpoint_role()
private.shares_restaurant_with_user()
```

Estas funciones evitan recursión de RLS con `restaurant_members`.


# Permisos

## viewer

Puede:

- Ver restaurante
- Ver sucursales
- Ver touchpoints
- Ver NFC
- Ver configuración de acciones
- Ver analytics

No puede modificar.


## manager

Puede:

- Todo lo de viewer
- Crear/editar sucursales
- Administrar touchpoints
- Administrar NFC
- Administrar acciones

No administra usuarios.
No elimina restaurante.


## admin

Puede:

- Todo lo del manager
- Editar restaurante
- Administrar managers y viewers
- Eliminar sucursales

No puede eliminar el restaurante.
No debe poder convertir usuarios a owner.


## owner

Control completo del restaurante.

Puede:

- Editar restaurante
- Administrar miembros
- Asignar roles
- Eliminar restaurante


# Creación de restaurantes

No permitir un:

```sql
INSERT restaurants
```

abierto directamente mediante RLS para cualquier usuario autenticado.

El onboarding debe utilizar una operación controlada desde servidor.

Flujo esperado:

```text
Usuario registrado
        ↓
profiles
        ↓
no tiene restaurants
        ↓
/onboarding
        ↓
crear restaurante
        ↓
restaurants
        ↓
restaurant_members
role = owner
        ↓
crear branch inicial
```

Preferentemente crear restaurante + membership + branch inicial en una sola transacción/RPC de PostgreSQL para evitar estados parciales.


# Estructura sugerida del proyecto

Usar aproximadamente:

```text
src/
├── app/
│
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│
│   ├── auth/
│   │   └── confirm/
│
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   ├── restaurant/
│   │   ├── branches/
│   │   ├── touchpoints/
│   │   ├── tags/
│   │   ├── actions/
│   │   └── analytics/
│
│   ├── onboarding/
│   │
│   ├── t/
│   │   └── [token]/
│   │
│   └── api/
│
├── components/
│   ├── ui/
│   ├── auth/
│   ├── dashboard/
│   ├── restaurant/
│   ├── branches/
│   ├── touchpoints/
│   └── analytics/
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── admin.ts
│   │
│   ├── validations/
│   └── utils/
│
├── types/
│
└── proxy.ts
```

No es obligatorio seguir literalmente esta estructura si el proyecto existente ya tiene otra organización coherente.


# Reglas para trabajar en el código

Antes de modificar un módulo:

1. Inspecciona los archivos existentes relacionados.
2. No reemplaces código que ya funciona sin necesidad.
3. Respeta los componentes, estilos y convenciones existentes.
4. Reutiliza componentes de shadcn/ui si ya están instalados.
5. Evita crear componentes gigantes.
6. Separa formularios complejos en componentes.
7. Utiliza Server Components por defecto.
8. Agrega `"use client"` únicamente cuando sea necesario.
9. No hagas fetch de datos privados innecesariamente desde el navegador.
10. Aprovecha Server Components para queries iniciales.
11. Utiliza RLS como seguridad real; las validaciones del frontend son solamente UX.
12. Nunca confíes en `restaurant_id`, `branch_id`, etc. proporcionados por el navegador para operaciones sensibles.
13. Valida formularios con Zod.
14. Maneja errores de Supabase apropiadamente.
15. Usa TypeScript estricto.
16. Evita `any`.
17. No agregues dependencias sin justificar su necesidad.
18. No sobrearquitectures.
19. No crear microservicios.
20. No crear Express API.
21. No crear Prisma; Supabase/PostgreSQL es la capa de datos.
22. Mantener el MVP simple y modular.


# UX

El producto debe sentirse como un SaaS moderno.

Priorizar:

- Interfaces limpias
- Pocos pasos
- Buen empty state
- Loading states
- Skeletons cuando aporten valor
- Feedback con toast
- Responsive
- Dashboard fácil de utilizar por personas no técnicas

Evitar:

- Interfaces demasiado densas
- Mostrar IDs internos al usuario
- Formularios enormes
- Pedir configuraciones técnicas innecesarias


# Orden de desarrollo

Trabajaremos módulo por módulo.

## Módulo 1 — Auth

Implementar y verificar:

- Registro
- Login
- Confirmación de correo
- Logout
- Persistencia de sesión
- Protección de rutas
- Profile automático

No continuar hasta que funcione correctamente.


## Módulo 2 — Onboarding

Si un usuario autenticado no pertenece a ningún restaurante:

```text
/dashboard
    ↓
/onboarding
```

Formulario inicial:

```text
Nombre del restaurante
Nombre de sucursal
Teléfono
WhatsApp
Dirección
```

Al terminar:

```text
crear restaurant
crear restaurant_member owner
crear branch
```

Idealmente mediante una transacción/RPC.


## Módulo 3 — Dashboard shell

Crear:

- Sidebar
- Header
- Selector de restaurante
- Información del usuario
- Logout
- Navegación
- Responsive mobile

Secciones:

```text
Resumen
Sucursales
Puntos NFC
Acciones
Analytics
Configuración
```


## Módulo 4 — Restaurante

Permitir:

- Ver información
- Editar nombre
- Logo
- Instagram
- Website
- Activar/desactivar


## Módulo 5 — Sucursales

CRUD de:

```text
branches
```

Campos:

```text
name
address
phone
whatsapp
google_review_url
wifi_ssid
wifi_password
timezone
is_active
```


## Módulo 6 — Touchpoints

CRUD de:

```text
touchpoints
```

Ejemplos:

```text
Mesa 01
Mesa 02
Barra
Entrada
```

Permitir seleccionar:

```text
type
number
name
```


## Módulo 7 — Tags NFC

CRUD de:

```text
tags
```

Generar automáticamente un token seguro.

Mostrar:

```text
URL NFC
estado
touchpoint
fecha
```

Ejemplo:

```text
https://dominio.com/t/K8x2Lm91
```

Agregar posibilidad de copiar URL.

Posteriormente se puede agregar QR.


## Módulo 8 — Actions

CRUD y ordenamiento de:

```text
menu
wifi
google_review
instagram
whatsapp
promotion
website
custom
```

Permitir:

- Activar/desactivar
- Cambiar label
- Cambiar URL
- Ordenar
- Configuración global
- Configuración específica por sucursal


## Módulo 9 — Landing pública NFC

Ruta:

```text
/go/[token]
```

Debe:

1. Resolver tag.
2. Obtener touchpoint.
3. Obtener branch.
4. Obtener restaurant.
5. Registrar `tap`.
6. Obtener acciones habilitadas.
7. Mostrar landing optimizada para móvil.

Debe cargar muy rápido.

Esta página es una parte crítica del producto.


## Módulo 10 — Redirect tracking

Crear una forma segura de registrar clics antes de enviar al usuario hacia:

- Google Reviews
- Instagram
- WhatsApp
- Website
- Promoción
- Menú externo

No depender solamente de `onClick` del navegador.


## Módulo 11 — Analytics

Dashboard inicial:

KPIs:

```text
Taps hoy
Taps últimos 7 días
Interacciones
Google Review clicks
```

Gráficas:

```text
Taps por día
Acciones más utilizadas
Touchpoints con más actividad
Sucursales con más actividad
```

Filtros:

```text
Hoy
7 días
30 días
Sucursal
Touchpoint
```


## Módulo 12 — Miembros

Más adelante:

- Invitar usuarios
- Cambiar roles
- Eliminar miembros
- Owner/Admin/Manager/Viewer

Agregar protección para evitar eliminar o degradar al último owner.


# Módulos que NO debemos construir todavía

No implementar hasta que el núcleo funcione:

- Stripe
- Suscripciones
- Facturación
- Menús internos complejos
- POS
- Pedidos
- Reservaciones
- Inteligencia artificial
- Microservicios
- Redis
- WebSockets
- Aplicación móvil


# Menús

Inicialmente el botón "Menú" puede apuntar a:

- PDF
- URL externa

Posteriormente implementaremos:

```text
menus
menu_sections
menu_items
```

pero no forma parte del núcleo inicial.


# Forma de trabajar conmigo

Cuando te pida implementar un módulo:

1. Inspecciona primero el código existente.
2. Identifica qué archivos necesitan cambios.
3. Explica brevemente qué vas a cambiar.
4. Implementa directamente los cambios.
5. No me des solamente ejemplos si tienes acceso al repositorio.
6. No reescribas archivos completos si basta modificar una sección.
7. Mantén compatibilidad con lo que ya existe.
8. Si detectas un problema de arquitectura o seguridad, indícalo antes o durante la implementación.
9. Al terminar, dime qué archivos modificaste.
10. Indícame cómo probar el módulo.
11. Si hay errores de TypeScript/lint/build, corrígelos antes de terminar cuando sea posible.


# Primera prioridad

Primero verifica la implementación existente de Auth.

Después construir:

```text
Onboarding
```

El onboarding deberá detectar si el usuario pertenece o no a algún restaurante y crear de forma segura:

```text
restaurant
restaurant_member (owner)
branch inicial
```

No avances al resto de módulos hasta que ese flujo esté funcionando.