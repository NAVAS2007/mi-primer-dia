export type Efecto = {
  animo: number;
  reputacion: number;
};

export type Opcion = {
  texto: string;
  efecto: Efecto;
};

export type Momento = {
  titulo: string;
  situacion: string;
  opciones: readonly [Opcion, Opcion, Opcion];
};

export type FinalPartida =
  | "contratado"
  | "renuncia"
  | "despedido"
  | "periodo-de-prueba";

export type EstadoPartida = {
  iniciada: boolean;
  momentoActual: number;
  animo: number;
  reputacion: number;
  ayudaUsada: boolean;
  final: FinalPartida | null;
};

export const CONFIG = {
  ANIMO_INICIAL: 70, // puntos de ánimo
  REPUTACION_INICIAL: 50, // puntos de reputación
  VALOR_MINIMO: 0, // puntos de ánimo o reputación
  VALOR_MAXIMO: 100, // puntos de ánimo o reputación
  ANIMO_AYUDA: 10, // puntos de ánimo
  REPUTACION_AYUDA: 5, // puntos de reputación
  MOMENTOS_TOTALES: 6, // momentos
  UMBRAL_CONTRATACION: 60, // puntos de reputación
  UMBRAL_DESPIDO: 30, // puntos de reputación
  NUMERO_PRIMERA_OPCION: 1, // número de opción mostrado
  NUMERO_OPCIONES: 3, // opciones por momento
  INDICE_PRIMERA_OPCION: 0, // índice de opción en la lista
  INCREMENTO_MOMENTO: 1, // momento
  MOMENTO_INICIAL: 0, // momentos completados antes de empezar
  momentos: [
    {
      titulo: "Llegada a la oficina",
      situacion:
        "Tu líder te presenta al equipo y te asigna tu primera tarea. No entendiste bien un detalle.",
      opciones: [
        {
          texto: "Preguntar para confirmar qué hay que hacer",
          efecto: {
            animo: 8, // puntos de ánimo
            reputacion: 8, // puntos de reputación
          },
        },
        {
          texto: "Empezar de inmediato suponiendo que entendiste",
          efecto: {
            animo: -8, // puntos de ánimo
            reputacion: -7, // puntos de reputación
          },
        },
        {
          texto: "Leer la documentación y luego confirmar la tarea",
          efecto: {
            animo: 5, // puntos de ánimo
            reputacion: 5, // puntos de reputación
          },
        },
      ],
    },
    {
      titulo: "Tu primera tarea",
      situacion:
        "Te piden corregir un error en el código, pero todavía no conoces bien el proyecto.",
      opciones: [
        {
          texto: "Revisar el código cercano y probar una hipótesis pequeña",
          efecto: {
            animo: 6, // puntos de ánimo
            reputacion: 7, // puntos de reputación
          },
        },
        {
          texto: "Cambiar varias cosas a la vez para terminar rápido",
          efecto: {
            animo: -9, // puntos de ánimo
            reputacion: -8, // puntos de reputación
          },
        },
        {
          texto: "Buscar si el equipo documentó errores parecidos",
          efecto: {
            animo: 4, // puntos de ánimo
            reputacion: 4, // puntos de reputación
          },
        },
      ],
    },
    {
      titulo: "Un bloqueo inesperado",
      situacion:
        "Una prueba falla y no logras encontrar todavía la causa del problema.",
      opciones: [
        {
          texto: "Aislar el cambio y reproducir el error paso a paso",
          efecto: {
            animo: 5, // puntos de ánimo
            reputacion: 7, // puntos de reputación
          },
        },
        {
          texto: "Ocultar el fallo y seguir con otra tarea",
          efecto: {
            animo: -10, // puntos de ánimo
            reputacion: -12, // puntos de reputación
          },
        },
        {
          texto: "Anotar lo que probaste y pedir una revisión breve",
          efecto: {
            animo: 7, // puntos de ánimo
            reputacion: 6, // puntos de reputación
          },
        },
      ],
    },
    {
      titulo: "Revisión de código",
      situacion:
        "Una compañera revisa tu propuesta y señala que falta cubrir un caso.",
      opciones: [
        {
          texto: "Agradecer el comentario y agregar la prueba faltante",
          efecto: {
            animo: 6, // puntos de ánimo
            reputacion: 8, // puntos de reputación
          },
        },
        {
          texto: "Tomar la observación como algo personal y discutir",
          efecto: {
            animo: -9, // puntos de ánimo
            reputacion: -10, // puntos de reputación
          },
        },
        {
          texto: "Preguntar qué otros casos conviene tener en cuenta",
          efecto: {
            animo: 5, // puntos de ánimo
            reputacion: 6, // puntos de reputación
          },
        },
      ],
    },
    {
      titulo: "Una reunión de equipo",
      situacion:
        "En la reunión te preguntan qué hiciste y si necesitas algo para continuar.",
      opciones: [
        {
          texto: "Contar el avance y mencionar claramente el bloqueo",
          efecto: {
            animo: 5, // puntos de ánimo
            reputacion: 8, // puntos de reputación
          },
        },
        {
          texto: "Decir que todo está listo aunque aún no lo esté",
          efecto: {
            animo: -8, // puntos de ánimo
            reputacion: -12, // puntos de reputación
          },
        },
        {
          texto: "Escuchar primero y compartir un resumen concreto",
          efecto: {
            animo: 4, // puntos de ánimo
            reputacion: 5, // puntos de reputación
          },
        },
      ],
    },
    {
      titulo: "Cierre de la jornada",
      situacion:
        "Queda poco para terminar el día. Tu cambio funciona, pero falta dejarlo listo para el equipo.",
      opciones: [
        {
          texto: "Probar el cambio, resumirlo y dejar una nota clara",
          efecto: {
            animo: 7, // puntos de ánimo
            reputacion: 10, // puntos de reputación
          },
        },
        {
          texto: "Entregarlo sin comprobarlo para salir antes",
          efecto: {
            animo: -10, // puntos de ánimo
            reputacion: -12, // puntos de reputación
          },
        },
        {
          texto: "Avisar qué falta y proponer el siguiente paso",
          efecto: {
            animo: 5, // puntos de ánimo
            reputacion: 7, // puntos de reputación
          },
        },
      ],
    },
  ] satisfies readonly Momento[],
} as const;

