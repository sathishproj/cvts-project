function getData(k){try{return JSON.parse(localStorage.getItem(k))||[]}catch(e){return[]}}
function setData(k,v){localStorage.setItem(k,JSON.stringify(v))}
function el(id){return document.getElementById(id)}

const userNames=["Admin","Fleet Manager","Tracking Operator","Route Supervisor","Vehicle Coordinator","Safety Officer","Transport Admin","GPS Monitor","Driver Support","Operations Head","Shift Operator","Maintenance Lead","Control Room User","Report Analyst","Geo Fence Admin","Field Manager","Logistics User","System Auditor","Dispatch User","Emergency Operator","Night Shift User","Day Shift User","Route Planner","Fleet Analyst","Service User"];
const vehicleNums=["TS09AB1234","TS08CD4567","AP39EF7890","TS10GH1122","TS11JK3344","AP28LM5566","TS12NP7788","TS13QR9900","AP31ST2211","TS14UV4433","TS15WX6655","AP32YZ8877","TS16AA1099","TS17BB2200","AP33CC3311","TS18DD4422","TS19EE5533","AP34FF6644","TS20GG7755","TS21HH8866","AP35JJ9977","TS22KK1188","TS23LL2299","AP36MM3400","TS24NN4511"];

function seedData(force=false){
    if(force){localStorage.clear()}

    if(!localStorage.getItem("users")){
        let users=userNames.map((n,i)=>({
            name:n,
            email:i===0?"admin@example.com":i===1?"manager@example.com":i===2?"operator@example.com":`user${i+1}@example.com`,
            password:i===0?"admin123":i===1?"manager123":i===2?"operator123":"user123",
            role:i%5===0?"Admin":i%3===0?"Operator":"User"
        }));
        setData("users",users);
    }

    if(!localStorage.getItem("vehicles")){
        let types=["School Bus","Truck","Ambulance","Cab","Delivery Van"];
        let drivers=["Ramesh","Suresh","Mahesh","Naresh","Rajesh","Kiran","Praveen","Arun","Naveen","Vijay"];
        let vehicles=vehicleNums.map((v,i)=>({
            vehicleNo:v,
            driverName:drivers[i%drivers.length],
            vehicleType:types[i%types.length],
            status:i%7===0?"Maintenance":i%6===0?"Inactive":"Active"
        }));
        setData("vehicles",vehicles);
    }

    if(!localStorage.getItem("tracking")){
        let loc=["Hyderabad","Secunderabad","Madhapur","Gachibowli","Kukatpally","Uppal","LB Nagar","Hitech City","Airport Road","Banjara Hills","Jubilee Hills","Ameerpet","Koti","Miyapur","Lingampally","Begumpet","Kompally","Nampally","Dilsukhnagar","Patancheru","ECIL","Financial District","Mehdipatnam","Shamshabad","Outer Ring Road"];
        let tracking=vehicleNums.map((v,i)=>{
            let sp=35+(i*7)%70;
            return {
                vehicle:v,
                latitude:(17.35+i*0.008).toFixed(4),
                longitude:(78.40+i*0.009).toFixed(4),
                speed:String(sp),
                location:loc[i%loc.length],
                status:sp>80?"Overspeed Anomaly":"Normal",
                time:`${String(9+Math.floor(i/3)).padStart(2,"0")}:${String((i*7)%60).padStart(2,"0")} AM`
            }
        });
        setData("tracking",tracking);
    }

    if(!localStorage.getItem("alerts")){
        let types=["OVERSPEED","GEOFENCE","ANOMALY","LOW SIGNAL"];
        let statuses=["Open","Closed","Under Review"];
        let alerts=vehicleNums.map((v,i)=>({
            vehicle:v,
            type:types[i%types.length],
            message:i%2===0?"Vehicle speed crossed allowed limit":"Vehicle is outside permitted zone",
            status:statuses[i%statuses.length]
        }));
        setData("alerts",alerts);
    }

    if(!localStorage.getItem("reports")){
        let reports=vehicleNums.map((v,i)=>({
            vehicle:v,
            startDate:"2026-04-01 08:00",
            endDate:"2026-04-01 18:00",
            totalLogs:1+(i%5),
            avgSpeed:40+(i%45),
            output:"Route report generated successfully"
        }));
        setData("reports",reports);
    }
}

