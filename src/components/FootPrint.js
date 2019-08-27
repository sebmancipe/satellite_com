/**
 * Get the footprint of a satellite based in the formula:
 * S = theta*R
 * theta = 2*(acos(R/(R+h)))
 * A = PI*(S/2)²
 */
import React, { Component } from 'react';
import { Form, Button, Container, Breadcrumb } from 'react-bootstrap';


const R = 6371;

class Distance extends Component {
    constructor(props) {
        super();
        this.state = {
            height: 0,
            arc: 0,
            area: 0
        }
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: Number(e.target.value) })
    }

    onSubmit = (e) => {
        e.preventDefault();
        this.getFootPrint(this.state.height)
    }

    getFootPrint(height) {
        let arc = 2 * Math.acos(R/(R+height))*R
        let area = Math.PI*Math.pow(arc/2,2)
        this.setState({ arc })
        this.setState({ area })

    }

    degreesToRadians(x) {
        return x * (Math.PI/180);
    }

    radiansToDegrees(x) {
        return x * (180/Math.PI);
    }


    render() {
        return (
            <div>
                <Breadcrumb>
                    <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                    <Breadcrumb.Item href="/doppler">
                        Doppler
                    </Breadcrumb.Item>
                    <Breadcrumb.Item href="/distance">Distance</Breadcrumb.Item>
                    <Breadcrumb.Item href="/rain_attenuation">Rain attenuation</Breadcrumb.Item>
                    <Breadcrumb.Item active>Foot print</Breadcrumb.Item>
                </Breadcrumb>

                <Container id="main_container">
                <Form onChange={this.handleChange} onSubmit={this.onSubmit}>

                    <Form.Group>
                        <Form.Label>Satellite height in Km</Form.Label>
                        <Form.Control type="number" step="0.000001" placeholder="Enter height" name="height" />
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Submit
                </Button>
                </Form>
                <br></br>
                <div>The arc of the satellite is {this.state.arc} Km</div>
                <div>The area total of the footprint is {this.state.area} Km²</div>


            </Container>
            </div>
        )
    }
}
export default Distance