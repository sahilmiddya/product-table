"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  IconButton,
  Container,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const DEDUCTION_LIST = [
  "Professional Tax",
  "Income Tax",
  "Employee State Insurance (ESI)",
  "Provident Fund (PF)",
  "Public Provident Fund (PPF)",
  "Health Insurance Premium",
  "Life Insurance Premium",
  "Loan Repayment",
  "Housing Loan Principal",
  "Housing Loan Interest",
  "Voluntary Provident Fund (VPF)",
  "Gratuity",
  "Leave Adjustments",
  "Unpaid Leave Deduction",
];

interface Deduction {
  id: number;
  name: string;
  calculation: number;
  monthlyAmount: number;
}

interface EditableDeductionField {
  deductionId: number;
  fieldName: string;
}

const ProductTable: React.FC = () => {
  const [deductionList, setDeductionList] = useState<string[]>(DEDUCTION_LIST);
  const [deductions, setDeductions] = useState<Deduction[]>([
    { id: 54651321, name: "Professional Tax", calculation: 0, monthlyAmount: 20000 },
  ]);

  const [editableDeductionField, setEditableDeductionField] =
    useState<EditableDeductionField>({
      deductionId: 0,
      fieldName: "",
    });

  const handleAddDeduction = (deductionName: string) => {
    const newDeduction: Deduction = {
      id: Date.now(),
      name: deductionName,
      calculation: 0,
      monthlyAmount: 0,
    };
    if (newDeduction.name) {
      setDeductions([...deductions, newDeduction]);
      setDeductionList((prev) => prev.filter((dl) => dl !== deductionName));
    }
  };

  const handleSetEditField = (deductionId: number, fieldName: string) => {
    setEditableDeductionField({ deductionId, fieldName });
  };

  const handleDeductionChange = (
    deductionId: number,
    fieldName: keyof Deduction,
    value: string | number
  ) => {
    const updatedDeductions = deductions.map((item) => {
      if (item.id === deductionId) {
        if (fieldName === "calculation" || fieldName === "monthlyAmount") {
          if (value === "") {
            item[fieldName] = "";
          } else {
            item[fieldName] = Number(value);
          }
        }
      }
      return item;
    });

    console.log({ fieldName, value, deductionId });

    setDeductions(updatedDeductions);
  };

  const handleDelete = (id: number, deductionName: string) => {
    setDeductions(deductions.filter((d) => d.id !== id));
    setDeductionList((prev) => [...prev, deductionName]);
  };

  const totalAmount = deductions.reduce(
    (sum, deduction) => sum + Number(deduction.monthlyAmount),
    0
  );

  return (
    <Container>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Deductions</TableCell>
              <TableCell align="right">Calculation</TableCell>
              <TableCell align="right">Monthly Amount</TableCell>
              <TableCell align="right">Annual Amount</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deductions.map((deduction) => (
              <TableRow key={deduction.id}>
                <TableCell>{deduction.name}</TableCell>

                <TableCell
                  align="right"
                  onClick={() =>
                    handleSetEditField(deduction.id, "calculation")
                  }
                >
                  {editableDeductionField.deductionId === deduction.id &&
                  editableDeductionField.fieldName === "calculation" ? (
                    <TextField
                      autoFocus
                      name="calculation"
                      value={deduction.calculation}
                      type="number"
                      onChange={(event) =>
                        handleDeductionChange(
                          deduction.id,
                          event.target.name as keyof Deduction,
                          event.target.value
                        )
                      }
                      onBlur={() =>
                        setEditableDeductionField({
                          deductionId: 0,
                          fieldName: "",
                        })
                      }
                    />
                  ) : (
                    <>₹{Number(deduction.calculation).toLocaleString()}</>
                  )}
                </TableCell>

                <TableCell
                  align="right"
                  onClick={() =>
                    handleSetEditField(deduction.id, "monthlyAmount")
                  }
                >
                  {editableDeductionField.deductionId === deduction.id &&
                  editableDeductionField.fieldName === "monthlyAmount" ? (
                    <TextField
                      autoFocus
                      name="monthlyAmount"
                      value={deduction.monthlyAmount}
                      type="number"
                      onChange={(event) =>
                        handleDeductionChange(
                          deduction.id,
                          event.target.name as keyof Deduction,
                          event.target.value
                        )
                      }
                      onBlur={() =>
                        setEditableDeductionField({
                          deductionId: 0,
                          fieldName: "",
                        })
                      }
                    />
                  ) : (
                    <>₹{Number(deduction.monthlyAmount).toLocaleString()}</>
                  )}
                </TableCell>

                <TableCell align="right">
                  ₹{(Number(deduction.monthlyAmount) * 12).toLocaleString()}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() => handleDelete(deduction.id, deduction.name)}
                    color="secondary"
                  >
                    <DeleteIcon color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={5}>
                <FormControl fullWidth>
                  <InputLabel>Deduction</InputLabel>
                  <Select
                    label="Deduction"
                    value={""}
                    onChange={(event) => {
                      handleAddDeduction(event.target.value as string);
                    }}
                  >
                    {deductionList.map((item) => (
                      <MenuItem value={item} key={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </TableCell>
            </TableRow>

            <TableRow></TableRow>
            <TableRow>
              <TableCell colSpan={2}>Net Salary</TableCell>
              <TableCell align="right">
                ₹{totalAmount.toLocaleString()}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ProductTable;
