/* fx.js — compartilhado por todas as páginas: tema claro/escuro + fundo espacial */
const $=id=>document.getElementById(id);
const calmo=matchMedia("(prefers-reduced-motion: reduce)").matches;

/* tema: escolha salva ou preferência do sistema */
const sistemaClaro=matchMedia("(prefers-color-scheme: light)");
const ehClaro=()=>{const t=document.documentElement.dataset.theme;return t?t==="light":sistemaClaro.matches};
function rotuloTema(){const b=$("tema");if(b)b.textContent=ehClaro()?"☾ Escuro":"☀ Claro"}
function temaMudou(){rotuloTema();document.dispatchEvent(new Event("temamudou"))}
if($("tema"))$("tema").onclick=()=>{
  const novo=ehClaro()?"dark":"light";
  document.documentElement.dataset.theme=novo;
  try{localStorage.setItem("tema",novo)}catch(e){}
  temaMudou();
};
sistemaClaro.addEventListener("change",temaMudou);
rotuloTema();

/* fundo espacial: estrelas com paralaxe, brilho e estrelas cadentes */
(function(){
  const cv=$("bg");if(!cv)return;
  const cx=cv.getContext("2d");
  let w,h,est=[],met=[],mx=0,my=0,alvoX=0,alvoY=0;
  function tam(){
    w=cv.width=innerWidth;h=cv.height=innerHeight;
    est=Array.from({length:Math.round(w*h/5500)},()=>({x:Math.random()*w,y:Math.random()*h,z:.15+Math.random()*.85,f:Math.random()*6.28,c:Math.random()}));
  }
  function frame(t){
    const lc=ehClaro();
    mx+=(alvoX-mx)*.05;my+=(alvoY-my)*.05;
    cx.clearRect(0,0,w,h);
    est.forEach(s=>{
      if(!calmo){s.x-=s.z*.15;if(s.x<-2)s.x=w+2}
      const brilho=calmo?.7:.5+.5*Math.sin(t/650+s.f);
      cx.globalAlpha=Math.min(1,(lc?.3:.2)+brilho*s.z*(lc?.6:.8));
      cx.fillStyle=lc?(s.c<.6?"#4a3fb0":"#d92d6b"):(s.c<.7?"#ffffff":s.c<.85?"#9ad7ff":"#ffb3d1");
      cx.beginPath();cx.arc(s.x+mx*s.z*40,s.y+my*s.z*40,s.z*1.7,0,6.283);cx.fill();
    });
    if(!calmo){
      if(Math.random()<.006&&met.length<2){
        const r=Math.random();
        met.push({x:w*(.3+Math.random()*.7),y:Math.random()*h*.35,vx:-(7+r*4),vy:3.5+r*2,vida:60});
      }
      met=met.filter(m=>{
        m.x+=m.vx;m.y+=m.vy;m.vida--;
        const g=cx.createLinearGradient(m.x,m.y,m.x-m.vx*7,m.y-m.vy*7);
        g.addColorStop(0,lc?"#d92d6b":"#ffffff");g.addColorStop(1,"rgba(255,255,255,0)");
        cx.globalAlpha=Math.min(1,m.vida/30);cx.strokeStyle=g;cx.lineWidth=2;
        cx.beginPath();cx.moveTo(m.x,m.y);cx.lineTo(m.x-m.vx*7,m.y-m.vy*7);cx.stroke();
        return m.vida>0;
      });
      requestAnimationFrame(frame);
    }
  }
  tam();
  addEventListener("resize",()=>{tam();if(calmo)frame(0)});
  if(!calmo)addEventListener("mousemove",e=>{alvoX=e.clientX/w-.5;alvoY=e.clientY/h-.5});
  document.addEventListener("temamudou",()=>{if(calmo)frame(0)});
  frame(0);
})();
