import React, { useState } from 'react';

interface CommentUnderPostProps {
  postId: number;
  onCommentSubmit?: (commentText: string) => void;
}

const CommentUnderPost: React.FC<CommentUnderPostProps> = ({ postId, onCommentSubmit }) => {
  const [commentText, setCommentText] = useState<string>('');

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentText(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim() === '') {
      return;
    }

    console.log(`Submitting comment for Post ID: ${postId}`);
    console.log(`Comment Text: ${commentText}`);

    if (onCommentSubmit) {
      onCommentSubmit(commentText);
    }

    setCommentText('');
  };

  const isCommentEmpty = commentText.trim() === '';

  return (
    <div className="max-w-4xl mx-auto py-4"> {/* Simplified container padding */}
      <form onSubmit={handleSubmit} className="relative flex items-center"> {/* Added flex and items-center */}
        <label htmlFor="comment" className="sr-only">Your Comment</label>
        <textarea
          id="comment"
          className="w-full p-2 pr-16 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-none overflow-hidden" // Removed shadow, border, and resize-y. Added resize-none and overflow-hidden
          rows={1} // Set rows to 1 for single-line appearance
          style={{ minHeight: '40px', maxHeight: '100px' }} // Added inline style for controlled height
          placeholder="Schreibe was nettes!"
          value={commentText}
          onChange={handleTextChange}
          onInput={(e) => { // Automatically adjust height based on content
            e.currentTarget.style.height = 'auto';
            e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px';
          }}
          required
        ></textarea>
        
        {!isCommentEmpty && (
          <button
            type="submit"
            className="absolute right-3 text-blue-500 hover:text-blue-700 font-semibold text-sm transition-colors duration-200"
          >
            Posten
          </button>
        )}
      </form>
    </div>
  );
};

export default CommentUnderPost;