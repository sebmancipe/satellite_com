import React, { Component } from 'react'
import { Form, Button, Container, Breadcrumb } from 'react-bootstrap'


const Re = 8500;

const coefficients_specific_attenuation = {
    "1": [0.0000387,0.0000352,0.912,0.880],
    "2": [0.000154,0.000138,0.963,0.923],
    "4": [0.000650,0.000591,1.121,0.923],
    "6": [0.00175,0.00155,1.308,1.265],
    "7": [0.00301,0.00265,1.332,1.312],
    "8": [0.00454,0.00395,1.327,1.310],
    "10": [0.0101,0.00887,1.276,1.264],
    "12": [0.0188,0.0168,1.217,1.200],
    "15": [0.0367,0.0335,1.154,1.128],
    "20": [0.0751,0.0691,1.099,1.065],
    "25": [0.124,0.113,1.061,1.030],
    "30": [0.187,0.167,1.021,1.000],
    "35": [0.263,0.233,0.979,0.963],
    "40": [0.350,0.310,0.939,0.929],
    "45": [0.442,0.393,0.903,0.897],
    "50": [0.536,0.479,0.873,0.868],
    "60": [0.707,0.642,0.826,0.824],
    "70": [0.851,0.784,0.793,0.793],
    "80": [0.975,0.906,0.769,0.769],
    "90": [1.06,0.999,0.753,0.754],
    "100": [1.12,1.06,0.743,0.744]
} 

function toRadians (angle) {
    return angle * (Math.PI / 180);
}

function toDegrees (angle) {
    return angle * (180 / Math.PI);
}

class RainAttenuation extends Component {
    constructor(props){
        super();
        this.state={
            fsat:0,
            latitude:0,
            theta:0,
            height_s:0,
            R_01:0,
            height_0:0,
            k:0,
            alpha:0,
            answer:0
        }
    }

    handleChange = (e) => {
        if(e.target.name !== 'freq')
        this.setState({ [e.target.name]: Number(e.target.value) })
        else{
            let k_h = coefficients_specific_attenuation[e.target.value][0];
            let k_v = coefficients_specific_attenuation[e.target.value][1];
            let alpha_h = coefficients_specific_attenuation[e.target.value][2];
            let alpha_v = coefficients_specific_attenuation[e.target.value][3];
            let k = k_h+k_v+(k_h-k_v)*Math.pow(Math.cos(toRadians(this.state.theta)),2)*Math.cos(toRadians(2*45))/2;
            let alpha = k_h*alpha_h+k_v*alpha_v+(k_h*alpha_h-k_v*alpha_v)*Math.pow(Math.cos(toRadians(this.state.theta)),2)*Math.cos(toRadians(2*45))/2*k;
            console.log("k",k,"alpha",alpha)
            this.setState({k})
            this.setState({alpha})
            this.setState({Fsat:Number(e.target.value)})
        }
    }

