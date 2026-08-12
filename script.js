// =========================================================
// V&R RESTYLE — PRODUCTOS + FILTROS + GALERÍA + AUTOPLAY
// =========================================================

const NUMERO_WHATSAPP = "56975379705";

// =========================================================
// EDITA LAS PRENDAS SOLO AQUÍ
// =========================================================
const PRODUCTOS = [
    {
        codigo: "VR-001",
        nombre: "Polera básica",
        genero: "mujer",
        categoria: "polera",
        talla: "M",
        precio: "$5.000",
        descripcion: "Prenda en muy buen estado.",
        imagenes: [
            "imagenes/VR-001-1.jpg",
            "imagenes/VR-001-2.jpg",
            "imagenes/VR-001-3.jpg",
            "imagenes/VR-001-4.jpg"
        ]
    },
    {
        codigo: "VR-002",
        nombre: "Pantalón casual",
        genero: "hombre",
        categoria: "pantalon",
        talla: "40",
        precio: "$8.000",
        descripcion: "En excelente estado y listo para usar.",
        imagenes: []
    },
    {
        codigo: "VR-003",
        nombre: "Chaqueta casual",
        genero: "mujer",
        categoria: "chaqueta",
        talla: "L",
        precio: "$10.000",
        descripcion: "Prenda única en muy buen estado.",
        imagenes: []
    },
    {
        codigo: "VR-004",
        nombre: "Polera deportiva",
        genero: "nino",
        categoria: "polera",
        talla: "L",
        precio: "$4.000",
        descripcion: "Prenda en muy buen estado.",
        imagenes: []
    }
];

let imagenesProducto = [];
let indiceImagen = 0;
let categoriaActual = "todas";
let generoActual = "todas";

