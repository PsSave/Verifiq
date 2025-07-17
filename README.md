# 📱 Verifiq - Sistema de Listas de Verificação

Aplicativo mobile para criação e gerenciamento de listas de verificação com funcionalidades individuais e colaborativas.

## 🚀 Tecnologias

### Frontend

- **React Native** com Expo
- **TypeScript** para tipagem
- **Expo Router** para navegação
- **AsyncStorage** para persistência local

### Backend

- **Node.js** com Express
- **SQLite** como banco de dados
- **JWT** para autenticação
- **bcryptjs** para hash de senhas

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (versão 16 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (opcional)
- [Expo Go](https://expo.dev/client) no seu dispositivo móvel (para testar)

## 🛠 Instalação e Execução

### 1️⃣ Backend (Execute PRIMEIRO)

O backend deve estar rodando antes de iniciar o frontend.

```bash
# 1. Navegue para a pasta do backend
cd backend

# 2. Instale as dependências
npm install

# 3. Configure o banco de dados (IMPORTANTE - só na primeira vez)
npm run setup

# 4. Inicie o servidor em modo desenvolvimento
npm run dev
```

✅ **Backend rodando em:** `http://localhost:3000`

### 2️⃣ Frontend (Execute SEGUNDO)

Em um novo terminal:

```bash
# 1. Volte para a raiz do projeto (se estiver na pasta backend)
cd ..

# 2. Instale as dependências do frontend
npm install

# 3. Inicie o Expo
npx expo start
```

### 3️⃣ Executar no Dispositivo

Após executar `npx expo start`:

1. **No celular:** Escaneie o QR code com o Expo Go
2. **No navegador:** Pressione `w` para abrir no browser
3. **No emulador:** Pressione `a` (Android) ou `i` (iOS)

## 👤 Usuário Padrão

Após executar `npm run setup`, um usuário administrador é criado automaticamente:

- **Email:** `admin@verifiq.com`
- **Senha:** `admin123`

## 📚 Funcionalidades

### ✅ Autenticação

- Registro de novos usuários
- Login com JWT
- Verificação automática de sessão
- Logout seguro

### ✅ Listas

- Criar listas individuais ou compartilhadas
- Editar nome e descrição
- Deletar listas (apenas criadores)
- Visualizar estatísticas de progresso

### ✅ Itens

- Adicionar itens às listas
- Marcar como concluído/pendente
- Editar informações dos itens
- Deletar itens

### ✅ Compartilhamento

- Compartilhar listas por email
- Níveis de permissão (read, write, admin)
- Gerenciar usuários com acesso

### ✅ Perfil

- Visualizar estatísticas pessoais
- Editar informações do perfil
- Exportar dados
- Excluir conta

## 📁 Estrutura do Projeto

```
├── app/                    # Telas da aplicação
├── components/             # Componentes reutilizáveis
├── contexts/              # Contextos React (AuthContext)
├── services/              # Serviços de API
├── utils/                 # Hooks personalizados
├── backend/               # Servidor Node.js
│   ├── src/
│   │   ├── controllers/   # Controladores da API
│   │   ├── models/        # Modelos do banco
│   │   ├── routes/        # Rotas da API
│   │   ├── middleware/    # Middlewares
│   │   └── database/      # Configuração do banco
└── assets/                # Recursos estáticos
```

## 🔧 Scripts Disponíveis

### Frontend

```bash
npx expo start          # Inicia o Expo
npx expo start --web     # Inicia no navegador
npx expo build          # Build para produção
```

### Backend

```bash
npm run dev             # Inicia servidor em desenvolvimento
npm run start           # Inicia servidor em produção
npm run setup           # Configura banco (só primeira vez)
```

## 🌐 Endpoints da API

### Autenticação

- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Fazer login
- `GET /api/auth/verify` - Verificar token

### Listas

- `GET /api/lists` - Listar listas do usuário
- `POST /api/lists` - Criar nova lista
- `GET /api/lists/:id` - Detalhes da lista
- `PUT /api/lists/:id` - Atualizar lista
- `DELETE /api/lists/:id` - Deletar lista

### Itens

- `GET /api/items/list/:id` - Itens da lista
- `POST /api/items/list/:id` - Criar item
- `PATCH /api/items/:id/toggle` - Alternar status
- `DELETE /api/items/:id` - Deletar item

[Ver mais exemplos no arquivo `backend/api-examples.http`](backend/api-examples.http)

## 📱 Testando no Celular

Para testar no dispositivo móvel, você precisa ajustar o IP:

1. Descubra o IP da sua máquina:

   ```bash
   # Linux/Mac
   hostname -I

   # Windows
   ipconfig
   ```

2. Edite o arquivo [`services/apiService.ts`](services/apiService.ts):
   ```typescript
   const API_BASE_URL = "http://SEU_IP:3000/api";
   // Exemplo: 'http://192.168.1.100:3000/api'
   ```

## 🔄 Execuções Futuras

Após a primeira configuração, você só precisa:

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
npx expo start
```

## 🐛 Solução de Problemas

### Backend não inicia

- Verifique se a porta 3000 está livre
- Confirme se o Node.js está instalado
- Execute `npm install` novamente

### Frontend não conecta

- Certifique-se que o backend está rodando
- Verifique o IP no `apiService.ts` (se usando celular)
- Teste `http://localhost:3000/api/health` no navegador

### Erro no banco de dados

- Delete o arquivo `backend/src/database/verifiq.db`
- Execute `npm run setup` novamente

### App não carrega no celular

- Verifique se estão na mesma rede WiFi
- Confirme o IP no `apiService.ts`
- Reinicie o Expo: `r` no terminal

## 📄 Documentação Adicional

- [Documentação do Backend](backend/README.md)
- [Exemplos de API](backend/api-examples.http)
- [Expo Documentation](https://docs.expo.dev/)

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Desenvolvido por

**Pedro Samuel Soares Simão** - Projeto IFMS
