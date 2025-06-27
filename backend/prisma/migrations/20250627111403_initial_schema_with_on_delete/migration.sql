-- CreateTable
CREATE TABLE `image` (
    `idimage` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(45) NULL,
    `image_data` LONGBLOB NULL,
    `type` VARCHAR(45) NULL,

    PRIMARY KEY (`idimage`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `iduser` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(45) NULL,
    `firstName` VARCHAR(45) NULL,
    `birthday` DATE NULL,
    `passwort` VARCHAR(255) NULL,
    `email` VARCHAR(100) NULL,
    `image_idimage` INTEGER NOT NULL,

    INDEX `fk_user_image1_idx`(`image_idimage`),
    PRIMARY KEY (`iduser`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `location` (
    `idlocation` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(45) NULL,

    PRIMARY KEY (`idlocation`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `post` (
    `idpost` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(45) NULL,
    `description` TEXT NULL,
    `location_idlocation` INTEGER NOT NULL,
    `image_idimage` INTEGER NOT NULL,
    `user_iduser` INTEGER NOT NULL,

    INDEX `fk_post_image1_idx`(`image_idimage`),
    INDEX `fk_post_location1_idx`(`location_idlocation`),
    INDEX `fk_post_user1_idx`(`user_iduser`),
    PRIMARY KEY (`idpost`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `like` (
    `idlike` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATE NULL,
    `user_iduser` INTEGER NOT NULL,
    `post_idpost` INTEGER NOT NULL,

    INDEX `fk_like_post1_idx`(`post_idpost`),
    INDEX `fk_like_user1_idx`(`user_iduser`),
    PRIMARY KEY (`idlike`, `user_iduser`, `post_idpost`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `comment` (
    `idcomment` INTEGER NOT NULL AUTO_INCREMENT,
    `text` TEXT NULL,
    `date` DATE NULL,
    `commentcol` VARCHAR(45) NULL,
    `user_iduser` INTEGER NOT NULL,
    `post_idpost` INTEGER NOT NULL,

    INDEX `fk_comment_post1_idx`(`post_idpost`),
    INDEX `fk_comment_user1_idx`(`user_iduser`),
    PRIMARY KEY (`idcomment`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
