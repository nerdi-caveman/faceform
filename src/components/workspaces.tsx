import React, { useEffect } from "react";
import "../styles/components/workspace.scss";
import Icon from "@mdi/react";
import { mdiPlus, mdiDotsHorizontal } from "@mdi/js";
import { Link } from "react-router-dom";
import { addForm, getTemplates, addWorkspace, deleteWorkspace } from "../utils";

const Workspaces: React.FC<any> = ({ workspaces }) => {
  useEffect(() => {
    let current = true;
    if (current) {
      const _morebuttons: any = document.querySelectorAll(
        ".template-detail button"
      );
      const _workspaces = document.querySelectorAll(".idx");
      window.addEventListener("click", (e: any) => {
        for (let i = 0; i < _morebuttons.length; i++) {
          if (!_morebuttons[i].contains(e.target)) {
            _workspaces[i].classList.remove("active");
          }
        }
      });
      for (let i = 0; i < _morebuttons.length; i++) {
        _morebuttons[i].addEventListener(
          "click",
          (e: any) => {
            const id =
              e.target.dataset.id ||
              e.target.parentElement.dataset.id ||
              e.target.parentElement.parentElement.dataset.id;
            for (let i = 0; i < _workspaces.length; i++) {
              if (i !== +id) {
                _workspaces[i].classList.remove("active");
              }
            }
            const _element: any = document.querySelector(`.idx_${id}`);
            if (_element.classList.contains("active")) {
              _element.classList.remove("active");
            } else {
              _element.classList.add("active");
            }
          },
          false
        );
      }
    }

    return () => {
      current = false;
    };
  }, []);

  const addFaceform = async () => {
    const template = await getTemplates();
    const formRes = await addForm({
      form: [
        {
          label: "Ask a question with Faceform",
          placeholder: "Answer",
          type: "text"
        },
        {
          label: "Ask more with Faceform",
          placeholder: "Answer",
          type: "text"
        }
      ],
      template_id: template.data[0]._id
    });
    addWorkspace({
      name: template.data[0].name + Math.floor(Math.random() * 100),
      form_id: formRes.data.data._id
    });
    window.location.pathname = `/create/${formRes.data.data._id}`;
  };

  const delWorkspace = async (id: string | number) => {
    console.log(id)
    await deleteWorkspace(id);
    window.location.reload();
  };

  return (
    <div className="workspaces">
      <div className="container">
        <ul className="workspace">
          <li>
            <div className="workspace_container">
              <button id="add_new_form" onClick={addFaceform}>
                <Icon path={mdiPlus} color="#fff" size={1.5} />
                <span>New faceform</span>
              </button>
            </div>
          </li>
          {workspaces.map((workspace: any, index: number) => (
            <li key={index} className={`idx_${index} idx`}>
              <div className="workspace_container">
                <Link
                  to={`create/${workspace.form_id._id}/form`}
                  style={
                    workspace.form_id.template_id.theme.type === "plain"
                      ? {
                          background:
                            workspace.form_id.template_id.theme.background,
                          color: workspace.form_id.template_id.theme.text
                        }
                      : {
                          backgroundImage: `url('../../${workspace.form_id.template_id.theme.background}')`,
                          color: workspace.form_id.template_id.theme.text,
                          backgroundSize: "cover",
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "center"
                        }
                  }
                >
                  <span
                    style={{
                      color: workspace.form_id.template_id.theme.labelColor
                    }}
                  >
                    {workspace.name}
                  </span>
                </Link>
                <div className="template-detail">
                  <div className="detail">
                    <p>
                      {2} response
                      {2 > 1 ? "s" : ""}
                      {/* {workspace.response.total} response
                      {workspace.response.total > 1 ? "s" : ""} */}
                    </p>
                  </div>
                  <button data-id={index}>
                    <Icon path={mdiDotsHorizontal} size={0.8} color="#444" />
                  </button>
                </div>
              </div>
              <div className="more-options">
                <ul>
                  <li>
                    <Link to={`publish/${workspace.form_id._id}`}>Preview</Link>
                  </li>
                  <li>
                    <Link to={`create/abcdef/result/`}>Results</Link>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        delWorkspace(workspace._id);
                      }}
                    >
                      Delete
                    </button>
                  </li>
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default Workspaces;
