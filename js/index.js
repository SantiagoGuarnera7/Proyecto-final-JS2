class Producto {
    constructor(id, nombre, precio, foto) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.foto = foto;
    }
}

class ElementoCarrito {
    constructor(producto, cantidad) {
        this.producto = producto;
        this.cantidad = cantidad;
    }
}
// Definiciones de constantes

const estandarDolaresAmericanos = Intl.NumberFormat('en-US');

//Arrays donde guardaremos catálogo de productos y elementos en carrito
const productos = [];
const elementosCarrito = [];

const contenedorProductos = document.getElementById('contenedor-productos');
const contenedorCarritoCompras = document.querySelector("#items");
const contenedorFooterCarrito = document.querySelector("#footer");
const botonTerminar = document.getElementById('terminarCompra');

// Ejecución de funciones

cargarProductos();
cargarCarrito();


// Definiciones de funciones
async function cargarProductos() {
    await fetch("./data.json")
        .then(response => response.json())
        .then(data => {
            data.forEach(producto => {
                productos.push(new Producto(producto.id, producto.nombre, producto.precio, producto.imagen));
                console.log(producto);
            });
        })
        .catch(error => {
            dibujarCatalogoProductos.innerHTML = "<P> No funciona La pagina</p><p>" + error + "<p/>";
        })
    console.log(productos);
    dibujarCatalogoProductos();
}

function cargarCarrito() {

}

function dibujarCarrito() {
    contenedorCarritoCompras.innerHTML = "";



    elementosCarrito.forEach(
        (elemento) => {
            let renglonesCarrito = document.createElement("tr");

            renglonesCarrito.innerHTML = `
                <td>${elemento.producto.id}</td>
                <td>${elemento.producto.nombre}</td>
                <td><input id="cantidad-producto-${elemento.producto.id}" type="number" value="${elemento.cantidad}" min="1" max="1000" step="1" style="width: 50px;"/></td>
                <td>$ ${elemento.producto.precio}</td>
                <td>$ ${estandarDolaresAmericanos.format(elemento.producto.precio * elemento.cantidad)}</td>
                <td><button id="eliminar-producto-${elemento.producto.id}" type="button" class="btn btn-danger"><i class="bi bi-trash-fill"></i></button></td>
                
            `;


            contenedorCarritoCompras.append(renglonesCarrito);


            //Agregar evento a input de renglon en carrito
            let inputCantidadProducto = document.getElementById(`cantidad-producto-${elemento.producto.id}`);
            inputCantidadProducto.addEventListener('change', (ev) => {
                let nuevaCantidad = ev.target.value;
                elemento.cantidad = nuevaCantidad;
                dibujarCarrito();
            });


            //agregar evento a eliminar producto
            let botonEliminarProducto = document.getElementById(`eliminar-producto-${elemento.producto.id}`);
            botonEliminarProducto.addEventListener('click', () => {


                let indiceEliminar = elementosCarrito.indexOf(elemento);
                elementosCarrito.splice(indiceEliminar, 1);

                localStorage.setItem('productos', JSON.stringify(elementosCarrito));
                dibujarCarrito();
            });
        }
    );


    //APLICANDO OPERADOR TERNARIO
    const valorInicial = 0;
    const totalComprar = elementosCarrito.reduce(
        (previusValue, currentValue) => previusValue + currentValue.producto.precio * currentValue.cantidad, valorInicial
    );

    elementosCarrito.length === 0 ?
        contenedorFooterCarrito.innerHTML = `<th scope="row" colspan="6">Carrito vacio - comience a comprar!</th>` : contenedorFooterCarrito.innerHTML = `<th scope="row" colspan="6">Total de la compra: ${totalComprar}</th>`;


}

