//GLOBAL
var products = JSON.parse(localStorage.getItem("cart"));
var cartItems = [];
var cart_n = document.getElementById("cart_n");
var cart_n2 = document.getElementById("cart_n2");
var table = document.getElementById("table");
var total = 0;

//HTML
function tableHTML(i) {
  return `
        <tr>
        <th scope-"col">${i + 1}</th>
        <td><img style="width:90px;" src="${products[i].url}"></td>
        <td>${products[i].name}</td>
        <td>1</td>
        <td>${products[i].price}</td>
        </tr>
      `;
}

//BUY
function buy() {
  window.location.href = "../checkout.html";
  // try {
  //   auth.onAuthStateChanged(user => {
  //     if (user) {
  //       var d = new Date();
  //       var t = d.getTime();
  //       var counter = t;
  //       counter += 1;
  //       // account info
  //       db.collection("users").doc(user.uid).get().then(doc => {
  //         let database = firebase.database().ref("order/" + user.uid + "/" + counter);
  //         let itemdb = {
  //           id: counter,
  //           order: counter - 895,
  //           total: total,
  //           email: user.email,
  //           firstname: doc.data().firstname,
  //           lastname: doc.data().lastname,
  //           number: doc.data().number
  //         };

  //       database.set(itemdb);
  //         swal.fire({
  //           position: "center",
  //           type: "success",
  //           title: "Purchase made successfully",
  //           text: `Your purchase order is : ${itemdb.order}`,
  //           showConfirmButton: true,
  //           timer: 5000
  //         });

  //       });


  //     } else {
  //       setupUI();
  //       console.log("User Logged Out");
  //     }
  //   });

  // } catch (error) {
  //   console.log(error);
  // } finally {
  //   clear();
  // }
}

//RENDER
function render() {
  try {

    for (index = 0; index < products.length; index++) {
      table.innerHTML += tableHTML(index);
      total = total + parseInt(products[index].price);
    }
    table.innerHTML += `
          <tr>
          <th scope="col"></th>
          <th scope="col">Total:</th>
          <th scope="col"></th>
          <th scope="col"></th>
          <th scope="col"> ${total}.00 PHP</th>
          </tr>
          <tr style="padding-top:100rem;">
          <th scope="col"></th>
          <th scope="col"></th>
          <th scope="col"><button id = "btnClean" onclick="clean()" class="btn text-white btn-warning"> Clean Shopping Cart</button></th>
          <th scope="col"></th>
          <th scope="col"><button id = "btnBuy" onclick="buy()" class="btn text-white btn-success">Buy</button></th>
          <th scope="col"></th>
          </tr>
        `;
    products = JSON.parse(localStorage.getItem("index"));
    cart_n.innerHTML = `[${products.length}]`;
    cart_n2.innerHTML = `[${products.length}]`;
  } catch (error) {
    console.log(error);
  }
}

function clean() {

  try {
    remove_cart();
  }
  catch (error) {
    console.log(error);
  }
}

function cleaner() {

  try {
    localStorage.clear();
    for (let index = 0; index < products.length; index++) {
      table.innerHTML += tableHTML(index);
      total = total + parseInt(products[index].price);
    }
    total = 0;
    table.innerHTML = `
          <tr>
          <th></th>
          <th></th>
          <th></th>
    
          </tr>
        `;

    cart_n.innerHTML = ``;
    document.getElementById("btnBuy").style.display = "none";
    document.getElementById("btnClean").style.display = "none";

  } catch (error) {
    console.log(error);
  }


}

function remove_cart() {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.value) {
      cleaner();
      Swal.fire(
        'Deleted!',
        'Your file has been deleted.',
        'success'
      ).then(() => {
        window.location.reload();
      })
    }
  })
}
