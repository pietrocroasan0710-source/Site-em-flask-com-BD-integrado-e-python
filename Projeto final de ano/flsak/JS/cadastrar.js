/* Página Cadastrar jogo. Depende do fx.js e do dados.js */
const nomeEl=$("titulo"),gen=$("genero"),ano=$("ano"),desc=$("desc"),c1=$("c1"),c2=$("c2");
const plats=()=>[...document.querySelectorAll("#plats input:checked")].map(i=>i.value);
function erro(campo,id,txt){$(id).textContent=txt;campo.classList.toggle("inv",!!txt)}

function previa(){
  $("pcapa").textContent=nomeEl.value.trim()||"Nome do jogo";
  $("pcapa").style.backgroundImage=`linear-gradient(135deg,${c1.value},${c2.value})`;
  const ps=plats();
  $("pmeta").textContent=(gen.value||"Gênero")+" · "+(ps.length?ps.join(", "):"Plataformas");
}
["input","change"].forEach(ev=>$("form").addEventListener(ev,previa));
previa();

$("form").addEventListener("submit",e=>{
  e.preventDefault();
  const nome=nomeEl.value.trim(),y=+ano.value,d=desc.value.trim(),ps=plats();
  const r=[
    [nomeEl,"e-titulo",nome.length<2?"Informe o nome do jogo.":jogos.some(x=>x.t.toLowerCase()===nome.toLowerCase())?"Esse jogo já está no catálogo.":""],
    [gen,"e-genero",gen.value?"":"Escolha um gênero."],
    [$("plats"),"e-plats",ps.length?"":"Marque pelo menos uma plataforma."],
    [ano,"e-ano",y>=1970&&y<=2100?"":"Informe um ano entre 1970 e 2100."],
    [desc,"e-desc",d.length<10?"Escreva pelo menos 10 caracteres.":""]
  ];
  r.forEach(([c,id,m])=>erro(c,id,m));
  const falha=r.find(x=>x[2]);
  if(falha){(falha[0].id==="plats"?falha[0].querySelector("input"):falha[0]).focus();return}
  const novo={id:Math.max(...jogos.map(x=>x.id))+1,t:nome,g:gen.value,p:ps,n:0,a:y,c:[c1.value,c2.value],d};
  if(!gravar("ps_jogos",[...ler("ps_jogos",[]),novo])){
    $("aviso").textContent="Não foi possível salvar: o navegador bloqueou o armazenamento local.";$("aviso").hidden=false;return;
  }
  location.href="./jogo.html?id="+novo.id;
});
