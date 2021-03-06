import {
  Avatar,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import SearchIcon from "@material-ui/icons/Search";
import React, { useState } from "react";
import { connectSearchBox } from "react-instantsearch-dom";
import { Link, useHistory } from "react-router-dom";
import { logout, signInWithGoogle } from "../../firebase";
import "./header.scss";

function SearchBar({ currentRefinement, isSearchStalled, refine }) {
  return (
    <Grid container spacing={1} alignItems="flex-end" className="search">
      <Grid item style={{ width: "90%" }}>
        <TextField
          id="input-with-icon-grid"
          label="Which dataset are you looking for?"
          style={{ width: "100%" }}
          value={currentRefinement}
          onChange={(event) => refine(event.currentTarget.value)}
        />
      </Grid>
      {isSearchStalled ? (
        <Grid item>
          <CircularProgress size={25} />
        </Grid>
      ) : (
        <Grid item>
          <SearchIcon />
        </Grid>
      )}
    </Grid>
  );
}

export const CustomSearchBox = connectSearchBox(SearchBar);

export default function Header({ user }) {
  const [openDialog, setopenDialog] = useState(false);

  const handleClose = () => {
    setopenDialog(false);
  };

  const history = useHistory();

  const handleGoogleAuth = () => {
    signInWithGoogle()
      .then((result) => {
        console.log(result);
        setopenDialog(false);
      })
      .catch((e) => {
        console.log("error", e);
      });
  };

  const handleLogout = () => {
    logout()
      .then(() => {
        console.log("logout Successfull");
        setopenDialog(false);
      })
      .catch((e) => {
        console.log("error", e);
      });
  };

  return (
    <div id="header">
      <Link to="/" style={{ textDecoration: "none", color: "#000" }}>
        <h3>Auto Bot</h3>
      </Link>
      <section className="button-group">
        <button
          className="block round"
          onClick={() => {
            history.push("/buy");
          }}
        >
          Buy
        </button>
        <button
          className="block round"
          onClick={() => {
            history.push("/auction");
          }}
        >
          Auction
        </button>
        <button
          className="block round"
          onClick={() => {
            history.push("/sell");
          }}
        >
          Sell
        </button>
        <button
          className="block round"
          onClick={() => history.push("/top-hits")}
        >
          Today&apos;s Hits
        </button>
      </section>
      <CustomSearchBox />
      <div className="auth-btn">
        <button
          className="block round accent"
          onClick={() => {
            setopenDialog(true);
          }}
        >
          {user ? user.displayName : "Login"}
        </button>
        {user ? (
          <Avatar
            src={user.photoURL}
            className="round"
            style={{
              margin: "11px 0px 0px 8px",
              height: "48px",
              width: "48px",
            }}
          ></Avatar>
        ) : (
          ""
        )}
      </div>

      <Dialog
        maxWidth={"xs"}
        onClose={handleClose}
        open={openDialog}
        style={{ textAlign: "center" }}
      >
        <DialogTitle id="simple-dialog-title">
          {user ? "Logout From AutoBot" : "Login to AutoBot"}
        </DialogTitle>
        <DialogContent className="dialog-content">
          <Typography>Your destination for all the ML queries</Typography>
          <Typography>Your destination for all the ML queries.</Typography>
          <Typography>
            Stop searching for your desired dataset and start building
            immediately. We provide the data on your preferences.
          </Typography>
        </DialogContent>
        <DialogContent className="dialog-content">
          {user ? (
            <Button
              className="block round"
              style={{ padding: "8px 24px" }}
              onClick={handleLogout}
            >
              Logout
            </Button>
          ) : (
            <Button className="block round accent" onClick={handleGoogleAuth}>
              Google Sign In
            </Button>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
