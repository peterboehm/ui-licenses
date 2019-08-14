import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { ControlledVocab } from '@folio/stripes/smart-components';
import { Select } from '@folio/stripes/components';
import { IntlConsumer } from '@folio/stripes/core';

export default class PickListValueSettings extends React.Component {
  static manifest = {
    categories: {
      type: 'okapi',
      path: 'licenses/refdata',
      accumulate: true,
    },
  };

  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }).isRequired,
    resources: PropTypes.shape({
      categories: PropTypes.arrayOf({
        id: PropTypes.string,
        desc: PropTypes.string,
        values: PropTypes.arrayOf({
          id: PropTypes.string,
          value: PropTypes.string,
          label: PropTypes.string,
        }),
      }),
    }),
    mutator: PropTypes.shape({
      categories: PropTypes.shape({
        GET: PropTypes.func.isRequired,
        reset: PropTypes.func.isRequired,
      }),
    })
  };

  constructor(props) {
    super(props);
    this.connectedControlledVocab = props.stripes.connect(ControlledVocab);

    this.state = {
      categoryId: null,
    };
  }

  /**
   * Refresh lookup tables when the component mounts. Fetches in the manifest
   * will only run once (in the constructor) but because this object may be
   * unmounted/remounted without being destroyed/recreated, the lookup tables
   * will be stale if they change between unmounting/remounting.
   */
  componentDidMount() {
    ['categories'].forEach(i => {
      this.props.mutator[i].reset();
      this.props.mutator[i].GET();
    });
  }

  onChangeCategory = (e) => {
    this.setState({ categoryId: e.target.value });
  }

  render() {
    const categories = [];
    (((this.props.resources.categories || {}).records || []).forEach(i => {
      categories.push(
        <option value={i.id} key={i.id}>
          {i.desc}
        </option>
      );
    }));

    if (!categories.length) {
      return <div />;
    }

    const rowFilter = (
      <Select
        label={<FormattedMessage id="ui-licenses.pickList" />}
        id="categorySelect"
        name="categorySelect"
        onChange={this.onChangeCategory}
      >
        <FormattedMessage id="ui-licenses.pickListSelect">
          {selectText => (
            <option>{selectText}</option>
          )}
        </FormattedMessage>
        {categories}
      </Select>
    );

    return (
      <IntlConsumer>
        {intl => (
          <this.connectedControlledVocab
            {...this.props}
            actuatorType="refdata"
            baseUrl={`licenses/refdata/${this.state.categoryId}`}
            columnMapping={{
              label: intl.formatMessage({ id: 'ui-licenses.headings.value' }),
              actions: intl.formatMessage({ id: 'ui-licenses.actions' }),
            }}
        // We have to unset the dataKey to prevent the props.resources in
        // <ControlledVocab> from being overwritten by the props.resources here.
            dataKey={undefined}
            hiddenFields={['numberOfObjects']}
            id="pick-list-values"
            label={intl.formatMessage({ id: 'ui-licenses.settings.pickListValues' })}
            //  listSuppressor={() => !this.state.categoryId}
            //  listSuppressorText={<FormattedMessage id="ui-licenses.settings.location.campuses.missingSelection" />}
            nameKey="label"
            preCreateHook={(item) => Object.assign({}, item, { id: this.state.categoryId })}
            //  records={this.values}
            rowFilter={rowFilter}
            rowFilterFunction={(row) => row.id === this.state.categoryId}
            sortby="label"
            stripes={this.props.stripes}
            visibleFields={['label']}
          />
        )}
      </IntlConsumer>
    );
  }
}
