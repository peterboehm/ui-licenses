import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { FieldArray } from 'redux-form';

import {
  Accordion,
} from '@folio/stripes/components';

import { DocumentsFieldArray } from '@folio/stripes-erm-components';

class LicenseFormSupplement extends React.Component {
    static propTypes = {
      id: PropTypes.string,
      /*       license: PropTypes.shape({
        supplementaryDocs: PropTypes.arrayOf(
          PropTypes.shape({
            category: PropTypes.string,
            dateCreated: PropTypes.string,
            lastUpdated: PropTypes.string,
            location: PropTypes.string,
            name: PropTypes.string.isRequired,
            note: PropTypes.string,
            url: PropTypes.string,
          }),
        ),
      }).isRequired, */
      onToggle: PropTypes.func,
      open: PropTypes.bool,
      parentResources: PropTypes.shape({
        //  documentCategories: PropTypes.arrayOf(PropTypes.object),
        documentCategories: PropTypes.arrayOf(PropTypes.shape({
          id: PropTypes.string,
          label: PropTypes.string,
          value: PropTypes.string,
        })).isRequired,
      })
    };

    render() {
      const documentCategories = get(this.props.parentResources.documentCategories, ['records'], []);
      return (
        <Accordion
          id={this.props.id}
          label={<FormattedMessage id="ui-licenses.section.supplementInformation" />}
          open={this.props.open}
          onToggle={this.props.onToggle}
        >
          <FieldArray
            addDocBtnLabel={<FormattedMessage id="ui-licenses.supplementaryDocs.add" />}
            component={DocumentsFieldArray}
            isEmptyMessage={<FormattedMessage id="ui-licenses.supplementaryDocs.none" />}
            name="supplementaryDocs"
            documentCategories={documentCategories}
          />
        </Accordion>
      );
    }
}

export default LicenseFormSupplement;
