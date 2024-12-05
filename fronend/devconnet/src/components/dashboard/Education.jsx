import dayjs from "dayjs";
import React, { Fragment } from "react";
import { useDispatch } from "react-redux";
import { deleteEducation } from "../../actions/profile";

const Education = ({ education }) => {
  const dispatch = useDispatch();

  const educations =
    education &&
    education.map((edu) => (
      <tr key={edu.id}>
        <td>{edu.school}</td>
        <td className="hide-sm">{edu.degree}</td>
        <td className="hide-sm">
          {/* Ensure valid date values */}
          {edu.from_date ? (
            dayjs(edu.from_date).format("YYYY/MM/DD")
          ) : (
            "N/A"
          )}{" "}
          -{" "}
          {edu.to_date ? (
            dayjs(edu.to_date).format("YYYY/MM/DD")
          ) : (
            "Now"
          )}
        </td>
        <td>
          <button
            className="btn btn-danger"
            onClick={() => dispatch(deleteEducation(edu.id))}
          >
            Delete
          </button>
        </td>
      </tr>
    ));

  return (
    <Fragment>
      <h2 className="my-2">Education Credentials</h2>
      <table className="table">
        <thead>
          <tr>
            <th>School</th>
            <th className="hide-sm">Degree</th>
            <th className="hide-sm">Years</th>
            <th />
          </tr>
        </thead>
        <tbody>{educations}</tbody>
      </table>
    </Fragment>
  );
};

export default Education;
