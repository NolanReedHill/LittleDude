import {
    AppBar, Toolbar, Button, Box, IconButton, ButtonGroup, Typography, Snackbar,
    Alert, Dialog, DialogActions, DialogTitle, Drawer, List, ListItem, ListItemButton, ListItemText, Divider
} from '@mui/material'
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from 'react-router-dom';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect } from 'react';
import Cookies from "universal-cookie";
import useWindowSize from './useWindowSize';

export default function Navbar({ setIsAuth, isAuth, client }) {

    const allGames = ["minesweeper", "tic-tac-toe", "checkers"];


    const [logout, setLogout] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [openDrawer, setOpenDrawer] = useState(false);
    const cookies = new Cookies();

    const size = useWindowSize();

    const logOut = () => {
        setLogout(true);
        cookies.remove("token");
        cookies.remove("userId");
        cookies.remove("firstName");
        cookies.remove("lastName");
        cookies.remove("hashedPassword");
        cookies.remove("channelName");
        cookies.remove("username");
        client.disconnectUser();
        setIsAuth(false);
    };

    useEffect(() => {
        if (size.width > 800)
            setOpenDrawer(false);
    }, [size]);

    return (
        <>
            <AppBar >
                <Toolbar>
                    {size.width >= 800 &&
                        <>
                            <IconButton component={Link} to={"/"}>
                                <HomeIcon sx={{ color: "white" }} />
                            </IconButton>
                            {cookies.get("username") &&
                                <Typography sx={{ marginRight: "1%", marginTop: ".1%" }}>Hello, {cookies.get("username")}</Typography>}
                            <ButtonGroup disableElevation >
                                {allGames.map((game, index) =>
                                    <Button sx={{ color: "white" }} className='navButtons' component={Link} to={"/" + game} key={index}>
                                        {game.replaceAll("-", " ")}
                                    </Button>
                                )}
                            </ButtonGroup>
                        </>}
                    {size.width < 800 &&
                        <>
                            <IconButton sx={{ color: "white" }} onClick={() => setOpenDrawer(true)}>
                                <MenuIcon fontSize='large' />
                            </IconButton>
                            <Drawer
                                anchor='left'
                                open={openDrawer}
                                onClose={() => setOpenDrawer(false)}
                            >
                                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <IconButton sx={{ color: "black" }} component={Link} to={"/"} onClick={() => setOpenDrawer(false)}>
                                        <HomeIcon fontSize='large' />
                                    </IconButton>
                                    {cookies.get("username") &&
                                        <h2>Hello, {cookies.get("username")}</h2>}
                                    <IconButton onClick={() => setOpenDrawer(false)}>
                                        <CloseIcon fontSize="large" />
                                    </IconButton>
                                </Box>
                                <Divider color="black" />
                                <h3>All Games:</h3>
                                <List
                                    disablePadding
                                    sx={{ width: { xs: "70vw", sm: "300px" }, mb: "75px" }}>
                                    {allGames.map((game, index) =>
                                        <ListItem key={index} sx={{ py: "0" }}>
                                            <ListItemButton
                                                component={Link}
                                                to={"/" + game}
                                                onClick={() => setOpenDrawer(false)}>
                                                <ListItemText
                                                    primary={game}
                                                    primaryTypographyProps={{
                                                        fontSize: "calc(16px + 0.3vw)",
                                                    }} />
                                            </ListItemButton>

                                        </ListItem>
                                    )}
                                </List>
                            </Drawer>
                        </>}
                    {isAuth ?
                        <IconButton onClick={() => setIsOpen(true)} component={Link} to={"/"} title='Logout'>
                            <LogoutIcon sx={{ color: "white", position: "fixed", right: "2%" }} />
                        </IconButton>
                        :
                        <IconButton component={Link} to={"/login"} title='Login'>
                            <LoginIcon sx={{ color: "white", position: "fixed", right: "2%" }} />
                        </IconButton>}
                    <Box sx={{ flexGrow: 1 }}></Box>
                </Toolbar>
            </AppBar>
            <Toolbar />
            <Dialog open={isOpen}
                onClose={() => setIsOpen(false)}>
                <DialogTitle>
                    Logout?
                </DialogTitle>
                <DialogActions>
                    <Button onClick={() => {
                        setIsOpen(false);
                        logOut();
                    }}
                        color="primary">
                        Confirm</Button>
                    <Button onClick={() => setIsOpen(false)} color='error'>Go Back</Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={logout} autoHideDuration={4000} onClose={() => setLogout(false)}>
                <Alert onClose={() => setLogout(false)} severity="success" sx={{ width: '100%' }}>Logged out of account</Alert>
            </Snackbar>
        </>
    )
}