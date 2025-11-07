import React, { useState } from "react";
import InfoForm from "./components/InfoForm";
import RecordPage from "./components/RecordPage";
import ReviewPage from "./components/ReviewPage";

function App() {
  const [page, setPage] = useState("form"); // form, record, review
  const [data, setData] = useState({
    fname: "",
    lname: "",
    pos: "",
    cur: "",
    yrs: "",
    resumeFile: null,
    videoBlob: null,
    videoDuration: 0,
    uploadedIds: null,
  });

  return (
    <div className="container">
      {page === "form" && (
        <InfoForm
          data={data}
          setData={setData}
          onNext={() => setPage("record")}
        />
      )}
      {page === "record" && (
        <RecordPage
          data={data}
          setData={setData}
          onNext={() => setPage("review")}
          onBack={() => setPage("form")}
        />
      )}
      {page === "review" && (
        <ReviewPage
          data={data}
          setData={setData}
          onBack={() => setPage("record")}
        />
      )}
    </div>
  );
}

export default App;
