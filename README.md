# Simulador-filas-Kendall


## Evento de Chegada 

```
contabiliza tempo
  se ainda tem espaço na fila
    acresenta na fila
    se sou o primeiro da fila (considerando nro serividores)
      agenda saida (tempoAtual + rnd(minAtendimento..maxAtendimento))

  agenda chegada(tempoAtual + rnd(minEspera..maxEspera))
```

  ## Evento Saida
```
contabiliza tempo
  sai da fila (fila --)
  se nao estou sendo atendido
    agenda saida (tempoAtual + rnd(minAtendimento..maxAtendimento))
```
