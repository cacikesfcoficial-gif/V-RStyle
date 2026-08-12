const PRODUCTOS = Array.isArray(window.PRODUCTOS) ? window.PRODUCTOS : [];

// WhatsApp de V&R ReStyle
const NUMERO_WHATSAPP = "56975379705";

let imagenesProducto = [];
let indiceImagen = 0;
let categoriaActual = "todas";
let generoActual = "todas";
let nivelZoom = 1;

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
            <img
                src="${escaparHTML(producto.imagenes[0])}"
                alt="${escaparHTML(producto.nombre)}"
                loading="lazy"
                onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
            >
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

    if (!contenedor) {
        console.error("V&R ReStyle: no existe #productos en index.html");
        return;
    }

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

                <button type="button" class="boton-producto">
                    VER PRENDA
                </button>
            </div>
        `;

        tarjeta.addEventListener("click", function () {
            abrirProductoPorIndice(indice);
        });

        tarjeta.addEventListener("keydown", function (evento) {
            if (evento.key === "Enter" || evento.key === " ") {
                evento.preventDefault();
                abrirProductoPorIndice(indice);
            }
        });

        const boton = tarjeta.querySelector(".boton-producto");
        boton.addEventListener("click", function (evento) {
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
    const elementos = {
        codigo: document.getElementById("producto-codigo"),
        nombre: document.getElementById("producto-nombre"),
        categoria: document.getElementById("producto-categoria"),
        talla: document.getElementById("producto-talla"),
        precio: document.getElementById("producto-precio"),
        descripcion: document.getElementById("producto-descripcion"),
        ventana: document.getElementById("ventana-producto"),
        whatsapp: document.getElementById("boton-whatsapp")
    };

    if (!elementos.ventana) return;

    elementos.codigo.textContent = "CÓDIGO " + codigo;
    elementos.nombre.textContent = nombre;
    elementos.categoria.textContent = categoria.toUpperCase();
    elementos.talla.textContent = talla;
    elementos.precio.textContent = precio;
    elementos.descripcion.textContent = descripcion;

    imagenesProducto = Array.isArray(imagenes) ? imagenes : [];
    indiceImagen = 0;

    actualizarImagen();

    elementos.ventana.classList.add("mostrar");

    if (elementos.whatsapp) {
        elementos.whatsapp.onclick = function () {
            interesarPrenda(codigo, nombre, categoria, talla, precio);
        };
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
    imagen.alt = "Fotografía de " + (document.getElementById("producto-nombre")?.textContent || "la prenda");

    prepararZoomImagen();

    const varias = imagenesProducto.length > 1;
    anterior.style.display = varias ? "flex" : "none";
    siguiente.style.display = varias ? "flex" : "none";

    indicadores.innerHTML = "";

    if (varias) {
        imagenesProducto.forEach(function (_, i) {
            const indicador = document.createElement("button");
            indicador.type = "button";
            indicador.className = "indicador" + (i === indiceImagen ? " activo" : "");
            indicador.setAttribute("aria-label", "Ver imagen " + (i + 1));

            indicador.addEventListener("click", function (evento) {
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

    if (indiceImagen < 0) {
        indiceImagen = imagenesProducto.length - 1;
    }

    if (indiceImagen >= imagenesProducto.length) {
        indiceImagen = 0;
    }

    actualizarImagen();
}

function irAImagen(indice) {
    if (indice < 0 || indice >= imagenesProducto.length) return;

    indiceImagen = indice;
    actualizarImagen();
}


function prepararZoomImagen() {
    const imagen = document.getElementById("producto-imagen-principal");
    const contenedor = document.querySelector(".producto-imagen");

    if (!imagen || !contenedor) return;

    nivelZoom = 1;
    imagen.classList.remove("zoom-activo");
    imagen.style.transformOrigin = "center center";
    imagen.style.transform = "scale(1)";

    if (contenedor.dataset.zoomPreparado === "true") return;
    contenedor.dataset.zoomPreparado = "true";

    let distanciaInicial = 0;
    let zoomInicial = 1;
    let ultimoToque = 0;

    function aplicarZoomXY(x, y) {
        const rect = contenedor.getBoundingClientRect();
        const px = Math.max(0, Math.min(100, ((x - rect.left) / rect.width) * 100));
        const py = Math.max(0, Math.min(100, ((y - rect.top) / rect.height) * 100));

        imagen.classList.add("zoom-activo");
        imagen.style.transformOrigin = px + "% " + py + "%";
        imagen.style.transform = "scale(" + nivelZoom + ")";
    }

    function aplicarZoomMouse(evento) {
        if (window.matchMedia("(max-width: 900px)").matches) return;
        if (!imagen.src) return;

        aplicarZoomXY(evento.clientX, evento.clientY);
    }

    contenedor.addEventListener("mousemove", function (evento) {
        aplicarZoomMouse(evento);
    });

    contenedor.addEventListener("wheel", function (evento) {
        if (window.matchMedia("(max-width: 900px)").matches) return;

        evento.preventDefault();

        if (evento.deltaY < 0) {
            nivelZoom = Math.min(5, nivelZoom + 0.5);
        } else {
            nivelZoom = Math.max(1, nivelZoom - 0.5);
        }

        aplicarZoomMouse(evento);
    }, { passive: false });

    // CELULAR: zoom con dos dedos (pinch-to-zoom)
    contenedor.addEventListener("touchstart", function (evento) {
        if (window.matchMedia("(min-width: 901px)").matches) return;

        if (evento.touches.length === 2) {
            evento.preventDefault();

            const dx = evento.touches[0].clientX - evento.touches[1].clientX;
            const dy = evento.touches[0].clientY - evento.touches[1].clientY;

            distanciaInicial = Math.hypot(dx, dy);
            zoomInicial = nivelZoom;
        } else if (evento.touches.length === 1) {
            const ahora = Date.now();

            if (ahora - ultimoToque < 300) {
                evento.preventDefault();

                nivelZoom = nivelZoom > 1 ? 1 : 2.5;

                aplicarZoomXY(
                    evento.touches[0].clientX,
                    evento.touches[0].clientY
                );
            }

            ultimoToque = ahora;
        }
    }, { passive: false });

    contenedor.addEventListener("touchmove", function (evento) {
        if (window.matchMedia("(min-width: 901px)").matches) return;

        if (evento.touches.length === 2 && distanciaInicial > 0) {
            evento.preventDefault();

            const dx = evento.touches[0].clientX - evento.touches[1].clientX;
            const dy = evento.touches[0].clientY - evento.touches[1].clientY;
            const distanciaActual = Math.hypot(dx, dy);

            nivelZoom = Math.max(
                1,
                Math.min(4, zoomInicial * (distanciaActual / distanciaInicial))
            );

            const centroX = (evento.touches[0].clientX + evento.touches[1].clientX) / 2;
            const centroY = (evento.touches[0].clientY + evento.touches[1].clientY) / 2;

            aplicarZoomXY(centroX, centroY);
        }
    }, { passive: false });

    contenedor.addEventListener("touchend", function (evento) {
        if (evento.touches.length < 2) {
            distanciaInicial = 0;
        }
    }, { passive: false });

    contenedor.addEventListener("mouseleave", function () {
        if (window.matchMedia("(min-width: 901px)").matches) {
            nivelZoom = 1;
            imagen.classList.remove("zoom-activo");
            imagen.style.transformOrigin = "center center";
            imagen.style.transform = "scale(1)";
        }
    });
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

    const enlace =
        "https://wa.me/" +
        NUMERO_WHATSAPP +
        "?text=" +
        encodeURIComponent(mensaje);

    window.open(enlace, "_blank", "noopener,noreferrer");
}

function cerrarProducto() {
    const ventana = document.getElementById("ventana-producto");
    if (ventana) {
        ventana.classList.remove("mostrar");
    }
}

function filtrarGenero(genero, boton) {
    generoActual = genero;

    document.querySelectorAll(".genero-card").forEach(function (btn) {
        btn.classList.remove("activo");
    });

    if (boton) {
        boton.classList.add("activo");
    }

    aplicarFiltro();
}

function filtrarProductos(categoria, boton) {
    categoriaActual = categoria;

    document.querySelectorAll(".filtro").forEach(function (btn) {
        btn.classList.remove("activo");
    });

    if (boton) {
        boton.classList.add("activo");
    }

    aplicarFiltro();
}

function aplicarFiltro() {
    document.querySelectorAll(".producto").forEach(function (producto) {
        const categoriaProducto = producto.dataset.categoria || "";
        const generoProducto = producto.dataset.genero || "";

        const coincideGenero =
            generoActual === "todas" ||
            generoProducto === generoActual ||
            generoProducto === "todos";

        const coincideCategoria =
            categoriaActual === "todas" ||
            categoriaProducto === categoriaActual;

        producto.style.display =
            coincideGenero && coincideCategoria ? "" : "none";
    });

    const textoGenero = {
        todas: "TODAS LAS PRENDAS",
        mujer: "MUJER",
        hombre: "HOMBRE",
        nino: "NIÑO"
    };

    const textoCategoria = {
        todas: "",
        polera: " · POLERAS",
        pantalon: " · PANTALONES",
        chaqueta: " · CHAQUETAS",
        accesorio: " · ACCESORIOS"
    };

    const indicador = document.getElementById("filtro-seleccionado");
    if (indicador) {
        indicador.textContent =
            "MOSTRANDO " +
            (textoGenero[generoActual] || "TODAS LAS PRENDAS") +
            (textoCategoria[categoriaActual] || "");
    }
}

function iniciarVRestyle() {
    renderizarProductos();

    document.addEventListener("keydown", function (evento) {
        if (evento.key === "Escape") {
            cerrarProducto();
        }

        if (
            evento.key === "ArrowRight" &&
            document.getElementById("ventana-producto")?.classList.contains("mostrar")
        ) {
            cambiarImagen(1);
        }

        if (
            evento.key === "ArrowLeft" &&
            document.getElementById("ventana-producto")?.classList.contains("mostrar")
        ) {
            cambiarImagen(-1);
        }
    });

    const ventana = document.getElementById("ventana-producto");

    if (ventana) {
        ventana.addEventListener("click", function (evento) {
            if (evento.target === ventana) {
                cerrarProducto();
            }
        });
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciarVRestyle);
} else {
    iniciarVRestyle();
}
