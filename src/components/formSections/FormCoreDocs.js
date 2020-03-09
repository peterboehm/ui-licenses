import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { FieldArray } from 'react-final-form-arrays';

import { Accordion } from '@folio/stripes/components';

import { DocumentsFieldArray } from '@folio/stripes-erm-components';

export default class FormCoreDocs extends React.Component {
  static propTypes = {
    handlers: PropTypes.shape({
      onDownloadFile: PropTypes.func.isRequired,
      onUploadFile: PropTypes.func.isRequired,
    }),
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
  };

  render() {
    const { handlers, id, onToggle, open } = this.props;

    return (
      <Accordion
        id={id}
        label={<FormattedMessage id="ui-licenses.section.coreDocs" />}
        onToggle={onToggle}
        open={open}
      >
        <FieldArray
          addDocBtnLabel={<FormattedMessage id="ui-licenses.coreDocs.add" />}
          component={DocumentsFieldArray}
          deleteBtnTooltipMsgId="ui-licenses.coreDocs.removeCoreDoc"
          isEmptyMessage={<FormattedMessage id="ui-licenses.coreDocs.none" />}
          name="docs"
          onDownloadFile={handlers.onDownloadFile}
          onUploadFile={handlers.onUploadFile}
        />
      </Accordion>
    );
  }
}
