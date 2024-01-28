#!/bin/sh

echo 'Running migrations...'
python manage.py makemigrations
python manage.py migrate

echo 'Collecting static files...'
python manage.py collectstatic --no-input

# Run app.py when the container launches
python manage.py runserver 0.0.0.0:3050