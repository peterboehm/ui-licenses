import React from 'react'
import {observable} from 'mobx'
import { observer } from 'mobx-react'
import { hot } from 'react-hot-loader'
import { Container, Row, Col } from 'reactstrap'
import Search from '../../components/search'
import {tableFormatters, textHighlighter} from '../../lib/helpers'
import Licenses from './licenses'

class LicensesComponent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
    }
  }

  render() {
    return (
      <Licenses app={this.props.app} />
    )
  }
}
export default hot(module)(LicensesComponent)

