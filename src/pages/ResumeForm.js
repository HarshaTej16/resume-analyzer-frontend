import React, { useState } from "react";
import axios from "axios";

function ResumeForm() {

  const [skills, setSkills] = useState("");
  const [projects, setProjects] = useState("");
  const [certifications, setCertifications] = useState("");
  const [cgpa, setCgpa] = useState("");
  const [score, setScore] = useState(null);

  const analyzeResume = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/resume/score?skills=${skills}&projects=${projects}&certifications=${certifications}&cgpa=${cgpa}`
      );

      setScore(response.data);

    } catch (error) {
      console.error("Error analyzing resume", error);
    }
  };

return (
  <div style={{
      display:"flex",
      justifyContent:"center",
      alignItems:"center",
      height:"100vh",
      background:"#f4f6f9"
  }}>

    <div style={{
        background:"white",
        padding:"40px",
        borderRadius:"10px",
        boxShadow:"0 0 10px rgba(0,0,0,0.1)",
        width:"350px",
        textAlign:"center"
    }}>

      <h2>Smart Resume Analyzer</h2>

      <input
        type="number"
        placeholder="Skills Score"
        onChange={(e)=>setSkills(e.target.value)}
        style={{width:"100%", padding:"10px", margin:"10px 0"}}
      />

      <input
        type="number"
        placeholder="Projects Score"
        onChange={(e)=>setProjects(e.target.value)}
        style={{width:"100%", padding:"10px", margin:"10px 0"}}
      />

      <input
        type="number"
        placeholder="Certifications Score"
        onChange={(e)=>setCertifications(e.target.value)}
        style={{width:"100%", padding:"10px", margin:"10px 0"}}
      />

      <input
        type="number"
        placeholder="CGPA Score"
        onChange={(e)=>setCgpa(e.target.value)}
        style={{width:"100%", padding:"10px", margin:"10px 0"}}
      />

      <button
        onClick={analyzeResume}
        style={{
          width:"100%",
          padding:"10px",
          background:"#007bff",
          color:"white",
          border:"none",
          borderRadius:"5px",
          cursor:"pointer"
        }}
      >
        Analyze Resume
      </button>

      {score && (
        <h3 style={{marginTop:"20px"}}>
          Job Readiness Score: {score}%
        </h3>
      )}

    </div>

  </div>
);
}

export default ResumeForm;