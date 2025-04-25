import sys
import firebase_admin
from firebase_admin import credentials, firestore

caminho_chave = sys.argv[1]
cred = credentials.Certificate(caminho_chave)
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
