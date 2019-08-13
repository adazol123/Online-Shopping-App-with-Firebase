// Initialize Firebase

  
//GLOBAL
var d = new Date();
var t = d.getTime();
var counter = t;

//FORM
document.getElementById("form").addEventListener("submit",(e)=>{
    var firstname = document.getElementById("firstname").value;
    var lastname = document.getElementById("lastname").value;
    var number = document.getElementById("number").value;
    var order = document.getElementById("order").value;
    var location = document.getElementById("location").value;
    var total = document.getElementById("total").value;
    e.preventDefault();
    createOrder(firstname,lastname,number,order,location,total);
    form.reset();

});

function createOrder(firstname,lastname,number,order,location,total){
    counter+=1;
    var newOrder={
        id:counter,
        firtname:firstname,
        lastname:lastname,
        number:number,
        order:order,
        address:location,
        total:total
    }
    let db = firebase.database().ref("order/"+counter);
    db.set(newOrder);
    document.getElementById("cardSection").innerHTML='';
    readDataOrder();
}

function readOrder(){
    var order = firebase.database().ref("order/");

    order.on("child_added", function(data){
        var orderValue = firebase.database().ref("order/" + data.key);
        console.log(orderValue.firstname);
        document.getElementById("cardSection").innerHTML+=`
            <div class="card mb-3">
            <div class="card-body">
            <h5 class="card-title">Order: ${orderValue.order}</h5>
            <p class="card-text">Total: ${orderValue.total}</p>
            <button type="submit" style="color:white" class="btn btn-warning" onclick="updateOrder(${orderValue.id}, '${orderValue.order}','${orderValue.total}')">
                <i class="fas fa-edit"></i> Edit Order
            </button>
            <button type="submit" class="btn btn-danger" onclick="deleteOrder(${orderValue.id})">
            <i class="fas fa-trash-alt"></i> Delete Order
            </button>
            </div>
            </div>
        `
    });
}
function readDataOrder() {
    var order = firebase.database().ref("order/");

  order.on("child_added", function(data){
      var orderX = firebase.database().ref("order/" + data.key);
          orderX.on("child_added", function(dataB){
              var orderValue = dataB.val();
              console.log(orderValue.id);
                document.getElementById("cardSection").innerHTML+=`
                    <div class="card mb-3">
                    <div class="card-body">
                    <h5 class="card-title">Order: ${orderValue.order}</h5>
                    <p class="card-text">Total: ${orderValue.total}</p>
                    <button type="submit" style="color:white" class="btn btn-warning" onclick="updateOrder(${orderValue.id},'${orderValue.firstname}','${orderValue.lastname}','${orderValue.number}', '${orderValue.order}','${orderValue.address}','${orderValue.total}')">
                        <i class="fas fa-edit"></i> Edit Order
                    </button>
                    <button type="submit" class="btn btn-danger" onclick="deleteOrder(${orderValue.id})">
                    <i class="fas fa-trash-alt"></i> Delete Order
                    </button>
                    </div>
                    </div>
        `
      });
          //     document.getElementById("orderByUser").innerHTML+=`
          //         <br>
          //         <h5><span>UID: </span>${data.key}</h5>
          //         <br>
          // `;
  });
}

