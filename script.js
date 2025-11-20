(function(){
  const exprEl = document.getElementById('expr');
  const resEl = document.getElementById('res');
  const buttons = document.querySelectorAll('button[data-value], button[data-action]');

  let expression = '';
  let lastResult = null;

  function updateDisplay(){
    exprEl.textContent = expression || '\u00A0';
    resEl.textContent = expression ? expression : '0';
  }

  function safeEval(exp){
    if(!/^[0-9()+\-*/%.\s]+$/.test(exp)) return 'Error';
    try{
      let normalized = exp.replaceAll('%','/100').replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-');
      const val = Function('return (' + normalized + ')')();
      if(typeof val === 'number' && isFinite(val)) return String(val);
      return 'Error';
    }catch(e){
      return 'Error';
    }
  }

  function pressValue(v){
    if(v === '.'){
      const parts = expression.split(/[^0-9.]/);
      const last = parts[parts.length-1];
      if(last.includes('.')) return;
    }
    if(/^[+*/%]/.test(v) && expression === '') return;
    expression += v;
    lastResult = null;
    resEl.textContent = expression;
    exprEl.textContent = expression;
  }

  function clearAll(){ expression = ''; lastResult = null; updateDisplay(); }
  function backspace(){ expression = expression.slice(0,-1); updateDisplay(); }

  function equals(){
    if(!expression) return;
    const out = safeEval(expression);
    resEl.textContent = out;
    exprEl.textContent = expression + ' =';
    if(out !== 'Error'){
      expression = String(out);
      lastResult = out;
    }
  }

  buttons.forEach(b => {
    b.addEventListener('click', ()=>{
      const v = b.getAttribute('data-value');
      const action = b.getAttribute('data-action');
      if(action === 'clear') return clearAll();
      if(action === 'back') return backspace();
      if(action === 'equals') return equals();
      if(v) return pressValue(v);
    });
  });

  window.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter' || e.key === '='){ equals(); e.preventDefault(); return; }
    if(e.key === 'Backspace'){ backspace(); return; }
    if(e.key === 'Escape'){ clearAll(); return; }
    if(/^[0-9]$/.test(e.key)) pressValue(e.key);
    if(['+','-','*','/','%','.','(',')'].includes(e.key)) pressValue(e.key);
  });

  updateDisplay();
})();
