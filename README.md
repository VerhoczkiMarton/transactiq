# TransactIQ

## Development

```bash
docker compose -f docker-compose.development.yml up --build
```

## Production

```bash
docker compose -f docker-compose.production.yml up --build
```

## Migrations

1. Modify your Prisma schema in prisma/schema.prisma to add/change models or fields

2. Enter the running application docker container and create the migration with `npm run prisma:migrate:dev`

3. Test locally and push your code to the repository. On deploy the migrations will be applied automatically
