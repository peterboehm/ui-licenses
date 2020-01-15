import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { FieldArray } from 'react-final-form-arrays';

import { Accordion } from '@folio/stripes/components';
import { DocumentsFieldArray } from '@folio/stripes-erm-components';

export default class FormSupplementaryDocs extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      documentCategories: PropTypes.array,
    }).isRequired,
    handlers: PropTypes.shape({
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
          deleteBtnTooltipMsgId="ui-licenses.supplementaryDocs.remove"
          documentCategories={data.documentCategories}
          isEmptyMessage={<FormattedMessage id="ui-licenses.supplementaryDocs.none" />}
          name="supplementaryDocs"
          onDownloadFile={handlers.onDownloadFile}
          onUploadFile={handlers.onUploadFile}
        />
      </Accordion>
    );
  }
}
