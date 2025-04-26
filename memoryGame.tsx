"use client";

import React, { useState, useEffect, ReactNode } from "react";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";

import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import AirportShuttleIcon from "@mui/icons-material/AirportShuttle";
import AnchorIcon from "@mui/icons-material/Anchor";
import BackHandIcon from "@mui/icons-material/BackHand";
import BalanceIcon from "@mui/icons-material/Balance";
import CastleIcon from "@mui/icons-material/Castle";

const cardIcons = [
    AcUnitIcon,
    AirportShuttleIcon,
    AnchorIcon,
    BackHandIcon,
    BalanceIcon,
    CastleIcon,
];

interface CardObjectIf {
    id: number;
    iconIndex: number;
    selected: boolean;
    matched: boolean;
    sort: number;
}

const cardObjects: CardObjectIf[] = cardIcons.map((icon, index) => {
    return {
        id: -1,
        iconIndex: index,
        selected: false,
        matched: false,
        sort: 0,
    };
});

const fullDeckOfCards = [...cardObjects, ...cardObjects].map(
    (cardObject, cardIndex) => ({
        ...cardObject,
        id: cardIndex,
    })
);

const getShuffledDeck = () => {
    return fullDeckOfCards
        .map((card) => ({ ...card, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort);
};

interface CardIf extends CardObjectIf {
    children: ReactNode;
    isFlashing: boolean;
}

const Card = (props: CardIf) => {
    const { selected, matched, isFlashing, children } = props;
    return (
        <Paper
            sx={{
                backgroundColor:
                    isFlashing || selected
                        ? "var(--mui-palette-subtleHighlight)"
                        : undefined,
                padding: 4,
                textAlign: "center",
                cursor: matched ? "auto" : "pointer",
            }}
            elevation={matched ? 0 : 5}
        >
            {children}
        </Paper>
    );
};

const MemoryGame = () => {
    const [cards, setCards] = useState<CardObjectIf[]>(fullDeckOfCards);
    const [flashing, setFlashing] = useState<number[]>([]);
    const [resetDialogIsOpen, setResetDialogIsOpen] = useState(false);
    const [movesCount, setMovesCount] = useState(0);
    const [winnerDialogOpen, setWinnerDialogOpen] = useState(false);

    const toggleResetDialog = () => {
        setResetDialogIsOpen((prev) => !prev);
    };

    const resetAll = () => {
        setCards(getShuffledDeck());
        setMovesCount(0);
        setWinnerDialogOpen(false);
    };

    const handleResetAndClose = () => {
        // setTally(JSON.parse(JSON.stringify(startingTallyState)));
        setResetDialogIsOpen(false);
        resetAll();
    };

    useEffect(() => {
        setCards(getShuffledDeck());
        // shuffle the deck when the page mounts
    }, []);

    useEffect(() => {
        if (flashing.length) {
            setTimeout(() => {
                setFlashing([]);
            }, 500);
        }
    }, [flashing]);

    const matchedCards = cards.filter((card) => {
        return card.matched;
    });

    const winner = cards.length === matchedCards.length;

    useEffect(() => {
        if (winner) {
            setWinnerDialogOpen(true);
        }
    }, [winner]);

    const toggleWinnerDialog = () => {
        setWinnerDialogOpen(false);
    };

    const handleCardClick = (clickedCard: CardObjectIf) => {
        const newCards: CardObjectIf[] = [...cards];
        const clickedCardIndex = newCards.findIndex(
            (card) => card.id === clickedCard.id
        );
        const selectedCardIndex = newCards.findIndex((card) => !!card.selected);
        const selectedCard = newCards[selectedCardIndex];

        if (selectedCardIndex === -1) {
            /// make a selection
            newCards[clickedCardIndex].selected = true;
        } else if (selectedCardIndex === clickedCardIndex) {
            /// undo selection
            newCards[selectedCardIndex].selected = false;
        } else if (clickedCard.iconIndex === selectedCard.iconIndex) {
            /// correct selection
            newCards[selectedCardIndex].selected = false;
            newCards[selectedCardIndex].matched = true;
            newCards[clickedCardIndex].matched = true;
            setFlashing([clickedCard.id, selectedCard.id]);
            setMovesCount(movesCount + 1);
        } else {
            /// wrong selection
            newCards[selectedCardIndex].selected = false;
            setFlashing([clickedCard.id, selectedCard.id]);
            setMovesCount(movesCount + 1);
        }
        setCards(newCards);
    };

    return (
        <Box maxWidth="md" sx={{ margin: "auto" }}>
            <Grid container spacing={2}>
                {cards.map((thisCard) => {
                    const { id, iconIndex, selected, matched } = thisCard;
                    const isFlashing = flashing.includes(id);
                    const Icon = cardIcons[iconIndex];
                    const handleThisCardClick = () => {
                        handleCardClick(thisCard);
                    };
                    return (
                        <Grid
                            size={{
                                xs: 4,
                                md: 3,
                            }}
                            key={id}
                            onClick={!matched ? handleThisCardClick : undefined}
                        >
                            <Card {...{ ...thisCard, isFlashing }}>
                                <Icon
                                    fontSize="large"
                                    sx={{
                                        visibility:
                                            selected || matched || isFlashing
                                                ? "auto"
                                                : "hidden",
                                    }}
                                />
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
            <Box sx={{ textAlign: "center", mt: 3, mb: 5 }}>
                <Box sx={{ textAlign: "center", fontSize: "4rem" }}>
                    {movesCount}
                </Box>
                <Typography
                    variant="h5"
                    align="center"
                    sx={{ fontSize: "1rem" }}
                >
                    MOVES
                </Typography>
            </Box>
            <Box sx={{ textAlign: "center" }}>
                <Button
                    variant="outlined"
                    color="error"
                    onClick={toggleResetDialog}
                >
                    Reset Game
                </Button>
            </Box>

            <Dialog open={resetDialogIsOpen} onClose={toggleResetDialog}>
                <DialogTitle>Confirmation</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to reset the game?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={toggleResetDialog}>Cancel</Button>
                    <Button onClick={handleResetAndClose} variant="contained">
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={winnerDialogOpen} onClose={toggleWinnerDialog}>
                <DialogTitle>You Won!</DialogTitle>
                <Box
                    sx={{
                        fontSize: "6rem",
                        textAlign: "center",
                    }}
                >
                    🎉
                </Box>
                <DialogContent>
                    <DialogContentText>
                        Wow, in only {movesCount} moves - great job!
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={toggleWinnerDialog}>Close</Button>
                    <Button onClick={handleResetAndClose}>Play Again</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default MemoryGame;
