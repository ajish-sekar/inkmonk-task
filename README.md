# inkmonk-task

## Usage
1. clone this repository
2. change the credentials in server/instance/config.py
3. $ cd server
4. $ pip install -r requirements.txt
5. $ export FLASK_CONFIG=development
6. $ export FLASK_APP=run.py
7. $ flask db init
8. $ flask db migrate
9. $ flask db upgrade
10. $ flask run
11. $ cd static
12. $ npm init
13. $ npm run watch
