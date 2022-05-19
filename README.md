# PROJETO DE ESTUDOS DE EVENT DRIVEN ARCHITECTURE E HEXAGONAL ARCHITECTURE

## INTRODUÇÃO
### Abordagem
Escolhemos um caso de uso de votação, onde aparece uma pequena lista de opções e apenas uma pode ser escolhida por vez. Embora seja um processo simples, o maior desafio é comportar picos de acesso extremamente alto, exigindo um rápido escalonamento da estrutura e a visibilidade de da progressão das contagens deve ser em tempo real, para que os responsáveis tenham visbilidade imediata.
> Inspirado no modelo do BBB, que atingiu uma volumetria de 3M de votos por minuto e repercutiu fortemente na comunidade de desenvolvimento, com diversas lives e entrevisatas da equipe responsável. 
Boa parte desse material está disponível no Youtube.

## TO-DOs
São tantos que preciso da ajuda de vocês pra montar essa lista, mas vou colocar algumas coisas que acredito que possam ser úteis
- [ ] Front-end de votação
- [ ] Front-end de monitoramento
- [ ] 100% de cobertura de testes

## Código de conduta
Inicialmente será apenas o nosso grupo de estudos que terá os PRs aprovados. Pra isso, basta avisar la no Whatsapp e vou autorizando aqui  

## DESENVOLVIMENTO
### Ambiente
Foi criado um arquivo dockercompose.yml, para execução local e ambiente de desenvolvimento em container 
O arquivo dockerfile pode ser utilizado para "containerizar" as aplicações desenvolvidas e é referenciado no dockercompose. Pode ser utilizado como modelo ao construir a esteira de CI/CD.
O arquivo devcontainer.json não está devidamente configurado, devido um pequeno bug de compatibilidade entre o Visual Studio Code e o PodmanCompose.

### Infra
Temos o RabbitMQ e um cluster com 3 nós do Kafka para realizar a mensageria.
Podemos adicionar mais recursos para enriquecer o modelo, mas considerando sempre a viabilidade do ambiente de desenvolvimento. Nem todos possuem um Core I9 com 64GB de RAM.

### Código
Inicialmente com uma API de captura dos votos, 2 WORKERS que são responsáveis por armazear o voto capturado e fazer a agregação das contagens respectivamente e um servidor Websocket que mantém o front atualizado em tempo real. Ambos desenvolvidos em NodeJS. 

### As aplicações
> **API/BDMem**
> Banco de dados em memória que responde via http, utilizado para simular um BD NO-SQL para os testes iniciais
> **rodando em modo dev**: *"npm run dev-bd-mem"* ou *"yarn dev-bd-mem"*  
> [DockerHub](https://hub.docker.com/r/robsondouglas/eda-sandbox-bdmem)

> **API/Vote**
> Api que disponibiliza os recursos necessários para realizar a votação
> **rodando em modo dev**: *"npm run dev-app-api"* ou *"yarn dev-app-api"*  
> [DockerHub](https://hub.docker.com/r/robsondouglas/eda-sandbox-apivote)

> **Workers/Vote**
> Armazena o voto e dispara o evento de voto capturado
> **rodando em modo dev**: *"npm run dev-worker-vote"* ou *"yarn dev-worker-vote"*  
> [DockerHub](https://hub.docker.com/r/robsondouglas/eda-sandbox-workervote)

 > **Workers/Agregator:** 
 > Gera os agregadores de dados que formarão os dashboards, identifica novos eventos e dispara as notificações via WebSocket
 > **rodando em modo dev**: *"npm run dev-worker-aggregator"* ou *"yarn dev-worker-aggregator"*  
> [DockerHub](https://hub.docker.com/repository/docker/robsondouglas/eda-sandbox-workeraggregator)
 
> **WS/index:** Serviço de websocket, que servirá para comunicação realtime com aplicações front-end.
> **rodando em modo dev**: *"npm run dev-ws"* ou *"yarn dev-ws"*  
> [DockerHub](https://hub.docker.com/r/robsondouglas/eda-sandbox-websocket)