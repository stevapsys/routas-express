//importanto express e chamando ele
import express from "express"; 
//important o winston pra criar os logs de erros
import winston from "winston";

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

//tratamento de erros

//para funções assincronas tem que usar o try catch 
    app.post("/erro", async (req, res, next) => {
        try {
            throw new Error ("Error message async")
        } catch (err) {
            next()
        }
    });

    app.get("/erro",(req, res) => {
        //simulando um erro
        throw new Error ("Error message test")
    });

    //colocar sempre no final pra pegar todas as requesições
    app.use((err, req, res, next) => {
        console.log("Error 1");
        next(err); 
    });
    app.use((err, req, res, next) => {
        console.log("Error 2");
        next(); 
        res.status(500).send("Ocorreu um erro, tente novamente mais tarde")
    });
       
//usando o winston pra checar os logs

const {combine, printf, label, timestamp} = winston.format; 
const myFormat = printf(({level, message, label, timestamp}) => {
    return `${timestamp} [${label}] ${level} : ${message}`
})

//crindo o logger
const logger = winston.createLogger({
    //nivel do erro. o Silly é o último 
    level: "silly",
    transports: [
        //para mostrar no console 
        new(winston.transports.Console)(),
        //para criar um arquvio
        new(winston.transports.File)({filename: "my-log.log"}),
    ],
    //formato que vai mostrar o erro
    format: combine(
        label({label: "my-app"}),
        timestamp(),
        myFormat
    )
}); 

//chamando os logs
logger.error("Error log");
logger.warn("Warn log");
logger.verbose("Verbose log");
logger.debug("Debug");
logger.silly("Silly log"); 

logger.log("info", "Hello with parameter!"); 

//servido arquivos estáticos
app.use(express.static("public")); 

app.use("/images", express.static("public"));

//chamando os metódos pra porta 3000 - SEMPRE NO FINAL
app.listen(3000, () => {
    console.log("API Started");
});
