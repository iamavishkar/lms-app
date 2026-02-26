import React from "react";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  MenuItem,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { Formik, Form, Field, FieldProps } from "formik";
import type { ObjectSchema } from "yup";

// ─── Field definition types ────────────────────────────────────────────────

export type FieldType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "date"
  | "select"
  | "radio"
  | "textarea";

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface FormFieldDef {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  /** Grid column span (1–12). Defaults to 6. */
  gridMd?: number;
  /** Options for select / radio fields */
  options?: SelectOption[];
  /** Whether the field should be hidden (useful for edit-only / create-only fields) */
  hidden?: boolean;
  rows?: number;
}

// ─── FormRenderer props ─────────────────────────────────────────────────────

interface FormRendererProps<T extends Record<string, unknown>> {
  fields: FormFieldDef[];
  initialValues: T;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validationSchema: ObjectSchema<any>;
  onSubmit: (values: T) => Promise<void> | void;
  onCancel?: () => void;
  submitLabel?: string;
  isLoading?: boolean;
}

// ─── Component ──────────────────────────────────────────────────────────────

function FormRenderer<T extends Record<string, unknown>>({
  fields,
  initialValues,
  validationSchema,
  onSubmit,
  onCancel,
  submitLabel = "Submit",
  isLoading = false,
}: FormRendererProps<T>) {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ errors, touched, isSubmitting }) => (
        <Form noValidate>
          <Grid container spacing={2}>
            {fields
              .filter((f) => !f.hidden)
              .map((fieldDef) => (
                <Grid item xs={12} md={fieldDef.gridMd ?? 6} key={fieldDef.name}>
                  <Field name={fieldDef.name}>
                    {({ field }: FieldProps) => {
                      const hasError = !!(errors[fieldDef.name] && touched[fieldDef.name]);
                      const helperText = hasError ? String(errors[fieldDef.name]) : undefined;

                      if (fieldDef.type === "select" && fieldDef.options?.length) {
                        return (
                          <TextField
                            {...field}
                            select
                            label={fieldDef.label}
                            fullWidth
                            error={hasError}
                            helperText={helperText}
                            value={field.value ?? ""}
                          >
                            {fieldDef.options.map((opt) => (
                              <MenuItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </MenuItem>
                            ))}
                          </TextField>
                        );
                      }

                      if (fieldDef.type === "radio" && fieldDef.options?.length) {
                        return (
                          <FormControl error={hasError}>
                            <FormLabel>{fieldDef.label}</FormLabel>
                            <RadioGroup row {...field} value={field.value ?? ""}>
                              {fieldDef.options.map((opt) => (
                                <FormControlLabel
                                  key={opt.value}
                                  value={opt.value}
                                  control={<Radio size="small" />}
                                  label={opt.label}
                                />
                              ))}
                            </RadioGroup>
                          </FormControl>
                        );
                      }

                      if (fieldDef.type === "textarea") {
                        return (
                          <TextField
                            {...field}
                            label={fieldDef.label}
                            fullWidth
                            multiline
                            rows={fieldDef.rows ?? 3}
                            error={hasError}
                            helperText={helperText}
                            value={field.value ?? ""}
                          />
                        );
                      }

                      return (
                        <TextField
                          {...field}
                          label={fieldDef.label}
                          type={fieldDef.type}
                          fullWidth
                          placeholder={fieldDef.placeholder}
                          error={hasError}
                          helperText={helperText}
                          value={field.value ?? ""}
                          InputLabelProps={fieldDef.type === "date" ? { shrink: true } : undefined}
                        />
                      );
                    }}
                  </Field>
                </Grid>
              ))}
          </Grid>

          <Box mt={3} display="flex" gap={2}>
            <Button type="submit" variant="contained" disabled={isSubmitting || isLoading}>
              {isSubmitting || isLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                submitLabel
              )}
            </Button>
            {onCancel && (
              <Button variant="outlined" onClick={onCancel} type="button">
                Cancel
              </Button>
            )}
          </Box>
        </Form>
      )}
    </Formik>
  );
}

export default FormRenderer;
