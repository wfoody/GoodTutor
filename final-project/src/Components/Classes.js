import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
// import axios from 'axios'

import { makeStyles} from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
// import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import capitalize from "capitalize-the-first-letter";

//---------Material UI Styling----------------//
const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));
//---------Material UI Styling----------------//

function Classes(props) {
  //---------Material UI----------------//
  const classes = useStyles();
  //const [age, setAge] = React.useState("");

  const [subject, setSubject] = useState({
    subject: "",
    specialty: "",
    subjectList: [],
    specialtyList: [],
  });

  //   const handleChange = (event) => {
  //     setAge(event.target.value);
  //   };

  const handleChange = async (e) => {
    let specialty = subject.specialty;
    let specialtyList = subject.specialtyList;

    if (e.target.name === "subject") {
      specialty = "";
      specialtyList = [];
    }

    setSubject({
      ...subject,
      specialty,
      specialtyList,
      [e.target.name]: e.target.value,
    });
    // setSubSubject({
    //   ...subSubject,
    //   [e.target.name]: e.target.value,
    // });
  };
  //---------Material UI----------------//

  useEffect(() => {
    fetchTutors();
  }, [subject]);

  const fetchTutors = async () => {
    return fetch(
      `http://localhost:3001/all-tutors?subject=${subject.subject}&sub_subject=${subject.specialty}`
    )
      .then((response) => response.json())
      .then((result) => {
        // console.log(result)
        // setTutors(result)
        result.forEach((tutor) => {
          tutor.Subjects.forEach((s) => {
            const subjectName = s.subject_name;
            const specialtyName = s.sub_subject_name;

            if (!subject.subjectList.find((item) => item === subjectName)) {
              subject.subjectList.push(subjectName);
            }

            if (!subject.specialtyList.find((item) => item === specialtyName)) {
              subject.specialtyList.push(specialtyName);
            }
          });
        });
        props.onTutorsFetch(result);
      });
  };

  const tutorInfo = props.tutors.map((tutor) => {
    let subjectItems = tutor.Subjects.map((subject) => {
      return (
        <div key={subject.subject_id}>
          Subject: {subject.subject_name}, Specialty: {subject.sub_subject_name}
        </div>
      );
    });

    return (
      <div key={tutor.tutor_id}>
        <li>
          Name: {tutor.first_name} {tutor.last_name}, Email: {tutor.email},
          Image: {tutor.image}, Description: {tutor.description},{subjectItems}
        </li>
        <NavLink to={"/tutor/" + tutor.tutor_id}>
          <button>BOOK!</button>
        </NavLink>
      </div>
    );
  });

  return (
    <div>
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel id="demo-simple-select-outlined-label">Subject</InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={subject.subject}
          onChange={handleChange}
          label="subject"
          name="subject"
        >
          <MenuItem value="">Any</MenuItem>
          {subject.subjectList.map((subject) => (
            <MenuItem value={`${subject}`}>{capitalize(subject)}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel id="demo-simple-select-outlined-label">
          Specialty
        </InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={subject.specialty}
          onChange={handleChange}
          label="specialty"
          name="specialty"
          disabled={subject.subject === ""}
        >
          <MenuItem value="">
            <em>Any</em>
          </MenuItem>
          {subject.specialtyList.map((specality) => (
            <MenuItem value={`${specality}`}>{capitalize(specality)}</MenuItem>
          ))}
        </Select>
      </FormControl>
      {tutorInfo}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    tutors: state.tutors,
    // tutor_num: state.tutor_id
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onTutorsFetch: (tutors) =>
      dispatch({ type: "FETCH_TUTORS", payload: tutors }),
    // onTutorId: (tutor_id) => dispatch({type: 'FETCH_TUTORID', payload: tutor_id})
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Classes);
