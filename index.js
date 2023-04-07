const express = require("express");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const sass = require("sass");

// express ne-a ajutat sa cream un server
app = express();  // etapa 4 - ex 2

obGlobal={
    obErori:null,
    obImagini:null,
    folderScss: path.join(__dirname, "resurse/scss"),  // etapa 6 - a)
    folderCss: path.join(__dirname, "resurse/css")
}

// etapa 4 - ex3
console.log("Folder proiect", __dirname); 
console.log("Cale fisier", __filename);
console.log("Director de lucru", process.cwd());

// etapa 4 - ex 20
vectorFoldere=["temp", "temp1", "resurse", "backup"]  // am creat temp si temp 1
for(let folder of vectorFoldere){
   // let caleFolder=__dirname+"/"+folder
    let caleFolder=path.join(__dirname,folder);
    if(!fs.existsSync(caleFolder))
        fs.mkdirSync(caleFolder);
}


function compileazaScss(caleScss, caleCss){
    if(!path.isAbsolute(caleScss))
        caleCss=path.join(obGlobal.folderScss.caleScss);

}

app.set("view engine", "ejs"); // in ejs scriem template-uri

// etapa 4 - ex 6
app.use("/resurse", express.static(__dirname+"/resurse")); // folderul resurse il definim static de unde ne luam toate fisierele care nu trebuie procesate


app.use("/node_modules", express.static(__dirname+"/node_modules"));



//etapa 4 - ex 17
app.use(/^\/resurse(\/[a-zA-Z0-9]*(?!\.)[a-zA-Z0-9]*)*$/,function(req, res){
    afiseazaEroare(res, 403);
});

// etapa 4 - ex 18
app.get("/favicon.ico", function(req, res){
    res.sendFile(__dirname+"/resurse/ico/favicon.ico");
})

app.get("/ceva", function(req, res){
    console.log("cale:", req.url);
    res.send("<h1>altceva</h1> ip:"+req.ip);
});

// etapa 4 - ex8 si ex 16
app.get(["/index", "/", "/home"], function(req, res){
    res.render("pagini/index", {ip: req.ip, a:10, b:20}); // render-sa compileze/afiseze, transforma include-ul din index.ejs
});                                                       // proprietatile lui locals in req.ip

// etapa 4 - ex 19
//app.get("/\.ejs$/")
app.get("/*.ejs", function(req,res){
    afiseazaEroare(res, 400);
})

// etapa 4 - ex 9 si ex 10 
app.get("/*", function(req, res){  
    console.log("cale:", req.url);
    try{
        res.render("pagini"+ req.url, function(err, rezRandare){
            console.log("Eroare:", err);
            console.log("Rezultat randare:", rezRandare);
            if(err){
                console.log(err);
                if(err.message.startsWith("Failed to lookup view")) 
                // afiseazaEroare(res, {_identificator:404, _titlu:"ceva"});
                    afiseazaEroare(res, 404);
                else
                    afiseazaEroare(res);
            }
            else{
                res.send(rezRandare);
            }
        });
    }
    catch (err){
        console.log(err);
        if(err.message.startsWith("Cannot find module")){
            afiseazaEroare(res, 404, "Fisier resursa negasit");
        }
    }
});

// etapa 4 - ex 13
function initializeazaErori(){  // citeste fisierul json
    var continut = fs.readFileSync(__dirname+"/resurse/json/erori.json").toString("utf-8");
    console.log(continut);
    obGlobal.obErori = JSON.parse(continut);  // parsare -> identifica proprietatile si valorile din json
    let vErori=obGlobal.obErori.info_erori;
    // for (let i = 0; i < obErori.info_erori.length; i ++){
    //    console.log(obErori.info_erori[i].imagine)
    //}
    for(let eroare of vErori){
        eroare.imagine = "/"+obGlobal.obErori.cale_baza+"/"+eroare.imagine;
    }
}

initializeazaErori();

/*
daca programatorul seteaza titlul, se ia titlul din argument
daca nu e setat, se ia cel din json
daca nu avem titlu nici in JSON se ia titlul de la valoare default
idem pentru celelalte
*/


// etapa 4 - ex 14
//function afiseazaEroare(res, {_identificator, _titlu, _text, _imagine}={}){
function afiseazaEroare(res, _identificator, _titlu="titlu default", _text, _imagine ){
    let vErori=obGlobal.obErori.info_erori;
    let eroare=vErori.find(function(elem) {return elem.identificator==_identificator;} )
    if(eroare){
        let titlu1= _titlu=="titlu default" ? (eroare.titlu || _titlu) : _titlu;
        let text1= _text || eroare.text;
        let imagine1= _imagine || eroare.imagine;
        if(eroare.status)
            res.status(eroare.identificator).render("pagini/eroare", {titlu:titlu1, text:text1, imagine:imagine1});
        else
            res.render("pagini/eroare", {titlu:titlu1, text:text1, imagine:imagine1});
    }
    else{
        let errDef=obGlobal.obErori.eroare_default;
        res.render("pagini/eroare", {titlu:errDef.titlu, text:errDef.text, imagine:obGlobal.obErori.cale_baza+"/"+errDef.imagine});
    }
         
}



app.listen(8080);  
console.log("Serverul a pornit!"); // scrie in consola acest text