import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Button,
} from "@material-ui/core";

const FolderDialog = ({
    dialogOpen,
    handleDialogClose,
    folderName,
    folderRenamehandler,
}) => {
    const handleTextChange = (e) => {
        setFolderRenameText(e.target.value);
    };

    const [folderRenameText, setFolderRenameText] = useState(folderName);

    useEffect(() => {
        setFolderRenameText(folderName);
    }, [folderName]);

    return (
        <Dialog
            aria-labelledby="simple-dialog-title"
            open={dialogOpen}
            onClose={handleDialogClose}
        >
            <DialogTitle id="form-dialog-title">Rename Folder</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="folder-name"
                    type="text"
                    name="name"
                    value={folderRenameText}
                    onChange={handleTextChange}
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() =>
                        folderRenamehandler(
                            folderRenameText,
                            setFolderRenameText
                        )
                    }
                    color="default"
                >
                    Rename
                </Button>
                <Button onClick={handleDialogClose} color="default">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default FolderDialog;
