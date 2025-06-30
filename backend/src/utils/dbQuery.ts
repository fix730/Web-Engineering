import prisma from "../config/prisma";
import { Post, Location as PrismaLocation, comment, User } from '@prisma/client';
import bcrypt from 'bcryptjs';

type userExport = {
    name: string | null;
    image_idimage: number;
    iduser: number;
    firstName: string | null;
};

type PostExport = {
    locationName?: string | null;
    user?: userExport | null;
    idpost?: number;
    title?: string;
    description?: string;
    location_idlocation?: number;
    image_idimage?: number;
    user_iduser?: number;
    start_time?: Date;
    end_time?: Date;

};

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
    if (location != null) {
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

export const newPost = async (userId: number, locationName: string, title: string, description: string, imageData: Buffer, imageMimeType: string, imageName: string, start_time: Date, end_time: Date) => {
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
        const newPost = await prisma.post.create({
            data: {
                title: title,
                description: description,
                location_idlocation: locationId,
                image_idimage: newImage.idimage,
                user_iduser: userId,
                start_time: start_time,
                end_time: end_time
            }
        });
        return newPost;
    } catch (error) {
        console.error("Fehler bei neuen Post erstellen", error);
        throw new Error("Post konnte nicht erstellt werden.");
    }
}

export async function showPost(idPost: number): Promise<PostExport> {
    let post = await prisma.post.findFirst({
        where: {
            idpost: idPost
        }
    });
    const user = await prisma.user.findFirst({
        where: {
            iduser: post?.user_iduser
        },
        select: {
            iduser: true,
            name: true,
            firstName: true,
            image_idimage: true
        }
    });
    const location = await prisma.location.findFirst({
        where: {
            idlocation: post?.location_idlocation
        }
    });
    const postAll: PostExport = {
        ...post,
        title: post?.title ?? undefined,
        description: post?.description ?? undefined,
        locationName: location?.name,
        user: user,
        start_time: post?.start_time ?? undefined,
        end_time: post?.end_time ?? undefined
    }
    return postAll;
}

export async function showAllPosts(): Promise<any[]> {
    const posts = await prisma.post.findMany();
    const postsWithUserLocation = addPostNameAndLocation(posts);
    return postsWithUserLocation;
}

export async function showUserPosts(userId: number): Promise<any[]> {
    const posts = await prisma.post.findMany({
        where: {
            user_iduser: userId
        }
    });
    const postsWithUserLocation = addPostNameAndLocation(posts);
    // console.log(postsWithUserLocation);
    return postsWithUserLocation;
}

export async function showFilterPosts(locationId: number[], text: string): Promise<Post[]> {
    let posts;
    //Wenn keine Lokation dann nur nach Text Suchen
    if (locationId.length == 0) {
        posts = await findTitlePostsOrDescription(text);
    } else if (text.length == 0) {
        posts = await findLocationPosts(locationId);
    } else { // Wenn beides vorhanden ist muss es auch beides Beinhalten
        posts = await findLocationTextPosts(locationId, text);
    }
    const postsWithUserLocation = await addPostNameAndLocation(posts);
    return postsWithUserLocation;
}


async function findTitlePostsOrDescription(text: string): Promise<Post[]> {
    const posts = await prisma.post.findMany({
        where: {
            OR: [{
                title: { contains: text },
            },
            {
                description: { contains: text },
            }]
        }
    });
    return posts;
}

async function findDescriptionPosts(description: string): Promise<Post[]> {
    const posts = await prisma.post.findMany({
        where: {
            description: { contains: description }
        }
    });
    return posts;
}

async function findLocationPosts(locationId: number[]): Promise<Post[]> {
    const posts = await prisma.post.findMany({
        where: {
            location_idlocation: {
                in: locationId
            }
        }
    });
    return posts;
}

async function findLocationTextPosts(locationId: number[], text: string): Promise<Post[]> {
    const posts = await prisma.post.findMany({
        where: {
            location_idlocation: {
                in: locationId
            },
            OR: [
                { title: { contains: text } },
                { description: { contains: text } }
            ],
        }
    });
    return posts;
}

export async function addComment(postId: number, userId: number, text: string): Promise<comment> {
    //console.log(userId);
    const comment = await prisma.comment.create({
        data: {
            text: text,
            post_idpost: postId,
            user_iduser: userId,
            date: new Date(),
        }
    });
    return comment;

}

export async function getPostComment(postId: number): Promise<any[]> {
    const comments = await prisma.comment.findMany({
        where: {
            post_idpost: postId,
        },
        orderBy: {
            date: 'asc',
        },
    });

    //User-Daten dazuholen
    const userIds = [...new Set(comments.map(comment => comment.user_iduser))]; //Set entfernt duplikate, ...new macht daraus ein Array

    const users = await prisma.user.findMany({
        where: {
            iduser: { in: userIds },
        },
        select: {
            iduser: true,
            name: true,
            firstName: true,
            image_idimage: true,
        },
    });

    // Map bauen
    const userMap = Object.fromEntries(users.map(user => [user.iduser, user])); //Object.fromEntries Verwnadelt es in ein Objekt um effizient den User zu finden

    const commentsWithUser = comments.map(comment => ({
        ...comment, //... entfernt comment:
        user: userMap[comment.user_iduser] ?? null,
    }));

    return commentsWithUser;
}

