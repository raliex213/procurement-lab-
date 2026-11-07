'use strict';
// Synthetic example of an older catalogue/briefing export. No user data is read.
module.exports = function legacyRun(L) {
  const state = L.newRun(1701);
  state.mode = 'shortage';
  L.contactRepresentative(state, 'atelier');
  const request = L.createPR(state, [{item: 'tee', variant: 'Black', qty: 50, needBy: 15}], 'Synthetic legacy compatibility check');
  L.approvePR(state, request.id);
  L.award(state, request.id, 0, 'atelier');
  L.createPOs(state, request.id);
  const order = state.pos[0];
  L.advance(state, order.arrival - state.day);
  L.receive(state, order.id);
  const consultation = L.consultSupplier(state, order.id);
  L.advance(state, consultation.responds - state.day);
  delete state.catalogueVersion;
  delete state.stock.atelier.press;
  for (const briefing of state.briefings) delete briefing.conversation;
  for (const enquiry of state.consultations) {
    delete enquiry.behaviourVersion;
    delete enquiry.reply;
    for (const option of enquiry.options) {
      for (const field of ['supplierStatement', 'execution', 'evidence', 'limitation']) delete option[field];
    }
  }
  return JSON.parse(JSON.stringify(state));
};
