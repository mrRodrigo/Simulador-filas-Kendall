# Simulador-filas-Kendall

## NodeJS
Aviso! É necessário utilizar a v12.18.4 do NodeJS para garantir a funcionalidade do simulador. Versões anteriores podem apresentar problemas como probabilidades e tempos negativos.


## To run
``` node . SimpleQueue ```

É possível executar outras configurações de filas simples, basta adicionar o arquivo desejado na pasta ```inputs``` e chamar pela linha de comando o nome do arquivo criado. Siga o modelo presente no arquivo ```SimpleQueue.json```.

### Parâmetros de execução 

| Comando                | default | descrição                                                   |
|------------------------|---------|-------------------------------------------------------------|
| *-v, --verbose, verbose* | false   | Mostra todos detalhes  da execução.                         |
| *-r, --run, run, + \[n\]*  | 1       | Executa n vezes a simulação e retorna a média de execuções. |

**exemplos**: ```node . SimpleQueue --run 10 -v``` ```node . SimpleQueue -r 10 --verbose``` ```node . SimpleQueue --verbose run 4```

## Geração de números pseudo-aleatórios

Se seu arquivo tiver a chave ```randomList``` com uma lista válida de números aleatórios, o simulador tomará como prioridade essa lista. Caso deseje que o simulador gere os valores, deixe a lista vazia e preencha a chave ```totalRandomNumbers``` com o total de números aleatórios desejados. Se houver pelo menos um item na lista, o total desejado de valores aleatórios será ignorado.

## Fórmula para obter um número pseudo-aleatório
```U(A, B) = (B – A) x U(0, 1) + A ```

## Filas
![](https://github.com/mrRodrigo/Simulador-filas-Kendall/blob/master/asset/download.png)

## NOTAÇÃO DE KENDALL

### A/B/C/K/N/D
 - A: distribuição das chegadas de clientes
 - B: distribuição dos atendimentos de clientes
 - C: número de servidores da fila
 - K: capacidade da fila
 - N: tamanho da população
 - D: política de atendimento


## Algoritmo utilizado para o evento de Chegada 

```
contabiliza tempo
  se ainda tem espaço na fila
    acresenta na fila
    se sou o primeiro da fila (considerando nro serividores)
      agenda saida (tempoAtual + rnd(minAtendimento..maxAtendimento))

  agenda chegada(tempoAtual + rnd(minEspera..maxEspera))
```

## Algoritmo utilizado para o saída
```
contabiliza tempo
  sai da fila (fila --)
  se nao estou sendo atendido
    agenda saida (tempoAtual + rnd(minAtendimento..maxAtendimento))
```

## Exemplo de input

``` 
{
    "queues": {
        "name": "Q1",
        "arrivalMax": 2,
        "arrivalMin": 1,
        "awaitMax": 6,
        "awaitMin": 3,
        "capacity": 3,
        "init": 2,
        "size": 1
    },

    "randomList": [],

    "totalRandomNumbers": 10
}

```
## Exemplo de output


```

--------------------------------------------------
Queue configuration.................... G/G/1/3   
--------------------------------------------------
                    *EVENTS*
┌─────────┬───────────┬───────────┬────────────┐  
│ (index) │   type    │   time    │ queueState │  
├─────────┼───────────┼───────────┼────────────┤  
│    0    │ 'CHEGADA' │ '2.0000'  │     0      │  
│    1    │ 'CHEGADA' │ '3.6308'  │     1      │  
│    2    │ 'CHEGADA' │ '4.7746'  │     2      │  
│    3    │  'SAIDA'  │ '5.1860'  │     1      │  
│    4    │ 'CHEGADA' │ '5.9483'  │     3      │  
│    5    │ 'CHEGADA' │ '7.1805'  │     3      │  
│    6    │ 'CHEGADA' │ '8.2118'  │     3      │  
│    7    │  'SAIDA'  │ '10.0619' │     2      │  
│    8    │ 'CHEGADA' │ '10.1376' │     3      │  
└─────────┴───────────┴───────────┴────────────┘  
--------------------------------------------------
--------------------------------------------------
With 0 on the queue, 2.0000 has been elapsed.     
With 1 on the queue, 1.6308 has been elapsed.     
With 2 on the queue, 1.9818 has been elapsed.     
With 3 on the queue, 4.5250 has been elapsed.     
--------------------------------------------------
Total loss: 2  Total time: 10.1376
--------------------------------------------------
                    *RESULTS*                     
--------------------------------------------------
┌─────────┬───────┬──────────┬─────────────┐      
│ (index) │ state │   time   │ probability │      
├─────────┼───────┼──────────┼─────────────┤      
│    0    │  '0'  │ '2.0000' │  '19.73%'   │      
│    1    │  '1'  │ '1.6308' │  '16.09%'   │      
│    2    │  '2'  │ '1.9818' │  '19.55%'   │      
│    3    │  '3'  │ '4.5250' │  '44.64%'   │      
└─────────┴───────┴──────────┴─────────────┘     

```

