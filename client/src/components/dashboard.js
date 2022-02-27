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
  const [color, setColor] = React.useState("#00000");
  const { isLoading, error, data } = useQuery("colordata", () =>
    api
      .get(`/preference/${localStorage.getItem("user")}`)
      .then((res) => res.data)
  );
  React.useEffect(() => {
    if (data && data.color) {
      setColor(data.color);
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
  });

  const logout = () => {
    localStorage.clear();
    history.push("/");
  };
  const handleChange = (event) => {
    setColor(event.target.value);
    api
      .post(`/preference/${localStorage.getItem("user")}`, {
        color: event.target.value,
      })
      .then((res) => {
        toast("Successfully saved your color preference");
      })
      .catch((err) => {
        toast("failed to save your preference");
      });
  };

  return (
    <Stack spacing={2} sx={{ flexGrow: 1 }}>
      <ThemeProvider theme={darkTheme}>
        <AppBar position="static" color="primary" enableColorOnDark>
          <Toolbar>
            {appBarLabel(localStorage.getItem("user"))}
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={color}
              label="Age"
              onChange={handleChange}
            >
              <MenuItem value={"#000000"}>Dark</MenuItem>
              <MenuItem value={"#0000FF"}>Blue</MenuItem>
              <MenuItem value={"#800080"}>Purple</MenuItem>
            </Select>
            <Button onClick={logout} color="inherit">
              Logout
            </Button>
          </Toolbar>
        </AppBar>
        <Container maxWidth="sm">
          Welcome {localStorage.getItem("user")}
        </Container>
      </ThemeProvider>
      <ToastContainer />
    </Stack>
  );
}
