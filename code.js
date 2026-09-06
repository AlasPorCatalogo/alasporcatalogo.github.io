var listazonas,
 listaciudades,
 CeldaElemento,
 TextoDiv,
 AgregarDetallesDeZonasYaEjecutado,
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
 consejos,
 DateOptions = {day: "numeric",month: "short",year:"2-digit"};
document.addEventListener("DOMContentLoaded", (event) => {
// Page has loaded
  definicionvariables();
  ManejarLocalStorage();
  AgregarDetallesDeZonas();
});

function ManejarLocalStorage() {
 function QuitarCosasDeLaTabla(Evento,Sufijo,Texto,Clase) {
  if (localStorage.getItem(`AxC${Sufijo}`) === null) {
   localStorage.setItem(`AxC${Sufijo}`,"true");
   document.documentElement.classList.add(Clase);
   Evento.currentTarget.value = `Añadir ${Texto} a la tabla`
  }
  else {
   localStorage.removeItem(`AxC${Sufijo}`);
   document.documentElement.classList.remove(Clase);
   Evento.currentTarget.value = `Quitar ${Texto} de la tabla`
 	}
 }
 const QuitarTelefonos = document.createElement('input');
 QuitarTelefonos.type = 'button';
 const QuitarCiudades = QuitarTelefonos.cloneNode(true),
 	QuitarRepartos = QuitarTelefonos.cloneNode(true);
 QuitarTelefonos.id = "QuitarTelefonos";
 QuitarCiudades.id = "QuitarCiudades";
 QuitarRepartos.id = "QuitarReparto";
 QuitarTelefonos.value = "Quitar teléfonos de la tabla";
 QuitarCiudades.value = "Quitar ciudades de la tabla";
 QuitarRepartos.value = "Quitar días de reparto de la tabla";
 FormCSS = document.querySelector('form[name="Cambiodecss"]');
 FormCSS.appendChild(QuitarCiudades);
 FormCSS.appendChild(QuitarTelefonos);
 FormCSS.appendChild(QuitarRepartos);
 let AxCTablas = localStorage.getItem("AxCTablas"),
 	AxCTelefonos = localStorage.getItem("AxCTelefonos"),
 	AxCCiudades = localStorage.getItem("AxCCiudades"),
 	AxCRepartos = localStorage.getItem("AxCRepartos");
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
 QuitarCiudades.addEventListener("click", (Event)=>{QuitarCosasDeLaTabla(Event,"Ciudades","ciudades","SinCiudades")});
 QuitarTelefonos.addEventListener("click", (Event)=>{QuitarCosasDeLaTabla(Event,"Telefonos","teléfonos","SinTelefonos")});
 QuitarRepartos.addEventListener("click", (Event) => {QuitarCosasDeLaTabla(Event,"Repartos","días de reparto","SinRepartos")});
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
   TextoMostradoUltimaCiudadBuscada = logElement.innerHTML;
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


function AgregarDetallesDeZonas() {
 let CeldasVisitadas = 0,
  CiudadesAgregadas = 0,
  TelefonosAgregados = 0,
  RepartosAgregados = 0,
  Columna = 0,
  PCiudad = document.createElement('p'),
  PTelefono = document.createElement('p'),
  PReparto = document.createElement('p');
 PCiudad.className = "Ciudad";
 PTelefono.className = "Telefono";
 PReparto.className = "Reparto";
 if (!AgregarDetallesDeZonasYaEjecutado) {
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
    if (Zona.Ciudad != "") {
     CiudadesAgregadas++;
     let ElementoCiudad = PCiudad.cloneNode();
     ElementoCiudad.textContent = Zona.Ciudad;
     Div.appendChild(ElementoCiudad);
    }
    if (Zona.Telefono != "") {
     TelefonosAgregados++;
     let ElementoTelefono = PTelefono.cloneNode();
     ElementoTelefono.textContent = Zona.Telefono;
     Div.appendChild(ElementoTelefono);
    }
    if (Zona.Reparto != "") {
    	RepartosAgregados++;
    	let ElementoReparto = PReparto.cloneNode();
    	ElementoReparto.textContent = `${Zona.Reparto} Días`;
    	Div.appendChild(ElementoReparto);
    }
   }
  });
 }
 AgregarDetallesDeZonasYaEjecutado = true;
 `Busqueda realizada en ${CeldasVisitadas} Celdas. Agregadas ${CiudadesAgregadas} ciudades de ${NuevaListaDeZonas.length.Telefono+NuevaListaDeZonas.length.Ambos} disponibles`;
 console.log(`Busqueda realizada en ${CeldasVisitadas} Celdas. Agregadas ${CiudadesAgregadas} ciudades de ${NuevaListaDeZonas.length.Ciudad+NuevaListaDeZonas.length.Ambos} disponibles`);
 console.log(`Busqueda realizada en ${CeldasVisitadas} Celdas. Agregados ${TelefonosAgregados} telefonos de ${NuevaListaDeZonas.length.Telefono+NuevaListaDeZonas.length.Ambos} disponibles`);
 console.log(`Busqueda realizada en ${CeldasVisitadas} Celdas. Agregados ${RepartosAgregados} telefonos de ${NuevaListaDeZonas.length.Telefono+NuevaListaDeZonas.length.Ambos} disponibles`);
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
   logElement.innerHTML = `<span class="Informacion">Buscar ciudad:</span> ${Zona}`;
  }
 }
}


