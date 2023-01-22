let meuNome;
let mensagens, mensagensFiltradas;
let chat = document.querySelector(".main");
let telaEntrada = document.querySelector(".telaEntrada");
let telaChat = document.querySelector(".fundo");

chat.innerHTML = "";

function entrarSala(){
    meuNome = document. querySelector(".insereNome"). value;
    if (meuNome === ""){
        location.reload();
    }

    telaEntrada.innerHTML = `<img class="logoEntrada" src="./imagens/logo 2.png" alt="logo">;
        <img class="carregando" src="./imagens/carregando.gif" alt="carregando">
        <p class="entrando">Entrando...</p>`;

    const usuario = { name: meuNome }; //rótulo e variável

    const promessaUsuario = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants",usuario);

    promessaUsuario.then(response => {buscarMensagem()
        setInterval(buscarMensagem, 3000);
        setInterval(manterConexao, 5000);
        telaEntrada.classList.add("escondido");
        telaChat.classList.remove("escondido");
    });

    promessaUsuario.catch(erro => {if (erro.request.status === 400){
        alert("Este usuário já está sendo utilizado");
        location.reload();
       }
    });


}

function manterConexao(){
    const usuario = { name: meuNome }; //rótulo e variável

    const promessaUsuario = axios.post("https://mock-api.driven.com.br/api/v6/uol/status",usuario);

    promessaUsuario.catch(erro => location.reload());
}

function buscarMensagem(){
    

    const promessaBuscaMensagem = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');

    promessaBuscaMensagem.then(response => {mensagens = response.data
        //console.log(mensagens);
        mensagensFiltradas = mensagens.filter(filtroMensagens);
        //console.log(mensagensFiltradas);
        chat.innerHTML = "";
        mensagensFiltradas.forEach(exibirNaTela);
    });

}

function filtroMensagens(mensagens){
    if (mensagens.type ==="status" || mensagens.type ==="message" || mensagens.from === meuNome  || mensagens.to === meuNome ){
        return true;
    }
}

function exibirNaTela(mensagensFiltradas){
    if (mensagensFiltradas.type === 'status'){
        chat.innerHTML += `<div class="acessoNaSala" data-test="message">
        <div>
        <span class="hora">(${mensagensFiltradas.time})</span>
        <span class="nome">${mensagensFiltradas.from}</span>
        <span class="mensagem">${mensagensFiltradas.text}</span>
        </div>
        </div>`;
        exibirPorUltimo();
    } else if (mensagensFiltradas.type === 'message'){
        chat.innerHTML += `<div class="mensagemComum" data-test="message">
        <div>
        <span class="hora">(${mensagensFiltradas.time})</span>
        <span class="nome">${mensagensFiltradas.from}</span>
        <span class="mensagem">para</span>
        <span class="nome">Todos:</span>
        <span class="mensagem">${mensagensFiltradas.text}</span>
        </div>
        </div>`;
        exibirPorUltimo();
    } else if (mensagensFiltradas.type === 'private-message'){
        chat.innerHTML += `<div class="mensagemPrivada" data-test="message">
        <div >
        <span class="hora">(${mensagensFiltradas.time})</span>
        <span class="nome">${mensagensFiltradas.from}</span>
        <span class="mensagem">reservadamente para</span>
        <span class="nome">M${mensagensFiltradas.to}:</span>
        <span class="mensagem">${mensagensFiltradas.text}</span>
        </div>
        </div>`;
        exibirPorUltimo();
    }
}

function exibirPorUltimo(){
    var ultimoElemento  = chat.lastChild;
    ultimoElemento.scrollIntoView();
}

document.addEventListener('keypress', function(e){
    if(e.which == 13){
        enviarMensagem();
    }
});

function enviarMensagem(){
    const texto = document. querySelector(".insereMensagem"). value;

    const mensagemNova = { from: meuNome, to: "Todos", text: texto, type: "message" };
    // ou usuario selecionado para o bônus ou "private_message" para o bônus
    console. log(texto);
    console. log(mensagemNova);

    const promessaEnvioMensagem = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages",mensagemNova);

    promessaEnvioMensagem.then(response => {buscarMensagem();
        document. querySelector(".insereMensagem"). value="";});

    promessaEnvioMensagem.catch(erro => location.reload());
}
