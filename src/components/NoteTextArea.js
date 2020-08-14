import React, { useEffect, useRef } from "react";
import moment from "moment";
import { useTheme, Typography } from "@material-ui/core";

const NoteTextArea = ({ match, content, onChangeHandler }) => {
    const theme = useTheme();
    const ref = useRef();
    const styles = {
        textArea: {
            width: "97.5%",
            height: "85.6vh",
            fontSize: "16px",
            marginLeft: "0px",
            background: "transparent",
            border: "none",
            outline: "0px",
            resize: "none",
            color: theme.palette.text.primary,
        },
        container: {
            height: "89.5vh",
            flex: "4",
            margin: "0px",
        },
    };

    useEffect(() => {
        ref.current.focus();
        ref.current.setSelectionRange(
            ref.current.value.length,
            ref.current.value.length
        );
    }, [ref]);

    return (
        <div style={styles.container}>
            <div
                style={{
                    width: "99%",
                    marginTop: "5px",
                }}
            >
                <Typography variant="body2" color="textSecondary">
                    {moment(content.createdOn).format("DD MMM YYYY [at] hh-mm")}
                </Typography>
            </div>
            <textarea
                ref={ref}
                style={styles.textArea}
                onChange={onChangeHandler}
                value={content.text}
            ></textarea>
        </div>
    );
};

export default NoteTextArea;
