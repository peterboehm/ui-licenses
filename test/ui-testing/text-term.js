const Term = require('./term');

module.exports.test = (uiTestCtx) => {
  Term.test(
    uiTestCtx,
    {
      name: 'otherRestrictions',
      label: 'Other restrictions',
      value: 'A Few',
      editedValue: 'A Lot',
    },
  );
};
