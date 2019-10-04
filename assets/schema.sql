-- MySQL dump 10.13  Distrib 8.0.16, for macos10.14 (x86_64)
--
-- Host: 127.0.0.1    Database: employeeadmin
-- ------------------------------------------------------
-- Server version	5.7.27

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `department`
--

DROP TABLE IF EXISTS `department`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `department` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `department`
--

LOCK TABLES `department` WRITE;
/*!40000 ALTER TABLE `department` DISABLE KEYS */;
INSERT INTO `department` VALUES (1,'Accounting'),(2,'Sales'),(3,'Plant'),(4,'Shipping'),(5,'Quality Control');
/*!40000 ALTER TABLE `department` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee`
--

DROP TABLE IF EXISTS `employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `employee` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(45) DEFAULT NULL,
  `first` varchar(45) DEFAULT NULL,
  `last` varchar(45) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `department_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_username` (`username`),
  KEY `fk_department_idx` (`department_id`),
  CONSTRAINT `fk_employee_department_id` FOREIGN KEY (`department_id`) REFERENCES `department` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee`
--

LOCK TABLES `employee` WRITE;
/*!40000 ALTER TABLE `employee` DISABLE KEYS */;
INSERT INTO `employee` VALUES (1,'lstooge','Larry','Stooge','larry@stooges.com',1),(2,'cstooge','Curly','Stooge','curly@stooges.com',2),(3,'mstooge','Moe','Stooge','moe@stooges.com',3);
/*!40000 ALTER TABLE `employee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee_role`
--

DROP TABLE IF EXISTS `employee_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `employee_role` (
  `employee_id` int(10) unsigned NOT NULL,
  `role_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`employee_id`,`role_id`),
  KEY `fk_role_id_idx` (`role_id`),
  CONSTRAINT `fk_employee_role_role_id` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_employee_role_user_id` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee_role`
--

LOCK TABLES `employee_role` WRITE;
/*!40000 ALTER TABLE `employee_role` DISABLE KEYS */;
INSERT INTO `employee_role` VALUES (2,2),(2,3),(1,4),(2,5),(1,6),(3,7),(3,8),(3,9);
/*!40000 ALTER TABLE `employee_role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `role` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES (1,'Administrator'),(2,'Accounts Payable'),(3,'Accounts Receivable'),(4,'Employee Benefits'),(5,'General Ledger'),(6,'Payroll'),(7,'Inventory'),(8,'Production'),(9,'Quality Control'),(10,'Sales'),(11,'Orders'),(12,'Customers'),(13,'Shipping'),(14,'Returns');
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-10-04  3:15:55
