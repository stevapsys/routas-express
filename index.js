//importanto express e chamando ele
import express from "express"; 
const app = express(); 
//avisando o express que queremos trabalhar com o json
app.use(express.json()); 

//crindo o metódo get 
//REQ = requisição e RES = resposta
app.get("/", (req, res) => {
    res.send("Helo World!");
    });

//.all é pra usar todos os metódos de rotas
//req.method é pra mostrar qual é o tipo de metódo que está sendo usado
app.all("/testAll", (req, res) => {
    res.send(req.method); 
}); 

//crindo o metódo post e testando no insomina
app.post("/", (req, res) => {
    const a = 3;
    const b = 5;
    const resultado = soma(a + b); 
    res.send("Resultado:" + resultado);
})

function soma (a, b){
    const resultado = a + b;
    return resultado;
}

//CARACTERES ESPECIAIS
// ? é opicional a última letra, no caso aqui seria o E
app.get("/teste?", (req, res) => {
    res.send("/teste?");
});

// + adiciona a última letra quantas vezes quiser 
app.get("/buzz+", (req, res) => {
    res.send("/buzz+");
});

//* vale como qualquer letra
app.get("/one*Blue", (req, res) => {
    res.send(req.path)
});

//Expressões regulares 
app.get(/.*Red$/, (req, res) => {
    res.send("/.*Red$/")
});

//configurando ID's - PARAMETROS NA ROTA
app.get("/testParam/:id/:a?", (req, res) => {
    res.send(req.params.id + " " + req.params.a);
}); 

//parametros via query - para passar vários parametros 
app.get("/testQuery", (req, res) => {
    res.send(req.query); 

});

// () transforma tudo em uma unidade, ou seja, o ? vale pra todo o ING aqui
app.post("/test(ing)?", (req, res) => {
    console.log(req.body);
    res.send("/test(ing)?")
});


//next - para mais de uma rota ao mesmo tempo 

app.get("/testMultipleHandlers", (req, res, next) => {
    console.log("Callback 1"); 
    next(); 
}, (req, res) => {
    console.log("Callback 2");
    res.end(); 
});

//next com array
const callback1 = (req, res, next) => {
     console.log("Callback 1"); 
     next();
 };
 function callback2 (req, res, next) {
    console.log("Callback 2"); 
    next();
 };
 const callback3 = (req, res) => {
    console.log("Callback 3"); 
    res.end(); 
 }

 app.get("/testMultipleHandlersArray", [callback1, callback2, callback3]);

 //routes para CRUD
 app.route("/testRoute")
    .get((req, res) => {
        res.send("GET")
    })
    .post((req, res) => {
        res.send("POST")
    })
    .delete((req,res)=> {
        res.send("DELETE")
    });

//chamando os metódos pra porta 3000 - SEMPRE NO FINAL
app.listen(3000, () => {
    console.log("API Started");
});
