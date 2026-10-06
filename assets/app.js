(async function(){
  const esc = s=>String(s).replace(/[&<>"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]));
  const get = async p=>{ const r=await fetch(p,{cache:'no-cache'}); if(!r.ok) throw new Error(p+': '+r.status); return r.json(); };
  let LIN, FON, RAD, RAW;
  try{
    // data/dados.json é gerado pelo npm run build a partir de data/carros/ e dos demais JSON
    ({linhas:LIN, fontes:FON, radar:RAD=[], carros:RAW} = await get('data/dados.json'));
  }catch(e){
    document.getElementById('mx').innerHTML='<tbody><tr><td class="loading">Não consegui carregar os dados ('+esc(e.message)+'). Se abriu o arquivo direto do computador, rode um servidor local: veja o README.</td></tr></tbody>';
    return;
  }
  const ROWS = LIN.linhas.map(l=>l.secao?{sec:l.secao}:{id:l.id,l:l.rotulo,cat:l.categoria});
  const CATS = Object.fromEntries(Object.entries(LIN.categorias).map(([k,v])=>[k,v.nome]));
  const W0 = Object.fromEntries(Object.entries(LIN.categorias).map(([k,v])=>[k,v.peso]));
  const W = {...W0};
  const TETO = LIN.teto;
  const ST = {sim:'y',nao:'n',nd:'q',divulgado:'d',na:'na'};
  // fonte por número dentro do carro
  function parseVal(v,car){
    let k,t='',f=[];
    if(typeof v==='string'){ if(ST[v]) k=ST[v]; else { k='i'; t=v; } }
    else if(v && typeof v==='object'){ k = v.e ? ST[v.e] : 'i'; t = v.t||''; f = v.f||[]; }
    else k='q';
    let txt;
    if(k==='y') txt = t ? '✓ '+t : '✓';
    else if(k==='n') txt = t ? '✗ '+t : '✗';
    else if(k==='q') txt = t || 'n/d';
    else if(k==='d') txt = t ? t+' · divulgado' : '✓ divulgado';
    else if(k==='na') txt = '—';
    else txt = t;
    let html=esc(txt);
    f.forEach(id=>{ const s=FON[id]; if(s){ const n=car.fontes.indexOf(id)+1; html+= s.url?`<a class="src" href="${esc(s.url)}" target="_blank" rel="noopener" title="${esc(s.titulo)}">[${n||'f'}]</a>`:`<span class="src" title="${esc(s.titulo)}">[${n||'f'}]</span>`; } });
    return [k,txt,html];
  }
  const CARS = RAW.map(r=>{
    const c={ id:r.id, n:r.nome, pt:r.preco.tabela, po:r.preco.oferta, pon:r.preco.oferta_nota, s:[r.subtitulo, r.status!=='à venda'?r.status:''].filter(Boolean).join(' · '),
      tech:r.tecnologia, body:r.carroceria, f:!!r.finalista, d:{fuel:r.combustivel}, obs:r.observacao||'', fontes:r.fontes||[] };
    c.p={}; ROWS.forEach(row=>{ if(row.id) c.p[row.id]=parseVal(r.valores[row.id],c); });
    return c;
  });
  const SCORED = ROWS.filter(r=>r.cat);
  document.getElementById('versao').textContent = new Date(LIN.versao+'T12:00:00').toLocaleDateString('pt-BR',{day:'numeric',month:'long',year:'numeric'});
  document.getElementById('ncarros').textContent = CARS.length;
  const rl=document.getElementById('radar');
  rl.innerHTML = RAD.length ? RAD.map(x=>`<li><b>${esc(x.nome)}:</b> ${esc(x.situacao)}${x.fonte?` <a href="${esc(x.fonte)}" target="_blank" rel="noopener">fonte</a>`:''}</li>`).join('') : '<li>Nada no radar.</li>';
  const repo=document.getElementById('repo');
  if(location.hostname.endsWith('github.io')){ const user=location.hostname.split('.')[0]; const name=location.pathname.split('/').filter(Boolean)[0]||''; repo.href=`https://github.com/${user}/${name}`; }

  const state={tier:'all',tech:'all',body:'all',flex:false,diff:false,sort:'price',offer:false,sel:[],cmp:false};
  const price = i=>{const c=CARS[i]; return (state.offer && c.po) ? c.po : c.pt;};
  const tierOf = i=>{const p=price(i); return p<=200000?'a':(p<=TETO?'b':'c');};
  const brl = v=>'R$ '+v.toLocaleString('pt-BR');
  const kbrl = v=>'R$ '+(v/1000).toFixed(1).replace('.',',')+' mil';

  function score(i){
    const c=CARS[i]; let wsum=0,mn=0,mx=0,cov=0;
    for(const cat in CATS){
      if(!W[cat]) continue;
      const rows=SCORED.filter(r=>r.cat===cat && c.p[r.id][0]!=='na');
      if(!rows.length) continue;
      const y=rows.filter(r=>c.p[r.id][0]==='y').length;
      const u=rows.filter(r=>['q','d'].includes(c.p[r.id][0])).length;
      wsum+=W[cat]; mn+=W[cat]*y/rows.length; mx+=W[cat]*(y+u)/rows.length; cov+=W[cat]*(rows.length-u)/rows.length;
    }
    if(!wsum) return {mn:0,mx:0,cov:0};
    return {mn:Math.round(100*mn/wsum), mx:Math.round(100*mx/wsum), cov:Math.round(100*cov/wsum)};
  }
  const num=(i,id)=>{const [k,t]=CARS[i].p[id]; if(k==='na'||k==='q') return NaN; const m=t.replace(/\./g,'').match(/\d+(,\d+)?/); return m?parseFloat(m[0].replace(',','.')):NaN;};
  const desc=id=>(a,b)=>{const x=num(a,id),y=num(b,id); if(isNaN(x)&&isNaN(y)) return 0; if(isNaN(x)) return 1; if(isNaN(y)) return -1; return y-x;};
  const SORTS={
    price:['Preço, do menor ao maior',(a,b)=>price(a)-price(b)],
    mn:['Nota mínima, da maior à menor',(a,b)=>score(b).mn-score(a).mn||score(b).mx-score(a).mx],
    mx:['Nota máxima, da maior à menor',(a,b)=>score(b).mx-score(a).mx||score(b).mn-score(a).mn],
    cov:['Cobertura dos dados, da maior à menor',(a,b)=>score(b).cov-score(a).cov],
    cpp:['Preço por ponto mínimo, do menor ao maior',(a,b)=>price(a)/Math.max(1,score(a).mn)-price(b)/Math.max(1,score(b).mn)],
    ev:['Autonomia elétrica (Inmetro), da maior à menor',desc('ev')],
    pw:['Potência, da maior à menor',desc('pw')],
    len:['Comprimento, do maior ao menor',desc('len')],
    name:['Nome, de A a Z',(a,b)=>CARS[a].n.localeCompare(CARS[b].n,'pt')]
  };

  const $=id=>document.getElementById(id);
  const reduce=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Pesos
  const wbox=$('weights');
  for(const cat in CATS){
    const lb=document.createElement('label');
    lb.innerHTML=`<span>${CATS[cat]}</span><output id="o-${cat}">${W[cat]}</output><input type="range" min="0" max="60" step="5" value="${W[cat]}" aria-label="Peso de ${CATS[cat]}">`;
    lb.querySelector('input').addEventListener('input',e=>{W[cat]=+e.target.value; $('o-'+cat).textContent=W[cat]; renderAll();});
    wbox.appendChild(lb);
  }
  $('wreset').addEventListener('click',()=>{ Object.assign(W,W0); wbox.querySelectorAll('input').forEach((inp,j)=>{const cat=Object.keys(CATS)[j]; inp.value=W[cat]; $('o-'+cat).textContent=W[cat];}); renderAll(); });
  $('offer').addEventListener('change',e=>{state.offer=e.target.checked; renderAll();});

  function renderRank(){
    const ok=CARS.map((c,i)=>i).filter(i=>price(i)<=TETO).sort((a,b)=>score(b).mn-score(a).mn||score(b).mx-score(a).mx);
    const out=CARS.map((c,i)=>i).filter(i=>price(i)>TETO);
    $('rank').innerHTML=ok.map(i=>{const s=score(i),c=CARS[i];
      return `<li><button data-loc="${i}" class="${c.f?'isfocus':''}" aria-label="${c.n}: nota de ${s.mn} a ${s.mx}, cobertura ${s.cov}%. Mostrar na tabela">
        <span class="nm">${c.n}<small class="${s.cov<90?'low':''}">cobertura ${s.cov}%${s.cov<90?' — inconclusivo':''}</small></span>
        <span class="rbar" aria-hidden="true"><span class="mx" style="width:${s.mx}%"></span><span class="mn" style="width:${s.mn}%"></span></span>
        <span class="val">${s.mn===s.mx?s.mn:s.mn+'–'+s.mx}</span></button></li>`;}).join('');
    $('omit').textContent = out.length ? 'Fora da lista por passar do teto: '+out.map(i=>CARS[i].n+' ('+brl(price(i))+')').join(', ')+'.' : '';
  }
  $('rank').addEventListener('click',e=>{const b=e.target.closest('button[data-loc]'); if(b) locate(+b.dataset.loc);});

  // Ordenação
  const sortSel=$('sort');
  Object.entries(SORTS).forEach(([k,[lab]])=>{const o=document.createElement('option'); o.value=k; o.textContent=lab; sortSel.appendChild(o);});
  sortSel.addEventListener('change',()=>{state.sort=sortSel.value; render();});

  // Segmentos
  ['tier','tech','body'].forEach(id=>{
    $(id).querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{state[id]=b.dataset.v; syncSeg(); render();}));
  });
  function syncSeg(){ ['tier','tech','body'].forEach(id=>$(id).querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.v===state[id])))); }
  $('flex').addEventListener('change',e=>{state.flex=e.target.checked; render();});
  $('diff').addEventListener('change',e=>{state.diff=e.target.checked; render();});

  // Comparação
  function renderCmpControls(){
    $('chips').innerHTML = state.sel.length ? state.sel.map(i=>`<span class="chip">${CARS[i].n}<button data-rm="${i}" aria-label="Tirar ${CARS[i].n} da comparação">×</button></span>`).join('') : '<span class="hint" style="margin:0">Nenhum carro escolhido.</span>';
    const avail=CARS.map((c,i)=>i).filter(i=>!state.sel.includes(i)).sort(SORTS.name[1]);
    $('add').innerHTML=`<option value="">${state.sel.length>=4?'Limite de quatro carros':'Adicionar carro'}</option>`+(state.sel.length>=4?'':avail.map(i=>`<option value="${i}">${CARS[i].n}</option>`).join(''));
    $('add').disabled = state.sel.length>=4;
    $('cgo').disabled = state.sel.length<2 || state.cmp;
    $('cclr').disabled = !state.sel.length;
  }
  $('chips').addEventListener('click',e=>{const b=e.target.closest('button[data-rm]'); if(!b) return; state.sel=state.sel.filter(i=>i!==+b.dataset.rm); if(state.sel.length<2) state.cmp=false; render();});
  $('add').addEventListener('change',e=>{ if(e.target.value==='') return; state.sel.push(+e.target.value); render(); });
  $('cgo').addEventListener('click',()=>{ if(state.sel.length<2) return; state.cmp=true; render(); $('cmpt').scrollIntoView({behavior:reduce()?'auto':'smooth',block:'start'}); });
  $('cclr').addEventListener('click',()=>{ state.sel=[]; state.cmp=false; render(); });
  function togglePick(i){
    if(state.sel.includes(i)) state.sel=state.sel.filter(x=>x!==i);
    else if(state.sel.length<4) state.sel.push(i);
    if(state.sel.length<2) state.cmp=false;
    render();
  }

  function renderSummary(){
    const box=$('cres');
    if(!state.cmp){ box.innerHTML=''; document.body.classList.remove('comparing'); return; }
    document.body.classList.add('comparing');
    const S=state.sel;
    let t='<table class="ctab"><tr><th>Carro</th><th>Preço</th><th>Nota</th><th>Cobertura</th></tr>';
    S.forEach(i=>{const s=score(i); t+=`<tr><td>${CARS[i].n}</td><td>${brl(price(i))}</td><td>${s.mn===s.mx?s.mn:s.mn+'–'+s.mx}</td><td>${s.cov}%</td></tr>`;});
    t+='</table>';
    let g='<div class="cgrid">'; const pend=[];
    S.forEach(i=>{
      const others=S.filter(j=>j!==i);
      const ex=SCORED.filter(r=>CARS[i].p[r.id][0]==='y' && others.every(j=>CARS[j].p[r.id][0]==='n')).map(r=>r.l);
      g+=`<div><h3>Só o ${CARS[i].n} tem</h3>${ex.length?'<ul>'+ex.map(x=>`<li>${x}</li>`).join('')+'</ul>':'<p class="none">Nenhuma exclusividade confirmada nos dados disponíveis.</p>'}</div>`;
      SCORED.forEach(r=>{ if(CARS[i].p[r.id][0]==='y'){ others.forEach(j=>{ if(['q','d'].includes(CARS[j].p[r.id][0])) pend.push(`${r.l} no ${CARS[j].n}`); }); } });
    });
    g+='</div>';
    const p = pend.length ? `<p class="pend"><b>A confirmar antes de decidir:</b> ${[...new Set(pend)].join('; ')}.</p>` : '';
    box.innerHTML=t+g+p+'<p class="hint" style="margin-top:10px">A tabela abaixo mostra só os carros escolhidos. Os filtros ficam suspensos até você limpar a comparação.</p>';
  }

  function visible(){
    if(state.cmp) return state.sel.slice();
    return CARS.map((c,i)=>i).filter(i=>{
      const c=CARS[i];
      if(state.tier==='focus'){ if(!c.f) return false; }
      else if(state.tier!=='all' && tierOf(i)!==state.tier) return false;
      if(state.tech==='HEV' && c.tech!=='HEV') return false;
      if(state.tech==='PLUG' && !['PHEV','REEV'].includes(c.tech)) return false;
      if(state.tech==='BEV' && c.tech!=='BEV') return false;
      if(state.body!=='all' && c.body!==state.body) return false;
      if(state.flex && c.d.fuel!=='flex') return false;
      return true;
    }).sort(SORTS[state.sort][1]);
  }

  function render(){
    renderCmpControls(); renderSummary();
    const mx=$('mx'); const vis=visible();
    if(!vis.length){ mx.innerHTML='<tbody><tr><td class="empty">Nenhum carro atende a esses filtros.</td></tr></tbody>'; return; }
    let h='<thead><tr><th class="feat" scope="col">Item</th>';
    vis.forEach(i=>{const c=CARS[i],s=score(i),sel=state.sel.includes(i); const t=tierOf(i);
      const offer = c.po ? (state.offer ? `<span class="sub">tabela ${brl(c.pt)}</span>` : `<span class="sub">${c.pon}: ${brl(c.po)}</span>`) : '';
      h+=`<th scope="col" data-col="${i}" class="t${t}${c.f?' f':''}"><span class="car"><b>${esc(c.n)}</b><span class="pr">${brl(price(i))}</span>${offer}${c.s?`<span class="sub">${esc(c.s)}</span>`:''}<span class="sco${s.cov<90?' low':''}">nota ${s.mn===s.mx?s.mn:s.mn+'–'+s.mx} · cobertura ${s.cov}%</span>${s.mn?`<span class="sub">${kbrl(price(i)/s.mn)} por ponto mínimo</span>`:''}</span>${state.cmp?'':`<button class="pick${sel?' on':''}" data-pick="${i}" aria-pressed="${sel}">${sel?'Na comparação':'Comparar'}</button>`}</th>`;});
    h+='</tr></thead><tbody>';
    let pending=null;
    ROWS.forEach(r=>{
      if(r.sec){ pending=r.sec; return; }
      const cells=vis.map(i=>CARS[i].p[r.id]);
      if(state.diff && vis.length>1 && cells.every(c=>c[1]===cells[0][1])) return;
      if(pending){ h+=`<tr class="sec"><td class="feat">${pending}</td><td colspan="${vis.length}"></td></tr>`; pending=null; }
      h+=`<tr><th class="feat" scope="row">${esc(r.l)}${r.cat?`<span class="cat">pontua em ${CATS[r.cat].toLowerCase()}</span>`:''}</th>`;
      vis.forEach((i,j)=>{const [k,t,ht]=cells[j]; h+=`<td data-col="${i}" class="${k}${CARS[i].f?' f':''}">${ht}</td>`;});
      h+='</tr>';
    });
    if(!state.diff){
      h+=`<tr class="sec"><td class="feat">Observações e fontes</td><td colspan="${vis.length}"></td></tr>`;
      h+='<tr><th class="feat" scope="row">Observação</th>'+vis.map(i=>`<td data-col="${i}" class="obs">${esc(CARS[i].obs)||'—'}</td>`).join('')+'</tr>';
      h+='<tr><th class="feat" scope="row">Fontes</th>'+vis.map(i=>`<td data-col="${i}" class="obs srcs">${CARS[i].fontes.length?CARS[i].fontes.map((id,n)=>{const s=FON[id]; return s? (s.url?`<a href="${esc(s.url)}" target="_blank" rel="noopener" title="${esc(s.titulo)}">[${n+1}] ${esc(s.titulo)}</a>`:`<span>[${n+1}] ${esc(s.titulo)}</span>`):'';}).join('<br>'):'<span style="color:var(--nd)">fontes a registrar</span>'}</td>`).join('')+'</tr>';
    }
    mx.innerHTML=h+'</tbody>';
  }
  $('mx').addEventListener('click',e=>{const b=e.target.closest('button[data-pick]'); if(b) togglePick(+b.dataset.pick);});

  function renderAll(){ renderRank(); render(); }

  function locate(i){
    state.cmp=false;
    if(!visible().includes(i)){ state.tier='all'; state.tech='all'; state.body='all'; state.flex=false; $('flex').checked=false; syncSeg(); }
    render();
    const box=$('box'), th=$('mx').querySelector(`thead th[data-col="${i}"]`);
    if(!th) return;
    box.scrollIntoView({behavior:reduce()?'auto':'smooth',block:'start'});
    box.scrollTo({left:th.offsetLeft-170,behavior:reduce()?'auto':'smooth'});
    const cells=$('mx').querySelectorAll(`[data-col="${i}"]`);
    cells.forEach(c=>c.classList.add('flash'));
    setTimeout(()=>cells.forEach(c=>c.classList.remove('flash')),1400);
  }

  renderAll();
})();
