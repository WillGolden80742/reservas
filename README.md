# ReservaPro - Gestão Inteligente de Agendamentos e Pedidos

## Visão Geral do Projeto

ReservaPro é uma aplicação web intuitiva e eficiente para gerenciar agendamentos (reservas), pedidos e contatos de clientes. Inspirada na usabilidade de interfaces iOS, a aplicação oferece uma experiência de usuário fluida para administradores, facilitando a organização diária e a comunicação com os clientes.

O projeto atual já implementa funcionalidades essenciais no frontend (HTML, CSS, JavaScript) usando armazenamento local (`localStorage`) para persistência de dados. A estrutura é projetada para ser facilmente escalável para um backend Node.js com banco de dados, conforme proposto nos requisitos adicionais.

## Funcionalidades Atuais

### Gerenciamento de Agendamentos/Pedidos
*   **Visualização em Calendário:** Um calendário interativo permite visualizar rapidamente os dias com reservas ou pedidos.
*   **Criação/Edição/Exclusão:** Formulários dedicados para adicionar novos agendamentos ou pedidos, além de funcionalidades para editar e excluir os existentes.
*   **Detalhes Abrangentes:** Cada item pode conter nome do cliente, telefone, horário, quantidade de pessoas (para reservas), observações, se é aniversariante e qual cortesia (para reservas), ou descrição do pedido (para pedidos).
*   **Próximas Reservas:** Uma lista organizada de reservas futuras, com busca por nome ou observação.
*   **Pedidos Pendentes:** Uma lista organizada de pedidos futuros, com busca por nome ou descrição.
*   **Impressão:** Geração de um resumo detalhado para impressão de agendamentos e pedidos individuais.

### Gerenciamento de Contatos
*   **Lista de Contatos:** Uma tela dedicada para gerenciar uma lista de contatos, com busca por nome ou telefone.
*   **Criação/Edição/Exclusão:** Adicione, edite ou remova contatos com nome, telefone e notas.
*   **Integração com Agendamentos/Pedidos:**
    *   **Autocompletar:** Ao digitar no campo "Nome do Cliente" no formulário de agendamento/pedido, o sistema sugere contatos existentes.
    *   **Pré-preenchimento:** Selecionar um contato da lista de sugestões preenche automaticamente o nome e telefone.
    *   **Criar Agendamento/Pedido a Partir do Contato:** Botões rápidos na tela de contatos para iniciar um novo agendamento ou pedido pré-preenchido com os dados do contato.
    *   **Salvar Contato no Formulário de Item:** Opção para salvar um cliente como novo contato diretamente do formulário de agendamento/pedido.

### Gerenciamento de Cortesias
*   **Lista de Cortesias:** Gerencie uma lista de opções de cortesia que podem ser associadas a reservas de aniversariantes.
*   **Adicionar/Remover:** Adicione novas opções de cortesia dinamicamente.
*   **Seleção no Formulário:** Selecione a cortesia no formulário de reserva quando o cliente for aniversariante.

### Utilidades
*   **Máscara de Telefone:** Campos de telefone com máscara `(##) #####-####` para facilitar a entrada de dados.
*   **Links Diretos para WhatsApp:** Geração de links para iniciar conversas no WhatsApp com os clientes diretamente dos agendamentos/pedidos e contatos.
*   **Alerta de Cache:** Notificação quando o armazenamento local está próximo de sua capacidade máxima.
*   **Limpeza Automática de Cache:** Agendamentos/Pedidos mais antigos que um mês são automaticamente removidos do armazenamento local para otimização de espaço.
*   **Interface Responsiva:** Design otimizado para dispositivos móveis, com navegação por abas na parte inferior.

## Estrutura do Projeto

```
reservas/
├── css/
│   └── style.css           # Estilos globais e de componentes
├── js/
│   ├── script.js           # Lógica principal da aplicação (frontend)
│   └── storage.js          # Funções de interação com localStorage e limpeza de cache
├── index.html              # Estrutura principal da página
└── README.md               # Este arquivo
```

## Como Usar (Versão Atual)

1.  Clone o repositório: `git clone https://github.com/WillGolden80742/reservas.git`
2.  Navegue até o diretório do projeto: `cd reservas`
3.  Abra o arquivo `index.html` em seu navegador.

Os dados serão armazenados no `localStorage` do seu navegador.

## Próximos Passos (Propostas de Implementação)

---

## Propostas de Implementação para o Sistema de Agendamento, Pedidos e Contatos (Node.js)

Para transformar o projeto atual em um sistema robusto com backend, propõe-se a implementação das seguintes funcionalidades utilizando Node.js e um banco de dados (ex: MongoDB, PostgreSQL ou MySQL).

### Requisitos Funcionais (RF)

#### RF1: Gerenciamento de Agendamentos/Pedidos (Admin)

*   **RF1.1: Criação de Agendamento/Pedido:**
    *   **Status Inicial:** Novos agendamentos/pedidos criados pelo administrador terão status "Confirmado" por padrão.
    *   **Backend:** Endpoint `POST /api/items` para criar um novo item.
    *   **Validação:** Validação de dados de entrada no backend (formato de telefone, datas, horas, campos obrigatórios para cada tipo).
*   **RF1.2: Visualização de Agendamentos/Pedidos:**
    *   **Backend:** Endpoint `GET /api/items` com suporte a query parameters para filtros (data, tipo, status) e paginação.
    *   **Frontend:** Interface atual será adaptada para buscar dados do backend.
