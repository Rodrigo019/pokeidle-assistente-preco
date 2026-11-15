# PokeIdle - Assistente de preço (extensão do Chrome)

Na tela de **anunciar** do Mercado da Comunidade, mostra uma caixa com:
- **Preço de empate**: o menor preço para não ter prejuízo depois da comissão (`custo ÷ (1 − comissão)`).
- **Preço para a meta de lucro** que você definir (padrão 20%).
- Com o preço que você digitou e a quantidade: quanto você **recebe**, o **lucro líquido** (em Coins e em %) e o lucro por unidade. Fica vermelho se estiver abaixo do empate.
- Botão **Usar**: preenche o campo de preço com o valor sugerido. **Quem clica em "Anunciar" é você.**

Você informa quanto **pagou por unidade**; o valor fica salvo por item (por exemplo, Metal Stone) no navegador. A comissão padrão é 15% (Coins) e pode ser alterada no campo.

Só calcula vendas em **Coins**. Em Gemas a comissão é outra e a caixa avisa.

## Como instalar
1. Abra `chrome://extensions` e ative o **Modo do desenvolvedor**.
2. **Carregar sem compactação** e escolha esta pasta.
3. Recarregue a aba do jogo (pokeidle.io/app).

## Segurança (para quem quiser conferir)
O código tem dois arquivos para ler: `manifest.json` e `content.js`.

- **Só roda em `pokeidle.io`** (e `www.pokeidle.io`), conforme `matches` no `manifest.json`.
- **Sem permissões especiais**: o `manifest.json` não pede `permissions` nem `host_permissions` além do acesso a `pokeidle.io`.
- **Não faz requisições de rede.** Não há `fetch`, `XMLHttpRequest`, `WebSocket` nem `sendBeacon`. Nada sai do navegador.
- **Não envia nada ao jogo e não clica em "Anunciar".** Só lê o preço, a quantidade e o nome do item que a tela já mostra. O único "toque" na página é preencher o campo de preço quando você clica em **Usar**.
- **Não executa código de fora**: sem `eval` nem scripts externos. O `innerHTML` recebe só modelos fixos e números formatados.
- **Só guarda no `localStorage`** o que você digitar: quanto pagou por item, a meta de lucro e a comissão (chaves `pxpp-...`).
- **Sem conta, senha ou dado pessoal.**

Projeto não oficial, sem ligação com os criadores do PokeIdle.
