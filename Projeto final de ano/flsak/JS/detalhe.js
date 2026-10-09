/* Página de detalhes: lê ?id= da URL. Depende do fx.js e do dados.js */
const j=jogos.find(x=>x.id===+new URLSearchParams(location.search).get("id"));

function resumo(){
  const m=media(j),total=avaliacoes(j.id).length+(j.n?1:0);
  $("media").textContent=total?m.toFixed(1):"–";
  $("estrelas").textContent=estrelas(m);
  $("total").textContent=total?total+(total===1?" avaliação":" avaliações"):"Sem avaliações";
}
function lista(){
  const av=avaliacoes(j.id).slice().reverse();
  $("lista").innerHTML=av.length?av.map(x=>`<div class="coment">
    <div class="linha-c"><b>${esc(x.u)}</b><span class="stars">${estrelas(x.n)}</span><small>${esc(x.d)}</small></div>
    <p>${esc(x.t)}</p></div>`).join(""):'<p class="empty">Ainda não há avaliações. Seja a primeira pessoa a avaliar.</p>';
}
function botaoFav(){
  const on=favs.has(j.id);
  $("fav").textContent=on?"♥ Nos favoritos":"♡ Favoritar";
  $("fav").setAttribute("aria-pressed",on);
}
function erro(campo,id,txt){$(id).textContent=txt;campo.classList.toggle("inv",!!txt)}

if(!j){
  $("vazio").hidden=false;
}else{
  document.title=j.t+" — PixelShelf";
  $("detalhe").hidden=false;$("avals").hidden=false;
  $("capa").textContent=j.t;
  $("capa").style.backgroundImage=`linear-gradient(135deg,${j.c[0]},${j.c[1]})`;
  $("titulo").textContent=j.t;
  $("tags").innerHTML=[j.g,...j.p,j.a].map(t=>`<span class="tag">${esc(t)}</span>`).join("");
  $("desc").textContent=j.d;
  resumo();lista();botaoFav();
  $("fav").onclick=()=>{favs.has(j.id)?favs.delete(j.id):favs.add(j.id);salvarFavs();botaoFav()};

  $("form").addEventListener("submit",e=>{
    e.preventDefault();
    const nome=$("nome"),texto=$("texto"),nota=document.querySelector("#notas input:checked");
    const r=[[nome,"e-nome",nome.value.trim().length<2?"Informe seu nome.":""],
             [$("notas"),"e-nota",nota?"":"Escolha uma nota de 1 a 5."],
             [texto,"e-texto",texto.value.trim().length<5?"Escreva pelo menos 5 caracteres.":""]];
    r.forEach(([c,id,m])=>erro(c,id,m));
    const falha=r.find(x=>x[2]);
    if(falha){(falha[0].id==="notas"?document.querySelector("#notas input"):falha[0]).focus();return}
    const todas=ler("ps_aval",{});
    (todas[j.id]=todas[j.id]||[]).push({u:nome.value.trim(),n:+nota.value,t:texto.value.trim(),d:new Date().toLocaleDateString("pt-BR")});
    if(!gravar("ps_aval",todas)){$("aviso").textContent="Não foi possível salvar: o navegador bloqueou o armazenamento local.";$("aviso").hidden=false;return}
    $("form").reset();resumo();lista();
  });
}
