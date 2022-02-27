import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import history from "../history";
import { useQuery } from "react-query";
import api from "../apis/users";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Container from "@mui/material/Container";
import { useSelector, useDispatch } from "react-redux";
import { fetchColor, editColorPreference,signOut } from "../actions";
import { GithubPicker } from 'react-color';
function appBarLabel(label) {
  return (
    <>
      <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
        <MenuIcon />
      </IconButton>
      <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
        {label}
      </Typography>
    </>
  );
}
export default function Dashboard() {
  const { color } = useSelector((state) => state.preference);
  const { userId } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const { isLoading, error, data } = useQuery("colordata", () =>
    api
      .get(`/preference/${localStorage.getItem("user")}`)
      .then((res) => res.data)
  );
  React.useEffect(() => {
    if (data && data.color) {
      dispatch(fetchColor(data.color));
    }
  }, [data]);

  if (isLoading)
    return (
      <Box sx={{ display: "flex" }}>
        <CircularProgress />
      </Box>
    );

  if (error) return "An error has occurred: " + error.message;

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: color,
      },
    },
      typography: {
        poster: {
          color: color,
        },
        h3: undefined,
      },
  });

  const logout = () => {
    localStorage.clear();
    history.push("/");
    dispatch(signOut())
  };

  const handleChange = (event) => {
    dispatch(editColorPreference(event.target.value));
  };

  return (
    <Stack spacing={2} sx={{ flexGrow: 1 }}>
      <ThemeProvider theme={darkTheme}>
        <AppBar position="static" color="primary" enableColorOnDark>
          <Toolbar>
            {appBarLabel(userId)}
            {/* <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={color}
              label="Age"
              onChange={handleChange}
            >
              <MenuItem value={"#00000"}>Dark</MenuItem>
              <MenuItem value={"#0000FF"}>Blue</MenuItem>
              <MenuItem value={"#800080"}>Purple</MenuItem>
            </Select> */}
            <GithubPicker color={color} onChangeComplete={(color) => dispatch(editColorPreference(color.hex))}/>
            <Button onClick={logout} color="inherit">
              Logout
            </Button>
          </Toolbar>
        </AppBar>
        <Container maxWidth="sm" >
          <Typography variant="poster">Welcome {userId}</Typography>
        </Container>
      </ThemeProvider>
      <ToastContainer />
    </Stack>
  );
}
