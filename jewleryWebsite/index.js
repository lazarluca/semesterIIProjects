const link = "https://spreadsheets.google.com/feeds/list/1SkUUjwddA84T8Knlbcb-bgJZDphMh106C5DVuzjNHnQ/od6/public/values?alt=json";
const template = document.querySelector("template").content;


let header;
let search;
let content;
let category = "search";
let oldCategory;
let oldCatCNT = 0;
let searchCNT = 0;
let searchCatCNT = 0;
let oldImageCNT = 0;
let positionCNT = 0;
let basketCNT= -1;
let basketCNTBUG = 0;
let basketAppendCNT = -1;
let productsCNT = 0;
let categoryBUGCNT = 0;
let basket = [];
let restoreCatCNT;
let searchHCNT;
let products;
let oldImage;
let noText;
let noItem;

document.querySelector("#cataLog").addEventListener("click", initialLoad);


function loadJSON(link) {
    fetch(link).then(e=>e.json()).then(data => data.feed.entry.forEach(main))
}
function main(data) {
    if (category === data.gsx$category.$t) {
        oldCatCNT = 0;
        searchCatCNT = 0;
        mainHelper(data);
    }
    if (category === "search") {
        mainHelper(data);
    }
    if (category === "searchCat") {
        if (oldCategory !== data.gsx$category.$t) {
            mainHelper(data)
        }
    }
}
function mainHelper(data) {
    if(document.querySelector("#categories")){
    document.querySelector("#categories").innerHTML = "";
    } if(document.querySelector("#contact")) {
        document.querySelector("#contact").display = "none";
        document.querySelector("#shoppingCartList").innerHTML ="";
    }
    if(noText){
        noText.innerText ="";
    }
    let clone = template.cloneNode(true);
    cloneF(data, clone);
    document.querySelector("#container").appendChild(clone);
    document.body.addEventListener("mouseover", event => {
        if (event.target.className === "image") {
            eventF(event);
        }
    });
    document.body.addEventListener("click", event => {
        if (event.target.nodeName === "BUTTON") {
            if(basketCNTBUG === 0) {
          let targetB = event.target.parentNode.parentNode;
          basketF(targetB);
          basketCNTBUG++;
          }
        }
    })
}
function cloneF(data, clone) {
    positionCNT++;
    if(isOdd(positionCNT)){clone.querySelector("article").classList.add("up")}
    if(!isOdd(positionCNT)){clone.querySelector("article").classList.add("down")}
    clone.querySelector("#blur").style.backgroundImage = "url(" +"images/"+ data.gsx$image.$t + ".jpg" + ")";
    clone.querySelector("#searchEngine").innerHTML = data.gsx$searchengine.$t;
    clone.querySelector("#name").innerHTML = data.gsx$name.$t;
    clone.querySelector("#price").innerHTML = data.gsx$price.$t + " DKK";
    clone.querySelector("#description").innerHTML = data.gsx$description.$t;
    clone.querySelector("#color").innerHTML = "Color:" + data.gsx$colors.$t;
    clone.querySelector("#materials").innerHTML = "Materials:" + data.gsx$materials.$t;
    clone.querySelector("#image").style.backgroundImage = "url(" +"images/"+ data.gsx$image.$t + ".jpg" + ")";
}
function searchF() {
    if(category === "search") {
        if (search.value === "") {
            startLoad("main.html", content);
        } else {
            category = "search";
            if (searchCNT === 0) {
                loadJSON(link);
                searchCNT++;

            }
            setTimeout(searchHelper,700);
        }
    }
    else {
        if (search.value === "") {
            searchCatCNT = 0;
            category = oldCategory;
            if(restoreCatCNT === 0){
            document.querySelector("#container").innerHTML = "";
            loadJSON(link);
            restoreCatCNT++;
            }
        } else {
            restoreCatCNT = 0;
            if(oldCatCNT === 0) {
                oldCategory = category;
                oldCatCNT++
            }
            category = "searchCat";
            if (searchCatCNT === 0) {
                loadJSON(link);
                searchCatCNT++;
            }
            setTimeout(searchHelper,700);
        }
    }
}
function searchHelper() {
    productsCNT = 0;
    const filter = search.value.toUpperCase();
    products = document.querySelectorAll("article");
    for (searchHCNT = 0; searchHCNT < products.length; searchHCNT++) {
        const textValue = document.querySelectorAll("#searchEngine")[searchHCNT].innerHTML;
        if (textValue.toUpperCase().indexOf(filter) > -1) {
            if(content.querySelector("#noItem")) {noItem.remove()}
            products[searchHCNT].style.display = "";
            positionCNT++;
            if (isOdd(positionCNT)) {
                products[searchHCNT].setAttribute("class", "up");
            }
            if (!isOdd(positionCNT)) {
                products[searchHCNT].setAttribute("class", "down");
            }
        } else {
            products[searchHCNT].style.height = "none";
            productsCNT++;
            if(productsCNT === products.length) {
                if(!content.querySelector("#noItem")) {
                noItem = document.createElement("p");
                noItem.id = "noItem";
                noItem.innerText = "Sadly we do not have any items named like this or having the specifications you're looking for.";
                content.appendChild(noItem);
            } }
        }
    }
}
function eventF(event) {
    let target = event.target;
    target.querySelector("#blur").style.display = "block";
    target.querySelector("#description").style.display = "block";
    target.querySelector("#color").style.display = "block";
    target.querySelector("#materials").style.display = "block";
    if(target.parentElement.querySelector("button")){target.parentElement.querySelector("button").style.display = "block";}
    if(oldImageCNT === 0) {oldImage = target.style.backgroundImage;oldImageCNT++}
    target.style.backgroundImage = "";
    target.addEventListener("mouseleave", () => {eventFU(target)});
}
function eventFU(target) {
    target.querySelector("#description").style.display = "none";
    target.querySelector("#blur").style.display = "none";
    target.querySelector("#color").style.display = "none";
    target.querySelector("#materials").style.display = "none";
    if(target.parentElement.querySelector("button")){target.parentElement.querySelector("button").style.display = "none";}
    target.style.backgroundImage = oldImage;
    target.style.marginTop = "";
    target.style.marginBottom = "";
    oldImageCNT = 0
}
function isOdd(num) {
    return num % 2;}
