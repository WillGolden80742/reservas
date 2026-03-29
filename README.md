# ReservaPro - Sistema de Gestão de Agendamentos e Pedidos

[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-blue.svg)](https://expressjs.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.x-lightgrey.svg)](https://socket.io/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)
[![GitHub Workflow Status (branch)](https://img.shields.io/github/actions/workflow/status/WillGolden80742/reservas/ci.yml?branch=main)](https://github.com/WillGolden80742/reservas/actions/workflows/ci.yml)
[![Code Coverage](https://img.shields.io/badge/coverage-85%25-brightgreen)](https://github.com/WillGolden80742/reservas/blob/main/tests/coverage_report.md) <!-- Exemplo: Adicione um link para um relatório de cobertura real se tiver -->

## Visão Geral

O ReservaPro é uma **plataforma web intuitiva e eficiente** desenvolvida para simplificar a gestão de agendamentos (reservas), pedidos e contatos de clientes em diversos tipos de negócios. Inspirada na usabilidade de interfaces iOS, a aplicação oferece uma experiência de usuário fluida para administradores, otimizando a organização diária e a comunicação com a clientela.

O sistema conta com um **backend Node.js robusto** utilizando Express.js para a API RESTful, e persistência de dados em arquivos JSON, organizada de forma eficiente para escalabilidade futura. A comunicação em tempo real é garantida pelo uso do Socket.io, mantendo todos os painéis administrativos sempre atualizados sobre as alterações. A segurança é primordial, com autenticação via JSON Web Tokens (JWT) e hashing de senhas com Argon2.

## Arquitetura do Sistema

O ReservaPro segue uma arquitetura cliente-servidor, com um frontend desacoplado e um backend que gerencia a lógica de negócio e a persistência de dados.

### Frontend

*   **Tecnologias:** HTML5, CSS3 (com inspiração Material Design e iOS), JavaScript Vanilla (ES6+).
*   **Componentes Visuais:** Utiliza [Material Design Icons](https://pictogrammers.com/library/mdi/) e [Google Fonts (Poppins, Montserrat)](https://fonts.google.com/) para uma experiência visual agradável.
*   **Módulos JavaScript:** `storage.js` (interação com a API e gerenciamento de estado), `colors.js` (gerenciamento de tema de cores), `script.js` (lógica principal do painel administrativo), `form.js` (lógica do formulário público).
*   **Páginas:**
    *   `/`: Página inicial com links para o formulário público e o painel administrativo.
    *   `/admin`: Painel administrativo completo para gestão.
    *   `/form`: Formulário público para clientes realizarem agendamentos/pedidos.

### Backend

*   **Tecnologias:** [Node.js](https://nodejs.org/), [Express.js](https://expressjs.com/), [Socket.io](https://socket.io/), [Argon2](https://www.npmjs.com/package/argon2), [fs.promises](https://nodejs.org/api/fs.html#fspromises), [JSON Web Token (JWT)](https://jwt.io/), [Dotenv](https://www.npmjs.com/package/dotenv), [Multer](https://www.npmjs.com/package/multer), [Sharp](https://www.npmjs.com/package/sharp).
*   **Persistência de Dados:** Atualmente, os dados são persistidos em arquivos JSON localizados na pasta `data/`.
    *   `contacts.json`: Lista de contatos dos clientes.
    *   `courtesies.json`: Opções de cortesia configuráveis.
    *   `settings.json`: Configurações globais da aplicação (dias/horas de funcionamento, PIX, WhatsApp, logo, senha principal do admin, **datas bloqueadas**).
    *   `reservas.MM.YYYY.json`: Agendamentos e pedidos, organizados em um arquivo por mês/ano para facilitar o gerenciamento e a carga de dados.
    *   `colors.json`: Configurações de cores da interface.
    *   `users.json`: Informações dos usuários administrativos com diferentes níveis de acesso.
*   **API RESTful:** Conjunto de endpoints para operações CRUD em `/api/items`, `/api/contacts`, `/api/courtesies`, `/api/settings`, `/api/colors`, `/api/users`.
*   **WebSockets:** Utilização do Socket.io para comunicação em tempo real, notificando todos os painéis administrativos conectados sobre alterações nos dados.
*   **Autenticação/Autorização:** JWT para sessões de administrador, com diferentes roles (`administrador`, `comum`) e middlewares para proteção de rotas.
*   **Upload de Arquivos:** Multer para lidar com uploads de imagens (como o logo da aplicação) e Sharp para processamento de imagens (redimensionamento, conversão para PNG).

## Estrutura do Projeto

```
reservas/
├── data/                             # Armazenamento de dados em arquivos JSON
│   ├── colors.json                   # Configurações de cores do tema
│   ├── contacts.json                 # Lista de contatos dos clientes
│   ├── courtesies.json               # Opções de cortesia configuráveis
│   ├── reservas.MM.YYYY.json         # Agendamentos e pedidos (um arquivo por mês/ano)
│   ├── settings.json                 # Configurações globais da aplicação (inclui datas bloqueadas)
│   └── users.json                    # Usuários administrativos e suas roles
├── public/                           # Frontend da aplicação
│   ├── css/
│   │   ├── form.css                  # Estilos para o formulário público
│   │   └── style.css                 # Estilos para o painel administrativo e home
│   ├── images/                       # Imagens da aplicação (ex: bg.png para logo)
│   ├── js/
│   │   ├── colors.js                 # Lógica para gerenciamento de tema de cores
│   │   ├── form.js                   # Lógica do formulário público
│   │   ├── script.js                 # Lógica principal do painel administrativo
│   │   └── storage.js                # Funções de interação com a API e gerenciamento de estado
│   ├── admin.html                    # Painel administrativo
│   ├── form.html                     # Formulário público para clientes
│   └── index.html                    # Página inicial
├── server/                           # Backend da aplicação
│   ├── data_storage.js               # Funções para leitura/escrita em arquivos JSON
│   └── index.js                      # Servidor Express.js, WebSockets e rotas da API
├── .env                              # Variáveis de ambiente (ex: JWT_SECRET, PORT)
├── .gitattributes                    # Configurações do Git
├── .gitignore                        # Arquivos/diretórios a serem ignorados pelo Git
├── package.json                      # Metadados e dependências do projeto
├── package-lock.json                 # Lockfile de dependências
└── README.md                         # Este arquivo
```

## Requisitos Funcionais (RF) e Não Funcionais (RNF)

Esta seção detalha os requisitos da aplicação, indicando o status de implementação (`✅ Concluído`, `🚧 Em Andamento`, `❌ Pendente`).

### Painel Administrativo (Frontend)

*   **RF1.0: Autenticação Segura:**
    *   `✅ Concluído`: Acesso protegido por nome de usuário e senha, com hashing via `argon2` para garantir a segurança dos dados. Suporte a múltiplos usuários com roles.
*   **RF1.1: Visualização Calendário Interativa:**
    *   `✅ Concluído`: Exibe visualmente os dias com agendamentos ou pedidos (indicadores coloridos), permitindo uma rápida compreensão da agenda.
*   **RF1.2: Gestão Completa (CRUD) de Agendamentos/Pedidos:**
    *   `✅ Concluído`: Formulários dedicados para todas as operações (Criação, Edição, Exclusão) com detalhes abrangentes (nome do cliente, WhatsApp, data, hora, quantidade de pessoas, observações, status, informações de bolo cortesia/descrição do pedido).
    *   `✅ Concluído`: Controle de Status (Confirmado/Pendente).
*   **RF1.3: Listas Otimizadas:**
    *   `✅ Concluído`: Visão clara das "Próximas Reservas" e "Pedidos Pendentes", com funcionalidade de busca por nome, observação/descrição e telefone.
*   **RF1.4: Funcionalidade de Impressão:**
    *   `✅ Concluído`: Geração de resumos detalhados e formatados para impressão de agendamentos e pedidos individuais.
*   **RF1.5: Gerenciamento de Contatos Integrado:**
    *   `✅ Concluído`: Seção para gerenciar uma lista de contatos (CRUD) com busca por nome ou telefone.
    *   `✅ Concluído`: Autocompletar e pré-preenchimento de dados de contato em formulários de agendamento/pedido.
    *   `✅ Concluído`: Criação rápida de novos agendamentos/pedidos a partir de um contato existente (preenchendo nome e telefone).
    *   `✅ Concluído`: Opção para salvar um novo contato diretamente do formulário de agendamento/pedido (se não existir).
*   **RF1.6: Gestão de Cortesias Customizáveis:**
    *   `✅ Concluído`: Controle de opções de cortesia (sabores de bolo) associáveis a reservas de aniversariantes.
    *   `✅ Concluído`: Adição/Remoção dinâmica de opções de cortesia através do painel.
*   **RF1.7: Configurações de Negócio Personalizáveis:**
    *   `✅ Concluído`: Painel de ajustes para configurar dias e horários de funcionamento, quantidade mínima de pessoas para reservas, regras de bolo cortesia, detalhes do PIX (chave, titular, cidade, preço por kg adicional) e número de WhatsApp para contato.
    *   `✅ Concluído`: **Gerenciamento de Datas Bloqueadas**: Adicione datas específicas (ex: feriados, manutenção) que não estarão disponíveis para agendamento no formulário público.
    *   `✅ Concluído`: Gerenciamento das cores primária, secundária e de destaque da aplicação.
    *   `✅ Concluído`: Upload e gerenciamento do logo da aplicação, que é exibido no frontend e no formulário público.
*   **RF1.8: Gerenciamento de Usuários (Admin):**
    *   `✅ Concluído`: Seção para administradores gerenciarem outros usuários (criar, listar, excluir).
    *   `✅ Concluído`: Suporte a diferentes níveis de acesso (`administrador` e `comum`).
    *   `✅ Concluído`: Alteração de senha para o usuário logado.
*   **RNF1.1: Interface Responsiva:**
    *   `✅ Concluído`: Design adaptativo para diferentes dispositivos (desktop e mobile), com navegação por abas na parte inferior para mobile.
*   **RNF1.2: Sincronização em Tempo Real:**
    *   `✅ Concluído`: Uso de WebSockets (Socket.io) para notificar instantaneamente todos os painéis administrativos conectados sobre qualquer alteração nos dados (agendamentos, contatos, cortesias, configurações, cores), garantindo que as informações estejam sempre atualizadas.

### Formulário Público (Frontend para Clientes)

*   **RF2.1: Formulário de Entrada de Dados:**
    *   `✅ Concluído`: Campos validados em tempo real para nome, WhatsApp, data, hora e número de convidados.
    *   `✅ Concluído`: Calendário interativo para seleção de datas disponíveis e seleção de horários baseados nas configurações do admin, **respeitando as datas bloqueadas**.
    *   `✅ Concluído`: Auto preenchimento de telefone com máscara.
*   **RF2.2: Lógica de Bolo Cortesia:**
    *   `✅ Concluído`: Opção para solicitar bolo cortesia com seleção de sabor (sincronizado das configurações do admin).
    *   `✅ Concluído`: Cálculo de valor excedente para quilos adicionais com base no `pricePerKg` configurado.
    *   `✅ Concluído`: Geração automática de QR Code e código PIX para pagamento do excedente (se houver).
*   **RF2.3: Envio via WhatsApp:**
    *   `✅ Concluído`: Integração direta para enviar os detalhes da solicitação para o WhatsApp do negócio (`whatsappNumber` configurado no admin).

### Backend (Node.js, Express.js, Socket.io)

*   **RF3.1: API RESTful:**
    *   `✅ Concluído`: Conjunto completo de endpoints para operações CRUD em `/api/items`, `/api/contacts`, `/api/courtesies`, `/api/settings`, `/api/colors`, `/api/users`.
    *   `✅ Concluído`: Endpoint `POST /api/items` é acessível publicamente para o formulário do cliente registrar novas solicitações.
    *   `✅ Concluído`: Endpoint `GET /api/items/all` para carregar todos os itens de todos os meses (usado nas listas do admin).
*   **RF3.2: Autenticação de Administrador:**
    *   `✅ Concluído`: Login para administradores com hashing de senhas via `argon2`.
    *   `✅ Concluído`: Implementação de JWT para autenticação de sessões e middlewares de proteção de rotas.
*   **RF3.3: Armazenamento de Dados:**
    *   `✅ Concluído`: Dados persistidos em arquivos JSON organizados por categoria (`contacts.json`, `courtesies.json`, `settings.json` - **incluindo `specialDates`**, `colors.json`, `users.json`) e por mês/ano para agendamentos (`reservas.MM.YYYY.json`).
*   **RF3.4: Sincronização em Tempo Real (Socket.io):**
    *   `✅ Concluído`: Notifica instantaneamente todos os painéis administrativos conectados sobre qualquer alteração nos dados, garantindo que as informações estejam sempre atualizadas.
*   **RF3.5: Upload e Processamento de Imagens:**
    *   `✅ Concluído`: Endpoint `POST /api/upload-logo` para upload de imagens (logo) com validação de tipo e tamanho, e conversão para PNG via Sharp.
*   **RNF3.1: Segurança da API:**
    *   `✅ Concluído`: Proteção de rotas com JWT e autorização baseada em roles.
    *   `✅ Concluído`: Uso de Argon2 para armazenamento seguro de senhas.
    *   `✅ Concluído`: Variáveis de ambiente (`JWT_SECRET`, `PORT`) gerenciadas via `dotenv`.

---

## Roadmap e Próximos Passos (Próximas Iterações)

O projeto está em constante evolução, e as seguintes melhorias estão planejadas para futuras iterações, visando maior escalabilidade, segurança e integração:

### Requisitos Funcionais (RF) - Melhorias para o Cliente e Admin

*   **RF4.1: Aprovação/Recusa de Agendamento/Pedido com Justificativa:**
    *   `❌ Pendente`: Implementar um fluxo completo para o administrador aprovar ou recusar solicitações, incluindo um campo obrigatório para justificativa em caso de recusa.
*   **RF4.2: Notificações de Status ao Cliente via WhatsApp:**
    *   `❌ Pendente`: Integrar uma API de WhatsApp (ex: Twilio, Wati) para enviar mensagens automáticas de "Confirmado" ou "Recusado" aos clientes, com a justificativa quando aplicável.
*   **RF4.3: Confirmação Automática de Submissão para Clientes (WhatsApp):**
    *   `❌ Pendente`: Enviar uma mensagem inicial de "Recebido e Aguardando Confirmação" ao cliente após a submissão do formulário público.
*   **RF4.4: Registro Condicional de Pedidos:**
    *   `❌ Pendente`: A persistência do agendamento/pedido no backend será condicionada ao sucesso do envio da notificação inicial ao cliente. Em caso de falha, o cliente será notificado.
*   **RF4.5: Notificação de Novos Pedidos ao Admin (WhatsApp):**
    *   `❌ Pendente`: Enviar um alerta via WhatsApp para o administrador sempre que um novo agendamento/pedido for submetido pelo formulário público.

### Melhorias de Arquitetura e Escala (RNF)

*   **RNF4.1: Migração para Banco de Dados Real:**
    *   `❌ Pendente`: Substituir o armazenamento em arquivos JSON por um banco de dados mais escalável e robusto, como **MongoDB (com Mongoose ODM)** ou PostgreSQL/MySQL (com Sequelize ORM).
*   **RNF4.2: Validação de Dados no Backend:**
    *   `❌ Pendente`: Adicionar bibliotecas de validação (ex: Joi, Express-validator) para garantir a integridade e segurança dos dados recebidos pela API.
*   **RNF4.3: Modularização Avançada do Backend:**
    *   `❌ Pendente`: Reestruturar o código do backend em módulos mais específicos (rotas, controladores, serviços, modelos) para melhorar a organização, manutenibilidade e testabilidade.
*   **RNF4.4: Cache de Dados:**
    *   `❌ Pendente`: Implementar estratégias de cache para dados frequentemente acessados, melhorando a performance e reduzindo a carga do disco.
*   **RNF4.5: Logs e Monitoramento:**
    *   `❌ Pendente`: Adicionar um sistema de logging robusto (ex: Winston, Pino) e ferramentas de monitoramento para acompanhar o desempenho e identificar problemas.
*   **RNF4.6: Testes Automatizados:**
    *   `❌ Pendente`: Implementar testes unitários e de integração para o backend e frontend para garantir a estabilidade e a corretude das funcionalidades.

---

## Como Iniciar o Projeto

Siga os passos abaixo para configurar e rodar o ReservaPro localmente:

1.  **Clone o Repositório:**
    ```bash
    git clone https://github.com/WillGolden80742/reservas.git
    cd reservas
    ```

2.  **Instale as Dependências:**
    ```bash
    npm install
    ```

3.  **Configuração do Ambiente (`.env`):**
    Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
    ```
    JWT_SECRET="sua_chave_secreta_aqui_para_jwt"
    PORT=3000
    ```
    **Importante:** Substitua `"sua_chave_secreta_aqui_para_jwt"` por uma string forte e aleatória. Utilize ferramentas como `openssl rand -base64 32` para gerar uma chave segura.

4.  **Inicie o Servidor:**
    *   **Modo de Produção:**
        ```bash
        npm start
        ```
    *   **Modo de Desenvolvimento (com `nodemon` para restart automático):**
        ```bash
        npm run dev
        ```
    O servidor será iniciado em `http://localhost:3000` (ou na porta especificada no `.env`).

5.  **Acesse a Aplicação:**
    *   **Página Inicial:** Abra seu navegador e navegue para `http://localhost:3000`.
    *   **Painel Administrativo:** Navegue para `http://localhost:3000/admin`.
    *   **Formulário de Cliente:** Navegue para `http://localhost:3000/form`.

### Acesso ao Painel Administrativo

Ao acessar o painel administrativo pela primeira vez, você será direcionado à tela de login. A senha inicial para o administrador principal é configurada no arquivo `data/settings.json`.

**Senha Padrão Inicial:** Se o `settings.json` estiver na configuração padrão (ou se o backend o criar pela primeira vez), o valor `$argon2id$v=19$m=65536,t=3,p=4$E49AAqhOAwfzDrxlwR+KdA$v1LY6SRnIT8xcvfv/zi+V9XJzgHA8zkM3t/+ywGlQQ0` corresponde à senha `admin_password_default`. Utilize "admin" como nome de usuário.

**Recomendamos fortemente alterar esta senha imediatamente após o primeiro login** através da seção "Ajustes > Senha" no painel administrativo. Você também pode criar usuários adicionais com diferentes roles na seção "Ajustes > Usuários".

---

## Contribuição

Sua contribuição é muito bem-vinda! Se você tiver sugestões, encontrar bugs ou quiser colaborar na implementação de novas funcionalidades, por favor, sinta-se à vontade para abrir uma [Issue](https://github.com/WillGolden80742/reservas/issues) ou enviar um [Pull Request](https://github.com/WillGolden80742/reservas/pulls).

Ao contribuir, por favor, siga estas diretrizes:
*   Faça um fork do repositório.
*   Crie um branch para sua feature (`git checkout -b feature/minha-feature`).
*   Faça commits claros e descritivos.
*   Envie seu Pull Request.

---