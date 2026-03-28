# ReservaPro - Sistema de Gestão de Agendamentos e Pedidos

## Visão Geral

O ReservaPro é uma aplicação web intuitiva e eficiente projetada para otimizar o gerenciamento de agendamentos (reservas), pedidos e contatos de clientes para negócios. Inspirada na usabilidade de interfaces iOS, a aplicação oferece uma experiência de usuário fluida para administradores, facilitando a organização diária e a comunicação com os clientes.

O projeto foi inicialmente desenvolvido com uma abordagem frontend-first, utilizando `localStorage` para persistência de dados. Agora, ele evoluiu para incluir um backend Node.js robusto com armazenamento de dados baseado em arquivos JSON, preparando-o para futuras integrações com bancos de dados reais.

## Funcionalidades

### Frontend (Admin)

O painel administrativo oferece um conjunto completo de ferramentas para gerenciar o fluxo de trabalho diário:

*   **Autenticação de Administrador:** Acesso protegido por senha para garantir que apenas usuários autorizados possam gerenciar as informações.
*   **Visualização em Calendário:** Um calendário interativo que destaca visualmente os dias com reservas ou pedidos, permitindo uma rápida visão geral da agenda.
*   **Gerenciamento de Agendamentos/Pedidos (CRUD):**
    *   **Criação/Edição/Exclusão:** Formulários dedicados para adicionar novos agendamentos ou pedidos, com opções para editar e remover itens existentes.
    *   **Detalhes Abrangentes:** Cada item pode conter nome do cliente, telefone, horário, quantidade de pessoas (para reservas), observações, status (Confirmado/Pendente), se é aniversariante e qual cortesia (para reservas), ou descrição do pedido (para pedidos).
    *   **Status de Agendamento:** Controle visual e funcional do status de cada agendamento/pedido.
*   **Listas Organizadas:**
    *   **Próximas Reservas:** Uma lista clara e concisa das reservas futuras, com funcionalidade de busca por nome ou observação.
    *   **Pedidos Pendentes:** Uma lista dedicada a pedidos futuros, com busca por nome ou descrição.
*   **Impressão:** Geração de um resumo detalhado e formatado para impressão de agendamentos e pedidos individuais.
*   **Gerenciamento de Contatos:**
    *   **Lista Completa:** Uma seção dedicada para gerenciar uma lista de contatos, com busca por nome ou telefone.
    *   **CRUD de Contatos:** Adicione, edite ou remova contatos com nome, telefone e notas.
    *   **Integração com Agendamentos/Pedidos:**
        *   **Autocompletar Inteligente:** Sugestões de contatos existentes ao digitar no campo "Nome do Cliente" nos formulários de agendamento/pedido.
        *   **Pré-preenchimento Automático:** Seleção de um contato da lista de sugestões preenche automaticamente o nome e telefone.
        *   **Criação Rápida de Item:** Botões diretos na tela de contatos para iniciar um novo agendamento ou pedido, já pré-preenchido com os dados do contato.
        *   **Salvar Contato:** Opção para salvar um cliente como novo contato diretamente do formulário de agendamento/pedido.
*   **Gerenciamento de Cortesias:**
    *   **Lista Customizável:** Gerencie uma lista de opções de cortesia que podem ser associadas a reservas de aniversariantes.
    *   **Adicionar/Remover:** Adicione ou remova opções de cortesia dinamicamente.
    *   **Seleção Flexível:** Selecione a cortesia no formulário de reserva, com opções de busca e adição de novas no modal.
*   **Configurações do Negócio:**
    *   Um painel de configurações permite ao administrador personalizar:
        *   Dias e horários de funcionamento para reservas.
        *   Quantidade mínima de pessoas para uma reserva.
        *   Regras e opções de bolo cortesia.
        *   Detalhes do PIX (chave, titular, cidade, preço por kg adicional).
        *   Número de WhatsApp para contato do negócio.
*   **Interface Responsiva:** Design otimizado para dispositivos móveis, com navegação por abas na parte inferior.

### Frontend (Formulário de Cliente)

*   **Formulário Público de Reserva/Pedido:** Uma interface simplificada e amigável para clientes realizarem solicitações de reserva ou pedido diretamente.
*   **Validação de Entrada:** Validação em tempo real de campos como nome, WhatsApp, data, hora e quantidade de convidados.
*   **Lógica de Bolo Cortesia:** Opção para o cliente solicitar bolo cortesia com seleção de sabor e cálculo de valor excedente para quilos adicionais, incluindo geração de QR Code e código PIX.
*   **Envio via WhatsApp:** Integração para enviar os detalhes da reserva/pedido diretamente para o WhatsApp do negócio.

