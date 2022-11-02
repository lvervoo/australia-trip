
//import JsonInterview from './sectioninterview.json' assert {type: 'json'};

/*
*/




/*
fetch('sectioninterview.json')
  .then(res=> res.json())
  .then(data => {
    playlist = data;
    //Ici data est un object javascript 
    
    }
  )  
*/

//SIte intéressant pour manipuler les json : http://ti1.free.fr/index.php/javascript-le-fichier-json-lire-ecrire-modifier/
 
async function getplaylist() {
    let url = '/jsonfiles/sectioninterview.json';
    try {
        let res = await fetch(url);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}



//Cette fonction ne fonctionne pas
function setplaylist(commentjson, audnow) {

  let url = 'sectioninterview.json';
  try {
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: commentjson
    });
  } 
  catch (error) {
    console.log(error);
  }
}

  

  //il faut ouvrir le fichier html puis cliquer sur f1 ; écrire live serveur , choisir open liver serveur pour que ça marche
  //Le live serveur est super pratique, il permet de voir les modifications en direct sans recharger la page
  //Tuto json : https://stackoverflow.com/questions/19706046/how-to-read-an-external-local-json-file-in-javascript
  //https://www.tutorialspoint.com/how-to-import-local-json-file-data-to-my-javascript-variable
  //https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/JSON
  //https://www.javascripttutorial.net/javascript-fetch-api/#:~:text=Use%20the%20fetch()%20method%20to%20return%20a%20promise%20that,resolve%20into%20the%20actual%20data.

  //Post function https://openclassrooms.com/fr/courses/5543061-ecrivez-du-javascript-pour-le-web/5577626-sauvegardez-des-donnees-sur-le-service-web
  //Post function : https://openclassrooms.com/fr/courses/7697016-creez-des-pages-web-dynamiques-avec-javascript/7911191-sauvegardez-les-donnees-grace-a-une-api-http
  //gerer du code asyncrone : https://openclassrooms.com/fr/courses/5543061-ecrivez-du-javascript-pour-le-web/5866911-parallelisez-plusieurs-requetes-http
  //La fonction map : https://openclassrooms.com/fr/courses/7697016-creez-des-pages-web-dynamiques-avec-javascript/7911123-projetez-des-donnees-avec-la-fonction-map


