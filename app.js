"use strict";

/*
tareas es un arreglo donde se guardan las tareas
siguienteId genera un identificador diferente para cada tarea
filtroActual indica qué mostrar: todas, pendientes o completas
*/

const tareas = [];
let siguienteId = 1;
let filtroActual = "todas";

/*
Referencias al DOM
*/

const formulario = document.querySelector("#formulario");
const campoTitulo = document.querySelector("#titulo");
const mensaje = document.querySelector("#mensaje");
const lista = document.querySelector("#lista");
const vacio = document.querySelector("#vacio");
const filtros = document.querySelector(".filtros");
const contador = document.querySelector("#contador");

/*
Agregar una nueva tarea
*/

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const titulo = campoTitulo.value.trim();

  // Validar que haya texto
  if (!titulo) {
    mensaje.textContent = "Escriba una descripción antes de agregar";
    campoTitulo.focus();
    return;
  }

  // Crear objeto tarea
  const nuevaTarea = {
    id: siguienteId,
    titulo: titulo,
    completada: false,
  };

  // Guardar tarea
  tareas.push(nuevaTarea);

  // Preparar ID para la siguiente tarea
  siguienteId++;

  console.log("Tareas actuales:", tareas);

  // Limpiar formulario
  formulario.reset();

  mensaje.textContent = "";
  campoTitulo.focus();

  // Actualizar lista
  renderizar();
});

/*
Renderiza las tareas
*/

function renderizar() {
  // Limpiar lista visual
  lista.replaceChildren();

  const visibles = obtenerTareasVisibles();

  for (const tarea of visibles) {

    // Crear <li>
    const item = document.createElement("li");
    item.className = "tarea";

    // Agregar o quitar clase completada
    item.classList.toggle("completada", tarea.completada);

    // Crear texto
    const titulo = document.createElement("span");
    titulo.className = "titulo-tarea";
    titulo.textContent = tarea.titulo;

    // Contenedor de botones
    const acciones = document.createElement("span");
    acciones.className = "acciones";

    // Botón completar / reabrir
    const completar = document.createElement("button");
    completar.type = "button";
    completar.className = "button";

    completar.dataset.accion = "alternar";
    completar.dataset.id = String(tarea.id);

    completar.textContent = tarea.completada
      ? "Reabrir"
      : "Completar";

    completar.setAttribute(
      "aria-label",
      `${completar.textContent}: ${tarea.titulo}`
    );

    // Botón eliminar
    const eliminar = document.createElement("button");

    eliminar.type = "button";
    eliminar.className = "eliminar";

    eliminar.dataset.accion = "eliminar";
    eliminar.dataset.id = String(tarea.id);

    eliminar.textContent = "Eliminar";

    eliminar.setAttribute(
      "aria-label",
      `Eliminar: ${tarea.titulo}`
    );

    // Insertar botones dentro de acciones
    acciones.append(completar, eliminar);

    // Insertar título y acciones dentro del <li>
    item.append(titulo, acciones);

    // Insertar <li> dentro de la lista
    lista.append(item);
  }

  // Contar tareas pendientes
  const pendientes = tareas.filter(
    (tarea) => !tarea.completada
  ).length;

  contador.textContent =
    `${pendientes} pendientes de ${tareas.length}`;

  // Mostrar mensaje de lista vacía
  vacio.hidden = visibles.length > 0;
}

/*
Obtener las tareas visibles
*/

function obtenerTareasVisibles() {

  if (filtroActual === "pendientes") {
    return tareas.filter(
      (tarea) => !tarea.completada
    );
  }

  if (filtroActual === "completadas") {
    return tareas.filter(
      (tarea) => tarea.completada
    );
  }

  return tareas;
}

/*
Completar o reabrir y eliminar tareas
*/

lista.addEventListener("click", (evento) => {

  const boton = evento.target.closest("button");

  if (!boton) {
    return;
  }

  const id = Number(boton.dataset.id);
  const accion = boton.dataset.accion;

  const tarea = tareas.find(
    (tarea) => tarea.id === id
  );

  if (!tarea) {
    return;
  }

  // Completar / reabrir
  if (accion === "alternar") {
    tarea.completada = !tarea.completada;
  }

  // Eliminar
  if (accion === "eliminar") {
    const indice = tareas.findIndex(
      (tarea) => tarea.id === id
    );

    tareas.splice(indice, 1);
  }

  renderizar();
});

/*
Filtros
*/

filtros.addEventListener("click", (evento) => {

  const boton = evento.target.closest("button");

  if (!boton) {
    return;
  }

  filtroActual = boton.dataset.filtro;

  renderizar();
});

/*
Primera renderización
*/

renderizar();
