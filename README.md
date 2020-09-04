# Simulador-filas-Kendall

## To run
``` node . SimpleQueue ```

É possível executar outras configurações de filas simples, basta adicionar o arquivo desejado na pasta ```inputs``` e chamar pela linha de comando o nome do arquivo criado. Siga o modelo presente no arquivo ```SimpleQueue.json```.

## Obtenção de um número pseudo-aleatório
```U(A, B) = (B – A) x U(0, 1) + A ```

## Filas
![](https://github.com/mrRodrigo/Simulador-filas-Kendall/blob/master/asset/download.png)

## NOTAÇÃO DE KENDALL

A/B/C/K/N/D
 A: distribuição das chegadas de clientes
 B: distribuição dos atendimentos de clientes
 C: número de servidores da fila
 K: capacidade da fila
 N: tamanho da população
 D: política de atendimento


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
