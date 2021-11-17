var ryr=document.getElementById("returnyr");
var rytd=document.getElementById("returnytd");
var vw=document.getElementById("volwk");
var vm=document.getElementById("volmonth");
if(ryr)var x=Number(ryr.textContent);
if(rytd)var y=Number(rytd.textContent);
if(vw)var p=Number(vw.textContent);
if(vm)var q=Number(vm.textContent);
if(p/1000000>1){
    p=p/1000000;
    p=p.toFixed(2);
    console.log(typeof(p));
    vw.textContent=p+"M";
}
else if(p/1000>1){
    p=p/1000;
    p=p.toFixed(2);
    vw.textContent=p+"K";
}
if(q/1000000>1){
    q=q/1000000;
    q=q.toFixed(2);
    vm.textContent=q+"M";
}
else if(q/1000>1){
    q=q/1000;
    q.toFixed(2);
    vm.textContent=q+"K";
}
if(x<0){
    ryr.style.color="red";
    
}
else if(x>0){
    ryr.style.color="green";
}
if(y<0){
    rytd.style.color="red";
    
}
else if(y>0){
    rytd.style.color="green";
}

