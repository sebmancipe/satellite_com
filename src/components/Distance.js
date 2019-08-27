/**
 * Get the distance from satellite to terrain station. Is used in FSL (Free Space Losses) formula:
 * FSL = 32.4 + 20*log(f)+20*log(d)
 */
import React, { Component } from 'react';
import { Form, Button, Container, Breadcrumb } from 'react-bootstrap';


const R = 6371;

class Distance extends Component {
    constructor(props) {
        super();
        this.state = {
            fsat: 0,
            height: 0,
            incl_angle: 0,
            result: 0,
            resultFSL: 0
        }
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: Number(e.target.value) })
    }

    onSubmit = (e) => {
        e.preventDefault();
        this.getDistance(this.state.fsat, this.state.incl_angle, this.state.height)
    }

    getDistance(fsat, incl_angle, height) {
        let beta = this.getBeta(incl_angle, height)
        let alpha = this.getAlpha(beta, incl_angle)
        let angleRad = this.degreesToRadians(incl_angle + 90)
        let result = ((R + height) / Math.sin(angleRad)) * Math.sin(this.degreesToRadians(alpha))

        //Get FSL
        let resultFSL = 32.4 + 20*Math.log10(fsat)+20*Math.log10(result*1e3)
        this.setState({ result })
        this.setState({resultFSL})

    }

    degreesToRadians(x) {
        return x * (Math.PI/180);
    }

    radiansToDegrees(x) {
        return x * (180/Math.PI);
    }

    getBeta(incl_angle, height) {
        const beta = Math.asin( (R * Math.sin(this.degreesToRadians(Number(incl_angle) + 90)) ) / (R + Number(height)))
        return beta
    }

    getAlpha(beta, incl_angle) {
        return (90 - this.radiansToDegrees(beta) - incl_angle)
    }




    render() {
        return (
            <div>
                <Breadcrumb>
                    <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                    <Breadcrumb.Item href="/doppler">
                        Doppler
                    </Breadcrumb.Item>
                    <Breadcrumb.Item active>Distance</Breadcrumb.Item>
                    <Breadcrumb.Item href="/rain_attenuation">Rain attenuation</Breadcrumb.Item>
                    <Breadcrumb.Item href="/foot_print">Foot print</Breadcrumb.Item>
                </Breadcrumb>

                <Container id="main_container">
                <Form onChange={this.handleChange} onSubmit={this.onSubmit}>
                    <Form.Group>
                        <Form.Label>Satellite frequency in GHz</Form.Label>
                        <Form.Control type="number" step="0.000001" placeholder="Enter frequency" name="fsat" />
                    </Form.Group>

                    <Form.Group >
                        <Form.Label>Terrain station inclination in grades</Form.Label>
                        <Form.Control type="number" step="0.000001" placeholder="Enter inclination" name="incl_angle" />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Satellite height in Km</Form.Label>
                        <Form.Control type="number" step="0.000001" placeholder="Enter height" name="height" />
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Submit
                </Button>
                </Form>
                <br></br>
                <div>The distance from the terrain station and the satellite is {this.state.result} Km</div>
                <div>The attenuation (FSL) is {this.state.resultFSL} dB</div>


            </Container>
            </div>
        )
    }
}
export default Distance