

//--------------------------Diary Month------------------------------- 

//--------------------------Carrousel------------------------------- 


let slideIndex = 1;
//showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slides[slideIndex-1].style.display = "block";
}


//showSlides2();

function showSlides2() {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1}
  slides[slideIndex-1].style.display = "block";
  setTimeout(showSlides2, 5000); // Change image every 5 seconds
}




//--------------------------Button drop down ( liste déroulante change mois )------------------------------- 



//on récupère la liste des objest pour chaque mois ( premier élement est le mois d'octobre)



/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function DropdownFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

//Récupérer le fichier json avec les infos pour chaque mois et les convertis en données javascripts
async function getjsonMonthcarrousel() { 
  let url = './jsonfiles/sectionmonth.json';
  try {
      let res = await fetch(url);
      return await res.json();
  } catch (error) {
      console.log(error);
  }
}


///ajout du dom d'une slide au carrouesel
function addImageCarroussel(nbslide, nbslidetot,srcimage,altimage,textimage ){
  var containercarousel = document.getElementById("slideshow-container");
  var slide = document.createElement("div");
  var slidenumbertext = document.createElement("div");
  var slideimage = document.createElement("img");
  var slidetitletext = document.createElement("div");

  slide.className = "mySlides fade";

  slidenumbertext.className = "numbertext";
  slidenumbertext.innerText = ""+nbslide+" / "+nbslidetot;

  slideimage.className = "imagecarrousel";
  slideimage.src= srcimage;
  slideimage.alt = altimage;
  slideimage.style.width = "100%";

  slidetitletext.className="text";
  slidetitletext.id = "textcarrousel"+nbslide;
  slidetitletext.innerText = textimage;

  slide.appendChild(slidenumbertext);
  slide.appendChild(slideimage);
  slide.appendChild(slidetitletext);

  containercarousel.appendChild(slide);
}

function deleteImagesCarrousel() {
  var containercarousel = document.getElementById("slideshow-container");

  var child = containercarousel.lastElementChild; 
  while (containercarousel.childElementCount > 2) { //On garde kes deux flèches (deux premier enfants)
      containercarousel.removeChild(child);
      child = containercarousel.lastElementChild;
  }
}


async function ChangeMonthSection(numMonth){

  let sectionmonth = await getjsonMonthcarrousel(); //l'appel doit se faire dans une fonction asynchrone pour que ça marche
  
  let monthdata=sectionmonth[numMonth]
  

  let title = document.getElementById("MonthTitle");
  let paragraphe = document.getElementById("monthtext");

  title.innerText = monthdata.title; 
  paragraphe.innerText = monthdata.paragraphe;

  deleteImagesCarrousel();

  //Fonction map pour récupérer les données json des slides
  let srcliste = monthdata["pictures"].map(data => data.src);
  let altliste = monthdata["pictures"].map(data => data.alt);
  let textpictureliste = monthdata["pictures"].map(data => data.textpicture);

  let nbphoto=srcliste.length;
  //On ajoute toute les slide en dom
  for (let i = 0; i < srcliste.length; i++) {
    addImageCarroussel(i+1,nbphoto,srcliste[i],altliste[i],textpictureliste[i]);
  }

  //Important de change cette variable sinon beug
  slideIndex = 1; 
  showSlides(slideIndex); //on remet la première image par défaut



}




/* Donne une idée de ce qui est fait pour un mois ( utilisé avant que j'ajoute les fichier json)
function OctoberFunction() {

  var nbphoto=3;

  var title = document.getElementById("MonthTitle");
  var paragraphe = document.getElementById("monthtext");

  title.innerText = "Montly Diary - October"; 
  paragraphe.innerText = "October October changer texte";

  deleteImagesCarrousel();

  addImageCarroussel(1,nbphoto,'./images/Australie-fondecranpng.PNG',"altchange1","photo 1");
  addImageCarroussel(2,nbphoto,'./images/Australie-fondecranpng.PNG',"altchange2","photo 2");
  addImageCarroussel(3,nbphoto,"./images/cadre.png","altchange3","photo 3");

  slideIndex = 1; //Important de change cette variable sinon beug
  showSlides(slideIndex);
}
*/



// Fonction appelé dans le html 
function Functiononload() {
  //OctoberFunction();
  ChangeMonthSection(0);
  
}



