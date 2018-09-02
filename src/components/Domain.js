import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import RefreshIcon from '@material-ui/icons/Refresh';

const styles = {
    card: {
        minWidth: '28em',
    },
    title: {
        marginBottom: 16,
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
        width: 100,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    status: {
        width: 200,
        display: 'flex',
        justifyContent: 'space-between'
    },
    statusItem: {
        display: 'flex',
        alignItems: 'center'
    }
};

class Domain extends React.Component {
    componentDidMount = () => {
        this.props.fetchDomain(this.props.match.params.domainId);
    };

    handleRefresh = () => {
        this.props.fetchDomain(this.props.match.params.domainId);
    };

    render() {
        const { classes, domain: { sourceHost, state, flux } } = this.props;

        return (
            <Card className={classes.card}>
                <CardContent>
                    <Typography className={classes.title} color="textSecondary">Domain</Typography>
                    <Typography variant="headline" component="h2"><a href={`https://${sourceHost}`} target="_blank">{sourceHost}</a></Typography>
                    <Typography className={classes.pos} color={state === "verified" ? "primary" : "error"}>
                        {state}
                        {state !== "verified" && <IconButton color="secondary" onClick={this.handleRefresh}><RefreshIcon /></IconButton>}
                    </Typography>
                    <Typography className={classes.status} component="div">
                        <div className={classes.statusItem}><CloudUploadIcon />&nbsp;&nbsp;{this.bytesToSize(flux.tx)}</div>
                        <div className={classes.statusItem}><CloudDownloadIcon />&nbsp;&nbsp;{this.bytesToSize(flux.rx)}</div>
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button color="primary" size="small" href="mailto:wuyingfengsui@gmail.com">Contact Support</Button>
                </CardActions>
            </Card>
        );
    }

    bytesToSize = (bytes) => {
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes === 0) return '0 Byte';
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    }
}

Domain.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Domain);