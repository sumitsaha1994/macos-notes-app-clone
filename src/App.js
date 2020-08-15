import React, { useState, useEffect, useRef } from "react";
import {
    Route,
    Switch,
    useLocation,
    useHistory,
    Redirect,
} from "react-router-dom";
import "./App.css";
import NotesList from "./components/NotesList";
import {
    ThemeProvider,
    createMuiTheme,
    Typography,
    Paper,
    Toolbar,
    AppBar,
    IconButton,
    Icon,
    Tooltip,
} from "@material-ui/core";
import FoldersList from "./components/FoldersList";
import FolderDialog from "./components/FolderDialog";

function App() {
    const history = useHistory();
    const location = useLocation();
    const [mode, setMode] = useState("dark");
    const willMount = useRef(true);

    const theme = createMuiTheme({
        palette: {
            type: mode,
        },
    });

    const [dialogOpen, setDialogOpen] = React.useState(false);
    const handleDialogClose = () => {
        setDialogOpen(false);
    };
    const reanmeFolderClickHandler = () => {
        setDialogOpen(true);
    };

    const [openedFolderId, setOpenedFolderId] = useState(
        window.localStorage.getItem("notes-data") &&
            JSON.parse(window.localStorage.getItem("notes-data")).openedFolderId
            ? JSON.parse(window.localStorage.getItem("notes-data"))
                  .openedFolderId
            : 3
    );

    const [folders, setFolders] = useState(
        window.localStorage.getItem("notes-data") &&
            !!JSON.parse(window.localStorage.getItem("notes-data")).folders
            ? JSON.parse(window.localStorage.getItem("notes-data")).folders
            : [
                  { id: 1, name: "Sample", openedNoteId: null },
                  { id: 2, name: "Office_notes", openedNoteId: 1 },
                  { id: 3, name: "Study", openedNoteId: 5 },
              ]
    );
    const folderRenamehandler = (folderRenameText, setFolderRenameText) => {
        if (folderRenameText.trim()) {
            setFolders(
                folders.map((folder) =>
                    folder.id === openedFolderId
                        ? { ...folder, name: folderRenameText }
                        : folder
                )
            );
            setFolderRenameText("");
            handleDialogClose();
        }
    };

    const [notes, setNotes] = useState(
        window.localStorage.getItem("notes-data") &&
            !!JSON.parse(window.localStorage.getItem("notes-data")).notes
            ? JSON.parse(window.localStorage.getItem("notes-data")).notes
            : [
                  {
                      id: 1,
                      folderId: 2,
                      text: "Fill timesheet",
                      createdOn:
                          "Tue Aug 11 2020 01:18:03 GMT+0530 (India Standard Time)",
                  },
                  {
                      id: 2,
                      folderId: 2,
                      text: "Job run",
                      createdOn:
                          "Tue Aug 11 2020 01:18:03 GMT+0530 (India Standard Time)",
                  },
                  {
                      id: 3,
                      folderId: 3,
                      text: "vue",
                      createdOn:
                          "Tue Aug 11 2020 01:18:03 GMT+0530 (India Standard Time)",
                  },
                  {
                      id: 4,
                      folderId: 3,
                      text: "Angular",
                      createdOn:
                          "Tue Aug 12 2020 02:18:03 GMT+0530 (India Standard Time)",
                  },
                  {
                      id: 5,
                      folderId: 3,
                      text: "React",
                      createdOn:
                          "Tue Aug 12 2020 02:18:03 GMT+0530 (India Standard Time)",
                  },
              ]
    );
    useEffect(() => {
        window.localStorage.setItem(
            "notes-data",
            JSON.stringify({
                ...JSON.parse(window.localStorage.getItem("notes-data")),
                notes,
                folders,
                openedFolderId,
                //openedNoteId,
            })
        );
    });

    const addNoteHandler = () => {
        const newNoteId =
            notes.reduce((accum, curr) => (accum.id > curr.id ? accum : curr))
                .id + 1;
        setNotes([
            ...notes,
            {
                id: newNoteId,
                folderId: openedFolderId,
                text: "",
                createdOn: Date(),
            },
        ]);
        history.push(`/folder/${openedFolderId}/note/${newNoteId}`);
    };

    const deleteNoteHandler = () => {
        // const openedFolderId = folders.find((folder) => folder.opened).id;
        const openedNoteId = folders.find(
            (folder) => folder.id === openedFolderId
        ).openedNoteId;

        if (openedNoteId) {
            const noteToBeSetOpened = notes
                .sort((a, b) => b.id - a.id)
                .find(
                    (note) =>
                        note.folderId === openedFolderId &&
                        note.id !== openedNoteId
                );
            setNotes(notes.filter((note) => note.id !== openedNoteId));
            // setinitialRender(true);
            noteToBeSetOpened
                ? history.push(
                      `/folder/${openedFolderId}/note/${noteToBeSetOpened.id}`
                  )
                : history.push(`/folder/${openedFolderId}`);
        }
    };

    useEffect(() => {
        return history.listen((location, action) => {
            let folderId;
            if (location.pathname.includes("folder")) {
                folderId = parseInt(
                    location.pathname.split("folder/")[1].split("/")[0]
                );
                setOpenedFolderId(folderId);
            }
            if (location.pathname.includes("note")) {
                setFolders(
                    folders.map((folder) =>
                        folder.id === folderId
                            ? {
                                  ...folder,
                                  openedNoteId: parseInt(
                                      location.pathname.split("note/")[1]
                                  ),
                              }
                            : folder
                    )
                );
            }
        });
    });

    if (willMount.current) {
        let folderId, noteId;
        if (location.pathname.includes("folder")) {
            folderId = parseInt(
                location.pathname.split("folder/")[1]?.split("/")[0]
            );
            if (folderId) {
                setOpenedFolderId(folderId);
            }
        }

        if (location.pathname.includes("note")) {
            noteId = parseInt(location.pathname.split("note/")[1]);
            if (noteId) {
                setFolders(
                    folders.map((folder) =>
                        folder.id === folderId
                            ? {
                                  ...folder,
                                  openedNoteId: parseInt(
                                      location.pathname.split("note/")[1]
                                  ),
                              }
                            : folder
                    )
                );
            }
        }
        willMount.current = false;
    }

    return (
        <ThemeProvider theme={theme}>
            <Paper style={{ width: "100%", height: "100%" }}>
                <AppBar
                    position="static"
                    variant="outlined"
                    color="transparent"
                >
                    <Toolbar
                        style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                        <Typography
                            color="textPrimary"
                            variant="h4"
                            style={{ flexGrow: 1 }}
                        >
                            Notes
                        </Typography>
                        <Tooltip
                            title="Rename folder"
                            aria-label="Rename Folder"
                        >
                            <IconButton
                                color="default"
                                aria-label="Rename folder"
                                onClick={reanmeFolderClickHandler}
                            >
                                <Icon>edit</Icon>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Add note" aria-label="Add Note">
                            <IconButton
                                color="default"
                                aria-label="Add note"
                                onClick={addNoteHandler}
                            >
                                <Icon>note_add</Icon>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete note" aria-label="delete note">
                            <IconButton
                                color="default"
                                aria-label="delete note"
                                onClick={deleteNoteHandler}
                            >
                                <Icon>delete_outline</Icon>
                            </IconButton>
                        </Tooltip>
                        <Tooltip
                            title="Toggle light/dark theme"
                            aria-label="Toggle light/dark theme"
                        >
                            <IconButton
                                color="default"
                                aria-label="change theme"
                                onClick={() =>
                                    setMode(mode === "dark" ? "light" : "dark")
                                }
                            >
                                <Icon>brightness_4</Icon>
                            </IconButton>
                        </Tooltip>
                    </Toolbar>
                </AppBar>
                <div
                    className="App"
                    style={{
                        display: "flex",
                        width: "100%",
                    }}
                >
                    <FoldersList
                        folders={folders}
                        notes={notes}
                        setFolders={setFolders}
                        openedFolderId={openedFolderId}
                        setOpenedFolderId={setOpenedFolderId}
                    />

                    <Switch>
                        <Route
                            exact
                            path="/"
                            render={() => (
                                <Redirect
                                    to={`/folder/${
                                        folders.find(
                                            (folder) =>
                                                folder.id === openedFolderId
                                        ).id
                                    }`}
                                />
                            )}
                        />
                        <Route
                            exact
                            path="/folder"
                            render={() => (
                                <Redirect
                                    to={`/folder/${
                                        folders.find(
                                            (folder) =>
                                                folder.id === openedFolderId
                                        ).id
                                    }`}
                                />
                            )}
                        />
                        <Route
                            path="/folder/:id"
                            component={(props) => (
                                <NotesList
                                    folder={folders.find(
                                        (folder) =>
                                            folder.id.toString() ===
                                            props.match.params.id.toString()
                                    )}
                                    notes={notes}
                                    setNotes={setNotes}
                                    openedFolderId={openedFolderId}
                                    setFolders={setFolders}
                                    {...props}
                                />
                            )}
                        />
                    </Switch>
                </div>
            </Paper>
            <FolderDialog
                dialogOpen={dialogOpen}
                handleDialogClose={handleDialogClose}
                folderName={
                    folders.find((folder) => folder.id === openedFolderId)?.name
                }
                folderRenamehandler={folderRenamehandler}
            />
        </ThemeProvider>
    );
}

export default App;
