from busca.buscaPonto import buscarPontos

def test_busca():
    resultado = buscarPontos("papel")
    
    assert resultado == ['R. Bairi, 435', 'Rua Anita Garibaldi, 30']
