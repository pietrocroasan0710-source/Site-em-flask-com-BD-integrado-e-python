/* Validação do formulário de login (o Flask deve validar de novo no servidor). Depende do fx.js. */
const form=$("form"),email=$("email"),senha=$("senha");

function erro(campo,id,txt){
  $(id).textContent=txt;
  campo.classList.toggle("inv",!!txt);
  campo.setAttribute("aria-invalid",!!txt);
}
//e para o email, verifica se tem algo e se é um email válido, ai vai ficar mais ou menos assim, precisamos trabalhar essa linha mais pra frente para fazer a requisição de login.
function vEmail(){
  const v=email.value.trim(),ok=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  erro(email,"e-email",!v?"Informe seu e-mail.":ok?"":"Digite um e-mail válido, como nome@email.com.");
  return !!v&&ok;
}
function vSenha(){
  const v=senha.value;
  erro(senha,"e-senha",!v?"Informe sua senha.":v.length<6?"A senha precisa ter pelo menos 6 caracteres.":"");
  return v.length>=6;
}
email.addEventListener("blur",vEmail);
senha.addEventListener("blur",vSenha);
email.addEventListener("input",()=>{if(email.classList.contains("inv"))vEmail()});
senha.addEventListener("input",()=>{if(senha.classList.contains("inv"))vSenha()});

$("ver").onclick=()=>{
  const mostrar=senha.type==="password";
  senha.type=mostrar?"text":"password";
  $("ver").textContent=mostrar?"Ocultar":"Mostrar";
  $("ver").setAttribute("aria-label",mostrar?"Ocultar senha":"Mostrar senha");
};

form.addEventListener("submit",e=>{
  const a=vEmail(),b=vSenha();
  if(!a||!b){e.preventDefault();(a?senha:email).focus();return}
  if(location.protocol==="file:"){  /* teste sem servidor */
    e.preventDefault();
    const av=$("aviso");av.textContent="Dados válidos! O envio de verdade fica para a integração com o Flask.";av.hidden=false;
  }
});
