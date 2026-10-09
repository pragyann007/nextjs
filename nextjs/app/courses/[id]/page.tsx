"use client";
import Link from "next/link";
import React, { useState } from "react";
import axios from "axios";

const Page = () => {
  const [author, setAuthor] = useState("");
  const [course, setCourse] = useState("");
  const [response, setResponse] = useState("");

  const courseId = 123;

  const handleAuthor = (e: any) => {
    e.preventDefault();
    setAuthor(e.target.value);
  };

  const handleCourse = (e: any) => {
    e.preventDefault();
    setCourse(e.target.value);
  };

  const handleSubmit = async () => {
    console.log("a")

    try {
      const res = await axios.post("http://localhost:3000/api/courses", {
        courseId,
        course,
        author,
        duration: "1month",
      });
      console.log("a",res)
      if (res.data.status === 201) {
        setResponse(res.data.message + " created...");
      }
    } catch (error) {
      setResponse("Failed");
      console.log(error);
    }
  };

  return (
    <div>
      <input
        className="p-2"
        onChange={handleCourse}
        value={course}
        type="text"
        placeholder="Enter course name"
      />
      <input
        className="p-2"
        onChange={handleAuthor}
        value={author}
        type="text"
        placeholder="Enter author name"
      />
      <button
        className="bg-white p-3 text-black rounded-2xl"
        onClick={handleSubmit}
        type="submit"
      >
        Submit
      </button>
      {response && <p>{response}</p>}
    </div>
  );
};

export default Page;