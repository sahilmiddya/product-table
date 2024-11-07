"use client";

import React, { useState } from "react";
import { useFormik, FormikProvider } from "formik";
import * as Yup from "yup";
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
  Box,
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

const validationSchema = Yup.object({
  deductions: Yup.array().of(
    Yup.object({
      calculation: Yup.number()
        .required("Calculation is required")
        .min(0, "Must be greater than or equal to 0"),
      monthlyAmount: Yup.number()
        .required("Monthly amount is required")
        .min(0, "Must be greater than or equal to 0"),
    })
  ),
});

const ProductTable: React.FC = () => {
  const [deductionList, setDeductionList] = useState<string[]>(DEDUCTION_LIST);
  const [editableDeductionField, setEditableDeductionField] =
    useState<EditableDeductionField>({
      deductionId: 0,
      fieldName: "",
    });

  const formik = useFormik({
    initialValues: {
      deductions: [
        {
          id: 1,
          name: "Professional Tax",
          calculation: 0,
          monthlyAmount: 20000,
        },
      ],
    },
    validationSchema,
    onSubmit: (values) => {
      console.log("Form Submitted:", values);
    },
  });

  const { values, errors, touched, setFieldValue } = formik;

  const handleAddDeduction = (deductionName: string) => {
    const newDeduction: Deduction = {
      id: Date.now(),
      name: deductionName,
      calculation: 0,
      monthlyAmount: 0,
    };
    if (newDeduction.name) {
      setFieldValue("deductions", [...values.deductions, newDeduction]);
      setDeductionList((prev) => prev.filter((dl) => dl !== deductionName));
    }
  };

  const handleDelete = (id: number, deductionName: string) => {
    const updatedDeductions = values.deductions.filter((d) => d.id !== id);

    // Update Formik's state
    setFieldValue("deductions", updatedDeductions);

    // Add the deleted deduction back to the deduction list
    setDeductionList((prev) => [...prev, deductionName]);
  };

  const totalAmount = values.deductions.reduce(
    (sum, deduction) => sum + Number(deduction.monthlyAmount),
    0
  );

  return (
    <FormikProvider value={formik}>
      <form onSubmit={formik.handleSubmit}>
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
                {values.deductions.map((deduction, index) => (
                  <TableRow key={deduction.id}>
                    <TableCell>{deduction.name}</TableCell>

                    <TableCell
                      align="right"
                      onClick={() =>
                        setEditableDeductionField({
                          deductionId: deduction.id,
                          fieldName: "calculation",
                        })
                      }
                    >
                      {editableDeductionField.deductionId === deduction.id &&
                      editableDeductionField.fieldName === "calculation" ? (
                        <TextField
                          sx={{ width: 100 }}
                          size="small"
                          autoFocus
                          name={`deductions.${index}.calculation`}
                          value={deduction.calculation}
                          type="number"
                          onChange={(event) =>
                            setFieldValue(
                              `deductions.${index}.calculation`,
                              event.target.value
                            )
                          }
                          onBlur={() =>
                            setEditableDeductionField({
                              deductionId: 0,
                              fieldName: "",
                            })
                          }
                          error={
                            touched.deductions &&
                            touched.deductions[index]?.calculation &&
                            Boolean(errors.deductions?.[index]?.calculation)
                          }
                          helperText={errors.deductions?.[index]?.calculation}
                        />
                      ) : (
                        <Box
                          sx={{
                            border: "1px solid gray",
                            px: 2,
                            py: 1,
                            borderRadius: 1,
                            textAlign: "center",
                          }}
                        >
                          ₹{Number(deduction.calculation).toLocaleString()}
                        </Box>
                      )}
                    </TableCell>

                    <TableCell
                      align="right"
                      onClick={() =>
                        setEditableDeductionField({
                          deductionId: deduction.id,
                          fieldName: "monthlyAmount",
                        })
                      }
                    >
                      {editableDeductionField.deductionId === deduction.id &&
                      editableDeductionField.fieldName === "monthlyAmount" ? (
                        <TextField
                          sx={{ width: 100 }}
                          size="small"
                          autoFocus
                          name={`deductions.${index}.monthlyAmount`}
                          value={deduction.monthlyAmount}
                          type="number"
                          onChange={(event) =>
                            setFieldValue(
                              `deductions.${index}.monthlyAmount`,
                              event.target.value
                            )
                          }
                          onBlur={() =>
                            setEditableDeductionField({
                              deductionId: 0,
                              fieldName: "",
                            })
                          }
                          error={
                            touched.deductions &&
                            touched.deductions[index]?.monthlyAmount &&
                            Boolean(errors.deductions?.[index]?.monthlyAmount)
                          }
                          helperText={errors.deductions?.[index]?.monthlyAmount}
                        />
                      ) : (
                        <Box
                          sx={{
                            border: "1px solid gray",
                            px: 2,
                            py: 1,
                            borderRadius: 1,
                          }}
                        >
                          ₹{Number(deduction.monthlyAmount).toLocaleString()}
                        </Box>
                      )}
                    </TableCell>

                    <TableCell align="right">
                      ₹{(Number(deduction.monthlyAmount) * 12).toLocaleString()}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() =>
                          handleDelete(deduction.id, deduction.name)
                        }
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
      </form>
    </FormikProvider>
  );
};

export default ProductTable;
