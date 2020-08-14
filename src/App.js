import React, { useState, useEffect } from "react";
import {
    BrowserRouter as Router,
    Route,
    Switch,
    useLocation,
    useHistory,
    Redirect,
} from "react-router-dom";

import moment from "moment";
import logo from "./logo.svg";
import "./App.css";
import NotesList from "./components/NotesList";
import NoteTextArea from "./components/NoteTextArea";
import {
    useMediaQuery,
    ThemeProvider,
    createMuiTheme,
    Typography,
    Paper,
    Button,
    Toolbar,
    AppBar,
    IconButton,
    Icon,
    Tooltip,
} from "@material-ui/core";
import FoldersList from "./components/FoldersList";

function App() {
    const history = useHistory();
    const [mode, setMode] = useState("dark");
    const [initialRender, setinitialRender] = useState(true);
    const theme = createMuiTheme({
        palette: {
            type: mode,
        },
    });
    const [folders, setFolders] = useState(
        window.localStorage.getItem("notes-data") &&
            !!JSON.parse(window.localStorage.getItem("notes-data")).folders
            ? JSON.parse(window.localStorage.getItem("notes-data")).folders
            : [
                  { id: 1, name: "folder1", opened: true },
                  { id: 2, name: "folder2", opened: false },
                  { id: 3, name: "folder3", opened: false },
              ]
    );
    const [notes, setNotes] = useState(
        window.localStorage.getItem("notes-data") &&
            !!JSON.parse(window.localStorage.getItem("notes-data")).notes
            ? JSON.parse(window.localStorage.getItem("notes-data")).notes
            : [
                  {
                      id: 1,
                      folderId: 1,
                      text: "Cooking",
                      selected: false,
                      createdOn:
                          "Tue Aug 11 2020 01:18:03 GMT+0530 (India Standard Time)",
                  },
                  {
                      id: 2,
                      folderId: 1,
                      text: "Shopping",
                      selected: true,
                      createdOn:
                          "Tue Aug 11 2020 01:18:03 GMT+0530 (India Standard Time)",
                  },
                  {
                      id: 3,
                      folderId: 2,
                      text: "Riding",
                      selected: false,
                      createdOn:
                          "Tue Aug 11 2020 01:18:03 GMT+0530 (India Standard Time)",
                  },
                  {
                      id: 4,
                      folderId: 2,
                      text: "Cycle Riding",
                      selected: true,
                      createdOn:
                          "Tue Aug 12 2020 02:18:03 GMT+0530 (India Standard Time)",
                  },
                  {
                      id: 5,
                      folderId: 2,
                      text: "Bike Riding",
                      selected: false,
                      createdOn:
                          "Tue Aug 12 2020 02:18:03 GMT+0530 (India Standard Time)",
                  },
              ]
    );
    // useEffect(() => {
    //     window.localStorage.setItem(
    //         "notes-data",
    //         JSON.stringify({
    //             ...JSON.parse(window.localStorage.getItem("notes-data")),
    //             notes,
    //         })
    //     );
    // });

    // const setFoldersHandler = (id, updates) => {
    //     setFolders(
    //         folders.map((folder) =>
    //             folder.id.toString() === id.toString()
    //                 ? { ...folder, ...updates }
    //                 : folder
    //         )
    //     );
    // };
    const addNoteHandler = () => {
        const newNoteId = notes[notes.length - 1].id + 1;
        const openedFolderId = folders.find((folder) => folder.opened).id;
        setNotes([
            ...notes,
            {
                id: newNoteId,
                folderId: openedFolderId,
                text: "",
                selected: false,
                createdOn: Date(),
            },
        ]);
        setinitialRender(true);
        history.push(`/folder/${openedFolderId}/note/${newNoteId}`);
    };

    const deleteNoteHandler = () => {
        const openedFolderId = folders.find((folder) => folder.opened).id;
        const openedNote = notes.find(
            (note) => note.folderId === openedFolderId && note.selected
        );

        if (openedNote) {
            const openedNoteId = openedNote.id;
            const noteToBeSetOpened = notes.find(
                (note) => note.folderId === openedFolderId && !note.selected
            );
            setNotes(notes.filter((note) => note.id !== openedNoteId));
            setinitialRender(true);
            noteToBeSetOpened
                ? history.push(
                      `/folder/${openedFolderId}/note/${noteToBeSetOpened.id}`
                  )
                : history.push(`/folder/${openedFolderId}`);
        }
    };

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
                        setFolders={setFolders}
                        isInitialRender={true}
                    />

                    <Switch>
                        <Route
                            exact
                            path="/"
                            render={() => (
                                <Redirect
                                    to={`/folder/${
                                        folders.find((folder) => folder.opened)
                                            .id
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
                                    notesInitialRender={initialRender}
                                    setNotesInitialRender={setinitialRender}
                                    {...props}
                                />
                            )}
                        />
                    </Switch>
                </div>
            </Paper>
        </ThemeProvider>
    );
}

export default App;

// notes={notes}
//                                         selectedId={openedNote.id}
//                                         listItemClickHandler={
//                                             listItemClickHandler
//                                         }
