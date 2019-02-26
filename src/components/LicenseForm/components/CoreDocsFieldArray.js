import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';

import {
  Button,
  Col,
  Layout,
  Row,
  TextArea,
  TextField,
  IconButton,
} from '@folio/stripes/components';

import { required } from '../../../util/validators';

export default class CoreDocsFieldArray extends React.Component {
  static propTypes = {
    fields: PropTypes.object,
  }

  handleDeleteCoreDoc = (index, doc) => {
    const { fields } = this.props;

    fields.remove(index);

    if (doc.id) {
      fields.push({ id: doc.id, _delete: true });
    }
  }

  validateDocIsSpecified = (value, allValues, props, name) => {
    const index = parseInt(/\[([0-9]*)\]/.exec(name)[1], 10);
    const { location, url } = get(allValues, ['docs', index], {});
    if (!location && !url) {
      return <FormattedMessage id="ui-licenses.errors.docsMustHaveLocationOrURL" />;
    }

    return undefined;
  }

  validateURLIsValid = (value) => {
    if (value) {
      try {
        const test = new URL(value); // eslint-disable-line no-unused-vars
      } catch (_) {
        return <FormattedMessage id="ui-licenses.errors.invalidURL" />;
      }
    }

    return undefined;
  }

  renderDocs = (docs) => {
    return docs.map((doc, i) => (
      <div>
        <Row>
          <Col xs={11}>
            <Field
              component={TextField}
              id="license-doc-name"
              label={<FormattedMessage id="ui-licenses.docs.name" />}
              name={`docs[${i}].name`}
              required
              validate={required}
            />
          </Col>
          <Col xs={1}>
            <IconButton
              icon="trash"
              id={`docs-delete-${i}`}
              onClick={() => this.handleDeleteCoreDoc(i, doc)}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={11}>
            <Field
              component={TextArea}
              id="license-doc-note"
              label={<FormattedMessage id="ui-licenses.docs.note" />}
              name={`docs[${i}].note`}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={11}>
            <Field
              component={TextField}
              id="license-doc-location"
              label={<FormattedMessage id="ui-licenses.docs.location" />}
              name={`docs[${i}].location`}
              validate={this.validateDocIsSpecified}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={11}>
            <Field
              component={TextField}
              id="license-doc-url"
              label={<FormattedMessage id="ui-licenses.docs.url" />}
              name={`docs[${i}].url`}
              validate={[
                this.validateDocIsSpecified,
                this.validateURLIsValid,
              ]}
            />
          </Col>
        </Row>
      </div>
    ));
  }

  renderEmpty = () => (
    <Layout className="padding-bottom-gutter">
      <FormattedMessage id="ui-licenses.docs.noDocs" />
    </Layout>
  )

  render() {
    const { fields } = this.props;
    const docs = (fields.getAll() || [])
      .filter(d => d._delete !== true);

    return (
      <div>
        <div>
          { docs.length ? this.renderDocs(docs) : this.renderEmpty() }
        </div>
        <Button id="add-core-doc-btn" onClick={() => fields.push({})}>
          <FormattedMessage id="ui-licenses.docs.addCoreDoc" />
        </Button>
      </div>
    );
  }
}
