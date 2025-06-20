import { timeStamp } from "console";
import prisma from "../config/prisma";
import { Location as PrismaLocation } from '@prisma/client';



export async function addLocation(locationName: string): Promise<number> {
    const idLocation = await isLocationInDB(locationName);
    if (idLocation == -1) {
        const location = await prisma.location.create({
            data: {
                name: locationName
            }

        });
        return location.idlocation;
    }
    return idLocation;

}

async function isLocationInDB(locationName: string): Promise<number> {
    const location = await prisma.location.findFirst({
        where: {
            name: locationName
        }
    });
    if(location != null){
        return location.idlocation;
    }
    return -1;
}

export async function getAllLocation(): Promise<PrismaLocation[]> {
    const locations = await prisma.location.findMany({
        orderBy: {
            name: 'asc'
        }
    });

    return locations;
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


export const getImageById = async (imageId: number) => {
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

export const newPost = async (userId: number, locationName: string, title: string, description: string, imageData: Buffer, imageMimeType: string, imageName: string) => {
    try {
        const locationId = await addLocation(locationName);
        const newImage = await prisma.image.create({
            data: {
                image_data: null,
            },
            select: {
                idimage: true,
            }
        });
        await updateImageById(newImage.idimage, imageData, imageMimeType, imageName);
        await prisma.post.create({
            data: {
                title: title,
                description: description,
                location_idlocation: locationId,
                image_idimage: newImage.idimage,
                user_iduser: userId
            }
        });
    } catch (error) {
        console.error("Fehler bei neuen Post erstellen", error);
        throw new Error("Post konnte nicht erstellt werden.");
    }
}