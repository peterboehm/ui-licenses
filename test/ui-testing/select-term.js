const Term = require('./term');

module.exports.test = (uiTestCtx) => {
  Term.test(
    uiTestCtx,
    {
      name: 'authIP',
      label: 'IP authentication supported?',
      value: 'No',
      editedValue: 'Yes',
    },
  );
};
