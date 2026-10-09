const gens=["Todos",...new Set(jogos.map(j=>j.g))];
let gen="Todos";

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
      <div class="cover" style="background-image:linear-gradient(135deg,${j.c[0]},${j.c[1]})">${esc(j.t)}
        <button class="fav" data-id="${j.id}" aria-pressed="${favs.has(j.id)}" aria-label="Favoritar ${esc(j.t)}">${favs.has(j.id)?"♥":"♡"}</button>
      </div>
      <div class="info">
        <div class="stars" aria-label="Nota ${j.n} de 5">${"★".repeat(j.n)}${"☆".repeat(5-j.n)}</div>
        <div class="meta">${esc(j.g)} · ${esc(j.p.join(", "))}</div>
        <a class="btn" href="./jogo.html?id=${j.id}">Ver detalhes</a>
      </div>
    </article>`).join(""):'<p class="empty">Nenhum jogo encontrado. Tente outro nome, gênero ou plataforma.</p>';
  document.querySelectorAll(".fav").forEach(b=>b.onclick=()=>{
    const id=+b.dataset.id;favs.has(id)?favs.delete(id):favs.add(id);salvarFavs();render();
  });
}

function ranking(){
  const top=[...jogos].sort((a,b)=>b.n-a.n).slice(0,5);
  $("rank").innerHTML=top.map((j,i)=>`<li><em>${i+1}º</em>
    <div class="dot" style="background:linear-gradient(135deg,${j.c[0]},${j.c[1]})"></div>
    <a href="./jogo.html?id=${j.id}">${esc(j.t)}</a><span>${"★".repeat(j.n)} · ${esc(j.g)}</span></li>`).join("");
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

/* botão voltar ao topo */
const topo=$("topo");
addEventListener("scroll",()=>topo.classList.toggle("on",scrollY>500),{passive:true});
topo.onclick=()=>scrollTo({top:0,behavior:calmo?"auto":"smooth"});