import React from 'react';
import PropTypes from 'prop-types';

import { ControlledVocab } from '@folio/stripes/smart-components';
import { IntlConsumer } from '@folio/stripes/core';

export default class PickListSettings extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.connectedControlledVocab = props.stripes.connect(ControlledVocab);
  }

  render() {
    const { stripes } = this.props;

    return (
      <IntlConsumer>
        {intl => (
          <this.connectedControlledVocab
            baseUrl="licenses/refdata"
            columnMapping={{
              desc: intl.formatMessage({ id: 'ui-licenses.pickList' }),
              actions: intl.formatMessage({ id: 'ui-licenses.actions' }),
            }}
            formatter={{ numberOfObjects: (item) => { return item.values ? item.values.length : '-'; } }}
            hiddenFields={['lastUpdated']}
            id="pick-lists"
            label={intl.formatMessage({ id: 'ui-licenses.settings.pickLists' })}
            labelSingular={intl.formatMessage({ id: 'ui-licenses.pickList' })}
            limitParam="perPage"
            nameKey="desc"
            objectLabel={intl.formatMessage({ id: 'ui-licenses.values' })}
            sortby="desc"
            stripes={stripes}
            visibleFields={['desc']}
          />
        )}
      </IntlConsumer>
    );
  }
}