function mostrarzona(zona = 'error interno', modociudad = false) {
 var ZonaElementoHTML, Bloque, DiaCierre, Notacelda = '';
 if (debug) {
  console.log (`"${zona}"`, 'mostrarzona()');
 }
 if (!modociudad) {
  logElement.innerHTML = `<span class="Informacion">Zona:</span> ${zona}`;
 }
 else if (modociudad) {
  logElement.innerHTML = `${TextoMostradoUltimaCiudadBuscada} \n${ConteoBusquedaCiudadesActual}/${LongitudBusquedaCiudadesActual}\n<span class="Informacion">Zona:</span> ${zona}`;
 }
 ScrollArribaOCentro = 'center';
 ZonaElementoHTML = document.getElementById(zona);
 if(ZonaElementoHTML !== null) {
  Notacelda = ZonaElementoHTML.title;
  if(ZonaElementoHTML.tagName == 'TD' || ZonaElementoHTML.tagName == 'TH') {
   Bloque = ZonaElementoHTML.closest('table').id;
   DiaCierre =  document.querySelector(`[id="${Bloque}"] th[data-dia-de-cierre="${ZonaElementoHTML.dataset.diaDeCierre}"]`).id;
  }
 }
 else {
  Notacelda = '';
 }
 if (NuevaListaDeZonas[zona] !== undefined) {
  if (NuevaListaDeZonas[zona].Ciudad !== "") {
   let Ciudad = NuevaListaDeZonas[zona].Ciudad;
   logElement.innerHTML += `${SaltoDeLinea}<span class="Informacion">Ciudad:</span> ${Ciudad}`;
  }
  if (NuevaListaDeZonas[zona].Telefono !== "") {
   if (!Array.isArray(NuevaListaDeZonas[zona].Telefono)) {
    let Telefono = NuevaListaDeZonas[zona].Telefono;
    logElement.innerHTML += `${SaltoDeLinea}<span class="Informacion">Telefono:</span> <a href="https://wa.me/+52${Telefono}">${Telefono}</a>`;
   }
   else {
    logElement.innerHTML += `${SaltoDeLinea}<span class="Informacion">Telefono:</span> `
    NuevaListaDeZonas[zona].Telefono.forEach(Telefono => {
     logElement.innerHTML += `<a href="https://wa.me/+52${Telefono}">${Telefono}</a>`;
    });
   }
  }
 }
 if (Bloque != undefined) {
  logElement.innerHTML += `${SaltoDeLinea}<span class="Informacion">Bloque:</span> ${Bloque}`;
 }
 if (DiaCierre != undefined) {
  logElement.innerHTML += `${SaltoDeLinea}<span class="Informacion">Día de cierre:</span> ${DiaCierre}`
 }
 if (NuevaListaDeZonas[zona] !== undefined) {
  if (NuevaListaDeZonas[zona].Reparto !== "") {
  	let Reparto = NuevaListaDeZonas[zona].Reparto,
  	FechaReparto = new Date(DiaCierre.replace("ene","jan").replace("abr","apr").replace("ago","aug").replace("dic","dec")),
  	ArrayRango = Reparto.split("-").map(Dia => Number(Dia)),
  	FechaMinimaDeReparto = new Date(FechaReparto.setDate(FechaReparto.getDate() + ArrayRango[0]));
  	if (ArrayRango.length > 1) {
	  	FechaMaximaDeReparto = new Date(FechaReparto.setDate(FechaReparto.getDate() + (ArrayRango[1] - ArrayRango[0]))),
	   CalculatedDates = `<span class="FechaCalculada">${FechaMinimaDeReparto.toLocaleString("la",DateOptions).replaceAll(" ","-")}/${FechaMaximaDeReparto.toLocaleString("la",DateOptions).replaceAll(" ","-")}</span>`;
	  	logElement.innerHTML += `${SaltoDeLinea}<span class="Informacion">Reparto:</span> De ${Reparto} días después del cierre ${CalculatedDates}`
  	}
  	else {
  		CalculatedDates = `<span class="FechaCalculada">${FechaMinimaDeReparto.toLocaleString("la",DateOptions).replaceAll(" ","-")}</span>`;
  		logElement.innerHTML += `${SaltoDeLinea}<span class="Informacion">Reparto:</span> ${Reparto} días después del cierre ${CalculatedDates}`
  	}
  }
 }
 if (Notacelda != '') {
  logElement.innerHTML += `${SaltoDeLinea}<span class="Informacion">Nota:</span> ${Notacelda}`
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
 if (Textoaplanado != ' ') {
  Textoaplanado = Textoaplanado.trim();
 }
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

class Zona {
	constructor(Ciudad = "", Telefono = "", Reparto = "") {
		this.Ciudad = Ciudad;
		this.Telefono = Telefono;
		this.Reparto = Reparto;
	}
}

const NuevaListaDeZonas = {
	"1-01": new Zona(
		"Ciudad Madero, Tamaulipas",
		"8331519746"
	),
	"1-03": new Zona(
		"Tampico, Tamaulipas",
		"8334113391"
	),
	"1-05": new Zona(
		"",
		"8335130073"
	),
	"1-06": new Zona(
		"",
		"8333016787"
	),
	"1-07": new Zona(
		"",
		"8335073595"
	),
	"1-08": new Zona(
		"Cd. Valles, San Luis Potosi",
		"4811457045"
	),
	"1-10": new Zona(
		"Melchor Ocampo, Tamaulipas",
		"8311026738"
	),
	"1-12": new Zona(
		"Altamira, Tamaulipas",
		"8332339584"
	),
	"1-15": new Zona(
		"Matamoros, Tamaulipas",
		"8681154425"
	),
	"1-20": new Zona(
		"Ciudad Valles, San Luis Potosi",
		"4871140395"
	),
	"1-27": new Zona(
		"Reynosa, Tamaulipas",
		"8991384188"
	),
	"1-28": new Zona(
		"",
		"8992986806"
	),
	"1-29": new Zona(
		"Reynosa, Tamaulipas",
		"8992155577"
	),
	"1-33": new Zona(
		"",
		"8682416644"
	),
	"1-40": new Zona(
		"Matamoros, Tamaulipas",
		"8948826277"
	),
	"1-41": new Zona(
		"Reynosa, Tamaulipas"
	),
	"1-44": new Zona(
		"",
		"8341186223"
	),
	"1-45": new Zona(
		"",
		"8341898775"
	),
	"2-01": new Zona(
		"",
		"8180240311"
	),
	"2-10": new Zona(
		"General Zuazua, Nuevo Leon",
		"8132539324"
	),
	"2-11": new Zona(
		"Apodaca, Nuevo Leon",
		"8110509899"
	),
	"2-12": new Zona(
		"",
		"8112431484"
	),
	"2-13": new Zona(
		"",
		"8120409135"
	),
	"2-14": new Zona(
		"",
		"8130968616"
	),
	"2-15": new Zona(
		"Monterrey, Nuevo Leon",
		"8126329832",
		"7"
	),
	"2-17": new Zona(
		"Juarez, Nuevo Leon",
		"8135545884"
	),
	"2-22": new Zona(
		"",
		"8117855579"
	),
	"2-28": new Zona(
		"",
		"8116832607"
	),
	"2-29": new Zona(
		"Salinas Victoria, El Carmen, Hidalgo, Nuevo Leon",
		"8131056770"
	),
	"2-37": new Zona(
		"",
		"8124358573"
	),
	"2-38": new Zona(
		"",
		"8211042353"
	),
	"2-41": new Zona(
		"",
		"8672536887"
	),
	"2-42": new Zona(
		"",
		"8672495756"
	),
	"2-43": new Zona(
		"Juarez, Nuevo Leon",
		"8114984270"
	),
	"2-44": new Zona(
		"",
		"8119837251"
	),
	"3-11": new Zona(
		"Cd. Juarez, Chihuahua",
		"6566445542"
	),
	"3-14": new Zona(
		"Cd. Juarez, Chihuahua",
		"6565942126"
	),
	"3-17": new Zona(
		"Chihuahua, Aldama, Chihuahua",
		"6143843841",
		"8"
	),
	"3-20": new Zona(
		"Meoqui, Chihuahua",
		"6481090058"
	),
	"3-21": new Zona(
		"Chihuahua, Chihuahua"
	),
	"3-22": new Zona(
		"",
		"6275174538"
	),
	"3-24": new Zona(
		"Galeana, Chihuahua",
		"6361234591"
	),
	"3-31": new Zona(
		"Cd. Juarez, Chihuahua",
		"6565923463"
	),
	"3-32": new Zona(
		"Cd. Juarez, Chihuahua",
		"6563019311"
	),
	"3-33": new Zona(
		"Chihuahua, Chihuahua",
		"6146014458",
		"9"
	),
	"3-35": new Zona(
		"Cuauhtemoc, Chihuahua",
		"6251640219",
		"6-9"
	),
	"3-48": new Zona(
		"Cd. Juarez y Chihuahua y Aquiles Serdan, Chihuahua",
		"6145974002",
		"6"
	),
	"4-26": new Zona(
		"Guaymas, Empalme, San Carlos, Sonora",
		"6221149610"
	),
	"4-27": new Zona(
		"Hermosillo, Sonora",
		"6624253434"
	),
	"4-29": new Zona(
		"Hermosillo, Sonora",
		"6628472017"
	),
	"4-31": new Zona(
		"Hermosillo, Sonora",
		"6621384072"
	),
	"4-32": new Zona(
		"Hermosillo, Sonora",
		"6621278933"
	),
	"4-33": new Zona(
		"Nogales, Sonora",
		"6311679226"
	),
	"4-34": new Zona(
		"Sonoyta, Sonora"
	),
	"4-35": new Zona(
		"Agua Prieta, Sonora",
		"6331259594"
	),
	"4-48": new Zona(
		"Hermosillo, Sonora",
		"6622787772"
	),
	"4-49": new Zona(
		"Nogales, Imuris, Magdalena, Santa Ana, Benjamin Hill, Carbo y Rayon, Sonora",
		"6311772009"
	),
	"4-50": new Zona(
		"Tijuana, Baja California",
		"6642938294"
	),
	"4-51": new Zona(
		"Tijuana, Baja California",
		"6657997124"
	),
	"4-52": new Zona(
		"Tijuana, Baja California",
		"6641150619"
	),
	"4-53": new Zona(
		"",
		"6641196429"
	),
	"4-54": new Zona(
		"",
		"6641705226"
	),
	"4-55": new Zona(
		"Tijuana, Baja California",
		"6634394374"
	),
	"4-56": new Zona(
		"Tijuana, Baja California",
		"6641995956"
	),
	"4-58": new Zona(
		"Mexicali, Baja California",
		"6861389193"
	),
	"4-59": new Zona(
		"",
		"6682820679"
	),
	"4-60": new Zona(
		"Mexicali, Baja California",
		"6862449557"
	),
	"4-61": new Zona(
		"",
		"6531343710"
	),
	"4-63": new Zona(
		"",
		"6462477306"
	),
	"6-01": new Zona(
		"",
		"3311409960"
	),
	"6-02": new Zona(
		"Huajicori, Nayarit",
		"3231046969"
	),
	"6-04": new Zona(
		"",
		"3171066935"
	),
	"6-06": new Zona(
		"Tlajomulco de Zuñiga, Jalisco",
		"3330157521"
	),
	"6-07": new Zona(
		"Zapopan, Tesistan, Jalisco",
		"3316246527"
	),
	"6-09": new Zona(
		"Guadalajara, Jalisco",
		"3313210138"
	),
	"6-10": new Zona(
		"",
		"3310233332"
	),
	"6-11": new Zona(
		"",
		"3312564883"
	),
	"6-12": new Zona(
		"Zapopan, Jalisco",
		"3314329381"
	),
	"6-13": new Zona(
		"Tlajomulco de Zuñiga, Jalisco",
		"3312965880"
	),
	"6-14": new Zona(
		"Zapopan, Jalisco",
		"3310468339"
	),
	"6-15": new Zona(
		"Acatlan, Jalisco",
		"3325372517"
	),
	"6-16": new Zona(
		"",
		"3314652338"
	),
	"6-17": new Zona(
		"Manzanillo, Colima",
		"3141000882"
	),
	"6-18": new Zona(
		"",
		"3111462531"
	),
	"6-19": new Zona(
		"",
		"3221688142"
	),
	"6-22": new Zona(
		"",
		"3411631184"
	),
	"6-23": new Zona(
		"",
		"3121069032"
	),
	"6-24": new Zona(
		"",
		"3121340801"
	),
	"6-26": new Zona(
		"Tepic, Nayarit",
		"3111352193"
	),
	"6-27": new Zona(
		"",
		"3411062419"
	),
	"6-31": new Zona(
		"",
		"3111284787"
	),
	"6-32": new Zona(
		"Las Varas, Compostela, Nayarit",
		"3112508019"
	),
	"7-26": new Zona(
		"San Pedro, Coahuila",
		"8712402412"
	),
	"7-34": new Zona(
		"Durango, durango",
		"6182924505"
	),
	"7-35": new Zona(
		"Victoria de Durango, Durango",
		"6181596092"
	),
	"7-36": new Zona(
		"",
		"6181511762"
	),
	"7-37": new Zona(
		"Durango, durango",
		"6182970802"
	),
	"7-38": new Zona(
		"Durango, durango",
		"6182090897"
	),
	"7-42": new Zona(
		"Gomez Palacio, Durango",
		"8713648038"
	),
	"7-43": new Zona(
		"Lerdo, Durango",
		"8712438196"
	),
	"7-44": new Zona(
		"Torreon, Coahuila",
		"8711358446"
	),
	"7-45": new Zona(
		"Lerdo, Durango",
		"8714671909"
	),
	"7-47": new Zona(
		"",
		"8712759132"
	),
	"7-48": new Zona(
		"Torreon, Coahuila",
		"8713488785"
	),
	"7-49": new Zona(
		"Matamoros, Coahuila",
		"8713910301"
	),
	"7-50": new Zona(
		"Saltillo, Coahuila",
		"8444285485"
	),
	"7-51": new Zona(
		"Saltillo, Coahuila",
		"8446222164"
	),
	"7-52": new Zona(
		"",
		"8445014707"
	),
	"7-53": new Zona(
		"La Paz, Baja California Sur",
		"6121203652"
	),
	"7-54": new Zona(
		"Los Cabos, Baja California Sur",
		"6243556000"
	),
	"7-55": new Zona(
		"",
		"8443140021"
	),
	"7-56": new Zona(
		"",
		"8444442750"
	),
	"7-80": new Zona(
		"Saltillo Coahuila"
	),
	"8-02": new Zona(
		"",
		"3312546712"
	),
	"8-03": new Zona(
		"",
		"3315185425"
	),
	"8-04": new Zona(
		"Tlaquepaque, Jalisco",
		"3325987405"
	),
	"8-05": new Zona(
		"",
		"3334960680"
	),
	"8-07": new Zona(
		"Tlaquepaque, Jalisco",
		"3337780528"
	),
	"8-10": new Zona(
		"",
		"3921009504"
	),
	"8-12": new Zona(
		"Tlaquepaque, Jalisco",
		"3326081984"
	),
	"8-15": new Zona(
		"Tonala, Jalisco",
		"3311519805"
	),
	"8-17": new Zona(
		"Tonala, Jalisco",
		"3318072711"
	),
	"8-18": new Zona(
		"Tonala, Jalisco",
		"3319645903"
	),
	"8-20": new Zona(
		"Tizapan El Alto, Tlajomulco, Jalisco",
		"3314606636"
	),
	"8-23": new Zona(
		"",
		"3781117175"
	),
	"8-26": new Zona(
		"",
		"3781051330"
	),
	"8-27": new Zona(
		"Zacapu, Michoacan",
		"4361089212"
	),
	"8-28": new Zona(
		"Tepalcatepec, Michoacan",
		["4531000899","4531502602"]
	),
	"8-29": new Zona(
		"",
		["4531109392","4521298877"]
	),
	"8-38": new Zona(
		"Jacona, Michoacan",
		"3511026731"
	),
	"8-39": new Zona(
		"Uruapan, Michoacan",
		"3541258695"
	),
	"8-40": new Zona(
		"La Piedad, Michoacan",
		"3521081185"
	),
	"8-41": new Zona(
		"Lagos de Moreno, Jalisco",
		"4747472082"
	),
	"9-05": new Zona(
		"morelia, michoacan",
		"4432281686"
	),
	"9-09": new Zona(
		"Pungarabato, Guerrero"
	),
	"9-14": new Zona(
		"",
		"4432296499"
	),
	"9-15": new Zona(
		"morelia, michoacan",
		"4434652287"
	),
	"9-21": new Zona(
		"",
		"7151353755"
	),
	"9-27": new Zona(
		"Angangueo, Michoacan",
		"7861162335"
	),
	"9-47": new Zona(
		"Mexicaltzingo, San Antonio la Isla, EdoMex",
		"7225716126",
		"4-6"
	),
	"9-48": new Zona(
		"Toluca, EdoMex",
		"7223970965"
	),
	"9-49": new Zona(
		"Ixtlahuaca, EdoMex",
		"7122501618"
	),
	"9-50": new Zona(
		"",
		"4171012983"
	),
	"9-51": new Zona(
		"Donato Guerra, Valle de Bravo, EdoMex",
		"7226502329"
	),
	"9-52": new Zona(
		"San Mateo Atenco, EdoMex",
		"7223515395"
	),
	"9-53": new Zona(
		"Lerma, EdoMex",
		"7226599421"
	),
	"9-54": new Zona(
		"Atzcapotzaltongo, Toluca",
		"7121535458"
	),
	"9-55": new Zona(
		"Almoloya, EdoMex",
		"7222437327"
	),
	"10-10": new Zona(
		"Celaya, Guanajuato",
		"4611713230"
	),
	"10-14": new Zona(
		"Leon, Guanajuato",
		"4771767865"
	),
	"10-16": new Zona(
		"Abasolo, Guanajuato"
	),
	"10-17": new Zona(
		"San Francisco del Rincon, Guanajuato",
		"4779227404"
	),
	"10-18": new Zona(
		"Leon, Guanajuato"
	),
	"10-19": new Zona(
		"Leon, Guanajuato"
	),
	"10-20": new Zona(
		"Leon, Guanajuato",
		"4771120072"
	),
	"10-21": new Zona(
		"Salamanca, Guanajuato"
	),
	"10-22": new Zona(
		"Abasolo, Guanajuato"
	),
	"10-28": new Zona(
		"",
		"4111312069"
	),
	"10-38": new Zona(
		"",
		"4611555275"
	),
	"10-44": new Zona(
		"Leon, Guanajuato",
		"4775751273"
	),
	"10-51": new Zona(
		"Silao, Guanajuato",
		"4731170869"
	),
	"10-55": new Zona(
		"Valle de Santiago, Guanajuato"
	),
	"10-65": new Zona(
		"",
		"4422056700"
	),
	"10-66": new Zona(
		"Santa Cruz, Queretaro"
	),
	"10-67": new Zona(
		"",
		"4424466076"
	),
	"10-68": new Zona(
		"",
		"4422326621"
	),
	"10-69": new Zona(
		"",
		"4271284696"
	),
	"10-70": new Zona(
		"San Felipe, Guanajuato"
	),
	"11-06": new Zona(
		"Cuautitlan, EdoMex",
		"5530576006"
	),
	"11-07": new Zona(
		"Ecatepec, EdoMex",
		"5512748840"
	),
	"11-10": new Zona(
		"Tecamac, EdoMex",
		"5532984748"
	),
	"11-11": new Zona(
		"",
		"7731187172"
	),
	"11-12": new Zona(
		"Tlahuelilpan, Hidalgo",
		"7731362784"
	),
	"11-13": new Zona(
		"",
		"5578742298"
	),
	"11-14": new Zona(
		"",
		"7751247599"
	),
	"11-15": new Zona(
		"Tlanalapa, Hidalgo",
		"5554543055"
	),
	"11-16": new Zona(
		"",
		"7717000614"
	),
	"11-17": new Zona(
		"Zacualtipan de Angeles, Hidalgo",
		"7712053625"
	),
	"11-18": new Zona(
		"Tepotzotlan, EdoMex",
		"5614327099"
	),
	"11-19": new Zona(
		"Tizayuca, Hidalgo",
		"7711573861"
	),
	"11-20": new Zona(
		"",
		"7721619511"
	),
	"11-24": new Zona(
		"Coacalco, EdoMex",
		"5516297273"
	),
	"11-25": new Zona(
		"Tultitlan, EdoMex"
	),
	"11-26": new Zona(
		"Nicolas Romero, EdoMex",
		"5630037476"
	),
	"11-32": new Zona(
		"Cuautitlán Izcalli, EdoMex",
		"5527092607"
	),
	"11-33": new Zona(
		"Coacalco, EdoMex",
		"5522123425"
	),
	"11-38": new Zona(
		"Ecatepec, EdoMex",
		"5515978974"
	),
	"11-41": new Zona(
		"Atizapan de Zaragoza, Adolfo Lopez Mateos, EdoMex",
		"5531882612"
	),
	"11-51": new Zona(
		"Teotihuacan, EdoMex"
	),
	"11-52": new Zona(
		"Atenco, EdoMex",
		"5538175898"
	),
	"11-56": new Zona(
		"Ecatepec, EdoMex",
		"5566197279"
	),
	"11-57": new Zona(
		"Ecatepec, EdoMex"
	),
	"13-05": new Zona(
		"El Paraiso, Veracruz",
		"2831006898"
	),
	"13-06": new Zona(
		"",
		"9241506376"
	),
	"13-07": new Zona(
		"Cosoleacaque, Veracruz",
		"9221406585"
	),
	"13-09": new Zona(
		"",
		"9212042734"
	),
	"13-10": new Zona(
		"",
		"9211471104"
	),
	"13-11": new Zona(
		"Teapa, Tabasco",
		"9932092786"
	),
	"13-14": new Zona(
		"Nanchital, Veracruz",
		"9211976404"
	),
	"13-15": new Zona(
		"",
		"9933830131"
	),
	"13-16": new Zona(
		"Palenque, Chiapas"
	),
	"13-21": new Zona(
		"Villahermosa, Tabasco",
		"9932403259"
	),
	"13-27": new Zona(
		"",
		"2871202315"
	),
	"13-31": new Zona(
		"Villahermosa, Tabasco"
	),
	"13-35": new Zona(
		"",
		"9933964921"
	),
	"13-41": new Zona(
		"",
		"2741111297"
	),
	"13-42": new Zona(
		"Cardenas y Comalcalco, Tabasco",
		"9331025631"
	),
	"13-43": new Zona(
		"Paraiso, Tabasco",
		"6861349537"
	),
	"13-44": new Zona(
		"Cardenas, Tabasco",
		"9371387363"
	),
	"13-45": new Zona(
		"Villahermosa, Tabasco",
		"9933055981"
	),
	"14-03": new Zona(
		"Chimalhuacan, EdoMex",
		"5580367324"
	),
	"14-05": new Zona(
		"Ixtapaluca, Chalco, EdoMex"
	),
	"14-10": new Zona(
		"Valle de Chalco, Tláhuac, EdoMex",
		"5528296727"
	),
	"14-42": new Zona(
		"",
		"5516307056"
	),
	"14-43": new Zona(
		"Chimalhuacan, Chicoloapan, EdoMex",
		"5548979890"
	),
	"14-45": new Zona(
		"",
		"5541834347"
	),
	"14-47": new Zona(
		"Ecatepec, EdoMex",
		"5512704693"
	),
	"14-49": new Zona(
		"Milpa Alta, CdMx, Ecatepec, EdoMex",
		["5531760823","5564467802"]
	),
	"14-53": new Zona(
		"Nezahualcóyotl, EdoMex",
		"5537171246"
	),
	"14-54": new Zona(
		"Venustiano Carranza, CdMx",
		"5571788409",
		"4"
	),
	"14-55": new Zona(
		"Chimalhuacan, EdoMex",
		"5517814626"
	),
	"14-56": new Zona(
		"Nezahualcóyotl, EdoMex",
		["5617537361","5544580283"]
	),
	"14-58": new Zona(
		"Iztapalapa y Nezahualcóyotl, EdoMex",
		"5579218198"
	),
	"14-61": new Zona(
		"Iztapalapa, CdMx"
	),
	"14-62": new Zona(
		"Iztapalapa, Cdmx"
	),
	"14-67": new Zona(
		"Xochimilco, Mexico"
	),
	"14-68": new Zona(
		"Milpa Alta, Tláhuac, CdMx"
	),
	"16-11": new Zona(
		"Benito Juarez, Cancun, Quintana Roo",
		"9982463454"
	),
	"16-12": new Zona(
		"Othon P. Blanco, Chetumal, Quintana Roo, Calakmul, Campeche",
		"9831550928"
	),
	"16-13": new Zona(
		"Benito Juarez, Quintana Roo",
		"9982208078"
	),
	"16-14": new Zona(
		"",
		"9999494735"
	),
	"16-16": new Zona(
		"",
		"9991405593"
	),
	"16-17": new Zona(
		"Kanasin, Yucatan",
		"9999002972"
	),
	"16-18": new Zona(
		"Merida, Yucatan",
		"9992721568"
	),
	"16-19": new Zona(
		"",
		"9811005515"
	),
	"16-21": new Zona(
		"Cd. del Carmen, Campeche",
		"9932605073"
	),
	"16-22": new Zona(
		"Escarcega, Campeche",
		"9821030814"
	),
	"16-23": new Zona(
		"Merida, Yucatan"
	),
	"16-24": new Zona(
		"",
		"9993013617"
	),
	"16-25": new Zona(
		"Halacho, Yucatan",
		"9999084699"
	),
	"16-26": new Zona(
		"Tepic, Nayarit",
		"9999066446"
	),
	"16-28": new Zona(
		"Solidaridad, Playa del Carmen, Quintana Roo",
		"9843229852"
	),
	"17-01": new Zona(
		"Oaxaca, Oaxaca",
		"9512295555"
	),
	"17-02": new Zona(
		"Santa Cruz Xoxocotlan, Oaxaca",
		"9511835079"
	),
	"17-04": new Zona(
		"",
		"9535380230"
	),
	"17-07": new Zona(
		"Apizaco, Tlaxcala"
	),
	"17-08": new Zona(
		"",
		"2461105430"
	),
	"17-12": new Zona(
		"Oaxaca, Oaxaca",
		"9511773898"
	),
	"17-13": new Zona(
		"Amozoc, Puebla",
		"2224695538"
	),
	"17-14": new Zona(
		"Puebla, Puebla",
		"2223773367"
	),
	"17-16": new Zona(
		"Puebla, Puebla",
		"2227082250"
	),
	"17-17": new Zona(
		"Rafael Lara Grajales y Puebla de Zaragoza y San Nicolas Buenos Aires, Puebla",
		"2471745418"
	),
	"17-18": new Zona(
		"Puebla, Puebla",
		"2224354829"
	),
	"17-28": new Zona(
		"Oaxaca, Oaxaca",
		"9512518827"
	),
	"17-32": new Zona(
		"Puebla, Puebla",
		"2727842703"
	),
	"17-33": new Zona(
		"",
		"2225077672"
	),
	"17-34": new Zona(
		"Puebla, Cuautlancingo, Puebla",
		"2211616987",
		"5"
	),
	"17-35": new Zona(
		"",
		"2381790548"
	),
	"17-39": new Zona(
		"",
		"2381090535"
	),
	"17-40": new Zona(
		"",
		"2464602571"
	),
	"17-43": new Zona(
		"",
		"2227609044"
	),
	"18-08": new Zona(
		"",
		"2299037944"
	),
	"18-09": new Zona(
		"Veracruz, Veracruz",
		"2291247192"
	),
	"18-10": new Zona(
		"",
		"2291484635"
	),
	"18-11": new Zona(
		"Veracruz, Veracruz",
		"2292101584"
	),
	"18-16": new Zona(
		"Amatlan de los Reyes, Cordoba, Veracruz"
	),
	"18-18": new Zona(
		"Tlalixcoyan, Veracruz",
		"2291065562"
	),
	"18-20": new Zona(
		"Orizaba, Veracruz"
	),
	"18-29": new Zona(
		"Chocaman y Fortin, Veracruz",
		"2711225107"
	),
	"18-34": new Zona(
		"Atzacan, Rio Blanco, Veracruz",
		"2721881049"
	),
	"18-39": new Zona(
		"Amatlan de los Reyes, Cordoba, Cortazar, Cuichapa, Veracruz",
		"3541016858"
	),
	"18-40": new Zona(
		"Cosoleacaque, Veracruz",
		"2941397593"
	),
	"18-41": new Zona(
		"Santiago Tuxtla, Veracruz"
	),
	"18-80": new Zona(
		"Veracruz, Veracruz"
	),
	"19-06": new Zona(
		"Cuauhtemoc, CdMx",
		"5527632137"
	),
	"19-08": new Zona(
		"Gustavo A. Madero, Cd.Mx",
		"5537186761"
	),
	"19-09": new Zona(
		"Venustiano Carranza, Cuauhtemoc, CdMx",
		["5527771429","5541311287"]
	),
	"19-11": new Zona(
		"Gustavo A. Madero, CdMx",
		"5521309061"
	),
	"19-14": new Zona(
		"Alvaro Obregon, CdMx",
		"5527744368"
	),
	"19-15": new Zona(
		"Naucalpan, Huixquilucan, EdoMex",
		"5537539700"
	),
	"19-16": new Zona(
		"Naucalpan, EdoMex",
		"5580848313"
	),
	"19-23": new Zona(
		"",
		"5540275326"
	),
	"19-30": new Zona(
		"Tlalnepantla, EdoMex"
	),
	"19-31": new Zona(
		"",
		"5519949886"
	),
	"19-35": new Zona(
		"Gustavo A. Madero, CdMx",
		"5565399033"
	),
	"19-40": new Zona(
		"Tultitlan, EdoMex",
		"5627306375"
	),
	"19-42": new Zona(
		"Atizapán de Zaragoza, Nicolas Romero, EdoMex",
		"5527168429",
		"5"
	),
	"19-52": new Zona(
		"Iztapalapa, CdMx",
		"",
		"4"
	),
	"19-56": new Zona(
		"Tlalpan, CdMx"
	),
	"21-24": new Zona(
		"San Luis Potosi",
		"4443853923"
	),
	"21-26": new Zona(
		"San Luis Potosi, San Luis Potosi"
	),
	"21-28": new Zona(
		"San Luis Potosi, San Luis Potosi",
		"4441158834"
	),
	"21-30": new Zona(
		"Aguascalientes, Aguascalientes"
	),
	"21-29": new Zona(
		"Calvillo, Aguascalientes"
	),
	"21-31": new Zona(
		"Aguascalientes, Aguascalientes",
		"4492631603"
	),
	"21-33": new Zona(
		"villa de ramos, san luis potosi",
		"4931370474"
	),
	"21-34": new Zona(
		"",
		"4931123569"
	),
	"21-35": new Zona(
		"",
		"4931124342"
	),
	"21-38": new Zona(
		"Venegas, San Luis Potosi",
		"4442241569"
	),
	"21-47": new Zona(
		"Jesus Maria, Aguascalientes",
		"4491898082"
	),
	"21-48": new Zona(
		"San Luis Potosi, San Luis Potosi"
	),
	"21-49": new Zona(
		"San Luis Potosi, San Luis Potosi",
		"",
		"5"
	),
	"21-56": new Zona(
		"",
		"4491254203"
	),
	"21-64": new Zona(
		"General Francisco Murguia, Juan Aldama, Zacatecas",
		"4931003768"
	),
	"22-01": new Zona(
		"",
		"7443346601"
	),
	"22-02": new Zona(
		"Acapulco, Guerrero",
		"7441215297"
	),
	"22-03": new Zona(
		"Acapulco, Guerrero",
		"7443453102",
		"5-7"
	),
	"22-04": new Zona(
		"",
		"7551046235"
	),
	"22-05": new Zona(
		"",
		"7441039129"
	),
	"22-06": new Zona(
		"Acapulco, Guerrero",
		"7441288645"
	),
	"22-10": new Zona(
		"Chilpancingo de los Bravo, Guerrero"
	),
	"22-17": new Zona(
		"Chilpancingo de los Bravo, Guerrero",
		"7471170137"
	),
	"22-20": new Zona(
		"Iguala, Guerrero",
		"7331276119"
	),
	"22-23": new Zona(
		"Acapulco, Tuncingo, Guerrero",
		"",
		"5-7"
	),
	"22-24": new Zona(
		"Cuautla, Morelos"
	),
	"22-26": new Zona(
		"",
		"7774645174"
	),
	"22-27": new Zona(
		"cuernavaca, morelos",
		"7774396810"
	),
	"22-28": new Zona(
		"Xoxocotla, Morelos",
		"7341100317"
	),
	"22-31": new Zona(
		"",
		"7331905570"
	),
	"22-34": new Zona(
		"Tlapa de Comonfort, Guerrero",
		"2431197307"
	),
	"23-01": new Zona(
		"Santa Catarina, Nuevo Leon",
		"8120247644"
	),
	"23-02": new Zona(
		"San Pedro Garza Garcia, Monterrey, Nuevo Leon"
	),
	"23-03": new Zona(
		"Garcia, Nuevo Leon",
		"8118146596"
	),
	"23-04": new Zona(
		"Monterrey, Nuevo Leon",
		"8125402506"
	),
	"23-05": new Zona(
		"",
		"8111272163"
	),
	"23-06": new Zona(
		"Carmen, Nuevo Leon",
		"8113779130"
	),
	"23-17": new Zona(
		"",
		"8661153417"
	),
	"23-18": new Zona(
		"Monclova, Coahuila",
		"8666385914"
	),
	"23-19": new Zona(
		"Sabinas, Coahuila"
	),
	"23-20": new Zona(
		"Sabinas, Coahuila"
	),
	"23-21": new Zona(
		"Piedras Negras, Coahuila"
	),
	"23-22": new Zona(
		"Acuña, Coahuila",
		"8771133409"
	),
	"23-30": new Zona(
		"El Carmen, Nuevo Leon",
		"8126259691"
	),
	"23-31": new Zona(
		"",
		"8126405068"
	),
	"23-45": new Zona(
		"Garcia, Nuevo Leon",
		"8132376768"
	),
	"27-18": new Zona(
		"Cd. Obregon, Sonora",
		"6441148786"
	),
	"27-19": new Zona(
		"Cd. Obregon, Sonora",
		"6441521633"
	),
	"27-20": new Zona(
		"Cd. Obregon, Sonora",
		"6441468889"
	),
	"27-21": new Zona(
		"Navojoa, Etchojoa, Sonora",
		"6421199237"
	),
	"27-22": new Zona(
		"El Fuerte, Los Mochis, Sinaloa",
		"6688827200"
	),
	"27-23": new Zona(
		"Los Mochis, Sinaloa",
		"6681510736"
	),
	"27-24": new Zona(
		"Los Mochis, Sinaloa",
		"6682433168"
	),
	"27-25": new Zona(
		"Guasave, Sinaloa",
		"6871250047"
	),
	"27-26": new Zona(
		"Angostura, Guamuchil, Sinaloa",
		"6731202828"
	),
	"27-27": new Zona(
		"Navolato, Culiacán, Sinaloa",
		"6672335377"
	),
	"27-28": new Zona(
		"Mazatlán, Sinaloa",
		"6691417689"
	),
	"27-29": new Zona(
		"Culiacan, Sinaloa",
		"6674779850"
	),
	"27-30": new Zona(
		"Culiacán, Sinaloa",
		"6671429864"
	),
	"27-31": new Zona(
		"Culiacan, Sinaloa",
		"6676300484"
	),
	"27-32": new Zona(
		"Culiacan, Sinaloa",
		"6971110195"
	),
	"27-33": new Zona(
		"Mazatlán, Sinaloa",
		"6691634776"
	),
	"27-34": new Zona(
		"Mazatlán, Sinaloa",
		"2297802689"
	),
	"27-35": new Zona(
		"Culiacan, Sinaloa",
		"6671955434"
	),
	"27-36": new Zona(
		"Bachigualatillo, Culiacán, Sinaloa",
		"6677976369"
	),
	"28-01": new Zona(
		"",
		"8461046561"
	),
	"28-03": new Zona(
		"Tuxpan, Veracruz",
		"7831361057"
	),
	"28-04": new Zona(
		"",
		"7821472804"
	),
	"28-05": new Zona(
		"Poza Rica, Veracruz"
	),
	"28-06": new Zona(
		"",
		"7848487825"
	),
	"28-07": new Zona(
		"",
		"7821684894"
	),
	"28-09": new Zona(
		"",
		"2321248286"
	),
	"28-11": new Zona(
		"Altotonga, Veracruz",
		"2313196064"
	),
	"28-13": new Zona(
		"",
		"2284037390"
	),
	"28-14": new Zona(
		"Xalapa, Misantla, Veracruz"
	),
	"28-15": new Zona(
		"",
		"2282692825"
	),
	"28-16": new Zona(
		"Cuitláhuac, Veracruz",
		"2283057332"
	),
	"29-01": new Zona(
		"Tuxtla Gutierrez, Chiapas",
		"9613753442"
	),
	"29-02": new Zona(
		"Tuxtla Gutierrez, Chiapas",
		"9612313516"
	),
	"29-03": new Zona(
		"Tuxtla Gutierrez, Chiapas",
		"9616672491"
	),
	"29-04": new Zona(
		"San Fernando, Chiapas",
		"9612702163"
	),
	"29-05": new Zona(
		"Tuxtla Gutierrez, Chiapas",
		"9614498682"
	),
	"29-06": new Zona(
		"Ocozocoautla, Chiapas"
	),
	"29-07": new Zona(
		"Ocosingo, Chiapas",
		"9671540025"
	),
	"29-08": new Zona(
		"",
		"9612354378"
	),
	"29-09": new Zona(
		"La Trinitaria, Chiapas",
		"9631234841"
	),
	"29-11": new Zona(
		"Tapachula, Chiapas",
		"9621118974"
	),
	"29-12": new Zona(
		"Tonala, Acapetahua, Chiapas",
		"9181035253"
	),
	"29-13": new Zona(
		"Heroica Ciudad de Juchitan de Zaragoza, Oaxaca",
		"9711212867"
	),
	"29-14": new Zona(
		"San Juan Guichicovi y San Pedro Comitancillo, Oaxaca",
		"9633552856"
	),
	length: {
		"Ambos": 210,
		"Ciudad": 51,
		"Telefono": 115,
		"Zonas": 375
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


