





// //RETREIVE DATA REALTIME
// const guideList = document.querySelector(".guides");
// const setupGuides = data => {
//   let html = "";
//   data.forEach(doc => {
//     const guide = doc.data();
//     console.log(guide);
//     const li = `
//     <li>
//       <div class="collapsible-header grey lighten-4">${guide.name}</div>
//       <div class="collapsible-body white">${guide.price} </div>
//     </li>
//     `;
//     html += li;
//   });

//   guideList.innerHTML = html;
// };

// listen for auth status changes
auth.onAuthStateChanged(user => {
  if (user) {
    user.getIdTokenResult().then(IdTokenResult => {
      user.admin = IdTokenResult.claims.admin;
      if(user.admin) {
        console.log(IdTokenResult.claims.admin);
        //window.location.href = "../admin/admin.html";
      } else {
        setupUI(user);
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
    setupUI();
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
          firstname: signupForm["signup-firstname"].value,
          lastname: signupForm["signup-lastname"].value,
          number: signupForm["signup-number"].value
        });
    })
    .then(() => {
      const modal = document.querySelector("#ModalCenter");
      $(modal).modal('hide');
      document.sign-up-form.submit();
      document.sign-up-form.reset();
      signupForm.querySelector(".error").innerHTML = "";
      swal.fire({
        position: "center",
        type: "success",
        title: "Registered",
        text: `Welcome to BSCPE STORE!`,
        showConfirmButton: true,
        timer: 10000
      });

    })
    .catch(err => {
      signupForm.querySelector(".error").innerHTML = err.message;
    });
});

const logout = document.querySelector("#logout");
logout.addEventListener("click", e => {
  e.preventDefault();
  auth.signOut().then(() => {
    logout_animate();
  });
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
      const modal = document.querySelector("#ModalCenter");
      loginForm["login-email"].value = "";
      loginForm["login-password"].value = "";
      loginForm.querySelector(".error").innerHTML = "";
      $(modal).modal('hide');
      swal.fire({
        position: "center",
        type: "success",
        title: "Welcome Back!",
        text: `${cred.user.email}`,
        showConfirmButton: true,
        timer: 8000
      }).then(() => {
        auth.onAuthStateChanged(user => {
          if (user) {
            user.getIdTokenResult().then(IdTokenResult => {
              user.admin = IdTokenResult.claims.admin;
              if(user.admin == true) {
                window.location.replace('https://bscpe-store.firebaseapp.com/admin/admin');
              } else {
                setupUI(user);
                window.location.replace('https://bscpe-store.firebaseapp.com');
              }
            });
          } else {
            setupUI();
            window.location.replace('https://bscpe-store.firebaseapp.com');
          }
        });
      });
    })
    .catch(err => {
      loginForm["login-email"].value = "";
      loginForm["login-password"].value = "";
      loginForm.querySelector(".error").innerHTML = err.message;
    });
});

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

// // CREATE NEW DATA (ADD DATA TO FIRESTORE)
// const createForm = document.querySelector("#create-form");
// createForm.addEventListener("submit", e => {
//   e.preventDefault();

//   db.collection("product")
//     .add({
//       name: createForm["title"].value,
//       price: createForm["content"].value
//     })
//     .then(() => {
//       const modal = document.querySelector("#modal-create");
//       M.Modal.getInstance(modal).close();
//       createForm.reset();
//     })
//     .catch(err => {
//       console.log(err.message);
//     });
// });

// //File Upload
// var uploader = document.getElementById("uploader");
// var fileButton = document.getElementById("fileButton");

// fileButton.addEventListener("change", function(e) {
//   // Get file
//   var file = e.target.files[0];

//   //Create a storage ref
//   var storageRef = storage.ref("images/" + file.name);
//   //Upload file
//   var task = storageRef.put(file);

//   //Update progress
//   task.on(
//     "state_changed",
//     function progress(snapshot) {
//       var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//       uploader.value = percentage;
//       console.log(percentage);
//     },

//     function error(err) {
//       console.log(err.message);
//     },

//     function complete() {
//       console.log("Done!");
//       uploader.value = 0;
//       file = "";
//     }
//   );
// });
function logout_animate(){
  swal.fire({
    position: "center",
    type: "success",
    title: "Logout Successfully",
    text: ``,
    showConfirmButton: true,
    timer: 8000
  }).then(() => {
    window.location.replace('https://bscpe-store.firebaseapp.com');
  });
  
 }