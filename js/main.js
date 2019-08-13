

//GLOBAL
var products = [];
var cartItems = [];
var cart_n = document.getElementById("cart_n");
//DIVS
var menDiv = document.getElementById("menDiv");
var womenDiv = document.getElementById("womenDiv");
//INFORMATION
var MEN = [
    { name: 'Long Sleeve', price: 400 },
    { name: 'Jacket', price: 350 },
    { name: 'Korean Sleeve', price: 450 },
    { name: 'Jeans Sleeve', price: 500 },
    { name: 'Jogging Outfit', price: 550 },
    { name: 'Sweeter', price: 300 },
    { name: 'Nike Short', price: 150 }
];

var WOMEN = [
    { name: 'women #1', price: 200 },
    { name: 'women #2', price: 250 },
    { name: 'women #3', price: 200 },
    { name: 'women #4', price: 350 },
    { name: 'women #5', price: 300 },
    { name: 'women #6', price: 900 },
    { name: 'women #7', price: 600 }
];

//HTML
function HTMLmenProduct(con) {
    let URL = `images/men/men${con}.jpg`;
    let btn = `btnMEN${con}`;
    return `
            <div class="col-md-3">
                <div class="card mb-3 shadow-sm">
                <div class="cardImg">
                <img class="card-img-top" style="height:19rem;" src="${URL}" alt="Card Image">
                </div>
                <div class="card-body">
                    <i style="color:orange;" class="fa fa-star"></i>
                    <i style="color:orange;" class="fa fa-star"></i>
                    <i style="color:orange;" class="fa fa-star"></i>
                    <i style="color:orange;" class="fa fa-star"></i>
                    <i style="color:gray;" class="fa fa-star"></i>
                    <p class="card-text">${MEN[con - 1].name}</p>
                    <p class="card-text">Price: <span><b>${MEN[con - 1].price}.00 PHP</b></span></p>
                    <div class="d-flex justify-content-between align-items-center">
                    <div class="btn-group">
                    <button type="button" onclick="cart2('${MEN[con - 1].name}','${MEN[con - 1].price}','${URL}','${con}','${btn}')" class="btn btn-sm btn-outline-secondary">
                    <a style="color:inherit;" >Buy</a>
                    </button>
                    <button id="${btn}" type="button" onclick="cart('${MEN[con - 1].name}','${MEN[con - 1].price}','${URL}','${con}','${btn}')" class="btn btn-sm btn-outline-secondary">Add to cart</button>
                    </div>
                    <small class="text-muted">Free Shipping</small>
                    </div>
                </div>
                </div>
            </div>
    `
}
function HTMLwomenProduct(con) {
    let URL = `images/women/women${con}.jpg`;
    let btn = `btnWOMEN${con}`;
    return `
            <div class="col-md-4">
                <div class="card mb-4 shadow-sm">
                <div class="cardImg">
                <img class="card-img-top" style="height:19rem; width:400; position:center;" src="${URL}" alt="Card Image">
                </div>
                <div class="card-body">
                    <i style="color:orange;" class="fa fa-star"></i>
                    <i style="color:orange;" class="fa fa-star"></i>
                    <i style="color:orange;" class="fa fa-star"></i>
                    <i style="color:orange;" class="fa fa-star"></i>
                    <i style="color:gray;" class="fa fa-star"></i>
                    <p class="card-text">${WOMEN[con - 1].name}</p>
                    <p class="card-text">Price: <span><b>${WOMEN[con - 1].price}.00 PHP</b></span></p>
                    <div class="d-flex justify-content-between align-items-center">
                    <div class="btn-group">
                    <button type="button" onclick="cart2('${WOMEN[con - 1].name}','${WOMEN[con - 1].price}','${URL}','${con}','${btn}')" class="btn btn-sm btn-outline-secondary">
                    <a style="color:inherit;">Buy</a>
                    </button>
                    <button id="${btn}" type="button" onclick="cart('${WOMEN[con - 1].name}','${WOMEN[con - 1].price}','${URL}','${con}','${btn}')" class="btn btn-sm btn-outline-secondary">Add to cart</button>
                    </div>
                    <small class="text-muted">Free Shipping</small>
                    </div>
                </div>
                </div>
            </div>
            </div>
    `
}
//ANIMATION
function animation() {
    const toast = swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1000
    });
    toast.fire({
        type: 'success',
        title: 'Added to shopping cart'
    })
}

