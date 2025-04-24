from busca.buscaPonto import somar, subtrair

def test_somar():
    assert somar(2, 3) == 5

def test_subtrair():
    assert subtrair(5, 3) == 2
