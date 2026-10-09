/* dados.js — jogos de exemplo + armazenamento no navegador (localStorage).
   Quando o Flask estiver pronto, tudo isto vem do banco de dados. Depende do fx.js. */
function ler(k,def){try{const v=JSON.parse(localStorage.getItem(k));return v==null?def:v}catch(e){return def}}
function gravar(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){return false}}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

const jogos=[
 {id:1,t:"Hollow Orbit",g:"Aventura",p:["PC","Switch"],n:5,a:2024,c:["#ff5d8f","#6a3de8"],d:"Explore uma estação espacial abandonada, resolva enigmas de gravidade e descubra por que ninguém voltou de lá."},
 {id:2,t:"Turbo Rally X",g:"Corrida",p:["PC","PlayStation","Xbox"],n:4,a:2023,c:["#ffc857","#ff5d3a"],d:"Corridas arcade em pistas curtas e cheias de atalhos, com rivais que não perdoam erros."},
 {id:3,t:"Mini Farmers",g:"Simulação",p:["Mobile","Switch"],n:4,a:2022,c:["#3de0d0","#2a7fd4"],d:"Plante, colha e venda: uma fazenda pequena para jogar em partidas rápidas."},
 {id:4,t:"Crown of Ash",g:"RPG",p:["PC","PlayStation","Xbox"],n:5,a:2025,c:["#9b5de5","#321d6a"],d:"Um reino em ruínas, uma coroa amaldiçoada e escolhas que mudam quem sobrevive."},
 {id:5,t:"Neon Striker",g:"Ação",p:["PC","Xbox"],n:3,a:2023,c:["#00f5d4","#9b5de5"],d:"Tiroteio rápido em arenas de neon, com combos que recompensam quem não para de se mover."},
 {id:6,t:"Puzzle Tides",g:"Puzzle",p:["Mobile","PC"],n:4,a:2021,c:["#4cc9f0","#4361ee"],d:"Mova as marés para abrir caminhos em quebra-cabeças que ficam mais difíceis a cada fase."},
 {id:7,t:"Goal Legends",g:"Esporte",p:["PlayStation","Xbox","PC"],n:4,a:2024,c:["#80ed99","#1b8a5a"],d:"Futebol com partidas curtas, times personalizáveis e campeonatos online."},
 {id:8,t:"Last Signal",g:"Terror",p:["PC","PlayStation"],n:5,a:2022,c:["#e63946","#2b0a12"],d:"Um rádio, uma estação isolada e algo que responde quando você não deveria ouvir."},
 ...ler("ps_jogos",[])   /* jogos cadastrados pela página "Cadastrar jogo" */
];

const favs=new Set(ler("ps_favs",[]));
const salvarFavs=()=>gravar("ps_favs",[...favs]);
const avaliacoes=id=>(ler("ps_aval",{})[id]||[]);
function media(j){const v=[...(j.n?[j.n]:[]),...avaliacoes(j.id).map(x=>x.n)];return v.length?v.reduce((s,x)=>s+x,0)/v.length:0}
const estrelas=n=>"★".repeat(Math.round(n))+"☆".repeat(5-Math.round(n));

function cartao(j,i){
  const m=media(j);
  return `<article class="card" style="--i:${i}">
    <div class="cover" style="background-image:linear-gradient(135deg,${j.c[0]},${j.c[1]})">${esc(j.t)}
      <button class="fav" data-id="${j.id}" aria-pressed="${favs.has(j.id)}" aria-label="Favoritar ${esc(j.t)}">${favs.has(j.id)?"♥":"♡"}</button>
    </div>
    <div class="info">
      <div class="stars" aria-label="Nota ${m.toFixed(1)} de 5">${estrelas(m)}</div>
      <div class="meta">${esc(j.g)} · ${esc(j.p.join(", "))}</div>
      <a class="btn" href="./jogo.html?id=${j.id}">Ver detalhes</a>
    </div>
  </article>`;
}
function ligarFavs(depois){
  document.querySelectorAll(".fav").forEach(b=>b.onclick=()=>{
    const id=+b.dataset.id;favs.has(id)?favs.delete(id):favs.add(id);salvarFavs();depois();
  });
}
