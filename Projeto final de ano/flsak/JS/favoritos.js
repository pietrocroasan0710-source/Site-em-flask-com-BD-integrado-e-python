/* Página Favoritos. Depende do fx.js e do dados.js */
function render(){
  const lista=jogos.filter(j=>favs.has(j.id));
  $("count").textContent=lista.length+(lista.length===1?" jogo":" jogos");
  $("grid").innerHTML=lista.length?lista.map(cartao).join(""):
    '<div class="empty"><p>Você ainda não favoritou nenhum jogo.</p><p><a class="btn primary" href="./jogos.html">Explorar jogos</a></p></div>';
  ligarFavs(render);
}
render();