function escaparHTML(texto) {
    return String(texto ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function nombreCategoria(categoria) {
    const nombres = {
        polera: "POLERA",
        pantalon: "PANTALÓN",
        chaqueta: "CHAQUETA",
        accesorio: "ACCESORIO"
    };
    return nombres[categoria] || String(categoria).toUpperCase();
}

function imagenPrincipal(producto) {
    if (Array.isArray(producto.imagenes) && producto.imagenes.length > 0) {
        return `
            <img src="${escaparHTML(producto.imagenes[0])}"
                 alt="${escaparHTML(producto.nombre)}"
                 loading="lazy"
                 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
            <span class="imagen-fallback" style="display:none" aria-hidden="true">✦</span>
        `;
    }

    const iconos = {
        polera: "👕",
        pantalon: "👖",
        chaqueta: "🧥",
        accesorio: "👜"
    };

    return `<span aria-hidden="true">${iconos[producto.categoria] || "✦"}</span>`;
}

function renderizarProductos() {
    const contenedor = document.getElementById("productos");
    if (!contenedor) return;

    contenedor.innerHTML = "";

    PRODUCTOS.forEach((producto, indice) => {
        const tarjeta = document.createElement("article");
        tarjeta.className = "producto";
        tarjeta.dataset.categoria = producto.categoria;
        tarjeta.dataset.genero = producto.genero || "";
        tarjeta.setAttribute("role", "button");
        tarjeta.setAttribute("tabindex", "0");

        tarjeta.innerHTML = `
            <div class="imagen-producto">
                ${imagenPrincipal(producto)}
            </div>
            <div class="info-producto">
                <p class="categoria-producto">${escaparHTML(nombreCategoria(producto.categoria))}</p>
                <h3>${escaparHTML(producto.nombre)}</h3>
                <p class="descripcion-producto">${escaparHTML(producto.descripcion)}</p>
                <div class="datos-producto">
                    <span>Talla ${escaparHTML(producto.talla)}</span>
                    <strong>${escaparHTML(producto.precio)}</strong>
                </div>
                <button type="button" class="boton-producto">VER PRENDA</button>
            </div>
        `;

        tarjeta.addEventListener("click", () => abrirProductoPorIndice(indice));
        tarjeta.addEventListener("keydown", (evento) => {
            if (evento.key === "Enter" || evento.key === " ") {
                evento.preventDefault();
                abrirProductoPorIndice(indice);
            }
        });

        tarjeta.querySelector(".boton-producto").addEventListener("click", (evento) => {
            evento.stopPropagation();
            abrirProductoPorIndice(indice);
        });

        contenedor.appendChild(tarjeta);
    });

    aplicarFiltro();
}

function abrirProductoPorIndice(indice) {
    const producto = PRODUCTOS[indice];
    if (!producto) return;

    abrirProducto(
        producto.codigo,
        producto.nombre,
        nombreCategoria(producto.categoria),
        producto.talla,
        producto.precio,
        producto.descripcion,
        producto.imagenes
    );
}

function abrirProducto(codigo, nombre, categoria, talla, precio, descripcion, imagenes = []) {
    const ventana = document.getElementById("ventana-producto");
    if (!ventana) return;

    document.getElementById("producto-codigo").textContent = "CÓDIGO " + codigo;
    document.getElementById("producto-nombre").textContent = nombre;
    document.getElementById("producto-categoria").textContent = categoria.toUpperCase();
    document.getElementById("producto-talla").textContent = talla;
    document.getElementById("producto-precio").textContent = precio;
    document.getElementById("producto-descripcion").textContent = descripcion;

    imagenesProducto = Array.isArray(imagenes) ? imagenes : [];
    indiceImagen = 0;
    actualizarImagen();

    ventana.classList.add("mostrar");
    document.body.style.overflow = "hidden";

    const whatsapp = document.getElementById("boton-whatsapp");
    if (whatsapp) {
        whatsapp.onclick = () => interesarPrenda(codigo, nombre, categoria, talla, precio);
    }
}

function actualizarImagen() {
    const imagen = document.getElementById("producto-imagen-principal");
    const anterior = document.querySelector(".flecha-imagen.izquierda");
    const siguiente = document.querySelector(".flecha-imagen.derecha");
    const indicadores = document.getElementById("indicadores-imagenes");
    if (!imagen || !anterior || !siguiente || !indicadores) return;

    if (!imagenesProducto.length) {
        imagen.removeAttribute("src");
        imagen.alt = "Sin fotografía";
        anterior.style.display = "none";
        siguiente.style.display = "none";
        indicadores.innerHTML = "";
        return;
    }

    imagen.src = imagenesProducto[indiceImagen];
    const nombre = document.getElementById("producto-nombre")?.textContent || "la prenda";
    imagen.alt = "Fotografía de " + nombre;

    const varias = imagenesProducto.length > 1;
    anterior.style.display = varias ? "flex" : "none";
    siguiente.style.display = varias ? "flex" : "none";
    indicadores.innerHTML = "";

    if (varias) {
        imagenesProducto.forEach((_, i) => {
            const indicador = document.createElement("button");
            indicador.type = "button";
            indicador.className = "indicador" + (i === indiceImagen ? " activo" : "");
            indicador.setAttribute("aria-label", "Ver imagen " + (i + 1));
            indicador.addEventListener("click", (evento) => {
                evento.stopPropagation();
                irAImagen(i);
            });
            indicadores.appendChild(indicador);
        });
    }
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

    window.open(
        "https://wa.me/" + NUMERO_WHATSAPP + "?text=" + encodeURIComponent(mensaje),
        "_blank"
    );
}

function cerrarProducto() {
    const ventana = document.getElementById("ventana-producto");
    if (ventana) ventana.classList.remove("mostrar");
    document.body.style.overflow = "";
}

function filtrarGenero(genero, boton) {
    generoActual = genero;
    document.querySelectorAll(".genero-boton").forEach(btn => btn.classList.remove("activo"));
    if (boton) boton.classList.add("activo");

    categoriaActual = "todas";
    document.querySelectorAll(".filtro").forEach(btn => btn.classList.remove("activo"));
    const todas = document.querySelector('.filtro[data-categoria="todas"]');
    if (todas) todas.classList.add("activo");
    aplicarFiltro();
}

function filtrarProductos(categoria, boton) {
    categoriaActual = categoria;
    document.querySelectorAll(".filtro").forEach(btn => btn.classList.remove("activo"));
    if (boton) boton.classList.add("activo");
    aplicarFiltro();
}

function aplicarFiltro() {
    document.querySelectorAll(".producto").forEach(producto => {
        const coincideGenero = generoActual === "todas" || producto.dataset.genero === generoActual;
        const coincideCategoria = categoriaActual === "todas" || producto.dataset.categoria === categoriaActual;
        producto.style.display = coincideGenero && coincideCategoria ? "" : "none";
    });

    const titulo = document.getElementById("filtro-genero-titulo");
    if (titulo) {
        const nombresGenero = { todas:"TODAS LAS PRENDAS", mujer:"PRENDAS DE MUJER", hombre:"PRENDAS DE HOMBRE", nino:"PRENDAS DE NIÑO" };
        const nombresCategoria = { todas:"", polera:" · POLERAS", pantalon:" · PANTALONES", chaqueta:" · CHAQUETAS", accesorio:" · ACCESORIOS" };
        titulo.textContent = "MOSTRANDO " + nombresGenero[generoActual] + (nombresCategoria[categoriaActual] || "");
    }
}

// =========================================================
// AUTOPLAY ROBUSTO DEL VIDEO
// =========================================================
function iniciarVideoHero() {
    const video = document.querySelector(".hero-video");
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("autoplay", "");

    const reproducir = () => {
        const promesa = video.play();
        if (promesa && typeof promesa.catch === "function") {
            promesa.catch(() => {
                // Algunos navegadores móviles bloquean el primer intento.
                // Volvemos a intentarlo cuando el video tenga datos o cuando
                // el usuario interactúe con la página.
            });
        }
    };

    if (video.readyState >= 2) reproducir();
    video.addEventListener("loadeddata", reproducir, { once: true });
    video.addEventListener("canplay", reproducir, { once: true });
    document.addEventListener("visibilitychange", () => {
        if (!document.hidden && video.paused) reproducir();
    });

    ["touchstart", "pointerdown", "click"].forEach(evento => {
        document.addEventListener(evento, () => {
            if (video.paused) reproducir();
        }, { once: true, passive: true });
    });
}

function iniciarVRestyle() {
    renderizarProductos();
    iniciarVideoHero();

    document.addEventListener("keydown", evento => {
        if (evento.key === "Escape") cerrarProducto();
        if (evento.key === "ArrowRight" && document.getElementById("ventana-producto")?.classList.contains("mostrar")) cambiarImagen(1);
        if (evento.key === "ArrowLeft" && document.getElementById("ventana-producto")?.classList.contains("mostrar")) cambiarImagen(-1);
    });

    const ventana = document.getElementById("ventana-producto");
    if (ventana) {
        ventana.addEventListener("click", evento => {
            if (evento.target === ventana) cerrarProducto();
        });
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciarVRestyle);
} else {
    iniciarVRestyle();
}
