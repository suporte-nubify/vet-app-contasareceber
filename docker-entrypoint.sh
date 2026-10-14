#!/bin/sh
set -e

mkdir -p /app/data

if [ ! -f /app/data/app.db ]; then
  if [ -f /app/seed/app.db.seed ]; then
    echo ">> Copiando banco inicial (cadastros, sem lançamentos)…"
    cp /app/seed/app.db.seed /app/data/app.db
  else
    echo ">> Aviso: nenhum seed encontrado; o app sobe sem dados."
  fi
else
  echo ">> Usando banco existente em /app/data/app.db"
fi

exec node server.js
