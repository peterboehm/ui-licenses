import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';
import {
  Accordion,
  Badge,
  Layout,
} from '@folio/stripes/components';
import { DocumentCard, Spinner } from '@folio/stripes-erm-components';

export default class LicenseCoreDocs extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    license: PropTypes.shape({
      docs: PropTypes.arrayOf(
        PropTypes.shape({
          dateCreated: PropTypes.string,
          lastUpdated: PropTypes.string,
          location: PropTypes.string,
          name: PropTypes.string.isRequired,
          note: PropTypes.string,
          url: PropTypes.string,
        }),
      ),
    }).isRequired,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
  };

  renderDocs = (docs) => {
    return docs.map(doc => <DocumentCard key={doc.id} {...doc} />);
  }

  renderBadge = () => {
    const count = get(this.props.license, ['docs', 'length']);
    return count !== undefined ? <Badge>{count}</Badge> : <Spinner />;
  }

  render() {
    const { id, onToggle, open } = this.props;
    const { docs = [] } = this.props.license;

    return (
      <Accordion
        displayWhenClosed={this.renderBadge()}
        displayWhenOpen={this.renderBadge()}
        id={id}
        label={<FormattedMessage id="ui-licenses.section.coreDocs" />}
        onToggle={onToggle}
        open={open}
      >
        <Layout className="padding-bottom-gutter">
          { docs.length ? this.renderDocs(docs) : <FormattedMessage id="ui-licenses.coreDocs.none" /> }
        </Layout>
      </Accordion>
    );
  }
}
