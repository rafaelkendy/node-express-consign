const request = require('request')

module.exports = app => {
  this.renault = (req, res) => {
    request.get({
      url: 'http://18.216.83.136:8080/report'
    }, (err, response, body) => {
      try {
        app.utils.log.save('milagro_renault', 'Running filter...')
        if (!err && response.statusCode === 200 && body) {
          let report = JSON.parse(body)

          if (report.data.length > 0) {
            let filteredData = {}

            let models = ['CAPTUR']
            for (let model of report.data) {
              if (models.includes(model.model) && model.geo) {
                filteredData[model.model] = filteredData[model.model] || {}
                for (let geo of model.geo.data) {
                  if (!filteredData[model.model][geo.city] || model.to_value < filteredData[model.model][geo.city].to_value) {
                    filteredData[model.model][geo.city] = { ...model, geo: model.geo.data.filter(g => g.city === geo.city) }
                  }
                }
              }
            }

            let sheetId = '1QdOiAZ-Sf8eALNdYD5SBQCXy7qNGtZwoXzrB_6qjKzg'
            let rows = []
            let range = { sheetId: 2017172313, startRowIndex: 1 }
            let id = 0

            for (let model of Object.keys(filteredData)) {
              for (let city of Object.keys(filteredData[model])) {
                let newCity = app.utils.misc.replaceSpecialChars(city)

                if (!rows.some(o => model === o.values[1].userEnteredValue.stringValue && o.values[10].userEnteredValue.stringValue === newCity)) {
                  let offer = filteredData[model][city]
                  let dealerIndex = Math.floor(Math.random() * offer.geo.length)
                  let dealer = offer.geo[dealerIndex]

                  rows.push({
                    values: [
                      { userEnteredValue: { numberValue: ++id } },
                      { userEnteredValue: { stringValue: app.utils.misc.replaceSpecialChars(offer.model) } },
                      { userEnteredValue: { stringValue: app.utils.misc.replaceSpecialChars(offer.version) } },
                      { userEnteredValue: { numberValue: offer.to_value || 0 } },
                      { userEnteredValue: { numberValue: offer.from_value || 0 } },
                      { userEnteredValue: { numberValue: offer.entry_value || 0 } },
                      { userEnteredValue: { numberValue: offer.installment_value || 0 } },
                      { userEnteredValue: { numberValue: offer.number_of_installment || 0 } },
                      { userEnteredValue: { numberValue: offer.monthly_tax || 0 } },
                      { userEnteredValue: { stringValue: offer.pricing_template ? offer.pricing_template.replace(/\s/g, '_').toLowerCase() : '' } },
                      { userEnteredValue: { stringValue: newCity } },
                      { userEnteredValue: { stringValue: app.utils.misc.replaceSpecialChars(app.utils.misc.states[dealer.state]) } },
                      { userEnteredValue: { stringValue: dealer.url } },
                      { userEnteredValue: { stringValue: offer.start_date } },
                      { userEnteredValue: { stringValue: offer.end_date } }
                    ]
                  })
                }
              }
            }

            if (rows.length > 0) {
              app.api.google.sheets.update(sheetId, range, rows)
              .then(result => {
                if (res) res.status(200).send(result.data)
                app.utils.log.save('milagro_renault', JSON.stringify(result.data))
              })
            } else {
              if (res) res.sendStatus(200)
              app.utils.log.save('milagro_renault', 'No data to be imported.')
            }
          } else {
            if (res) res.sendStatus(200)
            app.utils.log.save('milagro_renault', 'JSON is empty.')
          }
        } else {
          if (res) res.sendStatus(200)
          app.utils.log.save('milagro_renault', 'Something went wrong.')
        }
      } catch (error) {
        console.log(error)
        if (res) res.sendStatus(500)
        app.utils.log.save('milagro_renault', error)
      }
    })
  }

  this.renaultAll = (req, res) => {
    request.get({
      url: 'http://18.216.83.136:8080/report'
    }, (err, response, body) => {
      try {
        app.utils.log.save('milagro_renaultAll', 'Running filter...')
        if (!err && response.statusCode === 200 && body) {
          let report = JSON.parse(body)

          if (report.data.length > 0) {
            let filteredData = {}

            for (let model of report.data) {
              if (model.geo) {
                filteredData[model.model] = filteredData[model.model] || {}
                for (let geo of model.geo.data) {
                  if (!filteredData[model.model][geo.city] || model.to_value < filteredData[model.model][geo.city].to_value) {
                    filteredData[model.model][geo.city] = { ...model, geo: model.geo.data.filter(g => g.city === geo.city) }
                  }
                }
              }
            }

            let sheetId = '1YXtWV54XsW09Ior2bXCd1fBmg9xkPhSxWY83wNUmDYc'
            let rows = []
            let range = { sheetId: 2017172313, startRowIndex: 1 }
            let id = 0

            for (let model of Object.keys(filteredData)) {
              for (let city of Object.keys(filteredData[model])) {
                let newCity = app.utils.misc.replaceSpecialChars(city)

                if (!rows.some(o => model === o.values[1].userEnteredValue.stringValue && o.values[10].userEnteredValue.stringValue === newCity)) {
                  let offer = filteredData[model][city]
                  let dealerIndex = Math.floor(Math.random() * offer.geo.length)
                  let dealer = offer.geo[dealerIndex]

                  rows.push({
                    values: [
                      { userEnteredValue: { numberValue: ++id } },
                      { userEnteredValue: { stringValue: app.utils.misc.replaceSpecialChars(offer.model) } },
                      { userEnteredValue: { stringValue: app.utils.misc.replaceSpecialChars(offer.version) } },
                      { userEnteredValue: { numberValue: offer.to_value || 0 } },
                      { userEnteredValue: { numberValue: offer.from_value || 0 } },
                      { userEnteredValue: { numberValue: offer.entry_value || 0 } },
                      { userEnteredValue: { numberValue: offer.installment_value || 0 } },
                      { userEnteredValue: { numberValue: offer.number_of_installment || 0 } },
                      { userEnteredValue: { numberValue: offer.monthly_tax || 0 } },
                      { userEnteredValue: { stringValue: offer.pricing_template ? offer.pricing_template.replace(/\s/g, '_').toLowerCase() : '' } },
                      { userEnteredValue: { stringValue: newCity } },
                      { userEnteredValue: { stringValue: app.utils.misc.replaceSpecialChars(app.utils.misc.states[dealer.state]) } },
                      { userEnteredValue: { stringValue: dealer.url } },
                      { userEnteredValue: { stringValue: offer.start_date } },
                      { userEnteredValue: { stringValue: offer.end_date } }
                    ]
                  })
                }
              }
            }

            if (rows.length > 0) {
              app.api.google.sheets.update(sheetId, range, rows)
              .then(result => {
                if (res) res.status(200).send(result.data)
                app.utils.log.save('milagro_renaultAll', JSON.stringify(result.data))
              })
            } else {
              if (res) res.sendStatus(200)
              app.utils.log.save('milagro_renaultAll', 'No data to be imported.')
            }
          } else {
            if (res) res.sendStatus(200)
            app.utils.log.save('milagro_renaultAll', 'JSON is empty.')
          }
        } else {
          if (res) res.sendStatus(200)
          app.utils.log.save('milagro_renaultAll', 'Something went wrong.')
        }
      } catch (error) {
        console.log(error)
        if (res) res.sendStatus(500)
        app.utils.log.save('milagro_renaultAll', error)
      }
    })
  }

  this.telecine = (req, res) => {
    const client = 'telecine'

    request.get({
      url: 'https://interface.telecinecloud.com/main/api/v2/marketing-criativo-dinamico-filmes/'
    }, async (err, response, body) => {
      try {
        app.utils.log.save(`milagro_${ client }`, 'Running filter...')
        if (!err && response.statusCode === 200 && body) {
          let report = JSON.parse(body)

          if (report.data.length > 0) {
            let movies = report.data.sort((a, b) => Number(a.vigencia_inicio.replace(/-/g, '')) - Number(b.vigencia_inicio.replace(/-/g, '')))

            let spreadsheetId = '18a7w-7fZ9X8LjqNk1v2Qj3JuFqYl_ZLZLD3Tmdjqows'
            let todos = []
            let lancamentos = []
            let lancamentosValues = ['', '']
            let todosRange = { sheetId: 0 }
            let lancamentosRange = { sheetId: 2109562943 }
            let max = 20
            let counter = 0

            for (let movie of movies) {
              if (todos.length === 0) {
                todos.push({
                  values: [
                    { userEnteredValue: { stringValue: 'id_do_filme' } },
                    { userEnteredValue: { stringValue: 'titulo_original' } },
                    { userEnteredValue: { stringValue: 'titulo_em_portugues' } },
                    { userEnteredValue: { stringValue: 'classificacao_etaria' } },
                    { userEnteredValue: { stringValue: 'endereco_completo' } },
                    { userEnteredValue: { stringValue: 'vigencia_fim' } },
                    { userEnteredValue: { stringValue: 'poster' } }
                  ]
                })
                lancamentos.push({
                  values: [
                    { userEnteredValue: { stringValue: 'endereco' } },
                    { userEnteredValue: { stringValue: 'id_poster' } }
                  ]
                })
              } else {
                let idPoster = /ImageId='(\d*)'/.exec(movie.poster)[1]

                if (movie.trilhos.includes('Lan\u00e7amentos') && counter < max) {
                  ++counter
                  lancamentosValues[0] += `|${ movie.endereco }`
                  lancamentosValues[1] += `|${ movie.id_do_filme }_${ idPoster }`
                }
                todos.push({
                  values: [
                    { userEnteredValue: { numberValue: movie.id_do_filme } },
                    { userEnteredValue: { stringValue: movie.titulo_original } },
                    { userEnteredValue: { stringValue: movie.titulo_em_portugues } },
                    { userEnteredValue: { stringValue: movie.classificacao_etaria } },
                    { userEnteredValue: { stringValue: movie.endereco_completo } },
                    { userEnteredValue: { stringValue: movie.vigencia_fim } },
                    { userEnteredValue: { stringValue: movie.poster } }
                  ]
                })
              }
            }

            lancamentos.push({
              values: [
                { userEnteredValue: { stringValue: lancamentosValues[0].substr(1) } },
                { userEnteredValue: { stringValue: lancamentosValues[1].substr(1) } }
              ]
            })

            if (todos.length > 0) {
              let todosUpdate = await app.api.google.sheets.update(spreadsheetId, todosRange, todos)
              let lancamentosUpdate = await app.api.google.sheets.update(spreadsheetId, lancamentosRange, lancamentos)
              app.utils.log.save(`milagro_${ client }`, JSON.stringify(todosUpdate.data))
              app.utils.log.save(`milagro_${ client }`, JSON.stringify(lancamentosUpdate.data))
              if (res) res.status(200).send({ todos: todosUpdate.data, lancamentos: lancamentosUpdate.data })
            } else {
              if (res) res.sendStatus(200)
              app.utils.log.save(`milagro_${ client }`, 'No data to be imported.')
            }
          } else {
            if (res) res.sendStatus(200)
            app.utils.log.save(`milagro_${ client }`, 'JSON is empty.')
          }
        } else {
          if (res) res.sendStatus(200)
          app.utils.log.save(`milagro_${ client }`, 'Something went wrong.')
        }
      } catch (error) {
        console.log(error)
        if (res) res.sendStatus(500)
        app.utils.log.save(`milagro_${ client }`, error)
      }
    })
  }

  let regions = {
    '1': {
      name: 'BH',
      cities: ['Araxa,State of Minas Gerais,Brazil', 'Barbacena,State of Minas Gerais,Brazil', 'Belo Horizonte,State of Minas Gerais,Brazil', 'Betim,State of Minas Gerais,Brazil', 'Contagem,State of Minas Gerais,Brazil', 'Campo Belo,State of Minas Gerais,Brazil', 'Oliveira,State of Minas Gerais,Brazil', 'Caratinga,State of Minas Gerais,Brazil', 'Conselheiro Lafaiete,State of Minas Gerais,Brazil', 'Pirapora,State of Minas Gerais,Brazil', 'Curvelo,State of Minas Gerais,Brazil', 'Diamantina,State of Minas Gerais,Brazil', 'Divinopolis,State of Minas Gerais,Brazil', 'Bom Despacho,State of Minas Gerais,Brazil', 'Nova Serrana,State of Minas Gerais,Brazil', 'Formiga,State of Minas Gerais,Brazil', 'Guaxupe,State of Minas Gerais,Brazil', 'Sao Jose do Rio Pardo,State of Sao Paulo,Brazil', 'Itabira,State of Minas Gerais,Brazil', 'Itauna,State of Minas Gerais,Brazil', 'Prata,State of Minas Gerais,Brazil', 'Frutal,State of Minas Gerais,Brazil', 'Ituiutaba,State of Minas Gerais,Brazil', 'Joao Monlevade,State of Minas Gerais,Brazil', 'Juiz de Fora,State of Minas Gerais,Brazil', 'Lavras,State of Minas Gerais,Brazil', 'Manhuacu,State of Minas Gerais,Brazil', 'Ouro Preto,State of Minas Gerais,Brazil', 'Montes Claros,State of Minas Gerais,Brazil', 'Alem Paraiba,State of Minas Gerais,Brazil', 'Muriae,State of Minas Gerais,Brazil', 'Cataguases,State of Minas Gerais,Brazil', 'Para de Minas,State of Minas Gerais,Brazil', 'Patos de Minas,State of Minas Gerais,Brazil', 'Patrocinio,State of Minas Gerais,Brazil', 'Pedro Leopoldo,State of Minas Gerais,Brazil', 'Ponte Nova,State of Minas Gerais,Brazil', 'Alfenas,State of Minas Gerais,Brazil', 'Itajuba,State of Minas Gerais,Brazil', 'Pouso Alegre,State of Minas Gerais,Brazil', 'Pocos de Caldas,State of Minas Gerais,Brazil', 'Sao Joao del Rei,State of Minas Gerais,Brazil', 'Sao Lourenco,State of Minas Gerais,Brazil', 'Sao Sebastiao do Paraiso,State of Minas Gerais,Brazil', 'Passos,State of Minas Gerais,Brazil', 'Sete Lagoas,State of Minas Gerais,Brazil', 'Teofilo Otoni,State of Minas Gerais,Brazil', 'Governador Valadares,State of Minas Gerais,Brazil', 'Ipatinga,State of Minas Gerais,Brazil', 'Vicosa,State of Minas Gerais,Brazil', 'Uba,State of Minas Gerais,Brazil', 'Uberaba,State of Minas Gerais,Brazil', 'Uberlandia,State of Minas Gerais,Brazil', 'Araguari,State of Minas Gerais,Brazil', 'Catalao,State of Goias,Brazil', 'Tres Coracoes,State of Minas Gerais,Brazil', 'Varginha,State of Minas Gerais,Brazil']
    },
    '2': {
      name: 'SP',
      cities: ['Caraguatatuba,State of Sao Paulo,Brazil', 'Jacarei,State of Sao Paulo,Brazil', 'Registro,State of Sao Paulo,Brazil', 'Praia Grande,State of Sao Paulo,Brazil', 'Peruibe,State of Sao Paulo,Brazil', 'Itanhaem,State of Sao Paulo,Brazil', 'Santos,State of Sao Paulo,Brazil', 'Sao Paulo,State of Sao Paulo,Brazil', 'Sao Caetano do Sul,State of Sao Paulo,Brazil', 'Cotia,State of Sao Paulo,Brazil', 'Sao Bernardo do Campo,State of Sao Paulo,Brazil', 'Barueri,State of Sao Paulo,Brazil', 'Guarulhos,State of Sao Paulo,Brazil', 'Aruja,State of Sao Paulo,Brazil', 'Santo Andre,State of Sao Paulo,Brazil', 'Osasco,State of Sao Paulo,Brazil', 'Mogi das Cruzes,State of Sao Paulo,Brazil', 'Suzano,State of Sao Paulo,Brazil', 'Poa,State of Sao Paulo,Brazil']
    },
    '3': {
      name: 'CAMP',
      cities: ['Adamantina,State of Sao Paulo,Brazil', 'Tupa,State of Sao Paulo,Brazil', 'Dracena,State of Sao Paulo,Brazil', 'Hortolandia,State of Sao Paulo,Brazil', 'Americana,State of Sao Paulo,Brazil', 'Sumare,State of Sao Paulo,Brazil', 'Amparo,State of Sao Paulo,Brazil', 'Aracatuba,State of Sao Paulo,Brazil', 'Araraquara,State of Sao Paulo,Brazil', 'Araras,State of Sao Paulo,Brazil', 'Leme,State of Sao Paulo,Brazil', 'Assis,State of Sao Paulo,Brazil', 'Paraguacu Paulista,State of Sao Paulo,Brazil', 'Atibaia,State of Sao Paulo,Brazil', 'Braganca Paulista,State of Sao Paulo,Brazil', 'Avare,State of Sao Paulo,Brazil', 'Barretos,State of Sao Paulo,Brazil', 'Batatais,State of Sao Paulo,Brazil', 'Ituverava,State of Sao Paulo,Brazil', 'Bauru,State of Sao Paulo,Brazil', 'Bebedouro,State of Sao Paulo,Brazil', 'Botucatu,State of Sao Paulo,Brazil', 'Campinas,State of Sao Paulo,Brazil', 'Valinhos,State of Sao Paulo,Brazil', 'Paulinia,State of Sao Paulo,Brazil', 'Vinhedo,State of Sao Paulo,Brazil', 'Jaguariuna,State of Sao Paulo,Brazil', 'Catanduva,State of Sao Paulo,Brazil', 'Franca,State of Sao Paulo,Brazil', 'Ibitinga,State of Sao Paulo,Brazil', 'Indaiatuba,State of Sao Paulo,Brazil', 'Itapetininga,State of Sao Paulo,Brazil', 'Itapeva,State of Sao Paulo,Brazil', 'Tiete,State of Sao Paulo,Brazil', 'Itu,State of Sao Paulo,Brazil', 'Boituva,State of Sao Paulo,Brazil', 'Jaboticabal,State of Sao Paulo,Brazil', 'Jales,State of Sao Paulo,Brazil', 'Fernandopolis,State of Sao Paulo,Brazil', 'Bariri,State of Sao Paulo,Brazil', 'Jau,State of Sao Paulo,Brazil', 'Jundiai,State of Sao Paulo,Brazil', 'Franco da Rocha,State of Sao Paulo,Brazil', 'Limeira,State of Sao Paulo,Brazil', 'Lins,State of Sao Paulo,Brazil', 'Marilia,State of Sao Paulo,Brazil', 'Olimpia,State of Sao Paulo,Brazil', 'Sao Joaquim da Barra,State of Sao Paulo,Brazil', 'Orlandia,State of Sao Paulo,Brazil', 'Ourinhos,State of Sao Paulo,Brazil', 'Santa Cruz do Rio Pardo,State of Sao Paulo,Brazil', 'Penapolis,State of Sao Paulo,Brazil', 'Piracicaba,State of Sao Paulo,Brazil', 'Capivari,State of Sao Paulo,Brazil', 'Piraju,State of Sao Paulo,Brazil', 'Pirassununga,State of Sao Paulo,Brazil', 'Presidente Prudente,State of Sao Paulo,Brazil', 'Presidente Venceslau,State of Sao Paulo,Brazil', 'Ribeirao Preto,State of Sao Paulo,Brazil', 'Rio Claro,State of Sao Paulo,Brazil', 'Sao Carlos,State of Sao Paulo,Brazil', 'Sao Joao da Boa Vista,State of Sao Paulo,Brazil', 'Itapira,State of Sao Paulo,Brazil', 'Mogi Guacu,State of Sao Paulo,Brazil', 'Sao Jose do Rio Preto,State of Sao Paulo,Brazil', 'Sao Roque,State of Sao Paulo,Brazil', 'Sertaozinho,State of Sao Paulo,Brazil', 'Sorocaba,State of Sao Paulo,Brazil', 'Monte Alto,State of Sao Paulo,Brazil', 'Taquaritinga,State of Sao Paulo,Brazil', 'Matao,State of Sao Paulo,Brazil', 'Tatui,State of Sao Paulo,Brazil', 'Votuporanga,State of Sao Paulo,Brazil']
    },
    '4': {
      name: 'RJ',
      cities: ['Angra dos Reis,State of Rio de Janeiro,Brazil', 'Marica,State of Rio de Janeiro,Brazil', 'Teresopolis,State of Rio de Janeiro,Brazil', 'Araruama,State of Rio de Janeiro,Brazil', 'Sao Pedro da Aldeia,State of Rio de Janeiro,Brazil', 'Baixo Guandu,State of Espirito Santo,Brazil', 'Barra de Sao Francisco,State of Espirito Santo,Brazil', 'Colatina,State of Espirito Santo,Brazil', 'Cachoeiro de Itapemirim,State of Espirito Santo,Brazil', 'Venda Nova do Imigrante,State of Espirito Santo,Brazil', 'Campos dos Goytacazes,State of Rio de Janeiro,Brazil', 'Cruzeiro,State of Sao Paulo,Brazil', 'Eunapolis,State of Bahia,Brazil', 'Guacui,State of Espirito Santo,Brazil', 'Guarapari,State of Espirito Santo,Brazil', 'Lorena,State of Sao Paulo,Brazil', 'Guaratingueta,State of Sao Paulo,Brazil', 'Itaperuna,State of Rio de Janeiro,Brazil', 'Aracruz,State of Espirito Santo,Brazil', 'Nova Venecia,State of Espirito Santo,Brazil', 'Linhares,State of Espirito Santo,Brazil', 'Sao Mateus,State of Espirito Santo,Brazil', 'Macae,State of Rio de Janeiro,Brazil', 'Nova Friburgo,State of Rio de Janeiro,Brazil', 'Petropolis,State of Rio de Janeiro,Brazil', 'Resende,State of Rio de Janeiro,Brazil', 'Sao Goncalo,State of Rio de Janeiro,Brazil', 'Niteroi,State of Rio de Janeiro,Brazil', 'Rio de Janeiro,State of Rio de Janeiro,Brazil', 'Duque de Caxias,State of Rio de Janeiro,Brazil', 'Nova Iguacu,State of Rio de Janeiro,Brazil', 'Itaguai,State of Rio de Janeiro,Brazil', 'Santo Antonio de Padua,State of Rio de Janeiro,Brazil', 'Sao Jose dos Campos,State of Sao Paulo,Brazil', 'Taubate,State of Sao Paulo,Brazil', 'Teixeira de Freitas,State of Bahia,Brazil', 'Tres Rios,State of Rio de Janeiro,Brazil', 'Miguel Pereira,State of Rio de Janeiro,Brazil', 'Vassouras,State of Rio de Janeiro,Brazil', 'Vila Velha,State of Espirito Santo,Brazil', 'Vitoria,State of Espirito Santo,Brazil', 'Serra,State of Espirito Santo,Brazil', 'Cariacica,State of Espirito Santo,Brazil', 'Volta Redonda,State of Rio de Janeiro,Brazil']
    },
    '5': {
      name: 'POA',
      cities: ['Alegrete,State of Rio Grande do Sul,Brazil', 'Maravilha,State of Santa Catarina,Brazil', 'Ararangua,State of Santa Catarina,Brazil', 'Bage,State of Rio Grande do Sul,Brazil', 'Bento Goncalves,State of Rio Grande do Sul,Brazil', 'Cacador,State of Santa Catarina,Brazil', 'Cachoeira do Sul,State of Rio Grande do Sul,Brazil', 'Camaqua,State of Rio Grande do Sul,Brazil', 'Campos Novos,State of Santa Catarina,Brazil', 'Capinzal,State of Santa Catarina,Brazil', 'Carazinho,State of Rio Grande do Sul,Brazil', 'Caxias do Sul,State of Rio Grande do Sul,Brazil', 'Chapeco,State of Santa Catarina,Brazil', 'Concordia,State of Santa Catarina,Brazil', 'Criciuma,State of Santa Catarina,Brazil', 'Cruz Alta,State of Rio Grande do Sul,Brazil', 'Curitibanos,State of Santa Catarina,Brazil', 'Erechim,State of Rio Grande do Sul,Brazil', 'Florianopolis,State of Santa Catarina,Brazil', 'Palhoca,State of Santa Catarina,Brazil', 'Sao Jose,State of Santa Catarina,Brazil', 'Tres Passos,State of Rio Grande do Sul,Brazil', 'Frederico Westphalen,State of Rio Grande do Sul,Brazil', 'Gramado,State of Rio Grande do Sul,Brazil', 'Ijui,State of Rio Grande do Sul,Brazil', 'Joacaba,State of Santa Catarina,Brazil', 'Lages,State of Santa Catarina,Brazil', 'Lajeado,State of Rio Grande do Sul,Brazil', 'Montenegro,State of Rio Grande do Sul,Brazil', 'Novo Hamburgo,State of Rio Grande do Sul,Brazil', 'Osorio,State of Rio Grande do Sul,Brazil', 'Palmeira das Missoes,State of Rio Grande do Sul,Brazil', 'Passo Fundo,State of Rio Grande do Sul,Brazil', 'Pelotas,State of Rio Grande do Sul,Brazil', 'Guaiba,State of Rio Grande do Sul,Brazil', 'Cachoeirinha,State of Rio Grande do Sul,Brazil', 'Canoas,State of Rio Grande do Sul,Brazil', 'Porto Alegre,State of Rio Grande do Sul,Brazil', 'Viamao,State of Rio Grande do Sul,Brazil', 'Gravatai,State of Rio Grande do Sul,Brazil', 'Ituporanga,State of Santa Catarina,Brazil', 'Rio do Sul,State of Santa Catarina,Brazil', 'Rio Grande,State of Rio Grande do Sul,Brazil', 'Santa Cruz do Sul,State of Rio Grande do Sul,Brazil', 'Santa Maria,State of Rio Grande do Sul,Brazil', 'Santa Rosa,State of Rio Grande do Sul,Brazil', 'Santana do Livramento,State of Rio Grande do Sul,Brazil', 'Santiago,State of Rio Grande do Sul,Brazil', 'Santo Angelo,State of Rio Grande do Sul,Brazil', 'Itaqui,State of Rio Grande do Sul,Brazil', 'Sao Borja,State of Rio Grande do Sul,Brazil', 'Sao Gabriel,State of Rio Grande do Sul,Brazil', 'Sao Leopoldo,State of Rio Grande do Sul,Brazil', 'Sao Luiz Gonzaga,State of Rio Grande do Sul,Brazil', 'Sao Miguel do Oeste,State of Santa Catarina,Brazil', 'Taquara,State of Rio Grande do Sul,Brazil', 'Torres,State of Rio Grande do Sul,Brazil', 'Tubarao,State of Santa Catarina,Brazil', 'Uruguaiana,State of Rio Grande do Sul,Brazil', 'Vacaria,State of Rio Grande do Sul,Brazil', 'Fraiburgo,State of Santa Catarina,Brazil', 'Videira,State of Santa Catarina,Brazil', 'Xanxere,State of Santa Catarina,Brazil']
    },
    '6': {
      name: 'REC',
      cities: ['Alagoinhas,State of Bahia,Brazil', 'Itabaiana,State of Sergipe,Brazil', 'Aracaju,State of Sergipe,Brazil', 'Arapiraca,State of Alagoas,Brazil', 'Palmeira dos Indios,State of Alagoas,Brazil', 'Penedo,State of Alagoas,Brazil', 'Arcoverde,State of Pernambuco,Brazil', 'Caico,State of Rio Grande do Norte,Brazil', 'Sousa,State of Paraiba,Brazil', 'Cajazeiras,State of Paraiba,Brazil', 'Campina Grande,State of Paraiba,Brazil', 'Caruaru,State of Pernambuco,Brazil', 'Feira de Santana,State of Bahia,Brazil', 'Eusebio,State of Ceara,Brazil', 'Fortaleza,State of Ceara,Brazil', 'Garanhuns,State of Pernambuco,Brazil', 'Palmares,State of Pernambuco,Brazil', 'Iguatu,State of Ceara,Brazil', 'Quixada,State of Ceara,Brazil', 'Itabuna,State of Bahia,Brazil', 'Jacobina,State of Bahia,Brazil', 'Jequie,State of Bahia,Brazil', 'Itapetinga,State of Bahia,Brazil', 'Joao Pessoa,State of Paraiba,Brazil', 'Juazeiro do Norte,State of Ceara,Brazil', 'Uniao dos Palmares,State of Alagoas,Brazil', 'Maragogi,State of Alagoas,Brazil', 'Maceio,State of Alagoas,Brazil', 'Mossoro,State of Rio Grande do Norte,Brazil', 'Natal,State of Rio Grande do Norte,Brazil', 'Patos,State of Paraiba,Brazil', 'Pau dos Ferros,State of Rio Grande do Norte,Brazil', 'Paulo Afonso,State of Bahia,Brazil', 'Juazeiro,State of Bahia,Brazil', 'Petrolina,State of Pernambuco,Brazil', 'Picos,State of Piaui,Brazil', 'Recife,State of Pernambuco,Brazil', 'Cabo de Santo Agostinho,State of Pernambuco,Brazil', 'Jaboatao dos Guararapes,State of Pernambuco,Brazil', 'Salvador,State of Bahia,Brazil', 'Camacari,State of Bahia,Brazil', 'Lauro de Freitas,State of Bahia,Brazil', 'Santo Antonio de Jesus,State of Bahia,Brazil', 'Senhor do Bonfim,State of Bahia,Brazil', 'Araripina,State of Pernambuco,Brazil', 'Serra Talhada,State of Pernambuco,Brazil', 'Crateus,State of Ceara,Brazil', 'Sobral,State of Ceara,Brazil', 'Teresina,State of Piaui,Brazil', 'Caxias,State of Maranhao,Brazil', 'Parnaiba,State of Piaui,Brazil', 'Goiana,State of Pernambuco,Brazil', 'Timbauba,State of Pernambuco,Brazil', 'Carpina,State of Pernambuco,Brazil', 'Valenca,State of Bahia,Brazil', 'Brumado,State of Bahia,Brazil', 'Vitoria da Conquista,State of Bahia,Brazil', 'Guanambi,State of Bahia,Brazil']
    },
    '7': {
      name: 'BSB',
      cities: ['Anapolis,State of Goias,Brazil', 'Araguaina,State of Tocantins,Brazil', 'Ouro Preto do Oeste,State of Rondonia,Brazil', 'Ariquemes,State of Rondonia,Brazil', 'Jaru,State of Rondonia,Brazil', 'Bacabal,State of Maranhao,Brazil', 'Santa Ines,State of Maranhao,Brazil', 'Balsas,State of Maranhao,Brazil', 'Barra do Garcas,State of Mato Grosso,Brazil', 'Luis Eduardo Magalhaes,State of Bahia,Brazil', 'Barreiras,State of Bahia,Brazil', 'Belem,State of Para,Brazil', 'Ananindeua,State of Para,Brazil', 'Boa Vista,State of Roraima,Brazil', 'Caceres,State of Mato Grosso,Brazil', 'Rolim de Moura,State of Rondonia,Brazil', 'Cacoal,State of Rondonia,Brazil', 'Caldas Novas,State of Goias,Brazil', 'Castanhal,State of Para,Brazil', 'Ceres,State of Goias,Brazil', 'Formosa,State of Goias,Brazil', 'Goianesia,State of Goias,Brazil', 'Goiania,State of Goias,Brazil', 'Aparecida de Goiania,State of Goias,Brazil', 'Goiatuba,State of Goias,Brazil', 'Gurupi,State of Tocantins,Brazil', 'Imperatriz,State of Maranhao,Brazil', 'Itumbiara,State of Goias,Brazil', 'Jatai,State of Goias,Brazil', 'Ji-Parana,State of Rondonia,Brazil', 'Lucas do Rio Verde,State of Mato Grosso,Brazil', 'Macapa,State of Amapa,Brazil', 'Manaus,State of Amazonas,Brazil', 'Maraba,State of Para,Brazil', 'Parauapebas,State of Para,Brazil', 'Mineiros,State of Goias,Brazil', 'Palmas,State of Tocantins,Brazil', 'Pires do Rio,State of Goias,Brazil', 'Porangatu,State of Goias,Brazil', 'Porto Velho,State of Rondonia,Brazil', 'Primavera do Leste,State of Mato Grosso,Brazil', 'Quirinopolis,State of Goias,Brazil', 'Redencao,State of Para,Brazil', 'Rio Branco,State of Acre,Brazil', 'Rio Verde,State of Goias,Brazil', 'Rondonopolis,State of Mato Grosso,Brazil', 'Santarem,State of Para,Brazil', 'Sao Luis,State of Maranhao,Brazil', 'Sinop,State of Mato Grosso,Brazil', 'Tangara da Serra,State of Mato Grosso,Brazil', 'Unai,State of Minas Gerais,Brazil', 'Paracatu,State of Minas Gerais,Brazil', 'Uruacu,State of Goias,Brazil', 'Luziania,State of Goias,Brazil', 'Varzea Grande,State of Mato Grosso,Brazil', 'Cuiaba,State of Mato Grosso,Brazil', 'Vilhena,State of Rondonia,Brazil']
    },
    '8': {
      name: 'CWB',
      cities: ['Apucarana,State of Parana,Brazil', 'Arapongas,State of Parana,Brazil', 'Assis Chateaubriand,State of Parana,Brazil', 'Blumenau,State of Santa Catarina,Brazil', 'Brusque,State of Santa Catarina,Brazil', 'Tijucas,State of Santa Catarina,Brazil', 'Campo Grande,State of Mato Grosso do Sul,Brazil', 'Campo Mourao,State of Parana,Brazil', 'Sao Mateus do Sul,State of Parana,Brazil', 'Canoinhas,State of Santa Catarina,Brazil', 'Cascavel,State of Parana,Brazil', 'Castro,State of Parana,Brazil', 'Cianorte,State of Parana,Brazil', 'Corumba,State of Mato Grosso do Sul,Brazil', 'Curitiba,State of Parana,Brazil', 'Dourados,State of Mato Grosso do Sul,Brazil', 'Foz do Iguacu,State of Parana,Brazil', 'Francisco Beltrao,State of Parana,Brazil', 'Dois Vizinhos,State of Parana,Brazil', 'Goioere,State of Parana,Brazil', 'Guarapuava,State of Parana,Brazil', 'Balneario Camboriu,State of Santa Catarina,Brazil', 'Itajai,State of Santa Catarina,Brazil', 'Ivaipora,State of Parana,Brazil', 'Jaragua do Sul,State of Santa Catarina,Brazil', 'Jardim,State of Mato Grosso do Sul,Brazil', 'Joinville,State of Santa Catarina,Brazil', 'Londrina,State of Parana,Brazil', 'Mafra,State of Santa Catarina,Brazil', 'Marechal Candido Rondon,State of Parana,Brazil', 'Maringa,State of Parana,Brazil', 'Nova Andradina,State of Mato Grosso do Sul,Brazil', 'Navirai,State of Mato Grosso do Sul,Brazil', 'Palotina,State of Parana,Brazil', 'Paranagua,State of Parana,Brazil', 'Paranaiba,State of Mato Grosso do Sul,Brazil', 'Chapadao do Sul,State of Mato Grosso do Sul,Brazil', 'Paranavai,State of Parana,Brazil', 'Pato Branco,State of Parana,Brazil', 'Imbituva,State of Parana,Brazil', 'Telemaco Borba,State of Parana,Brazil', 'Ponta Grossa,State of Parana,Brazil', 'Ponta Pora,State of Mato Grosso do Sul,Brazil', 'Jacarezinho,State of Parana,Brazil', 'Santo Antonio da Platina,State of Parana,Brazil', 'Cornelio Procopio,State of Parana,Brazil', 'Sao Bento do Sul,State of Santa Catarina,Brazil', 'Toledo,State of Parana,Brazil', 'Tres Lagoas,State of Mato Grosso do Sul,Brazil', 'Umuarama,State of Parana,Brazil', 'Irati,State of Parana,Brazil', 'Uniao da Vitoria,State of Parana,Brazil']
    }
  }

  let national = [
    ...regions[1].cities,
    ...regions[2].cities,
    ...regions[3].cities,
    ...regions[4].cities,
    ...regions[5].cities,
    ...regions[6].cities,
    ...regions[7].cities,
    ...regions[8].cities
  ]

  this.fiat = (req, res) => {
    request.get({
      url: 'http://offer-service.k8s.fcalatam.com.br/public/offer'
    }, (err, response, body) => {
      try {
        app.utils.log.save('milagro_fiat', 'Running filter...')
        if (!err && response.statusCode === 200 && body) {
          let offers = JSON.parse(body)

          if (offers.length > 0) {
            // let sheetId = '1qZFFwxHeflrDnOea23hcmsuXvWukEPGe9-Wz9-xfkEI'
            // let rows = []
            // let range = { sheetId: 385413134, startRowIndex: 1 }

            // for (let offer of offers) {
            //   if (offer.category.name === 'PESSOA FÍSICA') {
            //     let cities = []

            //     for (let whitelist of offer.whitelist) {
            //       let tempCities = []

            //       if (whitelist.coverage === 'NATIONAL' || whitelist.coverage === 'STATE') {
            //         tempCities = national
            //       } else if (whitelist.coverage === 'REGIONAL') {
            //         tempCities = regions[whitelist.regionalCode].cities
            //       }

            //       if (whitelist.cities.length > 0) {
            //         for (let city of whitelist.cities) {
            //           tempCities = tempCities.filter(c => c.includes(`${ city },`))
            //         }
            //       } else if (whitelist.state) {
            //         let state = app.utils.misc.replaceSpecialChars(whitelist.state)
            //         tempCities = tempCities.filter(c => c.includes(`${ state },`))
            //       }

            //       cities = [ ...cities, ...tempCities ]

            //       if (whitelist.coverage === 'NATIONAL') break
            //     }

            //     for (let blacklist of offer.blacklist) {
            //       if (blacklist.cities.length > 0) {
            //         for (let city of blacklist.cities) {
            //           cities = cities.filter(c => !c.includes(`${ city },`))
            //         }
            //       } else if (blacklist.state) {
            //         let state = app.utils.misc.replaceSpecialChars(blacklist.state)
            //         cities = cities.filter(c => !c.includes(`${ state },`))
            //       }
            //     }

            //     cities = [ ...new Set(cities) ]

            //     rows.push({
            //       values: [
            //         { userEnteredValue: { numberValue: offer.id } },
            //         { userEnteredValue: { stringValue: offer.model.name } },
            //         { userEnteredValue: { stringValue: offer.model.mvsDescription } },
            //         { userEnteredValue: { numberValue: offer.payment.price || 0 } },
            //         { userEnteredValue: { numberValue: offer.payment.originalPrice || 0 } },
            //         { userEnteredValue: { numberValue: offer.payment.entrancePrice || 0 } },
            //         { userEnteredValue: { numberValue: offer.payment.installmentsPrice || 0 } },
            //         { userEnteredValue: { numberValue: offer.payment.installmentsNumber || 0 } },
            //         { userEnteredValue: { numberValue: offer.payment.installmentsFee || 0 } },
            //         { userEnteredValue: { stringValue: cities.join('|') } },
            //         { userEnteredValue: { stringValue: offer.expirationDate } },
            //         { userEnteredValue: { stringValue: `https://ofertas.fiat.com.br?offerId=${ offer.id }` } }
            //       ]
            //     })
            //   }
            // }

            let sheetId = '1qZFFwxHeflrDnOea23hcmsuXvWukEPGe9-Wz9-xfkEI'
            let rows = []
            let range = { sheetId: 1479078687, startRowIndex: 1 }
            let filteredData = {}

            for (let offer of offers) {
              let model = offer.model.mvsDescription
              let expirationDate = offer.expirationDate.split('/').reverse().join('')
              let today = (new Date()).toJSON().split('T')[0].replace(/-/g, '')
              if (offer.category.name === 'PESSOA FÍSICA' && offer.category.group.indexOf('VENDAS') !== -1 && expirationDate >= today) {
                let blacklistCities = []
                filteredData[model] = filteredData[model] || {}

                for (let blacklist of offer.blacklist) {
                  if (blacklist.cities.length > 0) {
                    for (let city of blacklist.cities) {
                      let geo = national.find(g => g.includes(`${ app.utils.misc.replaceSpecialChars(city) },`))
                      blacklistCities.push(geo)
                    }
                  } else if (blacklist.state) {
                    for (let geo of national) {
                      if (geo.includes(`${ blacklist.state },`)) {
                        blacklistCities.push(geo)
                      }
                    }
                  } else if (blacklist.coverage === 'NATIONAL') {
                    for (let geo of national) {
                      blacklistCities.push(geo)
                    }
                  }
                }

                blacklistCities = [ ...new Set(blacklistCities) ]

                for (let whitelist of offer.whitelist) {
                  if (whitelist.cities.length > 0) {
                    for (let city of whitelist.cities) {
                      let geo = national.find(g => g.includes(`${ app.utils.misc.replaceSpecialChars(city) },`))
                      if (geo && !blacklistCities.includes(geo)) {
                        filteredData[model][geo] = filteredData[model][geo] || {}
                        if (!filteredData[model][geo].payment || filteredData[model][geo].payment.price > offer.payment.price) {
                          filteredData[model][geo] = offer
                        }
                      }
                    }
                  } else if (whitelist.state) {
                    for (let geo of national) {
                      if (geo.includes(`${ whitelist.state },`) && !blacklistCities.includes(geo)) {
                        filteredData[model][geo] = filteredData[model][geo] || {}
                        if (!filteredData[model][geo].payment || filteredData[model][geo].payment.price > offer.payment.price) {
                          filteredData[model][geo] = offer
                        }
                      }
                    }
                  } else if (whitelist.coverage === 'NATIONAL') {
                    for (let geo of national) {
                      if (!blacklistCities.includes(geo)) {
                        filteredData[model][geo] = filteredData[model][geo] || {}
                        if (!filteredData[model][geo].payment || filteredData[model][geo].payment.price > offer.payment.price) {
                          filteredData[model][geo] = offer
                        }
                      }
                    }
                  }
                }
              }
            }

            for (let model of Object.keys(filteredData)) {
              for (let city of Object.keys(filteredData[model])) {
                let offer = filteredData[model][city]

                rows.push({
                  values: [
                    { userEnteredValue: { numberValue: offer.id } },
                    { userEnteredValue: { stringValue: offer.model.mvsCode } },
                    { userEnteredValue: { stringValue: offer.model.name } },
                    { userEnteredValue: { stringValue: offer.model.mvsDescription } },
                    { userEnteredValue: { numberValue: offer.payment.price || 0 } },
                    { userEnteredValue: { numberValue: offer.payment.originalPrice || 0 } },
                    { userEnteredValue: { numberValue: offer.payment.entrancePrice || 0 } },
                    { userEnteredValue: { numberValue: offer.payment.installmentsPrice || 0 } },
                    { userEnteredValue: { numberValue: offer.payment.installmentsNumber || 0 } },
                    { userEnteredValue: { numberValue: offer.payment.installmentsFee || 0 } },
                    { userEnteredValue: { numberValue: offer.payment.residual || 0 } },
                    { userEnteredValue: { stringValue: offer.payment.condition || '' } },
                    { userEnteredValue: { stringValue: city } },
                    { userEnteredValue: { stringValue: offer.expirationDate } },
                    { userEnteredValue: { stringValue: `https://ofertas.fiat.com.br?offerId=${ offer.id }` } }
                  ]
                })
              }
            }

            if (rows.length > 0) {
              app.api.google.sheets.update(sheetId, range, rows)
              .then(result => {
                if (res) res.status(200).send(result.data)
                app.utils.log.save('milagro_fiat', JSON.stringify(result.data))
              })
            } else {
              if (res) res.sendStatus(200)
              app.utils.log.save('milagro_fiat', 'No data to be imported.')
            }
          } else {
            if (res) res.sendStatus(200)
            app.utils.log.save('milagro_fiat', 'JSON is empty.')
          }
        } else {
          if (res) res.sendStatus(200)
          app.utils.log.save('milagro_fiat', 'Something went wrong.')
        }
      } catch (error) {
        console.log(error)
        if (res) res.sendStatus(500)
        app.utils.log.save('milagro_fiat', error)
      }
    })
  }

  return this
}
