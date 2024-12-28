$(document).ready(function() {
    var products = [];
    

    $.ajax({
        url: 'https://cenfelecsolutions.com/chelsy/Ejecutar',
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({
            "CPROCEDURE": "sp_listarproductos",
            "COBSERVACIONES": ""
        }),
        success: function(response) {
            let myrpta=JSON.parse(response.Rpta);
            // Asumiendo que la respuesta es un array de productos
            products = myrpta.map(function(item) {
                return item.CPRODUCTODESC; // Ajusta esto según la estructura de tu respuesta
            });

            // Inicializar el autocompletado con los productos obtenidos
            $("#product").autocomplete({
                source: function(request, response) {
                    var results = $.ui.autocomplete.filter(products, request.term);
                    response(results.slice(0, 50)); // Limitar a 90 resultados
                }
            });
        },
        error: function(xhr, status, error) {
            console.error("Error al obtener los productos: " + error);
        }
    });

   

    $("#productForm").on("submit", function(event) {
        event.preventDefault();

        var product = $("#product").val();
        var price = $("#price").val();
        var stock = $("#stock").val();
        var type = $("#type").val();
        var warehouse = $("#warehouse").val();

           let  producto= product,
            precio= parseFloat(price),
            stock = parseFloat(stock),
            tipo =type,
            almacen= warehouse
        


        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Accept", "application/json");
        
        const raw = JSON.stringify({
          "CPROCEDURE": "sp_RegistrarProducto",
          "COBSERVACIONES": `{|producto|:|${producto}|,|precio|:${precio},|stock|:${stock},|tipo|:|${tipo}|,|almacen|:|${almacen}|}`
        });
        
        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow"
        };

        fetch("https://cenfelecsolutions.com/chelsy/Ejecutar", requestOptions)
          .then((response) => alert( response.text()))
          .then((result) => console.log(result))
          .catch((error) => console.error(error));
    
    });
});