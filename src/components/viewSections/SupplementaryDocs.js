import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';
import {
  Accordion,
  Badge,
  Layout,
  Spinner,
} from '@folio/stripes/components';
import { DocumentCard } from '@folio/stripes-erm-components';

export default class SupplementaryDocs extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    handlers: PropTypes.shape({
      onDownloadFile: PropTypes.func,
    }),
    record: PropTypes.shape({
      supplementaryDocs: PropTypes.arrayOf(
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
    recordType: PropTypes.string.isRequired,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
  };

  renderDocs = (docs) => {
    return docs.map(doc => (
      <DocumentCard
        key={doc.id}
        onDownloadFile={this.props.handlers.onDownloadFile}
        {...doc}
      />
    ));
  }

  renderBadge = () => {
    const count = get(this.props.record, ['supplementaryDocs', 'length']);
    return count !== undefined ? <Badge>{count}</Badge> : <Spinner />;
  }

  render() {
    const { id, onToggle, open, recordType } = this.props;
    const { supplementaryDocs = [] } = this.props.record;

    return (
      <FormattedMessage id={`ui-licenses.${recordType}`}>
        {type => (
          <Accordion
            displayWhenClosed={this.renderBadge()}
            displayWhenOpen={this.renderBadge()}
            id={id}
            label={<FormattedMessage id="ui-licenses.section.supplementaryDocuments" />}
            onToggle={onToggle}
            open={open}
          >
            <Layout className="padding-bottom-gutter">
              {supplementaryDocs.length ? this.renderDocs(supplementaryDocs) : <FormattedMessage id="ui-licenses.emptyAccordion.supplementaryDocuments" values={{ type: type.toLowerCase() }} /> }
            </Layout>
          </Accordion>
        )}
      </FormattedMessage>
    );
  }
}
