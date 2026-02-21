# ImpostorApp

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.10.

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

## Juego "4 en Raya" (Connect Four)

Se ha añadido un juego clásico de 4 en raya con IA de dificultad media-alta.

### Acceso
Navega a `http://localhost:4200/cuatroenraya` o haz clic en el menú si existe la opción.

### Características
- Tablero estándar 7x6.
- Jugador humano (rojo) vs IA (amarillo).
- Detección de victoria horizontal, vertical y diagonal.
- Detección de empate cuando se llena el tablero.
- IA con algoritmo minimax + poda alpha-beta (profundidad 5).

### Estilo y Animaciones
- Fichas con efecto 3D y sombreado mediante gradientes y sombras internas.
- Animación de caída con rebote suave.
- Resalte luminoso de la línea ganadora y partículas de celebración.

### Sonido
- Sonido sintetizado (Web Audio API) al colocar ficha.
- Sonido de victoria (glissando) al terminar la partida.

### Reinicio
Botón "Reiniciar" para comenzar una nueva partida en cualquier momento.

### Estructura principal
```
src/app/games/cuatroenraya/
	services/
		connect-four-game.service.ts   // Lógica del tablero y evaluación
		connect-four-ai.service.ts     // IA (minimax)
	components/
		connect-four/
			connect-four.component.*     // Vista, estilos y efectos
```

### Personalización rápida
- Profundidad de IA: ajusta `maxDepth` en `connect-four-ai.service.ts`.
- Duración de la caída: variable CSS `--drop-duration` en `connect-four.component.css`.
- Colores y aspecto madera: gradiente de fondo en `.board`.

### Próximas mejoras sugeridas
- Añadir sonidos con archivos reales (formatos `.mp3`/`.wav`).
- Integrar un selector de dificultad (profundidad distinta de minimax).
- Añadir animación de preview de ficha al pasar el cursor sobre una columna.

Disfruta el juego y si deseas más efectos (Three.js, físicas avanzadas) podemos ampliarlo.
