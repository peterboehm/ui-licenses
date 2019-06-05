const Docs = require('./docs');

const DOCS = [{
  name: 'Supplementary document 1',
  category: '',
  note: 'Signed and filed',
  location: 'Filing Cabinet',
  url: 'http://licenses.com/sd1'
}, {
  name: 'Supplementary document 2',
  category: 'Product data sheet',
  url: 'http://licenses.com/sd2'
}];

const EDITED_DOC = {
  docToEdit: DOCS[0].name,
  name: 'Supplementary document 1 v2',
  category: 'Vendor terms and conditions',
  note: 'Need to sign',
  location: 'Printer Tray',
  url: 'http://licenses.com/sd1_v2'
};

const DELETED_DOC = DOCS[1].name;

const DOCS_FIELD_NAME = 'supplementaryDocs';

module.exports.test = (uiTestCtx) => {
  Docs.test(
    uiTestCtx,
    {
      docs: DOCS,
      editedDoc: EDITED_DOC,
      deletedDoc: DELETED_DOC,
      docsFieldName: DOCS_FIELD_NAME,
    },
  );
};
