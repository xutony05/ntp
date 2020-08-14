import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";
import { DropzoneArea } from 'material-ui-dropzone'
import 'fontsource-roboto';
import { Button } from '@material-ui/core';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
}))

export default function App() {
  const classes = useStyles()

  const handlePhotoDrop = (file) => {
    if (file[0]) {
      var fd = new FormData();
      file.forEach(element => {
        fd.append('file', element)
        console.log(element)
      });
      axios.post("http://127.0.0.1:5000/predict", fd)
        .then(res => console.log(res))
        .catch(err => console.log(err))
    }

  }

  return (
    <div className={classes.root}>
      <Typography style={{ marginTop: '1%' }} variant="h2" gutterBottom>
        Is it a tornado?
      </Typography>
      <div style={{ width: '80%', margin: '2%' }}>
        <DropzoneArea
          acceptedFiles={['image/*']}
          showPreviews={true}
          showPreviewsInDropzone={false}
          maxFileSize={5000000}
          filesLimit={100}
          onChange={handlePhotoDrop}
        />
      </div>
      <Typography style={{ marginBottom: '2em' }} variant="h4" gutterBottom>
        Prediction:
      </Typography>
      <Typography variant="h6" gutterBottom>
        I'm still learning, did I get it correct?
      </Typography>
      <div>
        <Button style={{ margin: '1em' }} variant="contained" color="primary">
          You're so smart
      </Button>
        <Button style={{ margin: '1em' }} variant="contained" color="secondary">
          Better luck next time
      </Button>
      </div>
    </div>
  );
}
