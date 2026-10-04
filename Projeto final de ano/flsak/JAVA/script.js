/* Dados de exemplo. No Flask da pra gerar eles com o jinja ai e melhor */
const jogos=[
 {id:1,t:"Hollow Orbit",g:"Aventura",p:["PC","Switch"],n:5,c:["#ff5d8f","#6a3de8"]},
 {id:2,t:"Turbo Rally X",g:"Corrida",p:["PC","PlayStation","Xbox"],n:4,c:["#ffc857","#ff5d3a"]},
 {id:3,t:"Mini Farmers",g:"Simulação",p:["Mobile","Switch"],n:4,c:["#3de0d0","#2a7fd4"]},
 {id:4,t:"Crown of Ash",g:"RPG",p:["PC","PlayStation","Xbox"],n:5,c:["#9b5de5","#321d6a"]},
 {id:5,t:"Neon Striker",g:"Ação",p:["PC","Xbox"],n:3,c:["#00f5d4","#9b5de5"]},
 {id:6,t:"Puzzle Tides",g:"Puzzle",p:["Mobile","PC"],n:4,c:["#4cc9f0","#4361ee"]},
 {id:7,t:"Goal Legends",g:"Esporte",p:["PlayStation","Xbox","PC"],n:4,c:["#80ed99","#1b8a5a"]},
 {id:8,t:"Last Signal",g:"Terror",p:["PC","PlayStation"],n:5,c:["#e63946","#2b0a12"]}
];
const gens=["Todos",...new Set(jogos.map(j=>j.g))];
let gen="Todos";const favs=new Set();
const $=id=>document.getElementById(id);

function chips(){
  $("chips").innerHTML=gens.map(g=>`<button class="chip ${g===gen?"on":""}" data-g="${g}">${g}</button>`).join("");
  $("chips").querySelectorAll(".chip").forEach(b=>b.onclick=()=>{gen=b.dataset.g;chips();render()});
}
function render(){
  const q=$("q").value.trim().toLowerCase(),pl=$("plat").value;
  const lista=jogos.filter(j=>(gen==="Todos"||j.g===gen)&&(!pl||j.p.includes(pl))&&j.t.toLowerCase().includes(q));
  $("count").textContent=lista.length+(lista.length===1?" jogo":" jogos");
  $("grid").innerHTML=lista.length?lista.map(j=>`
    <article class="card">
      <div class="cover" style="background:linear-gradient(135deg,${j.c[0]},${j.c[1]})">${j.t}
        <button class="fav" data-id="${j.id}" aria-pressed="${favs.has(j.id)}" aria-label="Favoritar ${j.t}">${favs.has(j.id)?"♥":"♡"}</button>
      </div>
      <div class="info">
        <div class="stars" aria-label="Nota ${j.n} de 5">${"★".repeat(j.n)}${"☆".repeat(5-j.n)}</div>
        <div class="meta">${j.g} · ${j.p.join(", ")}</div>
        <a class="btn" href="/jogos/${j.id}">Ver detalhes</a>
      </div>
    </article>`).join(""):'<p class="empty">Nenhum jogo encontrado. Tente outro nome, gênero ou plataforma.</p>';
  document.querySelectorAll(".fav").forEach(b=>b.onclick=()=>{
    const id=+b.dataset.id;favs.has(id)?favs.delete(id):favs.add(id);render();
  });
}
$("q").oninput=render;$("plat").onchange=render;
chips();render();