// ─── src/features/cases/actions.js ───────────────────────────────────────────
// Phase 2 extraction: stateful case action helpers.
//
// Pattern: dependency injection via createCaseActions(deps).
// All React state setters and domain constants are passed in — this module
// has no direct import of React and no closure over component-local variables.
//
// Pure helpers (buildRefreshExecutionFields, buildReturnIntakeFields,
// isReturnIntakeCase, canProcessReturnReceived, canCompleteReturnIntake)
// are exported directly — they have zero stateful dependencies.
// ─────────────────────────────────────────────────────────────────────────────

import { INTAKE_COND, INTAKE_DISP } from "./shipping.js";

// ─── PURE HELPERS (no deps, exported directly) ──────────────────────────────

export const buildRefreshExecutionFields=(source)=>({
  shipmentId:source.shipmentId||"",
  shipmentCarrier:source.shipmentCarrier||"",
  shipmentStatus:source.shipmentStatus||"not_ready",
  appointmentDate:source.appointmentDate||"",
  appointmentStatus:source.appointmentStatus||"not_scheduled",
  returnExpected:Boolean(source.returnExpected),
  returnFollowUpStatus:source.returnFollowUpStatus||"not_started"
});

export const buildReturnIntakeFields=(source)=>({
  returnReceivedDate:source.returnReceivedDate||"",
  intakeCondition:source.intakeCondition||"good",
  intakeNotes:source.intakeNotes||"",
  intakeDisposition:source.intakeDisposition||"inventory"
});

export const isReturnIntakeCase=(cs)=>cs&&(cs.type==="refresh"||cs.type==="return_case");

export const canProcessReturnReceived=(cs)=>cs&&((cs.type==="refresh"&&["awaiting_return","return_pending"].includes(cs.status))||(cs.type==="return_case"&&cs.status==="in_transit"));

export const canCompleteReturnIntake=(cs)=>cs&&((cs.type==="refresh"&&["returned","return_received"].includes(cs.status))||(cs.type==="return_case"&&["received","inspecting","staged_for_lfs"].includes(cs.status)));

// ─── STATEFUL FACTORY ────────────────────────────────────────────────────────
//
// deps = {
//   cases,                    — current cases array (read)
//   setCases,                 — React state setter
//   setToast,                 — toast notification setter
//   onCaseTransition,         — optional lifecycle callback
//   onUpdateAsset,            — asset mutation callback
//   refreshExecDraft,         — current refresh execution draft (read)
//   setRefreshExecDraft,      — setter for refresh exec draft
//   returnIntakeDraft,        — current return intake draft (read)
//   setReturnIntakeDraft,     — setter for return intake draft
//   // Domain layer (from Phase 1 or module-level)
//   transitionValidation,     — from createCaseDomain(C)
//   isAllowedTransition,      — from createCaseDomain(C)
//   CASE_STATUS,              — from createCaseDomain(C)
//   CASE_TYPES,               — from createCaseDomain(C)
//   // Module-level utilities
//   addEvent,                 — append history event to case
//   mockShipment,             — mock FedEx shipment builder
//   toLocalTimestamp,         — timestamp formatter
//   toLocalISODate,           — date formatter
//   createAssetActivityEntry, — asset activity log builder
//   REFRESH_EMAIL_TEMPLATES,  — email template registry
// }

