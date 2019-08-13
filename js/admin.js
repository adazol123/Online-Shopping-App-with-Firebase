var myVar;
// UI MANIPULATION FOR LOGIN AND LOGOUT
const loggedOutLinks = document.querySelectorAll(".logged-out");
const loggedInLinks = document.querySelectorAll(".logged-in");
const accountDetails = document.querySelector(".account-details");
const userName = document.querySelector(".username");
const adminItems = document.querySelectorAll(".admin");
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
      });

      db.collection("users")
      .doc(user.uid)
      .get()
      .then(doc => {
        const html = `
          <div>${doc.data().firstname}</div>
     `;
        userName.innerHTML = html;
      });

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


//RENDER
function renderTable() {
    myVar = setTimeout(showPage, 2000);

}

function view_order(){
  var order = firebase.database().ref("order/");

  order.on("child_added", function(data){
      var orderX = firebase.database().ref("order/" + data.key);
          orderX.on("child_added", function(dataB){
              var orderValue = dataB.val();
              console.log(orderValue.lastname);
              document.getElementById("table").innerHTML+=`
                  <tr>
                      <td>${orderValue.id}</td>
                      <td>${orderValue.lastname},${orderValue.firstname}</td>
                      <td>${orderValue.number}</td>
                      <td>${orderValue.address1},${orderValue.state},${orderValue.country} ${orderValue.zipcode}</td>
                      <td>${orderValue.order}</td>
                      <td>${orderValue.total}</td>
                  </tr>
              `;
      });
          //     document.getElementById("orderByUser").innerHTML+=`
          //         <br>
          //         <h5><span>UID: </span>${data.key}</h5>
          //         <br>
          // `;
  });
}

function showPage() {
  // listen for auth status changes
    auth.onAuthStateChanged((user) => {
      if (user) {
        user.getIdTokenResult().then((IdTokenResult) => {
          console.log(IdTokenResult.claims);
          user.admin = IdTokenResult.claims.admin;
          if(!user.admin) {
            console.log("Authorized Personel Only! Admin");
            document.getElementById("loader").style.display = "none";
            document.getElementById("redirect").style.display = "block";
            redirect_animate();
            //window.location.href = "../admin/admin.html";
            
          } else {
            // window.location.href = "../index.html";
            document.getElementById("loader").style.display = "none";
            document.getElementById("page-after").style.display = "block";
            console.log(IdTokenResult.claims);
            view_order();
          }
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
      //   setupUI();


        document.getElementById("loader").style.display = "none";
        document.getElementById("redirect").style.display = "block";
        console.log("Authorized Personel Only!");
        redirect_animate();
      }
    });



 }

 function redirect_animate(){
  swal.fire({
    position: "center",
    type: "success",
    showConfirmButton: false,
    timer: 3000
  }).then(() => {
      window.location.replace('https://bscpe-store.firebaseapp.com');
  });
 }
 function logout_animate(){
  swal.fire({
    position: "center",
    type: "success",
    showConfirmButton: false,
    timer: 3000
  }).then(() => {
    window.location.replace('https://bscpe-store.firebaseapp.com');
  });
 }



const logout = document.querySelector("#logout");
logout.addEventListener("click", e => {

    e.preventDefault();
    auth.signOut().then(() => {
     console.log("loggedOut!");
        logout_animate();
     });
    
});