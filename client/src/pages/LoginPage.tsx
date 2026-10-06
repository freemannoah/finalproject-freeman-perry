import React from "react";

import { Box, Button, Grid, Typography } from "@mui/material";
import LoginForm from "../components/auth/LoginForm";
import CreateUserDialog from "../components/auth/CreateUserDialog";

export default function LoginPage() {

    const [
        createUserOpen,
        setCreateUserOpen,
    ] = React.useState(false);

    return (
        <Box>
            <CreateUserDialog
                open={createUserOpen}
                onClose={() => setCreateUserOpen(false)}
            />

            <Grid
                container
                spacing={1}
                sx={{display:"flex", margin: "8vh 0", flexDirection:"column", alignItems:"center"}}
            >
                <Grid
                    size={{ xs: 11, sm: 8, md: 5 }}
                    sx={{display:"flex", justifyContent:"center"}}
                >
                    <Typography
                        variant="h2"
                        sx={{fontWeight:"bold"}}
                    >
                        Welcome to
                    </Typography>
                </Grid>

                <Grid
                    size={{ xs: 11, sm: 8, md: 5 }}
                    sx={{display:"flex", justifyContent:"center"}}
                >
                    <Typography
                        variant="h2"
                        sx={{fontWeight:"bold"}}
                    >
                        Lost &amp; Found
                    </Typography>

                </Grid>

                <Grid
                    size={{ xs: 11, sm: 8, md: 5 }}
                    sx={{marginTop: "5vh"}}
                >
                    <LoginForm />
                </Grid>
                <Grid
                    size={{ xs: 11, sm: 8, md: 5 }}
                    sx={{marginTop: "5vh", display: "flex", flexDirection:"column", alignItems:"center"}}
                >
                    <Typography variant="h5">
                        No account?
                    </Typography>
                    <Typography variant="h5">
                        Create one here!
                    </Typography>
                </Grid>


                <Grid
                    size={{ xs: 11, sm: 8, md: 5 }}
                    sx={{display: "flex", justifyContent: "center"}}
                >
                    <Button
                        variant="contained"
                        onClick={() => setCreateUserOpen(true)}
                        sx={{height: "5vh", width: "15vw", fontSize: "1.2rem", minWidth: "180px",}}
                    >
                        Register
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
}