function loadHtmlToElement(file, targetElement) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', file, true);
    xhr.onreadystatechange = function () {
        if (this.readyState !== 4) return;
        if (this.status !== 200) return;
        targetElement.innerHTML = this.responseText;
    };
    xhr.send();
    loadHelper();
}
function loadHelper() {
    setTimeout(() => {if(content === document.querySelector("#content")) {content.style.animation = "appear 0.5s linear forwards";}else {content = document.querySelector("#content")}},200);
    categoryBUGCNT = 0;
    oldCatCNT = 0;
    searchCNT = 0;
    searchCatCNT = 0;
    oldImageCNT = 0;
    positionCNT = 0;
    basketAppendCNT = -1;
    if(search){
        search.addEventListener("keyup", searchF);
    }
}
function startLoad(a, b) {
   content.style.animation = "fade 1s linear forwards";
    setTimeout(() => {loadHtmlToElement(a, b)}, 1100)
}
function basketF(targetB) {
    setTimeout(()=>{basketCNTBUG = 0;}, 200);
    basketCNT++;
    basket[basketCNT] = targetB;
}
function initialLoad() {
    document.getElementsByTagName("MAIN")[0].style.animation = "fade 1s linear forwards";
    setTimeout(() => {
        loadHtmlToElement("catalogue.html", document.body);
        document.getElementsByTagName("HTML")[0].style.animation = "appear 1s linear forwards";
        setTimeout(() => {
            content = document.querySelector("#content");
            search = document.getElementById("search");
            header = document.querySelector("header");
            search.addEventListener("keyup", () => {
                if (document.querySelector("#categories")) {
                    document.querySelector("#categories").style.animation = "fade 1s linear forwards";
                }
                setTimeout(searchF, 400);
            });
            document.getElementById("home").addEventListener("click", () => {
                startLoad("main.html", content);
                search.value = ""
            });
            document.getElementById("shoppingCart").addEventListener("click", () => {
                basketAppendCNT = -1;
                search.value = "";
                searchCNT = 0;
                category = "search";
                if (basket.length === 0) {
                    content.style.animation = "fade 1s linear forwards";
                    setTimeout(() => {
                        content.style.animation = "appear 0.5s linear forwards";
                        content.innerHTML = "";
                        noText = document.createElement("p");
                        noText.id = "noText";
                        noText.innerText = "You have no items in your shopping bag, try searching an item!";
                        content.appendChild(noText);
                        let newContainer = document.createElement("section");
                        newContainer.id = "container";
                        content.appendChild(newContainer);
                    }, 1000);

                } else {
                    startLoad("shoppingCart.html", content);
                    setTimeout(() => {
                        basket.forEach(() => {
                            basketAppendCNT++;
                            let currentItem = basket[basketAppendCNT];
                            console.log(basketAppendCNT);
                            currentItem.style.display = "block";
                            currentItem.style.marginTop = "5vh";
                            if (currentItem.querySelector("#addToWishlist")) {
                                currentItem.querySelector("#addToWishlist").remove()
                            }
                            document.getElementById("shoppingCartList").appendChild(currentItem)
                        })
                    }, 1500)
                }
            });
            setTimeout(() => {
                document.getElementsByTagName("HTML")[0].style.animation = "appear 1s linear forwards"
            }, 300)
        }, 500)
    }, 800);
    document.body.addEventListener("click", event => {
        if (categoryBUGCNT === 0) {
            if (event.target.className === "categories") {
                category = event.target.id;
                loadJSON(link);
                categoryBUGCNT++;
                search.value = "";
                document.querySelector("#categories").style.animation = "fade 1s linear forwards"
            }
        }

    });
    window.addEventListener("scroll", () => {
        if (window.innerWidth > 1025) {
            header.querySelector("#filterI").style.opacity = "1";
            if (window.scrollY === 0) {
                header.querySelector("#filterI").style.opacity = "0.54";
            }
        }
    });
    window.addEventListener("beforeunload", function(event) {
        event.returnValue = "You will lose your basket!";
    });
}