### Backend (Node.js)

O backend, construído com Express.js e Socket.io, gerencia a persistência dos dados e a comunicação em tempo real:

*   **API RESTful:** Endpoints para todas as operações CRUD (`/api/items`, `/api/contacts`, `/api/courtesies`, `/api/settings`).
*   **Autenticação:** Sistema de login para administradores usando `argon2` para hashing seguro de senhas.
*   **Armazenamento de Dados:** Dados de agendamentos, contatos, cortesias e configurações são armazenados em arquivos JSON na pasta `data/`. Agendamentos são organizados por mês/ano.
*   **Sincronização em Tempo Real:** Utiliza Socket.io para notificar todos os clientes (painéis administrativos) conectados sobre qualquer alteração nos dados (agendamentos, contatos, cortesias, configurações), garantindo que todos vejam as informações mais atualizadas instantaneamente.
*   **Rotas Públicas:** `POST /api/items` permite que o formulário do cliente envie novas solicitações de agendamento/pedido.

## Estrutura do Projeto

```
reservas/
├── data/
│   ├── contacts.json          # Armazenamento de contatos
│   ├── courtesies.json        # Armazenamento de opções de cortesia
│   ├── reservas.MM.YYYY.json  # Agendamentos e pedidos (um arquivo por mês/ano)
│   └── settings.json          # Configurações gerais da aplicação
├── public/
│   ├── css/
│   │   ├── formulario_clientes.css # Estilos do formulário público
│   │   └── style.css           # Estilos do painel administrativo
│   ├── js/
│   │   ├── formulario_clientes.js  # Lógica do formulário público
│   │   ├── script.js           # Lógica principal do painel administrativo
│   │   └── storage.js          # Funções de interação com a API (frontend)
│   ├── formulario_clientes.html# Formulário público para clientes
│   └── index.html              # Painel administrativo
├── server/
│   ├── data_storage.js         # Funções para leitura/escrita de arquivos JSON
│   └── index.js                # Servidor Express.js e WebSockets
├── .gitattributes              # Configurações do Git LFS (se aplicável)
├── .gitignore                  # Arquivos/diretórios a serem ignorados pelo Git
├── package.json                # Metadados e dependências do projeto
├── package-lock.json           # Lockfile de dependências
└── README.md                   # Este arquivo
```

## Tecnologias Utilizadas

