import React, { Fragment } from "react";
import { Switch, Link, Route, Redirect } from "react-router-dom";

import List from "@material-ui/core/List";
import moment from "moment";
import { ListItem, ListItemText, Divider, useTheme } from "@material-ui/core";

import NoteTextArea from "./NoteTextArea";

const NotesList = ({ match, folder, notes, setNotes }) => {
    const theme = useTheme();
    const styles = {
        listStyle: {
            textAlign: "left",
            paddingRight: "0px",
            listStyle: "none",
            margin: "0",
            flex: "1",
            height: "90.2vh",
            overflowY: "scroll",
            scrollbarWidth: "none",
            marginRight: "1px",
            paddingTop: "0px",
            paddingBottom: "0px",
            justifyContent: "center",
            borderRight: `1px solid ${theme.palette.divider}`,
        },
    };

    const onChangeHandler = (e) => {
        setNotes(
            notes.map((note) =>
                note.id === folder.openedNoteId &&
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
                        .sort((a, b) => b.id - a.id)
                        .map((note) => (
                            <Fragment key={note.id}>
                                <Link
                                    to={`/folder/${match.params.id}/note/${note.id}`}
                                >
                                    <ListItem
                                        selected={
                                            note.id === folder.openedNoteId
                                        }
                                        key={note.id}
                                        // onClick={(e) =>
                                        //     listItemClickHandler(e, note.id)
                                        // }
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
                    <ListItem>Folder empty, start adding notes</ListItem>
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
                                to={`/folder/${
                                    props.match.params.folderId
                                }/note/${
                                    notes.find(
                                        (note) =>
                                            note.folderId.toString() ===
                                                props.match.params.folderId.toString() &&
                                            note.id === folder.openedNoteId
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
