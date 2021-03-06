import React, { useContext, useEffect } from "react";
import DashboardWrapper from "./dashboardWrapper";
import { TemplateContext } from "../../../context/templateContext";
import { FormContext } from "../../../context/formContext";
import { getForm } from "../../../utils";
import SaveProvider from "../../../context/saveContext";
import Loading from "../../../components/loading";

const Dashboard: React.FC<any> = ({ match, ...props }) => {
  const { templates }: any = useContext(TemplateContext);
  const { form, setForm }: any = useContext(FormContext);
  const formId = match.params.id;
  const page = match.params.page;
  const resultId = match.params.result_id;

  useEffect(() => {
    let current = true;
    if (current) {
      getForm(formId)
        .then(res => {
          setForm(res.data);
        })
        .catch(err => {
          setForm({});
          console.log(err.message);
        });
    }
    return () => {
      current = false;
    };
  }, [setForm, formId]);

  if (!templates || !form) return <Loading/>;
  return (
    <SaveProvider>
      <DashboardWrapper
        formExist={form.hasOwnProperty("_id")}
        formId={formId}
        resultId={resultId}
        templates={templates}
        page={page}
        formData={form}
        selectedTheme={2}
        {...props}
      />
    </SaveProvider>
  );
};
export default Dashboard;
