/*####################### LOGIN #######################*/
//Login de usuários
document.querySelector(".btnLogar").addEventListener("click", function () {
  var email = document.querySelector("#email").value;
  var senha = document.querySelector("#password").value;
  var wrapper;
  //Reverifica se email e senha são válidos!
  if (email.length < 3) {
    //alert("Email Inválido");
    wrapper = document.querySelector(".avisoEmail");
    wrapper.innerHTML = "";
    wrapper.innerHTML = "⚠ Email inválido! (>=3 caracteres)";
    return;
  }
  if (senha.length < 3) {
    //alert("Senha Inválida");
    wrapper = document.querySelector(".avisoPassword");
    wrapper.innerHTML = "";
    wrapper.innerHTML = "⚠ Senha inválida! (>=3 caracteres)";
    return;
  }
  //Verifica se alguem está logado
  if (sessionStorage.getItem("login") == 1 && sessionStorage.getItem("token")) return;

  //console.log(senha);
  //Login
  axios
    .post("https://reqres.in/api/login", {
      email: email,
      password: senha,
    })
    .then(function (response) {
      console.log(response);
      if (response.status == 200) {
        //Salva o email e token de acesso
        loginRealizado(email, response.data.token);
        busca();
      }
    })
    .catch(function (error) {
      //alert("Login não realizado! Verifique os dados de acesso!");
      wrapper = document.querySelector(".avisoEmail");
      wrapper.innerHTML = "";
      wrapper.innerHTML = "⚠ Email inválido! - Login falhou!";
      wrapper = document.querySelector(".avisoPassword");
      wrapper.innerHTML = "";
    });
});

//Verifica se o campo Email tem menos de 3 caracteres - tempo real
document.getElementById("email").addEventListener(
  "keyup",
  (event) => {
    var email = document.querySelector("#email").value;
    var wrapper = document.querySelector(".avisoEmail");
    wrapper.innerHTML = "";
    if (email.length < 3) wrapper.innerHTML = "⚠ Email inválido!";
    else wrapper.innerHTML = "✔ Email válido!";
  },
  false
);

//Verifica se o campo Senha tem menos de 3 caracteres - tempo real
document.getElementById("password").addEventListener(
  "keyup",
  (event) => {
    var senha = document.querySelector("#password").value;
    var wrapper = document.querySelector(".avisoPassword");
    wrapper.innerHTML = "";
    if (senha.length < 3) wrapper.innerHTML = "⚠ Senha inválida!";
    else wrapper.innerHTML = "✔ Senha válida!";
  },
  false
);

// sessionStorage -> Salva Login e Token
function loginRealizado(email, token) {
  //Remove sessão de Login
  var ctr = document.querySelector(".login");
  ctr.className = ctr.className.replace("login", "loginoculto");
  //Adiciona sessão de Logado
  ctr = document.querySelector(".logadooculto");
  ctr.className = ctr.className.replace("logadooculto", "logado");
  ctr = document.querySelector(".caixaLogado");
  ctr.innerHTML = "";
  ctr.innerHTML = "Olá, " + email;
  //Adiciona sessão de Busca
  ctr = document.querySelector(".pesquisaroculto");
  ctr.className = ctr.className.replace("pesquisaroculto", "pesquisar");
  //Salva sessionStorage
  sessionStorage.setItem("login", 1);
  sessionStorage.setItem("email", email);
  sessionStorage.setItem("token", token);
}

//Verifica se existe alguem logado ao iniciar página
function logado() {
  if (sessionStorage.getItem("login") == 1 && sessionStorage.getItem("token")) {
    //Remove sessão de Login
    var ctr = document.querySelector(".login");
    ctr.className = ctr.className.replace("login", "loginoculto");
    //Adiciona sessão de Logado
    ctr = document.querySelector(".logadooculto");
    ctr.className = ctr.className.replace("logadooculto", "logado");
    ctr = document.querySelector(".caixaLogado");
    ctr.innerHTML = "";
    ctr.innerHTML = "Olá, " + sessionStorage.getItem("email");
    ctr = document.querySelector(".pesquisaroculto");
    ctr.className = ctr.className.replace("pesquisaroculto", "pesquisar");
    busca();
  }
}

