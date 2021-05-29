import React, { Component } from 'react';
import './NotFound.css';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';

class NotFound extends Component {
    render() {
        return (
            <Grid container spacing={0}>
                <Grid item xs>
                    <div className="page-not-found">
                        <h1 className="title">
                            404
                        </h1>
                        <div className="desc">
                            The page was not found.
                        </div>
                        <Button 
                            variant="contained"
                            style={{textTransform: 'none', fontSize: 18, backgroundColor: "#005480", color: "white"}}
                        >
                            <Link href="/" color="inherit" style={{textDecoration: 'none'}}>Home Page</Link>
                        </Button>
                    </div>
                </Grid>
            </Grid>
        );
    }
}

export default NotFound;