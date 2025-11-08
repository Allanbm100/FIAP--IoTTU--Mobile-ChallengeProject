# 📱 IoTTU - Sistema de Gerenciamento IoT

## 📋 Sobre o Projeto

**IoTTU** é um aplicativo mobile desenvolvido em React Native para gerenciamento inteligente de sistemas IoT voltado ao controle e monitoramento de antenas RFID, motocicletas, pátios e tags em tempo real. O sistema oferece uma solução completa para rastreamento e administração de ativos através de interface mobile moderna e intuitiva.

### 🎯 Proposta

O aplicativo foi desenvolvido como parte do Challenge 2025 da FIAP e tem como objetivo principal:

- **Gerenciar dispositivos IoT** (antenas RFID) distribuídos em diferentes localizações
- **Controlar e rastrear motocicletas** através de tags RFID
- **Administrar pátios** com geolocalização precisa
- **Monitorar tags RFID** vinculadas aos veículos
- **Autenticação segura** com controle de acesso baseado em perfis
- **Interface multilíngue** com suporte a Português, Inglês e Espanhol
- **Tema personalizável** com modos claro e escuro

---

## ✨ Funcionalidades Principais

### 🔐 Autenticação
- Login com validação de credenciais
- Registro de novos usuários
- Gerenciamento de sessão com AsyncStorage
- Controle de acesso baseado em perfis (USER/ADMIN)

### 📡 Gerenciamento de Antenas
- **Listar** todas as antenas cadastradas
- **Criar** novas antenas com código único
- **Editar** informações de antenas existentes
- **Excluir** antenas do sistema
- Vinculação com pátios

### 🏍️ Gerenciamento de Motocicletas
- **CRUD completo** de motocicletas
- Cadastro com placa, marca, modelo e ano
- Vinculação com tags RFID
- Informações de proprietário

### 🏢 Gerenciamento de Pátios
- **CRUD completo** de pátios
- Cadastro com nome e geolocalização (latitude/longitude)
- Controle de cidade e estado
- Vinculação com usuários

### 🏷️ Gerenciamento de Tags
- **CRUD completo** de tags RFID
- Código único de identificação
- Status de ativação
- Vinculação com motocicletas e antenas

### 🌍 Internacionalização
- Suporte a **3 idiomas**: Português (PT), Inglês (EN) e Espanhol (ES)
- Troca de idioma em tempo real
- Todas as strings traduzidas

### 🎨 Tema Personalizável
- **Modo Claro** e **Modo Escuro**
- Alternância dinâmica de tema
- Cores consistentes em todo o app
- Seguindo guidelines de Material Design

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
- **React Native** - Framework para desenvolvimento mobile
- **TypeScript** - Superset JavaScript com tipagem estática
- **Expo** (~54.0.18) - Plataforma para desenvolvimento React Native

### Navegação
- **React Navigation** (^7.1.18)
  - Native Stack Navigator
  - Bottom Tabs Navigator

### Gerenciamento de Estado
- **React Context API** - Estado global (Auth e Theme)
- **TanStack React Query** (^5.90.5) - Cache e sincronização de dados

### Internacionalização
- **i18next** (^25.6.1)
- **react-i18next** (^16.2.4)
- **expo-localization** (^17.0.7)

### HTTP e API
- **Axios** (^1.11.0) - Cliente HTTP

### Armazenamento
- **AsyncStorage** (^2.2.0) - Armazenamento local persistente

### UI/UX
- **React Native Gesture Handler** (^2.29.0)
- **React Native Safe Area Context** (~5.6.0)
- **React Native Swipe List View** (^3.2.9)
- **Expo Vector Icons** (^15.0.3)

---

## 🚀 Como Executar

### Pré-requisitos
- Node.js (v18 ou superior)
- npm ou yarn
- Expo CLI
- Emulador Android/iOS ou dispositivo físico com Expo Go

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/Allanbm100/FIAP--IoTTU--Mobile-ChallengeProject.git
cd FIAP--IoTTU--Mobile-ChallengeProject
```

2. **Instale as dependências**
```bash
npm install
```

3. **Inicie o servidor de desenvolvimento**
```bash
npm start
```

4. **Execute no dispositivo/emulador**
```bash
# Android
npm run android

# iOS
npm run ios

# Web
npm run web
```

### Configuração da API

Certifique-se de configurar a URL base da API no arquivo `src/services/api.ts`:

```typescript
const API_BASE_URL = 'https://sua-api.com/api';
```

---

## 📱 Screenshots

*(Adicionar screenshots do app em funcionamento)*

---

## 🏆 Requisitos Atendidos - Sprint 4

### ✅ Implementado
- [x] **Implementação funcional de todas as telas** (30 pts)
- [x] **Integração com API** - 4 CRUDs completos (10 pts)
- [x] **Localização e Internacionalização** - PT, EN, ES (10 pts)
- [x] **Estilização com Tema** - Dark/Light (10 pts)
- [x] **Arquitetura de Código** - Organização e boas práticas (10 pts)
- [x] **Documentação** - README.md (10 pts)

### 🔄 Em desenvolvimento
- [ ] **Publicação do app** - Firebase App Distribution (10 pts)
- [ ] **Notificação via Push** (10 pts)

---

## 👥 Integrantes do Grupo

| Nome Completo | RM | GitHub |
|--------------|-----|--------|
| [Allan Bispo Monteiro] | [RM560577] | [@Allanbm100](https://github.com/Allanbm100) |
| [Nome do Integrante 2] | [RM000000] | [@usuario2](https://github.com/usuario2) |
| [Nome do Integrante 3] | [RM000000] | [@usuario3](https://github.com/usuario3) |

> ⚠️ **Nota**: Atualize os nomes, RMs e usuários do GitHub de todos os integrantes do grupo.

---

## 📄 Licença

Este projeto foi desenvolvido como parte do Challenge 2025 da FIAP e é destinado exclusivamente para fins educacionais.

---

## 📞 Contato

Para dúvidas ou sugestões, entre em contato através do GitHub ou dos emails dos integrantes.

---

## 🙏 Agradecimentos

- **FIAP** - Pela oportunidade de desenvolvimento do projeto
- **Professores e Monitores** - Pelo suporte durante o desenvolvimento
- **Comunidade React Native** - Pelas bibliotecas e recursos disponibilizados

---

**Desenvolvido com ❤️ por estudantes da FIAP - Challenge 2025**