*   **RF1.3: Edição de Agendamento/Pedido:**
    *   **Backend:** Endpoint `PUT /api/items/:id` para atualizar um item existente.
    *   **Validação:** Validação rigorosa dos campos atualizados.
*   **RF1.4: Exclusão de Agendamento/Pedido:**
    *   **Backend:** Endpoint `DELETE /api/items/:id` para remover um item.
*   **RF1.5: Aprovação/Recusa de Agendamento/Pedido:**
    *   **Backend:** Endpoint `PUT /api/items/:id/status` para alterar o status.
    *   **RF1.5.1: Justificativa de Recusa:** Campo `justification` obrigatório no payload da requisição `PUT` para recusa.
    *   **RF1.5.2: Notificação de Status ao Cliente (WhatsApp):**
        *   **Integração:** Implementação de uma integração com uma API de WhatsApp (ex: Twilio, Wati, ou biblioteca de Node.js para WhatsApp Web) para enviar mensagens programaticamente.
        *   **Lógica:** No backend, após a atualização do status, disparar a função de envio de mensagem com template customizado para "Confirmado" ou "Recusado" (incluindo a justificativa).
*   **RF1.6: Geração de Link WhatsApp para Contato:**
    *   **Frontend:** A lógica atual (`https://wa.me/${phone}`) permanecerá, mas o número de telefone virá do backend.
*   **RF1.7: Impressão de Agendamento/Pedido:**
    *   **Frontend:** A lógica atual para a modal de impressão será mantida, mas os dados serão puxados do backend.

#### RF2: Gerenciamento de Contatos (Admin)

*   **RF2.1: Criação de Contato:**
    *   **Backend:** Endpoint `POST /api/contacts` para adicionar um novo contato.
    *   **Validação:** Garantir telefone único (opcional, ou com tratamento para duplicados).
*   **RF2.2: Visualização de Contatos:**
    *   **Backend:** Endpoint `GET /api/contacts` com suporte a filtros por nome/telefone e paginação.
    *   **Frontend:** A lista de contatos será populada com dados do backend.
*   **RF2.3: Edição de Contato:**
    *   **Backend:** Endpoint `PUT /api/contacts/:id` para atualizar um contato.
*   **RF2.4: Exclusão de Contato:**
    *   **Backend:** Endpoint `DELETE /api/contacts/:id` para remover um contato.
    *   **Consideração:** Decidir se contatos com agendamentos/pedidos associados podem ser excluídos (soft delete ou bloqueio).
*   **RF2.5: Associação de Contato a Agendamento/Pedido:**
    *   **Backend:** Os IDs dos contatos serão armazenados nos documentos de agendamento/pedido para manter a referência.
    *   **Frontend:** A funcionalidade de autocompletar e pré-preenchimento será adaptada para buscar/associar contatos do backend.

#### RF3: Gerenciamento de Cortesias (Admin)

*   **RF3.1: Criação de Cortesia:**
    *   **Backend:** Endpoint `POST /api/courtesies` para adicionar uma nova cortesia.
*   **RF3.2: Visualização de Cortesias:**
    *   **Backend:** Endpoint `GET /api/courtesies` para listar todas as cortesias.
    *   **Frontend:** A lista de opções na modal de item será populada com dados do backend.
*   **RF3.3: Edição de Cortesia:**
    *   **Backend:** Endpoint `PUT /api/courtesies/:id` para atualizar o nome de uma cortesia.
*   **RF3.4: Exclusão de Cortesia:**
    *   **Backend:** Endpoint `DELETE /api/courtesies/:id` para remover uma cortesia.
    *   **Consideração:** Decidir como lidar com cortesias já associadas a agendamentos (desvinculação, ou remoção do nome da cortesia do agendamento).

#### RF4: Funcionalidades de Cliente (Link Público)

*   **RF4.1: Formulário de Reserva/Pedido:**
    *   **Frontend (Público):** Criação de uma interface HTML/CSS/JS separada ou rota pública no Node.js que renderize um formulário simplificado.
    *   **Backend:** Endpoint `POST /public/submit` para receber submissões de clientes.
    *   **RF4.1.1: Escolha de Tipo:** Formulário com seleção clara de "Reserva" ou "Pedido".
    *   **RF4.1.2: Dados do Cliente:** Campos para nome, telefone (com máscara), data, hora, etc.
    *   **RF4.1.3: Validação de Campos:** Validação tanto no frontend quanto no backend.
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
    *   **Backend:** Implementação de estratégias de autenticação (ex: JWT - JSON Web Tokens) com endpoints `POST /auth/login`.
    *   **Frontend:** Uma tela de login dedicada para administradores.
*   **RF5.2: Proteção de Rotas Admin:**
    *   **Backend:** Middleware de autenticação para proteger todas as rotas `/api/*`.
    *   **Autorização:** Possibilidade de implementar diferentes níveis de usuário, se necessário (ex: `admin`, `editor`).

### Tecnologias Propostas (Node.js Backend)

*   **Framework:** Express.js
*   **Banco de Dados:** MongoDB (com Mongoose ODM), PostgreSQL ou MySQL (com Sequelize ORM)
*   **Autenticação:** JWT (JSON Web Tokens), bcrypt para hash de senhas
*   **Validação:** Joi ou Express-validator
*   **Integração WhatsApp:** Uma biblioteca ou serviço de API de WhatsApp (ex: `whatsapp-web.js` para WhatsApp Web, ou APIs comerciais como Twilio/Wati para integração mais robusta e oficial).
*   **Estrutura:** Separação em rotas, controladores, serviços/modelos.
