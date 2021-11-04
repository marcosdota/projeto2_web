/*####################### LOGIN #######################*/
//Login de usuários
document.querySelector(".btnLogar").addEventListener("click", function () {
    var email = document.querySelector("#email").value;
    var senha = document.querySelector("#password").value;
    var wrapper;
    //Reverifica se email e senha são válidos!
    if (email.length < 3) {
        alert("Email Inválido")
        wrapper = document.querySelector(".campoEmail");
        wrapper.innerHTML = "";
        wrapper.innerHTML = "Email inválido!";
        return;
    }
    if (senha.length < 3) {
        alert("Senha Inválida")
        wrapper = document.querySelector(".campoPassword");
        wrapper.innerHTML = "";
        wrapper.innerHTML = "Senha inválida!";
        return;
    }
    //Verifica se alguem está logado
    if (sessionStorage.getItem("login") == 1)
        return;

    console.log(senha);
    //Login
    axios.post('https://reqres.in/api/login', {
        "email": email,
        "password": senha
    })
        .then(function (response) {
            console.log(response);
            if (response.status == 200) {
                loginRealizado(email);
                busca();
            }

        })
        .catch(function (error) {
            alert("Login não realizado! Verifique os dados de acesso!");
        });
});

//Verifica se o campo Email tem menos de 3 caracteres
document.getElementById("email").addEventListener('keyup', (event) => {
    var email = document.querySelector("#email").value;
    var wrapper = document.querySelector(".campoEmail");
    wrapper.innerHTML = "";
    if (email.length < 3)
        wrapper.innerHTML = "Email inválido!";
    else
        wrapper.innerHTML = "Email válido!";
}, false);

//Verifica se o campo Senha tem menos de 3 caracteres
document.getElementById("password").addEventListener('keyup', (event) => {
    var senha = document.querySelector("#password").value;
    var wrapper = document.querySelector(".campoPassword");
    wrapper.innerHTML = "";
    if (senha.length < 3)
        wrapper.innerHTML = "Senha inválida!";
    else
        wrapper.innerHTML = "Senha válida!";
}, false);

// sessionStorage -> Salva Login
function loginRealizado(email) {
    //Remove sessão de Login
    var ctr = document.querySelector('.login');
    ctr.className = ctr.className.replace('login', 'loginoculto');
    //Adiciona sessão de Logado
    ctr = document.querySelector('.logadooculto');
    ctr.className = ctr.className.replace('logadooculto', 'logado');
    ctr = document.querySelector(".caixaLogado");
    ctr.innerHTML = "";
    ctr.innerHTML = "Olá, " + email;
    //Salva sessionStorage
    sessionStorage.setItem("login", 1);
    sessionStorage.setItem("email", email);
}

//Verifica se existe alguem logado ao iniciar página
function logado() {
    if (sessionStorage.getItem("login") == 1) {
        //Remove sessão de Login
        var ctr = document.querySelector('.login');
        ctr.className = ctr.className.replace('login', 'loginoculto');
        //Adiciona sessão de Logado
        ctr = document.querySelector('.logadooculto');
        ctr.className = ctr.className.replace('logadooculto', 'logado');
        ctr = document.querySelector(".caixaLogado");
        ctr.innerHTML = "";
        ctr.innerHTML = "Olá, " + sessionStorage.getItem("email");
        busca();
    }
}

//Desloga e retorna a página no modelo de inicio
function deslogou() {
    sessionStorage.clear();
    //Adiciona sessão de Login
    var ctr = document.querySelector('.loginoculto');
    ctr.className = ctr.className.replace('loginoculto', 'login');
    //Remove sessão de Logado
    ctr = document.querySelector('.logado');
    ctr.className = ctr.className.replace('logado', 'logadooculto');
    ctr = document.querySelector(".caixaLogado");
    ctr.innerHTML = "";
    ctr = document.querySelector(".containerBusca");
    ctr.innerHTML = "";
}

//Botão Deslogar
document.querySelector(".btnDeslogar").addEventListener("click", function () {
    deslogou();
});

logado();

/*####################### BUSCA DE DADOS #######################*/
//Ao carregar - Jogos para plataforma Browser e por data de lançamento
//Uso de CORS 
function busca() {
    const options = {
        method: 'GET',
        url: 'https://free-to-play-games-database.p.rapidapi.com/api/games?platform=browser&sort-by=release-date',
        headers: {
            'x-rapidapi-host': 'free-to-play-games-database.p.rapidapi.com',
            'x-rapidapi-key': 'd21a46ef36msh3af066e5a56a00ap161d30jsn7eb6d306ef4c'
        }
    };
    axios.request(options).then(function (response) {
        var docs = response.data;
        console.log(docs);
        var container = document.querySelector(".containerBusca");
        //Limpar Container
        container.innerHTML = "";
        //OBSERVAÇÃO: Limitando a 10 no momento: && i < 10
        for (let i = 0; i < docs.length && i < 10; i++) {
            //console.log(docs[i].developer);
            var div = document.createElement("div");
            div.classList.add('busca');
            div.innerHTML = docs[i].title;
            var img = document.createElement("img");
            img.src = docs[i].thumbnail;
            container.appendChild(div);
            container.appendChild(img);
        }
    }).catch(function (error) {
        console.error(error);
    });
}


/*
Possiveis categorias: mmorpg, shooter, strategy, moba, racing, sports, social, sandbox, open-world, survival, pvp, pve, pixel, voxel, zombie, turn-based, first-person, third-Person, top-down, tank, space, sailing, side-scroller, superhero, permadeath, card, battle-royale, mmo, mmofps, mmotps, 3d, 2d, anime, fantasy, sci-fi, fighting, action-rpg, action, military, martial-arts, flight, low-spec, tower-defense, horror, mmorts 
*/
document.querySelector(".btnPesquisar").addEventListener("click", function () {
    var container = document.querySelector(".containerBusca");
    container.innerHTML = "";
    categoria = document.querySelector("#pesquisa").value;;
    const options = {
        method: 'GET',
        url: 'https://free-to-play-games-database.p.rapidapi.com/api/games',
        params: { category: categoria },
        headers: {
            'x-rapidapi-host': 'free-to-play-games-database.p.rapidapi.com',
            'x-rapidapi-key': 'd21a46ef36msh3af066e5a56a00ap161d30jsn7eb6d306ef4c'
        }
    };
    axios.request(options).then(function (response) {
        var docs = response.data;
        console.log(docs);
        var container = document.querySelector(".containerBusca");
        //Limpar Container
        container.innerHTML = "";
        //OBSERVAÇÃO: Limitando a 10 no momento: && i < 10
        for (let i = 0; i < docs.length && i < 10; i++) {
            //console.log(docs[i].developer);
            var div = document.createElement("div");
            div.classList.add('busca');
            div.innerHTML = docs[i].title;
            var img = document.createElement("img");
            img.src = docs[i].thumbnail;
            container.appendChild(div);
            container.appendChild(img);
        }
    }).catch(function (error) {
        console.error(error);
    });
});