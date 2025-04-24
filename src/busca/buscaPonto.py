import firebase_admin
from firebase_admin import credentials, firestore

def buscarPontos(descarte):
    print("📥 buscarPontos chamado com:", descarte)

    if not firebase_admin._apps:
        print("🚀 Inicializando Firebase...")
        cred = credentials.Certificate("chave.json")
        firebase_admin.initialize_app(cred)
    else:
        print("⚠️ Firebase já estava iniciado")

    db = firestore.client()
    colecao = "pontos"
    enderecos = []

    print("📚 Consultando Firestore...")
    docs = db.collection(colecao).stream()

    print("📦 Filtrando resultados...")
    for doc in docs:
        dados = doc.to_dict()
        if "descarte" in dados and descarte in dados["descarte"]:
            enderecos.append(dados.get("local"))

    print("✅ Endereços encontrados:", enderecos)
    return enderecos
