import React, { Fragment } from "react";
import { Link, useHistory } from "react-router-dom";
import {
    useTheme,
    List,
    ListItem,
    ListItemText,
    Divider,
    Icon,
    Typography,
    Chip,
} from "@material-ui/core";

const FoldersList = ({ folders, notes, setFolders, openedFolderId }) => {
    const history = useHistory();
    const theme = useTheme();
    const styles = {
        container: {
            textAlign: "left",
            paddingRight: "0px",
            display: "flex",
            margin: "0",
            flex: ".8",
            flexDirection: "column",
            height: "90.2vh",
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
    const handleAddFolder = () => {
        const newFolderId =
            folders.reduce((accum, curr) => (accum.id > curr.id ? accum : curr))
                .id + 1;
        setFolders([
            ...folders,
            {
                id: newFolderId,
                name: "New Folder",
                openedNoteId: null,
            },
        ]);
        history.push(`/folder/${newFolderId}`);
    };
    return (
        <div style={styles.container}>
            <List style={styles.listStyle}>
                {folders
                    .sort((a, b) => b.id - a.id)
                    .map((folder) => (
                        <Fragment key={folder.id}>
                            <Link to={`/folder/${folder.id}`}>
                                <ListItem
                                    selected={folder.id === openedFolderId}
                                >
                                    <Icon
                                        style={{
                                            marginRight: theme.spacing(0.5),
                                        }}
                                    >
                                        {folder.id === openedFolderId
                                            ? "folder_open"
                                            : "folder"}
                                    </Icon>
                                    <ListItemText primary={folder.name} />
                                    <Chip
                                        label={
                                            notes.filter(
                                                (note) =>
                                                    note.folderId === folder.id
                                            ).length
                                        }
                                        size="small"
                                        color="default"
                                    />
                                </ListItem>
                            </Link>
                            <Divider variant="fullWidth" component="li" />
                        </Fragment>
                    ))}
            </List>
            <div style={styles.buttonDivStyle} onClick={handleAddFolder}>
                <Icon style={styles.addIcon}>add_circle</Icon>
                <Typography variant="body1" color="textSecondary">
                    New Folder
                </Typography>
            </div>
        </div>
    );
};

export default FoldersList;
