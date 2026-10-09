import { describe, expect, it } from "vitest";
import {
  CONFIG,
  crearEstadoInicial,
  elegirOpcion,
  empezarPartida,
  pedirAyuda,
  reiniciarPartida,
} from "../src/logica";

describe("Lógica de Mi Primer Día", () => {
  it("arma el estado inicial con los valores configurados", () => {
    expect(crearEstadoInicial()).toEqual({
      iniciada: false,
      momentoActual: CONFIG.MOMENTO_INICIAL,
      animo: CONFIG.ANIMO_INICIAL,
      reputacion: CONFIG.REPUTACION_INICIAL,
      ayudaUsada: false,
      final: null,
    });
  });

  it("acepta una opción válida y actualiza los valores del momento", () => {
    const estado = crearEstadoInicial();

    expect(empezarPartida(estado)).toBe(true);
    expect(elegirOpcion(estado, 1)).toBe(true);
    expect(estado.animo).toBe(CONFIG.ANIMO_INICIAL + 8);
    expect(estado.reputacion).toBe(CONFIG.REPUTACION_INICIAL + 8);
    expect(estado.momentoActual).toBe(2);
    expect(estado.final).toBeNull();
  });

  it("rechaza una opción inválida o elegida cuando la partida no está en curso", () => {
    const estado = crearEstadoInicial();

    expect(elegirOpcion(estado, 1)).toBe(false);
    expect(empezarPartida(estado)).toBe(true);
    expect(elegirOpcion(estado, 0)).toBe(false);
    expect(elegirOpcion(estado, 4)).toBe(false);
    expect(elegirOpcion(estado, 1.5)).toBe(false);
    expect(estado.momentoActual).toBe(1);
  });

  it("otorga ayuda una vez y rechaza volver a pedirla", () => {
    const estado = crearEstadoInicial();
    empezarPartida(estado);

    expect(pedirAyuda(estado)).toBe(true);
    expect(estado.animo).toBe(CONFIG.ANIMO_INICIAL + CONFIG.ANIMO_AYUDA);
    expect(estado.reputacion).toBe(
      CONFIG.REPUTACION_INICIAL + CONFIG.REPUTACION_AYUDA,
    );
    expect(estado.ayudaUsada).toBe(true);
    expect(pedirAyuda(estado)).toBe(false);
  });

  it("rechaza pedir ayuda antes de empezar y después de terminar", () => {
    const estado = crearEstadoInicial();

    expect(pedirAyuda(estado)).toBe(false);
    empezarPartida(estado);
    estado.final = "contratado";
    expect(pedirAyuda(estado)).toBe(false);
  });

  it("reinicia una partida y devuelve false al rechazar una opción", () => {
    const estado = crearEstadoInicial();
    empezarPartida(estado);
    elegirOpcion(estado, 1);
    pedirAyuda(estado);

    expect(reiniciarPartida(estado)).toBe(true);
    expect(estado).toEqual(crearEstadoInicial());
    expect(elegirOpcion(estado, 1)).toBe(false);
  });

  it("contrata al terminar con ánimo positivo y reputación suficiente", () => {
    const estado = crearEstadoInicial();
    empezarPartida(estado);

    for (let momento = 0; momento < CONFIG.MOMENTOS_TOTALES; momento += 1) {
      expect(elegirOpcion(estado, 1)).toBe(true);
    }

    expect(estado.animo).toBeGreaterThan(0);
    expect(estado.reputacion).toBeGreaterThanOrEqual(
      CONFIG.UMBRAL_CONTRATACION,
    );
    expect(estado.final).toBe("contratado");
    expect(elegirOpcion(estado, 1)).toBe(false);
  });

  it("renuncia cuando el ánimo llega a cero", () => {
    const estado = crearEstadoInicial();
    estado.animo = 1;
    empezarPartida(estado);

    expect(elegirOpcion(estado, 2)).toBe(true);
    expect(estado.animo).toBe(CONFIG.VALOR_MINIMO);
    expect(estado.final).toBe("renuncia");
  });

  it("despide al terminar con reputación menor al mínimo", () => {
    const estado = crearEstadoInicial();
    empezarPartida(estado);

    for (let momento = 0; momento < CONFIG.MOMENTOS_TOTALES; momento += 1) {
      expect(elegirOpcion(estado, 2)).toBe(true);
    }

    expect(estado.animo).toBeGreaterThan(0);
    expect(estado.reputacion).toBeLessThan(CONFIG.UMBRAL_DESPIDO);
    expect(estado.final).toBe("despedido");
  });

  it("termina en periodo de prueba con reputación intermedia y ánimo positivo", () => {
    const estado = crearEstadoInicial();
    empezarPartida(estado);
    const opciones = [2, 1, 2, 1, 2, 1];

    for (const opcion of opciones) {
      expect(elegirOpcion(estado, opcion)).toBe(true);
    }

    expect(estado.animo).toBeGreaterThan(0);
    expect(estado.reputacion).toBeGreaterThanOrEqual(CONFIG.UMBRAL_DESPIDO);
    expect(estado.reputacion).toBeLessThan(CONFIG.UMBRAL_CONTRATACION);
    expect(estado.final).toBe("periodo-de-prueba");
  });
});
