# Para começarmos o desenvolvimento e integração do BD com a página web devemos primeiramente instalar o flask na máquina, e importá-lo no python
# instalar = pip install flask

# Importar
from flask import Flask, url_for

#construir app
app = Flask(__name__)

# rotas, os três """ são para prioridade
@app.route('/')
def hello_word():
    return f"Olá mundo, primeira vez no flask, <a href= '{ url_for('rota_sobre') }'> Página sobre </a>"

@app.route('/sobre')
def rota_sobre():
    return """ 
    <b>Estudo sobre rotas</b> , graças a <a href="https://youtube.com/@programadorpython">Canal do Youtube</a>
    """

# rodar main.py
app.run(port=5000, debug=True)