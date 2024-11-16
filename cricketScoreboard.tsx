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
import PortfolioItemHeader from "@/components/portfolioItemHeader";

const scoreboardRow = [
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
    },
];

const startingTallyState = scoreboardRow.map(() => {
    return {
        playerOne: 0,
        playerTwo: 0,
    };
});

const tallyDisplayStyles = {
    iconsWrapper: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    rightSlash: {
        position: "absolute",
        fontSize: "1.5rem",
        lineHeight: 0,
        transform: "rotateZ(45deg)",
    },
    leftSlash: {
        position: "absolute",
        fontSize: "1.5rem",
        lineHeight: 0,
        transform: "rotateZ(-45deg)",
    },
    circle: {
        fontSize: "1.5rem",
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
                    <PanoramaFishEyeIcon fontSize="small" />
                </Box>
            </Box>
        );
    } else if (thisTally > 3) {
        return "+" + (thisTally - 3).toString();
    }
    return thisTally;
};

const buttonGroupStyles = {
    middleButton: {
        minWidth: "50px",
        minHeight: "40px",
        paddingLeft: "5px !important",
        paddingRight: "5px !important",
        color: "#6f6f6f !important",
    },
    outerButton: {
        minWidth: "40px !important",
        paddingLeft: "5px !important",
        paddingRight: "5px !important",
    },
};

const CustomButtonGroup = (props: any) => {
    const { color, itemIndex, player, playerTally, updateTally, isClosedOut } =
        props;
    // const itemTally = tally[itemIndex];
    // const thisPlayersItemTally = itemTally[player];

    const handleSubtract = () => {
        let newValue = playerTally - 1;
        if (newValue < 0) {
            newValue = 0;
        }
        updateTally({
            player,
            itemIndex,
            newValue,
        });
    };
    const handleAddition = () => {
        let newValue = playerTally + 1;
        updateTally({
            player,
            itemIndex,
            newValue,
        });
    };
    return (
        <div
            style={{
                margin: "0.5rem 0",
            }}
        >
            <ButtonGroup variant="contained">
                <Button
                    {...{ color }}
                    onClick={handleSubtract}
                    disabled={playerTally === 0}
                    sx={buttonGroupStyles.outerButton}
                >
                    <RemoveIcon fontSize="small" />
                </Button>
                <Button disabled sx={buttonGroupStyles.middleButton}>
                    <TallyDisplayBlock thisTally={playerTally} />
                </Button>
                <Button
                    {...{ color }}
                    onClick={handleAddition}
                    disabled={isClosedOut}
                    sx={buttonGroupStyles.outerButton}
                >
                    <AddIcon fontSize="small" />
                </Button>
            </ButtonGroup>
        </div>
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

const scoreboardStyles = {
    row: {
        display: "flex",
        width: "100%",
        justifyContent: "space-between",
    },
    resetContainer: {
        textAlign: "center",
        marginTop: "2rem",
    },
};

const players = ["playerOne", "playerTwo"];

const CricketScoreboard = ({
    label,
    pageDescription,
    github,
}: {
    label: string;
    pageDescription: string;
    github?: string;
}) => {
    const [tally, setTally] = useState(
        JSON.parse(JSON.stringify(startingTallyState))
    );
    const [resetDialogIsOpen, setResetDialogIsOpen] = useState(false);
    const handleClickOpen = () => {
        setResetDialogIsOpen(true);
    };
    const handleClose = () => {
        setResetDialogIsOpen(false);
    };

    const handleResetAndClose = () => {
        setTally(JSON.parse(JSON.stringify(startingTallyState)));
        setResetDialogIsOpen(false);
    };

    const updateTally = (params: any) => {
        const { player, itemIndex, newValue } = params;
        const newTally = [...tally];
        newTally[itemIndex][player] = newValue;
        setTally(newTally);
    };

    let playerScores: any = {
        playerOne: 0,
        playerTwo: 0,
    };
    tally.forEach((item: any, itemIndex: number) => {
        const rowValue = scoreboardRow[itemIndex].value;
        players.forEach((thisPlayer) => {
            if (item[thisPlayer] > 3) {
                playerScores[thisPlayer] += (item[thisPlayer] - 3) * rowValue;
            }
        });
    });

    return (
        <div>
            <PortfolioItemHeader
                heading={label}
                description={pageDescription}
                githubLink={github}
            />
            <Paper
                sx={{
                    maxWidth: 400,
                    margin: "auto",
                    overflow: "hidden",
                    padding: "2rem 1rem",
                }}
            >
                <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                >
                    <div>Player1</div>
                    <div>Player2</div>
                </div>
                <hr />
                {scoreboardRow.map((row, itemIndex) => {
                    const itemTally = tally[itemIndex];
                    const playerOneTally = itemTally["playerOne"];
                    const playerTwoTally = itemTally["playerTwo"];
                    const isClosedOut =
                        playerOneTally >= 3 && playerTwoTally >= 3;
                    const commonProps = {
                        itemIndex,
                        updateTally,
                        isClosedOut,
                    };
                    return (
                        <Box key={itemIndex} sx={scoreboardStyles.row}>
                            <CustomButtonGroup
                                color="primary"
                                {...{
                                    playerTally: playerOneTally,
                                    player: "playerOne",
                                    ...commonProps,
                                }}
                            />
                            <NumberStatus
                                label={row.label}
                                {...{ isClosedOut }}
                            />
                            <CustomButtonGroup
                                color="secondary"
                                {...{
                                    playerTally: playerTwoTally,
                                    player: "playerTwo",
                                    ...commonProps,
                                }}
                            />
                        </Box>
                    );
                })}
                <hr />
                <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                >
                    {players.map((thisPlayer, index) => {
                        return (
                            <div key={index}>{playerScores[thisPlayer]}</div>
                        );
                    })}
                </div>
            </Paper>
            <Box sx={scoreboardStyles.resetContainer}>
                <Button
                    variant="outlined"
                    color="error"
                    onClick={handleClickOpen}
                >
                    Reset Scoreboard
                </Button>
            </Box>

            <Dialog open={resetDialogIsOpen} onClose={handleClose}>
                <DialogTitle>Confirmation</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to reset the scoreboard?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleResetAndClose} variant="contained">
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default CricketScoreboard;