function removerProductoCarrito(elementoAEliminar) {


    let carrito = JSON.parse(localStorage.getItem('productos'));
    const elementosAMantener = carrito.filter((elemento) => elementoAEliminar.producto.id != elemento.producto.id);
    carrito.length = 0;

    elementosAMantener.forEach((elemento) => carrito.push(elemento));

    localStorage.setItem('productos', JSON.stringify(carrito));
}


function crearCard(producto) {
    //Botón
    let botonAgregar = document.createElement("button");
    botonAgregar.className = "btn btn-warning";
    botonAgregar.innerText = "Comprar";

    //Card body
    let cuerpoCarta = document.createElement("div");
    cuerpoCarta.className = "card-body";
    cuerpoCarta.innerHTML = `
        <h5>${producto.nombre}</h5>
        <p>$ ${producto.precio} ARS</p>
    `;
    cuerpoCarta.append(botonAgregar);

    //Imagen
    let imagen = document.createElement("img");
    imagen.src = producto.foto;
    imagen.className = "card-img-top";
    imagen.alt = producto.nombre;

    //Card
    let carta = document.createElement("div");
    carta.className = "card m-2 p-2";
    carta.style = "width: 18rem";
    carta.append(imagen);
    carta.append(cuerpoCarta);



    //Agregar algunos eventos
    botonAgregar.onclick = () => {
        let elementoExistente = elementosCarrito.find((elem) => elem.producto.id == producto.id);


        if (elementoExistente) {
            elementoExistente.cantidad += 1;

            this.guardarLocalStorage(elementoExistente);
        } else {
            let elementoCarrito = new ElementoCarrito(producto, 1);
            elementosCarrito.push(elementoCarrito);

            this.guardarLocalStorage(elementoCarrito);
        }
        dibujarCarrito();

        //Sweet alert para mostrar alertas cuando agregas productos al carrito si cerramos el alert nos va a salir un cartel diciendo no queremos ir al carrito

        swal({

            title: 'Articulo agregado al Carrito',
            text: `${producto.nombre} $ ${producto.precio}`,
            icon: 'success',
            buttons: {
                cerrar: {
                    text: "Cerrar",
                    value: false
                },
                carrito: {
                    text: "Ir al carrito",
                    value: true
                }
            }
        }).then((decision) => {
            if (decision) {
                const myModal = new bootstrap.Modal(document.getElementById('exampleModal'), { keyboard: true });
                const modalToggle = document.getElementById('toggleMyMosal');
                myModal.show(modalToggle);
            } else {
                swal({
                    title: "No quiero ir al carrito",
                    icon: 'error',
                    timer: 1500,
                });
            }
        });

    }

    return carta;

}


//Boton terminar compra notificacion

botonTerminar.addEventListener('click', () => {
    if (elementosCarrito.length === 0) {
        swal({
            title: "¡Algo anda mal!",
            text: "¡el carrito esta vacio!",
            icon: "error",
            color: "black",
        })
    } else {
        swal({
            title: "¡Genial!",
            text: "¡La compra se realizó con éxito!",
            icon: "success",
            
        })
    }
});



function dibujarCatalogoProductos() {
    contenedorProductos.innerHTML = "";

    productos.forEach(
        (producto) => {
            let contenedorCarta = crearCard(producto);
            contenedorProductos.append(contenedorCarta);
        }
    );


}


function guardarLocalStorage(elemento) {
    let articulos;
    articulos = this.obtenerLocalStorage(elemento);

    let verificarExistencia = false;
    articulos.map(item => {
        if (elemento.producto.id === item.producto.id) {
            item.cantidad = item.cantidad + 1;
            verificarExistencia = true;
        }
    })

    if (!verificarExistencia) {
        articulos.push(elemento);
    }

    localStorage.setItem('productos', JSON.stringify(articulos));
}

function obtenerLocalStorage() {
    let articuloLS;

    if (localStorage.getItem('productos') === null) {
        articuloLS = [];
    } else {
        articuloLS = JSON.parse(localStorage.getItem('productos'));
    }
    return articuloLS;
};