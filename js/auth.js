// var storageRef = storage.ref("product/file.jpg");
// add admin cloud function
const adminForm = document.querySelector(".admin-actions");
adminForm.addEventListener("submit", e => {
  e.preventDefault();
  const adminEmail = document.querySelector("#admin-email").value;
  const addAdminRole = functions.httpsCallable("addAdminRole");
  addAdminRole({ email: adminEmail }).then(result => {
    console.log(result);
  });
});

//setup materialize components
document.addEventListener("DOMContentLoaded", function() {
  var modals = document.querySelectorAll(".modal");
  M.Modal.init(modals);

  var items = document.querySelectorAll(".collapsible");
  M.Collapsible.init(items);
});


//RETREIVE DATA REALTIME
const guideList = document.querySelector(".guides");
const setupGuides = data => {
  let html = "";
  data.forEach(doc => {
    const guide = doc.data();
    console.log(guide);
    const li = `
    <li>
      <div class="collapsible-header grey lighten-4">${guide.name}</div>
      <div class="collapsible-body white">
          <h4>${guide.price}</h4> 
          <img src="${guide.image}" alt="" srcset="" style="height:
            20rem; padding-bottom: 2rem;"">
      </div>
    </li>
    <div class="col-md-3">
                <div class="card mb-3 shadow-sm">
                <div class="cardImg">
                <img class="card-img-top" style="height:19rem;" src="${guide.image}" alt="Card Image">
                </div>
                <div class="card-body">
                    <i style="color:orange;" class="fa fa-star"></i>
                    <i style="color:orange;" class="fa fa-star"></i>
                    <i style="color:orange;" class="fa fa-star"></i>
                    <i style="color:orange;" class="fa fa-star"></i>
                    <i style="color:gray;" class="fa fa-star"></i>
                    <p class="card-text">${guide.name}</p>
                    <p class="card-text">Price: <span><b>${guide.price}.00 PHP</b></span></p>
                    <div class="d-flex justify-content-between align-items-center">
                    <div class="btn-group">
                    <button type="button" onclick="cart2('${guide.name}','${guide.price}','${guide.image}','','')" class="btn btn-sm btn-outline-secondary">
                    <a style="color:inherit;" href="cart.html">Buy</a>
                    </button>
                    <button  type="button" onclick="cart('${guide.name}','${guide.price}','${guide.image}','','')" class="btn btn-sm btn-outline-secondary">Add to cart</button>
                    </div>
                    <small class="text-muted">Free Shipping</small>
                    </div>
                </div>
                </div>
            </div>
    `;
    html += li;
  });

  guideList.innerHTML = html;
};

// listen for auth status changes
auth.onAuthStateChanged(user => {
  if (user) {
    user.getIdTokenResult().then(IdTokenResult => {
      console.log(IdTokenResult.claims);
      user.admin = IdTokenResult.claims.admin;
      setupUI(user);
    });
    db.collection("menproduct").onSnapshot(
      snapshot => {
        console.log("User Logged In", snapshot.docs);
        setupGuides(snapshot.docs);
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

//signup
const signupForm = document.querySelector("#signup-form");
signupForm.addEventListener("submit", e => {
  e.preventDefault();

  // get user info
  const email = signupForm["signup-email"].value;
  const password = signupForm["signup-password"].value;

  console.log(email, password);
  auth
    .createUserWithEmailAndPassword(email, password)
    .then(cred => {
      console.log(cred.user);
      return db
        .collection("users")
        .doc(cred.user.uid)
        .set({
          bio: signupForm["signup-bio"].value
        });
    })
    .then(() => {
      const modal = document.querySelector("#modal-signup");
      M.Modal.getInstance(modal).close();
      signupForm.reset();
      signupForm.querySelector(".error").innerHTML = "";
    })
    .catch(err => {
      signupForm.querySelector(".error").innerHTML = err.message;
    });
});

const logout = document.querySelector("#logout");
logout.addEventListener("click", e => {
  e.preventDefault();
  auth.signOut().then(() => {});
});

// LOGIN
const loginForm = document.querySelector("#login-form");
loginForm.addEventListener("submit", e => {
  e.preventDefault();
  const email = loginForm["login-email"].value;
  const password = loginForm["login-password"].value;

  auth
    .signInWithEmailAndPassword(email, password)
    .then(cred => {
      console.log(cred.user);
      const modal = document.querySelector("#modal-login");
      M.Modal.getInstance(modal).close();
      loginForm.reset();
      loginForm.querySelector(".error").innerHTML = "";
    })
    .catch(err => {
      loginForm.querySelector(".error").innerHTML = err.message;
    });
});

// UI MANIPULATION FOR LOGIN AND LOGOUT
const loggedOutLinks = document.querySelectorAll(".logged-out");
const loggedInLinks = document.querySelectorAll(".logged-in");
const accountDetails = document.querySelector(".account-details");
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
        <div> Logged in as ${user.email}</div>
        <div>${doc.data().bio}</div>
        <div class="pink-text">${user.admin ? "Admin" : "Customer"}</div>
      `;
        accountDetails.innerHTML = html;
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

// CREATE NEW DATA (ADD DATA TO FIRESTORE)
const createForm = document.querySelector("#create-form");
createForm.addEventListener("submit", e => {
  e.preventDefault();

  db.collection("menproduct")
    .add({
      name: createForm["title"].value,
      price: createForm["content"].value
    })
    .then(() => {
      const modal = document.querySelector("#modal-create");
      M.Modal.getInstance(modal).close();
      createForm.reset();
    })
    .catch(err => {
      console.log(err.message);
    });
});

//File Upload
var uploader = document.getElementById("uploader");
var fileButton = document.getElementById("fileButton");

fileButton.addEventListener("change", function(e) {
  // Get file
  var file = e.target.files[0];

  //Create a storage ref
  var storageRef = storage.ref("women/" + file.name);
  //Upload file
  var task = storageRef.put(file);

  //Update progress
  task.on(
    "state_changed",
    function progress(snapshot) {
      var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      uploader.value = percentage;
      console.log(percentage);
    },

    function error(err) {
      console.log(err.message);
    },

    function complete() {
      console.log("Done!");
      uploader.value = 0;
      file = "";
    }
  );
});
