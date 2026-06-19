# 💎 Diamond Casino Heist Calculator

# 🛠️ [SITE](https://lhgomesdev.github.io/DiamondCasinoCalc/)

Uma ferramenta web moderna e responsiva desenvolvida para ajudar os jogadores de **Grand Theft Auto Online (GTAO)** a planear e calcular os ganhos finais do **Golpe ao Diamond Casino**.

Esta calculadora permite simular diferentes cenários, escolhendo alvos, membros da equipa e divisões de percentagem para estimar o lucro líquido exato para cada jogador.

## ✨ Funcionalidades

Com base na análise do código fonte, a aplicação oferece:

* **💰 Seleção de Alvo:** Escolha entre Dinheiro, Arte, Ouro ou Diamantes.
* **📊 Modos de Dificuldade:** Alternância entre Normal e Difícil (Hard) com ajuste automático de valores.
* **👥 Gestão de Equipa (Crew):**
    * Seleção de Hacker, Atirador e Piloto.
    * Cálculo automático das taxas de corte (cut) de cada NPC.
    * **Lenda de Tempo:** Visualização do tempo disponível no cofre baseado no Hacker escolhido (ex: Avi Schwartzman vs. Rickie Luckens).
* **💸 Calculadora de Pagamentos:**
    * Suporte para 2 a 4 jogadores.
    * Sliders interativos para ajustar a percentagem (%) de cada jogador.
    * Validação da soma total (indica se a divisão é igual a 100%).
* **📈 Modificadores Extras:**
    * **Comprador (Buyer):** Níveis Baixo (-10%), Médio (-5%) ou Alto (0% taxa).
    * **Desafio de Elite:** Opção para adicionar o bónus de $100.000.
    * **Evento 2x:** Modo para duplicar os valores em semanas de eventos especiais.

## 📂 Estrutura do Projeto

```text
/
├── css/
│   └── style.css
├── js/
│   ├── calc.js       
│   ├── data.js         
│   ├── state.js       
│   └── ui.js          
├── index.html          
├── .gitignore
├── LICENSE
└── README.md
```

## 🧮 Lógica de Cálculo

O cálculo do valor líquido ("Net Take") segue a seguinte ordem, conforme definido em `js/calc.js`:

1.  Valor Base do Alvo (Normal ou Hard).
2.  Aplicação de multiplicador de Evento (se ativo).
3.  Subtração da Taxa de Lavagem (Comprador).
4.  Subtração da Taxa do Lester e da Equipa (Hacker + Atirador + Piloto).
5.  Divisão do valor restante entre os jogadores.
6.  Adição do Bónus de Elite (individualmente, após a divisão).