import os
import firebase_admin
from firebase_admin import credentials, firestore


if not firebase_admin._apps:
    cred_path = os.getenv("FIREBASE_KEY_PATH", "chave.json")
    cred = credentials.Certificate(cred_path)
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
