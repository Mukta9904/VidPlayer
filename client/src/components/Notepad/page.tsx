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

  const debouncedSave = useCallback(debounce(saveNotes, 3000), []);

  // Handle editor content change
  const handleEditorChange = (content: string) => {
    setNotes(content); // Update local state
    debouncedSave(content); // Trigger the debounced save function
  };

  return (
    <div>
      <div className='text-gray-400 text-center font-bold text-2xl my-4 capitalize'>notepad to save you notes</div>
    <Editor
      apiKey={`${process.env.NEXT_PUBLIC_NOTE_URL}`}// Replace with your actual API key
      value={notes}
      onEditorChange={handleEditorChange}
      init={{
        plugins: [
          // Core editing features
          'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
          // Your account includes a free trial of TinyMCE premium features
          // Try the most popular premium features until Feb 5, 2025:
          'checklist', 'mediaembed', 'casechange', 'export', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'editimage', 'advtemplate', 'mentions',  'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown','importword', 'exportword', 'exportpdf'
        ],
        toolbar: 'undo redo | blocks fontfamily fontsize ',
      }}
      />
      {isSaving && <p>Saving...</p>}
      </div>
  );
};

export default NotesEditor;
