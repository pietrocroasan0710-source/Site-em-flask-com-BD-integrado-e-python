# Para começarmos o desenvolvimento e integração do BD com a página web devemos primeiramente instalar o flask na máquina, e importá-lo no python
# instalar = pip install flask

# Importar
from flask import Flask

#construir app
app = Flask(__name__)

# métodos 
@app.route("/")
def home():
    return "<h1>Home Page</h1>"


# verificação do paramento app com o main
if __name__ == '__main__':
    app.run(debug=True)

