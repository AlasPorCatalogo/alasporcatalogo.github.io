var listazonas,
 listaciudades,
 CeldaElemento,
 TextoDiv,
 AgregarCiudadesYaEjecutado,
 logElement,
 ZonaNoEncontrada,
 formElement,
 inputElement,
 ZonaInterpretada,
 ConteoTransparencia,
 ScrollArribaOCentro,
 ZonasPresentes,
 SaltoDeLinea,
 ConteoTeclado,
 EtiquetaBuscador,
 BotonTeclado,
 UltimaCiudadBuscada,
 CeldasAQuitarClase,
 ListaCeldasScrollPendiente,
 LongitudBusquedaCiudadesActual,
 ConteoBusquedaCiudadesActual,
 TextoMostradoUltimaCiudadBuscada,
 debug,
 consejos;
document.addEventListener("DOMContentLoaded", (event) => {
// Page has loaded
  definicionvariables();
  ManejarLocalStorage();
  agregarciudades();
});

function ManejarLocalStorage() {
 const QuitarTelefonos=document.createElement('input');
 QuitarTelefonos.type='button';
 const QuitarCiudades=QuitarTelefonos.cloneNode(true);
 QuitarTelefonos.id="QuitarTelefonos";
 QuitarCiudades.id="QuitarCiudades";
 QuitarTelefonos.value="Quitar teléfonos de la tabla";
 QuitarCiudades.value="Quitar ciudades de la tabla";
 FormCSS=document.querySelector('form[name="Cambiodecss"]');
 FormCSS.appendChild(QuitarCiudades);
 FormCSS.appendChild(QuitarTelefonos);
 let AxCTablas = localStorage.getItem("AxCTablas"),
 AxCTelefonos = localStorage.getItem("AxCTelefonos"),
 AxCCiudades = localStorage.getItem("AxCCiudades");
 if (AxCTablas !== null) {
  cambiarcss(AxCTablas,'table',3,0);
  let RadioButton = document.getElementById(AxCTablas)
  if (RadioButton !== null && RadioButton.type == "radio") {
   RadioButton.checked = true;
  }
 }
 else {
  cambiarcss('avon2','table',3,0);
//  localStorage.setItem("AxCTablas","avon2")
 }
 if (AxCTelefonos !== null) {
  QuitarTelefonos.value = 'Añadir teléfonos a la tabla';
  document.documentElement.classList.add("SinTelefonos")
 }
 if (AxCCiudades !== null) {
  QuitarCiudades.value = 'Añadir ciudades a la tabla';
  document.documentElement.classList.add("SinCiudades")
 }
 QuitarCiudades.addEventListener("click", (Event) => {
  if (localStorage.getItem("AxCCiudades") === null) {
   localStorage.setItem("AxCCiudades","true");
   document.documentElement.classList.add("SinCiudades");
   QuitarCiudades.value = 'Añadir ciudades a la tabla';
  }
  else {
   localStorage.removeItem("AxCCiudades");
   QuitarCiudades.value = 'Quitar ciudades de la tabla';
   document.documentElement.classList.remove("SinCiudades");
  }
 });
 QuitarTelefonos.addEventListener("click", (Event) => {
  if (localStorage.getItem("AxCTelefonos") === null) {
   localStorage.setItem("AxCTelefonos","true");
   document.documentElement.classList.add("SinTelefonos");
   QuitarTelefonos.value = 'Añadir teléfonos a la tabla'
  }
  else {
   localStorage.removeItem("AxCTelefonos");
   document.documentElement.classList.remove("SinTelefonos");
   QuitarTelefonos.value = 'Quitar teléfonos de la tabla'
  }
 });
}

function definicionvariables() {
 CeldasAQuitarClase = [];
 ListaCeldasScrollPendiente = [];
 ZonasPresentes = [];
 SaltoDeLinea = '\n';
 ConteoBusquedaCiudadesActual = 1;
 ConteoTransparencia = 0;
 ConteoTeclado = 0;
 ZonaNoEncontrada = 0;
 resizing = false;
 formElement = document.getElementById("busqueda");
 logElement = document.getElementById("tecsto");
 inputElement = document.getElementById("zona");
 EtiquetaBuscador = document.querySelector('#LabelBuscar');
 BotonTeclado = document.querySelector('#Teclado');
 logElement.innerText = consejos[mathRandomInt(0, consejos.length-1)];
 formElement.addEventListener("submit", (event) => {
  event.preventDefault();
  comandosZonas(aplanartexto(inputElement.value));
 });
 inputElement.addEventListener("input", () => {
  ZonaNoEncontrada -= 1;
  Interpretarzonas(aplanartexto(inputElement.value));
 });
}


//Funcionalidad de buscadores


function comandosZonas(comando) {
 if (debug) {
  console.log('"',comando,'"','comandosZonas()');
 }
 let ejecutar = false;
 if (ConteoBusquedaCiudadesActual > LongitudBusquedaCiudadesActual) {
  ConteoBusquedaCiudadesActual = 1;
 }
 switch (comando) {
  case 'debug':
   debug = true;
   console.log('modo debug activado');
   break;
  case '-':
  case 'nos':
   SaltoDeLinea = '';
   break;
  case '.':
  case 'sis':
   SaltoDeLinea = '\n';
   break;
  case ',':
  case 'tr':
   transparencia();
   break;
  case ' ':
  case 'tec':
   CambiarTeclado();
   break;
  default:
   ejecutar = true;
 }
 if (ejecutar == true) {
  if (ListaCeldasScrollPendiente.length > 0 && UltimaCiudadBuscada != aplanartexto(inputElement.value)) {
   while (ListaCeldasScrollPendiente.length > 0) {
    ListaCeldasScrollPendiente.pop();
   }
   if (debug) {
    console.log('celdasacroll vaciado');
   }
   ConteoBusquedaCiudadesActual = 1;
  }
  if (inputElement.inputMode == 'numeric') {
   encontrarcelda(ZonaInterpretada,true);
  }
  if (inputElement.inputMode == 'text' && ListaCeldasScrollPendiente.length > 0 && UltimaCiudadBuscada == aplanartexto(inputElement.value)) {
   if (debug) {
    console.log('SiguienteCelda()');
   }
   SiguienteCelda();
  }
  else if (inputElement.inputMode == 'text' && ListaCeldasScrollPendiente.length < 1) {
   if (debug) {
    console.log('BuscadorCiudades()desde comandosZonas()')
   }
   BuscadorCiudades(comando);
  }
 }
}


function encontrarcelda(Zona, ModoZona,) {
 if (debug) {
  console.log(Zona,'encontrarcelda()');
 }
 if (ModoZona) {
  quitarclases();
 }
 let CeldaEncontrada = document.getElementById(Zona);
 if (CeldaEncontrada === null) {
  ZonaNoEncontrada = 1;
  if (inputElement.inputMode == 'numeric') {
   logElement.innerText = `La Zona Buscada no existe`;
  }
 }
 else {
  CeldasAQuitarClase.push(Zona);
  ListaCeldasScrollPendiente.push(Zona);
  LongitudBusquedaCiudadesActual = ListaCeldasScrollPendiente.length;
  if (ModoZona) {
   scrollcelda();
  }
  CeldaEncontrada.className = CeldaEncontrada.className + ' ' + 'encontrado';
 }
  ScrollArribaOCentro = 'center';
}


