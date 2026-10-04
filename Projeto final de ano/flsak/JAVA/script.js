/* Dados dos jogos, so um exemplo a ideia e colocar eles atraves do jinja  =)*/

/* Depende do fx.js (carregar antes). Dados de exemplo. No Flask dá pra gerar isso com Jinja a partir do banco. */
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

function chips(){
  $("chips").innerHTML=gens.map(g=>`<button class="chip ${g===gen?"on":""}" data-g="${g}">${g}</button>`).join("");
  $("chips").querySelectorAll(".chip").forEach(b=>b.onclick=()=>{gen=b.dataset.g;chips();render()});
}

function render(){
  const q=$("q").value.trim().toLowerCase(),pl=$("plat").value;
  const lista=jogos.filter(j=>(gen==="Todos"||j.g===gen)&&(!pl||j.p.includes(pl))&&j.t.toLowerCase().includes(q));
  $("count").textContent=lista.length+(lista.length===1?" jogo":" jogos");
  $("grid").innerHTML=lista.length?lista.map((j,i)=>`
    <article class="card" style="--i:${i}">
      <div class="cover" style="background-image:linear-gradient(135deg,${j.c[0]},${j.c[1]})">${j.t}
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

function ranking(){
  const top=[...jogos].sort((a,b)=>b.n-a.n).slice(0,5);
  $("rank").innerHTML=top.map((j,i)=>`<li><em>${i+1}º</em>
    <div class="dot" style="background:linear-gradient(135deg,${j.c[0]},${j.c[1]})"></div>
    <a href="/jogos/${j.id}">${j.t}</a><span>${"★".repeat(j.n)} · ${j.g}</span></li>`).join("");
}

/* contadores das estatísticas */
function contar(el){
  const alvo=+el.dataset.count;
  if(calmo){el.textContent=alvo.toLocaleString("pt-BR");return}
  const ini=performance.now(),dur=1400;
  (function f(t){
    const p=Math.min((t-ini)/dur,1);
    el.textContent=Math.round(alvo*(1-Math.pow(1-p,3))).toLocaleString("pt-BR");
    if(p<1)requestAnimationFrame(f);
  })(ini);
}
setTimeout(()=>document.querySelectorAll("[data-count]").forEach(contar),400);

/* seções aparecem ao rolar a página */
const io=new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting){e.target.classList.add("on");io.unobserve(e.target)}
}),{threshold:.15});
document.querySelectorAll(".rv").forEach(el=>io.observe(el));

$("q").oninput=render;$("plat").onchange=render;
chips();render();ranking();

/* menu do celular */
const nav=$("nav"),menu=$("menu");
menu.onclick=()=>{const a=nav.classList.toggle("open");menu.setAttribute("aria-expanded",a)};
nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");menu.setAttribute("aria-expanded","false")}));

/* botão voltar ao topo */
const topo=$("topo");
addEventListener("scroll",()=>topo.classList.toggle("on",scrollY>500),{passive:true});
topo.onclick=()=>scrollTo({top:0,behavior:calmo?"auto":"smooth"});