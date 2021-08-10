import React from 'react';
import { fade, makeStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import InputBase from '@material-ui/core/InputBase';
import ListItemText from '@material-ui/core/ListItemText';
import SearchIcon from '@material-ui/icons/Search';
import { searchTicker } from '../../utils/DataAPI';


const useStyles = makeStyles((theme) => ({
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '46%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: '28ch',
    },
    [theme.breakpoints.up('lg')]: {
      marginLeft: theme.spacing(3),
      width: '33ch',
    },
  },
  // searchOptions: {
    
  // },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    paddingLeft: '1em',
    transition: theme.transitions.create('width'),
    height: 30,
  },
}));

const Option = (props) => {
  const { option } = props;
  return <ListItemText primary={option.symbol} secondary={option.longname || option.shortname} />;
}

export default function Search(props) {
  const { onSearch } = props;
  const classes = useStyles();

  const [searchRes, setSearchRes] = React.useState([]);

  const handleOptionFetch = (str) => {
    searchTicker(str)
    .then(res => setSearchRes(res))
    .catch(err => console.log(err));
  }

  const handleSearchClick = (symbol) => {
    onSearch(symbol);
  }

  return (
    <Autocomplete
      id="autocomplete"
      freeSolo
      options={searchRes}
      getOptionLabel={(option) => option ? <Option option={option} /> : ""}
      filterOptions={x => x}  // don't filter options
      classes={{
        root: classes.search, 
        // paper: classes.searchOptions 
      }}
      onChange={(ev, val) => {
        if (val && val.symbol) {
          handleSearchClick(val.symbol);
        }
      }}
      onInputChange={(ev, val) => handleOptionFetch(val)}
      renderInput={(params) => (
        <InputBase
          ref={params.InputProps.ref}
          inputProps={params.inputProps}
          autoFocus
          placeholder="Search stock here"
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          endAdornment={
            <SearchIcon style={{ marginLeft: 10, marginRight: 5 }} />
          }
        />
      )}
    />
  );
}