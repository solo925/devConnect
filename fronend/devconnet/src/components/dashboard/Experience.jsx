import dayjs from "dayjs";
import React, { Fragment } from "react";
import { useDispatch } from "react-redux";
import { deleteExperience } from "../../actions/profile";

const Experience = ({ experience }) => {
  const dispatch = useDispatch();

  const experiences =
    experience &&
    experience.map((exp) => (
      <tr key={exp.id}>
        <td>{exp.company}</td>
        <td className="hide-sm">{exp.title}</td>
        <td className="hide-sm">
          {exp.from_date ? dayjs(exp.from_date).format("YYYY/MM/DD") : "N/A"} -{" "}
          {exp.to_date ? dayjs(exp.to_date).format("YYYY/MM/DD") : "Now"}
        </td>
        <td>
          <button
            className="btn btn-danger"
            onClick={() => dispatch(deleteExperience(exp.id))}
          >
            Delete
          </button>
        </td>
      </tr>
    ));

  return (
    <Fragment>
      <h2 className="my-2">Experience Credentials</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Company</th>
            <th className="hide-sm">Title</th>
            <th className="hide-sm">Years</th>
            <th />
          </tr>
        </thead>
        <tbody>{experiences}</tbody>
      </table>
    </Fragment>
  );
};

export default Experience;
