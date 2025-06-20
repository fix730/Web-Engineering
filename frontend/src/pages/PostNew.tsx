import { useState } from "react";
import { useAppDispatch } from "../hooks/redux-hooks";
import { register } from "../slices/authSlice";
import { useNavigate } from "react-router-dom";
import Header from "./components/Header/Header";
import { SubmitButton } from "./components/Button";

function PostNew() {

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [Description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState<File | null>(null);

  //reagiert auf das submit event des Formulars
  // backend muss noch erstellt werden

  const newPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title && Description && location && image) {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", Description);
      formData.append("location", location);
      formData.append("image", image);

    } else {
      alert("Bitte alle Felder ausfüllen.");
    }
  }

  return (
    <>
      <Header />
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="text-center text-3xl font-bold text-gray-700">Post erstellen</h2>
          </div>
          <form className="space-y-4" onSubmit={newPost}>
            <div>
              <label className="block text-xl font-medium text-gray-900">Titel</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 w-full rounded-md border px-4 py-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-xl font-medium text-gray-900">Beschreibung</label>
              <input
                type="text"
                value={Description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 w-full rounded-md border px-4 py-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-xl font-medium text-gray-900">Ort</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mt-1 w-full rounded-md border px-4 py-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />

              <div>
                <label className="block text-xl font-medium text-gray-700 mb-2">Bild</label>
                <div
                  onClick={() => document.getElementById("fileInput")?.click()}
                  className="w-full h-48 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:border-indigo-500 transition"
                >
                  {image ? (
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Preview"
                      className="w-full h-full object-contain rounded-md"

                    />
                  ) : (
                    <span className="text-4xl text-gray-400">+</span>
                  )}
                </div>
                <input
                  type="file"
                  id="fileInput"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setImage(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />
              </div>
            </div>
            <SubmitButton>Hochladen</SubmitButton>
          </form>

        </div>
      </div>
    </>
  );
}

export default PostNew;