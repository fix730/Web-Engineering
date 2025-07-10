import axiosInstance from "../api/axiosInstance";

interface fetchProfileImageProps {
    onSetImageUrl: React.Dispatch<React.SetStateAction<string | undefined>>;
    imageId: number;
    profilePlaceholder: string | undefined;
}
// Funktion zum Abrufen des Profilbilds vom Backend
export async function fetchProfileImage({ onSetImageUrl, imageId, profilePlaceholder }: fetchProfileImageProps) {
    try {
        const response = await axiosInstance.get(`/api/image/${imageId}`, {
            responseType: 'blob' // um Binärdaten zu erhalten
        });
        if (response.status === 200) {
            const blob = response.data;
            const url = URL.createObjectURL(blob); // heruntergeladenes Bild (Blob) in eine temporäre URL um
            onSetImageUrl(url);
        } else {
            console.error("Fehler beim Laden des Bilds:", response.status, response.data);
            onSetImageUrl(profilePlaceholder); // Fallback auf Platzhalter bei Fehler
        }
    } catch (error: any) {
        console.error("Netzwerkfehler beim Laden des Bilds:", error.response?.data || error.message);
        onSetImageUrl(profilePlaceholder); // Fallback auf Platzhalter bei Netzwerkfehler
    }
};