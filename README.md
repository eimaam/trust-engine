# Trust-Engine 🛡️

**Trust-Engine** is a high-performance, edge-optimized API service designed to provide a reliable source of truth for business verification in Nigeria. It acts as an internal middleware between the Corporate Affairs Commission (CAC) and your various applications, ensuring stable, cached and rate-limit-aware data retrieval.

Built with **Hono** and deployed on **Cloudflare Workers**.

---

## ✨ Features

* **Edge-First:** Deployed on Cloudflare Workers for ultra-low latency.
* **Resilient Rate Limiting:** Built-in protection to stay within the 20 requests/minute threshold of the public registry.
* **Smart Caching:** Reduces redundant external hits by serving recent lookups from a high-speed cache.
* **Developer-Friendly:** Standardized JSON responses for seamless integration with frontend frameworks like React and state managers like Zustand.
* **Lightweight:** Zero-dependency (where possible) to keep the bundle size minimal and cold starts non-existent.

---

## 🚀 Tech Stack

* **Framework:** [Hono](https://hono.dev/)
* **Runtime:** [Cloudflare Workers](https://workers.cloudflare.com/)
* **Language:** TypeScript
* **Registry Source:** CAC Nigeria

---

## 🛠 Getting Started

### Prerequisites
* [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) installed.
* A Cloudflare account.

### Installation
1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/eimaam/trust-engine.git](https://github.com/eimaam/trust-engine.git)
    cd trust-engine
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Deploy to the edge:**
    ```bash
    npm run deploy
    ```

---

## 📡 API Usage

### Verify a Company
`GET /v1/verify?name=TRUST+ENGINE`

**Example Response:**
```json
{
  "status": "success",
  "data": {
    "approvedName": "TRUST ENGINE LTD",
    "rcNumber": "123456",
    "companyRegistrationDate": "2024-11-02",
    "status": "ACTIVE",
    "classificationName": "BUSINESS_NAME"
    "natureOfBusiness": "",
    "companyId": "1234566"
  }
}
```

---

## 🏗 Architecture & Bottleneck Management
To prevent IP blocking and "429 Too Many Requests" errors from the source registry, **Trust-Engine** implements a controlled execution window. It transforms external system failures into manageable system delays, ensuring your client applications always receive a clean response.

---

## 👨‍💻 Author
**Eimaam**
* Website: [techflair.io](https://techflair.io)
* Project of the **Tech Flair** ecosystem.

## 📄 License
MIT
