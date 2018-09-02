import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import ipRegex from '../lib/ip-regex';

const styles = theme => ({
    root: {
    },
    button: {
        marginTop: theme.spacing.unit,
        marginRight: theme.spacing.unit,
    },
    actionsContainer: {
        marginBottom: theme.spacing.unit * 2,
    },
    resetContainer: {
        padding: theme.spacing.unit * 3,
    },
});

function getSteps() {
    return ['Set up a domain', 'Add a backend address'];
}

class Connect extends React.Component {
    state = {
        sourceHost: '',
        destHost: ''
    };

    getStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <div>
                        <Typography>
                            Go to your domain's host record settings or zone file editor and
                  then add a CNAME record points to <b>ssl.covertness.me</b>. When you finished,
                                                                              input your domain and click next.
                    </Typography>
                        <TextField
                            id="domain"
                            label="Domain"
                            placeholder="www.example.com"
                            value={this.state.sourceHost}
                            error={!this.props.domain.valid}
                            onChange={this.handleTextFieldChange('sourceHost')}
                            margin="normal"
                        />
                    </div>
                );
            case 1:
                return (
                    <div>
                        <Typography>
                            Input your backend address. This address should
                            provide <b>HTTP Protocol</b> and is a IP.
                            <br />
                        </Typography>
                        <TextField
                            id="address"
                            label="Backend Address"
                            placeholder="127.0.0.1"
                            value={this.state.destHost}
                            onChange={this.handleTextFieldChange('destHost')}
                            margin="normal"
                        />
                    </div>
                );
            default:
                return 'Unknown step';
        }
    }

    handleNext = () => {
        switch (this.props.domain.connect.activeStep) {
            case 0: {
                this.props.checkDomain(this.state.sourceHost);
                break;
            }
            default: {
                break;
            }
        }
    };

    handleFinish = () => {
        if (!ipRegex({exact: true}).test(this.state.destHost)) {
            this.props.alertMessage('Error', `The backend address ${this.state.destHost} is not a valid IP.`);
            return;
        }

        this.props.createDomain(this.state.sourceHost, this.state.destHost);
    };

    handleTextFieldChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    render() {
        const { classes, domain: { connect: {activeStep}, id } } = this.props;
        if (id > 0) this.props.history.push('/domains/' + id);

        const steps = getSteps();

        return (
            <div className={classes.root}>
                <Stepper activeStep={activeStep} orientation="vertical">
                    {steps.map((label, index) => {
                        return (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                                <StepContent>
                                    {this.getStepContent(index)}
                                    <div className={classes.actionsContainer}>
                                        <div>
                                            <Button
                                                disabled={activeStep === 0}
                                                onClick={this.props.handleBack}
                                                className={classes.button}
                                            >
                                                Back
                      </Button>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={this.isFinish() ? this.handleFinish : this.handleNext}
                                                className={classes.button}
                                            >
                                                {this.isFinish() ? 'Finish' : 'Next'}
                                            </Button>
                                        </div>
                                    </div>
                                </StepContent>
                            </Step>
                        );
                    })}
                </Stepper>
                {activeStep === steps.length && (
                    <Paper square elevation={0} className={classes.resetContainer}>
                        <Typography>Please wait while we process your request.</Typography>
                    </Paper>
                )}
            </div>
        );
    };

    isFinish = () => {
        const steps = getSteps();
        return this.props.domain.connect.activeStep === steps.length - 1;
    }
}

Connect.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(Connect);