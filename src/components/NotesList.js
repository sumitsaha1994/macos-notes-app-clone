import React, { useEffect, Fragment } from "react";
import {
    Switch,
    Link,
    Route,
    Redirect,
    useHistory,
    useLocation,
} from "react-router-dom";

import List from "@material-ui/core/List";
import moment from "moment";
import { ListItem, ListItemText, Divider, useTheme } from "@material-ui/core";
import { useState } from "react";
import NoteTextArea from "./NoteTextArea";

const NotesList = ({
    match,
    notes,
    setNotes,
    notesInitialRender,
    setNotesInitialRender,
}) => {
    // notes, selectedId, listItemClickHandler,
    const history = useHistory();
    const theme = useTheme();
    const styles = {
        listStyle: {
            textAlign: "left",
            paddingRight: "0px",
            listStyle: "none",
            margin: "0",
            flex: "1",
            height: "89.5vh",
            overflowY: "scroll",
            scrollbarWidth: "none",
            marginRight: "1px",
            paddingTop: "0px",
            paddingBottom: "0px",
            borderRight: `1px solid ${theme.palette.divider}`,
        },
    };

    // const [notes, setNotes] = useState(
    //     notesData
    //     //JSON.parse(window.localStorage.getItem("notes-data")).notes
    // );

    // const [notesInitialRender, setNotesInitialRender] = useState(
    //     isInitialRender
    // );
    const listItemClickHandler = (e, noteId) => {
        setNotes(
            notes.map((note) =>
                note.folderId.toString() === match.params.id.toString()
                    ? note.id === noteId
                        ? { ...note, selected: true }
                        : { ...note, selected: false }
                    : note
            )
        );
        console.log(e.target);
    };

    useEffect(() => {
        window.localStorage.setItem(
            "notes-data",
            JSON.stringify({
                ...JSON.parse(window.localStorage.getItem("notes-data")),
                notes,
            })
        );
    });

    const location = useLocation();
    useEffect(() => {
        const noteIdFromRoute = parseInt(location.pathname.split("note/")[1]);
        console.log(notesInitialRender, noteIdFromRoute);
        if (notesInitialRender && noteIdFromRoute) {
            setNotes(
                notes.map((note) =>
                    note.folderId.toString() === match.params.id.toString()
                        ? note.id === noteIdFromRoute
                            ? { ...note, selected: true }
                            : { ...note, selected: false }
                        : note
                )
            );
            setNotesInitialRender(false);
            console.log("init render", notesInitialRender);
        }
    }, [
        location,
        match.params.id,
        notes,
        notesInitialRender,
        setNotes,
        setNotesInitialRender,
    ]);

    const onChangeHandler = (e) => {
        setNotes(
            notes.map((note) =>
                note.selected &&
                note.folderId.toString() === match.params.id.toString()
                    ? { ...note, text: e.target.value }
                    : note
            )
        );
    };

    return (
        <>
            <List style={styles.listStyle}>
                {notes.filter(
                    (note) =>
                        note.folderId.toString() === match.params.id.toString()
                ).length ? (
                    notes
                        .filter(
                            (note) =>
                                note.folderId.toString() ===
                                match.params.id.toString()
                        )
                        .map((note) => (
                            <Fragment key={note.id}>
                                <Link
                                    to={`/folder/${match.params.id}/note/${note.id}`}
                                >
                                    <ListItem
                                        selected={note.selected}
                                        key={note.id}
                                        onClick={(e) =>
                                            listItemClickHandler(e, note.id)
                                        }
                                    >
                                        <ListItemText
                                            primary={
                                                note.text
                                                    ? note.text.length > 18
                                                        ? `${note.text.slice(
                                                              0,
                                                              19
                                                          )} ...`
                                                        : note.text
                                                    : "New Note"
                                            }
                                            secondary={moment(
                                                note.createdOn
                                            ).format("DD-MMM-YYYY")}
                                        />
                                    </ListItem>
                                </Link>
                                <Divider variant="fullWidth" component="li" />
                            </Fragment>
                        ))
                ) : (
                    <p>Add note</p>
                )}
            </List>
            <Switch>
                <Route
                    path="/folder/:folderId/note/:noteId"
                    render={(props) => (
                        <NoteTextArea
                            onChangeHandler={onChangeHandler}
                            content={notes.find(
                                (note) =>
                                    note.id.toString() ===
                                    props.match.params.noteId.toString()
                            )}
                            {...props}
                        />
                    )}
                />
                {notes.find(
                    (note) =>
                        note.folderId.toString() === match.params.id.toString()
                ) ? (
                    <Route
                        path="/folder/:folderId"
                        render={(props) => (
                            <Redirect
                                to={`${history.location.pathname}/note/${
                                    notes.find(
                                        (note) =>
                                            note.folderId.toString() ===
                                                props.match.params.folderId.toString() &&
                                            note.selected
                                    ).id
                                }`}
                            />
                        )}
                    />
                ) : (
                    <NoteTextArea
                        onChangeHandler={onChangeHandler}
                        content={{}}
                    />
                )}
            </Switch>
        </>
    );
};

export default NotesList;
