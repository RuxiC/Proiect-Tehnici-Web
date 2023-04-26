const express = require("express");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const sass = require("sass");
/*const {Client} = require("pg");*/

/*
var client= new Client({database:"tehnici_web",
        user:"ruxandra",
        password:"1234",
        host:"localhost",
        port:5432});
client.connect();

client.query("select * from lab8_10", function(err, rez){
    console.log("eroare:", err);
    console.log("rezultat:", rez);
});
*/

// express ne-a ajutat sa cream un server
app = express();  // etapa 4 - ex 2

obGlobal={
    obErori:null,
    obImagini:null,
    folderScss: path.join(__dirname, "resurse/scss"),  // etapa 5 - a)
    folderCss: path.join(__dirname, "resurse/css"),
    folderBackup: path.join(__dirname, "backup")
}
/*
client.query("select * from unnest(enum_range(null::categ_prajitura)))",function(err, rezTipuri){
    if(err){
        console.log(err)
    }
    else{
        obGlobal.optiuniMeniu-rezTipuri.rows
    }

})
*/

// etapa 4 - ex3
console.log("Folder proiect", __dirname); 
console.log("Cale fisier", __filename);
console.log("Director de lucru", process.cwd());

// etapa 4 - ex 20 si etapa 5 c)
vectorFoldere=["temp", "temp1", "resurse", "backup"]  // am creat temp si temp 1
for(let folder of vectorFoldere){
   // let caleFolder=__dirname+"/"+folder
   let caleFolder=path.join(__dirname, folder)
   if (! fs.existsSync(caleFolder)){ //nu (exista in mod sincron, nu trebuie callback)
       fs.mkdirSync(caleFolder); //creaza director in mod sincron
   }
}


//etapa 5 b
/*sa nu compilam manual de fiecare data scss*/
function compileazaScss(caleScss, caleCss){
    console.log("cale:",caleCss);
    if(!caleCss){ /*undifind*/ /*lista cu fi+olderele din cale*/
        let vectorCale=caleScss.split("\\")
        let numeFisExt=vectorCale[vectorCale.length-1]; /*cu extensie*/

        let numeFis=numeFisExt.split(".")[0]   /// "a.scss"  -> ["a","scss"]
        caleCss=numeFis+".css";
    }
    
    if (!path.isAbsolute(caleScss)) //nu e cale absoluta, pun fisierele chiar in folderele absolute; /,#
        caleScss=path.join(obGlobal.folderScss, caleScss)
    if (!path.isAbsolute(caleCss))
        caleCss=path.join(obGlobal.folderCss, caleCss)
    
    // la acest punct avem cai absolute in caleScss si  caleCss
    let vectorCale=caleCss.split("\\");
    let numeFisCss=vectorCale[vectorCale.length-1]; 
    if (fs.existsSync(caleCss)){ /* etapa 5 d)  copiere in backup daca exista fisierul css*/
        fs.copyFileSync(caleCss, path.join(obGlobal.folderBackup, numeFisCss))// +(new Date()).getTime()
    }
    /*ob cu prop css, e string rezultat din cod css*/
    rez=sass.compile(caleScss, {"sourceMap":true}); /*vad linia din fisierul sass, chiar daca browserul nu primeste fisierul sass*/
    fs.writeFileSync(caleCss,rez.css)
    console.log("Compilare SCSS",rez);
}
//compileazaScss("a.scss");
//etapa 5 e)
/*verifica daca au suvernit schimbari; din scss sa l fac css*/
fs.watch(obGlobal.folderScss, function(eveniment, numeFis){
    console.log(eveniment, numeFis);
    if (eveniment=="change" || eveniment=="rename"){
        let caleCompleta=path.join(obGlobal.folderScss, numeFis);
        if (fs.existsSync(caleCompleta)){
            compileazaScss(caleCompleta);
        }
    }
})

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
    res.render("pagini/index", {ip: req.ip, a:10, b:20, imagini:obGlobal.obImagini.imagini}); // render-sa compileze/afiseze, transforma include-ul din index.ejs in html
});                                                       // proprietatile lui locals in req.ip



/*
app.get("/produse",function(req, res){
    console.log(req.query);

    //TO DO query pentru a selecta toate produsele
    //TO DO se adauaga filtrarea dupa tipul produsului
    //TO DO se selecteaza si toate valorile din enum-ul categ_prajitura

    client.query("select * from unnest(enum_range(null::categ_prajitura))",function(err, rez){
     //   console.log(err);
     //   console.log(rez);
    })
        let conditieWhere=""
        if(req.query.tip)
            conditieWhere= `where tip_produs= '${req.query.tip}'`;
        client.query("select * from prajituri"+conditieWhere , function( err, rez){
            console.log(300)
            if(err){
                console.log(err);
                renderError(res, 2);
            }
            else
                res.render("pagini/produse", {produse:rez.rows, optiuni:rezCategorie.rows});
        });


});


app.get("/produs/:id",function(req, res){
    console.log(req.params);
   
    client.query(" TO DO ", function( err, rezultat){
        if(err){
            console.log(err);
            afisareEroare(res, 2);
        }
        else
            res.render("pagini/produs", {prod:""});
    });
});
*/

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


function initializeazaImagini(){  // citeste fisierul json
    var continut = fs.readFileSync(__dirname+"/resurse/json/galerie.json").toString("utf-8");
    obGlobal.obImagini = JSON.parse(continut);  // parsare -> identifica proprietatile si valorile din json
    let vImagini=obGlobal.obImagini.imagini;
    let caleAbs=path.join(__dirname, obGlobal.obImagini.cale_galerie);
    let caleAbsMediu=path.join(__dirname,obGlobal.obImagini.cale_galerie, "mediu");  // folder in care vom crea imag de dimensiune medie
    let caleAbsMic=path.join(__dirname,obGlobal.obImagini.cale_galerie, "mic");
    if(!fs.existsSync(caleAbsMediu))
        fs.mkdirSync(caleAbsMediu);
    if(!fs.existsSync(caleAbsMic))
        fs.mkdirSync(caleAbsMic);
    for(let imag of vImagini){
        [numeFis, ext]= imag.fisier.split(".");
        let caleFisAbs=path.join(caleAbs,imag.fisier);
        let caleFisMediuAbs = path.join(caleAbsMediu, numeFis +".webp");
        let caleFisMicAbs=path.join(caleAbsMic,numeFis+".webp");
        sharp(caleFisAbs).resize(400).toFile(caleFisMediuAbs);
        sharp(caleFisAbs).resize(200).toFile(caleFisMicAbs);

        imag.fisier_mediu=path.join("/", obGlobal.obImagini.cale_galerie, "mediu",numeFis+".webp" )
        imag.fisier=path.join("/", obGlobal.obImagini.cale_galerie, imag.fisier )
    }
}
initializeazaImagini();

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