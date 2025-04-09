// Declaração de constantes e importação das dependências necessárias

const mysql = require('mysql2'); // Biblioteca para conexão com o banco de dados MySQL
const express = require('express'); // Framework web para Node.js
const bodyParser = require('body-parser'); // Middleware para análise de corpos de requisição


// Criação de uma instância do Express
const app = express();

app.use(express.static('public'));

// Configuração da conexão com o banco de dados MySQL
const connection = mysql.createConnection({
    host: 'localhost', // Endereço do banco de dados
    user: 'root', // Nome de usuário
    password: 'root', // Senha
    database: 'agencia_viagens', // Nome do banco de dados
    port:3306 // Porta do banco de dados
});


// Estabelece a conexão com o banco de dados e emite uma mensagem indicando seu status
connection.connect(function(err){
    if(err){
        console.error('Erro ', err);
    return
    }
        console.log("Conexão ok");
    });


// Middleware para análise de corpos de requisição
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())



// Rota para a página default
app.get("/", function(req, res){
res.sendFile(__dirname + "/index.html")
});



    //rota para cadastrar uma viagem
app.post('/cadastrar', function (req,res){

    //captura e armazenamento dos campos do formulário html
    const destino = req.body.destino;
    const data_viagem = req.body.data_viagem;
    const preco = req.body.preco;
    const vagas = req.body.vagas;
    const values = [destino, data_viagem, preco, vagas];
    const insert = "INSERT INTO viagens (destino, data_viagem, preco, vagas) VALUES (?,?,?,?)"

    connection.query(insert, values, function(err, result){
        if(!err){
            console.log("Viagem cadastrada com sucesso!");
            res.redirect('/listar');

        }else{
            console.log("Não foi possível cadastrar a viagem ", err);
            res.send("Erro!")
        }
    });
});

app.get('/listar', function(req,res){
    const listar = "SELECT * FROM viagens";
 
    connection.query(listar, function(err, rows){
        if(!err){
            console.log("Consulta realizada com sucesso!");
            res.send(`
                <html>
                <head>
                <title> Relatório de viagens  </title>
                </head>
                <body>

                    <h1>Relatório de viagens</h1>
 
                    <table>
                        <tr>
                            <th> Código </th>
                            <th> Destino </th>
                            <th> Data da Viagem </th>
                            <th> Valor </th>
                            <th> Vagas </th>
                        </tr>
                        ${rows.map(row => `
                            <tr>
                                <td>${row.id}</td>
                                <td>${row.destino}</td>
                                <td>${row.data_viagem}</td>
                                <td>${row.preco}</td>
                                <td>${row.vagas}</td>
                            </tr>
                        `).join('')}
                    </table>
                    <a href="/"> Voltar </a>
                </body>
                </html>
                `);
        } else {
            console.log("Erro no relatório de viagens ", err);
            res.send("Erro")
        }
    });
});

// Inicia o servidor na porta 3000

app.listen(3000, function(){ console.log("Servidor rodando na url http://localhost:3000")
});