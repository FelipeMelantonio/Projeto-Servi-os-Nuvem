# 🏦 Mini Conta Digital - Fullstack Project

Este projeto é uma solução completa de **Mini Conta Digital**, composta por uma API robusta em **Spring Boot** e uma interface web moderna em **React**. O sistema permite que usuários se cadastrem, criem contas bancárias digitais e realizem operações financeiras essenciais com segurança e autenticação via JWT.

---

## 🏗️ Arquitetura do Sistema

O projeto segue uma arquitetura cliente-servidor desacoplada:

1.  **Backend (API REST):**
    -   Construído com **Java 21** e **Spring Boot 3.x**.
    -   Segurança implementada com **Spring Security** e **JWT**.
    -   Persistência de dados utilizando **Spring Data JPA**.
    -   Banco de dados **H2** (em memória para desenvolvimento).

2.  **Frontend (Web Application):**
    -   Desenvolvido com **React 19**.
    -   Interface visual baseada em **Material UI (MUI)**.
    -   Gerenciamento de estado global com **Zustand**.
    -   Navegação com **React Router**.

---

## 🚀 Funcionalidades Reais

### 🔐 Autenticação e Usuários
- **Registro de Usuário:** Cadastro de novos clientes com Nome, Email, Senha e CPF.
- **Login Seguro:** Autenticação via JWT que protege todas as rotas financeiras.

### 🏦 Operações Bancárias
- **Criação de Conta:** Após o login, o usuário pode criar sua conta digital vinculada ao seu perfil.
- **Depósitos:** Adição de saldo à conta informando o valor.
- **Saques:** Retirada de valores com validação de saldo disponível.
- **Transferência Interna:** Envio de dinheiro entre contas cadastradas no sistema de forma instantânea.
- **Histórico de Transações:** Visualização detalhada de todas as movimentações (entradas e saídas) com data, valor e saldo resultante.

---

## 🛠️ Tecnologias Utilizadas

| Camada | Tecnologia |
| :--- | :--- |
| **Linguagem Backend** | Java 21 |
| **Framework Backend** | Spring Boot 3.x |
| **Segurança** | Spring Security + JWT |
| **Banco de Dados** | H2 / PostgreSQL |
| **Biblioteca Frontend** | React 19 |
| **UI Framework** | Material UI (MUI) |
| **Estado Global** | Zustand |
| **Chamadas API** | Axios |

---



## 📝 Fluxo de Teste Recomendado

Para testar o sistema completo, siga esta ordem:
1. **Registrar** um novo usuário na tela de cadastro.
2. Realizar o **Login** com as credenciais criadas.
3. Clique em **Criar Conta** para gerar seu número de conta e saldo inicial (R$ 0,00).
4. Realize um **Depósito** para ter saldo.
5. Experimente fazer um **Saque** ou uma **Transferência** para outro usuário cadastrado.
6. Verifique o **Extrato/Histórico** para ver suas movimentações registradas.

---