*   **Frontend:**
    *   HTML5
    *   CSS3 (com inspiração em Material Design Icons e iOS)
    *   JavaScript Vanilla (com uso de ES6+)
    *   [Material Design Icons](https://pictogrammers.com/library/mdi/)
    *   [Google Fonts (Poppins, Montserrat)](https://fonts.google.com/)
*   **Backend:**
    *   [Node.js](https://nodejs.org/)
    *   [Express.js](https://expressjs.com/) (Framework web)
    *   [Socket.io](https://socket.io/) (WebSockets para comunicação em tempo real)
    *   [Argon2](https://www.npmjs.com/package/argon2) (Para hashing seguro de senhas de administrador)
    *   [fs.promises](https://nodejs.org/api/fs.html#fspromises) (Módulo nativo para operações assíncronas com arquivos)

## Como Iniciar o Projeto

Para configurar e rodar o ReservaPro localmente:

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/WillGolden80742/reservas.git
    cd reservas
    ```

2.  **Instale as dependências do Node.js:**
    ```bash
    npm install
    ```

3.  **Inicie o servidor:**
    *   Para iniciar em modo de produção:
        ```bash
        npm start
        ```
    *   Para iniciar em modo de desenvolvimento (com `nodemon` para restart automático):
        ```bash
        npm run dev
        ```

    O servidor será iniciado em `http://localhost:3000` (ou na porta definida pela variável de ambiente `PORT`).

4.  **Acesse a aplicação:**
    *   **Painel Administrativo:** Abra seu navegador e navegue para `http://localhost:3000/admin`.
    *   **Formulário de Cliente:** Abra seu navegador e navegue para `http://localhost:3000/form`.

### Acesso ao Painel Administrativo

Ao acessar o painel administrativo pela primeira vez, você será solicitado a fazer login. A senha inicial para o administrador é gerenciada no arquivo `data/settings.json`. Você pode configurá-la diretamente lá (o valor padrão `$argon2id$v=19$m=65536,t=3,p=4$E49AAqhOAwfzDrxlwR+KdA$v1LY6SRnIT8xcvfv/zi+V9XJzgHA8zkM3t/+ywGlQQ0` corresponde a `admin_password_default`).

**Importante:** Em um ambiente de produção real, é crucial usar variáveis de ambiente para senhas e chaves, e considerar um sistema de gerenciamento de usuários mais robusto, como o MongoDB com Mongoose, conforme proposto nos próximos passos.

## Próximos Passos (Propostas de Implementação Futuras)

Para levar o ReservaPro ao próximo nível, as seguintes propostas de implementação estão no roadmap, visando aprimorar a escalabilidade, segurança e funcionalidades:

### Requisitos Funcionais (RF)

#### RF1: Gerenciamento de Agendamentos/Pedidos (Admin)

*   **RF1.5: Aprovação/Recusa de Agendamento/Pedido:**
    *   **Backend:** Endpoint `PUT /api/items/:id/status` para alterar o status.
    *   **RF1.5.1: Justificativa de Recusa:** Campo `justification` obrigatório no payload da requisição `PUT` para recusa.
    *   **RF1.5.2: Notificação de Status ao Cliente (WhatsApp):**
        *   **Integração:** Implementação de uma integração com uma API de WhatsApp (ex: Twilio, Wati, ou biblioteca de Node.js para WhatsApp Web) para enviar mensagens programaticamente.
        *   **Lógica:** No backend, após a atualização do status, disparar a função de envio de mensagem com template customizado para "Confirmado" ou "Recusado" (incluindo a justificativa).

#### RF4: Funcionalidades de Cliente (Link Público)

*   **RF4.2: Notificação de Submissão (WhatsApp - Cliente):**
    *   **Backend:** Após receber a submissão, *tentar* enviar uma mensagem de confirmação inicial via API de WhatsApp para o cliente.
    *   **Modelo de Mensagem:** "Olá [Nome], seu agendamento/pedido para [Data] às [Hora] foi recebido e está aguardando confirmação. Em breve entraremos em contato!"
*   **RF4.3: Registro Condicional de Agendamento/Pedido:**
    *   **Backend:** A lógica de persistência do agendamento/pedido no banco de dados deve ser condicionada ao sucesso do envio da notificação (RF4.2).
    *   **Retorno ao Cliente:** Se a notificação falhar, o backend deve retornar um erro específico para o frontend do cliente, que exibirá uma mensagem como "Não foi possível registrar seu pedido. Por favor, verifique seu número de WhatsApp ou entre em contato diretamente."
*   **RF4.4: Notificação de Agendamento/Pedido (WhatsApp - Admin):**
    *   **Backend:** Se o RF4.3 for bem-sucedido, enviar uma notificação via API de WhatsApp para o administrador (ou um grupo de administradores).
    *   **Modelo de Mensagem:** "🚨 Novo Agendamento/Pedido Pendente de [Nome do Cliente] para [Data] às [Hora]. Acesse o painel para revisar."

#### RF5: Autenticação e Autorização (Admin)

*   **RF5.1: Login de Administrador:**
    *   **Backend:** Implementação de estratégias de autenticação (ex: JWT - JSON Web Tokens) com endpoints `POST /auth/login`. (Parcialmente implementado, mas JWT para sessões persistentes é um próximo passo).
    *   **Frontend:** Uma tela de login dedicada para administradores.
*   **RF5.2: Proteção de Rotas Admin:**
    *   **Backend:** Middleware de autenticação para proteger todas as rotas `/api/*`.
    *   **Autorização:** Possibilidade de implementar diferentes níveis de usuário, se necessário (ex: `admin`, `editor`).

### Melhorias de Arquitetura e Escala

*   **Banco de Dados Real:** Migrar o armazenamento de dados de arquivos JSON para um banco de dados relacional (PostgreSQL, MySQL com Sequelize ORM) ou NoSQL (MongoDB com Mongoose ODM) para maior escalabilidade, robustez e capacidade de consulta.
*   **Validação Robusta:** Implementar bibliotecas de validação no backend (Joi ou Express-validator) para garantir a integridade dos dados.
*   **Variáveis de Ambiente:** Utilizar `dotenv` para gerenciar variáveis de ambiente, especialmente para senhas e chaves de API, aumentando a segurança.
*   **Modularização do Backend:** Refatorar o backend em uma estrutura mais modular (rotas, controladores, serviços/modelos) para melhor organização e manutenção.

## Contribuição

Contribuições são sempre bem-vindas! Se você tiver sugestões, relatórios de bugs ou quiser implementar novas funcionalidades, sinta-se à vontade para abrir uma issue ou enviar um pull request.

## Licença

Este projeto está licenciado sob a licença ISC.
