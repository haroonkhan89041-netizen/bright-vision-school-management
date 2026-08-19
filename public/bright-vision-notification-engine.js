(function(){
  const SCHOOL="Bright Vision English School";
  const WATCH={
    bv_students:{label:"Student",subject:"Student record"},
    bv_teachers:{label:"Teacher",subject:"Teacher record"},
    bv_classes:{label:"Class",subject:"Class record"},
    bv_subjects:{label:"Subject",subject:"Subject record"},
    bv_fees:{label:"Fee",subject:"Fee record"},
    bv_exams:{label:"Exam",subject:"Exam record"},
    bv_notices:{label:"Notice",subject:"Notice"}
  };
  const oldSet=Storage.prototype.setItem;
  function safeRead(key, fallback){try{return JSON.parse(oldGet.call(localStorage,key))||fallback}catch{return fallback}}
  const oldGet=Storage.prototype.getItem;
  function alertQueue(item){
    try{
      const raw=oldGet.call(localStorage,"bv_alerts");
      const queue=raw?JSON.parse(raw):[];
      const next=[...queue,item].slice(-300);
      oldSet.call(localStorage,"bv_alerts",JSON.stringify(next));
      window.dispatchEvent(new CustomEvent("bv:notification",{detail:item}));
      if("Notification" in window && Notification.permission==="granted") new Notification(SCHOOL,{body:item.message});
    }catch(e){}
  }
  function newRecord(key,record){
    if(!record||!WATCH[key]) return;
    const cfg=WATCH[key];
    const name=record.name||record.student||record.title||record.className||record.subject||"New record";
    let message="";
    if(key==="bv_students") message=`Dear Parent/Guardian, ${name} has been successfully added to ${SCHOOL}. Student ID: ${record.studentId||"pending"}. Please contact the school office if you need any information.`;
    else if(key==="bv_fees") message=`Dear Parent/Guardian, a fee record for ${name} has been created by ${SCHOOL}. Amount: PKR ${Number(record.amount||0).toLocaleString()}. Please check with the school office for payment details.`;
    else if(key==="bv_notices") message=`${SCHOOL}: A new school notice has been published: ${name}. Please check the school communication channel for details.`;
    else message=`${SCHOOL}: Your ${cfg.label.toLowerCase()} record has been successfully added/updated. ${name}.`;
    alertQueue({id:Date.now()+Math.random(),student:name,type:`${cfg.subject} Added`,channel:"WhatsApp / SMS",sender:SCHOOL,date:new Date().toISOString().slice(0,10),status:"queued",message,parentPhone:record.parentPhone||record.phone||""});
  }
  Storage.prototype.setItem=function(key,value){
    let before=[];
    if(WATCH[key]){try{const raw=oldGet.call(this,key);before=raw?JSON.parse(raw):[]}catch(e){}}
    oldSet.call(this,key,value);
    if(!WATCH[key]) return;
    try{
      const after=JSON.parse(value)||[];
      const oldIds=new Set(before.map(x=>x&&x.id));
      const added=after.filter(x=>x&&(!oldIds.has(x.id)));
      added.forEach(x=>newRecord(key,x));
      if(key==="bv_fees"){
        after.forEach(x=>{const old=before.find(v=>v&&v.id===x.id);if(old&&String(x.status).toLowerCase()==="paid"&&String(old.status).toLowerCase()!=="paid") alertQueue({id:Date.now()+Math.random(),student:x.student||"Student",type:"Fee Payment Confirmation",channel:"WhatsApp / SMS",sender:SCHOOL,date:new Date().toISOString().slice(0,10),status:"queued",message:`Dear Parent/Guardian, ${SCHOOL} confirms that the fee payment for ${x.student||"your child"} has been recorded. Receipt: ${x.receiptNo||x.invoice||"available in school office"}.`,parentPhone:x.parentPhone||x.phone||""})});
      }
    }catch(e){}
  };
  window.BrightVisionNotifications={school:SCHOOL,requestPermission:function(){if("Notification" in window&&Notification.permission==="default")Notification.requestPermission();}};
})();
