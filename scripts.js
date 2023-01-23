let meuNome;
let texto;
let tipo = "Público";
let destinatario ="Todos";
let mensagens, mensagensFiltradas, participantes;
let chat = document.querySelector(".main");
const telaEntrada = document.querySelector(".telaEntrada");
const telaChat = document.querySelector(".fundo");
const telaParticipantes = document.querySelector(".telaParticipantes");
const listaParticipantes = document.querySelector(".contato");
const alteraFooter = document.querySelector(".enviarMensagem");
const divParticipante = document.querySelector(".opcao");
const PrivOuPub = document.querySelector(".visibilidade");
const tempoMensagem = 3000;
const tempoConexao = 5000;
const tempoParticipantes = 10000;
const erroUserRepetido = 400;

chat.innerHTML = "";

function entrarSala(){
    meuNome = document. querySelector(".insereNome"). value;
    if (meuNome === ""){
        location.reload();
    }

    telaEntrada.innerHTML = `<img class="logoEntrada" src="./imagens/logo 2.png" alt="logo">;
        <img class="carregando" src="./imagens/carregando.gif" alt="carregando">
        <p class="entrando">Entrando...</p>`;

    const usuario = { name: meuNome };

    const promessaUsuario = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants",usuario);

    promessaUsuario.then(respostaEntrada);

    promessaUsuario.catch(respontaEntradaErro);
}

function respostaEntrada() {
	buscarMensagem();
    buscarParticipantes();
    setInterval(buscarMensagem, tempoMensagem);
    setInterval(manterConexao, tempoConexao);
    setInterval(buscarParticipantes, tempoParticipantes);
    telaEntrada.classList.add("escondido");
    telaChat.classList.remove("escondido");
}

function respontaEntradaErro(erro){
    if (erro.request.status === erroUserRepetido){
        alert("Este usuário já está sendo utilizado");
        location.reload();
    }
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
        <span class="nome">${mensagensFiltradas.to}</span>
        <span class="mensagem">${mensagensFiltradas.text}</span>
        </div>
        </div>`;
        exibirPorUltimo();
    } else if (mensagensFiltradas.type === 'private_message'){
        chat.innerHTML += `<div class="mensagemPrivada" data-test="message">
        <div >
        <span class="hora">(${mensagensFiltradas.time})</span>
        <span class="nome">${mensagensFiltradas.from}</span>
        <span class="mensagem">reservadamente para</span>
        <span class="nome">${mensagensFiltradas.to}:</span>
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
    if(e.key === 'Enter'){
        enviarMensagem();
    }
});

function enviarMensagem(){
    texto = document. querySelector(".insereMensagem"). value;
    if (texto !== ""){
    let mensagemNova;
    if (destinatario === "Todos"){
        mensagemNova = { from: meuNome, to: "Todos", text: texto, type: "message" };
    } else if (destinatario !== "Todos" && tipo === "Reservadamente"){ //destinatario especifico e reservado
        mensagemNova = { from: meuNome, to: destinatario, text: texto, type: "private_message" };
    } else{ //destinatario especifico mas público
        mensagemNova = { from: meuNome, to: destinatario, text: texto, type: "message" };
    }
    console. log(texto);
    console. log(mensagemNova);

    const promessaEnvioMensagem = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages",mensagemNova);

    promessaEnvioMensagem.then(response => {
        buscarMensagem();
        document. querySelector(".insereMensagem"). value="";
    });

    promessaEnvioMensagem.catch(erro => console.log(erro));//location.reload());
    }
}

function exibirParticipantes(){
    telaParticipantes.classList.remove("escondido");
};

function escondeParticipantes(){
    telaParticipantes.classList.add("escondido");
};

function buscarParticipantes(){
    

    const promessaBuscaMensagem = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');

    promessaBuscaMensagem.then(response => {
        participantes = response.data;
        listaParticipantes.innerHTML = `
            <p class="titulo">Escolha um contato para enviar mensagem:</p>
            <div class="opcao participantes" data-test="all" onclick="selecionaParticipante(this)">
                <div class="iconeVisibilidade" data-test="all" >
                    <ion-icon name="people"></ion-icon>
                </div>
                <p>Todos</p>
                <div class="iconeCkeck escondido">
                    <ion-icon name="checkmark-sharp" data-test="check"></ion-icon>
                </div>
            </div>`;
        participantes.forEach(exibirParticipantesTela);
    });

}

function exibirParticipantesTela(participantes){
    listaParticipantes.innerHTML += `
    <div class="opcao" data-test="participant" onclick="selecionaParticipante(this)">
        <div class="iconeVisibilidade" data-test="participant">
            <ion-icon name="person-circle"></ion-icon>
        </div>
        <p>${participantes.name}</p>
        <div class="iconeCkeck escondido">
                <ion-icon name="checkmark-sharp" data-test="check"></ion-icon>
        </div>
    </div>`;
}

function selecionaParticipante(destinatarioSelecionado){
    const selecionadoAnt = listaParticipantes.querySelector(".selecionado");
    const novoIcone = destinatarioSelecionado.querySelector(".iconeCkeck");

    if (selecionadoAnt !== null){
        selecionadoAnt.classList.remove("selecionado");
        selecionadoAnt.classList.add("escondido");
    }
    novoIcone.classList.add("selecionado");
    novoIcone.classList.remove("escondido");
    
    const destinatarioSel = (destinatarioSelecionado.querySelector("p")).innerHTML;
    destinatario = destinatarioSel;
    console.log(destinatario);
    if(destinatario==="Todos"){
        const selecionaPublico = document.querySelector(".publico");
        selecionaVisibilidade(selecionaPublico);
    }

    alterarFooter();
}

function selecionaVisibilidade(tipoDeVisibilidade){
    const selecionadoAnt = PrivOuPub.querySelector(".selecionado");
    const novoIcone = tipoDeVisibilidade.querySelector(".iconeCkeck");

    if (selecionadoAnt !== null){
        selecionadoAnt.classList.remove("selecionado");
        selecionadoAnt.classList.add("escondido");
    }
    novoIcone.classList.add("selecionado");
    novoIcone.classList.remove("escondido");
    
    const tipoSel = (tipoDeVisibilidade.querySelector("p")).innerHTML;
    tipo = tipoSel;
    console.log(tipo);
    alterarFooter();
}

function alterarFooter(){
    const mensagemFooter = alteraFooter.querySelector("p");
    if (destinatario === "Todos"){
        mensagemFooter.innerHTML = `Enviando para Todos`;
    } else if (tipo === "Público" || tipo ===""){
        mensagemFooter.innerHTML = "Enviando para " + destinatario;
    } else if (tipo === "Reservadamente") {
        mensagemFooter.innerHTML = "Enviando para " + destinatario + " (reservadamente)";
    };
}
