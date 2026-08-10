// ==========================================
// CONFIGURACIÓN DE WHATSAPP
// ==========================================

const NUMERO_WHATSAPP = "56975379705";


// ==========================================
// ABRIR PRODUCTO
// ==========================================

function abrirProducto(
    codigo,
    nombre,
    categoria,
    talla,
    precio,
    descripcion
) {

    // Mostrar información de la prenda

    document.getElementById("producto-codigo").textContent =
        "CÓDIGO " + codigo;

    document.getElementById("producto-nombre").textContent =
        nombre;

    document.getElementById("producto-categoria").textContent =
        categoria.toUpperCase();

    document.getElementById("producto-talla").textContent =
        talla;

    document.getElementById("producto-precio").textContent =
        precio;

    document.getElementById("producto-descripcion").textContent =
        descripcion;


    // Abrir ventana

    document
        .getElementById("ventana-producto")
        .classList.add("mostrar");


    // Botón ME INTERESA

    document.getElementById("boton-whatsapp").onclick = function() {

        interesarPrenda(
            codigo,
            nombre,
            categoria,
            talla,
            precio
        );

    };

}


// ==========================================
// ENVIAR PRENDA A WHATSAPP
// ==========================================

function interesarPrenda(
    codigo,
    nombre,
    categoria,
    talla,
    precio
) {

    // Crear mensaje para WhatsApp

    const mensaje =
        "Hola, V&R ReStyle.\n\n" +
        "Me interesa esta prenda:\n" +
        "Código: " + codigo + "\n" +
        "Prenda: " + nombre + "\n" +
        "Categoría: " + categoria + "\n" +
        "Talla: " + talla + "\n" +
        "Precio: " + precio + "\n\n" +
        "Quisiera consultar por la compra.";


    // Crear enlace de WhatsApp

    const enlace =
        "https://wa.me/" +
        NUMERO_WHATSAPP +
        "?text=" +
        encodeURIComponent(mensaje);


    // Abrir WhatsApp

    window.open(enlace, "_blank");

}


// ==========================================
// CERRAR PRODUCTO
// ==========================================

function cerrarProducto() {

    document
        .getElementById("ventana-producto")
        .classList.remove("mostrar");

}// ==========================================
// FILTRAR PRODUCTOS POR CATEGORÍA
// ==========================================

function filtrarProductos(categoria, boton) {

    const productos = document.querySelectorAll(".producto");
    const botones = document.querySelectorAll(".filtro");

    // Quitar activo de todos los botones
    botones.forEach(function(btn) {
        btn.classList.remove("activo");
    });

    // Activar el botón seleccionado
    boton.classList.add("activo");

    // Mostrar u ocultar productos
    productos.forEach(function(producto) {

        const categoriaProducto =
            producto.getAttribute("data-categoria");

        if (
            categoria === "todas" ||
            categoriaProducto === categoria
        ) {

            producto.style.display = "";

        } else {

            producto.style.display = "none";

        }

    });

}// ==========================================
// FILTRO DE PRODUCTOS
// ==========================================

function filtrarProductos(categoria, boton) {

    const productos = document.querySelectorAll(".producto");
    const botones = document.querySelectorAll(".filtro");

    // Cambiar botón activo
    botones.forEach(function(btn) {
        btn.classList.remove("activo");
    });

    boton.classList.add("activo");

    // Mostrar productos correspondientes
    productos.forEach(function(producto) {

        const categoriaProducto =
            producto.getAttribute("data-categoria");

        if (
            categoria === "todas" ||
            categoriaProducto === categoria
        ) {

            producto.style.display = "";

        } else {

            producto.style.display = "none";

        }

    });
}