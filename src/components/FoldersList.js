import React, { Fragment, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    useTheme,
    List,
    ListItem,
    ListItemText,
    Divider,
    Icon,
    Typography,
} from "@material-ui/core";

const FoldersList = ({ folders, setFolders, isInitialRender }) => {
    // const location = useLocation();
    // useEffect(() => {
    //     console.log(location);
    //     const ids = location.pathname.split("/folder/")[1].split("/note/");
    //     setFoldersHandler(parseInt(ids[0]), { openedNoteId: ids[1] });
    // }, [location, setFoldersHandler]);

    const theme = useTheme();
    const styles = {
        container: {
            textAlign: "left",
            paddingRight: "0px",
            display: "flex",
            margin: "0",
            flex: ".8",
            flexDirection: "column",
            height: "89.5vh",
            paddingTop: "0px",
            borderRight: `1px solid ${theme.palette.divider}`,
        },
        listStyle: {
            overflowY: "scroll",
            scrollbarWidth: "none",
            flex: "50",
            paddingTop: "0px",
        },
        buttonDivStyle: {
            flex: "1",
            justifyContent: "center",
            alignSelf: "center",
            display: "flex",
            flexDirection: "row",
            paddingTop: "10px",
            cursor: "pointer",
            paddingBottom: "10px",
        },
        addIcon: {
            marginRight: "2px",
            fontSize: "20px",
            alignSelf: "center",
        },
    };
    //const [folders, setFolders] = useState(foldersData);
    const [foldersInitialRender, setFoldersInitialRender] = useState(
        isInitialRender
    );
    const listItemClickHandler = (e, id) => {
        setFolders(
            folders.map((folder) =>
                folder.id === id
                    ? { ...folder, opened: true }
                    : { ...folder, opened: false }
            )
        );
    };

    useEffect(() => {
        window.localStorage.setItem(
            "notes-data",
            JSON.stringify({
                ...JSON.parse(window.localStorage.getItem("notes-data")),
                folders,
            })
        );
    });

    const location = useLocation();
    useEffect(() => {
        //console.log(location.pathname.split("folder/")[1]);
        if (location.pathname.split("folder/")[1]) {
            const folderIdFromRoute = parseInt(
                location.pathname.split("folder/")[1][0]
            );
            if (foldersInitialRender && folderIdFromRoute) {
                console.log(folderIdFromRoute);
                setFolders(
                    folders.map((folder) =>
                        folder.id === folderIdFromRoute
                            ? { ...folder, opened: true }
                            : { ...folder, opened: false }
                    )
                );
                setFoldersInitialRender(false);
            }
        }
    }, [location, foldersInitialRender, folders, setFolders]);

    //location, match.params.id, notes, notesInitialRender

    return (
        <div style={styles.container}>
            <List style={styles.listStyle}>
                {folders.map((folder) => (
                    <Fragment key={folder.id}>
                        <Link to={`/folder/${folder.id}`}>
                            <ListItem
                                selected={folder.opened}
                                onClick={(e) =>
                                    listItemClickHandler(e, folder.id)
                                }
                            >
                                <Icon>
                                    {folder.opened ? "folder_open" : "folder"}
                                </Icon>
                                <ListItemText primary={folder.name} />
                            </ListItem>
                        </Link>
                        <Divider variant="fullWidth" component="li" />
                    </Fragment>
                ))}
            </List>
            <div style={styles.buttonDivStyle}>
                <Icon style={styles.addIcon}>add_circle</Icon>
                <Typography variant="body1" color="textSecondary">
                    New Folder
                </Typography>
            </div>
        </div>
    );
};

export default FoldersList;
