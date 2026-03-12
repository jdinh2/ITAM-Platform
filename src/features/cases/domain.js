// ─── src/features/cases/domain.js ────────────────────────────────────────────
// Case management domain constants, transition logic, and validation.
// Phase 1 extraction from ITAM.jsx.
//
// Pure constants (no theme dependency) are exported directly.
// Theme-dependent constants are exported via createCaseDomain(C).
// ─────────────────────────────────────────────────────────────────────────────

// ─── PURE CONSTANTS ──────────────────────────────────────────────────────────
export const CLOSED_CASE_STATUSES=["completed","closed","canceled","rejected"];

export const CASE_TRANSITIONS={
  refresh:{
    new:                 ["contacted"],
    contacted:           ["appointment_pending"],
    appointment_pending: ["appointment_booked"],
    appointment_booked:  ["label_created"],
    label_created:       ["device_issued"],
    device_issued:       ["provisioning"],
    provisioning:        ["shipped"],
    shipped:             ["appointment_complete"],
    appointment_complete:["awaiting_return"],
    awaiting_return:     ["returned"],
    returned:            ["completed"],
    completed:           ["closed"],
  },
  offboarding:{new:["label_sent"],label_sent:["awaiting_movement","followup_1_sent","resolved"],awaiting_movement:["followup_1_sent","resolved"],followup_1_sent:["followup_2_sent","resolved"],followup_2_sent:["needs_review","resolved"],needs_review:["investigating","escalated","resolved"],investigating:["label_sent","escalated","resolved"],secondary_followup_1:["secondary_followup_2","escalated","resolved"],secondary_followup_2:["escalated","resolved"],escalated:["resolved"],resolved:["closed"]},
  break_fix:{new:["ticket_submitted"],ticket_submitted:["vendor_review"],vendor_review:["repair_approved"],repair_approved:["repair_in_progress"],repair_in_progress:["device_returned","replacement_issued"],device_returned:["closed"],replacement_issued:["closed"]},
  return_case:{new:["label_sent"],label_sent:["in_transit"],in_transit:["received"],received:["inspecting","closed"],inspecting:["staged_for_lfs","closed"],staged_for_lfs:["closed"]},
  onboarding:{new:["pending_scheduling"],pending_scheduling:["scheduled"],scheduled:["in_progress"],in_progress:["completed"]},
  procurement_exception:{new:["pending_approval"],pending_approval:["approved","rejected"],approved:["ordered"],ordered:["received"],received:["closed"]},
};

