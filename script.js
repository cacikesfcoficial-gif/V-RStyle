// ==========================================
// V&R RESTYLE - JAVASCRIPT LIMPIO
// ==========================================

const NUMERO_WHATSAPP = "56975379705";

let imagenesProducto = [];
let indiceImagen = 0;

function abrirProducto(codigo, nombre, categoria, talla, precio, descripcion, imagenes = []) {
    document.getElementById("producto-codigo").textContent = "CÓDIGO " + codigo;
    document.getElementById("producto-nombre").textContent = nombre;
    document.getElementById("producto-categoria").textContent = categoria.toUpperCase();
    document.getElementById("producto-talla").textContent = talla;
    document.getElementById("producto-precio").textContent = precio;
    document.getElementById("producto-descripcion").textContent = descripcion;

    imagenesProducto = Array.isArray(imagenes) ? imagenes : [];
    indiceImagen = 0;
    actualizarImagen();

    document.getElementById("ventana-producto").classList.add("mostrar");

    document.getElementById("boton-whatsapp").onclick = function () {
        interesarPrenda(codigo, nombre, categoria, talla, precio);
    };
}

function actualizarImagen() {
    const imagen = document.getElementById("producto-imagen-principal");
    const anterior = document.querySelector(".flecha-imagen.izquierda");
    const siguiente = document.querySelector(".flecha-imagen.derecha");
    const indicadores = document.getElementById("indicadores-imagenes");

    if (!imagenesProducto.length) {
        imagen.removeAttribute("src");
        imagen.alt = "Sin fotografía";
        anterior.style.display = "none";
        siguiente.style.display = "none";
        indicadores.innerHTML = "";
        return;
    }

    imagen.src = imagenesProducto[indiceImagen];
    imagen.alt = "Fotografía de la prenda";

    const varias = imagenesProducto.length > 1;
    anterior.style.display = varias ? "flex" : "none";
    siguiente.style.display = varias ? "flex" : "none";

    indicadores.innerHTML = imagenesProducto.map((_, i) =>
        `<button class="indicador ${i === indiceImagen ? "activo" : ""}" onclick="irAImagen(${i})" aria-label="Ver imagen ${i + 1}"></button>`
    ).join("");
}

function cambiarImagen(direccion) {
    if (imagenesProducto.length <= 1) return;
    indiceImagen += direccion;
    if (indiceImagen < 0) indiceImagen = imagenesProducto.length - 1;
    if (indiceImagen >= imagenesProducto.length) indiceImagen = 0;
    actualizarImagen();
}

function irAImagen(indice) {
    if (indice < 0 || indice >= imagenesProducto.length) return;
    indiceImagen = indice;
    actualizarImagen();
}

function interesarPrenda(codigo, nombre, categoria, talla, precio) {
    const mensaje =
        "Hola, V&R ReStyle.\n\n" +
        "Me interesa esta prenda:\n" +
        "Código: " + codigo + "\n" +
        "Prenda: " + nombre + "\n" +
        "Categoría: " + categoria + "\n" +
        "Talla: " + talla + "\n" +
        "Precio: " + precio + "\n\n" +
        "Quisiera consultar por la compra.";

    const enlace = "https://wa.me/" + NUMERO_WHATSAPP + "?text=" + encodeURIComponent(mensaje);
    window.open(enlace, "_blank");
}

function cerrarProducto() {
    document.getElementById("ventana-producto").classList.remove("mostrar");
}

function filtrarProductos(categoria, boton) {
    document.querySelectorAll(".filtro").forEach(btn => btn.classList.remove("activo"));
    boton.classList.add("activo");

    document.querySelectorAll(".producto").forEach(producto => {
        const categoriaProducto = producto.getAttribute("data-categoria");
        producto.style.display = (categoria === "todas" || categoriaProducto === categoria) ? "" : "none";
    });
}

document.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape") cerrarProducto();
});

document.getElementById("ventana-producto").addEventListener("click", function (evento) {
    if (evento.target === this) cerrarProducto();
});
