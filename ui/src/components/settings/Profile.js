import { useCallback, useRef, useState } from "react";
import { useHistory } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography
} from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { authenticatedUpload } from "../../utils/APIUtils";

const useStyles = makeStyles(theme => ({
  profileAvatar: {
    minWidth: "100px",
    minHeight: "100px"
  },
}));

const Profile = (props) => {
  const { currentUser } = props;
  const classes = useStyles();

  const [srcUrl, setSrcUrl] = useState(null);
  const [cropped, setCropped] = useState(null);
  const [croppedUrl, setCroppedUrl] = useState(null);
  const [cropCfg, setCropCfg] = useState(null);
  const imgRef = useRef(null);

  const [disableUpload, setDisableUpload] = useState(true);
  const [disableCrop, setDisableCrop] = useState(false);
  const [disableCancel, setDisableCancel] = useState(false);

  let history = useHistory();

  const handleImgInput = (ev) => {
    const file = ev.target.files[0]
    const fileReader = new FileReader()
    fileReader.onloadend = () => {
      const url = fileReader.result;
      setSrcUrl(url);
      setCroppedUrl(url);
    }
    if (file) {
      fileReader.readAsDataURL(file);
    }
  }

  const onLoad = useCallback(img => {
    imgRef.current = img;

    const aspect = 1;
    const width = img.width / aspect < img.height * aspect ? 100 : ((img.height * aspect) / img.width) * 100;
    const height = img.width / aspect > img.height * aspect ? 100 : (img.width / aspect / img.height) * 100;
    const y = (100 - height) / 2;
    const x = (100 - width) / 2;

    setCropCfg({
      unit: '%',
      width,
      height,
      x,
      y,
      aspect,
    });

    return false; // Return false if you set crop state in here.
  }, []);

  const onCropComplete = cropCfg => {
    if (imgRef.current && cropCfg.width && cropCfg.height) {
      getCroppedImg(imgRef.current, cropCfg);
      setDisableCrop(false);
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
      authenticatedUpload('uploadAvatar', formData)
        .then(response => {
          if (response.data.success) {
            setDisableCrop(true);
            setDisableUpload(true);
            setDisableCancel(true);

            setTimeout(() => {
              setSrcUrl(null);
              history.go(0);
            }, 2000);
          }
        })
        .catch(err => console.log(err));
    }
  }

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
        { srcUrl && (
          <>
            <Divider />
            <Box
              alignItems="center"
              display="flex"
              flexDirection="column"
            >
              <ReactCrop
                src={srcUrl}
                crop={cropCfg}
                onChange={newCropCfg => setCropCfg(newCropCfg)}
                onComplete={onCropComplete}
                onImageLoaded={onLoad}
              />
            </Box>
            <Button
              color="primary"
              fullWidth
              style={{ textTransform: 'none' }}
              disabled={disableCrop}
              onClick={() => {
                setSrcUrl(croppedUrl);
                setDisableCrop(true);
                setDisableUpload(false);
              }}
            >
              Crop
            </Button>
            <Button
              color="primary"
              fullWidth
              style={{ textTransform: 'none' }}
              disabled={disableUpload}
              onClick={handleSubmit}
            >
              Upload
            </Button>
            <Button
              color="primary"
              fullWidth
              style={{ textTransform: 'none' }}
              disabled={disableCancel}
              onClick={() => { setSrcUrl(null) }}
            >
              Cancel
            </Button>
          </>
        )}
        <Divider />
        <CardActions>
          <input
            accept="image/*"
            hidden
            id="button-file"
            type="file"
            onChange={handleImgInput}
          />
          <label
            htmlFor="button-file"
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
      </Card>
    </>
  )
};

export default Profile;
