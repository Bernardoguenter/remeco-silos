# Testing Guide - Remeco Silos

## Setup Completado ✓

Se ha configurado **Vitest** como framework de testing para tu proyecto Astro. Vitest es una alternativa moderna y rápida a Jest que funciona perfectamente con proyectos Vite y Astro.

### Dependencias Instaladas

- **vitest**: Framework de testing
- **@vitest/ui**: Interfaz visual para los tests
- **@testing-library/dom**: Utilidades para testing de DOM
- **@testing-library/user-event**: Simulación de eventos de usuario
- **happy-dom**: Entorno DOM ligero para tests
- **jsdom**: Alternativa de entorno DOM

## Scripts Disponibles

```bash
# Ejecutar tests en modo watch
pnpm test

# Ejecutar tests con interfaz visual
pnpm test:ui

# Ejecutar tests con cobertura
pnpm test:coverage
```

## Estructura de Tests

Los tests se encuentran en la carpeta `src/__tests__/` con la estructura:

```
src/__tests__/
├── example.test.ts          # Tests básicos de ejemplo
├── formatData.test.ts       # Tests para formatPrices
├── calculatePrice.test.ts   # Tests para getSiloPrice
└── (otros tests)
```

## Tests Creados

### 1. **formatData.test.ts**
Tests para la función `formatPrices` que formatea precios en pesos argentinos.

```typescript
// Ejemplos de tests
- Formatear precio en moneda ARS
- Manejar precio cero
- Manejar precios grandes
- Retornar $0 para NaN
- Formatear con separadores de miles
```

### 2. **calculatePrice.test.ts**
Tests para la función `getSiloPrice` que calcula precios de silos.

```typescript
// Ejemplos de tests
- Calcular precio para silos comederos
- Calcular precio para silos aereos
- Retornar 0 para tipo desconocido
- Retornar 0 si preferences es nulo
- Aplicar markup al precio
- Manejar IVA correctamente
```

### 3. **example.test.ts**
Tests básicos de ejemplo mostrando diferentes tipos de assertions.

## Escribir Nuevos Tests

### Estructura Básica

```typescript
import { describe, it, expect } from 'vitest';

describe('Nombre del módulo', () => {
  it('debe cumplir con este comportamiento', () => {
    const result = myFunction();
    expect(result).toBe(expectedValue);
  });
});
```

### Ejemplo: Testing de una función helper

```typescript
import { describe, it, expect } from 'vitest';
import { misFuncion } from '@helpers/miarchivo';

describe('misFuncion', () => {
  it('debe retornar el resultado esperado', () => {
    const result = misFuncion(10);
    expect(result).toBeGreaterThan(0);
  });

  it('debe manejar casos edge', () => {
    expect(misFuncion(0)).toBe(0);
    expect(misFuncion(-1)).toBeLessThan(0);
  });
});
```

## Matchers Comunes

```typescript
// Igualdad
expect(value).toBe(5)              // Igualdad estricta
expect(value).toEqual({})          // Igualdad profunda

// Números
expect(value).toBeGreaterThan(5)
expect(value).toBeLessThan(10)
expect(value).toBeCloseTo(3.14)

// Strings
expect(message).toContain('hello')
expect(message).toMatch(/pattern/)

// Arrays
expect(items).toHaveLength(3)
expect(items).toContain(value)
expect(items).toEqual([1, 2, 3])

// Objetos
expect(obj).toHaveProperty('key')
expect(obj).toEqual({ key: 'value' })

// Tipos
expect(value).toBeDefined()
expect(value).toBeNull()
expect(value).toBeFalsy()
expect(value).toBeTruthy()
```

## Hooks

```typescript
describe('Suite', () => {
  // Antes de todos los tests
  beforeAll(() => {
    // setup
  });

  // Antes de cada test
  beforeEach(() => {
    // setup
  });

  // Después de cada test
  afterEach(() => {
    // cleanup
  });

  // Después de todos los tests
  afterAll(() => {
    // cleanup
  });
});
```

## Ejecutar Tests Específicos

```bash
# Tests de un archivo específico
pnpm test formatData.test.ts

# Tests con patrón en el nombre
pnpm test --grep "calculatePrice"

# Tests en modo watch
pnpm test --watch

# Tests con verbose output
pnpm test --reporter=verbose
```

## Cobertura de Tests

Ejecutar tests con reporte de cobertura:

```bash
pnpm test:coverage
```

El reporte se genera en `coverage/` con formato HTML. Abre `coverage/index.html` en el navegador.

## Próximos Pasos

1. **Agregar más tests** para tus funciones helper y lógica de negocio
2. **Testing de componentes Astro** (requiere configuración adicional)
3. **Tests de acciones** (form submissions, API calls)
4. **Tests de integración** para workflows completos
5. **CI/CD**: Agregar tests a tu pipeline de deployment

## Recursos

- [Documentación oficial de Vitest](https://vitest.dev)
- [Testing Library Docs](https://testing-library.com)
- [Astro Testing Guide](https://docs.astro.build/es/guides/testing)

---

¡Listo para empezar a escribir tests! 🚀
