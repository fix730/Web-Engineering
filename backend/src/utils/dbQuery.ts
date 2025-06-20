import prisma from "../config/prisma";

export async function addLocation(locationName:string){
    const location = await prisma.location.create({
        data:{
            name:locationName
        }
    });
}

export async function isLocationInDB(locationName: string): Promise<boolean> {
    const location = await prisma.location.findMany({
        where: {
            name: locationName
        }
    });
    if (location && location.length > 0) {
        return true;
    }
    return false;
}

export const updateImageById = async (
  imageId: number,
  imageData: Buffer,
  imageMimeType: string,
  imageName: string
) => {
  try {
    const updatedImage = await prisma.image.update({
      where: { idimage: imageId },
      data: {
        image_data: imageData,
        type: imageMimeType,
        name: imageName,
      },
    });
    return updatedImage;
  } catch (error) {
    console.error(`Fehler beim Aktualisieren des Bildes mit ID ${imageId}:`, error);
    throw new Error("Bild konnte nicht aktualisiert werden.");
  }
};


export const getProfileImageById = async (imageId: number) => {
  try {
    const image = await prisma.image.findUnique({
      where: { idimage: imageId },
      select: {
        image_data: true,
        type: true,
      },
    });
    if (image && image.image_data && image.type) {
      return { imageData: image.image_data, mimeType: image.type };
    }
    return null;
  } catch (error) {
    console.error(`Fehler beim Abrufen des Bildes mit ID ${imageId}:`, error);
    throw new Error("Bild konnte nicht abgerufen werden.");
  }
};