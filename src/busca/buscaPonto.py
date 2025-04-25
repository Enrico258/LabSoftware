import sys
import firebase_admin
from firebase_admin import credentials, firestore

caminho = sys.argv[1]
print(caminho)
cred = credentials.Certificate(caminho)
firebase_admin.initialize_app(cred)

db = firestore.client()

def buscarPontos(descarte):
    colecao = "pontos"

    enderecos = []

    docs = db.collection(colecao).stream()

    for doc in docs:
        dados = doc.to_dict()
        if "descarte" in dados and descarte in dados["descarte"]:
            enderecos.append(dados.get("local"))

    return (enderecos)
