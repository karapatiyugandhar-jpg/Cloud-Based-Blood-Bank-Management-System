const express=require("express");
const path=require("path");
const app=express();
const PORT=process.env.PORT||5000;

app.use(express.json());
app.use(express.static(path.join(__dirname,"public")));

let donors=[
 {id:1,name:"Ravi Kumar",blood:"O+",city:"Chennai",lastDonation:"2026-07-12",status:"Available"},
 {id:2,name:"Anitha Devi",blood:"A+",city:"Chennai",lastDonation:"2026-08-05",status:"Available"},
 {id:3,name:"Suresh B",blood:"B-",city:"Vellore",lastDonation:"2026-06-20",status:"Available"}
];

let requests=[
 {id:1,patient:"Arun",blood:"O+",units:2,hospital:"City Care Hospital",status:"Pending"},
 {id:2,patient:"Meena",blood:"A+",units:1,hospital:"Apollo Clinic",status:"Fulfilled"}
];

let inventory=[
 {blood:"A+",units:24},
 {blood:"A-",units:8},
 {blood:"B+",units:18},
 {blood:"B-",units:6},
 {blood:"AB+",units:10},
 {blood:"AB-",units:4},
 {blood:"O+",units:30},
 {blood:"O-",units:7}
];

app.get("/api/dashboard",(req,res)=>{
 res.json({
  donors:donors.length,
  requests:requests.filter(r=>r.status==="Pending").length,
  availableUnits:inventory.reduce((sum,x)=>sum+x.units,0),
  bloodGroups:inventory.length
 });
});

app.get("/api/donors",(req,res)=>res.json(donors));

app.post("/api/donors",(req,res)=>{
 const {name,blood,city,lastDonation}=req.body;
 if(!name||!blood||!city||!lastDonation)return res.status(400).json({error:"All fields are required"});
 const donor={id:Date.now(),name,blood,city,lastDonation,status:"Available"};
 donors.push(donor);
 res.status(201).json(donor);
});

app.delete("/api/donors/:id",(req,res)=>{
 donors=donors.filter(d=>d.id!==Number(req.params.id));
 res.json({success:true});
});

app.get("/api/requests",(req,res)=>res.json(requests));

app.post("/api/requests",(req,res)=>{
 const {patient,blood,units,hospital}=req.body;
 if(!patient||!blood||!units||!hospital)return res.status(400).json({error:"All fields are required"});
 const request={id:Date.now(),patient,blood,units:Number(units),hospital,status:"Pending"};
 requests.push(request);
 res.status(201).json(request);
});

app.patch("/api/requests/:id",(req,res)=>{
 const r=requests.find(x=>x.id===Number(req.params.id));
 if(!r)return res.status(404).json({error:"Request not found"});
 r.status=r.status==="Pending"?"Fulfilled":"Pending";
 res.json(r);
});

app.get("/api/inventory",(req,res)=>res.json(inventory));

app.get("*",(req,res)=>res.sendFile(path.join(__dirname,"public","index.html")));

app.listen(PORT,()=>console.log(`Blood Bank Management System running on http://localhost:${PORT}`));