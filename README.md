# E-commerce tradicional (MVP)

Monorepo com backend Django/DRF e frontend Next.js.

## Estrutura

- `backend/` API Django + DRF
- `frontend/` Next.js (App Router)

## Execução 

Backend:
1. `cd backend`
2. `python -m venv .venv`
3. `.venv/Scripts/pip install -r requirements.txt`
4. `.venv/Scripts/python manage.py migrate`
5. `.venv/Scripts/python manage.py runserver`

Frontend:
1. `cd frontend`
2. `npm install`
3. Defina `NEXT_PUBLIC_API_URL=http://localhost:8000` no ambiente
4. `npm run dev`


OBS: Descrição completa do projeto será adicionada em breve.