    onSubmit = (e) => {
        e.preventDefault();

        
        //Load variables
        const height_s = this.state.height_s
        const theta = this.state.theta
        const k = this.state.k
        const alpha = this.state.alpha
        const R_01 = this.state.R_01
        const f = this.state.Fsat
        const latitude = this.state.latitude

        console.log("Actual state",height_s,theta,k,alpha,R_01,f,latitude)

        //Calculate hr
        let height_r = this.state.height_0+0.36+height_s; //¿? The height_r is lower than height_s, so always is going to be a negative number

        //if(height_r-height_s<=0) this.setState({answer:0})

        //Calculate Ls
        let Ls;
        if(theta >= 5) Ls = (height_r - height_s)/Math.sin(toRadians(theta))
        else Ls = (2*height_r - height_s)/( (Math.sqrt(Math.pow(Math.sin(theta),2) + (2*(height_r-height_s)/Re))+ Math.sin(toRadians(theta))))
        
        //Calculate Lg
        let Lg;
        Lg = Ls*Math.cos(toRadians(theta))

        //Calculate the especific attenuation (gamma_r)
        let gamma_r;
        gamma_r=k*Math.pow(R_01,alpha);

        //Calculate the horizontal reduction factor (r_01)
        let r_01;
        r_01=1/(1+0.78*Math.sqrt((Lg*gamma_r)/f)-0.38*(1-Math.exp(2*Lg*(-1))))

        //Calculate the horizontal adjustment factor (v_01)
        let dseta = toDegrees(Math.atan((height_r-height_s)/(Lg*r_01)))
        //Calculate Lr
        let Lr;
        if(dseta > theta) Lr = (Lg*r_01)/Math.cos(toRadians(theta))
        else Lr = (height_r-height_s)/Math.sin(toRadians(theta))
        //Calculate ji (x)
        let ji;
        if(Math.abs(latitude)<36) ji = 36-Math.abs(latitude)
        else ji = 0
        let v_01;
        v_01 = 1/(1+Math.sqrt(Math.sin(toRadians(theta))) * (31*(1-Math.exp(-(theta/(1+ji)))*(Math.sqrt(Lr*gamma_r)/Math.pow(f,2)))- 0.45))

        //Calculate the effective path lenght (Le)
        let Le;
        Le = Lr*v_01;

        //Calculate the overshoot attenuation in the 0.01% of the year (A_01)
        let A_01;
        A_01=gamma_r*Le;

        console.log("Atenuación de rebasamiento del 0.01% del año medio",A_01)

        //Calculate the overshoot attenuation to other percentages of the year (A_p) based in percentage p
        let p = 0.01;
        let A_p;
        //Calculate beta
        let beta;
        if(p>0.01 || Math.abs(latitude)>=36) beta = 0
        else if (p<0.01 && Math.abs(latitude) <36 && theta >= 25) beta = -0.005*(Math.abs(latitude)- 36)
        else beta = -0.005*(Math.abs(latitude)- 36)+ 1.8 - 4.25*Math.sin(toRadians(theta))

        A_p = A_01*Math.pow((p/0.01),-(0.655+0.033*Math.log(p)- 0.045*Math.log(A_01) - beta*(1-p)*Math.sin(theta)))
        console.log("Atenuación de rebasamiento del porcentaje p del año",A_p)

        this.setState({answer:A_01})
    }

    render() {
        return (
            <div>
                <Breadcrumb>
                    <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                    <Breadcrumb.Item href="/doppler">Doppler</Breadcrumb.Item>
                    <Breadcrumb.Item href="/distance">Distance</Breadcrumb.Item>
                    <Breadcrumb.Item active>Rain attenuation</Breadcrumb.Item>
                    <Breadcrumb.Item href="/foot_print">Foot print</Breadcrumb.Item>
                </Breadcrumb>

                <Container id="main_container">

                    <Form onChange={this.handleChange} onSubmit={this.onSubmit}>

                        <Form.Group >
                            <Form.Label>Station latitude in degrees</Form.Label>
                            <Form.Control type="number" step="0.000001" placeholder="Enter latitude" name="latitude" />
                        </Form.Group>

                        <Form.Group >
                            <Form.Label>Station elevation in degrees</Form.Label>
                            <Form.Control type="number" step="0.000001" placeholder="Enter elevation" name="theta" />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Station height in kilometers over the level of the sea</Form.Label>
                            <Form.Control type="number" step="0.000001" placeholder="Enter height" name="height_s" />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Rain intensity in the 0.01% of the year-time (mm/h)</Form.Label> {/*Check page 487 of the book*/}
                            <Form.Control type="number" step="0.000001" placeholder="Enter rain intensity" name="R_01" />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Height of the isotermic value over the sea level in Km <a target="blank" href="https://www.itu.int/dms_pubrec/itu-r/rec/p/R-REC-P.839-4-201309-I!!PDF-S.pdf">(more info here)</a></Form.Label>
                            <Form.Control type="number" step="0.000001" placeholder="Enter isotermic height" name="height_0" />
                        </Form.Group>


                        <Form.Group controlId="exampleForm.ControlSelect1">
                        <Form.Label>Satellite frequency in GHz</Form.Label>
                        <Form.Control as="select" name="freq">
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="4">4</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="10">10</option>
                            <option value="12">12</option>
                            <option value="15">15</option>
                            <option value="20">20</option>
                            <option value="25">25</option>
                            <option value="30">30</option>
                            <option value="35">35</option>
                            <option value="40">40</option>
                            <option value="50">50</option>
                            <option value="60">60</option>
                            <option value="70">70</option>
                            <option value="80">80</option>
                            <option value="90">90</option>
                            <option value="100">100</option>
                        </Form.Control>
                    </Form.Group>

                        <Button variant="primary" type="submit">
                            Submit
                </Button>
                    </Form>
                    <br></br>
                    <div>The overshoot attenuation in the 0.01% of the year (A 0.01) is {this.state.answer.toExponential()} dB</div>

                </Container>
            </div>
        )
    }
}

export default RainAttenuation