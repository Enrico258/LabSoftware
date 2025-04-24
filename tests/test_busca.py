from busca.buscaPonto import buscarPontos

def test_somar():
    print("🔍 Iniciando teste...")
    resultado = buscarPontos("papel")
    print("✅ Resultado recebido:", resultado)
    
    assert resultado == ['R. Bairi, 435', 'Rua Anita Garibaldi, 30']
