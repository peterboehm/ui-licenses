import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { FieldArray } from 'redux-form';

import {
  Accordion,
} from '@folio/stripes/components';

import { DocumentsFieldArray } from '@folio/stripes-erm-components';

class LicenseFormCoreDocs extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
  };

  render() {
    return (
      <Accordion
        id={this.props.id}
        label={<FormattedMessage id="ui-licenses.section.coreDocsAndAmendments" />}
        open={this.props.open}
        onToggle={this.props.onToggle}
      >
        <FieldArray
          addDocBtnLabel={<FormattedMessage id="ui-licenses.coreDocs.add" />}
          component={DocumentsFieldArray}
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
