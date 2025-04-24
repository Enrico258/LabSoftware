import firebase_admin
from firebase_admin import credentials, firestore

def buscarPontos():
    cred = credentials.Certificate("chave.json")
    firebase_admin.initialize_app(cred)

    db = firestore.client(descarte)

    colecao = "pontos"
    #descarte = input("Digite um material:")

    enderecos = []

    docs = db.collection(colecao).stream()

    for doc in docs:
        dados = doc.to_dict()
        if "descarte" in dados and descarte in dados["descarte"]:
            enderecos.append(dados.get("local"))
