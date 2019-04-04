const black = document.getElementById('black');
var modal = document.createElement('article');
const template = document.querySelector("template").content;
const main = document.querySelector('main');
const desert = document.querySelector('#desert')
let APIC = "http://kea-alt-del.dk/t5/api/categories"
let APIP = "http://kea-alt-del.dk/t5/api/productlist"
let APIP2 = "http://kea-alt-del.dk/t5/api/product?id=";
let i = 0;
const select = document.getElementById('filter');
let discountPriceP

fetch(APIC).then(e => e.json()).then(data => createCatSections(data))

function createCatSections(categories) {
    categories.forEach(cat => {
        const newSection = document.createElement("section");
        const newHeader = document.createElement('h1');
        newSection.id = cat;
        newHeader.textContent = cat;
        main.appendChild(newHeader);
        main.appendChild(newSection);
    })
    fetch(APIP).then(e => e.json()).then(data => data.forEach(showData));
}

function showData(product) {
    const section = document.querySelector("#" + product.category)
    let clone = template.cloneNode(true);
    let price = clone.querySelector('#price');
    let discountPrice = clone.querySelector("#discountPrice")
    let description = clone.querySelector("#description")
    price.innerHTML = product.price + ", -kr";
    description.innerHTML = product.shortdescription
    clone.querySelector('#name').innerHTML = product.name;
    clone.querySelector('#img').style.backgroundImage = "url(https://kea-alt-del.dk/t5/site/imgs/medium/" + product.image + "-md.jpg)"
    if (!product.discount == 0) {
        price.style.textDecoration = 'line-through';
        let p = Number(product.price);
        let d = Number(product.discount)
        let discountPriceP = document.querySelectorAll(".discountPriceP")
        let afterDiscount = p - (p * d / 100);
        discountPrice.innerHTML = afterDiscount + ", -kr"
    }
    clone.querySelector("#variable").innerHTML = product.id
    section.appendChild(clone)

    document.body.addEventListener("click", event => {
        if (event.target.nodeName == "BUTTON") {
            modal.innerHTML = event.target.parentElement.innerHTML;
            modal.setAttribute('id', 'modal');
            modal.querySelector('button').style.display = 'none';
            modal.style.height = 'auto';
            fetch(APIP2 + event.target.parentElement.querySelector("#variable").innerHTML).then(e => e.json()).then(data => continueModal(data));
            i = 0

            function continueModal(product) {
                if (i == 0) {
                    i++
                    console.log(product)
                    const stock = document.createElement('p');
                    if (product.soldout == true) {
                        stock.innerHTML = 'Stock Status:' + 'Out Of Stock'
                    }
                    if (product.soldout == false) {
                        stock.innerHTML = 'Stock Status: ' + 'In Stock'
                    }
                    const vegetarian = document.createElement('p');
                    if (product.vegetarian == true) {
                        vegetarian.innerHTML = "Vegetarian"
                    }
                    if (product.vegetarian == false) {
                        vegetarian.innerHTML = "Non-Vegetarian"
                    }
                    const allergens = document.createElement('p');
                    if (!product.allergens.length == 0) {
                        allergens.innerHTML = 'Contains ' + product.allergens
                    }
                    const longDescription = product.longdescription
                    if (!product.longdescription.length == 0) {
                        modal.querySelector('p').innerHTML = longDescription
                    }
                    modal.appendChild(vegetarian)
                    modal.appendChild(allergens)
                    modal.appendChild(stock)
                    modal.style.display = 'block';
                    black.style.display = "block";
                    document.querySelector('body').appendChild(modal)
                }
            }
            black.addEventListener("click", hideA => {
                if (black.style.display == "block") {
                    black.style.display = 'none';
                    modal.style.display = 'none';
                    description.innerHTML = product.shortdescription
                }
            })
        }
    });
};
