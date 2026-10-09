import './estilo.css'
import {
  CONFIG,
  crearEstadoInicial,
  elegirOpcion,
  empezarPartida,
  obtenerMomentoActual,
  pedirAyuda,
  reiniciarPartida,
  type EstadoPartida,
  type FinalPartida,
} from "./logica";

const aplicacion = document.querySelector<HTMLDivElement>("#app");

if (!aplicacion) {
  throw new Error('No se encontró el elemento con id "app".');
}

const raizAplicacion = aplicacion;
let estado: EstadoPartida = crearEstadoInicial();
type ImpactoReciente = {
  descripcion: string;
  cambioAnimo: number;
  cambioReputacion: number;
};

let impactoReciente: ImpactoReciente | null = null;

const finales: Record<FinalPartida, { titulo: string; descripcion: string; clase: string }> = {
  contratado: {
    titulo: "Te contrataron",
    descripcion: "Terminaste la jornada con buen ánimo y una reputación sólida.",
    clase: "final--bueno",
  },
  renuncia: {
    titulo: "Renunciaste",
    descripcion: "Tu ánimo llegó a cero y la jornada terminó de inmediato.",
    clase: "final--malo",
  },
  despedido: {
    titulo: "Te despidieron",
    descripcion: "Terminaste la jornada con una reputación demasiado baja.",
    clase: "final--malo",
  },
  "periodo-de-prueba": {
    titulo: "Periodo de prueba",
    descripcion: "Terminaste la jornada. La empresa te dará una oportunidad para demostrar lo que puedes hacer.",
    clase: "final--precaucion",
  },
};

function escaparHtml(texto: string): string {
  return texto.replace(/[&<>"']/g, (caracter) => {
    const entidades: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entidades[caracter] ?? caracter;
  });
}

function dibujarBarra(etiqueta: string, valor: number, clase: string): string {
  return `
    <div class="medidor">
      <div class="medidor__encabezado">
        <span>${etiqueta}</span>
        <span>${valor} / ${CONFIG.VALOR_MAXIMO}</span>
      </div>
      <div
        class="medidor__pista"
        role="progressbar"
        aria-label="${etiqueta}"
        aria-valuemin="${CONFIG.VALOR_MINIMO}"
        aria-valuemax="${CONFIG.VALOR_MAXIMO}"
        aria-valuenow="${valor}"
      >
        <span class="medidor__relleno ${clase}" style="width: ${valor}%"></span>
      </div>
    </div>
  `;
}

function dibujarImpactoReciente(): string {
  if (impactoReciente === null) {
    return "";
  }

  const mostrarCambio = (valor: number): string =>
    valor > 0 ? `+${valor}` : `${valor}`;
  const claseCambio = (valor: number): string =>
    valor > 0 ? "impacto__valor--positivo" : valor < 0 ? "impacto__valor--negativo" : "";

  return `
    <aside class="impacto" aria-live="polite" aria-atomic="true">
      <h2 class="impacto__titulo">Resultado de tu acción</h2>
      <p class="impacto__descripcion">${escaparHtml(impactoReciente.descripcion)}</p>
      <div class="impacto__cambios">
        <span>Ánimo: <strong class="impacto__valor ${claseCambio(impactoReciente.cambioAnimo)}">${mostrarCambio(impactoReciente.cambioAnimo)}</strong></span>
        <span>Reputación: <strong class="impacto__valor ${claseCambio(impactoReciente.cambioReputacion)}">${mostrarCambio(impactoReciente.cambioReputacion)}</strong></span>
      </div>
    </aside>
  `;
}

function dibujarInicio(): void {
  raizAplicacion.innerHTML = `
    <main class="contenedor">
      <section class="tarjeta tarjeta--inicio" aria-labelledby="titulo-juego">
        <p class="ceja">Tu primer día en el equipo</p>
        <h1 id="titulo-juego">Mi Primer Día</h1>
        <p class="introduccion">
          Cada decisión cuenta. Recorre seis momentos, cuida tu ánimo y construye
          una buena reputación.
        </p>
        <button class="boton boton--principal" type="button" data-accion="empezar">
          Empezar
        </button>
        <button class="boton boton--texto boton--reiniciar-inicio" type="button" data-accion="reiniciar">
          Reiniciar
        </button>
        <p class="ayuda-teclado">Atajos: 1, 2 y 3 para elegir · A para pedir ayuda · R para reiniciar</p>
      </section>
    </main>
  `;
}