window.addEventListener("DOMContentLoaded", async () => 
{
  
  // (A) PLAYER INIT
  // (A1) PLAYLIST - CHANGE TO YOUR OWN!

  //Modifier, on veut le récupérer avec une méthode get

  
/*
  
  let playlist = [                                      //Liste d'object en javascript ( il faut trouver un moyen de le traduire en JSON)
    {name: "Audio 1", src: "./audio/sample-15s.mp3", paragraphestart :"salut", commentsaudio: [ {timecode: "00:00:02",comment: "Commentaire 1" }, { timecode : "00:00:05", comment : "Commentaire 2" }],paragrapheend:"aurevoir"},   //Object 1
    {name: "Audio 2", src: "./audio/sample-3s.mp3" },
    {name: "Audio 3", src: "./audio/sample-3s.mp3" },
    {name: "Audio 4", src: "./audio/sample-3s.mp3" },
    {name: "Audio 5", src: "./audio/sample-3s.mp3" },
    {name: "Audio 6", src: "./audio/sample-3s.mp3" },
    {name: "Audio 7", src: "./audio/sample-3s.mp3" },
    {name: "Audio 8", src: "./audio/sample-3s.mp3" },
    {name: "Audio 9", src: "./audio/sample-3s.mp3" },
    {name: "Audio 10", src: "./audio/sample-3s.mp3" },
    {name: "Audio 11", src: "./audio/sample-3s.mp3" },
    {name: "Audio 12", src: "./audio/sample-3s.mp3" },
    {name: "Audio 13", src: "./audio/sample-3s.mp3" }
  ];
  
  */
  let playlist = await getplaylist(); //Voici comment on récupère le data json au format javascript
   

  

  // (A2) AUDIO PLAYER & GET HTML CONTROLS
  const audio = new Audio(),
        aPlay = document.getElementById("aPlay"), //Play/Pause button
        aPlayIco = document.getElementById("aPlayIco"), //Play/Pause icon
        aNow = document.getElementById("aNow"), //Time actual
        aTime = document.getElementById("aTime"), //Time total
        aSeek = document.getElementById("aSeek"), //Bar time
        aVolume = document.getElementById("aVolume"), //Volume icon
        aVolIco = document.getElementById("aVolIco"), //Bar volume
        aList = document.getElementById("aList"), //playlist
        aNextauto = document.getElementById("aNextauto"),
        aNextautoIco = document.getElementById("aNextautoIco"),
        aNextrandom = document.getElementById("aNextrandom"),
        aNextrandomIco = document.getElementById("aNextrandomIco"),
        changetimelist= document.getElementsByClassName("Playerchangetime"), //List des élements avec les times codes
        interviewparagraphe = document.getElementById("Interview__paragraphe")

  //ajoutloic
  var runnextauto = true, runnextrandom ="false";


  // (A3) BUILD PLAYLIST
  for (let i in playlist) {
    let row = document.createElement("div");
    row.className = "aRow";
    row.innerHTML = playlist[i]["name"];            // Méthode pour récupérer l'attribue name de l'Object 1
    row.addEventListener("click", () => { audPlay(i); changeparagraphe(i); ChangeAudioComments(i); });
    playlist[i]["row"] = row;                      // Méthode ajouter l'atribut row de l'object
    aList.appendChild(row);
  }

  var ListScrollmin=0, ListScrollmax=aList.scrollHeight;

  var scrollToelement = (nbelement,nbelementmax) => {
    //elementheigth = (ListScrollmax-ListScrollmin)/(nbelementmax/nbelement);
    aList.scrollTop = (ListScrollmax-ListScrollmin)/(nbelementmax/(nbelement-1));
  }



  // (B) PLAY MECHANISM
  // (B1) FLAGS
  var audNow = 0, // current song
  audStart = false, // auto start next song


  // (B2) PLAY SELECTED SONG
  audPlay = (idx, nostart) => {
    audNow = idx;
    audStart = nostart ? false : true;
    audio.src = playlist[idx]["src"];
    for (let i in playlist) {
      if (i == idx) { playlist[i]["row"].classList.add("now"); } //L'audio qui a la class now est joué
      else { playlist[i]["row"].classList.remove("now"); } //Les autres audio ne sont pas joués
    }
  };

  // (B3) AUTO START WHEN SUFFICIENTLY BUFFERED
  audio.addEventListener("canplay", () => { if (audStart) {
    audio.play();
    audStart = false;
  }});


  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }




  // (B4) AUTOPLAY NEXT SONG IN THE PLAYLIST
  audio.addEventListener("ended", () => {

    if(runnextauto){
       if(runnextrandom){

          var r = getRandomInt(playlist.length);//playlist.length non inclu
          
          //Cas où la même playlist 
          if(r==audNow){audNow++}
          else{audNow=r;}
       }
       else{

        audNow++;

       }
       if (audNow >= playlist.length) { audNow = 0; }
       scrollToelement(audNow,playlist.length);
       audPlay(audNow);
       changeparagraphe(audNow);
       ChangeAudioComments(audNow);
    }
    
  });


  // (B5) INIT SET FIRST SONG
  audPlay(0, true);


  // (C) PLAY/PAUSE BUTTON
  // (C1) AUTO SET PLAY/PAUSE TEXT
  audio.addEventListener("play", () => {
    aPlayIco.innerHTML = "pause"; //à partir de ce texte HTML on a l'icone pause
  });
  audio.addEventListener("pause", () => {
    aPlayIco.innerHTML = "play_arrow"; //à partir de ce texte HTML on a l'icone play
  });

  // (C2) CLICK TO PLAY/PAUSE
  aPlay.addEventListener("click", () => {
    if (audio.paused) { audio.play(); }
    else { audio.pause(); }
  });


  // (D) TRACK PROGRESS
  // (D1) SUPPORT FUNCTION - FORMAT HH:MM:SS
  var timeString = (secs) => {
    // HOURS, MINUTES, SECONDS
    let ss = Math.floor(secs),
        hh = Math.floor(ss / 3600),
        mm = Math.floor((ss - (hh * 3600)) / 60);
    ss = ss - (hh * 3600) - (mm * 60);

    // RETURN FORMATTED TIME
    if (hh>0) { mm = mm<10 ? "0"+mm : mm; }
    ss = ss<10 ? "0"+ss : ss;
    return hh>0 ? `${hh}:${mm}:${ss}` : `${mm}:${ss}` ;
  };

  // (D2) INIT SET TRACK TIME
  audio.addEventListener("loadedmetadata", () => {
    aNow.innerHTML = timeString(0);
    aTime.innerHTML = timeString(audio.duration);
  });

  // (D3) UPDATE TIME ON PLAYING
  audio.addEventListener("timeupdate", () => {
    aNow.innerHTML = timeString(audio.currentTime);
  });



  // (E) SEEK BAR
  audio.addEventListener("loadedmetadata", () => {
    // (E1) SET SEEK BAR MAX TIME
    aSeek.max = Math.floor(audio.duration);

    // (E2) USER CHANGE SEEK BAR TIME
    var aSeeking = false; // USER IS NOW CHANGING TIME
    aSeek.addEventListener("input", () => {
      aSeeking = true; // PREVENTS CLASH WITH (E3)
    });
    aSeek.addEventListener("change", () => {
      audio.currentTime = aSeek.value;
      if (!audio.paused) { audio.play(); }
      aSeeking = false;
    });

    // (E3) UPDATE SEEK BAR ON PLAYING
    audio.addEventListener("timeupdate", () => {
      if (!aSeeking) { aSeek.value = Math.floor(audio.currentTime); }
    });
  });

  // (F) VOLUME
  aVolume.addEventListener("change", () => {
    audio.volume = aVolume.value;
    aVolIco.innerHTML = (aVolume.value==0 ? "volume_mute" : "volume_up"); //Change le logo du volume si il set à 0
  });


  // (G) ENABLE/DISABLE CONTROLS
  audio.addEventListener("canplay", () => {
    aPlay.disabled = false;
    aVolume.disabled = false;
    aSeek.disabled = false;
    aNextauto.disabled =false;
    aNextrandom.disabled =false;
  });
  audio.addEventListener("waiting", () => {
    aPlay.disabled = true;
    aVolume.disabled = true;
    aSeek.disabled = true;
    aNextauto.disabled =true;
    aNextrandom.disabled =true;
  });


  //Nouvelle fonction Loic

  //Button next song automatique
  aNextauto.addEventListener("click", () => {
    if (runnextauto) { aNextautoIco.innerHTML = "do_not_disturb_on"; runnextauto=false; }
    else {aNextautoIco.innerHTML = "slideshow" ; runnextauto=true; }
  });

  //Button next song random

  aNextrandom.addEventListener("click", () => {
    if (runnextrandom) {  aNextrandomIco.innerHTML = "repeat_on" ; runnextrandom =false;}
    else {aNextrandomIco.innerHTML = "shuffle_on";  runnextrandom=true; }
  });



  // (D1) SUPPORT FUNCTION - FORMAT HH:MM:SS to format ss
  function hmstosec(hms)
  {
    //const hms = '02:04:33';
    const timelist = hms.split(":");
    
    var totalSeconds = 0;
    if(timelist.length==3){
      hours = parseInt(timelist[0]);
      minutes = parseInt(timelist[1]);
      sec = parseInt(timelist[2]);
      totalSeconds = hours *60*60 + minutes*60 + sec;
       }
    if(timelist.length==2){
      minutes = parseInt(timelist[0]);
      sec = parseInt(timelist[1]);
      totalSeconds = minutes*60 + sec;
    }
    return totalSeconds;
  };

  addclicktime(); //Pour que la fonction soit appelée une première fois
  //On doit ajouter la prise en compte de click sur les times codes des paragraphes
  function addclicktime()
  {
    for (let i in changetimelist) {
      //changetimelist[i].addEventListener("click", () => {  étrange on a une erreur dans la console donc on change avec ça qui fonctionne
      changetimelist[i].onclick = function() {
          var timewant = hmstosec(changetimelist[i].innerText);
          if(timewant<audio.duration){
            audio.currentTime = timewant  ;
          }
          else(
            alert("time selected longer than audio or not in suitable format")
          )
      };

    }
 }


  function changeparagraphe(numaudio){

     
     let stringparagraphe  = "";

     //Ici il faudra récupérer les bon document à partir du bon numaudio
     let debutparagrapje = playlist[numaudio]["paragraphestart"];
     let audiotime = playlist[numaudio]["commentsaudio"].map(data => data.timecode);  //fonction map
     let commenttime = playlist[numaudio]["commentsaudio"].map(data => data.comment); //fonction map
     let finparagraphe = playlist[numaudio]["paragrapheend"];

    stringparagraphe += "<a>"+debutparagrapje + "</a>" + "<br>";
    for (let i = 0, len = audiotime.length; i < len; i++) {
      
      stringparagraphe += "<a class=\"Playerchangetime\">"+ audiotime[i] +"</a>  <a> : " + commenttime[i] + "<br> </a>";
    }
    stringparagraphe += "<a>"+ finparagraphe + "</a>" ;
    
    //stringparagraphe = "<a class=\"Playerchangetime\">00:00:02</a>"+ "<br>" + " end";

    interviewparagraphe.innerHTML = stringparagraphe;
    addclicktime();  //On doit ajouter la prise en compte de click sur les times codes
  };
  


  ///Gestion des commentaires

  document.getElementById("ajoutcom").onclick = function() {SendComment()};

  function SendComment() {

  

    var namecontent = document.getElementById("NameComment");
    var messagecontent = document.getElementById("MessageComment");
  
    strname = namecontent.value;
    strmessage = messagecontent.value;
  
    var addbool = true;
  
    if(strname==""){
      alert("add a name")
      addbool = false;
    }
  
    if(strmessage==""){
      alert("add a comment")
      addbool = false;
    }
     
    if(addbool){
  
      //Ajout sur pour l'utilisateur
      let comment = { name: strname,  com: strmessage };
      playlist[audNow]["commentsuser"].push(comment); //ajout d'un objet au tableau

      //Ajout en ligne
      const commentjson = JSON.stringify(comment);
      //setplaylist(commentjson, audNow); ne marche pas

      AddOneComment(strname, strmessage);
      //On vide les formulaires
      namecontent.value = "";
      messagecontent.value = "";//On vide les formulaires
  
    }
  
  };


  function AddOneComment(strname, strmessage){

    var containercomment = document.getElementById("post-comment");
      var comment = document.createElement("div");
      comment.className = "list";
  
      
      var domcomment = " <div class=\"user\">    <div class=\"user-meta\">      <div class=\"name\"> " + strname + "</div> </div>  </div>  <div class=\"comment-post\"> " + strmessage + "</div>";
      comment.innerHTML = domcomment;
      
      containercomment.appendChild(comment);
   
  }

  function AddComments(numaudio){

    

    let nameuser = playlist[numaudio]["commentsuser"].map(data => data.name);  //fonction map
    let commentuser = playlist[numaudio]["commentsuser"].map(data => data.com); //fonction map


    for (let i = 0, len = nameuser.length; i < len; i++) {
      AddOneComment(nameuser[i], commentuser[i]);
    }
    
   
  
  }
  
  
  function DeleteComments() {
    var containercomment = document.getElementById("post-comment");
    var child = containercomment.lastElementChild;
    while (containercomment.childElementCount > 0) {
        containercomment.removeChild(child);
        child = containercomment.lastElementChild;
    }
  }
  
  
  function ChangeAudioComments(numaudio) {
  
      DeleteComments();
      
      AddComments(numaudio);
   
  }
  


});












  
  
   












function HideshowDescription() {
  var x = document.getElementById("Interview__paragraphe");
  var y = document.getElementById("btnHideshowDescription");
  if (x.style.display === "none") {
    x.style.display = "block";
    y.innerText = "Hide description";
  } else {
    x.style.display = "none";
    y.innerText ="Show description";
  }
}


