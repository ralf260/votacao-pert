# Sistema de Votação PERT

Este é um sistema simples de votação para estimativas de dias de demanda utilizando a técnica PERT (Program Evaluation and Review Technique). O sistema permite que múltiplos participantes votem nas estimativas de tempo para uma tarefa, em três cenários:

- Pessimista
- Mais Provável
- Otimista

Com as votações dos participantes, o sistema calcula uma estimativa final, que é usada para planejar o tempo de execução da tarefa.

## Funcionalidades

- **Criar Tarefa**: O criador da tarefa define o título, descrição e o número de participantes.
- **Votação**: Cada participante pode votar nos três cenários: pessimismo, probabilidade e otimismo.
- **Resultado**: Quando todos os participantes votam, a média dos votos é calculada e é apresentada a estimativa final dos dias da tarefa.

## Tecnologias Usadas

- **React**: Para construir a interface do usuário.
- **Recharts**: Para gerar o gráfico de barras com a média das estimativas.
- **Tailwind CSS**: Para estilização.

## Como Rodar o Projeto

### Pré-requisitos

Certifique-se de ter o [Node.js](https://nodejs.org/) e o [npm](https://www.npmjs.com/) instalados na sua máquina.

### Passo 1: Clonar o repositório

```bash
git clone https://github.com/SEU_USUARIO/votacao-pert.git
cd votacao-pert