export const MOMENTOS: readonly Momento[] = CONFIG.momentos;

export function crearEstadoInicial(): EstadoPartida {
  return {
    iniciada: false,
    momentoActual: CONFIG.MOMENTO_INICIAL,
    animo: CONFIG.ANIMO_INICIAL,
    reputacion: CONFIG.REPUTACION_INICIAL,
    ayudaUsada: false,
    final: null,
  };
}

export function empezarPartida(estado: EstadoPartida): boolean {
  if (estado.iniciada || estado.final !== null) {
    return false;
  }

  estado.iniciada = true;
  estado.momentoActual = CONFIG.INCREMENTO_MOMENTO;
  return true;
}

export function elegirOpcion(
  estado: EstadoPartida,
  numeroOpcion: number,
): boolean {
  if (!estaEnCurso(estado) || !Number.isInteger(numeroOpcion)) {
    return false;
  }

  const indiceOpcion =
    numeroOpcion -
    CONFIG.NUMERO_PRIMERA_OPCION +
    CONFIG.INDICE_PRIMERA_OPCION;
  const momento = MOMENTOS[estado.momentoActual - CONFIG.INCREMENTO_MOMENTO];
  const opcion = momento?.opciones[indiceOpcion];

  if (
    opcion === undefined ||
    numeroOpcion < CONFIG.NUMERO_PRIMERA_OPCION ||
    numeroOpcion >= CONFIG.NUMERO_PRIMERA_OPCION + CONFIG.NUMERO_OPCIONES
  ) {
    return false;
  }

  estado.animo = limitar(
    estado.animo + opcion.efecto.animo,
    CONFIG.VALOR_MINIMO,
    CONFIG.VALOR_MAXIMO,
  );
  estado.reputacion = limitar(
    estado.reputacion + opcion.efecto.reputacion,
    CONFIG.VALOR_MINIMO,
    CONFIG.VALOR_MAXIMO,
  );

  if (estado.animo <= CONFIG.VALOR_MINIMO) {
    estado.final = "renuncia";
    return true;
  }

  if (estado.momentoActual === CONFIG.MOMENTOS_TOTALES) {
    estado.final = determinarFinal(estado.reputacion);
    return true;
  }

  estado.momentoActual += CONFIG.INCREMENTO_MOMENTO;
  return true;
}

export function pedirAyuda(estado: EstadoPartida): boolean {
  if (!estaEnCurso(estado) || estado.ayudaUsada) {
    return false;
  }

  estado.ayudaUsada = true;
  estado.animo = limitar(
    estado.animo + CONFIG.ANIMO_AYUDA,
    CONFIG.VALOR_MINIMO,
    CONFIG.VALOR_MAXIMO,
  );
  estado.reputacion = limitar(
    estado.reputacion + CONFIG.REPUTACION_AYUDA,
    CONFIG.VALOR_MINIMO,
    CONFIG.VALOR_MAXIMO,
  );
  return true;
}

export function reiniciarPartida(estado: EstadoPartida): boolean {
  Object.assign(estado, crearEstadoInicial());
  return true;
}

export function obtenerMomentoActual(
  estado: EstadoPartida,
): Momento | null {
  if (estado.momentoActual < CONFIG.INCREMENTO_MOMENTO) {
    return null;
  }

  return MOMENTOS[estado.momentoActual - CONFIG.INCREMENTO_MOMENTO] ?? null;
}

function estaEnCurso(estado: EstadoPartida): boolean {
  return (
    estado.iniciada &&
    estado.final === null &&
    estado.momentoActual >= CONFIG.INCREMENTO_MOMENTO &&
    estado.momentoActual <= CONFIG.MOMENTOS_TOTALES
  );
}

function determinarFinal(reputacion: number): FinalPartida {
  if (reputacion >= CONFIG.UMBRAL_CONTRATACION) {
    return "contratado";
  }

  if (reputacion < CONFIG.UMBRAL_DESPIDO) {
    return "despedido";
  }

  return "periodo-de-prueba";
}

function limitar(valor: number, minimo: number, maximo: number): number {
  return Math.min(Math.max(valor, minimo), maximo);
}
