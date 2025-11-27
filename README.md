# Angular Form Builder

Una herramienta web que genera código TypeScript y HTML para formularios de Angular a partir de un JSON Schema.

## Descripción

Angular Form Builder es una aplicación que permite a los desarrolladores:
- Pegar un JSON Schema que describe un formulario
- Generar automáticamente:
  - Interface TypeScript del modelo
  - FormGroup con Reactive Forms y validaciones
  - Template HTML del formulario
- Copiar el código generado para usarlo en sus proyectos

## Características MVP 1.0

- Soporte para tipos básicos: `string`, `number`, `boolean`
- Validación `required` con `Validators.required`
- Personalización de nombres de modelo y formulario
- Sistema de tabs para visualizar el código generado
- Botones de copiar al portapapeles
- JSON de ejemplo incluido
- Validación de JSON con mensajes de error claros

## Tecnologías

- Angular 19 (Standalone Components)
- TypeScript (strict mode)
- Reactive Forms
- SCSS

## Ejemplo de JSON Schema

```json
{
  "fields": [
    {
      "name": "firstName",
      "type": "string",
      "required": true,
      "label": "Nombre",
      "placeholder": "Ingrese su nombre"
    },
    {
      "name": "age",
      "type": "number",
      "required": false,
      "label": "Edad"
    },
    {
      "name": "isActive",
      "type": "boolean",
      "required": false,
      "label": "Activo"
    }
  ]
}
```

## Estructura del Proyecto

```
src/app/
├── core/
│   ├── models/           # Interfaces y tipos TypeScript
│   ├── services/         # Lógica de negocio (parser, generator)
│   └── utils/            # Funciones helper
├── shared/
│   └── components/       # Componentes reutilizables (json-editor, code-viewer, tabs)
└── pages/
    └── builder/          # Página principal de la aplicación
```

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.10.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
