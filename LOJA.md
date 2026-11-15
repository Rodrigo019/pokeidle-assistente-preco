# Material para o formulário da Chrome Web Store — Assistente de preço

## Aba "Store listing"

**Nome (até 75 caracteres)**
PokeIdle - Assistente de preço

**Resumo (até 132 caracteres)**
No formulário de anunciar do Mercado do PokeIdle, mostra o preço de empate, o lucro e sugere o preço para a margem que você quer.

**Descrição detalhada**
Vai anunciar itens no Mercado da Comunidade do PokeIdle e quer saber por quanto vender sem tomar prejuízo, já descontada a comissão? Esta extensão faz a conta por você, direto na tela de anunciar.

Uma caixa "Assistente de preço" aparece acima do recibo do jogo. Você informa quanto pagou por unidade e ela mostra:
• o preço de empate: o menor preço para não ter prejuízo depois da comissão;
• o preço para a meta de lucro que você definir (padrão 20%);
• com o preço que você digitou e a quantidade: quanto você recebe, o lucro líquido em Coins e em %, e o lucro por unidade. Fica vermelho quando está abaixo do empate.

O botão "Usar" preenche o campo de preço com o valor sugerido. Quem clica em "Anunciar" é sempre você.

O quanto você pagou fica salvo por item (por exemplo, Metal Stone) no seu navegador. A comissão (padrão 15% em Coins) e a meta de lucro podem ser alteradas. O assistente calcula vendas em Coins; em Gemas a comissão é outra e a caixa avisa.

PRIVACIDADE E SEGURANÇA
• Roda somente em pokeidle.io.
• Não pede nenhuma permissão especial.
• Não faz requisições de rede: nada sai do seu navegador.
• Não clica em "Anunciar" e não envia comandos ao jogo. Só lê o preço, a quantidade e o nome do item que a tela já mostra, e calcula localmente.
• Código aberto, para qualquer pessoa conferir: https://github.com/Rodrigo019/pokeidle-assistente-preco

Projeto não oficial, sem ligação com os criadores do PokeIdle.

**Categoria:** Jogos (ou "Ferramentas" se "Jogos" não aparecer para extensões)
**Idioma:** Português (Brasil)

## Aba "Privacy"

**Descrição do único propósito**
Ajudar o jogador, na tela de anunciar do Mercado do jogo PokeIdle (pokeidle.io), a calcular o preço de empate e o lucro de uma venda, já descontada a comissão, a partir do que ele pagou e do preço que digitou.

**Justificativa de Permissão do host**
A extensão roda somente em https://pokeidle.io/* e https://www.pokeidle.io/*, por meio de um content script. Esse acesso é necessário para ler, na tela de anunciar do Mercado, o preço digitado, a quantidade e o nome do item, e para desenhar a caixa de cálculo ao lado do formulário. Não acessa nenhum outro site, não usa permissões de API do Chrome (permissions) e não faz requisições de rede nem envia dados para fora do navegador.

**Uso de código remoto:** Não. Todo o código está dentro do pacote.

**Uso de dados:** não marque nenhuma categoria de dados. Marque as 3 declarações (não vendo dados, não uso fora do propósito único, não uso para crédito/empréstimo).

**URL da política de privacidade**
https://github.com/Rodrigo019/pokeidle-assistente-preco/blob/main/PRIVACY.md

## Imagens
- Ícone da loja 128×128: `icons/icon128.png`
- Capturas de tela (1280×800, PNG 24 bits): pasta `loja/`
  - `captura-1-preco-e-lucro.png`
  - `captura-2-aviso-prejuizo.png`
- Imagem promocional pequena 440×280: opcional.

## Pacote
`dist/pokeidle-assistente-preco-1.0.0.zip` (somente `manifest.json`, `content.js` e os ícones 16/48/128).
