//Classe para a criação dos objetos
class Despesa
{
    constructor(ano, mes, dia, tipo, descricao, valor)
    {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    //Verifica se todos os campos foram preenchidos corretamente
    validarDados()
    {
        let atributos = 0
        for(let i in this)
        {
            if (this[i] == undefined || this[i] == "" || this[i] == null)
            {
                atributos++
            }
        }

        return (atributos <= 0)
    }
}

//Classe para manipular o localStorage
class BD
{
    //Gera o primeiro id de valor 0
    constructor()
    {
        let id = localStorage.getItem('id')

        if(id === null)
        {
            localStorage.setItem('id', 0)
        }
    }

    /*Gera o proxímo id que armazenará um objeto despesa*/
    getProximoId()
    {
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1
    }

    /*Adiciona ao id criado anteriormente o objeto, convertendo-o em um JSON*/
    gerar(d)
    {
        let id = this.getProximoId()//recebe o id de referencia
        localStorage.setItem(id, JSON.stringify(d)) //Adiciona o objeto convertido na posição id
        localStorage.setItem('id', id) //Atualiza o valor de 'id'
    }

    //Recupera todos as linhas JSON e retorna um array de objetos
    recuperarTodosRegistros()
    {
        let id = localStorage.getItem('id')
        let arrayDespesas = Array()

        for(let i = 1; i <= id; i++)
        {
            let despesa = JSON.parse(localStorage.getItem(i)) //Faz a conversão de JSON para um objeto literal
            
            if(localStorage.getItem(i) === null)
            {
                continue //Se o item não possuir valor, volta para o inicio do for, caso contrário continua o código
            }

            despesa.id = i //Adiciona o atribudo chamado "id" ao objeto e recebe o valor de i que baseado no valor atual de 'id' em localStorage
            arrayDespesas.push(despesa) //Adiciona a despesa no Array
        }

        return arrayDespesas 
    }

    //Acionado quando o botão de pesquisa é clicado e aplica os filtros
    pesquisar(despesa)
    {
        let despesasFiltradas = Array() //Array criada para ser retornada com os objetos que foram filtrados
        despesasFiltradas = this.recuperarTodosRegistros() //Recebe todos os registros

        //Vai eliminando os objetos de acordo com os filtros
        if(despesa.ano != "")//Entra na condição se o atributo do objeto não for vazio
        {
            despesasFiltradas = despesasFiltradas.filter(d => despesa.ano == d.ano)
        }

        if(despesa.mes != "")
        {
            despesasFiltradas = despesasFiltradas.filter(d => despesa.mes == d.mes)
        }

        if(despesa.dia != "")
        {
            despesasFiltradas = despesasFiltradas.filter(d => despesa.dia == d.dia)
        }

        if(despesa.tipo != "")
        {
            despesasFiltradas = despesasFiltradas.filter(d => despesa.tipo == d.tipo)
        }

        if(despesa.descricao != "")
        {
            despesasFiltradas = despesasFiltradas.filter(d => despesa.descricao == d.descricao)
        }

        if(despesa.valor != "")
        {
            despesasFiltradas = despesasFiltradas.filter(d => despesa.valor == d.valor)
        }

        return despesasFiltradas //Retorna as despesas já com o filtro aplicado
    }

