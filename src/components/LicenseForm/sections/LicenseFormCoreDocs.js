import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { FieldArray } from 'redux-form';

import { Accordion } from '@folio/stripes/components';

import { DocumentsFieldArray } from '@folio/stripes-erm-components';

class LicenseFormCoreDocs extends React.Component {
  static propTypes = {
    handlers: PropTypes.shape({
      onDeleteFile: PropTypes.func.isRequired,
      onDownloadFile: PropTypes.func.isRequired,
      onUploadFile: PropTypes.func.isRequired,
    }),
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
  };

  getDeleteFilePath = (file) => `/licenses/files/${file.id}`

  getUploadFilePath = () => '/licenses/files'

  render() {
    const { handlers, id, onToggle, open } = this.props;

    return (
      <Accordion
        id={id}
        label={<FormattedMessage id="ui-licenses.section.coreDocsAndAmendments" />}
        open={open}
        onToggle={onToggle}
      >
        <FieldArray
          addDocBtnLabel={<FormattedMessage id="ui-licenses.coreDocs.add" />}
          component={DocumentsFieldArray}
          onDeleteFile={handlers.onDeleteFile}
          onDownloadFile={handlers.onDownloadFile}
          onUploadFile={handlers.onUploadFile}
          isEmptyMessage={<FormattedMessage id="ui-licenses.coreDocs.none" />}
          name="docs"
        />
        <div style={{ marginLeft: '2rem' }}>
          <Accordion
            closedByDefault
            id="license-core-docs-amendments"
            label={<FormattedMessage id="ui-licenses.section.amendments" />}
          >
            TBD
          </Accordion>
        </div>
      </Accordion>
    );
  }
}

export default LicenseFormCoreDocs;
