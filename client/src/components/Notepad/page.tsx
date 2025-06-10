import React, { useState, useEffect, useCallback } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
// import { debounce } from 'lodash';

const NotesEditor: React.FC = () => {
  const [notes, setNotes] = useState("");
  const videoId = localStorage.getItem("playedVideoId")
  const [isSaving, setIsSaving] = useState(false);
  // Fetch previously saved notes on component mount
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        if (videoId){
          const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/notes/${videoId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          setNotes(response?.data?.data?.content || "");
        }
      } catch (err) {
        console.log("Error fetching notes:", err);
        setNotes("");
      }
    };
    fetchNotes();
  }, [videoId]);

 const saveNotes = async (notes: string) => {
  try {
    setIsSaving(true);
    await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/notes/${videoId}`, { content: notes }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }
    });
    setIsSaving(false);
  } catch (err) {
    console.error("Error auto-saving notes:", err);
    setIsSaving(false);
  }
 }
 function debounce(func: Function, delay: number) {
  let timer: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

  const debouncedSave = useCallback(debounce(saveNotes, 2000), [notes]);

  // Handle editor content change
  const handleEditorChange = (content: string) => {
    setNotes(content); // Update local state
    debouncedSave(content); // Trigger the debounced save function
  };

  return (
    <div className='w-full mt-3'>
      {/* <div className='text-gray-300 text-center font-bold text-3xl my-3 capitalize'>save your notes here!</div> */}
    <Editor
      apiKey={`${process.env.NEXT_PUBLIC_NOTE_URL}`}// Replace with your actual API key
      value={notes}
      onEditorChange={handleEditorChange}
      init={{
        skin: 'oxide-dark', // Use the dark skin
        content_css: 'dark', // Apply dark theme to editor content
        content_style: `
        body {
          background-color: #111827; /* Tailwind's gray-800 */
          color: #e5e7eb; /* Tailwind's gray-200 for readable text */
          font-family: 'Inter', sans-serif;
        }
        a { color: #60a5fa; } /* Tailwind's blue-400 for links */
        h1, h2, h3, h4, h5, h6 { color: #f9fafb; } /* Light text for headers */
        blockquote { color: #d1d5db; border-left: 4px solid #374151; padding-left: 10px; } /* Styling for blockquotes */
      `,
        plugins: [
          
          // Core editing features
          'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount'
        ],
        toolbar: 'undo redo | bold italic underline strikethrough | textcolor | alignleft aligncenter alignright alignjustify | numlist bullist ',
      }}
      />
      </div>
  );
};

export default NotesEditor;
