"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
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
import { faBullseye, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const tallyDisplayStyles = {
    iconsWrapper: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        inset: 0,
    },
    rightSlash: {
        position: "absolute",
        fontSize: "2.5rem",
        lineHeight: 0,
        transform: "rotateZ(45deg)",
    },
    leftSlash: {
        position: "absolute",
        fontSize: "2.5rem",
        lineHeight: 0,
        transform: "rotateZ(-45deg)",
    },
    circle: {
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
                    <PanoramaFishEyeIcon fontSize={"large"} />
                </Box>
            </Box>
        );
    } else if (thisTally > 3) {
        return "+" + (thisTally - 3).toString();
    }
    return thisTally;
};

const CustomButtonGroup = ({
    player,
    rowValue,
    scoreboardState,
    setScoreboardState,
}: {
    player: Players;
    rowValue: ScoreboardNumbers;
    scoreboardState: ScoreboardState;
    setScoreboardState: Dispatch<SetStateAction<ScoreboardState>>;
}) => {
    const playerValue = scoreboardState[rowValue][player];
    const opponentValue =
        scoreboardState[rowValue][
            player == Players.one ? Players.two : Players.one
        ];

    const disableAdd = opponentValue >= 3 && playerValue >= 3;

    const handleAdd = () => {
        setScoreboardState((prev) => {
            const newScoreboardState = JSON.parse(JSON.stringify(prev));
            newScoreboardState[rowValue][player] = newScoreboardState[rowValue][
                player
            ] += 1;
            return newScoreboardState;
        });
    };

    const handleSubtract = () => {
        setScoreboardState((prev) => {
            const newScoreboardState = JSON.parse(JSON.stringify(prev));
            newScoreboardState[rowValue][player] -= 1;
            return newScoreboardState;
        });
    };

    const actionButtonStyles = {
        padding: "0px 3px",
        minWidth: "0px !important",
    };

    return (
        <ButtonGroup
            variant="contained"
            fullWidth={true}
            // sx={{ "& > button": { borderColor: "transparent !important" } }}
            color={"inherit"}
        >
            <Button
                size="small"
                sx={actionButtonStyles}
                color={"secondary"}
                onClick={handleSubtract}
                disabled={playerValue < 1}
            >
                <RemoveIcon fontSize="small" />
            </Button>
            <Button
                size="small"
                sx={{ minHeight: "40px", color: "inherit !important" }}
                disabled
            >
                <TallyDisplayBlock thisTally={playerValue} />
            </Button>
            <Button
                size="small"
                sx={actionButtonStyles}
                color={"primary"}
                onClick={handleAdd}
                disabled={disableAdd}
            >
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

enum Players {
    one = "player_one",
    two = "player_two",
}

enum ScoreboardNumbers {
    "_20" = 20,
    "_19" = 19,
    "_18" = 18,
    "_17" = 17,
    "_16" = 16,
    "_15" = 15,
    "_25" = 25,
}

const scoreboardRows: {
    label: string;
    value: ScoreboardNumbers;
    faIcon?: IconDefinition;
}[] = [
    {
        label: ScoreboardNumbers._20.toString(),
        value: ScoreboardNumbers._20,
    },
    {
        label: ScoreboardNumbers._19.toString(),
        value: ScoreboardNumbers._19,
    },
    {
        label: ScoreboardNumbers._18.toString(),
        value: ScoreboardNumbers._18,
    },
    {
        label: ScoreboardNumbers._17.toString(),
        value: ScoreboardNumbers._17,
    },
    {
        label: ScoreboardNumbers._16.toString(),
        value: ScoreboardNumbers._16,
    },
    {
        label: ScoreboardNumbers._15.toString(),
        value: ScoreboardNumbers._15,
    },
    {
        label: "bullseye",
        value: ScoreboardNumbers._25,
        faIcon: faBullseye,
    },
];

const cellStyles = {
    borderBottom: "none",
};

type ScoreboardState = {
    [key in ScoreboardNumbers]: {
        [key in Players]: number;
    };
};

const getInitialScoreboardState = () => {
    return scoreboardRows.reduce((accumulator, row) => {
        accumulator[row.value] = {
            [Players.one]: 0,
            [Players.two]: 0,
        };
        return accumulator;
    }, {} as ScoreboardState);
};

const CricketScoreboard = () => {
    const [scoreboardState, setScoreboardState] = useState<ScoreboardState>(
        getInitialScoreboardState()
    );

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
                                        <CustomButtonGroup
                                            player={Players.one}
                                            rowValue={row.value}
                                            scoreboardState={scoreboardState}
                                            setScoreboardState={
                                                setScoreboardState
                                            }
                                        />
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
                                                />
                                            ) : (
                                                row.label
                                            )}
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={cellStyles}>
                                        <CustomButtonGroup
                                            player={Players.two}
                                            rowValue={row.value}
                                            scoreboardState={scoreboardState}
                                            setScoreboardState={
                                                setScoreboardState
                                            }
                                        />
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
