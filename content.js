// PokeIdle - Assistente de preco
// Na tela de anunciar do Mercado, mostra o preco de empate (apos a comissao), o lucro e sugere precos.
// Le a tela e calcula localmente. So preenche o campo de preco quando VOCE clica em "Usar";
// nunca clica em "Anunciar" e nao envia nada ao jogo nem para fora do navegador.
(() => {
  'use strict';
  if (window.__pokeidlePrecoAssist) return;
  window.__pokeidlePrecoAssist = true;

  const TAXA_PADRAO = 15; // % de comissao do Mercado em Coins (Wiki)
  const MARGEM_PADRAO = 20; // % de lucro desejado

  const parseNum = (s) => {
    const n = Number(String(s ?? '').replace(/[^\d]/g, ''));
    return Number.isFinite(n) ? n : 0;
  };
  const parseDec = (s) => {
    const n = Number(String(s ?? '').replace(',', '.').replace(/[^\d.]/g, ''));
    return Number.isFinite(n) ? n : 0;
  };
  const fmt = (n) => Math.round(n).toLocaleString('pt-BR');
  const fmtPct = (n) => (Math.round(n * 10) / 10).toLocaleString('pt-BR') + '%';
  const guardar = (k, v) => { try { localStorage.setItem('pxpp-' + k, v); } catch { /* sem storage: ignora */ } };
  const ler = (k) => { try { return localStorage.getItem('pxpp-' + k) ?? ''; } catch { return ''; } };

  // ---------- calculo (comissao como o jogo: liquido = floor(qtd * preco * (1 - taxa))) ----------
  const liquidoTotal = (preco, qtd, taxa) => Math.floor(qtd * preco * (1 - taxa / 100));
  const precoEmpate = (custo, taxa) => Math.ceil(custo / (1 - taxa / 100));
  const precoParaMargem = (custo, margem, taxa) => Math.ceil((custo * (1 + margem / 100)) / (1 - taxa / 100));

  // ---------- leitura da tela de anunciar ----------
  function nomeDoItem(form) {
    for (let el = form; el; el = el.parentElement) {
      const n = el.querySelector?.('.dlg-ator-nome');
      if (n) return n.textContent.trim();
    }
    return '';
  }
  const quantidade = () => Math.max(1, parseNum(document.querySelector('#cm-placa-qtd')?.textContent) || 1);
  const moedaAtual = (form) => form.querySelector('.cm-moedas .cm-moeda.on')?.dataset.moeda || 'gold';

  // ---------- interface (visual do jogo) ----------
  const CSS = `
    :host{all:initial;display:block;margin:10px 0}
    *{box-sizing:border-box}
    .caixa{font:13px/1.4 "Segoe UI",system-ui,sans-serif;color:#fff6ef;background:#33202b;border-radius:6px;padding:9px 10px 10px;
      box-shadow:inset 0 0 0 2px #480e1e,0 1px 0 #e7a86d}
    h4{margin:0 0 7px;font:700 11px Tahoma,Verdana,"Segoe UI",sans-serif;text-transform:uppercase;letter-spacing:1px;color:#ffe9a3}
    .linha{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:2px 0}
    .linha > span:first-child{color:#c9a9b4;font-size:12px}
    .v{font-weight:700;text-align:right}
    .campos{display:grid;grid-template-columns:1fr 62px 52px;gap:6px;margin-bottom:6px}
    .campos label{display:flex;flex-direction:column;gap:2px;font-size:10.5px;color:#c9a9b4}
    input{all:unset;box-sizing:border-box;width:100%;padding:3px 6px;background:#1e1219;border-radius:5px;color:#fff;text-align:right;font-size:13px;
      box-shadow:inset 0 0 0 2px #480e1e,0 1px 0 #e7a86d}
    input:focus{box-shadow:inset 0 0 0 2px #e2a93f,0 1px 0 #e7a86d}
    input::placeholder{color:#8d7480}
    .usar{all:unset;cursor:pointer;font-size:11px;font-weight:700;padding:2px 8px;border-radius:4px;background:#5c3948;box-shadow:inset 0 0 0 1px #480e1e;color:#fff6ef}
    .usar:hover{background:#6e4658}
    .usar[disabled]{opacity:.4;cursor:default}
    .sep{border-top:1px solid #ffffff1c;margin:6px 0 4px}
    .ok{color:#6fd08a}.medio{color:#ffe9a3}.ruim{color:#ff8a7a}
    .dica{color:#8d7480;font-size:11px;margin-top:4px}
    .msg{color:#f5cdb9;font-size:12px}
  `;

  const hosts = new WeakMap(); // form -> { host, root }

  function montar(form) {
    const host = document.createElement('div');
    host.id = 'pokeidle-assistente-preco';
    const root = host.attachShadow({ mode: 'open' });
    root.innerHTML = `
      <style>${CSS}</style>
      <div class="caixa">
        <h4>Assistente de preço</h4>
        <div data-r="conteudo">
          <div class="campos">
            <label>Paguei por unidade<input data-r="custo" inputmode="decimal" placeholder="ex: 20000"></label>
            <label>Meta de lucro %<input data-r="margem" inputmode="decimal"></label>
            <label>Comissão %<input data-r="taxa" inputmode="decimal"></label>
          </div>
          <div data-r="calculos"></div>
        </div>
        <div class="msg" data-r="msg" hidden></div>
      </div>`;
    const q = (n) => root.querySelector(`[data-r="${n}"]`);
    const st = { host, root, q, nome: null };
    q('margem').value = ler('margem') || String(MARGEM_PADRAO);
    q('taxa').value = ler('taxa') || String(TAXA_PADRAO);
    // teclas digitadas aqui nao chegam nos atalhos do jogo
    for (const ev of ['keydown', 'keyup', 'keypress']) root.addEventListener(ev, (e) => e.stopPropagation());
    const aoMudar = (k) => () => {
      if (k === 'custo') { if (st.nome) guardar('custo-' + st.nome.toLowerCase(), q('custo').value.trim()); }
      else guardar(k, q(k).value.trim());
      pintar(form, st);
    };
    for (const k of ['custo', 'margem', 'taxa']) q(k).addEventListener('input', aoMudar(k));
    root.addEventListener('click', (e) => {
      const b = e.target.closest('[data-usar]');
      if (!b || b.disabled) return;
      const inp = form.querySelector('#cm-preco');
      if (!inp) return;
      inp.value = String(Number(b.dataset.usar));
      inp.dispatchEvent(new Event('input', { bubbles: true })); // o jogo recalcula o recibo dele
    });
    const resumo = form.querySelector('#cm-resumo');
    if (resumo) resumo.before(host); else form.appendChild(host);
    hosts.set(form, st);
    return st;
  }

  function pintar(form, st) {
    const { q } = st;
    const nome = nomeDoItem(form);
    if (nome !== st.nome) {
      st.nome = nome;
      q('custo').value = nome ? ler('custo-' + nome.toLowerCase()) : '';
    }
    const moeda = moedaAtual(form);
    const msg = q('msg');
    const conteudo = q('conteudo');
    if (moeda === 'orb') {
      conteudo.hidden = true; msg.hidden = false;
      msg.textContent = 'O assistente calcula só para vendas em Coins (a comissão em Gemas é outra).';
      return;
    }
    conteudo.hidden = false; msg.hidden = true;
    const custo = parseDec(q('custo').value);
    const margem = parseDec(q('margem').value);
    const taxa = Math.min(90, parseDec(q('taxa').value));
    const calc = q('calculos');
    // So redesenha quando o conteudo muda: trocar os botoes no meio de um clique cancela o clique.
    const pintarCalc = (html) => { if (st.ultimoHtml !== html) { st.ultimoHtml = html; calc.innerHTML = html; } };
    if (!(custo > 0)) {
      pintarCalc(`<div class="dica">${nome ? `Digite quanto você pagou por ${nome.replace(/</g, '&lt;')} (por unidade). Fica salvo no navegador.` : 'Digite quanto você pagou por unidade.'}</div>`);
      return;
    }
    const preco = parseNum(form.querySelector('#cm-preco')?.value);
    const qtd = quantidade();
    const empate = precoEmpate(custo, taxa);
    const meta = precoParaMargem(custo, margem, taxa);
    let linhas = `
      <div class="linha"><span>Preço de empate (sem prejuízo)</span><span><b class="v">${fmt(empate)}</b> <button class="usar" data-usar="${empate}">Usar</button></span></div>
      <div class="linha"><span>Preço p/ ${fmtPct(margem)} de lucro</span><span><b class="v">${fmt(meta)}</b> <button class="usar" data-usar="${meta}">Usar</button></span></div>
      <div class="sep"></div>`;
    if (preco > 0) {
      const liq = liquidoTotal(preco, qtd, taxa);
      const custoTotal = custo * qtd;
      const lucro = liq - custoTotal;
      const pct = (lucro / custoTotal) * 100;
      const cls = lucro < 0 ? 'ruim' : pct >= margem ? 'ok' : 'medio';
      linhas += `
      <div class="linha"><span>Com ${fmt(preco)} cada${qtd > 1 ? ` (×${fmt(qtd)})` : ''}, você recebe</span><b class="v">${fmt(liq)}</b></div>
      <div class="linha"><span>Lucro líquido</span><b class="v ${cls}">${lucro >= 0 ? '+' : '−'}${fmt(Math.abs(lucro))} (${pct >= 0 ? '+' : '−'}${fmtPct(Math.abs(pct))})</b></div>
      ${qtd > 1 ? `<div class="linha"><span>Lucro por unidade</span><b class="v ${cls}">${lucro >= 0 ? '+' : '−'}${fmt(Math.abs(lucro / qtd))}</b></div>` : ''}
      ${lucro < 0 ? '<div class="dica ruim">Abaixo do empate: você perde Coins nessa venda.</div>' : ''}`;
    }
    pintarCalc(linhas);
  }

  // ---------- ciclo: acha o formulario de anunciar, monta e atualiza ----------
  function varrer() {
    const inp = document.querySelector('#cm-preco');
    const form = inp?.closest('.cm-form');
    if (!form || !document.querySelector('#cm-publicar')) return;
    let st = hosts.get(form);
    if (!st || !st.host.isConnected) st = montar(form);
    pintar(form, st);
  }

  document.addEventListener('input', (e) => { if (e.target?.id === 'cm-preco') varrer(); }, true);
  document.addEventListener('click', () => setTimeout(varrer, 0), true); // trocar moeda/quantidade
  let agendado = false;
  new MutationObserver(() => {
    if (agendado) return;
    agendado = true;
    requestAnimationFrame(() => { agendado = false; varrer(); });
  }).observe(document.documentElement, { childList: true, subtree: true });
  setInterval(varrer, 1000);
  varrer();
  window.__pokeidlePrecoAssist = { precoEmpate, precoParaMargem, liquidoTotal };
})();