    //Ativada quando confirmada a exclusão do item em localStorage
    remover(id)
    {
        localStorage.removeItem(id) //Remove a linha com base no id passado como parâmetro
    }
}


let bd = new BD()

//Chamada quando clicado o botão "+" na tela de registro
function cadastrarDespesa()
{
    //Array recebe todos os inputs
    let arrayAtributos = Array(
        ano = document.getElementById('ano'),
        mes = document.getElementById('mes'),
        dia = document.getElementById('dia'),
        tipo = document.getElementById('tipo'),
        descricao = document.getElementById('descricao'),
        valor = document.getElementById('valor')
    )

    //Criação do objeto despesa, passando como parâmetros os valores dos inputs
    let despesa = new Despesa(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value)

    
    let campos_restantes = "| "
    
    let validarDados = despesa.validarDados() //Chama a verificação do preenchimento dos dados e retorna true ou false
    
    if (validarDados === true) //Se true, cria a despesa e adiciona em localStorage
    {
        let contaDadosIguais = 0
        bd.recuperarTodosRegistros().forEach(d => {
            if(d.ano == despesa.ano &&
               d.mes == despesa.mes &&
               d.dia == despesa.dia &&
               d.tipo == despesa.tipo &&
               d.descricao == despesa.descricao &&
               d.valor == despesa.valor
            )
            {
                contaDadosIguais++
            }
        })
        console.log('contaDados: ' + contaDadosIguais)

        if(contaDadosIguais > 0)
        {
            $('#modalRegistraDespesa').modal('show') //Exibe o modal de aviso de sucesso na operação
            modalRegistraDespesa('modal-header bg-primary', 'Ops...', 'Já existe uma despesa identica cadastrada', 'btn btn-primary', 'Voltar', null) //Chama a função que estiliza o modal
        }
        else
        {
            bd.gerar(despesa)

            $('#modalRegistraDespesa').modal('show')
            modalRegistraDespesa('modal-header bg-success', 'Sucesso!!!', 'Sua despesa foi cadastrada com êxito!', 'btn btn-success', 'Continuar', null)

            for (let i in arrayAtributos)
            {
                arrayAtributos[i].value = "" //Limpa todos os campos para que uma nova despesa seja cadastrada
            }
        }
    }
    else //Se false, é apresentado um modal de aviso de erro no cadastro, informando quais campos não foram preenchidos
    {
        for (let i in arrayAtributos) //Looping que passa pelos campos verificando qual não foi preenchido e aplica uma borda vermelha para indicar
        {
            if(arrayAtributos[i].value == "")
            {
                arrayAtributos[i].classList.add('borda')
                campos_restantes += arrayAtributos[i].attributes.getNamedItem('id').value.toUpperCase() + " | "
            }
        }

        $('#modalRegistraDespesa').modal('show')
        modalRegistraDespesa('modal-header bg-danger', 'Algo deu errado!', 'Você não preencheu corretamente alguns campos, como:', 'btn btn-danger', 'Tentar novamente', campos_restantes)

    }
}

//Ativada quando o campo é clicado
function removeBorda(itemHtml)
{
    document.getElementById(itemHtml).classList.remove('borda')
}

//Função que estiliza o modal exibido
function modalRegistraDespesa(bgTitle, title, msg, btnColor, textBtn, campos_restantes)
{
    document.querySelector('#modalRegistraDespesa #modal-header').className = bgTitle
    document.querySelector('#modalRegistraDespesa .modal-title').innerHTML = title
    document.querySelector('#modalRegistraDespesa .modal-recado').innerHTML = msg
    document.querySelector('#modalRegistraDespesa #botaoModal').className = btnColor
    document.querySelector('#modalRegistraDespesa #botaoModal').innerHTML = textBtn
    document.querySelector('.campos_restantes').innerHTML = campos_restantes
}

//Função que exibe as despesas na tela em uma tabela
function carregarListaDespesas(despesasFiltradas)
{
    let despesas = bd.recuperarTodosRegistros() //Armazena todos os registros
    let listaDespesas = document.getElementById('listaDespesas') //seleciona o corpo da tabela
    let linharodape = document.getElementById("total") //Seleciona o rodapé da tabela
    linharodape.innerHTML = ""
    linharodape.style.borderTop = "3px solid white"
    let recado = document.getElementById('recado') //Seleciona a área que exibirá um recado
    recado.innerHTML = ""
    recado.style.margin = 15 + 'px'
    recado.style.fontSize = 26 + 'px'
    recado.style.textAlign = 'center'
    let valorTotal = 0 //Recebe a soma dos valores de todas as despesas exibidas na tela

    if(despesasFiltradas != null) //Verifica se foi recebido um parâmetro: Se sim, altera o conteúdo de despesas
    {
        despesas = despesasFiltradas
        listaDespesas.innerHTML = ""
    }
    
    let listraTabela = 1
    //Passa por cada item de despesas e exibe uma linha de tabela na tela
    despesas.forEach(d => {

        let linha = listaDespesas.insertRow() //Cria uma linha no corpo da tabela
        linha.insertCell(0).innerHTML = d.dia + "/" + d.mes + "/" + d.ano //Adiciona um conteúdo relacionado ao th - Data

        if(listraTabela % 2 == 0)
        {
            linha.style.backgroundColor = "#242222"
        }
        listraTabela++

        switch(d.tipo) //Verifica o value do campo "Tipo" e o relaciona com seu respectivo conteúdo
        {   
            case '1':
                d.tipo = "Alimentação"
                break;
            case '2':
                d.tipo = "Educação"
                break;
            case '3':
                d.tipo = "Lazer"
                break;
            case '4':
                d.tipo = "Saúde"
                break;
            case '5':
                d.tipo = "Transporte"
                break;
        }

        linha.insertCell(1).innerHTML = d.tipo //Adiciona um conteúdo relacionado ao th - Tipo
        linha.insertCell(2).innerHTML = d.descricao //Adiciona um conteúdo relacionado ao th - Descrição
        linha.insertCell(3).innerHTML = "R$" + d.valor //Adiciona um conteúdo relacionado ao th - Valor

        valorTotal = valorTotal + parseFloat(d.valor) //Converte o valor em int e faz a soma de todos d.valor dos objetos

        let botao = document.createElement('button') //Cria o botão de excluir despesa
        botao.className = 'btn btn-danger'
        botao.innerHTML = '<i class="fas fa-times"></i>'
        botao.id = `id_${d.id}`
        botao.onclick = () => {
            let id = botao.id.replace('id_', '')
            $('#modalRegistraDespesa').modal('show')
            modalRegistraDespesa("modal-header bg-warning",
            "Excluir despesa", 

            `Deseja realmente excluir esta despesa?<br><br> 
            ${"<strong>Descrição: </strong>" + d.descricao}<br>
            ${"<strong>Tipo: </strong>" + d.tipo}<br>
            ${"<strong>Data: </strong>" + d.dia + "/" + d.mes + "/" + d.ano}<br>
            ${"<strong>Valor: </strong> R$" + d.valor}<br>`,

            "btn btn-warning text-light", "Continuar", "")

            document.getElementById("botaoModal").onclick = () => {
                bd.remover(id)
                window.location.reload()
            }
        }
        linha.insertCell(4).append(botao) //Adiciona o botão na linha
    })

    //Verifica se o array de despesas está vazio
    if(despesas.length === 0) //Se estiver vazio, exibe a mensagem
    {
        recado.innerHTML = "Não foi encontrada nenhuma despesa relacionada ao filtro aplicado"
    }
    else //Se não estiver vazio, vai exibir o total no tfoot da tabela
    {
        let total = linharodape.insertRow()

        total.insertCell(0).innerHTML = "<strong>TOTAL</strong>"
        total.insertCell(1).innerHTML = "<strong>-</strong>"
        total.insertCell(2).innerHTML = "<strong>-</strong>"
        total.insertCell(3).innerHTML = "<strong>R$" + valorTotal + "</strong>"
        total.insertCell(4).innerHTML = ""
    }
    
    if(localStorage.length <= 1) //Verifica se possui itens em localStorage, se não possuir, exibe a mensagem
    {
        recado.innerHTML = "Não existem despesas cadastradas"
    }

    return despesas
}

//Acionado quando clicado o botão de pesquisar
function pesquisarDespesas()
{
    removeCorSetas()
    
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    //Cria um objeto com os valores que foram aplicados no filtro
    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

    let filtro = bd.pesquisar(despesa) //Recebe uma array de retorno do método pesquisar com os objetos filtrados

    carregarListaDespesas(filtro) //Exibe a lista na tela, passando como parâmetro a array com os objetos filtrados

    return filtro
}

function removeCorSetas()
{
    let outrasSetasCima = document.querySelectorAll('.fa-arrow-up')
    let outrasSetasBaixo = document.querySelectorAll('.fa-arrow-down')

    outrasSetasCima.forEach(s => s.style.color = "")
    outrasSetasBaixo.forEach(s => s.style.color = "")
}

let crescenteDecrescente = false

function ordenaDespesasValor()
{
    let despesas = pesquisarDespesas()

    let setaCima = document.querySelector('#Valor .fa-arrow-up')
    let setaBaixo = document.querySelector('#Valor .fa-arrow-down')

    removeCorSetas()

    if(crescenteDecrescente === false)
    {
        despesas = despesas.sort((a,b) => a.valor - b.valor)
        crescenteDecrescente = true
        setaCima.style.color = 'green'
    }
    else
    {
        despesas = despesas.sort((a,b) => b.valor - a.valor)
        crescenteDecrescente = false
        setaBaixo.style.color = 'red'
    }
    carregarListaDespesas(despesas)
}

function ordenaDespesasDescricao()
{
    let despesas = pesquisarDespesas()

    let setaCima = document.querySelector('#Descricao .fa-arrow-up')
    let setaBaixo = document.querySelector('#Descricao .fa-arrow-down')

    removeCorSetas()

    if(crescenteDecrescente === false)
    {
        despesas = despesas.sort((p1, p2) => p1.descricao.localeCompare(p2.descricao))
        crescenteDecrescente = true
        setaCima.style.color = 'yellowgreen'
    }
    else
    {
        despesas = despesas.sort((p1, p2) => p2.descricao.localeCompare(p1.descricao))
        crescenteDecrescente = false
        setaBaixo.style.color = 'red'
    }
    carregarListaDespesas(despesas)
}

function ordenaDespesasTipo()
{
    let despesas = pesquisarDespesas()

    let setaCima = document.querySelector('#Tipo .fa-arrow-up')
    let setaBaixo = document.querySelector('#Tipo .fa-arrow-down')

    removeCorSetas()

    if(crescenteDecrescente === false)
    {
        despesas = despesas.sort((p1, p2) => p1.tipo.localeCompare(p2.tipo))
        crescenteDecrescente = true
        setaCima.style.color = 'yellowgreen'
    }
    else
    {
        despesas = despesas.sort((p1, p2) => p2.tipo.localeCompare(p1.tipo))
        crescenteDecrescente = false
        setaBaixo.style.color = 'red'
    }
    carregarListaDespesas(despesas)
}

function ordenaDespesasData()
{
    let despesas = pesquisarDespesas()

    let setaCima = document.querySelector('#Data .fa-arrow-up')
    let setaBaixo = document.querySelector('#Data .fa-arrow-down')

    removeCorSetas()

    let despesasMes = []
    let despesasDia = []

    let ordemData = []

    if(crescenteDecrescente === false)
    {
        for(let i = 2023; i <= 2025; i++)
        {
            despesasMes = despesas.filter(d => d.ano == i).sort((a,b) =>  a.mes - b.mes)
            console.log(despesasMes)
            for(let i = 1; i <= 12; i++)
            {
                despesasDia = despesasMes.filter(d => d.mes == i).sort((a,b) =>  a.dia - b.dia)
                console.log(despesasDia)
                
                if(despesasDia.length != 0)
                {
                    ordemData.push(...despesasDia)
                }
            }
            //despesasMes.forEach(d => d.sort((d,b) => d.dia - b.dia))
            //despesasDia = despesasMes.sort((a,b) => a.dia - b.dia)
            //ordemData.push(...despesasDia)
        }
        crescenteDecrescente = true
        setaCima.style.color = 'yellowgreen'
        console.log('ordem despesa: ' + ordemData[{}])
    }
    else
    {
        for(let i = 2025; i >= 2023; i--)
        {
            despesasMes = despesas.filter(d => d.ano == i).sort((a,b) =>  b.mes - a.mes)
            console.log(despesasMes)
            for(let i = 12; i >= 1; i--)
            {
                despesasDia = despesasMes.filter(d => d.mes == i).sort((a,b) =>  b.dia - a.dia)
                console.log(despesasDia)
                
                if(despesasDia.length != 0)
                {
                    ordemData.push(...despesasDia)
                }
            }
            //despesasMes.forEach(d => d.sort((d,b) => d.dia - b.dia))
            //despesasDia = despesasMes.sort((a,b) => a.dia - b.dia)
            //ordemData.push(...despesasDia)
        }
        crescenteDecrescente = false
        setaBaixo.style.color = 'red'
    }
    carregarListaDespesas(ordemData)
    document.querySelector('body')
}
