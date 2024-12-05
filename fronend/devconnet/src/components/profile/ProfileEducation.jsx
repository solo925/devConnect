import dayjs from "dayjs";
import React from "react";

const ProfileEducation = ({
  education: {
    school,
    degree,
    field_of_study,
    current,
    to_date,
    from_date,
    description,
  },
}) => {
  return (
    <div>
      <h3 className="text-dark">{school}</h3>
      <p>
        {from_date ? dayjs(from_date).format("YYYY/MM/DD") : "N/A"} -{" "}
        {to_date ? dayjs(to_date).format("YYYY/MM/DD") : "Now"}
      </p>
      <p>
        <strong>Degree: </strong>
        {degree}
      </p>
      <p>
        <strong>Field Of Study: </strong>
        {field_of_study}
      </p>
      <p>
        <strong>Description: </strong>
        {description}
      </p>
    </div>
  );
};

export default ProfileEducation;