var authorize = document.getElementById('authorize');
//CART FUNCTION
function cart(name, price, url, con, btncart) {
    // listen for auth status changes
    auth.onAuthStateChanged(user => {
        if (user) {
                    console.log("User Logged In");
                    var item = {
                        name: name,
                        price: price,
                        url: url
                    }
                    cartItems.push(item);
                    let storage = JSON.parse(localStorage.getItem("cart"));
                    if (storage == null) {
                        products.push(item);
                        localStorage.setItem("cart", JSON.stringify(products));
                    } else {
                        products = JSON.parse(localStorage.getItem("cart"));
                        products.push(item);
                        localStorage.setItem("cart", JSON.stringify(products));

                    }
                    products = JSON.parse(localStorage.getItem("cart"));
                    cart_n.innerHTML = `[${products.length}]`;
                    document.getElementById(btncart).style.display = "none";
                    animation();
                    //setupGuides(snapshot.docs);
        } else {
            localStorage.clear();
            authorize.click();
            console.log("User Logged Out");
        }
    });

}

function cart2(name, price, url, con, btncart) {
    auth.onAuthStateChanged(user => {
        if (user) {
                    console.log("User Logged In");
                    var item = {
                        name: name,
                        price: price,
                        url: url
                    }
                    cartItems.push(item);
                    let storage = JSON.parse(localStorage.getItem("cart"));
                    if (storage == null) {
                        products.push(item);
                        localStorage.setItem("cart", JSON.stringify(products));
                        return;
                    } else {
                        products = JSON.parse(localStorage.getItem("cart"));
                        products.push(item);
                        localStorage.setItem("cart", JSON.stringify(products));
                    }
                    products = JSON.parse(localStorage.getItem("cart"));
                    cart_n.innerHTML = `[${products.length}]`;
                    document.getElementById(btncart).style.display = "none";
                    window.location.href = "../cart.html";
        } else {
            localStorage.clear();
            authorize.click();
            console.log("User Logged Out");
        }
    });


}
var myVar;

function render() {
    myVar = setTimeout(showPage, 2000);
    for (let index = 1; index <= 7; index++) {
        menDiv.innerHTML += `${HTMLmenProduct(index)}`;
        //womenDiv.innerHTML+= `${HTMLwomenProduct(index)}`;
    }
    for (let index = 1; index <= 6; index++) {
        womenDiv.innerHTML += `${HTMLwomenProduct(index)}`;
    }
    if (localStorage.getItem("cart") == null) {

    } else {
        products = JSON.parse(localStorage.getItem("cart"));
        cart_n.innerHTML = `[${products.length}]`;
    }
};


function showPage() {
  // listen for auth status changes
    auth.onAuthStateChanged((user) => {
      if (user) {
        user.getIdTokenResult().then((IdTokenResult) => {
          user.admin = IdTokenResult.claims.admin;
          if(!user.admin) {
            document.getElementById("loader").style.display = "none";
            document.getElementById("page-after").style.display = "block";
            ads_animate();
          } else {
            window.location.replace('https://bscpe-store.firebaseapp.com/admin/admin');
          }
        });
        
      } else {
      //   setupUI();
        document.getElementById("loader").style.display = "none";
        document.getElementById("page-after").style.display = "block";
        console.log("Please Register");
        ads_animate();
      }
    });



 }

 function ads_animate(){

  swal.fire({
    imageUrl: 'https://nice-assets.s3-accelerate.amazonaws.com/smart_templates/5ee185c9dccf0b9d78b6ab05c5b39349/assets/f7n4u2kk04o30qh4cvoww6hx3n1aib6y.jpg',
    imageWidth: 500,
    imageHeight: 450,
    imageAlt: 'Custom image',
    position: "center",
    backdrop: "linear-gradient(transparent, gray)",
    background: "transparent",
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: false,
    showConfirmButton: false,
    showCancelButton: false,
    timer: 5000
  });
 }
