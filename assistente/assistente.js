const lista_palavras_pesquisa =
  ['pesquise', 'pesquisar', 'procure', 'procurar', 'buscar', 'busque'];
const lista_palavras_finalizar =
  ['finalizar', 'encerrar', 'parar', 'pare', 'encerre', 'finalize']
const lista_palavras_limpar =
  ['limpar', 'limpe', 'apagar', 'apague', 'corrija', 'corrigir']

let resposta = ''
let resposta_temporaria = ''

function mudar_botao() {

  if (document.getElementById("botao").textContent.trim() === 'OUVINDO') {
    document.getElementById("botao").textContent = 'FALAR'
  } else {
    document.getElementById("botao").textContent = 'OUVINDO'
    ouvir()
  }
}

function ouvir() {
  // Verifica se o navegador suporta a API Web Speech Recognition
  if ('webkitSpeechRecognition' in window) {

    // Cria uma nova instância do objeto SpeechRecognition
    let recognition = new window.webkitSpeechRecognition();

    // Configura o reconhecedor para continuar ouvindo até mesmo em pausas
    recognition.continuous = true;

    // Configura o reconhecedor para transcrever a fala em texto
    recognition.interimResults = true;

    // Define o idioma que será reconhecido (nesse caso, português do Brasil)
    recognition.lang = "pt-BR";

    //Ao finalizar gravação finalizo o recognition
    recognition.onend = function () {
      if (resposta !== '') {
        pesquisar(resposta);
        resposta = ''
      }
      mudar_botao();
      console.log('finalizou gravação')
    }

    recognition.onerror = function (event) {
      console.log(event.error);
    };

    // Cria uma função para lidar com os resultados do reconhecimento de fala
    recognition.onresult = function (event) {
      // Defino a minha variavel resposta como vazia
      var resultado = '';
      resposta_temporaria = ''

      // Utilizo o for para contatenar os resultados da transcrição 
      for (var i = event.resultIndex; i < event.results.length; i++) {
        // verifico se o parametro isFinal esta setado como true com isso identico se é o final captura
        if (event.results[i].isFinal) {
          // Contateno o resultado final da transcrição
          resposta += event.results[i][0].transcript;
          resposta_temporaria = event.results[i][0].transcript
        } else {
          // caso ainda não seja o resultado final vou contatenado os resultados obtidos
          resultado += event.results[i][0].transcript;
        }

        // Verifico qual das variaveis não esta vazia e atribuo ela no variavel result
        var result = resposta || resultado;

        if (verificar_palavra(resposta_temporaria, 'FINALIZAR')) {
          //caso a palavra que o usuário fale seja finalizar ou derivada, ele para de gravar
          resposta = '';
          result = resposta;
          recognition.stop();
        } else if (verificar_palavra(resposta_temporaria, 'LIMPAR')) {
          //caso a palavra que o usuário fale seja 'limpar' ou derivada ele apaga o que foi falado
          resposta = '';
          result = resposta;
        } else if (verificar_palavra(resposta_temporaria, 'PESQUISAR')) {
          // caso a palavra seja pesquisar ou derivada ele realiza a pesquisa da resposta
          pesquisar(resposta);
          resposta = '';
          result = resposta;
        }

        document.getElementById("texto-falado").textContent = result
      };

    }
    //inicia a gravação
    recognition.start();
  }

  //verifica se a resposta temporária tem alguma relação com finalizar, pesquisar ou limpar
  // se sim retorna true, senão false
  function verificar_palavra(palavra, tipo) {

    condicao = false
    palavra = palavra.toLowerCase()

    if (palavra.trim() !== '') {

      lista = []

      if (tipo === 'FINALIZAR') {
        lista = lista_palavras_finalizar
      } else if (tipo === 'LIMPAR') {
        lista = lista_palavras_limpar
      } else if (tipo === 'PESQUISAR') {
        lista = lista_palavras_pesquisa
      }

      lista.forEach(palavra_escolhida => {
        if (palavra.includes(palavra_escolhida)) {
          condicao = true;
        }
      });
    }

    return condicao;
  }

  function pesquisar(texto_de_pesquisa) {

    //substitui os espaços vazios por '+' na string de busca
    texto_de_pesquisa = texto_de_pesquisa.trim().replace(/ /g, '+').toLowerCase();

    texto_de_pesquisa = "http://www.google.com/search?q=" + texto_de_pesquisa;
    console.log(texto_de_pesquisa)
    window.open(texto_de_pesquisa)

  }
}
