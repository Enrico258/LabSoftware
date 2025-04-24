from busca.buscaPonto import buscarPontos

def test_somar():
    assert buscarPontos("papel") == ['R. Bairi, 435', 'Rua Anita Garibaldi, 30']