function BuscadorCiudades(CiudadBuscada) {
 encontrarcelda('ningunelemento',true);
 let ListaZonasEncontradas = [];
 if (ListaCeldasScrollPendiente.length < 1) {
  CiudadBuscada = aplanartexto(CiudadBuscada);
  for (let Zona in NuevaListaDeZonas) {
   if (NuevaListaDeZonas[Zona].Ciudad != '') {
    let Ciudad = aplanartexto(NuevaListaDeZonas[Zona].Ciudad);
    if (Ciudad.includes(CiudadBuscada) && revisarexistencias(Zona, ZonasPresentes, false)) {
     ListaZonasEncontradas.push(Zona);
    }
   }
  }
  if (UltimaCiudadBuscada != aplanartexto(inputElement.value)) {
   TextoMostradoUltimaCiudadBuscada = logElement.innerText;
  }
  ListaZonasEncontradas.forEach(zonaactual => {
   encontrarcelda(zonaactual,false);
  });
 }
 UltimaCiudadBuscada = CiudadBuscada;
 if (ListaCeldasScrollPendiente.length > 0) {
  if (debug) {
   console.log('comandosZonas() desde BuscadorCiudades()')
  }
  comandosZonas(CiudadBuscada);
 }
 if (ListaZonasEncontradas.length == 0) {
  if (!logElement.innerText.includes("No hay ninguna zona registrada en la ciudad")) {
   logElement.innerText = `${logElement.innerText}\nNo hay ninguna zona registrada en la ciudad "${CiudadBuscada}"`;
  }
 }
}


// modificacion de celdas y tablas


function quitarclases(celdarevisada) {
 CeldasAQuitarClase.forEach(elementoactual => {
  celdarevisada = document.getElementById(elementoactual);
  if(celdarevisada !== null && celdarevisada.tagName != 'TABLE') {
   celdarevisada.className = '';
  }
 });
 while (CeldasAQuitarClase.length > 0) {
  CeldasAQuitarClase.pop();
 }
}


function scrollcelda() {
 let Celda = document.getElementById(ListaCeldasScrollPendiente[0]);
 Celda.scrollIntoView({ behavior: "smooth", block: ScrollArribaOCentro});
 if (ScrollArribaOCentro == 'start') {
  setTimeout(function() {ScrollPersonalizable(-144,0,"smooth");}, 875);
 }
 ListaCeldasScrollPendiente.shift();
}

function cambiarcss(NombreDeClase, NombreElemento, LimiteConteoCSS, ConteoCSSTablas,ConteoLogCSS) {
 if (["VerdeBN", "StarFinder", "avon1", "avon2"].includes(NombreDeClase)) {
  localStorage.setItem("AxCTablas",NombreDeClase);
 }
 var ElementoCSS;
 if (NombreElemento.slice(0,1) == '#') {
  ElementoCSS = document.getElementById(NombreElemento.slice(1,NombreElemento.length));
  ElementoCSS.className = NombreDeClase;
  console.log('Cambiada exitosamente la clase del elemento',NombreElemento);
 }
 else {
  ConteoLogCSS = 0;
  for(let ConteoCSS = 0; ConteoCSS < LimiteConteoCSS; ConteoCSS++) {
   ElementoCSS = document.getElementsByTagName(NombreElemento)[ConteoCSSTablas];
   ElementoCSS.className = NombreDeClase;
   ConteoCSSTablas++;
   ConteoLogCSS++;
  }
  console.log('Cambiada exitosamente la clase de',ConteoLogCSS,NombreElemento);
 }
}


function agregarciudades() {
 let CeldasVisitadas = 0,
  CiudadesAgregadas = 0,
  TelefonosAgregados = 0,
  Columna = 0,
  PCiudad = document.createElement('p'),
  PTelefono = document.createElement('p');
 PCiudad.className = "Ciudad";
 PTelefono.className = "Telefono";
 if (!AgregarCiudadesYaEjecutado) {
  const Celdas = document.querySelectorAll('div:not([class*="color"])'); //Seleccionar solo los elementos <div> dentro de la tabla
  Celdas.forEach(Div => {
   CeldasVisitadas++;
 //La linea comentada abajo es util para ver que esta funcionando mal 
 //console.log(CeldasVisitadas,Div.textContent,NuevaListaDeZonas[Div.textContent],NuevaListaDeZonas[Div.textContent]!==undefined?NuevaListaDeZonas[Div.textContent].Ciudad:undefined);
   CeldaElemento = Div.parentElement;
   Columna++;
   if (Columna > 5) {
    Columna = 1;
   }
   CeldaElemento.dataset.diaDeCierre = Columna; //data-dia-de-cierre
   TextoDiv = Div.textContent;
   TextoDiv = TextoDiv.replaceAll(' ','').replaceAll('\n','');
   if (TextoDiv.length > 3 && TextoDiv.length < 6) {
    ZonasPresentes.push(TextoDiv);
   }
   else {
     ZonasPresentes.push('noZona');
   }
   CeldaElemento.id = TextoDiv;
   if (NuevaListaDeZonas[TextoDiv] !== undefined) {
    let Zona = NuevaListaDeZonas[TextoDiv];
    if (Zona.Ciudad != '') {
     CiudadesAgregadas++;
     let ElementoCiudad = PCiudad.cloneNode();
     ElementoCiudad.textContent = Zona.Ciudad;
     Div.appendChild(ElementoCiudad);
    }
    if (Zona.Telefono != '') {
     TelefonosAgregados++;
     let ElementoTelefono = PTelefono.cloneNode();
     ElementoTelefono.textContent = Zona.Telefono;
     Div.appendChild(ElementoTelefono);
    }
   }
  });
 }
 AgregarCiudadesYaEjecutado = true;
 `Busqueda realizada en ${CeldasVisitadas} Celdas. Agregadas ${CiudadesAgregadas} ciudades de ${NuevaListaDeZonas.length.Telefono+NuevaListaDeZonas.length.Ambos} disponibles`;
 console.log(`Busqueda realizada en ${CeldasVisitadas} Celdas. Agregadas ${CiudadesAgregadas} ciudades de ${NuevaListaDeZonas.length.Ciudad+NuevaListaDeZonas.length.Ambos} disponibles`);
 console.log(`Busqueda realizada en ${CeldasVisitadas} Celdas. Agregados ${TelefonosAgregados} telefonos de ${NuevaListaDeZonas.length.Telefono+NuevaListaDeZonas.length.Ambos} disponibles`);
}

//Parte visual de los buscadores


function ScrollPersonalizable(Top,Left,Bottom) {
 window.scrollBy({
   top: Top,
   left: Left,
   behavior: Bottom,
 });
}


function SiguienteCelda(zona = ListaCeldasScrollPendiente[0],zonaElemento,Bloque,encabezadoColumna,DiaCierre) {
 mostrarzona(zona, true);
 ConteoBusquedaCiudadesActual++;
 scrollcelda();
}


function Interpretarzonas(Zona) {
 let ZonaOriginal = Zona, LogElementTextoOriginal = logElement.innerText;
 switch (ZonaOriginal) {
  case 'nos':
  case '-':
    logElement.innerText = `Quitar saltos de linea`;
    break;
  case 'sis':
  case '.':
    logElement.innerText = `Añadir saltos de linea`;
    break;
  case 'tr':
  case ',':
    logElement.innerText = `Cambio de transparencia`;
    break;
  case 'tec':
  case ' ':
    logElement.innerText = `Cambiar de buscador`;
    break;
 }
 if (LogElementTextoOriginal != logElement.innerText) {
  return 1;
 }
 if (inputElement.inputMode == 'numeric') {
  if (Zona.charAt(0) != '0') {
   Zona = '0' + Zona;
  }
  if (Zona.length < 4){
   Zona = Zona.slice(0,Zona.length-1) + '0' + Zona.slice(Zona.length-1,Zona.length)
  }
  if (Zona.indexOf('-') == -1) {
   Zona = Zona.slice(0,Zona.length-2) + '-' + Zona.slice(Zona.length-2,Zona.length)
  }
  while (Zona.charAt(0) == '0') {
   Zona = Zona.slice(1,Zona.length);
  }
  if (Zona == '-0' + ZonaOriginal && !isNaN(ZonaOriginal) && ZonaOriginal != ' ') {
   logElement.innerText = `Ir al bloque ${ZonaOriginal}`;
   ScrollArribaOCentro = 'start';
   ZonaInterpretada = Zona;
   return 1;
  }
  if (ZonaNoEncontrada <= 0) {
   mostrarzona(Zona);
  }
  ZonaInterpretada = Zona;
 }
 if (inputElement.inputMode == 'text') {
  if (UltimaCiudadBuscada != aplanartexto(inputElement.value)) {
   logElement.innerText = `Buscar ciudad: ${Zona}`;
  }
 }
}


