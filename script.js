$(function() {
    var products = ["Producto1", "Producto2", "Producto3"];
    var brands = ["Marca1", "Marca2", "Marca3"];
    var families = ["Familia1", "Familia2", "Familia3"];

    $("#product").autocomplete({
        source: products
    });

    $("#brand").autocomplete({
        source: brands
    });

    $("#family").autocomplete({
        source: families
    });

    $("#productForm").on("submit", function(event) {
        event.preventDefault();
        var product = $("#product").val();
        var message = "";

        if (products.includes(product)) {
            message = "Producto actualizado";
        } else {
            message = "Producto nuevo";
            products.push(product);
        }
        alert(message);
        $("#message").text(message);
    });
});