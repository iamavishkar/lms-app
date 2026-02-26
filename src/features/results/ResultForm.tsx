import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Card, CardContent } from "@mui/material";
import { useDispatch } from "react-redux";
import PageHeader from "../../components/common/PageHeader";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import FormRenderer from "../../components/common/FormRenderer";
import { useGetResultByIdQuery, useSaveResultMutation } from "../../app/api/resultsApi";
import { useGetStudentsQuery } from "../../app/api/studentsApi";
import { useGetExamsQuery } from "../../app/api/examsApi";
import { showSnackbar } from "../../app/store/uiSlice";
import { getErrorMessage } from "../../utils/helpers";
import { ROUTES } from "../../routes/routes";
import { resultFormFields } from "../../forms/form-fields";
import { resultInitialValues } from "../../forms/form-values";
import { resultFormSchema } from "../../forms/form-schema";
import type { CreateResultDto } from "../../interfaces";

const ResultForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: result, isLoading: loadingResult } = useGetResultByIdQuery(Number(id), { skip: !isEdit });
  const { data: students = [] } = useGetStudentsQuery();
  const { data: exams = [] } = useGetExamsQuery();
  const [saveResult, { isLoading }] = useSaveResultMutation();

  const fields = useMemo(
    () =>
      resultFormFields.map((f) => {
        if (f.name === "studentId")
          return { ...f, options: students.map((s) => ({ label: s.user?.name ?? s.enrollmentNumber, value: s.id })) };
        if (f.name === "examId") return { ...f, options: exams.map((e) => ({ label: e.name, value: e.id })) };
        return f;
      }),
    [students, exams]
  );

  const editValues = result
    ? {
        marksObtained: result.marksObtained,
        grade: result.grade ?? "",
        remarks: result.remarks ?? "",
        studentId: result.student?.id,
        examId: result.exam?.id,
      }
    : undefined;

  const onSubmit = async (values: Record<string, unknown>) => {
    try {
      await saveResult({ id: isEdit ? Number(id) : undefined, data: values as unknown as CreateResultDto }).unwrap();
      dispatch(showSnackbar({ message: isEdit ? "Result updated successfully" : "Result created successfully", severity: "success" }));
      navigate(ROUTES.RESULTS.LIST);
    } catch (err) {
      dispatch(showSnackbar({ message: getErrorMessage(err), severity: "error" }));
    }
  };

  if (isEdit && loadingResult) return <LoadingSpinner />;

  return (
    <Box>
      <PageHeader title={isEdit ? "Edit Result" : "Enter Result"} />
      <Card>
        <CardContent>
          <FormRenderer
            fields={fields}
            initialValues={(editValues || resultInitialValues) as unknown as Record<string, unknown>}
            validationSchema={resultFormSchema}
            onSubmit={onSubmit}
            onCancel={() => navigate(ROUTES.RESULTS.LIST)}
            submitLabel={isEdit ? "Update" : "Submit"}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default ResultForm;
