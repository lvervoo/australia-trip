
function addImagegalerie(srcimage,altimage){
    var containergalerie = document.getElementById("Gallery-list");
    var imagecontener = document.createElement("li");
    var image = document.createElement("img");
  
    imagecontener.className = "Gallery-item";
  
    image.src= srcimage;
    image.alt = altimage;
    image.className = "Gallery-image";
    image.loading = "lazy";
      
   
    imagecontener.appendChild(image);
    const last = containergalerie.lastElementChild;
    containergalerie.insertBefore(imagecontener, last); //ajoute à l'avant dernier enfant
       

}

async function getjsonimagesgallery() { 
    let url = './jsonfiles/sectiongallery.json';
    try {
        let res = await fetch(url);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}

function randomize(tab) {
    var i, j, tmp;
    for (i = tab.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        tmp = tab[i];
        tab[i] = tab[j];
        tab[j] = tmp;
    }
    return tab;
}

async function CreateGalery(){

    let photolist = await getjsonimagesgallery(); //l'appel doit se faire dans une fonction asynchrone pour que ça marche
  
    //Fonction map pour récupérer les données json des slides
    let srcliste = photolist.map(data => data.src);
    let altliste = photolist.map(data => data.alt); //Tous les altliste sont identiques
    
    srcliste = randomize(srcliste);

    //On ajoute toute les slide en dom
    for (let i = 0; i < srcliste.length; i++) {
        addImagegalerie(srcliste[i],altliste[i]);
    }
}

CreateGalery();