async function addPostNameAndLocation(posts: Post[]): Promise<any[]> {
    const userIds = [...new Set(posts.map(post => post.user_iduser))];

    const users = await prisma.user.findMany({
        where: {
            iduser: { in: userIds }
        },
        select: {
            name: true,
            firstName: true,
            image_idimage: true,
            iduser: true,
        }
    });

    const locationIds = [...new Set(posts.map(post => post.location_idlocation))];

    const locations = await prisma.location.findMany({
        where: {
            idlocation: { in: locationIds }
        },
        select: {
            name: true,
            idlocation: true,
        }
    });

    const userMap = Object.fromEntries(users.map(user => [user.iduser, user]));
    const locationMap = Object.fromEntries(locations.map(location => [location.idlocation, location.name]));

    const postWithLocationAndName = posts.map(post => ({
        ...post,
        locationName: locationMap[post.location_idlocation],
        user: userMap[post.user_iduser]
    }));

    return postWithLocationAndName;
}

export async function addLikePost(idPost: number, idUser: number) {
    const newLike = await prisma.like.create({
        data: {
            post_idpost: idPost,
            user_iduser: idUser
        }
    });
    return newLike;
}

export async function deleteLikePost(idPost: number, idUser: number) {
    //Geht nicht einfacher weil sonst fehler Meldung, eigentlich ist durch idUser und idPost das Objekt einmalig
    const like = await prisma.like.findFirst({
        where: {
            user_iduser: idUser,
            post_idpost: idPost
        }
    });
    if (like) {
        await prisma.like.delete({
            where: {
                idlike_user_iduser_post_idpost: {
                    idlike: like.idlike,
                    user_iduser: like.user_iduser,
                    post_idpost: like.post_idpost
                }
            }
        });
    }
}

export async function getLikesByPostId(postId: number): Promise<number> {
    const likes = await prisma.like.count({
        where: {
            post_idpost: postId
        }
    });
    return likes;
}
export async function getLikesByUserIdPost(userId: number, postId: number): Promise<boolean> {
    const like = await prisma.like.findFirst({
        where: {
            user_iduser: userId,
            post_idpost: postId
        }
    });
    return like !== null; // Gibt true zurück, wenn ein Like gefunden wurde, sonst false  
}

export async function checkEMail(eMail: string): Promise<boolean> {
    const user = await prisma.user.findMany({
        where: {
            email: eMail
        }
    });
    if (user.length == 0) {
        return false;
    } else {
        return true;
    }
}

export async function updateEMail(eMail: string, userId: number): Promise<User> {
    const user = await prisma.user.update({
        where: {
            iduser: userId
        },
        data: {
            email: eMail
        }
    });
    return user;

}

export async function updatePasswort(password: string, userId: number): Promise<User> {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.update({
        where: {
            iduser: userId
        },
        data: {
            passwort: hashPassword
        }
    });
    return user;
}

export async function isPasswordValid(password: string, userId: number): Promise<boolean> {
    const user = await prisma.user.findFirst({
        where: {
            iduser: userId
        }
    });

    const isPasswordValid = await bcrypt.compare(password, user?.passwort || '');
    return isPasswordValid;
}

export async function updatePost(postId: number, locationName: string, title: string, description: string, imageId: number, start_time: Date | null, end_time: Date | null, imageData?: Buffer, imageMimeType?: string, imageName?: string) {
    if (imageData && imageMimeType && imageName) {
        await updateImageById(imageId, imageData, imageMimeType, imageName);
    }

    const locationId = await addLocation(locationName);
    const post = prisma.post.update({
        where: {
            idpost: postId
        },
        data: {
            location_idlocation: locationId,
            title: title,
            description: description,
            image_idimage: imageId,
            start_time,
            end_time
        }
    });
    return post;
}

export async function deletePost(postId: number) {
    try {
        const post = await showPost(postId);
        const likes = await prisma.like.findMany({
            where: {
                post_idpost: postId
            }
        });
        //Likes löschen wie anderst geht es nicht
        for (const like of likes) {
            await prisma.like.delete({
                where: {
                    idlike_user_iduser_post_idpost: {
                        idlike: like.idlike,
                        user_iduser: like.user_iduser,
                        post_idpost: like.post_idpost
                    }
                }
            });
        }
        const image = await prisma.image.delete({
            where: {
                idimage: post.image_idimage
            }
        })
        const an = await prisma.post.delete({
            where: {
                idpost: postId
            }
        });
    }catch (error){
        return error;
    }

    // console.log(an);
}

export async function showLikedUser(postId: number) {
    const posts = await prisma.like.findMany({
        where: {
            post_idpost: postId
        },
        select: {
            user_iduser: true
        }
    });
    const userIds = posts.map(post => (post.user_iduser));
    const users = await prisma.user.findMany({
        where: {
            iduser: { in: userIds },
        },
        select: {
            iduser: true,
            name: true,
            firstName: true,
            image_idimage: true
        }
    });
    return users;
}

export async function showUserLikedPosts(userId:number) {
    const likesUserPosts = await prisma.like.findMany({
        where:{
            user_iduser: userId
        },
        select:{
            post_idpost: true
        }
    });
    // Post Ids in die Liste Schreiben
    const postIds = likesUserPosts.map(likeUser => (likeUser.post_idpost));
    //Alle Post holen die der Benutzer geliked hat
    const posts = await prisma.post.findMany({
        where:{
            idpost: {in: postIds}
        }
    });
    const postsWithUserLocation = await addPostNameAndLocation(posts);
    return postsWithUserLocation;
}

