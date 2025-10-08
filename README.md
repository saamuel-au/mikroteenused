# Recipe Portal - Microservices Architecture

Mikroteenustel põhinev retseptiportaal, mis kasutab algfaasis mock datat.

## Arhitektuur

- **API Gateway** (Port 3000) - Suunab päringud õigesse mikroteenusesse
- **Users Service** (Port 3001) - Kasutajate registreerimine, login, profiilid
- **Recipes Service** (Port 3002) - Retseptide CRUD operatsioonid
- **Search Service** (Port 3003) - Retseptide otsing märksõnade järgi
- **Ratings Service** (Port 3004) - Hinnangud ja kommentaarid
- **Frontend** (Port 3005) - React/Next.js kasutajaliides

## Käivitamine

1. Veendu, et Docker ja Docker Compose on installitud
2. Käivita kõik teenused:

\`\`\`bash
docker-compose up --build
\`\`\`

3. Ava brauser ja mine aadressile: http://localhost:3005

## API Endpoints

### Kasutajad (läbi Gateway)
- `POST /api/users/register` - Registreerimine
- `POST /api/users/login` - Sisselogimine
- `GET /api/users/profile` - Kasutajaprofiil

### Retseptid (läbi Gateway)
- `GET /api/recipes` - Kõik retseptid
- `GET /api/recipes/:id` - Üks retsept
- `POST /api/recipes` - Uue retsepti lisamine
- `PUT /api/recipes/:id` - Retsepti muutmine
- `DELETE /api/recipes/:id` - Retsepti kustutamine

### Otsing (läbi Gateway)
- `GET /api/search?q=märksõna` - Retseptide otsing

### Hinnangud (läbi Gateway)
- `GET /api/ratings/recipe/:recipeId` - Retsepti hinnangud
- `POST /api/ratings` - Hinnangu lisamine
- `GET /api/ratings/comments/:recipeId` - Kommentaarid
- `POST /api/ratings/comments` - Kommentaari lisamine

## Arendus

Iga teenus on eraldi Node.js + Express server. Algfaasis kasutatakse mock datat (in-memory arrays).

Hiljem saab asendada MySQL andmebaasi ja Keycloak autentimisega.
