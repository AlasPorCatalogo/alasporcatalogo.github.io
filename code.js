var Indicelistas, listazonas, listaciudades, conteo, conteocsstablas, conteolog, elementoccss, IDaCeldas, IDenCeldas, AgregarID, Busquedacelda, zonam2, logElement, conteobusqueda, submitElement, inputElement, zonaIaEC, conteotransparencia, aoc, columna, zonaspresentes, lineadesalto;
function comandosZonas(comando) {
var ejecutar = true;
if (comando == 'nos' || comando == '-') {
  lineadesalto = '';
  ejecutar = false;
}
if (comando == 'sis' || comando == '.') {
  lineadesalto = '\n';
  ejecutar = false;
}
if(comando == 'tr' || comando == ',') {
  transparencia();
  ejecutar = false;
}
if (ejecutar == true) {
  encontrarcelda(String(zonaIaEC));
}
}
function encontrarcelda(zona) {
if(Busquedacelda !== null && Busquedacelda.tagName != 'TABLE') {
  Busquedacelda.className = '';
}
Busquedacelda = document.getElementById(zona);
if(Busquedacelda === null) {
  conteobusqueda = 2;
  logElement.innerText = `La Zona Buscada no existe`;
}
  else {
    Busquedacelda.scrollIntoView({ behavior: "smooth", block: String(aoc)});
    if (aoc == 'start') {
      setTimeout(function() {subirsisaltoatabla(-104,0,"smooth");}, 875);
    }
    Busquedacelda.className = String(Busquedacelda.className) + ' ' + 'encontrado';
  }
  aoc = 'center';
}
function subirsisaltoatabla(t,l,b) {
window.scrollBy({
  top: t,
  left: l,
  behavior: b,
});
}
function cambiarcss(nombredeclase, nombreelemento, limiteccss, conteocsstablas,clcss) {
clcss = 0;
for(var cuentadecss = 0; cuentadecss < limiteccss; cuentadecss++) {
elementoccss = document.getElementsByTagName(nombreelemento)[conteocsstablas];
elementoccss.className = nombredeclase;
conteocsstablas++;
clcss++;
}
console.log('Cambiada exitosamente la clase de',clcss,nombreelemento)
}
function agregarciudades() {
conteo = 0;
conteolog = 0;
columna = 0;
if (!AgregarID) {
const elements = document.querySelectorAll('div'); // Search only <div> elements
elements.forEach(element => {
  conteo++;
//La linea comentada abajo es util para ver que esta funcionando mal 
//console.log(conteo,element.textContent,listazonas.indexOf(element.textContent),listazonas[listazonas.indexOf(element.textContent)],listaciudades[listazonas.indexOf(element.textContent)]);
  if (!AgregarID) {
    IDaCeldas = element.parentElement;
    columna++;
    if(columna > 5) {columna = 1;}
    IDaCeldas.colSpan = String(columna);
    IDenCeldas = element.textContent;
    IDenCeldas = String(IDenCeldas.replaceAll(' ',''));
    IDenCeldas = String(IDenCeldas.replaceAll('\n',''));
    if (IDenCeldas.length > 3 && IDenCeldas.length < 6) {
    zonaspresentes.push(IDenCeldas);
    }
    else {
      zonaspresentes.push('noZona');
    }
    IDaCeldas.id = IDenCeldas;
}
  if (listazonas.indexOf(element.textContent) != -1) {
    conteolog++;
    Indicelistas = listazonas.indexOf(element.textContent);
    ciudad = listaciudades[Indicelistas];
    var pciudades = document.createElement('p');

    // Add text content to the New element
    var texto = document.createTextNode(ciudad);
    pciudades.appendChild(texto);

    // Set attributes for the New element
    pciudades.setAttribute('style', 'margin:0px;');

    // Append the New element to the element being analyzed
    element.appendChild(pciudades);
  }
});
}
AgregarID = true;
console.log('Busqueda realizada en',conteo,'Divs. Agregadas',conteolog,'ciudades de',listaciudades.length,'disponibles')
}
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
/*
function textReplace(haystack, needle, replacement) {
  needle = needle.replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, '\\$1')
                 .replace(/\x08/g, '\\x08');
  return haystack.replace(new RegExp(needle, 'g'), replacement);
}

function mathRandomInt(a, b) {
  if (a > b) {
    // Swap a and b to ensure a is smaller.
    var c = a;
    a = b;
    b = c;
  }
  return Math.floor(Math.random() * (b - a + 1) + a);
}
*/
document.addEventListener("DOMContentLoaded", (event) => {
  // Page has loaded
  zonaspresentes = [];
  tabla = document.getElementById("1");
  lineadesalto = '\n';
  aoc = 'center';
  conteotransparencia = 0;
  conteobusqueda = 0;
  zonam2 = 0;
  Busquedacelda = document.getElementsByTagName("h1")[0];
  cambiarcss('avon2','table',3,0);
  agregarciudades();
  submitElement = document.getElementById("busqueda");
  logElement = document.getElementById("tecsto");
  inputElement = document.getElementById("zona");
  submitElement.addEventListener("submit", (event) => {
  event.preventDefault();
  comandosZonas(String(inputElement.value));
}
);
  inputElement.addEventListener("keyup", () => {
conteobusqueda = conteobusqueda -1;
Interpretarzonas(String(inputElement.value));
});

});
function transparencia() {
if (conteotransparencia == 0) {
conteotransparencia++;
cambiarcss('Transparente','form',1,1);
}
else {
conteotransparencia = 0;
cambiarcss('sticky','form',1,1);
}

}
function Interpretarzonas(zona) {
zonam2 == zona.charAt(zona.length-2);
var zonaElemento, Bloque, DiaCierre, encabezadoColumna, BloqueI = zona, Notacelda, reiniciaraoc = 0;
if (zona.charAt(0) != '0') {
    zona = '0' + zona;
}
if (zona.length < 4 && zonam2 != '-'){
    zona = zona.slice(0,zona.length-1) + '0' + zona.slice(zona.length-1,zona.length)
}
if (zona.indexOf('-') == -1) {
    zona = zona.slice(0,zona.length-2) + '-' + zona.slice(zona.length-2,zona.length)
}
  while (zona.charAt(0) == '0') {
    zona = zona.slice(1,zona.length);
}
if (zona == '-0' + String(BloqueI) && !isNaN(String(BloqueI))) {
  logElement.innerText = `Ir al bloque ${BloqueI}`;
  aoc = 'start';
  reiniciaraoc = 1;
}
if (BloqueI == 'nos' || BloqueI == '-') {
  logElement.innerText = `Quitar saltos de linea`;
  reiniciaraoc = 1;
}
if (BloqueI == 'sis' || BloqueI == '.') {
  logElement.innerText = `Añadir saltos de linea`;
  reiniciaraoc = 1;
}
if (BloqueI == 'tr' || BloqueI == ',') {
  logElement.innerText = `Cambio de transparencia`;
  reiniciaraoc = 1;
}
if (conteobusqueda <= 0 &&   reiniciaraoc == 0) {
    logElement.innerText = `Zona: ${zona}`;
    aoc = 'center';
}
zonaElemento = document.getElementById(zona);
//console.log(zonaElemento);
if(zonaElemento !== null){
Notacelda = zonaElemento.title;

  if(zonaElemento.tagName == 'TD' || zonaElemento.tagName == 'TH') {
    Bloque = zonaElemento.parentElement.parentElement.parentElement.id;
    encabezadoColumna =  zonaElemento.parentElement.parentElement.parentElement.querySelector(`th[colspan="${zonaElemento.getAttribute("colspan")}"]`);
    DiaCierre = encabezadoColumna.innerText.slice(0, length-1)
 }
}
  else {
  Notacelda = '';
  }
if (listazonas.indexOf(String(zona)) != -1) {
logElement.innerText = `${logElement.innerText} ${lineadesalto}Ciudad: ${listaciudades[listazonas.indexOf(String(zona))]} ${lineadesalto}Día de cierre: ${DiaCierre} ${lineadesalto}Bloque: ${Bloque}`;
}
  else if (Bloque != undefined || DiaCierre != undefined ){
    logElement.innerText = `${logElement.innerText} ${lineadesalto}Día de cierre: ${DiaCierre} ${lineadesalto}Bloque: ${Bloque}`;
  }
if (Notacelda != '') {
  logElement.innerText = `${logElement.innerText} ${lineadesalto}${Notacelda}`
}
zonaIaEC = zona;
//"\n" es una forma de crear saltos de linea 
}
listazonas = ['Elemento vacio para facilitar todo','1-01', '1-08', '1-10', '1-12', '1-15', '1-20', '1-27', '1-29', '1-40', '2-10', '2-11', '2-15', '2-17', '2-29', '2-43', '3-11', '3-14', '3-16', '3-17', '3-20', '3-25', '3-31', '3-32', '3-33', '3-35', '3-48', '4-26', '4-27', '4-29', '4-31', '4-32', '4-33', '4-35', '4-48', '4-49', '4-50', '4-51', '4-52', '4-55', '4-56', '4-58', '4-60', '6-06', '6-07', '6-09', '6-12', '6-13', '6-15', '6-17', '6-26', '6-32', '7-26', '7-34', '7-35', '7-37', '7-38', '7-42', '7-43', '7-44', '7-45', '7-48', '7-49', '7-50', '7-51', '7-53', '7-54', '8-07', '8-12', '8-15', '8-17', '8-18', '8-20', '8-27', '8-28', '8-38', '8-39', '8-40', '8-41', '9-05', '9-09', '9-15', '9-27', '9-47', '9-48', '9-49', '9-51', '9-52', '9-53', '9-54', '9-55', '10-10', '10-12', '10-14', '10-16', '10-17', '10-18', '10-19', '10-20', '10-22', '10-44', '10-51', '10-55', '10-66', '10-70', '11-06', '11-07', '11-10', '11-12', '11-15', '11-18', '11-19', '11-24', '11-25', '11-26', '11-33', '11-38', '11-41', '11-52', '11-56', '11-57', '14-49', '14-67', '14-68', '12-15', '12-17', '12-22', '12-23', '12-24', '12-27', '13-05', '13-07', '13-11', '13-16', '13-21', '13-31', '13-39', '13-42', '13-43', '13-45', '14-03', '14-05', '14-10', '14-43', '14-44', '14-46', '14-49', '14-53', '14-55', '14-56', '14-57', '14-60', '14-61', '16-11', '16-12', '16-13', '16-17', '16-18', '16-21', '16-22', '16-23', '16-25', '16-26', '16-28', '17-01', '17-02', '17-07', '17-12', '17-13', '17-14', '17-16', '17-17', '17-32', '17-34', '18-09', '18-11', '18-16', '18-18', '18-20', '18-29', '18-39', '18-40', '18-41', '19-06', '19-09', '19-11', '19-12', '19-14', '19-15', '19-30', '19-35', '19-40', '19-42', '19-56', '21-28', '21-29', '21-31', '21-33', '21-38', '21-48', '21-49', '21-61', '21-64', '22-02', '22-06', '22-10', '22-17', '22-20', '22-23', '22-24', '22-27', '22-28', '22-34', '23-01', '23-02', '23-03', '23-06', '23-19', '23-22', '23-30', '23-45', '27-18', '27-19', '27-20', '27-21', '27-22', '27-23', '27-25', '27-26', '27-27', '27-29', '27-31', '27-35', '27-36', '28-03', '28-05', '28-11', '28-14', '29-01', '29-02', '29-03', '29-04', '29-05', '29-06', '29-07', '29-09', '29-11', '29-12', '29-13', '29-14'];
listaciudades = ['Elemento vacio para facilitar todo','Ciudad Madero, Tamaulipas', 'Cd. Valles, San Luis Potosi', 'Melchor Ocampo, Tamaulipas', 'altamira, Tamaulipas', 'Matamoros, Tamaulipas', 'Ciudad Valles, San Luis Potosi', 'Reynosa, Tamaulipas', 'Reynosa, Tamaulipas', 'Matamoros, Tamaulipas', 'General Zuazua, Nuevo Leon', 'Apodaca, Nuevo Leon', 'Monterrey, Nuevo Leon', 'Juarez, Nuevo Leon', 'Salinas Victoria, Nuevo Leon', 'Juarez, Nuevo Leon', 'Cd. Juarez, Chihuahua', 'Cd. Juarez, Chihuahua', 'Chihuahua, Chihuahua', 'Chihuahua, Chihuahua', 'Meoqui, Chihuahua', 'Cd. Juarez, Chihuahua', 'Cd. Juarez, Chihuahua', 'Cd. Juarez, Chihuahua', 'Chihuahua, Chihuahua', 'Cuauhtemoc, Chihuahua', 'Cd. Juarez, Chihuahua', 'Guaymas, Empalme, San Carlos, Sonora', 'Hermosillo, Sonora', 'Hermosillo, Sonora', 'Hermosillo, Sonora', 'Hermosillo, Sonora', 'Nogales, Sonora', 'Agua Prieta, Sonora', 'Hermosillo, Sonora', 'Nogales, Imuris, Magdalena, Santa Ana, Benjamin Hill, Carbo y Rayon, Sonora', 'Tijuana, Baja California', 'Tijuana, Baja California', 'Tijuana, Baja California', 'Tijuana, Baja California', 'Tijuana, Baja California', 'Mexicali, Baja California', 'Mexicali, Baja California', 'Tlajomulco de Zuñiga, Jalisco', 'Zapopan, Jalisco', 'Guadalajara, Jalisco', 'Zapopan, Jalisco', 'Tlajomulco de Zuñiga, Jalisco', 'Acatlan, Jalisco', 'Manzanillo, Colima', 'Tepic, Nayarit', 'Las Varas, Compostela, Nayarit', 'San Pedro, Coahuila', 'Durango, durango', 'Victoria de Durango, Durango', 'Durango, durango', 'Durango, durango', 'Gomez Palacio, Durango', 'Lerdo, Durango', 'Torreon, Coahuila', 'Lerdo, Durango', 'Torreon, Coahuila', 'Matamoros, Coahuila', 'Saltillo, Coahuila', 'Saltillo, Coahuila', 'La Paz, Baja California Sur', 'Los Cabos, Baja California Sur', 'Tlaquepaque, Jalisco', 'Tlaquepaque, Jalisco', 'Tonala, Jalisco', 'Tonala, Jalisco', 'Tonala, Jalisco', 'Tizapan El Alto, Jalisco', 'Zacapu, Michoacan', 'Tepalcatepec, Michoacan', 'Jacona, Michoacan', 'Uruapan, Michoacan', 'La Piedad, Michoacan', 'Lagos de Moreno, Jalisco', 'morelia, michoacan', 'Pungarabato, Guerrero', 'morelia, michoacan', 'Angangueo, Michoacan', 'Mexicaltzingo, EdoMex', 'Toluca, EdoMex', 'Ixtlahuaca, EdoMex', 'Donato Guerra, EdoMex', 'San Mateo Atenco, EdoMex', 'Lerma, EdoMex', 'Atzcapotzaltongo, Toluca', 'Almoloya, EdoMex', 'Celaya, Guanajuato', 'San Jose Iturbide, Guanajuato', 'Leon, Guanajuato', 'Abasolo, Guanajuato', 'San Francisco del Rincon, Guanajuato', 'Leon, Guanajuato', 'Leon, Guanajuato', 'Leon, Guanajuato', 'Abasolo, Guanajuato', 'Leon, Guanajuato', 'Silao, Guanajuato', 'Valle de Santiago, Guanajuato', 'Santa Cruz, Queretaro', 'San Felipe, Guanajuato', 'Cuautitlan, EdoMex', 'Ecatepec, EdoMex', 'Tecamac, EdoMex', 'Tlahuelilpan, Hidalgo', 'Tlanalapa, Hidalgo', 'Tepotzotlan, EdoMex', 'Tizayuca, Hidalgo', 'Coacalco, EdoMex', 'Tultitlan, EdoMex', 'Nicolas Romero, EdoMex', 'Coacalco, EdoMex', 'Ecatepec, EdoMex', 'Atizapan de Zaragoza, Adolfo Lopez Mateos, EdoMex', 'Atenco, EdoMex', 'Ecatepec, EdoMex', 'Ecatepec, EdoMex', 'Milpa Alta, CdMx', 'Xochimilco, Mexico', 'Milpa Alta, CdMx', 'Benito Juarez, Ciudad de Mexico', 'Iztacalco, CdMx', 'Tlahuac, CdMx', 'Iztapalapa, CdMx', 'Iztapalapa, CdMx', 'Iztapalapa, CdMx', 'El Paraiso, Veracruz', 'Cosoleacaque, Veracruz', 'Teapa, Tabasco', 'Palenque, Chiapas', 'Villahermosa, Tabasco', 'Villahermosa, Tabasco', 'Centla, Tabasco', 'Comalcalco, Tabasco', 'Paraiso, Tabasco', 'Villahermosa, Tabasco', 'Chimalhuacan, EdoMex', 'Ixtapaluca, EdoMex', 'Valle de Chalco, EdoMex', 'Chimalhuacan, EdoMex', 'Ecatepec, EdoMex', 'Nezahualcóyotl, EdoMex', 'Ecatepec, EdoMex', 'Nezahualcóyotl, EdoMex', 'Chimalhuacan, EdoMex', 'Nezahualcóyotl, EdoMex', 'Chimalhuacan, EdoMex', 'Chimalhuacan, EdoMex', 'Iztapalapa, CdMx', 'Benito Juarez, Cancun, Quintana Roo', 'Othon P. Blanco, Chetumal, Quintana Roo', 'Benito Juarez, Quintana Roo', 'Kanasin, Yucatan', 'Merida, Yucatan', 'Cd. del Carmen, Campeche', 'Escarcega, Campeche', 'Merida, Yucatan', 'Halacho, Yucatan', 'Tepic, Nayarit', 'Solidaridad, Playa del Carmen, Quintana Roo', 'Oaxaca, Oaxaca', 'Santa Cruz Xoxocotlan, Oaxaca', 'Apizaco, Tlaxcala', 'Oaxaca, Oaxaca', 'Amozoc, Puebla', 'Puebla, Puebla', 'Puebla, Puebla', 'Rafael Lara Grajales, Puebla', 'Puebla, Puebla', 'Puebla, Puebla', 'Veracruz, Veracruz', 'Veracruz, Veracruz', 'Amatlan de los Reyes, Veracruz', 'Tlalixcoyan, Veracruz', 'Orizaba, Veracruz', 'Chocaman, Veracruz', 'Cordoba, Veracruz', 'Cosoleacaque, Veracruz', 'Santiago Tuxtla, Veracruz', 'Cuauhtemoc, CdMx', 'Cuauhtemoc, CdMx', 'Gustavo A. Madero, CdMx', 'Cuauhtemoc, CdMx', 'Alvaro Obregon, CdMx', 'Naucalpan, EdoMex', 'Tlalnepantla, EdoMex', 'Gustavo A. Madero, CdMx', 'Tultitlan, EdoMex', 'Nicolas Romero, EdoMex', 'Tlalpan, CdMx', 'San Luis Potosi, San Luis Potosi', 'Calvillo, Aguascalientes', 'Aguascalientes, Aguascalientes', 'villa de ramos, san luis potosi', 'Venegas, San Luis Potosi', 'San Luis Potosi, San Luis Potosi', 'San Luis Potosi, San Luis Potosi', 'San Luis Potosi, San Luis Potosi', 'General Francisco Murguia, Juan Aldama, Zacatecas', 'Acapulco, Guerrero', 'Acapulco, Guerrero', 'Chilpancingo de los Bravo, Guerrero', 'Chilpancingo de los Bravo, Guerrero', 'Iguala, Guerrero', 'Tuncingo, Guerrero', 'Cuautla, Morelos', 'cuernavaca, morelos', 'Xoxocotla, Morelos', 'Tlapa de Comonfort, Guerrero', 'Santa Catarina, Nuevo Leon', 'San Pedro Garza Garcia, Nuevo Leon', 'Garcia, Nuevo Leon', 'Carmen, Nuevo Leon', 'Sabinas, Coahuila', 'Acuña, Coahuila', 'El Carmen, Nuevo Leon', 'Garcia, Nuevo Leon', 'Cd. Obregon, Sonora', 'Cd. Obregon, Sonora', 'Obregon, Sonora', 'Navojoa, Sonora', 'El Fuerte, Sinaloa', 'Los Mochis, Sinaloa', 'Guasave, Sinaloa', 'Angostura, Sinaloa', 'Navolato, Sinaloa', 'Culiacan, Sinaloa', 'Culiacan, Sinaloa', 'Culiacan, Sinaloa', 'Bachigualatillo, Sinaloa', 'Tuxpan, Veracruz', 'Poza Rica, Veracruz', 'Altotonga, Veracruz', 'Xalapa, Veracruz', 'Tuxtla Gutierrez, Chiapas', 'Tuxtla Gutierrez, Chiapas', 'Tuxtla Gutierrez, Chiapas', 'San Fernando, Chiapas', 'Tuxtla Gutierrez, Chiapas', 'Ocozocoautla, Chiapas', 'Ocosingo, Chiapas', 'La Trinitaria, Chiapas', 'Tapachula, Chiapas', 'Tonala, Chiapas', 'Heroica Ciudad de Juchitan de Zaragoza, Oaxaca', 'San Juan Guichicovi, Oaxaca'];
