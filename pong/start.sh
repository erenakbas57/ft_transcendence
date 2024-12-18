#!/bin/sh
./wait-for-it.sh db:5432 --timeout=15 --strict -- echo "Database is ready"
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py load_user
python3 manage.py collectstatic --no-input

python3 manage.py runserver 0.0.0.0:8000
