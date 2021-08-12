import { useCallback, useRef, useState } from "react";
import { useHistory } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Typography
} from '@material-ui/core';
import { Alert } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { authenticatedUpload } from "../../utils/API";

const useStyles = makeStyles(theme => ({
  profileAvatar: {
    minWidth: 150,
    minHeight: 150
  },
  previewS: {
    minWidth: 50,
    minHeight: 50,
    margin: theme.spacing(2)
  },
  previewM: {
    minWidth: 100,
    minHeight: 100,
    margin: theme.spacing(2)
  },
  previewL: {
    minWidth: 150,
    minHeight: 150,
    margin: theme.spacing(2)
  },
}));

const Profile = (props) => {
  const { currentUser } = props;
  const classes = useStyles();

  const [srcUrl, setSrcUrl] = useState(null);
  const [cropped, setCropped] = useState(null);
  const [croppedUrl, setCroppedUrl] = useState(null);
  const [cropCfg, setCropCfg] = useState({ aspect: 1 });
  const imgRef = useRef(null);

  const [disableUpload, setDisableUpload] = useState(true);
  const [disableCancel, setDisableCancel] = useState(false);
  const [severity, setSeverity] = useState("success");
  const [alertMsg, setAlertMsg] = useState(null);

  let history = useHistory();

  const handleImgInput = (ev) => {
    const file = ev.target.files[0]
    const fileReader = new FileReader()
    fileReader.onloadend = () => {
      const url = fileReader.result;
      setSrcUrl(url);
    }
    if (file) {
      fileReader.readAsDataURL(file);
    }
  }

  const onLoad = useCallback(img => {
    imgRef.current = img;
    // const aspect = 1;
    // const width = img.width / aspect < img.height * aspect ? 100 : ((img.height * aspect) / img.width) * 100;
    // const height = img.width / aspect > img.height * aspect ? 100 : (img.width / aspect / img.height) * 100;
    // const y = (100 - height) / 2;
    // const x = (100 - width) / 2;
    // const cropCfg = {
    //   unit: '%',
    //   width,
    //   height,
    //   x,
    //   y,
    //   aspect,
    // }
    //
    // setCropCfg(cropCfg);
    return true;
  }, []);

  const onCropComplete = cropCfg => {
    if (imgRef.current && cropCfg.width && cropCfg.height) {
      getCroppedImg(imgRef.current, cropCfg);
      setDisableUpload(false);
    }
  }

  const getCroppedImg = (image, cropCfg) => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = cropCfg.width;
    canvas.height = cropCfg.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      cropCfg.x * scaleX,
      cropCfg.y * scaleY,
      cropCfg.width * scaleX,
      cropCfg.height * scaleY,
      0,
      0,
      cropCfg.width,
      cropCfg.height
    )

    const reader = new FileReader()
    canvas.toBlob(blob => {
      reader.readAsDataURL(blob)
      reader.onloadend = () => {
        const url = reader.result;
        setCroppedUrl(url);
        dataURLtoFile(url, 'cropped.jpg')
      }
    })
  }

  const dataURLtoFile = (url, filename) => {
    let arr = url.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    setCropped(new File([u8arr], filename, {type: mime}));
  }

  const handleSubmit = ev => {
    if (cropped) {
      ev.preventDefault()
      const formData = new FormData();
      formData.append('file', cropped);
      authenticatedUpload('user/uploadAvatar', formData)
        .then(response => {
          console.log(response);
          if (response.data.success) {
            setDisableUpload(true);
            setDisableCancel(true);
            setSeverity("success");
            setAlertMsg("Profile image changed successfully!")

            setTimeout(() => {
              setSrcUrl(null);
              history.go(0);
              setAlertMsg(null);
            }, 2000);
          } else {
            setSeverity("error");
            setAlertMsg(response.data.message);
          }
        })
        .catch(err => {
          setSeverity("error");
          if (err instanceof Error) {
            setAlertMsg("Oops! Something went wrong. Please try again!");
          } else {
            setAlertMsg(err.errors[0].defaultMessage);
          }
        });
    }
  }

  const handleClose = () => {
    setSrcUrl(null);
    setCroppedUrl(null);
    setCropped(null);
    setCropCfg({ aspect: 1 });
    imgRef.current = null;
    document.getElementById("button-avatar").value = "";
    setAlertMsg(null);
  }

  const AvatarDialog = (
      <div>
        <Dialog
          open={Boolean(srcUrl)}
          onClose={handleClose}
          aria-labelledby="avatar-dialog-title"
          aria-describedby="avatar-dialog-description"
        >
          <DialogTitle id="avatar-dialog-title">{"Crop and Upload Image"}</DialogTitle>
          <DialogContent>
            <Box
              alignItems="center"
              display="flex"
              flexDirection="column"
            >
              <ReactCrop
                src={srcUrl}
                crop={cropCfg}
                onChange={newCropCfg => {
                  setCropCfg(newCropCfg);
                  setDisableUpload(true);
                }}
                onComplete={onCropComplete}
                onImageLoaded={onLoad}
              />
              {croppedUrl && (
                <>
                  <DialogContentText
                    id="avatar-dialog-description"
                    style={{ marginTop: 15, marginBottom: 0 }}
                  >
                    Preview
                  </DialogContentText>
                  <Box
                    alignItems="center"
                    display="flex"
                    flexDirection="row"
                  >
                    <Avatar src={croppedUrl} className={classes.previewS} />
                    <Avatar src={croppedUrl} className={classes.previewM} />
                    <Avatar src={croppedUrl} className={classes.previewL} />
                  </Box>
                </>
              )}
            </Box>
            { alertMsg && <Alert severity={severity}>{alertMsg}</Alert> }
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleClose}
              color="primary"
              style={{ textTransform: 'none' }}
              disabled={disableCancel}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              color="primary"
              autoFocus
              style={{ textTransform: 'none' }}
              disabled={disableUpload}
            >
              Upload
            </Button>
          </DialogActions>
        </Dialog>
      </div>
  );

  return (
    <>
      <Card {...props}>
        <CardContent>
          <Box
            alignItems="center"
            display="flex"
            flexDirection="column"
          >
            <Avatar
              src={currentUser.avatar}
              className={classes.profileAvatar}
            />
            <Typography
              color="textPrimary"
              gutterBottom
              variant="h3"
            >
              {currentUser.username}
            </Typography>
            <Typography
              color="textPrimary"
              gutterBottom
              variant="h5"
            >
              {currentUser.email}
            </Typography>
          </Box>
        </CardContent>
        <Divider />
        <CardActions>
          <input
            accept="image/*"
            hidden
            id="button-avatar"
            type="file"
            onChange={handleImgInput}
          />
          <label
            htmlFor="button-avatar"
            style={{ width: "100%" }}
          >
            <Button
              color="primary"
              fullWidth
              variant="text"
              component="span"
              style={{ textTransform: 'none' }}
            >
              Choose a new profile picture
            </Button>
          </label>
        </CardActions>
        {AvatarDialog}
      </Card>
    </>
  )
};

export default Profile;
