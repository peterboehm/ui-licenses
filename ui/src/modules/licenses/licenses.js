import React from 'react'
import {observable} from 'mobx'
import { observer } from 'mobx-react'
import { hot } from 'react-hot-loader'
import { Link } from 'react-router-dom'

import { Container, Card, CardImg, CardText, CardHeader, CardBody, CardTitle, CardSubtitle, Button, Row, Col } from 'reactstrap';


const Licenses = observer(({app}) => {
  return (
    <div>
      <Container fluid={true}>
      	<Row>
      	  <Col sm="12"><h1>Licenses</h1></Col>
      	</Row>
      </Container>
    </div>
  )
})

Licenses.propTypes = {
    app: React.PropTypes.object,
};

export default hot(module)(Licenses)
