# Tverrfaglig-eksamen

## Database solution

This project uses PostgreSQL as the database engine.

- The database service is defined in `docker-compose.yml`.
- The Postgres container uses:
  - `POSTGRES_USER=postgres`
  - `POSTGRES_PASSWORD=postgres`
  - `POSTGRES_DB=tverrfaglig_eksamen`
- On startup, the SQL file `spørringer.sql` is mounted into the container and executed automatically.
- `spørringer.sql` creates one table:
  - `Produkt` with columns:
    - `id` — `SERIAL PRIMARY KEY`
    - `navn` — `text NOT NULL`
    - `beskrivelse` — `text NOT NULL`
    - `pris` — `float NOT NULL`
    - `bilde` — `text NOT NULL`

The Node.js app connects to the database through `src/db.js` using environment variables from `.env`.

## Functionality

The backend is built with Express and provides a product CRUD API under `/produkter`.

Available endpoints:

- `GET /produkter` — list all products
- `GET /produkter/:id` — fetch a product by ID
- `POST /produkter` — create a new product
- `PUT /produkter/:id` — update an existing product
- `DELETE /produkter/:id` — delete a product

Other application behavior:

- Serves static files from the `src/` folder.
- Admin panel is available at `/admin` and is served from `src/adminpanel.html`.
- Admin assets are loaded from `/adminpanel.css` and `/adminpanel.js` to keep paths stable under `/admin/`.
- Root endpoint `/` returns a basic server message.
- Health check endpoint `/health` returns `{ status: 'OK' }`.

## How to start the project on your own device

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy environment configuration:
   ```bash
   copy .env.example .env
   ```
   Then edit `.env` if you need custom database settings.

3. Start the full stack with Docker Compose:
   ```bash
   docker-compose up -d
   ```
   This starts the database, the Node.js app, and the NGINX reverse proxy.

   The NGINX proxy is configured so `/admin` is restricted to local subnet access, while the rest of the site remains publicly available.

4. Open the app in your browser:
   - App/API base: `http://localhost/`
   - Admin panel: `http://localhost/admin`

5. If you want to run only the app locally instead of using Docker:
   ```bash
   npm start
   ```
   Or during development use:
   ```bash
   npm run dev
   ```

## Notes

- If you do not want to use Docker, install PostgreSQL locally and configure `.env` with your database host, port, name, user, and password.
- The database table definition is in `spørringer.sql`, which is also used by Docker Compose to initialize the database.
- If the server cannot connect to the database, verify that the Postgres container is running and the `.env` values match.
