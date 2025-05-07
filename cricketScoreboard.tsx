"use client";

import React, { ReactNode, useCallback, useMemo, useState } from "react";
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

const pointsNeededToClose = 3;

const tallyDisplayStyles = {
    iconsWrapper: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        inset: 0,
        fontSize: "2.5rem",
    },
    rightSlash: {
        position: "absolute",
        lineHeight: 0,
        transform: "rotateZ(45deg)",
    },
    leftSlash: {
        position: "absolute",
        lineHeight: 0,
        transform: "rotateZ(-45deg)",
    },
    circle: {
        lineHeight: 0,
    },
    count: {
        position: "absolute",
        fontSize: "1.5rem",
    },
};

const TallyDisplayBlock = ({ tally }: { tally: number }) => {
    switch (tally) {
        case 0:
            return "";
        case 1:
            return (
                <Box sx={tallyDisplayStyles.iconsWrapper}>
                    <Box sx={tallyDisplayStyles.rightSlash}>|</Box>
                </Box>
            );
        case 2:
            return (
                <Box sx={tallyDisplayStyles.iconsWrapper}>
                    <Box sx={tallyDisplayStyles.rightSlash}>|</Box>
                    <Box sx={tallyDisplayStyles.leftSlash}>|</Box>
                </Box>
            );
        case 3:
            return (
                <Box sx={tallyDisplayStyles.iconsWrapper}>
                    <Box sx={tallyDisplayStyles.rightSlash}>|</Box>
                    <Box sx={tallyDisplayStyles.leftSlash}>|</Box>
                    <Box sx={tallyDisplayStyles.circle}>
                        <PanoramaFishEyeIcon fontSize={"large"} />
                    </Box>
                </Box>
            );
        default:
            return (
                <Box sx={tallyDisplayStyles.iconsWrapper}>
                    <Box sx={tallyDisplayStyles.count}>
                        {"+" + (tally - pointsNeededToClose).toString()}
                    </Box>
                </Box>
            );
    }
};

interface AddOrSubtractActionIf {
    rowValue: ScoreboardNumbers;
    player: Players;
}

const CustomButtonGroup = ({
    player,
    rowValue,
    scoreboardState,
    handleAdd,
    handleSubtract,
}: {
    player: Players;
    rowValue: ScoreboardNumbers;
    scoreboardState: ScoreboardState;
    handleAdd: (params: AddOrSubtractActionIf) => void;
    handleSubtract: (params: AddOrSubtractActionIf) => void;
}) => {
    const playerValue = scoreboardState[rowValue][player];
    const opponentValue =
        scoreboardState[rowValue][
            player == Players.one ? Players.two : Players.one
        ];

    const disableAdd =
        opponentValue >= pointsNeededToClose &&
        playerValue >= pointsNeededToClose;

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
                onClick={() =>
                    handleSubtract({
                        rowValue,
                        player,
                    })
                }
                disabled={playerValue < 1}
            >
                <RemoveIcon fontSize="small" />
            </Button>
            <Button
                size="small"
                sx={{ minHeight: "40px", color: "inherit !important" }}
                disabled
            >
                <TallyDisplayBlock tally={playerValue} />
            </Button>
            <Button
                size="small"
                sx={actionButtonStyles}
                color={"primary"}
                onClick={() =>
                    handleAdd({
                        rowValue,
                        player,
                    })
                }
                disabled={disableAdd}
            >
                <AddIcon fontSize="small" />
            </Button>
        </ButtonGroup>
    );
};

const RowStatusWrapper = ({
    children,
    isClosedOut,
}: {
    children: ReactNode;
    isClosedOut?: boolean;
}) => {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Box
                sx={
                    isClosedOut
                        ? {
                              opacity: 0.3,
                          }
                        : undefined
                }
            >
                {children}
            </Box>
            {isClosedOut && (
                <Box
                    sx={{
                        transform: " translateX(3px) rotateZ(90deg)",
                        position: "absolute",
                        color: "#c10000",
                        fontSize: "2.5rem",
                    }}
                >
                    |
                </Box>
            )}
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
        value: ScoreboardNumbers;
        [Players.one]: number;
        [Players.two]: number;
    };
};

