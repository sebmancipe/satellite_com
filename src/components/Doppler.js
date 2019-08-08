import React from 'react'
import { Form, Button, Container } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.css';


const R = 6371;
const c = 3e8;


class Doppler extends React.Component {

    constructor(props){
        super();
        this.state={
            Fsat:0,
            Vsat:0,
            alpha:0,
            height:0,
            result:0
        }
    }

    handleChange=(e) => {
        this.setState({[e.target.name]:e.target.value})
    }

    onSubmit=(e)=>{
        e.preventDefault();
        this.getDoppler(this.state.Fsat,this.state.Vsat,this.state.alpha,this.state.height)
    }

    getDoppler(Fsat,Vsat,alpha, height){
        var Vrel = this.getVrel(this.getVx(Vsat, this.getTheta(alpha, this.getBeta(alpha, height))), alpha);
        var result = (alpha>90)?((c)/(c-Vrel))*Fsat*10e6:((c)/(c+Vrel))*Fsat*10e6
        this.setState({result:result.toExponential()})
    }
    
    getVrel(Vx,alpha){
        return (Vx/Math.cos(this.toRadians(alpha)));
    }
    
    getVx( Vsat, theta){
        return (Vsat*Math.cos(theta));
    }
    
    getTheta(alpha,beta){
        return (this.toRadians(90)-this.toRadians(alpha)-beta);
    }
    
    getBeta(alpha,height){
        return Math.asin((R*Math.sin(this.toRadians(alpha)+this.toRadians(90)))/(height+R));
    }

    toRadians (angle) {
        return angle * (Math.PI / 180);
    }

    render() {
        return (
            <Container>

            <Form onChange={this.handleChange} onSubmit={this.onSubmit}>
                <Form.Group>
                    <Form.Label>Satellite frequency in MHz</Form.Label>
                    <Form.Control type="number" step="0.000001" placeholder="Enter frequency" name="Fsat" />
                </Form.Group>

                <Form.Group >
                    <Form.Label>Satellite speed in meters per second</Form.Label>
                    <Form.Control type="number" step="0.000001" placeholder="Enter speed" name="Vsat"/>
                </Form.Group>

                <Form.Group >
                    <Form.Label>Satellite inclination in grades</Form.Label>
                    <Form.Control type="number" step="0.000001" placeholder="Enter inclination" name="alpha" />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Satellite height in meters</Form.Label>
                    <Form.Control type="number" step="0.000001" placeholder="Enter height" name="height" />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>

            <div>The result is {this.state.result}</div>

            </Container>
        )
    }

}
export default Doppler;