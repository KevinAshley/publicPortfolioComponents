"use client";

import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { faBullseye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const tallyDisplayStyles = {
    iconsWrapper: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    rightSlash: {
        position: "absolute",
        fontSize: "2rem",
        lineHeight: 0,
        transform: "rotateZ(45deg)",
    },
    leftSlash: {
        position: "absolute",
        fontSize: "2rem",
        lineHeight: 0,
        transform: "rotateZ(-45deg)",
    },
    circle: {
        fontSize: "2rem",
        lineHeight: 0,
    },
};

const TallyDisplayBlock = (props: any) => {
    const { thisTally } = props;
    if (thisTally === 0) {
        return "";
    } else if (thisTally === 1) {
        return (
            <Box sx={tallyDisplayStyles.iconsWrapper}>
                <Box sx={tallyDisplayStyles.rightSlash}>|</Box>
            </Box>
        );
    } else if (thisTally === 2) {
        return (
            <Box sx={tallyDisplayStyles.iconsWrapper}>
                <Box sx={tallyDisplayStyles.rightSlash}>|</Box>
                <Box sx={tallyDisplayStyles.leftSlash}>|</Box>
            </Box>
        );
    } else if (thisTally === 3) {
        return (
            <Box sx={tallyDisplayStyles.iconsWrapper}>
                <Box sx={tallyDisplayStyles.rightSlash}>|</Box>
                <Box sx={tallyDisplayStyles.leftSlash}>|</Box>
                <Box sx={tallyDisplayStyles.circle}>
                    <PanoramaFishEyeIcon fontSize={"medium"} />
                </Box>
            </Box>
        );
    } else if (thisTally > 3) {
        return "+" + (thisTally - 3).toString();
    }
    return thisTally;
};

const CustomButtonGroup = (props: any) => {
    const {} = props;
    const actionButtonStyles = {
        padding: "0px 3px",
        minWidth: "0px !important",
    };
    return (
        <ButtonGroup
            variant="contained"
            fullWidth={true}
            sx={{ "& > button": { borderColor: "transparent !important" } }}
        >
            <Button
                size="small"
                sx={actionButtonStyles}
                color={"secondary"}
                disabled={true}
            >
                <RemoveIcon fontSize="small" />
            </Button>
            <Button
                size="small"
                sx={{ minHeight: "40px" }}
                color={"inherit"}
                disabled
            >
                <TallyDisplayBlock thisTally={3} />
            </Button>
            <Button size="small" sx={actionButtonStyles} color={"primary"}>
                <AddIcon fontSize="small" />
            </Button>
        </ButtonGroup>
    );
};

const numberStatusStyles = {
    status: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    closed: {
        opacity: 0.5,
    },
    crossedOut: {
        transform: "rotateZ(90deg)",
        position: "absolute",
        color: "#c10000",
        fontSize: "1.5rem",
    },
};

const NumberStatus = (props: any) => {
    const { label, isClosedOut } = props;
    const combinedStyles = isClosedOut
        ? {
              ...numberStatusStyles.status,
              ...numberStatusStyles.closed,
          }
        : numberStatusStyles.status;
    return (
        <Box sx={combinedStyles}>
            {label}
            {isClosedOut && <Box sx={numberStatusStyles.crossedOut}>|</Box>}
        </Box>
    );
};

const scoreboardRows = [
    {
        label: "20",
        value: 20,
    },
    {
        label: "19",
        value: 19,
    },
    {
        label: "18",
        value: 18,
    },
    {
        label: "17",
        value: 17,
    },
    {
        label: "16",
        value: 16,
    },
    {
        label: "15",
        value: 15,
    },
    {
        label: "bulls",
        value: 25,
        faIcon: faBullseye,
    },
];

const cellStyles = {
    borderBottom: "none",
};

const CricketScoreboard = () => {
    const [resetDialogIsOpen, setResetDialogIsOpen] = useState(false);
    const handleClickReset = () => {
        setResetDialogIsOpen(true);
    };
    const handleCloseReset = () => {
        setResetDialogIsOpen(false);
    };

    const handleResetAndClose = () => {
        // setTally(JSON.parse(JSON.stringify(startingTallyState)));
        setResetDialogIsOpen(false);
    };

    return (
        <Box sx={{ textAlign: "center" }}>
            <Paper
                sx={{
                    maxWidth: 400,
                    margin: "auto",
                    marginBottom: "2rem",
                    padding: "0.5rem 0 0.25rem 0",
                }}
                elevation={6}
            >
                <Table
                    sx={{
                        "& td,th": {
                            textAlign: "center",
                        },
                    }}
                    size={"small"}
                >
                    <TableHead>
                        <TableRow>
                            <TableCell sx={cellStyles}>
                                <Typography variant="h5">Player 1</Typography>
                            </TableCell>
                            <TableCell sx={cellStyles}></TableCell>
                            <TableCell sx={cellStyles}>
                                <Typography variant="h5">Player 2</Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {scoreboardRows.map((row, rowIndex) => {
                            return (
                                <TableRow key={rowIndex}>
                                    <TableCell sx={cellStyles}>
                                        <CustomButtonGroup />
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            ...cellStyles,
                                            minWidth: 0,
                                            padding: 0,
                                        }}
                                    >
                                        <Typography variant="h4">
                                            {row.faIcon ? (
                                                <FontAwesomeIcon
                                                    icon={row.faIcon}
                                                    // size={""}
                                                />
                                            ) : (
                                                row.label
                                            )}
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={cellStyles}>
                                        <CustomButtonGroup />
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                        <TableRow>
                            <TableCell sx={cellStyles}>
                                <Typography variant="h5">0</Typography>
                            </TableCell>
                            <TableCell sx={cellStyles}></TableCell>
                            <TableCell sx={cellStyles}>
                                <Typography variant="h5">0</Typography>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Paper>
            <Box>
                <Button
                    variant="outlined"
                    color="error"
                    onClick={handleClickReset}
                >
                    Reset Scoreboard
                </Button>
            </Box>

            <Dialog open={resetDialogIsOpen} onClose={handleCloseReset}>
                <DialogTitle>Confirmation</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to reset the scoreboard?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseReset}>Cancel</Button>
                    <Button onClick={handleResetAndClose} variant="contained">
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CricketScoreboard;
