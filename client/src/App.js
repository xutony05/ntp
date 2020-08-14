import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";
import { DropzoneArea } from 'material-ui-dropzone'
import 'fontsource-roboto';
import { Button } from '@material-ui/core';
import axios from 'axios';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  table: {
    minWidth: 650,
  },
}))

export default function App() {
  const classes = useStyles()
  const [result, setResult] = useState()
  const [file, setFile] = useState()

  const handlePhotoDrop = (file) => {
    if (file[0]) {
      var fd = new FormData();
      setFile(file)
      file.forEach(element => {
        fd.append('file', element)
      });
      axios.post("http://127.0.0.1:5000/predict", fd)
        .then(res => setResult(res.data))
        .catch(err => console.log(err))
    }
  }

  const renderResult = () => {
    const renderFeedback = () => {
      return (
        <div>
          <Typography variant="subtitle1">
            I'm still learning, did I get it correct?
          </Typography>
          <div>
            <Button style={{ margin: '0.25em' }} size="small" variant="contained" color="primary">
              You're so smart
            </Button>
            <Button style={{ margin: '0.25em' }} size="small" variant="contained" color="secondary">
              Better luck next time
            </Button>
          </div>
        </div>
      )
    }

    if (result) {
      return (
        <TableContainer component={Paper}>
          <Typography variant="h4" gutterBottom style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}>
            Prediction
          </Typography>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Image</TableCell>
                <TableCell align="center">Result</TableCell>
                <TableCell align="center">Feedback</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(result).map(([key, value]) => (
                <TableRow key={key}>
                  <TableCell align="center">{key}</TableCell>
                  <TableCell align="center">{value ? <b>Tornado</b> : <b>Not a tornado</b>}</TableCell>
                  <TableCell align="center">{renderFeedback()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )
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
      {renderResult()}
    </div>
  );
}
