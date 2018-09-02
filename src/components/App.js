import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import {
    BrowserRouter as Router,
    Route
} from 'react-router-dom';
import ConnectDomain from '../containers/ConnectDomain';
import DomainDetail from '../containers/DomainDetail';
import AlertMessage from '../containers/AlertMessage';

const styles = {
    root: {
        minWidth: '30em',
        width: '100%',
    },
    headerOverlay: {
        color: 'white',
        background: 'black 50% 100% no-repeat',
        backgroundSize: 'cover',
        height: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    sloganWrapper: {
        display: 'flex',
        flexDirection: 'column'
    },
    slogan: {
        fontSize: '2em',
        fontWeight: 500,
        animation: 'slogan 3s forwards'
    },
    subSlogan: {
        fontSize: '1em',
        fontWeight: 200,
        animation: 'slogan 3s forwards',
        textAlign: 'center'
    },
    guideArrow: {
        position: 'absolute',
        bottom: 5,
        opacity: 0,
        animation: 'pulse 2s 1s infinite forwards'
    },
    appBar: {
        color: 'black',
        backgroundColor: 'white',
        position: 'fixed'
    },
    appBarRoot: {
        color: 'white',
        backgroundColor: 'rgba(0, 0, 0, 0)',
        position: 'fixed'
    },
    flex: {
        flexGrow: 1,
    },
    loadingRoot: {
        opacity: 0.5
    },
    body: {
        margin: '0 auto',
        marginTop: '5em',
        width: '30em',
        height: '91vh',
    },
    loading: {
        top: '50%',
        left: '50%',
        position: 'absolute',
        zIndex: 2,
        marginTop: -50,
        marginLeft: -50
    }
};

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeDark: true
        };
    }

    componentDidMount = () => {
        document.addEventListener('scroll', () => {
            if (!this.isRootPage()) return;

            const headerOverlayHeight = document.getElementById('header-overlay').clientHeight;
            const appBarHeight = document.getElementById('app-bar').clientHeight;
            const y = window.scrollY;

            if (y >= headerOverlayHeight - appBarHeight && this.state.activeDark) {
                this.setState({
                    activeDark: false
                });
            } else if (y < headerOverlayHeight - appBarHeight && !this.state.activeDark) {
                this.setState({
                    activeDark: true
                });
            }
        });
    };

    render() {
        const { classes, loading } = this.props;

        return (
            <div className={loading.show ? classNames(classes.loadingRoot, classes.root) : classes.root}>
                {this.isRootPage() && <div id="header-overlay" className={classes.headerOverlay}>
                    <div className={classes.sloganWrapper}>
                        <div className={classes.slogan}>ADD HTTPS TO YOUR WEBSITE</div>
                        <div className={classes.subSlogan}>JUST ONE MINUTE</div>
                    </div>
                    <KeyboardArrowDownIcon className={classes.guideArrow} />
                </div>}
                <AppBar id="app-bar" position="sticky" className={(this.isRootPage() && this.state.activeDark) ? classes.appBarRoot : classes.appBar}>
                    <Toolbar>
                        <Typography variant="title" color="inherit" className={classes.flex}>
                            SSL Ready
                        </Typography>
                        <Button color="inherit" href="https://covertness.me">Blog</Button>
                    </Toolbar>
                </AppBar>
                <Router>
                    <div className={classes.body}>
                        <Route exact path="/" component={ConnectDomain} />
                        <Route path="/domains/:domainId" component={DomainDetail} />
                    </div>
                </Router>
                {loading.show && <CircularProgress className={classes.loading} size={100} />}
                <AlertMessage />
            </div>
        );
    }

    isRootPage = () => window.location.pathname === '/'
}

App.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);