// ─── src/features/cases/shipping.js ──────────────────────────────────────────
// Pure shipping data model, null objects, builders, and enums.
// No React, no theme (C), no component-local state.
// Phase 1 extraction from ITAM.jsx.
// ─────────────────────────────────────────────────────────────────────────────

export const NULL_SHIP_LEG={
  carrier:"FedEx",
  trackingNumber:"",
  labelId:"",
  labelStatus:"none",
  createdAt:"",
  serviceType:"FEDEX_GROUND",
};
export const NULL_SHIP_ADDRESS={
  recipientName:"",
  company:"",
  line1:"",
  line2:"",
  city:"",
  state:"",
  postalCode:"",
  country:"US",
  residential:true,
};
export const NULL_SHIPPING={
  address:{...NULL_SHIP_ADDRESS},
  outbound:{...NULL_SHIP_LEG},
  return:{...NULL_SHIP_LEG},
};

export const getTracking=(rec)=>{
  if(!rec)return "";
  return rec.shipping?.outbound?.trackingNumber
    || rec.shipping?.return?.trackingNumber
    || rec.track
    || "";
};
export const getShipAddress=(rec)=>{
  if(!rec)return "";
  const a=rec.shipping?.address;
  if(a?.line1){
    const parts=[a.line1,a.line2,a.city&&a.state?`${a.city}, ${a.state} ${a.postalCode}`.trim():a.city||a.state].filter(Boolean);
    return parts.join(", ");
  }
  return rec.shipAddr||"";
};

export const mkAddress=(line1,city,state,postalCode,recipientName="",residential=true)=>({
  ...NULL_SHIP_ADDRESS,
  recipientName,line1,city,state,postalCode,residential,
});
export const mkShipLeg=(trackingNumber,labelStatus="created",carrier="FedEx",serviceType="FEDEX_GROUND")=>({
  ...NULL_SHIP_LEG,
  trackingNumber,labelStatus,carrier,serviceType,
});

export const SHIP_STAT={not_ready:{l:"Not Ready"},ready_to_ship:{l:"Ready to Ship"},shipped:{l:"Shipped"}};
export const APPT_STAT={not_scheduled:{l:"Not Scheduled"},scheduled:{l:"Scheduled"},completed:{l:"Completed"}};
export const RETURN_FOLLOW_UP={not_started:{l:"Not Started"},pending:{l:"Pending"},follow_up:{l:"Follow-Up"}};
export const INTAKE_COND={good:{l:"Good"},fair:{l:"Fair"},damaged:{l:"Damaged"}};
export const INTAKE_DISP={inventory:{l:"Return to Inventory"},repair:{l:"Send to Repair"},retired:{l:"Retire"}};

export const LABEL_SERVICE_TYPES=["FEDEX_GROUND","FEDEX_2_DAY","PRIORITY_OVERNIGHT","STANDARD_OVERNIGHT","FEDEX_EXPRESS_SAVER"];

export const NULL_SHIPMENT={
  labelStatus:"none",
  trackingNumber:"",
  labelDocument:"",
  serviceType:"FEDEX_GROUND",
  carrier:"FedEx",
  createdAt:"",
  createdBy:"",
  voidedAt:"",
  voidedBy:"",
  recipientName:"",
  recipientAddress:"",
  shipFromAddress:"Charlotte, NC (PTC)",
  weight:"",
  masterTrackingNumber:"",
};

export const mockTrackingNumber=()=>`794${Array.from({length:15},()=>Math.floor(Math.random()*10)).join("")}`;