const getInitialScoreboardState = () => {
    return scoreboardRows.reduce((accumulator, row) => {
        accumulator[row.value] = {
            value: row.value,
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

    const handleClickReset = useCallback(() => {
        setResetDialogIsOpen(true);
    }, []);

    const handleCloseReset = useCallback(() => {
        setResetDialogIsOpen(false);
    }, []);

    const handleResetAndClose = useCallback(() => {
        setScoreboardState(getInitialScoreboardState());
        setResetDialogIsOpen(false);
    }, []);

    const handleAdd = useCallback(
        ({ rowValue, player }: AddOrSubtractActionIf) => {
            setScoreboardState((prev) => {
                const newScoreboardState = JSON.parse(JSON.stringify(prev));
                newScoreboardState[rowValue][player] = newScoreboardState[
                    rowValue
                ][player] += 1;
                return newScoreboardState;
            });
        },
        []
    );

    const handleSubtract = useCallback(
        ({ rowValue, player }: AddOrSubtractActionIf) => {
            setScoreboardState((prev) => {
                const newScoreboardState = JSON.parse(JSON.stringify(prev));
                newScoreboardState[rowValue][player] -= 1;
                return newScoreboardState;
            });
        },
        []
    );

    const scores = useMemo(
        () =>
            Object.values(scoreboardState).reduce(
                (accumulator, row) => {
                    const playerOneExtraPoints = Math.max(
                        row[Players.one] - pointsNeededToClose,
                        0
                    );
                    const playerTwoExtraPoints = Math.max(
                        row[Players.two] - pointsNeededToClose,
                        0
                    );
                    accumulator[Players.one] +=
                        row.value * playerOneExtraPoints;
                    accumulator[Players.two] +=
                        row.value * playerTwoExtraPoints;
                    return accumulator;
                },
                {
                    [Players.one]: 0,
                    [Players.two]: 0,
                }
            ),
        [scoreboardState]
    );

    return (
        <Box sx={{ textAlign: "center", userSelect: "none" }}>
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
                                <Typography variant="h4">Player 1</Typography>
                            </TableCell>
                            <TableCell sx={cellStyles}></TableCell>
                            <TableCell sx={cellStyles}>
                                <Typography variant="h4">Player 2</Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {scoreboardRows.map((row, rowIndex) => {
                            const rowIsClosedOut =
                                scoreboardState[row.value][Players.one] >= 3 &&
                                scoreboardState[row.value][Players.two] >= 3;
                            return (
                                <TableRow key={rowIndex}>
                                    <TableCell sx={cellStyles}>
                                        <CustomButtonGroup
                                            player={Players.one}
                                            rowValue={row.value}
                                            scoreboardState={scoreboardState}
                                            handleAdd={handleAdd}
                                            handleSubtract={handleSubtract}
                                        />
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            ...cellStyles,
                                            minWidth: 0,
                                            padding: 0,
                                        }}
                                    >
                                        <RowStatusWrapper
                                            isClosedOut={rowIsClosedOut}
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
                                        </RowStatusWrapper>
                                    </TableCell>
                                    <TableCell sx={cellStyles}>
                                        <CustomButtonGroup
                                            player={Players.two}
                                            rowValue={row.value}
                                            scoreboardState={scoreboardState}
                                            handleAdd={handleAdd}
                                            handleSubtract={handleSubtract}
                                        />
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                        <TableRow>
                            <TableCell sx={cellStyles}>
                                <Typography variant="h4">
                                    {scores[Players.one]}
                                </Typography>
                            </TableCell>
                            <TableCell sx={cellStyles}></TableCell>
                            <TableCell sx={cellStyles}>
                                <Typography variant="h4">
                                    {scores[Players.two]}
                                </Typography>
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
