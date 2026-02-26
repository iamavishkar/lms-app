import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Card, CardContent } from "@mui/material";
import { useDispatch } from "react-redux";
import PageHeader from "../../components/common/PageHeader";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import FormRenderer from "../../components/common/FormRenderer";
import { useGetExamByIdQuery, useSaveExamMutation } from "../../api/examsApi";
import { useGetClassesQuery } from "../../api/classesApi";
import { useGetSubjectsQuery } from "../../api/subjectsApi";
import { showSnackbar } from "../../store/uiSlice";
import { getErrorMessage } from "../../utils/helpers";
import { ROUTES } from "../../routes/routes";
import { getExamFormFields } from "./forms/form-fields";
import { examFormInitialValues } from "./forms/form-values";
import { examFormSchema } from "./forms/form-schema";
import type { CreateExamDto } from "../../types";

const ExamForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: exam, isLoading: loadingExam } = useGetExamByIdQuery(
    Number(id),
    { skip: !isEdit }
  );
  const { data: classes = [] } = useGetClassesQuery();
  const { data: subjects = [] } = useGetSubjectsQuery();
  const [saveExam, { isLoading }] = useSaveExamMutation();

  const fields = useMemo(() => {
    return getExamFormFields().map((f) => {
      if (f.name === "classId")
        return {
          ...f,
          options: classes.map((c) => ({ label: c.name, value: c.id })),
        };
      if (f.name === "subjectId")
        return {
          ...f,
          options: subjects.map((s) => ({ label: s.name, value: s.id })),
        };
      return f;
    });
  }, [classes, subjects]);

  const initialValues = exam
    ? {
        name: exam.name,
        type: exam.type,
        date: exam.date?.split("T")[0] ?? "",
        duration: exam.duration,
        totalMarks: exam.totalMarks,
        subjectId: exam.subject?.id,
        classId: exam.class?.id,
      }
    : examFormInitialValues;

  const onSubmit = async (values: Record<string, unknown>) => {
    try {
      await saveExam({
        id: isEdit ? Number(id) : undefined,
        data: values as unknown as CreateExamDto,
      }).unwrap();
      dispatch(
        showSnackbar({
          message: isEdit ? "Exam updated successfully" : "Exam created successfully",
          severity: "success",
        })
      );
      navigate(ROUTES.EXAMS.LIST);
    } catch (err) {
      dispatch(showSnackbar({ message: getErrorMessage(err), severity: "error" }));
    }
  };

  if (isEdit && loadingExam) return <LoadingSpinner />;

  return (
    <Box>
      <PageHeader title={isEdit ? "Edit Exam" : "Create Exam"} />
      <Card>
        <CardContent>
          <FormRenderer
            fields={fields}
            initialValues={initialValues as unknown as Record<string, unknown>}
            validationSchema={examFormSchema}
            onSubmit={onSubmit}
            onCancel={() => navigate(ROUTES.EXAMS.LIST)}
            submitLabel={isEdit ? "Update" : "Create"}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default ExamForm;