//Desloga e retorna a página no design de inicio
function deslogou() {
  sessionStorage.clear();
  //Adiciona sessão de Login
  var ctr = document.querySelector(".loginoculto");
  ctr.className = ctr.className.replace("loginoculto", "login");
  //Remove sessão de Logado
  ctr = document.querySelector(".logado");
  ctr.className = ctr.className.replace("logado", "logadooculto");
  ctr = document.querySelector(".caixaLogado");
  ctr.innerHTML = "";
  ctr = document.querySelector(".containerBusca");
  ctr.innerHTML = "";
  //Remove sessão de busca
  ctr = document.querySelector(".pesquisar");
  ctr.className = ctr.className.replace("pesquisar", "pesquisaroculto");
  //Remove email e senha do "formulario"
  ctr = document.querySelector("#email");
  ctr.value = "";
  ctr = document.querySelector("#password");
  ctr.value = "";
  ctr = document.querySelector(".avisoEmail");
  ctr.innerHTML = "";
  ctr = document.querySelector(".avisoPassword");
  ctr.innerHTML = "";
  ctr = document.querySelector("#pesquisa");
  ctr.value = "";
}

//Botão Deslogar
document.querySelector(".btnDeslogar").addEventListener("click", function () {
  deslogou();
});

//Ao iniciar a página, verifica se logou!
logado();

/*####################### BUSCA DE DADOS #######################*/
//Ao carregar - Jogos para plataforma Browser e por data de lançamento
//Uso de CORS
function busca() {
  const options = {
    method: "GET",
    url: "https://free-to-play-games-database.p.rapidapi.com/api/games?platform=browser&sort-by=release-date",
    headers: {
      "x-rapidapi-host": "free-to-play-games-database.p.rapidapi.com",
      "x-rapidapi-key": "d21a46ef36msh3af066e5a56a00ap161d30jsn7eb6d306ef4c",
    },
  };
  axios
    .request(options)
    .then(function (response) {
      var docs = response.data;
      //console.log(docs);
      var container = document.querySelector(".containerBusca");
      //Limpar Container
      container.innerHTML = "";
      //OBSERVAÇÃO: Limitando a 10 no momento: && i < 10
      for (let i = 0; i < docs.length && i < 10; i++) {
        //console.log(docs[i].developer);
        var title = document.createElement("h2");
        title.classList.add("busca");
        title.innerHTML = docs[i].title;
        var desc = document.createElement("span");
        desc.classList.add("desc");
        desc.innerHTML = docs[i].short_description;
        var img = document.createElement("img");
        img.src = docs[i].thumbnail;
        container.appendChild(title);
        container.appendChild(desc);
        container.appendChild(img);
      }
    })
    .catch(function (error) {
      console.error(error);
    });
}

/*####################### BUSCA DE DADOS COM PARÂMETRO: categoria #######################*/
/*
Possiveis categorias: mmorpg, shooter, strategy, moba, racing, sports, social, sandbox, open-world, survival, pvp, pve, pixel, voxel, zombie, turn-based, first-person, third-Person, top-down, tank, space, sailing, side-scroller, superhero, permadeath, card, battle-royale, mmo, mmofps, mmotps, 3d, 2d, anime, fantasy, sci-fi, fighting, action-rpg, action, military, martial-arts, flight, low-spec, tower-defense, horror, mmorts 
O usuário digita a categoria na barra de pesquisa, e a função retorna os resultados equivalentes da API!
*/
document.querySelector(".btnPesquisar").addEventListener("click", function () {
  var container = document.querySelector(".containerBusca");
  container.innerHTML = "";
  categoria = document.querySelector("#pesquisa").value;
  const options = {
    method: "GET",
    url: "https://free-to-play-games-database.p.rapidapi.com/api/games",
    params: { category: categoria },
    headers: {
      "x-rapidapi-host": "free-to-play-games-database.p.rapidapi.com",
      "x-rapidapi-key": "d21a46ef36msh3af066e5a56a00ap161d30jsn7eb6d306ef4c",
    },
  };
  axios
    .request(options)
    .then(function (response) {
      var docs = response.data;
      //console.log(docs);
      var container = document.querySelector(".containerBusca");
      //Limpar Container
      container.innerHTML = "";
      //OBSERVAÇÃO: Limitando a 10 no momento: && i < 10
      for (let i = 0; i < docs.length && i < 10; i++) {
        //console.log(docs[i].developer);
        var title = document.createElement("h2");
        title.classList.add("busca");
        title.innerHTML = docs[i].title;
        var desc = document.createElement("span");
        desc.classList.add("desc");
        desc.innerHTML = docs[i].short_description;
        var img = document.createElement("img");
        img.src = docs[i].thumbnail;
        container.appendChild(title);
        container.appendChild(desc);
        container.appendChild(img);
      }
    })
    .catch(function (error) {
      console.error(error);
    });
});
