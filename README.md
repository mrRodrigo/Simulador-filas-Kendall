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

## Obtenção de um número pseudo-aleatório
```U(A, B) = (B – A) x U(0, 1) + A ```

## Filas
![](https://github.com/mrRodrigo/Simulador-filas-Kendall/blob/master/download.png)

## NOTAÇÃO DE KENDALL

A/B/C/K/N/D
 A: distribuição das chegadas de clientes
 B: distribuição dos atendimentos de clientes
 C: número de servidores da fila
 K: capacidade da fila
 N: tamanho da população
 D: política de atendimento
