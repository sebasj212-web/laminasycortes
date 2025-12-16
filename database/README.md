# Base de Datos - Láminas y Cortes

## Diseño de la Base de Datos

### Tabla: `quotes` (Cotizaciones)

Almacena todas las cotizaciones creadas por los usuarios.

#### Campos:

**Identificación:**
- `id` (UUID): ID único de la cotización
- `number` (VARCHAR): Número secuencial de cotización (COT-001, COT-002, etc.)
- `user_id` (UUID): Referencia al usuario que creó la cotización

**Información del Cliente:**
- `client_name` (VARCHAR): Nombre del cliente **(requerido)**
- `client_email` (VARCHAR): Email del cliente (opcional)
- `client_phone` (VARCHAR): Teléfono del cliente (opcional)

**Información del Producto:**
- `product_description` (TEXT): Descripción del producto/servicio **(requerido)**
- `product_quantity` (INTEGER): Cantidad **(requerido, > 0)**
- `product_unit_price` (DECIMAL): Precio unitario **(requerido, >= 0)**
- `product_subtotal` (DECIMAL): Subtotal calculado (cantidad × precio)
- `product_iva` (DECIMAL): IVA 16% calculado (subtotal × 0.16)
- `product_total` (DECIMAL): Total calculado (subtotal × 1.16)

**Metadatos:**
- `created_at` (TIMESTAMP): Fecha de creación (automático)
- `updated_at` (TIMESTAMP): Fecha de última actualización (automático)

### Seguridad (Row Level Security - RLS)

Las políticas de seguridad garantizan que:
- ✅ Cada usuario solo puede ver sus propias cotizaciones
- ✅ Cada usuario solo puede crear cotizaciones para sí mismo
- ✅ Cada usuario solo puede modificar/eliminar sus propias cotizaciones
- ✅ No se pueden acceder a cotizaciones de otros usuarios

Esto se hace automáticamente con Supabase usando `auth.uid()`.

### Funciones Auxiliares

**`get_next_quote_number()`**
- Genera automáticamente el siguiente número de cotización
- Formato: COT-001, COT-002, COT-003, etc.
- Siempre en orden secuencial

**`update_updated_at_column()`**
- Actualiza automáticamente el campo `updated_at` cuando se modifica una cotización

### Índices

Para mejorar el rendimiento de las consultas:
- Índice en `user_id` (buscar cotizaciones por usuario)
- Índice en `created_at` (ordenar por fecha, descendente)
- Índice en `number` (buscar por número de cotización)

## Migración desde localStorage

La estructura de datos actual en localStorage:
```javascript
{
  id: 'uuid',
  number: 'COT-001',
  client: { name, email, phone },
  product: { description, quantity, unitPrice, subtotal, iva, total },
  createdAt: 'ISO date'
}
```

Se mapea perfectamente a la estructura de la base de datos, con la adición de:
- `user_id`: Se asignará del usuario autenticado
- `updated_at`: Se genera automáticamente

## Próximos Pasos

1. ✅ Diseño completado
2. ⏳ Crear proyecto en Supabase
3. ⏳ Ejecutar schema.sql en Supabase
4. ⏳ Instalar cliente Supabase
5. ⏳ Implementar servicios
