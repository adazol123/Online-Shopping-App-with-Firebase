//GLOBAL
var products = JSON.parse(localStorage.getItem("cart"));
var cartItems = [];
var cart_n = document.getElementById("cart_n");
var cart_n2 = document.getElementById("cart_n2");
var table = document.getElementById("table");
var forms = document.getElementsByClassName('needs-validation');
var total = 0;

//HTML
function tableHTML(i) {
  return `
        <tr>
        <td>${products[i].name}</td>
        <td>${products[i].price}</td>
        </tr>
      `;
}

// listen for auth status changes
auth.onAuthStateChanged(user => {
    if (user) {
        user.getIdTokenResult().then(IdTokenResult => {
            console.log(IdTokenResult.claims);
            user.admin = IdTokenResult.claims.admin;
            setupUI(user);
        });
        db.collection("product").onSnapshot(
            snapshot => {
                console.log("User Logged In", snapshot.docs);
                //setupGuides(snapshot.docs);
            },
            err => {
                console.log(err.message);
            }
        );
    } else {
        setupUI();
        console.log("User Logged Out");
    }
});


const loggedOutLinks = document.querySelectorAll(".logged-out");
const loggedInLinks = document.querySelectorAll(".logged-in");
const accountDetails = document.querySelector(".account-details");
const adminItems = document.querySelectorAll(".admin");

const checkoutForm = document.querySelector("#checkoutForm");
const signupForm = document.querySelector("#signup-form");

const setupUI = user => {
    if (user) {
        if (user.admin) {
            adminItems.forEach(item => (item.style.display = "block"));
        }

        // account info
        db.collection("users")
            .doc(user.uid)
            .get()
            .then(doc => {
                const html = `
                <div class="text-center">
                <form>
                  <br>
                  <div><h5>${doc.data().firstname}  ${doc.data().lastname}</h5></div>
                  <div>${user.email}</div>
                  <div>${doc.data().number}</div>
                  <div class="btn btn-outline-warning" style="margin: 20px;">${user.admin ? "Admin" : "Customer"}</div>
                  <br>
                  <br>
                </form>
                  
                </div>
        `;
                accountDetails.innerHTML = html;
            })
        // db.collection("users")
        //     .doc(user.uid)
        //     .get()
        //     .then(doc => {
        //         const html = `
 
        // `;
                //accountBilling.innerHTML = html;

            // });

        //toggle UI elements
        loggedInLinks.forEach(item => (item.style.display = "block"));
        loggedOutLinks.forEach(item => (item.style.display = "none"));
    } else {
        adminItems.forEach(item => (item.style.display = "none"));
        accountDetails.innerHTML = "";
        //toggle UI elements
        loggedInLinks.forEach(item => (item.style.display = "none"));
        loggedOutLinks.forEach(item => (item.style.display = "block"));
    }
};



//BUY
function checkout() {
    //window.location.href = "/checkout.html";
    try {
          auth.onAuthStateChanged(user => {
        if (user) {
          var d = new Date();
          var t = d.getTime();
          var counter = t;
          counter += 1;
          // account info
          db.collection("users").doc(user.uid).get().then(doc => {
            let database = firebase.database().ref("order/" + user.uid + "/" + counter);
            let itemdb = {
              id: counter,
              order: counter - 895,
              total: total,
              email: user.email,
              firstname: checkoutForm["firstName"].value,
              lastname: checkoutForm["lastName"].value,
              number: doc.data().number,
              address: checkoutForm["address"].value,
              country: checkoutForm["country"].value,
              state: checkoutForm["state"].value,
              zipcode: checkoutForm["zip"].value
            };
  
          database.set(itemdb);
            swal.fire({
              position: "center",
              type: "success",
              title: "Purchase made successfully",
              text: `Your purchase order is : ${itemdb.order}`,
              showConfirmButton: true,
              timer: 5000
            }).then(() => {
              window.location.replace('https://bscpe-store.firebaseapp.com');
            });

            clear();
            //window.location.reload();
          });
          //window.location.href = "../index.html";
  
        } else {
          swal.fire({
            position: "center",
            type: "danger",
            title: "Purchase Cancelled",
            text: `Unable to make Transaction`,
            showConfirmButton: true,
            timer: 8000
          });
          // setupUI();
          // console.log("User Logged Out");
        }
      });
    } catch (error) {
      console.log(error);
    }
};

//RENDER
function render() {
    try {
  
      for (index = 0; index < products.length; index++) {
        table.innerHTML += tableHTML(index);
        total = total + parseInt(products[index].price);
      }
      table.innerHTML += `
            <tr>
            <th scope="col">Total :</th>
            <th scope="col"> ${total}.00 PHP</th>
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
        window.location.replace('https://bscpe-store.firebaseapp.com');
        swal.fire({
            position: "center",
            type: "warning",
            title: "Removed",
            text: `Shopping cart has ben removed`,
            showConfirmButton: false,
            timer: 50000
        }).then(e => {
          window.location.replace('https://bscpe-store.firebaseapp.com');
        });
    } catch (error) {
        console.log(error);
    }
}

function clear() {
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

const logout = document.querySelector("#logout");
logout.addEventListener("click", e => {

    e.preventDefault();
    auth.signOut().then(() => {
      window.location.replace('https://bscpe-store.firebaseapp.com');
     });
    
});

const test = document.querySelector("#test");
var validation = Array.prototype.filter.call(forms, function(form){
    form.addEventListener("click", e => {

        if (form.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
            console.log("Validating...");
        }
            form.classList.add('was-validated');
            if (form.checkValidity() === true) {
              checkout();
              console.log("validated!");
            }
    }, false);
    
});
