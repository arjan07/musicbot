-- MySQL dump 10.13  Distrib 9.0.1, for macos15.0 (arm64)
--
-- Host: 127.0.0.1    Database: musicbot
-- ------------------------------------------------------
-- Server version	9.0.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Song`
--

DROP TABLE IF EXISTS `Song`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Song` (
                        `Id` int NOT NULL AUTO_INCREMENT,
                        `OfficialName` varchar(220) COLLATE utf8mb4_unicode_ci NOT NULL,
                        `ArtistName` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
                        `Path` varchar(220) COLLATE utf8mb4_unicode_ci NOT NULL,
                        `AutoPlay` tinyint(1) NOT NULL DEFAULT '1',
                        `CanQueue` tinyint(1) NOT NULL DEFAULT '1',
                        `PlayCount` int NOT NULL DEFAULT '0',
                        `AlbumName` varchar(220) COLLATE utf8mb4_unicode_ci NOT NULL,
                        `IsAlbum` tinyint(1) DEFAULT '0',
                        `TrackNumber` int DEFAULT '1',
                        `AlbumArtworkUrl` varchar(220) COLLATE utf8mb4_unicode_ci NOT NULL,
                        PRIMARY KEY (`Id`),
                        UNIQUE KEY `Song_pk` (`Path`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `SongGuildHistory`
--

DROP TABLE IF EXISTS `SongGuildHistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SongGuildHistory` (
                                    `Id` int NOT NULL AUTO_INCREMENT,
                                    `SongId` int NOT NULL,
                                    `GuildId` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
                                    `QueuedBy` varchar(400) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                                    `Date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                    PRIMARY KEY (`Id`),
                                    KEY `SongGuildHistory_Song_Id_fk` (`SongId`),
                                    CONSTRAINT `SongGuildHistory_Song_Id_fk` FOREIGN KEY (`SongId`) REFERENCES `Song` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=265 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `SongName`
--

DROP TABLE IF EXISTS `SongName`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SongName` (
                            `Id` int NOT NULL AUTO_INCREMENT,
                            `SongId` int NOT NULL,
                            `Name` varchar(220) COLLATE utf8mb4_unicode_ci NOT NULL,
                            PRIMARY KEY (`Id`),
                            UNIQUE KEY `SongName_pk` (`Name`),
                            KEY `SongName_Song_Id_fk` (`SongId`),
                            CONSTRAINT `SongName_Song_Id_fk` FOREIGN KEY (`SongId`) REFERENCES `Song` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `SongQueue`
--

DROP TABLE IF EXISTS `SongQueue`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SongQueue` (
                             `Id` int NOT NULL AUTO_INCREMENT,
                             `SongId` int NOT NULL,
                             `GuildId` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
                             `QueuedBy` varchar(400) COLLATE utf8mb4_unicode_ci NOT NULL,
                             PRIMARY KEY (`Id`),
                             KEY `SongQueue_Song_Id_fk` (`SongId`),
                             CONSTRAINT `SongQueue_Song_Id_fk` FOREIGN KEY (`SongId`) REFERENCES `Song` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `SongUserHistory`
--

DROP TABLE IF EXISTS `SongUserHistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SongUserHistory` (
                                   `Id` int NOT NULL AUTO_INCREMENT,
                                   `SongId` int NOT NULL,
                                   `UserId` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
                                   `Date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                   PRIMARY KEY (`Id`),
                                   KEY `SongUserHistory_Song_Id_fk` (`SongId`),
                                   CONSTRAINT `SongUserHistory_Song_Id_fk` FOREIGN KEY (`SongId`) REFERENCES `Song` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=170 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `TrustedRole`
--

DROP TABLE IF EXISTS `TrustedRole`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TrustedRole` (
                               `id` int NOT NULL AUTO_INCREMENT,
                               `GuildId` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
                               `RoleId` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
                               PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-10-19 21:25:01