function resetDemoData(){
    seedData(true);
    alert("Demo data reset successfully");
    location.reload();
}

function login(){
    let e=el("email").value.trim();
    let p=el("password").value.trim();
    let u=getData("users").find(x=>x.email===e && x.password===p);

    if(u){
        localStorage.setItem("loggedInUser",e);
        location.href="/dashboard";
    }else{
        el("msg").innerHTML="Invalid login details";
        el("msg").className="error";
    }
}

function logout(){
    localStorage.removeItem("loggedInUser");
}

function saveUser(){
    let nameVal=el("name").value.trim();
    let emailVal=el("regEmail").value.trim();
    let passVal=el("regPassword").value.trim();
    let roleVal=el("regRole").value;

    if(!nameVal || !emailVal || !passVal){
        alert("Please fill all user details");
        return;
    }

    let a=getData("users");

    if(a.some(u=>u.email===emailVal)){
        alert("Email already exists. Use another email.");
        return;
    }

    a.push({name:nameVal,email:emailVal,password:passVal,role:roleVal});
    setData("users",a);

    alert("User saved successfully. Now login using this email and password.");
    loadUsers();
}

function loadUsers(){
    if(!el("usersTable")) return;

    let h="<tr><th>S.No</th><th>Name</th><th>Email</th><th>Password</th><th>Role</th></tr>";
    getData("users").forEach((u,i)=>{
        h+=`<tr><td>${i+1}</td><td>${u.name}</td><td>${u.email}</td><td>${u.password}</td><td>${u.role}</td></tr>`;
    });
    el("usersTable").innerHTML=h;
}

function saveVehicle(){
    let v={
        vehicleNo:el("vehicleNo").value.trim(),
        driverName:el("driverName").value.trim(),
        vehicleType:el("vehicleType").value.trim(),
        status:el("vehicleStatus").value
    };

    if(!v.vehicleNo || !v.driverName || !v.vehicleType){
        alert("Please fill all vehicle details");
        return;
    }

    let a=getData("vehicles");
    a.push(v);
    setData("vehicles",a);

    alert("Vehicle saved successfully");
    loadVehicles();
}

function loadVehicles(){
    if(!el("vehiclesTable")) return;

    let h="<tr><th>S.No</th><th>Vehicle Number</th><th>Driver</th><th>Type</th><th>Status</th></tr>";
    getData("vehicles").forEach((v,i)=>{
        h+=`<tr><td>${i+1}</td><td>${v.vehicleNo}</td><td>${v.driverName}</td><td>${v.vehicleType}</td><td>${v.status}</td></tr>`;
    });
    el("vehiclesTable").innerHTML=h;
}

function fillVehicleDropdown(){
    if(!el("trackVehicle")) return;

    el("trackVehicle").innerHTML=getData("vehicles").map(v=>`<option value="${v.vehicleNo}">${v.vehicleNo}</option>`).join("");
}

function saveTracking(){
    let sp=parseFloat(el("speed").value);

    if(!el("trackVehicle").value || !el("latitude").value || !el("longitude").value || isNaN(sp)){
        alert("Please fill valid tracking details");
        return;
    }

    let a=getData("tracking");
    let al=getData("alerts");
    let st=sp>80?"Overspeed Anomaly":"Normal";

    if(sp>80){
        al.push({
            vehicle:el("trackVehicle").value,
            type:"OVERSPEED",
            message:"Vehicle speed crossed allowed limit",
            status:"Open"
        });
    }

    a.push({
        vehicle:el("trackVehicle").value,
        latitude:el("latitude").value,
        longitude:el("longitude").value,
        speed:el("speed").value,
        location:el("location").value,
        status:st,
        time:new Date().toLocaleTimeString()
    });

    setData("tracking",a);
    setData("alerts",al);

    alert("Tracking data saved successfully");
    loadTracking();
}

function loadTracking(){
    if(!el("trackingTable")) return;

    let h="<tr><th>S.No</th><th>Vehicle</th><th>Latitude</th><th>Longitude</th><th>Speed</th><th>Location</th><th>ML Status</th><th>Time</th></tr>";
    getData("tracking").forEach((t,i)=>{
        h+=`<tr><td>${i+1}</td><td>${t.vehicle}</td><td>${t.latitude}</td><td>${t.longitude}</td><td>${t.speed} km/h</td><td>${t.location}</td><td>${t.status}</td><td>${t.time||"-"}</td></tr>`;
    });
    el("trackingTable").innerHTML=h;
}

