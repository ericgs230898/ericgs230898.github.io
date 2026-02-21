# Juego del Impostor (Angular)

Aplicación Angular que implementa la mecánica básica de revelar roles entre jugadores, asegurando que cada tarjeta solo se abra una vez.

## Características principales
- Configuración inicial: número de jugadores, nombres y cantidad de impostores (máx 50%).
- Validación: impostores nunca superan el 50% del total (error si ocurre).
- Asignación aleatoria de roles (Impostor / Jugador normal) una sola vez.
- Tarjetas bloqueadas tras confirmar el rol.
- Modal para mostrar el rol individual.
- Navegación con Angular Router.
- Servicio centralizado (`GameStateService`) para estado y asignación.

## Estructura relevante
```
src/
	main.ts
	index.html
	app/
		app.component.ts
		app.config.ts
		app.routes.ts
		services/game-state.service.ts
		components/
			setup-game/
			player-cards/
			player-card/
```

## Requisitos previos
- Node.js 18+ y npm instalado.

## Instalación
```powershell
npm install
```

## Ejecución en modo desarrollo
```powershell
npm start
```
Servirá en `http://localhost:4200` con recarga automática.

## Construcción para producción
```powershell
npm run build
```
Genera artefactos en `dist/`.

## Uso rápido
1. Ingresar total de jugadores y número de impostores.
2. Ajustar nombres si se desea.
3. Pulsar "Avanzar" (se valida límite 50%).
4. Cada jugador abre solo su tarjeta; tras "Aceptar" queda bloqueada.

## Personalización
- Estilos en los CSS de cada componente.
- Se puede añadir persistencia (localStorage) modificando el servicio.

## Buenas prácticas aplicadas
- Código tipado con TypeScript.
- Separación de responsabilidades (servicio vs componentes).
- Validaciones claras antes de navegar.
- Comentarios en servicio y lógica principal.

## Mejoras futuras sugeridas
- Fases de votación / discusión.
- Histórico de partidas.
- Internacionalización (i18n).
- Animaciones adicionales.

## Licencia
Proyecto de demostración (ajustar según necesidad).
