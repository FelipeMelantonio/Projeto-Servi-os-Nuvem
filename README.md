# 🏦 Mini Conta Digital - Deploy Fullstack na AWS com Docker

Este projeto consiste em uma solução completa de **Mini Conta Digital**, desenvolvida para demonstrar competências em **desenvolvimento fullstack**, **containerização** e **infraestrutura em nuvem (AWS)** seguindo padrões rigorosos de isolamento de rede.

---

## 🎯 Objetivo do Projeto

O objetivo principal é realizar o deploy de uma aplicação web em um ambiente de nuvem real, utilizando **VPCs (Virtual Private Clouds)**, sub-redes públicas e privadas, e instâncias **EC2** na AWS. O foco técnico está em:
- Configurar redes virtuais privadas para isolamento de recursos.
- Utilizar **Docker** para padronização do ambiente de execução.
- Garantir que o Backend (porta **25000**) seja acessível **apenas** pela máquina do Frontend (porta **8080**) através da rede interna.

---

## 📱 Descrição da Aplicação

A **Mini Conta Digital** é uma plataforma financeira simplificada que permite a gestão de ativos em tempo real. A aplicação oferece uma experiência completa de usuário, desde a criação de perfil até a movimentação de saldo.

### 🔐 Autenticação e Segurança
- **Gestão de Usuários:** Cadastro de novos clientes e login seguro.
- **Segurança JWT:** Todas as operações financeiras são protegidas por tokens de autenticação (JSON Web Tokens), garantindo que apenas o dono da conta acesse seus dados.

### 🏦 Operações Bancárias (Funcionalidades)
- **Dashboard Financeiro:** Visualização clara do saldo disponível e resumo da conta.
- **Depósitos e Saques:** Interface intuitiva para entrada e retirada de valores com validação de saldo.
- **Transferência Interna:** Envio instantâneo de valores entre usuários da plataforma utilizando o número da conta.
- **Extrato Detalhado:** Histórico completo de transações, permitindo o acompanhamento de todas as entradas e saídas com datas e descrições.

---

## 🏗️ Arquitetura de Infraestrutura (AWS)

A aplicação foi implantada utilizando uma arquitetura de rede em camadas para garantir a segurança dos dados:

### 🌐 Topologia de Rede
*   **Sub-rede Pública (Frontend - Porta 8080):**
    -   Instância EC2 com **IP Público**.
    -   Serviço: Web App (React + Nginx) acessível via navegador.
*   **Sub-rede Privada (Backend - Porta 25000):**
    -   Instância EC2 com **apenas IP Privado**.
    -   Serviço: API REST (Spring Boot).
    -   **Isolamento:** Esta máquina não possui acesso direto da internet. Ela só responde a requisições vindas do IP interno da máquina de Frontend.

### 🔒 Regras de Segurança (Security Groups)
| Componente | Porta | Origem Permitida |
| :--- | :--- | :--- |
| **Frontend** | 8080 | 0.0.0.0/0 (Internet) |
| **Backend** | 25000 | IP Privado do Frontend (Rede Interna) |

---

## 🛠️ Tecnologias Utilizadas

-   **Backend:** Java 21, Spring Boot 3.x, Spring Security, JPA/Hibernate.
-   **Frontend:** React 19, Material UI (MUI), Zustand (Estado Global), Axios.
-   **DevOps:** Docker, Nginx (Proxy Reverso), AWS EC2, VPC.

---

## 📦 Como Executar Localmente (Docker)

1.  **Clonar o repositório:**
    ```bash
    git clone https://github.com/seu-usuario/projeto-faculdade.git
    cd projeto-faculdade
    ```

2.  **Executar via Docker:**
    - No diretório do Backend: `docker build -t mini-conta-api . && docker run -d -p 25000:25000 mini-conta-api`
    - No diretório do Frontend: `docker build -t mini-conta-front . && docker run -d -p 8080:8080 mini-conta-front`

---

## 👨‍💻 Autor
Desenvolvido como projeto acadêmico para a disciplina de Laboratório de Cloud Computing.

---