function saveAlert(){
    let a=getData("alerts");

    a.push({
        vehicle:el("alertVehicle").value,
        type:el("alertType").value,
        message:el("alertMessage").value,
        status:el("alertStatus").value
    });

    setData("alerts",a);
    alert("Alert saved successfully");
    loadAlerts();
}

function loadAlerts(){
    if(!el("alertsTable")) return;

    let h="<tr><th>S.No</th><th>Vehicle</th><th>Alert Type</th><th>Message</th><th>Status</th></tr>";
    getData("alerts").forEach((a,i)=>{
        h+=`<tr><td>${i+1}</td><td>${a.vehicle}</td><td>${a.type}</td><td>${a.message}</td><td><span class='badge'>${a.status}</span></td></tr>`;
    });
    el("alertsTable").innerHTML=h;
}

function loadDashboard(){
    if(!el("userCount")) return;

    seedData();

    let u=getData("users");
    let v=getData("vehicles");
    let t=getData("tracking");
    let a=getData("alerts");

    el("userCount").innerText=u.length;
    el("vehicleCount").innerText=v.length;
    el("trackingCount").innerText=t.length;
    el("alertCount").innerText=a.length;

    let h="<tr><th>Vehicle</th><th>Location</th><th>Speed</th><th>Status</th><th>Time</th></tr>";
    t.slice(-12).reverse().forEach(x=>{
        h+=`<tr><td>${x.vehicle}</td><td>${x.location}</td><td>${x.speed} km/h</td><td>${x.status}</td><td>${x.time||"-"}</td></tr>`;
    });

    el("dashboardTable").innerHTML=h;
}

function showDashboardSection(type){
    if(!el("detailTitle") || !el("detailBox")) return;

    let title="";
    let h="";

    if(type==="users"){
        title="User Details";
        h="<table><tr><th>S.No</th><th>Name</th><th>Email</th><th>Role</th></tr>";
        getData("users").forEach((u,i)=>{
            h+=`<tr><td>${i+1}</td><td>${u.name}</td><td>${u.email}</td><td>${u.role}</td></tr>`;
        });
        h+="</table>";
    }

    if(type==="vehicles"){
        title="Vehicle Details";
        h="<table><tr><th>S.No</th><th>Vehicle</th><th>Driver</th><th>Type</th><th>Status</th></tr>";
        getData("vehicles").forEach((v,i)=>{
            h+=`<tr><td>${i+1}</td><td>${v.vehicleNo}</td><td>${v.driverName}</td><td>${v.vehicleType}</td><td>${v.status}</td></tr>`;
        });
        h+="</table>";
    }

    if(type==="tracking"){
        title="Tracking Log Details";
        h="<table><tr><th>S.No</th><th>Vehicle</th><th>Latitude</th><th>Longitude</th><th>Speed</th><th>Location</th><th>Status</th><th>Time</th></tr>";
        getData("tracking").forEach((t,i)=>{
            h+=`<tr><td>${i+1}</td><td>${t.vehicle}</td><td>${t.latitude}</td><td>${t.longitude}</td><td>${t.speed} km/h</td><td>${t.location}</td><td>${t.status}</td><td>${t.time||"-"}</td></tr>`;
        });
        h+="</table>";
    }

    if(type==="alerts"){
        title="Alert Details";
        h="<table><tr><th>S.No</th><th>Vehicle</th><th>Type</th><th>Message</th><th>Status</th></tr>";
        getData("alerts").forEach((a,i)=>{
            h+=`<tr><td>${i+1}</td><td>${a.vehicle}</td><td>${a.type}</td><td>${a.message}</td><td><span class='badge'>${a.status}</span></td></tr>`;
        });
        h+="</table>";
    }

    el("detailTitle").innerText=title;
    el("detailBox").innerHTML=h;
}

window.addEventListener("load",function(){
    seedData();

    loadDashboard();
    loadUsers();
    loadVehicles();
    fillVehicleDropdown();
    loadTracking();
    loadAlerts();

    if(el("userCount")){
        showDashboardSection("users");
    }
});