import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { Link } from 'react-router-dom';


const useStyles = makeStyles((theme) => ({
    title: {
        flexGrow: 1,
        fontSize: '50'
    },
}))

export default function Header() {
    const classes = useStyles()
    return (
        <AppBar style={{
            background: '#eeeeee'
        }} position="static">
            <Toolbar>
                <Typography style={{ color: '#4f2683' }} variant='h6' className={classes.title}>
                    <Button style={{ fontSize: 'medium' }} color='inherit' href='https://www.uwo.ca/ntp/'>
                        Northern Tornadoes Project
                    </Button>
                </Typography>
                <Button style={{ width: '12%' }} href='https://uwo.ca/'>
                    <img style={{ width: '100%', padding: '1em' }} src='https://www.uwo.ca/img/homepage/2017/ttl-westernlogo.svg' />
                </Button>
            </Toolbar >
        </AppBar >
    )
}