function mostrarzona(zona = 'error interno', modociudad = false) {
 var ZonaElementoHTML, Bloque, DiaCierre, Notacelda = '';
 if (debug) {
  console.log (`"${zona}"`, 'mostrarzona()');
 }
 if (!modociudad) {
  logElement.innerText = `Zona: ${zona}`;
 }
 else if (modociudad) {
  logElement.innerHTML = `${TextoMostradoUltimaCiudadBuscada} \n${ConteoBusquedaCiudadesActual}/${LongitudBusquedaCiudadesActual}\nZona: ${zona}`;
 }
 ScrollArribaOCentro = 'center';
 ZonaElementoHTML = document.getElementById(zona);
 if(ZonaElementoHTML !== null) {
  Notacelda = ZonaElementoHTML.title;
  if(ZonaElementoHTML.tagName == 'TD' || ZonaElementoHTML.tagName == 'TH') {
   Bloque = ZonaElementoHTML.closest('table').id;
   DiaCierre =  document.querySelector(`[id="${Bloque}"] th[data-dia-de-cierre="${CeldaElemento.dataset.diaDeCierre}"]`).id;
  }
 }
 else {
  Notacelda = '';
 }
 if (NuevaListaDeZonas[zona] !== undefined) {
  if (NuevaListaDeZonas[zona].Ciudad !== "") {
   let Ciudad = NuevaListaDeZonas[zona].Ciudad;
   logElement.innerHTML += `${SaltoDeLinea}Ciudad: ${Ciudad}`;
  }
  if (NuevaListaDeZonas[zona].Telefono !== "") {
   if (!Array.isArray(NuevaListaDeZonas[zona].Telefono)) {
    let Telefono = NuevaListaDeZonas[zona].Telefono;
    logElement.innerHTML += `${SaltoDeLinea}Telefono: <a href="https://wa.me/+52${Telefono}">${Telefono}</a>`;
   }
   else {
    logElement.innerHTML += `${SaltoDeLinea}Telefono: `
    NuevaListaDeZonas[zona].Telefono.forEach(Telefono => {
     logElement.innerHTML += `<a href="https://wa.me/+52${Telefono}">${Telefono}</a>`;
    });
   }
  }
 }
 if (Bloque != undefined) {
  logElement.innerHTML += `${SaltoDeLinea}Bloque: ${Bloque}`;
 }
 if (DiaCierre != undefined) {
  logElement.innerHTML += `${SaltoDeLinea}Día de cierre: ${DiaCierre}`
 }
 if (Notacelda != '') {
  logElement.innerHTML += `${SaltoDeLinea}${Notacelda}`
 }
}


//funciones de botón


function CambiarTeclado() {
 if (ConteoTeclado == 0) {
  ConteoTeclado++;
  EtiquetaBuscador.textContent = 'Buscador de ciudades:';
  inputElement.inputMode = "text";
  BotonTeclado.value = 'Buscar zonas';
 }
 else {
  ConteoTeclado = 0;
  EtiquetaBuscador.textContent = 'Buscador de zonas:';
  inputElement.inputMode = "numeric";
  BotonTeclado.value = 'Buscar ciudades';
 }
 inputElement.focus();
 Interpretarzonas(inputElement.value);
}

function transparencia() {
 if (ConteoTransparencia == 0) {
  ConteoTransparencia++;
  cambiarcss('Transparente','#busqueda');
 }
 else {
  ConteoTransparencia = 0;
  cambiarcss('sticky','#busqueda');
 }
}


//Manipulacion de texto

function aplanartexto(TextoaAplanar, Textoaplanado = TextoaAplanar) {
//thanks for this code to Niall Maher (https://www.codu.co/articles/remove-accents-from-a-javascript-string-skgp1inb)
 Textoaplanado = TextoaAplanar.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
 Textoaplanado = Textoaplanado.toLowerCase();
 if (inputElement.inputMode == 'text') {
  var rb = 0;
  while (!/[a-z]/.test(Textoaplanado.slice(-1)) && Textoaplanado.length > 1)/*revisa el ultimo caracter para ver si no es una letra minúscula*/ {
   Textoaplanado = Textoaplanado.slice(0,-1); /*quita el último carácter*/ 
   rb++;
   if (rb > 20) {
    console.log('mal bucle');
    return 'Bucle infinito';
   }
  }
 rb = 0;
  while (!/[a-z]/.test(Textoaplanado.slice(0,1)) && Textoaplanado.length > 1)/*revisa el primer caracter para ver si no es una letra minúscula*/ {
   Textoaplanado = Textoaplanado.slice(1); /*quita el primer carácter*/
   rb++;
   if (rb > 20) {
    console.log('mal bucle');
    return 'Bucle infinito';
   }
  }
 }
 return Textoaplanado;
}


//console section


function revisarduplicados(unarray) {
  var ejecutar = true;
  if (!Array.isArray(unarray)) {
    console.error('no es un array');
    ejecutar = false;
  }
  var conteodu = 0, conteodeduplicados = 0;
  if (ejecutar) {
    unarray.forEach(elementoactual => {
      conteodu++;
      if (unarray.indexOf(elementoactual) != unarray.lastIndexOf(elementoactual) && elementoactual != 'noZona') {
        console.log(conteodu-1,'duplicado',unarray.indexOf(elementoactual),elementoactual,unarray.lastIndexOf(elementoactual),elementoactual);
        conteodeduplicados++;
      }
    });
  }
  console.log('hay', conteodeduplicados/2, 'duplicados');
}

function revisarexistencias(Array1, Array2, List = true, stringignorado = 'noZona') {
 if (List) {
  var ejecutar = true;
  if (!Array.isArray(Array1)) {
   console.error('no es un array');
   ejecutar = false;
  }
  var conteodu = 0, conteodeduplicados = 0;
  if (ejecutar) {
   Array1.forEach(elementoactual => {
    conteodu++;
    if (Array2.indexOf(elementoactual) == -1 && elementoactual != stringignorado) {
     console.log(conteodu-1,'no existe',Array1.indexOf(elementoactual),elementoactual,Array1.lastIndexOf(elementoactual),elementoactual);
     conteodeduplicados++;
    }
   });
  }
  console.log('hay', conteodeduplicados, 'elementos que no existen');
 }
 else {
  return (Array2.includes(Array1) && Array1 != stringignorado)
 }
}

consejos = ['Busca " " para cambiar rápidamente entre el buscador de ciudades y LV'];

