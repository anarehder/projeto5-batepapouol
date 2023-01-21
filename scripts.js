// <div data-test="message" class="mensagem entrou">
// <span class="hora">(${chat[i].time}) </span><span class="nome"> ${chat[i].from} </span>${chat[i].text}
// </div>`

let meuNome;
let mensagens, mensagensFiltradas;
let chat = document.querySelector(".main");

chat.innerHTML = "";

perguntarNome(); // já busco as mensagens imediatamente se a resposta for ok!

setInterval(manterConexao, 5000);

setInterval(buscarMensagem, 3000);

function perguntarNome(){
    meuNome = prompt("Qual seu nome?");

    const usuario = { name: meuNome }; //rótulo e variável

    const promessaUsuario = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants",usuario);

    promessaUsuario.then(response => { console.log(response.status)
        buscarMensagem();});

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
        <span class="hora">(09:22:48)</span>
        <span class="nome">João</span>
        <span class="mensagem">reservadamente para</span>
        <span class="nome">Maria:</span>
        <span class="mensagem">Oi gatinha quer tc?</span>
        </div>
        </div>`;
        exibirPorUltimo();
    }
}

function exibirPorUltimo(){
    var ultimoElemento  = chat.lastChild;
    ultimoElemento.scrollIntoView();
}