# MOOOOOOOOOO 🐄🐮
![cow](/public/cow.webp)


#  Pockets✨💸

Pockets is a Web3 wallet built on **Stacks** that lets you split your single wallet into multiple **virtual sub-wallets** (called pockets).  
Think of it as budgeting on-chain — savings, bills, fun, goals — all inside one wallet without juggling multiple addresses.

---

## 🚀 Features

- ✅ Create named **pockets** (categories) inside your wallet  
- ✅ Deposit STX into specific pockets  
- ✅ Move funds between pockets  
- ✅ Spend from a pocket to another address  
- ✅ Track balances per pocket  
- ✅ All transactions recorded on-chain (Clarity smart contract)  

---

## 🛠️ Tech Stack

- **Smart Contract**: [Clarity](https://docs.stacks.co/write-smart-contracts/clarity-overview) (on Stacks blockchain)  
- **Frontend**: Next.js + TypeScript  
- **Wallet Integration**: Leather (formerly Hiro) / Xverse  
- **Libraries**:  
  - `@stacks/connect` → connect wallet  
  - `@stacks/transactions` → contract calls  
  - `@stacks/network` → testnet/mainnet configuration  
  - `tailwindcss` → styling  

---

## 📦 Setup

### 1. Clone repo
```bash
git clone https://github.com/yourusername/pockets.git
cd pockets
```

### 2. Install dependencies
```bash
npm install
```
### 3. Run local dev
```bash
npm run dev
```


## 🔗 Smart Contract

Contract: subwallet.clar

### Core functions:
```
deposit(category, amount) → Deposit STX into a pocket

move(fromCategory, toCategory, amount) → Move funds between pockets

spend(category, recipient, amount) → Spend from a pocket to an external address

get-balance(category, owner) → Check balance of a pocket
```
### 🧪 Testing
```bash
clarinet console
```

```
(contract-call? .subwallet deposit "savings" u1000000)
(contract-call? .subwallet get-balance {category: "savings", owner: tx-sender})
```
