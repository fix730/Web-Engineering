import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "./components/Header/Header";
import { SubmitButton } from "./components/Button";
import DialogAlert from "../Pop-Up-Window/alert";
import axiosInstance from "../api/axiosInstance";
import { AxiosError } from "axios";

function EditPost() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [locationName, setLocationName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [alertTitle, setAlertTitle] = useState("");
  const [alertText, setAlertText] = useState("");
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await axiosInstance.get(`/api/post/one?postId=${id}`);
        const data = (res.data.post ?? res.data) as any;
        setTitle(data.title);
        setDescription(data.description);
        setLocationName(data.locationName || "");
        if (data.start_time)
          setStartTime(new Date(data.start_time).toISOString().slice(0, 16));
        if (data.end_time)
          setEndTime(new Date(data.end_time).toISOString().slice(0, 16));
        if (data.imageUrl) setImageUrl(data.imageUrl);
      } catch (error: any) {
        let msg = "Kann den Post nicht laden.";
        if (error.isAxiosError && (error as AxiosError).response?.data) {
          const resp = (error as AxiosError).response!.data as any;
          if (typeof resp.message === "string") msg = resp.message;
        }
        setAlertTitle("Ladefehler");
        setAlertText(msg);
        setIsAlertOpen(true);
      }
    })();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !title || !description || !locationName || !startTime || !endTime) {
      setAlertTitle("Fehler");
      setAlertText("Bitte fülle alle Felder aus.");
      setIsAlertOpen(true);
      return;
    }
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("locationName", locationName);
      formData.append("start_time", new Date(startTime).toISOString());
      formData.append("end_time", new Date(endTime).toISOString());
      formData.append("postId", id);
      if (imageFile) formData.append("imagePost", imageFile);

      const res = await axiosInstance.patch(
        "/api/post",
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      if (res.status === 200) navigate("/myposts");
      else throw new Error(res.data?.message || "Update fehlgeschlagen");
    } catch (error: any) {
      let msg = "Update fehlgeschlagen.";
      if (error.isAxiosError && (error as AxiosError).response?.data) {
        const resp = (error as AxiosError).response!.data as any;
        if (typeof resp.message === "string") msg = resp.message;
      } else if (error instanceof Error) msg = error.message;
      setAlertTitle("Fehler");
      setAlertText(msg);
      setIsAlertOpen(true);
    }
  };

  return (
    <>
      <Header />
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md space-y-8">
          <h2 className="text-center text-3xl font-bold text-gray-700">Post bearbeiten</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xl font-medium text-gray-900">Titel</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="mt-1 w-full rounded-md border px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-xl font-medium text-gray-900">Beschreibung</label>
              <input
                type="text"
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="mt-1 w-full rounded-md border px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-xl font-medium text-gray-900">Ort</label>
              <input
                type="text"
                value={locationName}
                onChange={e => setLocationName(e.target.value)}
                className="mt-1 w-full rounded-md border px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-xl font-medium text-gray-900">Startzeit</label>
              <input
                type="datetime-local"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="mt-1 w-full rounded-md border px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-xl font-medium text-gray-900">Endzeit</label>
              <input
                type="datetime-local"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                className="mt-1 w-full rounded-md border px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-xl font-medium text-gray-900">Bild</label>
              <div
                onClick={() => document.getElementById("fileInput")?.click()}
                className="mt-1 w-full h-48 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer"
              >
                {imageUrl ? (
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-contain" />
                ) : (
                  <span className="text-4xl text-gray-400">+</span>
                )}
              </div>
              <input
                type="file"
                id="fileInput"
                accept="image/*"
                className="hidden"
                onChange={e => {
                  if (e.target.files && e.target.files[0]) {
                    setImageFile(e.target.files[0]);
                    setImageUrl(URL.createObjectURL(e.target.files[0]));
                  }
                }}
              />
            </div>
            <SubmitButton>Speichern</SubmitButton>
          </form>
        </div>
      </div>
      <DialogAlert
        open={isAlertOpen}
        isOpen={() => setIsAlertOpen(false)}
        header={alertTitle}
        content={alertText}
        buttonText="Schließen"
      />
    </>
  );
}

export default EditPost;
