/* Página Jogos: busca, gênero, plataforma e ordenação. Depende do fx.js e do dados.js */
const gens=["Todos",...new Set(jogos.map(j=>j.g))];
let gen="Todos";

function chips(){
  $("chips").innerHTML=gens.map(g=>`<button class="chip ${g===gen?"on":""}" data-g="${esc(g)}">${esc(g)}</button>`).join("");
  $("chips").querySelectorAll(".chip").forEach(b=>b.onclick=()=>{gen=b.dataset.g;chips();render()});
}
function render(){
  const q=$("q").value.trim().toLowerCase(),pl=$("plat").value,ord=$("ord").value;
  const lista=jogos.filter(j=>(gen==="Todos"||j.g===gen)&&(!pl||j.p.includes(pl))&&j.t.toLowerCase().includes(q));
  lista.sort(ord==="nome"?(a,b)=>a.t.localeCompare(b.t,"pt-BR"):ord==="novos"?(a,b)=>b.id-a.id:(a,b)=>media(b)-media(a));
  $("count").textContent=lista.length+(lista.length===1?" jogo":" jogos");
  $("grid").innerHTML=lista.length?lista.map(cartao).join(""):'<p class="empty">Nenhum jogo encontrado. Tente outro nome, gênero ou plataforma.</p>';
  ligarFavs(render);
}
$("q").oninput=render;$("plat").onchange=render;$("ord").onchange=render;
chips();render();