function dibujarPartida(): void {
  const momento = obtenerMomentoActual(estado);

  if (!momento) {
    throw new Error("No se encontró un momento para el estado actual de la partida.");
  }

  raizAplicacion.innerHTML = `
    <main class="contenedor">
      <section class="tarjeta" aria-labelledby="titulo-momento">
        <header class="encabezado">
          <div>
            <p class="ceja">Mi Primer Día</p>
            <h1 id="titulo-momento">${escaparHtml(momento.titulo)}</h1>
          </div>
          <p class="contador">Momento ${estado.momentoActual} de ${CONFIG.MOMENTOS_TOTALES}</p>
        </header>

        <div class="medidores">
          ${dibujarBarra("Ánimo", estado.animo, "medidor__relleno--animo")}
          ${dibujarBarra("Reputación", estado.reputacion, "medidor__relleno--reputacion")}
        </div>

        ${dibujarImpactoReciente()}
        <p class="situacion">${escaparHtml(momento.situacion)}</p>
        <h2 class="subtitulo">¿Qué decides?</h2>
        <div class="opciones">
          ${momento.opciones
            .map(
              (opcion, indice) => `
                <button
                  class="boton boton--opcion"
                  type="button"
                  data-opcion="${indice + CONFIG.NUMERO_PRIMERA_OPCION}"
                >
                  <span class="opcion__numero">${indice + CONFIG.NUMERO_PRIMERA_OPCION}</span>
                  <span>${escaparHtml(opcion.texto)}</span>
                </button>
              `,
            )
            .join("")}
        </div>

        <footer class="acciones">
          <button
            class="boton boton--secundario"
            type="button"
            data-accion="ayuda"
            ${estado.ayudaUsada ? "disabled" : ""}
          >
            ${estado.ayudaUsada ? "Ayuda usada" : "Pedir ayuda a un compañero"}
          </button>
          <button class="boton boton--texto" type="button" data-accion="reiniciar">
            Reiniciar
          </button>
        </footer>
        <p class="ayuda-teclado">Atajos: 1, 2 y 3 para elegir · A para pedir ayuda · R para reiniciar</p>
      </section>
    </main>
  `;
}

function dibujarFinal(final: FinalPartida): void {
  const resultado = finales[final];

  raizAplicacion.innerHTML = `
    <main class="contenedor">
      <section class="tarjeta tarjeta--final ${resultado.clase}" aria-labelledby="titulo-final" aria-live="polite">
        <p class="ceja">Jornada terminada</p>
        <h1 id="titulo-final">${resultado.titulo}</h1>
        <p class="introduccion">${resultado.descripcion}</p>
        ${dibujarBarra("Ánimo final", estado.animo, "medidor__relleno--animo")}
        ${dibujarBarra("Reputación final", estado.reputacion, "medidor__relleno--reputacion")}
        ${dibujarImpactoReciente()}
        <button class="boton boton--principal" type="button" data-accion="reiniciar">
          Jugar otra vez
        </button>
      </section>
    </main>
  `;
}

function dibujar(): void {
  if (estado.final !== null) {
    dibujarFinal(estado.final);
    return;
  }

  if (!estado.iniciada) {
    dibujarInicio();
    return;
  }

  dibujarPartida();
}

function ejecutarAccion(
  accion: () => boolean,
  alCompletar: (() => void) | null = null,
): void {
  if (accion()) {
    alCompletar?.();
    dibujar();
  }
}

function elegirConImpacto(numeroOpcion: number): void {
  const momento = obtenerMomentoActual(estado);
  const opcion =
    momento?.opciones[numeroOpcion - CONFIG.NUMERO_PRIMERA_OPCION];
  const animoAnterior = estado.animo;
  const reputacionAnterior = estado.reputacion;

  ejecutarAccion(
    () => elegirOpcion(estado, numeroOpcion),
    () => {
      impactoReciente = {
        descripcion: opcion?.texto ?? "Tomaste una decisión.",
        cambioAnimo: estado.animo - animoAnterior,
        cambioReputacion: estado.reputacion - reputacionAnterior,
      };
    },
  );
}

function pedirAyudaConImpacto(): void {
  const animoAnterior = estado.animo;
  const reputacionAnterior = estado.reputacion;

  ejecutarAccion(
    () => pedirAyuda(estado),
    () => {
      impactoReciente = {
        descripcion: "Tu compañero te dio una mano.",
        cambioAnimo: estado.animo - animoAnterior,
        cambioReputacion: estado.reputacion - reputacionAnterior,
      };
    },
  );
}

function reiniciarConPantallaInicial(): void {
  ejecutarAccion(
    () => reiniciarPartida(estado),
    () => {
      impactoReciente = null;
    },
  );
}

raizAplicacion.addEventListener("click", (evento: MouseEvent) => {
  const objetivo = evento.target;

  if (!(objetivo instanceof Element)) {
    return;
  }

  const boton = objetivo.closest<HTMLButtonElement>("button");

  if (!boton) {
    return;
  }

  if (boton.dataset.opcion !== undefined) {
    elegirConImpacto(Number(boton.dataset.opcion));
    return;
  }

  switch (boton.dataset.accion) {
    case "empezar":
      ejecutarAccion(
        () => empezarPartida(estado),
        () => {
          impactoReciente = null;
        },
      );
      break;
    case "ayuda":
      pedirAyudaConImpacto();
      break;
    case "reiniciar":
      reiniciarConPantallaInicial();
      break;
  }
});

document.addEventListener("keydown", (evento: KeyboardEvent) => {
  const tecla = evento.key.toLowerCase();

  if (tecla === "r") {
    reiniciarConPantallaInicial();
    return;
  }

  if (tecla === "a") {
    pedirAyudaConImpacto();
    return;
  }

  if (tecla === "1" || tecla === "2" || tecla === "3") {
    elegirConImpacto(Number(tecla));
  }
});

dibujar();