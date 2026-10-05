"use strict"; //Activa el modo estricto en JS -Hace que JavaScript sea mas exigente

/*
tareas es un arreglo donde se guardan las tareas y cada tarea sera un objeto siguiente
ID genera un identificador diferente para cada tarea 
filtroActual indica que mostrar: todas, pendientes o completas
*/

const tareas = [];
let siguienteId = 1;
let filtroActual = "todas";

/*
Referencias al DOM:
querySelector() busca elementos del HTML usando selectores CSS

*/
const formulario = document.querySelector("#formulario");
const campoTitulo = document.querySelector("#titulo");
const mensaje = document.querySelector("#mensaje");
const lista = document.querySelector("#lista");
const vacio = document.querySelector("#vacio");
const filtros = document.querySelector(".filtros");

/*
Agregar una nueva tarea en el formulario

*/

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault(); //Evita que el formulario recargue la pagina

  const titulo = campoTitulo.value.trim(); //Obtiene el texto y elimina espacios externos

  //Se valida que haya texto
  if (!titulo) {
    mensaje.textContent = "Escriba una descripcion antes de agregar";
    campoTitulo.focus();
    return;
  }

  //Se crea el objeto Tarea
  const nuevaTarea = {
    id: siguienteId,
    titulo: titulo,
    completada: false,
  };

  //Guarda la tarea en el arreglo
  tareas.push(nuevaTarea);

  //Preparar el id para la siguiente tarea
  siguienteId++;

  //Util para observar los datos en clase
  console.log("Tareas Actuales: ", tareas);

  //Limpiar formulario
  formulario.reset();

  mensaje.textContent = "";
  campoTitulo.focus();

  //Vuelve a recargar la lista
  renderizar();
});

/*

Renderiza las tareas
Se toma los datos de JavaScript y mostrarlos en el HTML
*/

function renderizar() {
  //Limpia la lista visual antes de volver a dibujarla

  lista.replaceChildren();

  const visibles = obtenerTareasVisibles();

  for (const tarea of visibles) {
    //Crear <li>
    const item = document.createElement("li");
    item.className = "tarea";

    //Agrega o quita la clase "completada"
    item.classList.toggle("completada", tarea.completada);

    //Crear el texto de la tarea
    const titulo = document.createElement("span");
    titulo.className = "titulo-tarea";
    titulo.textContent = tarea.titulo;

    //Contenedor de botones
    const acciones = document.createElement("span");
    acciones.className = "acciones";

    //Boton completar / Reabrir
    const completar = document.createElement("span");
    completar.className = "button";

    //Dataset agrega informacion personalizada al boton
    completar.dataset.accion = "alternar";
    completar.dataset.id = String(tarea.id);

    completar.textContent = tarea.completada ? "Reabrir" : "Completar";

    completar.setAtributte(
      "aria.label",
      `${completar.textContent}:${tarea.titulo}`,
    );

    //Boton eliminar
    const eliminar=document.createElement("button");
    eliminar.type="button";
    eliminar.className="eliminar";
    eliminar.dataset.accion="eliminar";
    eliminar.dataset.id=String(tarea.id);
    eliminar.textContent="Eliminar";
    eliminar.setAtributte(
      "aria-label",
      `Eliminar: ${tarea.titulo}`
    );

    //Insertar elementos
    acciones.append(completar,eliminar);
    lista.append(titulo,acciones)
    lista.append(item);

  }//Fin del for

  //Contar pendientes
  const pendientes=tareas.filter(
    (tarea)=>!tarea.completada
  ).length;

  contador.textContent=
  `${pendientes} pendientes de ${tareas,length}`;

  //Mostrar mensaje de lista vacia cuando corresponda
  vacio.hidden=visibles.length>0;

} //Fin funcion renderizar

/*
Obtener las tareas visibles
filter() crea un objeto nuevo con los elementos que cumplen una condicion

*/

function obtenerTareasVisibles(){

  if(filtroActual=== "pendientes"){
    return tareas.filter((tarea =>!tarea.completada));
  }

  if(filtroActual=== "completadas"){
    return tareas.filter((tarea =>tarea.completada));
  }
  return tareas;

}//Fin funcion obtenerTareasVisibles


renderizar();