// ─── THEME-DEPENDENT FACTORY ─────────────────────────────────────────────────
export function createCaseDomain(C){
  const CASE_TYPES={
    onboarding:{l:"Onboarding",icon:"\u2795",c:C.green,bg:C.greenSoft,bd:C.greenBorder,statuses:["new","pending_scheduling","scheduled","in_progress","completed","canceled"],fields:["userId","locationId","neededDate","notes"]},
    offboarding:{l:"Offboarding",icon:"\u2796",c:C.red,bg:C.redSoft,bd:C.redBorder,statuses:["new","label_sent","awaiting_movement","followup_1_sent","followup_2_sent","needs_review","investigating","secondary_followup_1","secondary_followup_2","escalated","resolved","closed"],fields:["userId","assetId","locationId","returnDueDate","notes"]},
    refresh:{l:"Refresh",icon:"\u21BB",c:C.cyan,bg:C.cyanSoft,bd:C.cyanBorder,statuses:["new","contacted","appointment_pending","appointment_booked","label_created","device_issued","provisioning","shipped","appointment_complete","awaiting_return","returned","completed","closed","canceled"],fields:["userId","assetId","replacementId","tech","appointmentDate","locationId","shipmentCarrier","shipmentStatus","appointmentStatus","returnFollowUpStatus","notes"]},
    break_fix:{l:"Break-Fix",icon:"\u2692",c:C.orange,bg:C.orangeSoft,bd:C.orangeBorder,statuses:["new","ticket_submitted","vendor_review","repair_approved","repair_in_progress","device_returned","closed","replacement_issued"],fields:["userId","assetId","tech","vendorCaseNum","issueDescription","notes"]},
    return_case:{l:"Return",icon:"\u21A9",c:C.amber,bg:C.amberSoft,bd:C.amberBorder,statuses:["new","label_sent","in_transit","received","inspecting","staged_for_lfs","closed"],fields:["userId","assetId","returnReason","tech","trackingNumber","notes"]},
    procurement_exception:{l:"Procurement Exception",icon:"\u2295",c:C.purple,bg:C.purpleSoft,bd:C.purpleBorder,statuses:["new","pending_approval","approved","ordered","received","closed","rejected"],fields:["userId","locationId","requestedItems","justification","linkedProcurementId","notes"]},
  };

  const CASE_STATUS={new:{l:"New",c:C.gray,bg:C.graySoft,bd:C.grayBorder},pending_scheduling:{l:"Pending Scheduling",c:C.gray,bg:C.graySoft,bd:C.grayBorder},scheduled:{l:"Scheduled",c:C.cyan,bg:C.cyanSoft,bd:C.cyanBorder},in_progress:{l:"In Progress",c:C.accent,bg:C.accentSoft,bd:C.accentBorder},completed:{l:"Completed",c:C.green,bg:C.greenSoft,bd:C.greenBorder},canceled:{l:"Canceled",c:C.gray,bg:C.graySoft,bd:C.grayBorder},
    contacted:          {l:"Contacted",           c:C.cyan,   bg:C.cyanSoft,   bd:C.cyanBorder},
    appointment_pending:{l:"Appt Pending",         c:C.amber,  bg:C.amberSoft,  bd:C.amberBorder},
    appointment_booked: {l:"Appt Booked",          c:C.cyan,   bg:C.cyanSoft,   bd:C.cyanBorder},
    label_created:      {l:"Label Created",        c:C.purple, bg:C.purpleSoft, bd:C.purpleBorder},
    device_issued:      {l:"Device Issued",        c:C.orange, bg:C.orangeSoft, bd:C.orangeBorder},
    provisioning:       {l:"Provisioning",         c:C.orange, bg:C.orangeSoft, bd:C.orangeBorder},
    shipped:            {l:"Shipped",              c:C.accent, bg:C.accentSoft, bd:C.accentBorder},
    appointment_complete:{l:"Appt Complete",       c:C.green,  bg:C.greenSoft,  bd:C.greenBorder},
    awaiting_return:    {l:"Awaiting Return",      c:C.red,    bg:C.redSoft,    bd:C.redBorder},
    returned:           {l:"Returned",             c:C.cyan,   bg:C.cyanSoft,   bd:C.cyanBorder},
    logged:{l:"Logged",c:C.cyan,bg:C.cyanSoft,bd:C.cyanBorder},email_1_sent:{l:"Email 1 Sent",c:C.accent,bg:C.accentSoft,bd:C.accentBorder},followup_1_sent:{l:"Follow-Up 1",c:C.amber,bg:C.amberSoft,bd:C.amberBorder},followup_2_sent:{l:"Follow-Up 2",c:C.orange,bg:C.orangeSoft,bd:C.orangeBorder},resolved:{l:"Resolved",c:C.green,bg:C.greenSoft,bd:C.greenBorder},
    label_sent:{l:"Label Sent",c:C.cyan,bg:C.cyanSoft,bd:C.cyanBorder},follow_up:{l:"Follow-Up",c:C.red,bg:C.redSoft,bd:C.redBorder},device_received:{l:"Device Received",c:C.green,bg:C.greenSoft,bd:C.greenBorder},
    escalated:{l:"Escalated",c:C.red,bg:C.redSoft,bd:C.redBorder},pending_contact:{l:"Pending Contact",c:C.gray,bg:C.graySoft,bd:C.grayBorder},reserved:{l:"Reserved",c:C.purple,bg:C.purpleSoft,bd:C.purpleBorder},provisioned:{l:"Provisioned",c:C.orange,bg:C.orangeSoft,bd:C.orangeBorder},deployed:{l:"Deployed",c:C.green,bg:C.greenSoft,bd:C.greenBorder},return_pending:{l:"Return Pending",c:C.red,bg:C.redSoft,bd:C.redBorder},return_received:{l:"Return Received",c:C.cyan,bg:C.cyanSoft,bd:C.cyanBorder},closed:{l:"Closed",c:C.green,bg:C.greenSoft,bd:C.greenBorder},ticket_submitted:{l:"Ticket Submitted",c:C.gray,bg:C.graySoft,bd:C.grayBorder},vendor_review:{l:"Vendor Review",c:C.amber,bg:C.amberSoft,bd:C.amberBorder},repair_approved:{l:"Repair Approved",c:C.cyan,bg:C.cyanSoft,bd:C.cyanBorder},repair_in_progress:{l:"Repair In Progress",c:C.orange,bg:C.orangeSoft,bd:C.orangeBorder},device_returned:{l:"Device Returned",c:C.green,bg:C.greenSoft,bd:C.greenBorder},replacement_issued:{l:"Replacement Issued",c:C.accent,bg:C.accentSoft,bd:C.accentBorder},in_transit:{l:"In Transit",c:C.orange,bg:C.orangeSoft,bd:C.orangeBorder},received:{l:"Received",c:C.green,bg:C.greenSoft,bd:C.greenBorder},inspecting:{l:"Inspecting",c:C.amber,bg:C.amberSoft,bd:C.amberBorder},staged_for_lfs:{l:"Staged for LFS",c:C.purple,bg:C.purpleSoft,bd:C.purpleBorder},pending_approval:{l:"Pending Approval",c:C.amber,bg:C.amberSoft,bd:C.amberBorder},approved:{l:"Approved",c:C.green,bg:C.greenSoft,bd:C.greenBorder},ordered:{l:"Ordered",c:C.accent,bg:C.accentSoft,bd:C.accentBorder},rejected:{l:"Rejected",c:C.red,bg:C.redSoft,bd:C.redBorder}};

  const isAllowedTransition=(cs,newStatus)=>{
    if(newStatus==="canceled"&&!CLOSED_CASE_STATUSES.includes(cs.status))return true;
    const allowed=CASE_TRANSITIONS[cs.type]?.[cs.status]||[];
    return allowed.includes(newStatus);
  };

  const transitionValidation=(cs,newStatus,extraFields={})=>{
    if(!isAllowedTransition(cs,newStatus))return `Invalid transition for ${CASE_TYPES[cs.type]?.l||cs.type}: ${CASE_STATUS[cs.status]?.l||cs.status} -> ${CASE_STATUS[newStatus]?.l||newStatus}`;
    const merged={...cs,...extraFields};
    if(cs.type==="refresh"&&newStatus==="label_created"&&!String(merged.replacementId||"").trim())return "Replacement asset required before creating label";
    if(cs.type==="refresh"&&newStatus==="shipped"&&!String(merged.outboundShipment?.trackingNumber||merged.shipmentId||"").trim())return "Outbound tracking # required";
    if(cs.type==="refresh"&&newStatus==="awaiting_return"&&!String(merged.returnShipment?.trackingNumber||"").trim())return "Return label required before marking awaiting return";
    if(cs.type==="refresh"&&newStatus==="appointment_booked"&&!String(merged.appointmentDate||"").trim())return "Appointment date required";
    if(cs.type==="refresh"&&newStatus==="reserved"&&!String(merged.replacementId||"").trim())return "Replacement asset required";
    if(cs.type==="refresh"&&newStatus==="shipped"&&!String(merged.shipmentId||"").trim())return "Tracking # required";
    if(cs.type==="offboarding"&&newStatus==="label_sent"&&!String(merged.shipmentId||"").trim())return "Tracking # required";
    if(cs.type==="break_fix"&&newStatus==="vendor_review"&&!String(merged.ticketId||"").trim())return "Vendor ticket # required";
    return null;
  };

  return { CASE_TYPES, CASE_STATUS, isAllowedTransition, transitionValidation };
}
