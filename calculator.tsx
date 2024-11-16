"use client";

import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import OutlinedInput from "@mui/material/OutlinedInput";
import PortfolioItemHeader from "@/components/portfolioItemHeader";

const numKeysArray = new Array(9).fill(0);

const Calculator = ({
    label,
    pageDescription,
    github,
}: {
    label: string;
    pageDescription: string;
    github?: string;
}) => {
    const [total, setTotal] = useState("0");
    const [operator, setOperator] = useState<string | null>("");
    const [operand, setOperand] = useState<string | null>("");

    const handleNumberPress = (num: string | number) => {
        let newNumber = operator
            ? (operand || 0).toString() + num.toString()
            : total.toString() + num.toString();
        while (
            newNumber !== "0" &&
            newNumber.substring(0, 1) === "0" &&
            newNumber.substring(0, 2) !== "0."
        ) {
            newNumber = newNumber.substring(1);
        }

        /// DO NOT ALLOW MORE THAN ONE DECIMAL
        if (operator) {
            setOperand(newNumber);
        } else {
            setTotal(newNumber);
        }
    };

    const handleOperatorPress = (op: string) => {
        setOperator(op);
    };

    const handleClear = () => {
        setTotal("0");
        setOperand(null);
        setOperator(null);
    };

    const equals = () => {
        let newTotal = 0;
        if (operator === "+") {
            newTotal = Number(total) + Number(operand);
        } else if (operator === "-") {
            newTotal = Number(total) - Number(operand);
        } else if (operator === "*") {
            newTotal = Number(total) * Number(operand);
        } else if (operator === "/") {
            newTotal = Number(total) / Number(operand);
        }
        setTotal(newTotal.toString());
        setOperator(null);
        setOperand(null);
    };
    // console.log(total, operator, operand);

    return (
        <div>
            <PortfolioItemHeader
                heading={label}
                description={pageDescription}
                githubLink={github}
            />
            <Paper
                sx={{
                    padding: "1rem",
                    maxWidth: "350px",
                    margin: "auto",
                }}
            >
                <OutlinedInput
                    // type="number"
                    fullWidth
                    disabled
                    value={operand ? operand : total}
                    sx={{
                        marginBottom: "1rem",
                    }}
                />
                <Grid container spacing={1}>
                    <Grid size={9}>
                        <Grid
                            container
                            spacing={1}
                            sx={{
                                flexWrap: "wrap-reverse !important",
                            }}
                        >
                            <Grid size={4}>
                                <Button
                                    variant="contained"
                                    color="error"
                                    fullWidth
                                    onClick={handleClear}
                                >
                                    C
                                </Button>
                            </Grid>
                            <Grid size={4}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={() => handleNumberPress(0)}
                                >
                                    0
                                </Button>
                            </Grid>
                            <Grid size={4}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={() => handleNumberPress(".")}
                                >
                                    .
                                </Button>
                            </Grid>

                            {numKeysArray.map((x, index) => {
                                const numValue = index + 1;
                                const handleClick = () =>
                                    handleNumberPress(numValue);
                                return (
                                    <Grid size={4} key={index}>
                                        <Button
                                            variant="contained"
                                            fullWidth
                                            onClick={handleClick}
                                        >
                                            {numValue}
                                        </Button>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </Grid>
                    <Grid size={3}>
                        <Grid container spacing={1}>
                            {["*", "/", "+", "-"].map((a, index) => {
                                const handleClick = () =>
                                    handleOperatorPress(a);
                                return (
                                    <Grid size={12} key={index}>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            fullWidth
                                            onClick={handleClick}
                                        >
                                            {a}
                                        </Button>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </Grid>
                    <Grid size={12}>
                        <Button
                            variant="contained"
                            color="secondary"
                            fullWidth
                            onClick={equals}
                        >
                            =
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    );
};

export default Calculator;