const NuevaListaDeZonas = {
 "1-01": {
  Ciudad: "Ciudad Madero, Tamaulipas",
  Telefono: "8331519746"
 },
 "1-03": {
  Ciudad: "Tampico, Tamaulipas",
  Telefono: "8334113391"
 },
 "1-05": {
  Ciudad: "",
  Telefono: "8335130073"
 },
 "1-06": {
  Ciudad: "",
  Telefono: "8333016787"
 },
 "1-07": {
  Ciudad: "",
  Telefono: "8335073595"
 },
 "1-08": {
  Ciudad: "Cd. Valles, San Luis Potosi",
  Telefono: "4811457045"
 },
 "1-10": {
  Ciudad: "Melchor Ocampo, Tamaulipas",
  Telefono: "8311026738"
 },
 "1-12": {
  Ciudad: "Altamira, Tamaulipas",
  Telefono: "8332339584"
 },
 "1-15": {
  Ciudad: "Matamoros, Tamaulipas",
  Telefono: "8681154425"
 },
 "1-20": {
  Ciudad: "Ciudad Valles, San Luis Potosi",
  Telefono: "4871140395"
 },
 "1-27": {
  Ciudad: "Reynosa, Tamaulipas",
  Telefono: "8991384188"
 },
 "1-28": {
  Ciudad: "",
  Telefono: "8992986806"
 },
 "1-29": {
  Ciudad: "Reynosa, Tamaulipas",
  Telefono: "8992155577"
 },
 "1-33": {
  Ciudad: "",
  Telefono: "8682416644"
 },
 "1-40": {
  Ciudad: "Matamoros, Tamaulipas",
  Telefono: "8948826277"
 },
 "1-44": {
  Ciudad: "",
  Telefono: "8341186223"
 },
 "1-45": {
  Ciudad: "",
  Telefono: "8341898775"
 },
 "2-01": {
  Ciudad: "",
  Telefono: "8180240311"
 },
 "2-10": {
  Ciudad: "General Zuazua, Nuevo Leon",
  Telefono: "8132539324"
 },
 "2-11": {
  Ciudad: "Apodaca, Nuevo Leon",
  Telefono: "8110509899"
 },
 "2-12": {
  Ciudad: "",
  Telefono: "8112431484"
 },
 "2-13": {
  Ciudad: "",
  Telefono: "8120409135"
 },
 "2-14": {
  Ciudad: "",
  Telefono: "8130968616"
 },
 "2-15": {
  Ciudad: "Monterrey, Nuevo Leon",
  Telefono: "8126329832"
 },
 "2-17": {
  Ciudad: "Juarez, Nuevo Leon",
  Telefono: "8135545884"
 },
 "2-22": {
  Ciudad: "",
  Telefono: "8117855579"
 },
 "2-28": {
  Ciudad: "",
  Telefono: "8116832607"
 },
 "2-29": {
  Ciudad: "Salinas Victoria, Nuevo Leon",
  Telefono: "8131056770"
 },
 "2-37": {
  Ciudad: "",
  Telefono: "8124358573"
 },
 "2-38": {
  Ciudad: "",
  Telefono: "8211042353"
 },
 "2-41": {
  Ciudad: "",
  Telefono: "8672536887"
 },
 "2-42": {
  Ciudad: "",
  Telefono: "8672495756"
 },
 "2-43": {
  Ciudad: "Juarez, Nuevo Leon",
  Telefono: "8114984270"
 },
 "2-44": {
  Ciudad: "",
  Telefono: "8119837251"
 },
 "3-11": {
  Ciudad: "Cd. Juarez, Chihuahua",
  Telefono: "6566445542"
 },
 "3-14": {
  Ciudad: "Cd. Juarez, Chihuahua",
  Telefono: "6565942126"
 },
 "3-17": {
  Ciudad: "Chihuahua, Chihuahua",
  Telefono: "6143843841"
 },
 "3-20": {
  Ciudad: "Meoqui, Chihuahua",
  Telefono: "6481090058"
 },
 "3-22": {
  Ciudad: "",
  Telefono: "6275174538"
 },
 "3-24": {
  Ciudad: "",
  Telefono: "6361234591"
 },
 "3-31": {
  Ciudad: "Cd. Juarez, Chihuahua",
  Telefono: "6565923463"
 },
 "3-32": {
  Ciudad: "Cd. Juarez, Chihuahua",
  Telefono: "6563019311"
 },
 "3-33": {
  Ciudad: "Chihuahua, Chihuahua",
  Telefono: "6146014458"
 },
 "3-35": {
  Ciudad: "Cuauhtemoc, Chihuahua",
  Telefono: "6251640219"
 },
 "3-48": {
  Ciudad: "Cd. Juarez, Chihuahua",
  Telefono: "6145974002"
 },
 "4-26": {
  Ciudad: "Guaymas, Empalme, San Carlos, Sonora",
  Telefono: "6221149610"
 },
 "4-27": {
  Ciudad: "Hermosillo, Sonora",
  Telefono: "6624253434"
 },
 "4-29": {
  Ciudad: "Hermosillo, Sonora",
  Telefono: "6628472017"
 },
 "4-31": {
  Ciudad: "Hermosillo, Sonora",
  Telefono: "6621384072"
 },
 "4-32": {
  Ciudad: "Hermosillo, Sonora",
  Telefono: "6621278933"
 },
 "4-33": {
  Ciudad: "Nogales, Sonora",
  Telefono: "6311679226"
 },
 "4-35": {
  Ciudad: "Agua Prieta, Sonora",
  Telefono: "6331259594"
 },
 "4-48": {
  Ciudad: "Hermosillo, Sonora",
  Telefono: "6622787772"
 },
 "4-49": {
  Ciudad: "Nogales, Imuris, Magdalena, Santa Ana, Benjamin Hill, Carbo y Rayon, Sonora",
  Telefono: "6311772009"
 },
 "4-50": {
  Ciudad: "Tijuana, Baja California",
  Telefono: "6642938294"
 },
 "4-51": {
  Ciudad: "Tijuana, Baja California",
  Telefono: "6657997124"
 },
 "4-52": {
  Ciudad: "Tijuana, Baja California",
  Telefono: "6641150619"
 },
 "4-53": {
  Ciudad: "",
  Telefono: "6641196429"
 },
 "4-54": {
  Ciudad: "",
  Telefono: "6641705226"
 },
 "4-55": {
  Ciudad: "Tijuana, Baja California",
  Telefono: "6634394374"
 },
 "4-56": {
  Ciudad: "Tijuana, Baja California",
  Telefono: "6641995956"
 },
 "4-58": {
  Ciudad: "Mexicali, Baja California",
  Telefono: "6861389193"
 },
 "4-59": {
  Ciudad: "",
  Telefono: "6682820679"
 },
 "4-60": {
  Ciudad: "Mexicali, Baja California",
  Telefono: "6862449557"
 },
 "4-61": {
  Ciudad: "",
  Telefono: "6531343710"
 },
 "4-63": {
  Ciudad: "",
  Telefono: "6462477306"
 },
 "6-01": {
  Ciudad: "",
  Telefono: "3311409960"
 },
 "6-02": {
  Ciudad: "Huajicori, Nayarit",
  Telefono: "3231046969"
 },
 "6-04": {
  Ciudad: "",
  Telefono: "3171066935"
 },
 "6-06": {
  Ciudad: "Tlajomulco de Zuñiga, Jalisco",
  Telefono: "3330157521"
 },
 "6-07": {
  Ciudad: "Zapopan, Jalisco",
  Telefono: "3316246527"
 },
 "6-09": {
  Ciudad: "Guadalajara, Jalisco",
  Telefono: "3313210138"
 },
 "6-10": {
  Ciudad: "",
  Telefono: "3310233332"
 },
 "6-11": {
  Ciudad: "",
  Telefono: "3312564883"
 },
 "6-12": {
  Ciudad: "Zapopan, Jalisco",
  Telefono: "3314329381"
 },
 "6-13": {
  Ciudad: "Tlajomulco de Zuñiga, Jalisco",
  Telefono: "3312965880"
 },
 "6-14": {
  Ciudad: "",
  Telefono: "3310468339"
 },
 "6-15": {
  Ciudad: "Acatlan, Jalisco",
  Telefono: "3325372517"
 },
 "6-16": {
  Ciudad: "",
  Telefono: "3314652338"
 },
 "6-17": {
  Ciudad: "Manzanillo, Colima",
  Telefono: "3141000882"
 },
 "6-18": {
  Ciudad: "",
  Telefono: "3111462531"
 },
 "6-19": {
  Ciudad: "",
  Telefono: "3221688142"
 },
 "6-22": {
  Ciudad: "",
  Telefono: "3411631184"
 },
 "6-23": {
  Ciudad: "",
  Telefono: "3121069032"
 },
 "6-24": {
  Ciudad: "",
  Telefono: "3121340801"
 },
 "6-26": {
  Ciudad: "Tepic, Nayarit",
  Telefono: "3111352193"
 },
 "6-27": {
  Ciudad: "",
  Telefono: "3411062419"
 },
 "6-31": {
  Ciudad: "",
  Telefono: "3111284787"
 },
 "6-32": {
  Ciudad: "Las Varas, Compostela, Nayarit",
  Telefono: "3112508019"
 },
 "7-26": {
  Ciudad: "San Pedro, Coahuila",
  Telefono: "8712402412"
 },
 "7-34": {
  Ciudad: "Durango, durango",
  Telefono: "6182924505"
 },
 "7-35": {
  Ciudad: "Victoria de Durango, Durango",
  Telefono: "6181596092"
 },
 "7-36": {
  Ciudad: "",
  Telefono: "6181511762"
 },
 "7-37": {
  Ciudad: "Durango, durango",
  Telefono: "6182970802"
 },
 "7-38": {
  Ciudad: "Durango, durango",
  Telefono: "6182090897"
 },
 "7-42": {
  Ciudad: "Gomez Palacio, Durango",
  Telefono: "8713648038"
 },
 "7-43": {
  Ciudad: "Lerdo, Durango",
  Telefono: "8712438196"
 },
 "7-44": {
  Ciudad: "Torreon, Coahuila",
  Telefono: "8711358446"
 },
 "7-45": {
  Ciudad: "Lerdo, Durango",
  Telefono: "8714671909"
 },
 "7-47": {
  Ciudad: "",
  Telefono: "8712759132"
 },
 "7-48": {
  Ciudad: "Torreon, Coahuila",
  Telefono: "8713488785"
 },
 "7-49": {
  Ciudad: "Matamoros, Coahuila",
  Telefono: "8713910301"
 },
 "7-50": {
  Ciudad: "Saltillo, Coahuila",
  Telefono: "8444285485"
 },
 "7-51": {
  Ciudad: "Saltillo, Coahuila",
  Telefono: "8446222164"
 },
 "7-52": {
  Ciudad: "",
  Telefono: "8445014707"
 },
 "7-53": {
  Ciudad: "La Paz, Baja California Sur",
  Telefono: "6121203652"
 },
 "7-54": {
  Ciudad: "Los Cabos, Baja California Sur",
  Telefono: "6243556000"
 },
 "7-55": {
  Ciudad: "",
  Telefono: "8443140021"
 },
 "7-56": {
  Ciudad: "",
  Telefono: "8444442750"
 },
 "7-80": {
  Ciudad: "Saltillo Coahuila",
  Telefono: ""
 },
 "8-02": {
  Ciudad: "",
  Telefono: "3312546712"
 },
 "8-03": {
  Ciudad: "",
  Telefono: "3315185425"
 },
 "8-04": {
  Ciudad: "",
  Telefono: "3325987405"
 },
 "8-05": {
  Ciudad: "",
  Telefono: "3334960680"
 },
 "8-07": {
  Ciudad: "Tlaquepaque, Jalisco",
  Telefono: "3337780528"
 },
 "8-10": {
  Ciudad: "",
  Telefono: "3921009504"
 },
 "8-12": {
  Ciudad: "Tlaquepaque, Jalisco",
  Telefono: "3326081984"
 },
 "8-15": {
  Ciudad: "Tonala, Jalisco",
  Telefono: "3311519805"
 },
 "8-17": {
  Ciudad: "Tonala, Jalisco",
  Telefono: "3318072711"
 },
 "8-18": {
  Ciudad: "Tonala, Jalisco",
  Telefono: "3319645903"
 },
 "8-20": {
  Ciudad: "Tizapan El Alto, Jalisco",
  Telefono: "3314606636"
 },
 "8-23": {
  Ciudad: "",
  Telefono: "3781117175"
 },
 "8-26": {
  Ciudad: "",
  Telefono: "3781051330"
 },
 "8-27": {
  Ciudad: "Zacapu, Michoacan",
  Telefono: "4361089212"
 },
 "8-28": {
  Ciudad: "Tepalcatepec, Michoacan",
  Telefono: ["4531000899","4531502602"]
 },
 "8-29": {
  Ciudad: "",
  Telefono: ["4531109392","4521298877"]
 },
 "8-38": {
  Ciudad: "Jacona, Michoacan",
  Telefono: "3511026731"
 },
 "8-39": {
  Ciudad: "Uruapan, Michoacan",
  Telefono: "3541258695"
 },
 "8-40": {
  Ciudad: "La Piedad, Michoacan",
  Telefono: "3521081185"
 },
 "8-41": {
  Ciudad: "Lagos de Moreno, Jalisco",
  Telefono: "4747472082"
 },
 "9-05": {
  Ciudad: "morelia, michoacan",
  Telefono: "4432281686"
 },
 "9-09": {
  Ciudad: "Pungarabato, Guerrero",
  Telefono: ""
 },
 "9-14": {
  Ciudad: "",
  Telefono: "4432296499"
 },
 "9-15": {
  Ciudad: "morelia, michoacan",
  Telefono: "4434652287"
 },
 "9-21": {
  Ciudad: "",
  Telefono: "7151353755"
 },
 "9-27": {
  Ciudad: "Angangueo, Michoacan",
  Telefono: "7861162335"
 },
 "9-47": {
  Ciudad: "Mexicaltzingo, EdoMex",
  Telefono: "7225716126"
 },
 "9-48": {
  Ciudad: "Toluca, EdoMex",
  Telefono: "7223970965"
 },
 "9-49": {
  Ciudad: "Ixtlahuaca, EdoMex",
  Telefono: "7122501618"
 },
 "9-50": {
  Ciudad: "",
  Telefono: "4171012983"
 },
 "9-51": {
  Ciudad: "Donato Guerra, Valle de Bravo, EdoMex",
  Telefono: "7226502329"
 },
 "9-52": {
  Ciudad: "San Mateo Atenco, EdoMex",
  Telefono: "7223515395"
 },
 "9-53": {
  Ciudad: "Lerma, EdoMex",
  Telefono: "7226599421"
 },
 "9-54": {
  Ciudad: "Atzcapotzaltongo, Toluca",
  Telefono: "7121535458"
 },
 "9-55": {
  Ciudad: "Almoloya, EdoMex",
  Telefono: "7222437327"
 },
 "10-10": {
  Ciudad: "Celaya, Guanajuato",
  Telefono: "4611713230"
 },
 "10-14": {
  Ciudad: "Leon, Guanajuato",
  Telefono: "4771767865"
 },
 "10-16": {
  Ciudad: "Abasolo, Guanajuato",
  Telefono: ""
 },
 "10-17": {
  Ciudad: "San Francisco del Rincon, Guanajuato",
  Telefono: "4779227404"
 },
 "10-18": {
  Ciudad: "Leon, Guanajuato",
  Telefono: ""
 },
 "10-19": {
  Ciudad: "Leon, Guanajuato",
  Telefono: ""
 },
 "10-20": {
  Ciudad: "Leon, Guanajuato",
  Telefono: "4771120072"
 },
 "10-22": {
  Ciudad: "Abasolo, Guanajuato",
  Telefono: ""
 },
 "10-28": {
  Ciudad: "",
  Telefono: "4111312069"
 },
 "10-38": {
  Ciudad: "",
  Telefono: "4611555275"
 },
 "10-44": {
  Ciudad: "Leon, Guanajuato",
  Telefono: "4775751273"
 },
 "10-51": {
  Ciudad: "Silao, Guanajuato",
  Telefono: "4731170869"
 },
 "10-55": {
  Ciudad: "Valle de Santiago, Guanajuato",
  Telefono: ""
 },
 "10-65": {
  Ciudad: "",
  Telefono: "4422056700"
 },
 "10-66": {
  Ciudad: "Santa Cruz, Queretaro",
  Telefono: ""
 },
 "10-67": {
  Ciudad: "",
  Telefono: "4424466076"
 },
 "10-68": {
  Ciudad: "",
  Telefono: "4422326621"
 },
 "10-69": {
  Ciudad: "",
  Telefono: "4271284696"
 },
 "10-70": {
  Ciudad: "San Felipe, Guanajuato",
  Telefono: ""
 },
 "11-06": {
  Ciudad: "Cuautitlan, EdoMex",
  Telefono: "5530576006"
 },
 "11-07": {
  Ciudad: "Ecatepec, EdoMex",
  Telefono: "5512748840"
 },
 "11-10": {
  Ciudad: "Tecamac, EdoMex",
  Telefono: "5532984748"
 },
 "11-11": {
  Ciudad: "",
  Telefono: "7731187172"
 },
 "11-12": {
  Ciudad: "Tlahuelilpan, Hidalgo",
  Telefono: "7731362784"
 },
 "11-13": {
  Ciudad: "",
  Telefono: "5578742298"
 },
 "11-14": {
  Ciudad: "",
  Telefono: "7751247599"
 },
 "11-15": {
  Ciudad: "Tlanalapa, Hidalgo",
  Telefono: "5554543055"
 },
 "11-16": {
  Ciudad: "",
  Telefono: "7717000614"
 },
 "11-17": {
  Ciudad: "",
  Telefono: "7712053625"
 },
 "11-18": {
  Ciudad: "Tepotzotlan, EdoMex",
  Telefono: "5614327099"
 },
 "11-19": {
  Ciudad: "Tizayuca, Hidalgo",
  Telefono: "7711573861"
 },
 "11-20": {
  Ciudad: "",
  Telefono: "7721619511"
 },
 "11-24": {
  Ciudad: "Coacalco, EdoMex",
  Telefono: "5516297273"
 },
 "11-25": {
  Ciudad: "Tultitlan, EdoMex",
  Telefono: ""
 },
 "11-26": {
  Ciudad: "Nicolas Romero, EdoMex",
  Telefono: "5630037476"
 },
 "11-32": {
  Ciudad: "",
  Telefono: "5527092607"
 },
 "11-33": {
  Ciudad: "Coacalco, EdoMex",
  Telefono: "5522123425"
 },
 "11-38": {
  Ciudad: "Ecatepec, EdoMex",
  Telefono: "5515978974"
 },
 "11-41": {
  Ciudad: "Atizapan de Zaragoza, Adolfo Lopez Mateos, EdoMex",
  Telefono: "5531882612"
 },
 "11-52": {
  Ciudad: "Atenco, EdoMex",
  Telefono: "5538175898"
 },
 "11-56": {
  Ciudad: "Ecatepec, EdoMex",
  Telefono: "5566197279"
 },
 "11-57": {
  Ciudad: "Ecatepec, EdoMex",
  Telefono: ""
 },
 "13-05": {
  Ciudad: "El Paraiso, Veracruz",
  Telefono: "2831006898"
 },
 "13-06": {
  Ciudad: "",
  Telefono: "9241506376"
 },
 "13-07": {
  Ciudad: "Cosoleacaque, Veracruz",
  Telefono: "9221406585"
 },
 "13-09": {
  Ciudad: "",
  Telefono: "9212042734"
 },
 "13-10": {
  Ciudad: "",
  Telefono: "9211471104"
 },
 "13-11": {
  Ciudad: "Teapa, Tabasco",
  Telefono: "9932092786"
 },
 "13-14": {
  Ciudad: "Nanchital, Veracruz",
  Telefono: "9211976404"
 },
 "13-15": {
  Ciudad: "",
  Telefono: "9933830131"
 },
 "13-16": {
  Ciudad: "Palenque, Chiapas",
  Telefono: ""
 },
 "13-21": {
  Ciudad: "Villahermosa, Tabasco",
  Telefono: "9932403259"
 },
 "13-27": {
  Ciudad: "",
  Telefono: "2871202315"
 },
 "13-31": {
  Ciudad: "Villahermosa, Tabasco",
  Telefono: ""
 },
 "13-35": {
  Ciudad: "",
  Telefono: "9933964921"
 },
 "13-41": {
  Ciudad: "",
  Telefono: "2741111297"
 },
 "13-42": {
  Ciudad: "Cardenas y Comalcalco, Tabasco",
  Telefono: "9331025631"
 },
 "13-43": {
  Ciudad: "Paraiso, Tabasco",
  Telefono: "6861349537"
 },
 "13-44": {
  Ciudad: "",
  Telefono: "9371387363"
 },
 "13-45": {
  Ciudad: "Villahermosa, Tabasco",
  Telefono: "9933055981"
 },
 "14-03": {
  Ciudad: "Chimalhuacan, EdoMex",
  Telefono: "5580367324"
 },
 "14-05": {
  Ciudad: "Ixtapaluca, EdoMex",
  Telefono: ""
 },
 "14-10": {
  Ciudad: "Valle de Chalco, EdoMex",
  Telefono: "5528296727"
 },
 "14-42": {
  Ciudad: "",
  Telefono: "5516307056"
 },
 "14-43": {
  Ciudad: "Chimalhuacan, Chicoloapan, EdoMex",
  Telefono: "5548979890"
 },
 "14-45": {
  Ciudad: "",
  Telefono: "5541834347"
 },
 "14-47": {
  Ciudad: "",
  Telefono: "5512704693"
 },
 "14-49": {
  Ciudad: "Milpa Alta, CdMx, Ecatepec, EdoMex",
  Telefono: ["5531760823","5564467802"]
 },
 "14-53": {
  Ciudad: "Nezahualcóyotl, EdoMex",
  Telefono: "5537171246"
 },
 "14-54": {
  Ciudad: "",
  Telefono: "5571788409"
 },
 "14-55": {
  Ciudad: "Chimalhuacan, EdoMex",
  Telefono: "5517814626"
 },
 "14-56": {
  Ciudad: "Nezahualcóyotl, EdoMex",
  Telefono: ["5617537361","5544580283"]
 },
 "14-58": {
  Ciudad: "Nezahualcóyotl, EdoMex",
  Telefono: "5579218198"
 },
 "14-61": {
  Ciudad: "Iztapalapa, CdMx",
  Telefono: ""
 },
 "14-67": {
  Ciudad: "Xochimilco, Mexico",
  Telefono: ""
 },
 "14-68": {
  Ciudad: "Milpa Alta, CdMx",
  Telefono: ""
 },
 "16-11": {
  Ciudad: "Benito Juarez, Cancun, Quintana Roo",
  Telefono: "9982463454"
 },
 "16-12": {
  Ciudad: "Othon P. Blanco, Chetumal, Quintana Roo",
  Telefono: "9831550928"
 },
 "16-13": {
  Ciudad: "Benito Juarez, Quintana Roo",
  Telefono: "9982208078"
 },
 "16-14": {
  Ciudad: "",
  Telefono: "9999494735"
 },
 "16-16": {
  Ciudad: "",
  Telefono: "9991405593"
 },
 "16-17": {
  Ciudad: "Kanasin, Yucatan",
  Telefono: "9999002972"
 },
 "16-18": {
  Ciudad: "Merida, Yucatan",
  Telefono: "9992721568"
 },
 "16-19": {
  Ciudad: "",
  Telefono: "9811005515"
 },
 "16-21": {
  Ciudad: "Cd. del Carmen, Campeche",
  Telefono: "9932605073"
 },
 "16-22": {
  Ciudad: "Escarcega, Campeche",
  Telefono: "9821030814"
 },
 "16-23": {
  Ciudad: "Merida, Yucatan",
  Telefono: ""
 },
 "16-24": {
  Ciudad: "",
  Telefono: "9993013617"
 },
 "16-25": {
  Ciudad: "Halacho, Yucatan",
  Telefono: "9999084699"
 },
 "16-26": {
  Ciudad: "Tepic, Nayarit",
  Telefono: "9999066446"
 },
 "16-28": {
  Ciudad: "Solidaridad, Playa del Carmen, Quintana Roo",
  Telefono: "9843229852"
 },
 "17-01": {
  Ciudad: "Oaxaca, Oaxaca",
  Telefono: "9512295555"
 },
 "17-02": {
  Ciudad: "Santa Cruz Xoxocotlan, Oaxaca",
  Telefono: "9511835079"
 },
 "17-04": {
  Ciudad: "",
  Telefono: "9535380230"
 },
 "17-07": {
  Ciudad: "Apizaco, Tlaxcala",
  Telefono: ""
 },
 "17-08": {
  Ciudad: "",
  Telefono: "2461105430"
 },
 "17-12": {
  Ciudad: "Oaxaca, Oaxaca",
  Telefono: "9511773898"
 },
 "17-13": {
  Ciudad: "Amozoc, Puebla",
  Telefono: "2224695538"
 },
 "17-14": {
  Ciudad: "Puebla, Puebla",
  Telefono: "2223773367"
 },
 "17-16": {
  Ciudad: "Puebla, Puebla",
  Telefono: "2227082250"
 },
 "17-17": {
  Ciudad: "Rafael Lara Grajales, San Nicolas Buenos Aires, Puebla",
  Telefono: "2471745418"
 },
 "17-18": {
  Ciudad: "",
  Telefono: "2224354829"
 },
 "17-28": {
  Ciudad: "Oaxaca, Oaxaca",
  Telefono: "9512518827"
 },
 "17-32": {
  Ciudad: "Puebla, Puebla",
  Telefono: "2727842703"
 },
 "17-33": {
  Ciudad: "",
  Telefono: "2225077672"
 },
 "17-34": {
  Ciudad: "Puebla, Puebla",
  Telefono: "2211616987"
 },
 "17-35": {
  Ciudad: "",
  Telefono: "2381790548"
 },
 "17-39": {
  Ciudad: "",
  Telefono: "2381090535"
 },
 "17-40": {
  Ciudad: "",
  Telefono: "2464602571"
 },
 "17-43": {
  Ciudad: "",
  Telefono: "2227609044"
 },
 "18-08": {
  Ciudad: "",
  Telefono: "2299037944"
 },
 "18-09": {
  Ciudad: "Veracruz, Veracruz",
  Telefono: "2291247192"
 },
 "18-10": {
  Ciudad: "",
  Telefono: "2291484635"
 },
 "18-11": {
  Ciudad: "Veracruz, Veracruz",
  Telefono: "2292101584"
 },
 "18-16": {
  Ciudad: "Amatlan de los Reyes, Veracruz",
  Telefono: ""
 },
 "18-18": {
  Ciudad: "Tlalixcoyan, Veracruz",
  Telefono: "2291065562"
 },
 "18-20": {
  Ciudad: "Orizaba, Veracruz",
  Telefono: ""
 },
 "18-29": {
  Ciudad: "Chocaman, Veracruz",
  Telefono: "2711225107"
 },
 "18-34": {
  Ciudad: "Atzacan, Veracruz",
  Telefono: "2721881049"
 },
 "18-39": {
  Ciudad: "Cordoba, Veracruz",
  Telefono: "3541016858"
 },
 "18-40": {
  Ciudad: "Cosoleacaque, Veracruz",
  Telefono: "2941397593"
 },
 "18-41": {
  Ciudad: "Santiago Tuxtla, Veracruz",
  Telefono: ""
 },
 "18-80": {
  Ciudad: "Veracruz, Veracruz",
  Telefono: ""
 },
 "19-06": {
  Ciudad: "Cuauhtemoc, CdMx",
  Telefono: "5527632137"
 },
 "19-08": {
  Ciudad: "",
  Telefono: "5537186761"
 },
 "19-09": {
  Ciudad: "Cuauhtemoc, CdMx",
  Telefono: ["5527771429","5541311287"]
 },
 "19-11": {
  Ciudad: "Gustavo A. Madero, CdMx",
  Telefono: "5521309061"
 },
 "19-14": {
  Ciudad: "Alvaro Obregon, CdMx",
  Telefono: "5527744368"
 },
 "19-15": {
  Ciudad: "Naucalpan, EdoMex",
  Telefono: "5537539700"
 },
 "19-16": {
  Ciudad: "Naucalpan, EdoMex",
  Telefono: "5580848313"
 },
 "19-23": {
  Ciudad: "",
  Telefono: "5540275326"
 },
 "19-30": {
  Ciudad: "Tlalnepantla, EdoMex",
  Telefono: ""
 },
 "19-31": {
  Ciudad: "",
  Telefono: "5519949886"
 },
 "19-35": {
  Ciudad: "Gustavo A. Madero, CdMx",
  Telefono: "5565399033"
 },
 "19-40": {
  Ciudad: "Tultitlan, EdoMex",
  Telefono: "5627306375"
 },
 "19-42": {
  Ciudad: "Nicolas Romero, EdoMex",
  Telefono: "5527168429"
 },
 "19-56": {
  Ciudad: "Tlalpan, CdMx",
  Telefono: ""
 },
 "21-24": {
  Ciudad: "",
  Telefono: "4443853923"
 },
 "21-28": {
  Ciudad: "San Luis Potosi, San Luis Potosi",
  Telefono: "4441158834"
 },
 "21-29": {
  Ciudad: "Calvillo, Aguascalientes",
  Telefono: ""
 },
 "21-31": {
  Ciudad: "Aguascalientes, Aguascalientes",
  Telefono: "4492631603"
 },
 "21-33": {
  Ciudad: "villa de ramos, san luis potosi",
  Telefono: "4931370474"
 },
 "21-34": {
  Ciudad: "",
  Telefono: "4931123569"
 },
 "21-35": {
  Ciudad: "",
  Telefono: "4931124342"
 },
 "21-38": {
  Ciudad: "Venegas, San Luis Potosi",
  Telefono: "4442241569"
 },
 "21-47": {
  Ciudad: "",
  Telefono: "4491898082"
 },
 "21-48": {
  Ciudad: "San Luis Potosi, San Luis Potosi",
  Telefono: ""
 },
 "21-49": {
  Ciudad: "San Luis Potosi, San Luis Potosi",
  Telefono: ""
 },
 "21-56": {
  Ciudad: "",
  Telefono: "4491254203"
 },
 "21-64": {
  Ciudad: "General Francisco Murguia, Juan Aldama, Zacatecas",
  Telefono: "4931003768"
 },
 "22-01": {
  Ciudad: "",
  Telefono: "7443346601"
 },
 "22-02": {
  Ciudad: "Acapulco, Guerrero",
  Telefono: "7441215297"
 },
 "22-03": {
  Ciudad: "Acapulco, Guerrero",
  Telefono: "7443453102"
 },
 "22-04": {
  Ciudad: "",
  Telefono: "7551046235"
 },
 "22-05": {
  Ciudad: "",
  Telefono: "7441039129"
 },
 "22-06": {
  Ciudad: "Acapulco, Guerrero",
  Telefono: "7441288645"
 },
 "22-10": {
  Ciudad: "Chilpancingo de los Bravo, Guerrero",
  Telefono: ""
 },
 "22-17": {
  Ciudad: "Chilpancingo de los Bravo, Guerrero",
  Telefono: "7471170137"
 },
 "22-20": {
  Ciudad: "Iguala, Guerrero",
  Telefono: "7331276119"
 },
 "22-23": {
  Ciudad: "Tuncingo, Guerrero",
  Telefono: ""
 },
 "22-24": {
  Ciudad: "Cuautla, Morelos",
  Telefono: ""
 },
 "22-26": {
  Ciudad: "",
  Telefono: "7774645174"
 },
 "22-27": {
  Ciudad: "cuernavaca, morelos",
  Telefono: "7774396810"
 },
 "22-28": {
  Ciudad: "Xoxocotla, Morelos",
  Telefono: "7341100317"
 },
 "22-31": {
  Ciudad: "",
  Telefono: "7331905570"
 },
 "22-34": {
  Ciudad: "Tlapa de Comonfort, Guerrero",
  Telefono: "2431197307"
 },
 "23-01": {
  Ciudad: "Santa Catarina, Nuevo Leon",
  Telefono: "8120247644"
 },
 "23-02": {
  Ciudad: "San Pedro Garza Garcia, Nuevo Leon",
  Telefono: ""
 },
 "23-03": {
  Ciudad: "Garcia, Nuevo Leon",
  Telefono: "8118146596"
 },
 "23-04": {
  Ciudad: "",
  Telefono: "8125402506"
 },
 "23-05": {
  Ciudad: "",
  Telefono: "8111272163"
 },
 "23-06": {
  Ciudad: "Carmen, Nuevo Leon",
  Telefono: "8113779130"
 },
 "23-17": {
  Ciudad: "",
  Telefono: "8661153417"
 },
 "23-18": {
  Ciudad: "Monclova, Coahuila",
  Telefono: "8666385914"
 },
 "23-19": {
  Ciudad: "Sabinas, Coahuila",
  Telefono: ""
 },
 "23-22": {
  Ciudad: "Acuña, Coahuila",
  Telefono: "8771133409"
 },
 "23-30": {
  Ciudad: "El Carmen, Nuevo Leon",
  Telefono: "8126259691"
 },
 "23-31": {
  Ciudad: "",
  Telefono: "8126405068"
 },
 "23-45": {
  Ciudad: "Garcia, Nuevo Leon",
  Telefono: "8132376768"
 },
 "27-18": {
  Ciudad: "Cd. Obregon, Sonora",
  Telefono: "6441148786"
 },
 "27-19": {
  Ciudad: "Cd. Obregon, Sonora",
  Telefono: "6441521633"
 },
 "27-20": {
  Ciudad: "Obregon, Sonora",
  Telefono: ""
 },
 "27-21": {
  Ciudad: "Navojoa, Sonora",
  Telefono: ""
 },
 "27-22": {
  Ciudad: "El Fuerte, Sinaloa",
  Telefono: "6688827200"
 },
 "27-23": {
  Ciudad: "Los Mochis, Sinaloa",
  Telefono: ""
 },
 "27-25": {
  Ciudad: "Guasave, Sinaloa",
  Telefono: ""
 },
 "27-26": {
  Ciudad: "Angostura, Sinaloa",
  Telefono: ""
 },
 "27-27": {
  Ciudad: "Navolato, Sinaloa",
  Telefono: ""
 },
 "27-28": {
  Ciudad: "",
  Telefono: "6691417689"
 },
 "27-29": {
  Ciudad: "Culiacan, Sinaloa",
  Telefono: "6675774318"
 },
 "27-30": {
  Ciudad: "",
  Telefono: "6671429864"
 },
 "27-31": {
  Ciudad: "Culiacan, Sinaloa",
  Telefono: "6672045739"
 },
 "27-32": {
  Ciudad: "",
  Telefono: "6971110195"
 },
 "27-33": {
  Ciudad: "",
  Telefono: "6691634776"
 },
 "27-34": {
  Ciudad: "",
  Telefono: "2297802689"
 },
 "27-35": {
  Ciudad: "Culiacan, Sinaloa",
  Telefono: "6671955434"
 },
 "27-36": {
  Ciudad: "Bachigualatillo, Sinaloa",
  Telefono: "6677976369"
 },
 "28-01": {
  Ciudad: "",
  Telefono: "8461046561"
 },
 "28-03": {
  Ciudad: "Tuxpan, Veracruz",
  Telefono: "7831361057"
 },
 "28-04": {
  Ciudad: "",
  Telefono: "7821472804"
 },
 "28-05": {
  Ciudad: "Poza Rica, Veracruz",
  Telefono: ""
 },
 "28-06": {
  Ciudad: "",
  Telefono: "7848487825"
 },
 "28-07": {
  Ciudad: "",
  Telefono: "7821684894"
 },
 "28-09": {
  Ciudad: "",
  Telefono: "2321248286"
 },
 "28-11": {
  Ciudad: "Altotonga, Veracruz",
  Telefono: "2313196064"
 },
 "28-13": {
  Ciudad: "",
  Telefono: "2284037390"
 },
 "28-14": {
  Ciudad: "Xalapa, Veracruz",
  Telefono: ""
 },
 "28-15": {
  Ciudad: "",
  Telefono: "2282692825"
 },
 "28-16": {
  Ciudad: "",
  Telefono: "2283057332"
 },
 "29-01": {
  Ciudad: "Tuxtla Gutierrez, Chiapas",
  Telefono: "9613753442"
 },
 "29-02": {
  Ciudad: "Tuxtla Gutierrez, Chiapas",
  Telefono: "9612313516"
 },
 "29-03": {
  Ciudad: "Tuxtla Gutierrez, Chiapas",
  Telefono: "9616672491"
 },
 "29-04": {
  Ciudad: "San Fernando, Chiapas",
  Telefono: "9612702163"
 },
 "29-05": {
  Ciudad: "Tuxtla Gutierrez, Chiapas",
  Telefono: "9614498682"
 },
 "29-06": {
  Ciudad: "Ocozocoautla, Chiapas",
  Telefono: ""
 },
 "29-07": {
  Ciudad: "Ocosingo, Chiapas",
  Telefono: "9671540025"
 },
 "29-08": {
  Ciudad: "",
  Telefono: "9612354378"
 },
 "29-09": {
  Ciudad: "La Trinitaria, Chiapas",
  Telefono: "9631234841"
 },
 "29-11": {
  Ciudad: "Tapachula, Chiapas",
  Telefono: "9621118974"
 },
 "29-12": {
  Ciudad: "Tonala, Acapetahua, Chiapas",
  Telefono: "9181035253"
 },
 "29-13": {
  Ciudad: "Heroica Ciudad de Juchitan de Zaragoza, Oaxaca",
  Telefono: "9711212867"
 },
 "29-14": {
  Ciudad: "San Juan Guichicovi, Oaxaca",
  Telefono: "9633552856"
 },
 length: {
  "Ambos": 201,
  "Ciudad": 42,
  "Telefono": 124,
  "Zonas": 364
 }
}
Object.defineProperty(NuevaListaDeZonas,"length",{enumerable:false});

// relleno


/*
function textReplace(haystack, needle, replacement) {
  needle = needle.replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, '\\$1')
                 .replace(/\x08/g, '\\x08');
  return haystack.replace(new RegExp(needle, 'g'), replacement);
}
*/
function mathRandomInt(a, b) {
  if (a > b) {
    // Swap a and b to ensure a is smaller.
    var c = a;
    a = b;
    b = c;
  }
  return Math.floor(Math.random() * (b - a + 1) + a);
}