function reset(){
    document.getElementById("firstSection").innerHTML=`
        <form class="border p-4 mb-4" id="form">
            <div class="form-group">
                <label for="">First Name</label>
                <input type="text" name="" id="firstname" class="form-control" placeholder="first name">
            </div>
            <div class="form-group">
                <label for="">Last Name</label>
                <input type="text" name="" id="lastname" class="form-control" placeholder="last name">
            </div>
            <div class="form-group">
                <label for="">Number</label>
                <input type="text" name="" id="number" class="form-control" placeholder="number">
            </div>
            <div class="form-group">
                <label for="">Order</label>
                <input type="text" name="" id="order" class="form-control" placeholder="order">
            </div>
            <div class="form-group">
                <label for="">Location</label>
                <input type="text" name="" id="location" class="form-control" placeholder="location">
            </div>
            <div class="form-group">
                <label for="">Total Payment</label>
                <input type="text" name="" id="total" class="form-control" placeholder="total">
            </div>
            <button type="submit" id="buttonSubmit" class="btn btn-primary"><i class="fas fa-plus"> Add Order</i></button>
            <button style="display:none" id="button2" class="btn btn-success"></button>
            <button style="display:none" id="button3" class="btn btn-danger"></button>
        </form>
    `;
    document.getElementById("form").addEventListener("submit", (e)=>{
        var firstname = document.getElementById("firstname").value;
        var lastname = document.getElementById("lastname").value;
        var number = document.getElementById("number").value;
        var order = document.getElementById("order").value;
        var location = document.getElementById("location").value;
        var total = document.getElementById("total").value;
        e.preventDefault();
        createOrder(firstname,lastname,number,order,location,total);
        form.reset();
    });
}
function updateOrder(id,firstname,lastname,number,order,location,total){
    document.getElementById("firstSection").innerHTML = `
        <form class="border p-4 mb-4" id="form2">
                <div class="form-group">
                    <label for="">First Name</label>
                    <input type="text" name="" id="firstname" class="form-control" placeholder="first name">
                </div>
                <div class="form-group">
                    <label for="">Last Name</label>
                    <input type="text" name="" id="lastname" class="form-control" placeholder="last name">
                </div>
                <div class="form-group">
                    <label for="">Number</label>
                    <input type="text" name="" id="number" class="form-control" placeholder="number">
                </div>
                <div class="form-group">
                    <label for="">Order</label>
                    <input type="text" name="" id="order" class="form-control" placeholder="order">
                </div>
                <div class="form-group">
                    <label for="">Location</label>
                    <input type="text" name="" id="location" class="form-control" placeholder="location">
                </div>
                <div class="form-group">
                    <label for="">Total Payment</label>
                    <input type="text" name="" id="total" class="form-control" placeholder="total">
                </div>
            <button style="display:none" id="buttonSubmit" class="btn btn-primary">
                <i class="fas fa-plus"> Add Order</i>
            </button>
            <button style="display:inline-block" type="submit" id="button2" class="btn btn-success">Update Order</button>
            <button style="display:inline-block" id="button3" class="btn btn-danger">Cancel</button>
        </form>
    `;
    document.getElementById("form2").addEventListener("submit",(e)=>{
        e.preventDefault();
    });
    document.getElementById("button3").addEventListener("click",(e)=>{
        reset();
    });
    document.getElementById("button2").addEventListener("click",(e)=>{
        updateOrder2(id,document.getElementById("firstname").value,document.getElementById("lastname").value,document.getElementById("number").value,document.getElementById("order").value,document.getElementById("location").value,document.getElementById("total").value);
    });
    document.getElementById("firstname").value = firstname;
    document.getElementById("lastname").value = lastname;
    document.getElementById("number").value = number;
    document.getElementById("order").value = order;
    document.getElementById("location").value = location;
    document.getElementById("total").value = total;
     
}

function updateOrder2(id,firstname,lastname,number,order,location,total){
    var orderUpdated = {
        id:id,
        firstname:firstname,
        lastname:lastname,
        number:number,
        order:order,
        address:location,
        total:total
    }
    let db = firebase.database().ref("order/");
    db.on("child_added", function(data){
      var orderX = firebase.database().ref("order/" + data.key + "/" +id);
              console.log(orderX);
                    orderX.set(orderUpdated);
                    document.getElementById("cardSection").innerHTML = '';
                    readDataOrder();
                    reset();
          //     document.getElementById("orderByUser").innerHTML+=`
          //         <br>
          //         <h5><span>UID: </span>${data.key}</h5>
          //         <br>
          // `;
  });

}

function deleteOrder(id){
    var order = firebase.database().ref("order/");
    order.on("child_added", function(data){
      var orderX = firebase.database().ref("order/" + data.key + "/" +id);
              console.log(orderX);
                orderX.remove();
                reset();
                document.getElementById("cardSection").innerHTML = '';
                readDataOrder();
          //     document.getElementById("orderByUser").innerHTML+=`
          //         <br>
          //         <h5><span>UID: </span>${data.key}</h5>
          //         <br>
          // `;
  });

    
}