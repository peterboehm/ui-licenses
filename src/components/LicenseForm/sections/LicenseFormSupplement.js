import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { FieldArray } from 'redux-form';

import { Accordion } from '@folio/stripes/components';
import { DocumentsFieldArray } from '@folio/stripes-erm-components';

class LicenseFormSupplement extends React.Component {
    static propTypes = {
      data: PropTypes.shape({
        documentCategories: PropTypes.array,
      }).isRequired,
      handlers: PropTypes.shape({
        onDeleteFile: PropTypes.func.isRequired,
        onDownloadFile: PropTypes.func.isRequired,
        onUploadFile: PropTypes.func.isRequired,
      }).isRequired,
      id: PropTypes.string,
      onToggle: PropTypes.func,
      open: PropTypes.bool,
    };

    render() {
      const { data, handlers, id, onToggle, open } = this.props;

      return (
        <Accordion
          id={id}
          label={<FormattedMessage id="ui-licenses.section.supplementInformation" />}
          open={open}
          onToggle={onToggle}
        >
          <FieldArray
            addDocBtnLabel={<FormattedMessage id="ui-licenses.supplementaryDocs.add" />}
            component={DocumentsFieldArray}
            documentCategories={data.documentCategories}
            isEmptyMessage={<FormattedMessage id="ui-licenses.supplementaryDocs.none" />}
            name="supplementaryDocs"
            onDeleteFile={handlers.onDeleteFile}
            onDownloadFile={handlers.onDownloadFile}
            onUploadFile={handlers.onUploadFile}
          />
        </Accordion>
      );
    }
}

export default LicenseFormSupplement;
