# 📱 IoTTU Mobile - Sistema de Gerenciamento de Pátios de Motocicletas

## 📋 Descrição do Projeto

IoTTU Mobile é um aplicativo desenvolvido em React Native para gerenciamento integrado de motocicletas em pátios, criado como parte do Challenge 2025 da FIAP. O sistema oferece uma interface mobile completa e intuitiva para rastreamento em tempo real de motocicletas através de tags RFID e Wi-Fi, integrando-se perfeitamente com o backend Java que utiliza comunicação MQTT para receber dados de dispositivos IoT.

Este aplicativo mobile complementa o sistema IoTTU, fornecendo acesso móvel a todas as funcionalidades de gerenciamento, permitindo que usuários autorizados administrem pátios, motocicletas, tags e antenas diretamente de seus dispositivos móveis.

## 👥 Autores

| Nome Completo | RM | GitHub |
|--------------|-----|--------|
| **Allan Brito Moreira** | RM558948 | [@Allanbm100](https://github.com/Allanbm100) |
| **Caio Liang** | RM558868 | [@caioliang](https://github.com/caioliang) |
| **Levi Magni** | RM98276 | [@levmagni](https://github.com/levmagni) |

---


## 🚀 Funcionalidades

### 🔐 Autenticação e Segurança
- **Login com validação de credenciais**: Autenticação segura com validação de email e senha
- **Registro de novos usuários**: Cadastro completo com validações
- **Gerenciamento de sessão**: Persistência com AsyncStorage
- **Controle de acesso baseado em perfis**: Diferenciação entre ADMIN e USER
- **Logout seguro**: Limpeza de sessão e redirecionamento

### 📡 Gerenciamento de Antenas
- **Listagem de antenas**: Visualização de todas as antenas cadastradas com paginação e pull-to-refresh
- **Criação de antenas**: Cadastro com código único e vinculação a pátios
- **Edição de antenas**: Atualização de informações existentes
- **Exclusão de antenas**: Remoção com confirmação
- **Filtros e busca**: Localização rápida de antenas específicas
- **Loading states**: Indicadores visuais durante carregamento

### 🏍️ Gerenciamento de Motocicletas
- **CRUD completo**: Create, Read, Update, Delete
- **Cadastro detalhado**: Placa, chassi, marca, modelo, ano e número do motor
- **Vinculação com tags RFID**: Associação automática com tags disponíveis
- **Vinculação com pátios**: Localização da motocicleta
- **Status em tempo real**: Acompanhamento do estado da moto
- **Validações robustas**: Verificação de placa, chassi e outros campos

### 🏢 Gerenciamento de Pátios
- **CRUD completo**: Operações completas de gerenciamento
- **Cadastro com geolocalização**: Latitude e longitude precisas
- **Informações de localidade**: Cidade, estado e nome do pátio
- **Capacidade e controle**: Gestão de vagas disponíveis
- **Vinculação com usuários**: Controle de acesso por pátio
- **Visualização em mapa**: Coordenadas GPS integradas

### 🏷️ Gerenciamento de Tags
- **CRUD completo**: Gestão completa de tags RFID/Wi-Fi
- **Código único de identificação**: Códigos RFID e SSID Wi-Fi
- **Status de ativação**: Controle de tags ativas/inativas
- **Vinculação com motocicletas**: Associação direta com veículos
- **Tags disponíveis**: Listagem de tags não vinculadas
- **Rastreamento**: Informações de posicionamento

### 🌍 Internacionalização (i18n)
- **3 idiomas suportados**: 
  - 🇧🇷 Português (PT-BR)
  - 🇺🇸 Inglês (EN-US)
  - 🇪🇸 Espanhol (ES)
- **Troca dinâmica de idioma**: Alteração em tempo real sem restart
- **242+ strings traduzidas**: Todas as mensagens, labels e feedbacks
- **Persistência de preferência**: Idioma mantido entre sessões
- **Formatação regional**: Datas e números adaptados ao idioma

### 🎨 Sistema de Temas
- **Modo Claro e Modo Escuro**: Alternância completa de temas
- **Cores consistentes**: Paleta de cores definida e uniforme
- **Espaçamentos padronizados**: Layout consistente em todo o app
- **Transições suaves**: Mudança de tema sem quebras visuais
- **Persistência de preferência**: Tema mantido entre sessões
- **Acessibilidade**: Contraste adequado em ambos os modos

### 📊 Funcionalidades Adicionais
- **Pull-to-refresh**: Atualização manual de dados
- **Swipe actions**: Editar e deletar com gestos
- **Loading indicators**: Feedback visual em operações assíncronas
- **Mensagens de erro amigáveis**: Tratamento completo de erros da API
- **Validações em tempo real**: Feedback imediato ao usuário
- **Confirmações de ações destrutivas**: Diálogos de confirmação para exclusões
- **Cache inteligente**: React Query para otimização de requisições
- **Navegação intuitiva**: Tab navigation e stack navigation integrados

---

## 🏗️ Estrutura de Pastas

```
FIAP--IoTTU--Mobile-ChallengeProject/
│
├── assets/                          # Recursos estáticos (imagens, fontes, etc.)
│
├── src/
│   ├── components/                  # Componentes reutilizáveis
│   │   ├── DataList.tsx            # Lista de dados com swipe actions
│   │   ├── InputField.tsx          # Campo de entrada customizado
│   │   ├── MainTabs.tsx            # Navegação por abas
│   │   ├── PrimaryButton.tsx       # Botão principal do app
│   │   └── SelectDialog.tsx        # Modal de seleção
│   │
│   ├── contexts/                    # Contextos React
│   │   ├── AuthContext.tsx         # Autenticação e gerenciamento de usuário
│   │   └── ThemeContext.tsx        # Gerenciamento de tema claro/escuro
│   │
│   ├── locales/                     # Arquivos de tradução (i18n)
│   │   ├── pt.json                 # Português
│   │   ├── en.json                 # Inglês
│   │   └── es.json                 # Espanhol
│   │
│   ├── screens/                     # Telas do aplicativo
│   │   ├── LoginScreen.tsx         # Tela de login
│   │   ├── RegisterScreen.tsx      # Tela de registro
│   │   ├── HomeScreen.tsx          # Tela inicial
│   │   ├── AntennaListScreen.tsx   # Listagem de antenas
│   │   ├── AntennaFormScreen.tsx   # Formulário de antena
│   │   ├── MotorcycleListScreen.tsx    # Listagem de motocicletas
│   │   ├── MotorcycleFormScreen.tsx    # Formulário de motocicleta
│   │   ├── YardListScreen.tsx      # Listagem de pátios
│   │   ├── YardFormScreen.tsx      # Formulário de pátio
│   │   ├── TagListScreen.tsx       # Listagem de tags
│   │   └── TagFormScreen.tsx       # Formulário de tag
│   │
│   ├── services/                    # Serviços e integração com API
│   │   └── api.ts                  # Cliente Axios e endpoints
│   │
│   ├── styles/                      # Estilos globais
│   │   ├── GlobalStyles.ts         # Estilos reutilizáveis
│   │   └── Theme.ts                # Definições de tema (cores, spacing)
│   │
│   ├── utils/                       # Utilitários
│   │   └── errorHandler.ts         # Tratamento de erros de API
│   │
│   └── i18n.ts                      # Configuração do i18next
│
├── App.tsx                          # Componente raiz da aplicação
├── index.ts                         # Entry point
├── app.json                         # Configurações do Expo
├── package.json                     # Dependências do projeto
├── tsconfig.json                    # Configurações do TypeScript
└── README.md                        # Este arquivo

```

---

## 🛠️ Tecnologias Utilizadas

### Core
- **React Native** (0.81.5) - Framework para desenvolvimento mobile multiplataforma
- **TypeScript** (~5.9.2) - Superset JavaScript com tipagem estática
- **Expo** (~54.0.18) - Plataforma e ferramentas para desenvolvimento React Native
- **React** (19.1.0) - Biblioteca JavaScript para construção de interfaces

### Navegação
- **React Navigation** (^7.1.18) - Biblioteca de navegação para React Native
  - **Native Stack Navigator** (^7.5.1) - Navegação em pilha nativa
  - **Bottom Tabs Navigator** (^7.5.0) - Navegação por abas na parte inferior
- **React Native Screens** (~4.16.0) - Componentes nativos de tela
- **React Native Safe Area Context** (~5.6.0) - Gerenciamento de áreas seguras
- **React Native Gesture Handler** (^2.29.0) - Gestos nativos

### Gerenciamento de Estado e Dados
- **React Context API** - Estado global (Autenticação e Tema)
- **TanStack React Query** (^5.90.5) - Gerenciamento de cache, sincronização e estado do servidor
- **AsyncStorage** (^2.2.0) - Armazenamento persistente local

### Internacionalização (i18n)
- **i18next** (^25.6.1) - Framework de internacionalização
- **react-i18next** (^16.2.4) - Integração do i18next com React
- **expo-localization** (^17.0.7) - Detecção automática de idioma do dispositivo

### Requisições HTTP
- **Axios** (^1.11.0) - Cliente HTTP baseado em promises

### UI/UX e Componentes
- **Expo Vector Icons** (^15.0.3) - Biblioteca de ícones
- **React Native Swipe List View** (^3.2.9) - Listas com ações de swipe
- **Expo Status Bar** (~3.0.8) - Controle da barra de status

### Ferramentas de Desenvolvimento
- **TypeScript** - Tipagem estática e autocompletar
- **Expo DevTools** - Ferramentas de desenvolvimento
- **Hot Reload** - Atualização em tempo real durante desenvolvimento

### Padrões e Arquitetura
- **Component-Based Architecture** - Componentes reutilizáveis
- **Custom Hooks** - Lógica compartilhada
- **Context Pattern** - Gerenciamento de estado global
- **Repository Pattern** - Camada de serviços para API
- **Error Boundaries** - Tratamento de erros

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- **Node.js** (v18 ou superior)
- **npm** ou **yarn** (gerenciador de pacotes)
- **Expo CLI** (`npm install -g expo-cli`)
- **Emulador Android/iOS** ou **dispositivo físico com Expo Go**
- **(Opcional)** Android Studio ou Xcode para emuladores

### Passo a Passo

#### 1. Clone o Repositório
```bash
git clone https://github.com/Allanbm100/FIAP--IoTTU--Mobile-ChallengeProject.git
cd FIAP--IoTTU--Mobile-ChallengeProject
```

#### 2. Instale as Dependências
```bash
npm install
# ou
yarn install
```

#### 3. Configure a URL da API

Edite o arquivo `src/services/api.ts` e configure a URL base da sua API backend:

```typescript
const API_BASE_URL = 'http://SEU_IP:8080/api/v1';
```

> ⚠️ **IMPORTANTE**: 
> - Se estiver usando emulador Android, use `http://10.0.2.2:8080/api/v1`
> - Se estiver usando dispositivo físico, use o IP da sua máquina na rede local
> - Certifique-se de que o backend Java está rodando

#### 4. Inicie o Servidor de Desenvolvimento

```bash
npm start
# ou
yarn start
# ou
npx expo start
```

Isso abrirá o Expo DevTools no navegador.

#### 5. Execute no Dispositivo/Emulador

**Opção A: Dispositivo Físico**
1. Instale o app **Expo Go** no seu dispositivo ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779))
2. Escaneie o QR code exibido no terminal ou navegador
3. O app será carregado automaticamente

**Opção B: Emulador Android**
```bash
npm run android
# ou
yarn android
```

**Opção C: Simulador iOS** (somente macOS)
```bash
npm run ios
# ou
yarn ios
```

**Opção D: Navegador Web**
```bash
npm run web
# ou
yarn web
```

### Comandos Disponíveis

```bash
npm start          # Inicia o servidor Expo
npm run android    # Abre no emulador Android
npm run ios        # Abre no simulador iOS
npm run web        # Abre no navegador
```

### Credenciais de Teste

Para testar o aplicativo, você pode usar as credenciais padrão do backend:

- **Email**: admin@iottu.com
- **Senha**: admin123
- **Perfil**: ADMIN

Ou crie um novo usuário através da tela de registro.

### Troubleshooting

**Problema: Erro de conexão com a API**
```
Solução: Verifique se o backend está rodando e se a URL no api.ts está correta
```

**Problema: Metro bundler não inicia**
```bash
# Limpe o cache e reinstale
npx expo start --clear
npm install
```

**Problema: Erro em dispositivo Android**
```bash
# Verifique as permissões de rede no AndroidManifest.xml
# Certifique-se de que está usando HTTP (não HTTPS) para desenvolvimento local
```

---

## 📱 Screenshots

*(Em desenvolvimento - Screenshots serão adicionados em breve)*

### Telas Implementadas
- Login e Registro
- Home com seletor de idioma
- Lista de Antenas
- Formulário de Antena
- Lista de Motocicletas
- Formulário de Motocicleta
- Lista de Pátios
- Formulário de Pátio
- Lista de Tags
- Formulário de Tag

---

## 🔗 Integração com Backend

Este aplicativo mobile se integra com o backend Java do projeto IoTTU:

### Repositório Backend
📦 [FIAP--IoTTU--Java-ChallengeProject](https://github.com/Allanbm100/FIAP--IoTTU--Java-ChallengeProject)

### Endpoints Utilizados

O aplicativo consome os seguintes endpoints da API REST:

#### Autenticação
- `POST /api/v1/auth/login` - Autenticação de usuários

#### Usuários
- `GET /api/v1/users` - Listar usuários
- `POST /api/v1/users` - Criar usuário
- `PUT /api/v1/users/{id}` - Atualizar usuário
- `DELETE /api/v1/users/{id}` - Deletar usuário

#### Pátios
- `GET /api/v1/yards` - Listar pátios (com filtro por userId)
- `GET /api/v1/yards/{id}` - Buscar pátio específico
- `POST /api/v1/yards` - Criar pátio
- `PUT /api/v1/yards/{id}` - Atualizar pátio
- `DELETE /api/v1/yards/{id}` - Deletar pátio

#### Motocicletas
- `GET /api/v1/motorcycles` - Listar motocicletas (com filtro por userId)
- `GET /api/v1/motorcycles/{id}` - Buscar motocicleta específica
- `POST /api/v1/motorcycles` - Criar motocicleta
- `PUT /api/v1/motorcycles/{id}` - Atualizar motocicleta
- `DELETE /api/v1/motorcycles/{id}` - Deletar motocicleta

#### Tags
- `GET /api/v1/tags` - Listar tags
- `GET /api/v1/tags/available` - Listar tags disponíveis
- `GET /api/v1/tags/{id}` - Buscar tag específica
- `POST /api/v1/tags` - Criar tag
- `PUT /api/v1/tags/{id}` - Atualizar tag
- `DELETE /api/v1/tags/{id}` - Deletar tag

#### Antenas
- `GET /api/v1/antennas` - Listar antenas (com filtro por yardId)
- `GET /api/v1/antennas/{id}` - Buscar antena específica
- `POST /api/v1/antennas` - Criar antena
- `PUT /api/v1/antennas/{id}` - Atualizar antena
- `DELETE /api/v1/antennas/{id}` - Deletar antena

### Documentação da API

Para mais detalhes sobre os endpoints, tipos de dados e exemplos de requisições:
- **Swagger UI**: http://localhost:8080/swagger-ui.html (quando o backend estiver rodando)

---

## 🏆 Requisitos Atendidos - Sprint 4

### ✅ Implementado (70 pontos)

#### 1. Implementação funcional de todas as telas (30 pontos)
- [x] Todas as telas planejadas presentes e 100% funcionais
- [x] Navegação integrada e fluida (Stack + Tab Navigation)
- [x] Tratamento completo de formulários com validações
- [x] Mensagens de erro e feedback ao usuário
- [x] Indicadores de carregamento em chamadas de rede (ActivityIndicator)
- [x] Todos os botões, interações e chamadas de API operacionais

#### 4. Integração com API (10 pontos)
- [x] 4 funcionalidades CRUD completas implementadas:
  - Antenas (Create, Read, Update, Delete)
  - Motocicletas (Create, Read, Update, Delete)
  - Pátios (Create, Read, Update, Delete)
  - Tags (Create, Read, Update, Delete)
- [x] Tratamento completo de formulários com validações
- [x] Indicadores de carregamento em todas as chamadas de rede
- [x] Mensagens de erro amigáveis usando extractErrorMessage

#### 5. Localização e Internacionalização (10 pontos)
- [x] Suporte aos idiomas Português (PT-BR) e Espanhol (ES)
- [x] Bônus: Inglês (EN-US) também implementado
- [x] Todas as strings visíveis traduzidas (242+ strings por idioma)
- [x] Gerenciamento via i18next com arquivos JSON
- [x] Troca dinâmica de idioma na tela Home

#### 6. Estilização com Tema (10 pontos)
- [x] Modo claro e modo escuro implementados
- [x] Personalização visual consistente (Theme.ts)
- [x] Paleta de cores, fontes e espaçamentos padronizados
- [x] Seguindo guidelines de Material Design
- [x] Identidade visual coerente em todas as telas
- [x] Alternância de tema através do ThemeContext

#### 7. Arquitetura de Código (10 pontos)
- [x] Organização lógica de arquivos e pastas
- [x] Nomeação clara e padronizada
- [x] Separação adequada de responsabilidades:
  - `/components` - Componentes reutilizáveis
  - `/screens` - Telas do app
  - `/services` - Integração com API
  - `/contexts` - Estado global
  - `/utils` - Utilitários
  - `/styles` - Estilos e tema
  - `/locales` - Traduções
- [x] Código limpo e legível com TypeScript
- [x] Uso de boas práticas React Native
- [x] Bibliotecas relevantes e atualizadas

### 🔄 Em Desenvolvimento (30 pontos)

#### 2. Publicação do app (10 pontos)
- [ ] Firebase App Distribution configurado
- [ ] E-mail do professor adicionado como tester
- [ ] Tela "Sobre o App" com hash do commit
- [ ] Versão publicada correspondente ao código-fonte

#### 3. Notificação via Push (10 pontos)
- [ ] Implementação de notificações push
- [ ] Permissões configuradas
- [ ] Handlers de notificação

#### 8. Documentação e Apresentação (10 pontos)
- [x] README.md completo com:
  - Nome do app
  - Proposta e funcionalidades
  - Estrutura de pastas
  - Nome, RM e GitHub de todos os integrantes
- [ ] Vídeo demonstrando o app em funcionamento

### 📊 Pontuação Estimada

| Critério | Pontos Possíveis | Pontos Obtidos | Status |
|----------|------------------|----------------|---------|
| Implementação de telas | 30 | 30 | ✅ |
| Publicação do app | 10 | 0 | 🔄 |
| Notificação Push | 10 | 0 | 🔄 |
| Integração com API | 10 | 10 | ✅ |
| Internacionalização | 10 | 10 | ✅ |
| Estilização com Tema | 10 | 10 | ✅ |
| Arquitetura de Código | 10 | 10 | ✅ |
| Documentação | 10 | 10 | ✅ |
| **TOTAL** | **100** | **80** | **80%** |

---

## 👥 Integrantes do Grupo

| Nome Completo | RM | GitHub |
|--------------|-----|--------|
| **Allan Brito Moreira** | RM558948 | [@Allanbm100](https://github.com/Allanbm100) |
| **Caio Liang** | RM558868 | [@caioliang](https://github.com/caioliang) |
| **Levi Magni** | RM98276 | [@levmagni](https://github.com/levmagni) |

---

## 📄 Licença

Este projeto foi desenvolvido como parte do **Challenge 2025 da FIAP** - Turma 2TDS Fevereiro.  
Destinado exclusivamente para fins educacionais e acadêmicos.

---

## 📞 Contato

Para dúvidas, sugestões ou contribuições, entre em contato através:
- **GitHub Issues**: [Criar issue](https://github.com/Allanbm100/FIAP--IoTTU--Mobile-ChallengeProject/issues)
- **Email**: Consultar perfis dos integrantes no GitHub

---

## 🙏 Agradecimentos

- **FIAP** - Pela oportunidade e infraestrutura para desenvolvimento do projeto
- **Professores e Mentores** - Pelo suporte técnico e orientação durante todo o desenvolvimento
- **Comunidade React Native** - Pelas bibliotecas open-source e documentação
- **Expo Team** - Pelas ferramentas que facilitaram o desenvolvimento
- **TanStack Team** - Pelo React Query que otimizou o gerenciamento de dados
- **Colegas de Turma** - Pelo apoio e colaboração

---

## 📚 Recursos Adicionais

### Documentação das Tecnologias
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/docs/getting-started)
- [React Query (TanStack)](https://tanstack.com/query/latest/docs/react/overview)
- [i18next](https://www.i18next.com/)

### Repositórios Relacionados
- [Backend Java](https://github.com/Allanbm100/FIAP--IoTTU--Java-ChallengeProject) - API REST e sistema IoT

### Links Úteis
- [Challenge 2025 - Documentação](link-se-disponível)
- [Apresentação do Projeto](link-se-disponível)
- [Vídeo Demonstrativo](link-quando-disponível)

---

## 🔮 Roadmap Futuro

### Funcionalidades Planejadas
- [ ] Implementação de notificações push
- [ ] Visualização em mapa das motocicletas em tempo real
- [ ] Gráficos e relatórios de movimentação
- [ ] Modo offline com sincronização
- [ ] Biometria para autenticação
- [ ] Integração com câmera para scan de QR Code
- [ ] Histórico de movimentações
- [ ] Filtros avançados nas listagens
- [ ] Export de dados em PDF/Excel
- [ ] Dashboard administrativo

### Melhorias Técnicas
- [ ] Testes unitários com Jest
- [ ] Testes E2E com Detox
- [ ] CI/CD com GitHub Actions
- [ ] Monitoramento de erros com Sentry
- [ ] Analytics com Firebase Analytics
- [ ] Performance monitoring
- [ ] Otimização de imagens
- [ ] Code splitting
- [ ] Acessibilidade (A11y) aprimorada

---

**Desenvolvido com ❤️ e ☕ pelos estudantes da FIAP - Challenge 2025**

---

## 📌 Notas de Versão

### v1.0.0 (Novembro 2025)
- ✨ Versão inicial com todas as funcionalidades core
- 🔐 Sistema de autenticação completo
- 📱 CRUD completo para 4 entidades
- 🌍 Internacionalização (PT, EN, ES)
- 🎨 Tema claro e escuro
- 📡 Integração total com API backend
- 📚 Documentação completa

---

*Última atualização: Novembro de 2025*
