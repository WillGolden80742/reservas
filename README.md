# ReservaPro - Sistema de Gestão de Agendamentos e Pedidos

[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-blue.svg)](https://expressjs.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.x-lightgrey.svg)](https://socket.io/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

## Visão Geral

O ReservaPro é uma **plataforma web intuitiva e eficiente** desenvolvida para simplificar a gestão de agendamentos (reservas), pedidos e contatos de clientes em diversos tipos de negócios. Com uma interface de usuário inspirada na usabilidade de interfaces iOS, a aplicação oferece uma experiência fluida para administradores, otimizando a organização diária e a comunicação com a clientela.

Inicialmente concebido com foco no frontend (utilizando `localStorage` para persistência), o projeto evoluiu para incorporar um **backend Node.js robusto** com persistência de dados em arquivos JSON, pavimentando o caminho para futuras integrações com bancos de dados relacionais ou NoSQL. A comunicação em tempo real é garantida pelo uso do Socket.io, mantendo todos os painéis administrativos sempre atualizados.

## Funcionalidades Chave

### Painel Administrativo (Frontend)

O painel de administrador é uma ferramenta completa para o gerenciamento do fluxo de trabalho diário:

*   **Autenticação Segura:** Acesso protegido por senha com hashing via `argon2` para garantir a segurança dos dados.
*   **Visualização Calendário Interativa:** Um calendário que exibe visualmente os dias com agendamentos ou pedidos, permitindo uma rápida compreensão da agenda.
*   **Gestão Completa (CRUD) de Agendamentos/Pedidos:**
    *   **Criação, Edição e Exclusão:** Formulários dedicados para todas as operações, com detalhes abrangentes como nome do cliente, WhatsApp, data, hora, quantidade de pessoas (para reservas), observações, status (Confirmado/Pendente), e informações de bolo cortesia/descrição do pedido.
    *   **Controle de Status:** Gerenciamento visual e funcional do status de cada item.
*   **Listas Otimizadas:**
    *   **Próximas Reservas:** Visão clara das reservas futuras com funcionalidade de busca por nome ou observação.
    *   **Pedidos Pendentes:** Lista dedicada a pedidos futuros, com busca por nome ou descrição.
*   **Funcionalidade de Impressão:** Geração de resumos detalhados e formatados para impressão de agendamentos e pedidos individuais.
*   **Gerenciamento de Contatos Integrado:**
    *   **Cadastro e Busca:** Seção para gerenciar uma lista de contatos com busca por nome ou telefone.
    *   **Integração Inteligente:** Autocompletar e pré-preenchimento de dados de contato em formulários, além de criação rápida de novos agendamentos/pedidos a partir de um contato existente.
    *   **Salvamento Rápido:** Opção para salvar um novo contato diretamente do formulário de agendamento/pedido.
*   **Gestão de Cortesias Customizáveis:**
    *   **Lista Flexível:** Controle de opções de cortesia associáveis a reservas de aniversariantes.
    *   **Adição/Remoção Dinâmica:** Capacidade de gerenciar a lista de cortesias através do painel.
*   **Configurações de Negócio Personalizáveis:**
    *   Painel de ajustes para configurar dias e horários de funcionamento, quantidade mínima de pessoas para reservas, regras de bolo cortesia, detalhes do PIX (chave, titular, cidade, preço por kg adicional) e número de WhatsApp para contato.
*   **Interface Responsiva:** Design adaptativo para diferentes dispositivos, com navegação por abas na parte inferior para mobile.

### Formulário Público (Frontend para Clientes)

Uma interface simplificada e amigável para que os clientes possam realizar solicitações de reserva ou pedido diretamente:

*   **Formulário de Entrada de Dados:** Campos validados em tempo real para nome, WhatsApp, data, hora e número de convidados.
*   **Lógica de Bolo Cortesia:** Opção para solicitar bolo cortesia com seleção de sabor, cálculo de valor excedente para quilos adicionais, e geração automática de QR Code e código PIX para pagamento do excedente.
*   **Envio via WhatsApp:** Integração direta para enviar os detalhes da solicitação para o WhatsApp do negócio.

### Backend (Node.js, Express.js, Socket.io)

O coração da aplicação, responsável pela persistência de dados e comunicação em tempo real:

*   **API RESTful:** Conjunto completo de endpoints para operações CRUD em `/api/items`, `/api/contacts`, `/api/courtesies` e `/api/settings`.
*   **Autenticação de Administrador:** Implementação de login para administradores com hashing de senhas via `argon2`.
*   **Armazenamento de Dados:** Os dados são persistidos em arquivos JSON organizados por categoria (`contacts.json`, `courtesies.json`, `settings.json`) e por mês/ano para agendamentos (`reservas.MM.YYYY.json`).
*   **Sincronização em Tempo Real (Socket.io):** Notifica instantaneamente todos os painéis administrativos conectados sobre qualquer alteração nos dados, garantindo que as informações estejam sempre atualizadas.
*   **Rotas Públicas:** O endpoint `POST /api/items` é acessível publicamente para o formulário do cliente registrar novas solicitações.

## Estrutura do Projeto

```
reservas/
├── data/                             # Armazenamento de dados em arquivos JSON
│   ├── contacts.json                 # Lista de contatos dos clientes
│   ├── courtesies.json               # Opções de cortesia configuráveis
│   ├── reservas.MM.YYYY.json         # Agendamentos e pedidos (um arquivo por mês/ano)
│   └── settings.json                 # Configurações globais da aplicação
├── public/                           # Frontend da aplicação
│   ├── css/
│   │   ├── formulario_clientes.css   # Estilos para o formulário público
│   │   └── style.css                 # Estilos para o painel administrativo
│   ├── js/
│   │   ├── formulario_clientes.js    # Lógica do formulário público
│   │   ├── script.js                 # Lógica principal do painel administrativo
│   │   └── storage.js                # Funções de interação com a API e gerenciamento de estado
│   ├── formulario_clientes.html      # Formulário público para clientes
│   └── index.html                    # Painel administrativo
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

## Tecnologias Utilizadas

*   **Frontend:**
    *   HTML5, CSS3 (com inspiração em Material Design e iOS), JavaScript Vanilla (ES6+)
    *   [Material Design Icons](https://pictogrammers.com/library/mdi/)
    *   [Google Fonts (Poppins, Montserrat)](https://fonts.google.com/)
*   **Backend:**
    *   [Node.js](https://nodejs.org/)
    *   [Express.js](https://expressjs.com/) (Framework web robusto)
    *   [Socket.io](https://socket.io/) (WebSockets para comunicação em tempo real)
    *   [Argon2](https://www.npmjs.com/package/argon2) (Para hashing seguro de senhas)
    *   [fs.promises](https://nodejs.org/api/fs.html#fspromises) (Módulo nativo para manipulação assíncrona de arquivos)
    *   [JSON Web Token (JWT)](https://jwt.io/) (Para autenticação de sessões de administrador)
    *   [Dotenv](https://www.npmjs.com/package/dotenv) (Para gerenciamento de variáveis de ambiente)

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
    **Importante:** Substitua `"sua_chave_secreta_aqui_para_jwt"` por uma string forte e aleatória.

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
    *   **Painel Administrativo:** Abra seu navegador e navegue para `http://localhost:3000/admin`.
    *   **Formulário de Cliente:** Abra seu navegador e navegue para `http://localhost:3000/form`.

### Acesso ao Painel Administrativo

Ao acessar o painel administrativo pela primeira vez, você será direcionado à tela de login. A senha inicial para o administrador é configurada no arquivo `data/settings.json`. O valor padrão `$argon2id$v=19$m=65536,t=3,p=4$E49AAqhOAwfzDrxlwR+KdA$v1LY6SRnIT8xcvfv/zi+V9XJzgHA8zkM3t/+ywGlQQ0` corresponde à senha `admin_password_default`. Recomendamos alterar esta senha após o primeiro login.

## Roadmap e Próximos Passos

O projeto está em constante evolução, e as seguintes melhorias estão planejadas para futuras iterações, visando maior escalabilidade, segurança e integração:

### Requisitos Funcionais (RF) - Melhorias para o Cliente e Admin

*   **RF1.5: Aprovação/Recusa de Agendamento/Pedido com Justificativa:** Implementar um fluxo completo para o administrador aprovar ou recusar solicitações, incluindo um campo obrigatório para justificativa em caso de recusa.
*   **RF1.5.2: Notificações de Status ao Cliente via WhatsApp:** Integrar uma API de WhatsApp (ex: Twilio, Wati) para enviar mensagens automáticas de "Confirmado" ou "Recusado" aos clientes, com a justificativa quando aplicável.
*   **RF4.2: Confirmação Automática de Submissão para Clientes (WhatsApp):** Enviar uma mensagem inicial de "Recebido e Aguardando Confirmação" ao cliente após a submissão do formulário público.
*   **RF4.3: Registro Condicional de Pedidos:** A persistência do agendamento/pedido no backend será condicionada ao sucesso do envio da notificação inicial ao cliente. Em caso de falha, o cliente será notificado.
*   **RF4.4: Notificação de Novos Pedidos ao Admin (WhatsApp):** Enviar um alerta via WhatsApp para o administrador sempre que um novo agendamento/pedido for submetido pelo formulário público.
*   **RF5.1/RF5.2: Autenticação JWT e Proteção de Rotas:** Reforçar a implementação de JWT para sessões de administrador e aplicar middlewares de autenticação robustos para proteger todas as rotas da API.

### Melhorias de Arquitetura e Escala

*   **Migração para Banco de Dados Real:** Substituir o armazenamento em arquivos JSON por um banco de dados mais escalável e robusto, como **MongoDB (com Mongoose ODM)** ou PostgreSQL/MySQL (com Sequelize ORM).
*   **Validação de Dados no Backend:** Adicionar bibliotecas de validação (ex: Joi, Express-validator) para garantir a integridade e segurança dos dados recebidos pela API.
*   **Modularização Avançada do Backend:** Reestruturar o código do backend em módulos mais específicos (rotas, controladores, serviços, modelos) para melhorar a organização, manutenibilidade e testabilidade.
*   **Gerenciamento de Usuários:** Implementar um sistema de gerenciamento de usuários mais avançado para administradores, permitindo diferentes níveis de acesso (ex: admin, editor).

## Contribuição

Sua contribuição é muito bem-vinda! Se você tiver sugestões, encontrar bugs ou quiser colaborar na implementação de novas funcionalidades, por favor, sinta-se à vontade para abrir uma [Issue](https://github.com/WillGolden80742/reservas/issues) ou enviar um [Pull Request](https://github.com/WillGolden80742/reservas/pulls).

## Licença

Este projeto está licenciado sob a [Licença ISC](LICENSE).
