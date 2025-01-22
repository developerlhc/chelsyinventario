$(document).ready(function () {
    var products = [];
    var brands = ["Marca1", "Marca2", "Marca3"];
    var families = ["Familia1", "Familia2", "Familia3"];

    // Hacer la petición POST para obtener los productos
    $.ajax({
        url: 'https://cenfelecsolutions.com/chelsy/Ejecutar',
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({
            "CPROCEDURE": "sp_listarproductos",
            "COBSERVACIONES": ""
        }),
        success: function (response) {
            let myrpta = JSON.parse(response.Rpta);
            // Asumiendo que la respuesta es un array de productos
            products = myrpta.map(function (item) {
                return item.CPRODUCTODESC; // Ajusta esto según la estructura de tu respuesta
            });

            // Inicializar el autocompletado con los productos obtenidos
            $("#product").autocomplete({
                source: function (request, response) {
                    var results = $.ui.autocomplete.filter(products, request.term);
                    response(results.slice(0, 90)); // Limitar a 90 resultados
                },
                select: function (event, ui) {
                    var selectedProduct = ui.item.value;
                    // Aquí puedes hacer una petición para obtener los detalles del producto seleccionado
                    // Por simplicidad, asumimos que los detalles están en el array `products`
                    var productDetails = myrpta.find(function (item) {
                        return item.CPRODUCTODESC === selectedProduct;
                    });

                    if (productDetails) {
                       
                        var jsonData = JSON.stringify({
                            producto: productDetails.CPRODUCTODESC
                        });

                        var sqlCommand = `EXEC sp_obtenerstockprod @Data = N'${jsonData}'`;
                        console.log(sqlCommand);

                        $.ajax({
                            url: 'https://cenfelecsolutions.com/chelsy/Ejecutar', // Cambia esto por la URL de tu servidor
                            type: 'POST',
                            data: { COBSERVACIONES: jsonData, CPROCEDURE: "sp_obtenerstockprod" },
                            success: function (response) {
debugger
                                let rptas = response.Rpta;
                                console.log(rptas);
                                rptas = "[" + rptas + "]";

                                let myarray = JSON.parse(rptas);
                                $("#productTableBody").empty();

                                // Recorrer el objeto JSON y agregar filas a la tabla
                                myarray.forEach(rpta => {
                                    var row = `<tr>
                                        <td>${rpta.cproductodesc}</td>
                                        <td>${rpta.pcom}</td>
                                        <td>${rpta.pvent}</td>
                                        <td>${rpta.nstock}</td>
                                    </tr>`;
                                    $("#productTableBody").append(row);
                                });
                                $("#productTable").show();
                            },
                            error: function (xhr, status, error) {
                                $("#message").text("Error: " + error);
                            }
                        });

                    }
                }
            });
        },
        error: function (xhr, status, error) {
            console.error("Error al obtener los productos: " + error);
        }
    });

    $("#brand").autocomplete({
        source: brands
    });

    $("#family").autocomplete({
        source: families
    });

    $("#productForm").on("submit", function (event) {
        event.preventDefault();

        var product = $("#product").val();
        var brand = $("#brand").val();
        var family = $("#family").val();
        var price = $("#price").val();
        var priceventa=$("#priceventa").val();
        var stock = $("#stock").val();
        var type = $("#type").val();
        var warehouse = $("#warehouse").val();

        var jsonData = JSON.stringify({
            producto: product,
            marca: brand,
            familia: family,
            precio: parseFloat(price),
            stock: parseFloat(stock),
            preciocosto: parseFloat(priceventa),
            tipo: type,
            almacen: warehouse
        });

        var sqlCommand = `sp_RegistrarProductochelsy @Data = N'${jsonData}'`;
        console.log(sqlCommand);
let mirpta=""
        $.ajax({
            url: 'https://cenfelecsolutions.com/chelsy/Ejecutar', // Cambia esto por la URL de tu servidor
            type: 'POST',
            data: { COBSERVACIONES: jsonData, CPROCEDURE: "sp_RegistrarProductochelsy" },
            success: function (response) {
                mirpta = JSON.parse(response.Rpta);
                alert(mirpta.mensaje);
                $("#message").text(mirpta.mensaje);
            },
            error: function (xhr, status, error) {
                $("#message").text("Error: " + error);
            }
        });
    });
});