export function createCaseActions(deps){
  const {
    cases, setCases, setToast, onCaseTransition, onUpdateAsset,
    refreshExecDraft, setRefreshExecDraft,
    returnIntakeDraft, setReturnIntakeDraft,
    transitionValidation, isAllowedTransition, CASE_STATUS, CASE_TYPES,
    addEvent, mockShipment, toLocalTimestamp, toLocalISODate,
    createAssetActivityEntry, REFRESH_EMAIL_TEMPLATES,
  }=deps;

  // ── Core transition engine ────────────────────────────────────────────────

  const caseActionDetailed=(csId,newStatus,extraFields,validationMsg,eventDetail)=>{
    const cs=cases.find(c=>c.id===csId);
    if(!cs)return;
    const err=validationMsg||transitionValidation(cs,newStatus,extraFields||{});
    if(err){setToast(err);return;}
    setCases(prev=>prev.map(c=>c.id===csId?addEvent({...c,status:newStatus,...(extraFields||{})},"status_change","Current User",eventDetail||`${CASE_STATUS[c.status]?.l} -> ${CASE_STATUS[newStatus]?.l}`):c));
    if(onCaseTransition)onCaseTransition({caseId:csId,type:cs.type,from:cs.status,to:newStatus,caseData:{...cs,...(extraFields||{}),status:newStatus}});
    setToast(`${csId}: ${CASE_STATUS[newStatus]?.l}`);
  };

  const caseAction=(csId,newStatus,extraFields,validationMsg)=>{
    caseActionDetailed(csId,newStatus,extraFields,validationMsg);
  };

  const caseUpdate=(csId,fields,eventDetail)=>{
    setCases(prev=>prev.map(c=>c.id===csId?addEvent({...c,...fields},"update","Current User",eventDetail):c));
    setToast(`${csId} updated`);
  };

  // ── Refresh execution helpers ─────────────────────────────────────────────

  const saveRefreshExecution=(cs,fields,eventDetail)=>{
    const nextFields=buildRefreshExecutionFields(fields);
    const currentFields=buildRefreshExecutionFields(cs);
    const changed=Object.keys(nextFields).some(key=>nextFields[key]!==currentFields[key]);
    if(!changed){setToast(`No execution updates for ${cs.id}`);return;}
    setCases(prev=>prev.map(c=>c.id===cs.id?addEvent({...c,...nextFields},"update","Current User",eventDetail):c));
    setRefreshExecDraft(nextFields);
    setToast(`${cs.id} updated`);
  };

  const markRefreshReadyToShip=(cs)=>{
    if(!cs.replacementId){setToast("Replacement asset required before shipment prep.");return;}
    const updates={...buildRefreshExecutionFields(refreshExecDraft),shipmentStatus:"ready_to_ship"};
    if(cs.status==="device_issued")caseActionDetailed(cs.id,"provisioning",updates,null,"Device marked ready to ship — provisioning in progress");
    else saveRefreshExecution(cs,updates,"Shipment prep updated");
  };

  const markRefreshShipped=(cs)=>{
    const tracking=(refreshExecDraft.shipmentId||cs.shipmentId||"").trim();
    if(!tracking){setToast("Tracking # required.");return;}
    const updates={...buildRefreshExecutionFields(refreshExecDraft),shipmentId:tracking,shipmentStatus:"shipped"};
    if(cs.status==="provisioning")caseActionDetailed(cs.id,"shipped",updates,null,`Shipment sent${updates.shipmentCarrier?` via ${updates.shipmentCarrier}`:""}`);
    else saveRefreshExecution(cs,updates,`Shipment sent${updates.shipmentCarrier?` via ${updates.shipmentCarrier}`:""}`);
  };

  const scheduleRefreshAppointment=(cs)=>{
    const appointmentAt=(refreshExecDraft.appointmentDate||cs.appointmentDate||"").trim();
    if(!appointmentAt){setToast("Appointment date/time required.");return;}
    const updates={...buildRefreshExecutionFields(refreshExecDraft),appointmentDate:appointmentAt,appointmentStatus:"scheduled"};
    if(["contacted","appointment_pending"].includes(cs.status))caseActionDetailed(cs.id,"appointment_pending",updates,null,`Refresh appointment recorded for ${appointmentAt}`);
    else saveRefreshExecution(cs,updates,`Refresh appointment recorded for ${appointmentAt}`);
  };

  const markRefreshAppointmentComplete=(cs)=>{
    const updates={...buildRefreshExecutionFields(refreshExecDraft),appointmentStatus:"completed"};
    if(cs.status==="shipped")caseActionDetailed(cs.id,"appointment_complete",updates,null,"Refresh appointment completed — device handed off");
    else saveRefreshExecution(cs,updates,"Refresh appointment marked complete");
  };

  const markRefreshReturnPending=(cs)=>{
    const updates={...buildRefreshExecutionFields(refreshExecDraft),returnExpected:true,returnFollowUpStatus:"pending"};
    if(cs.status==="appointment_complete")caseActionDetailed(cs.id,"awaiting_return",updates,null,"Awaiting return of old device — return label sent");
    else saveRefreshExecution(cs,updates,"Awaiting return of old device");
  };

  // ── Label actions (mock → FedEx API later) ────────────────────────────────

  const createOutboundLabel=(cs)=>{
    if(!cs.replacementId){setToast("Replacement asset required before creating outbound label.");return;}
    const shipment=mockShipment("outbound",cs);
    setCases(prev=>prev.map(c=>c.id!==cs.id?c:addEvent({...c,outboundShipment:shipment,shipmentId:shipment.trackingNumber,shipmentStatus:"shipped"},"shipment","Current User",`Outbound label created · ${shipment.trackingNumber} · ${cs.replacementId} → ${shipment.recipientAddress}`)));
    setToast(`Outbound label created: ${shipment.trackingNumber}`);
  };

  const createReturnLabel=(cs)=>{
    if(!cs.assetId){setToast("Original asset ID required before creating return label.");return;}
    const shipment=mockShipment("return",cs);
    setCases(prev=>prev.map(c=>c.id!==cs.id?c:addEvent({...c,returnShipment:shipment,returnExpected:true,returnFollowUpStatus:"pending"},"shipment","Current User",`Return label created · ${shipment.trackingNumber} · ${cs.assetId} → Warehouse`)));
    setToast(`Return label created: ${shipment.trackingNumber}`);
  };

  const voidOutboundLabel=(cs)=>{
    if(!cs.outboundShipment?.trackingNumber){setToast("No outbound label to void.");return;}
    const voided={...cs.outboundShipment,labelStatus:"voided",voidedAt:toLocalTimestamp(),voidedBy:"Current User"};
    setCases(prev=>prev.map(c=>c.id!==cs.id?c:addEvent({...c,outboundShipment:voided,shipmentStatus:"not_ready"},"update","Current User",`Outbound label voided · ${voided.trackingNumber}`)));
    setToast(`Outbound label voided: ${voided.trackingNumber}`);
  };

  const voidReturnLabel=(cs)=>{
    if(!cs.returnShipment?.trackingNumber){setToast("No return label to void.");return;}
    const voided={...cs.returnShipment,labelStatus:"voided",voidedAt:toLocalTimestamp(),voidedBy:"Current User"};
    setCases(prev=>prev.map(c=>c.id!==cs.id?c:addEvent({...c,returnShipment:voided},"update","Current User",`Return label voided · ${voided.trackingNumber}`)));
    setToast(`Return label voided: ${voided.trackingNumber}`);
  };

  // ── Return intake helpers ─────────────────────────────────────────────────

  const saveReturnIntakeFields=(cs,intake,eventDetail)=>{
    const nextFields=buildReturnIntakeFields(intake);
    const currentFields=buildReturnIntakeFields(cs);
    const changed=Object.keys(nextFields).some(key=>nextFields[key]!==currentFields[key]);
    if(!changed){setToast(`No return intake updates for ${cs.id}`);return;}
    setCases(prev=>prev.map(c=>c.id===cs.id?addEvent({...c,...nextFields},"update","Current User",eventDetail):c));
    setReturnIntakeDraft(nextFields);
    setToast(`${cs.id} updated`);
  };

  const applyReturnAssetDispositionClean=(assetTag,disposition,caseId,intake)=>{
    if(!assetTag||!onUpdateAsset)return;
    const receivedDate=intake.returnReceivedDate||toLocalISODate();
    const conditionLabel=INTAKE_COND[intake.intakeCondition]?.l||intake.intakeCondition;
    const detailParts=[`Received ${receivedDate}`,conditionLabel];
    if(intake.intakeNotes)detailParts.push(intake.intakeNotes);
    detailParts.push(`via ${caseId}`);
    const activityDetail=detailParts.join(" | ");
    if(disposition==="inventory"){
      onUpdateAsset(assetTag,asset=>({...asset,status:"inventory",reservation:null,user:"\u2014",dept:"\u2014"}),[createAssetActivityEntry({asset:assetTag,label:"Checked In to Inventory",detail:activityDetail,by:"Case Management"})]);
      return;
    }
    if(disposition==="repair"){
      onUpdateAsset(assetTag,asset=>({...asset,status:"repair",reservation:null}),[createAssetActivityEntry({asset:assetTag,label:"Sent to Repair",detail:activityDetail,by:"Case Management"})]);
      return;
    }
    onUpdateAsset(assetTag,asset=>({...asset,status:"retired",reservation:null,user:"\u2014",dept:"\u2014"}),[createAssetActivityEntry({asset:assetTag,label:"Retired After Return",detail:activityDetail,by:"Case Management"})]);
  };

  const markCaseReturnReceived=(cs)=>{
    if(!isReturnIntakeCase(cs)){setToast("Return intake is not available for this case.");return;}
    const intake={...buildReturnIntakeFields(returnIntakeDraft),returnReceivedDate:returnIntakeDraft.returnReceivedDate||toLocalISODate()};
    if(cs.type==="refresh"){
      if(!["awaiting_return","return_pending"].includes(cs.status)){saveReturnIntakeFields(cs,intake,`Returned asset received on ${intake.returnReceivedDate}`);return;}
      caseActionDetailed(cs.id,"returned",intake,null,`Returned asset received on ${intake.returnReceivedDate}`);
      return;
    }
    if(cs.type==="return_case"){
      if(cs.status==="in_transit")caseActionDetailed(cs.id,"received",intake,null,`Returned asset received on ${intake.returnReceivedDate}`);
      else saveReturnIntakeFields(cs,intake,`Returned asset received on ${intake.returnReceivedDate}`);
    }
  };

  const completeReturnIntake=(cs,disposition)=>{
    if(!isReturnIntakeCase(cs)){setToast("Return intake is not available for this case.");return;}
    if(!canCompleteReturnIntake(cs)){setToast("Mark return received before completing intake disposition.");return;}
    const intake={...buildReturnIntakeFields(returnIntakeDraft),returnReceivedDate:returnIntakeDraft.returnReceivedDate||cs.returnReceivedDate||toLocalISODate(),intakeDisposition:disposition};
    applyReturnAssetDispositionClean(cs.assetId,disposition,cs.id,intake);
    caseActionDetailed(cs.id,"closed",intake,null,`${INTAKE_DISP[disposition]?.l||disposition} completed for returned asset`);
    setReturnIntakeDraft(intake);
  };

  // ── Email actions ─────────────────────────────────────────────────────────

  const sendRefreshEmail=(cs,templateKey)=>{
    const tmpl=REFRESH_EMAIL_TEMPLATES[templateKey];
    if(!tmpl){setToast("Email template not found.");return;}
    const {subject,body}=tmpl.build(cs);
    if(tmpl.advancesTo&&isAllowedTransition(cs,tmpl.advancesTo)){
      caseActionDetailed(cs.id,tmpl.advancesTo,{},"",`\u{1F4E7} ${tmpl.label} sent \u00B7 "${subject}"`);
    } else {
      setCases(prev=>prev.map(c=>c.id===cs.id?addEvent({...c},"email","Current User",`\u{1F4E7} ${tmpl.label} sent \u00B7 "${subject}"`):c));
      setToast(`${tmpl.label} sent for ${cs.id}`);
    }
    if(typeof console!=="undefined")console.info(`[REFRESH EMAIL] ${cs.id}\nSubject: ${subject}\n\n${body}`);
  };

  return {
    caseActionDetailed,
    caseAction,
    caseUpdate,
    saveRefreshExecution,
    markRefreshReadyToShip,
    markRefreshShipped,
    scheduleRefreshAppointment,
    markRefreshAppointmentComplete,
    markRefreshReturnPending,
    createOutboundLabel,
    createReturnLabel,
    voidOutboundLabel,
    voidReturnLabel,
    saveReturnIntakeFields,
    applyReturnAssetDispositionClean,
    markCaseReturnReceived,
    completeReturnIntake,
    sendRefreshEmail,
  };
}
