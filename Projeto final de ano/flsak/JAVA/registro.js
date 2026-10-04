/* Validação do formulário de cadastro (o Flask deve validar de novo no servidor). Depende do fx.js. */
const form=$("form"),nome=$("nome"),email=$("email"),senha=$("senha"),conf=$("conf"),termos=$("termos");

function erro(campo,id,txt){
  $(id).textContent=txt;
  campo.classList.toggle("inv",!!txt);
  campo.setAttribute("aria-invalid",!!txt);
}
function vNome(){
  const v=nome.value.trim();
  erro(nome,"e-nome",!v?"Informe seu nome.":v.length<3?"O nome precisa ter pelo menos 3 letras.":"");
  return v.length>=3;
}
function vEmail(){
  const v=email.value.trim(),ok=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  erro(email,"e-email",!v?"Informe seu e-mail.":ok?"":"Digite um e-mail válido, como nome@email.com.");
  return !!v&&ok;
}
function vSenha(){
  const v=senha.value;
  erro(senha,"e-senha",!v?"Crie uma senha.":v.length<6?"A senha precisa ter pelo menos 6 caracteres.":"");
  return v.length>=6;
}
function vConf(){
  const v=conf.value,ok=!!v&&v===senha.value;
  erro(conf,"e-conf",!v?"Confirme sua senha.":ok?"":"As senhas não são iguais.");
  return ok;
}
function vTermos(){
  erro(termos,"e-termos",termos.checked?"":"Aceite os termos para criar a conta.");
  return termos.checked;
}

/* força da senha: 0 a 4 */
function forca(){
  const v=senha.value;
  const n=(v.length>=8)+(/[a-z]/.test(v)&&/[A-Z]/.test(v))+/\d/.test(v)+/[^A-Za-z0-9]/.test(v);
  const nivel=v?Math.max(1,n):0;
  $("forca").dataset.n=nivel;
  $("dica").textContent=["Use 8 ou mais caracteres, com letras, números e símbolos.","Senha fraca.","Senha razoável.","Senha boa.","Senha forte."][nivel];
}

nome.addEventListener("blur",vNome);
email.addEventListener("blur",vEmail);
senha.addEventListener("blur",vSenha);
conf.addEventListener("blur",vConf);
termos.addEventListener("change",vTermos);
nome.addEventListener("input",()=>{if(nome.classList.contains("inv"))vNome()});
email.addEventListener("input",()=>{if(email.classList.contains("inv"))vEmail()});
senha.addEventListener("input",()=>{
  forca();
  if(senha.classList.contains("inv"))vSenha();
  if(conf.value)vConf();
});
conf.addEventListener("input",()=>{if(conf.value||conf.classList.contains("inv"))vConf()});

/* botões Mostrar/Ocultar */
document.querySelectorAll(".ver").forEach(b=>b.onclick=()=>{
  const campo=$(b.dataset.alvo),mostrar=campo.type==="password";
  campo.type=mostrar?"text":"password";
  b.textContent=mostrar?"Ocultar":"Mostrar";
  b.setAttribute("aria-label",(mostrar?"Ocultar ":"Mostrar ")+(campo===senha?"senha":"confirmação de senha"));
});

form.addEventListener("submit",e=>{
  const r=[[vNome(),nome],[vEmail(),email],[vSenha(),senha],[vConf(),conf],[vTermos(),termos]];
  const primeiro=r.find(x=>!x[0]);
  if(primeiro){e.preventDefault();primeiro[1].focus();return}
  if(location.protocol==="file:"){  /* teste sem servidor */
    e.preventDefault();
    const av=$("aviso");av.textContent="Dados válidos! O cadastro de verdade fica para a integração com o Flask.";av.hidden=false;
  }
});
